from kivy.config import Config
Config.set('graphics', 'fullscreen','auto')
#Config.set('kivy', 'keyboard_mode', 'systemandmulti')

from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen, FadeTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.slider import Slider
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.clock import Clock
from kivy.garden.matplotlib.backend_kivyagg import FigureCanvasKivyAgg

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.font_manager as fm
from matplotlib.figure import Figure
#import matplotlib.ticker as ticker
import serial
import pandas as pd
from pandas.plotting import register_matplotlib_converters
import numpy as np
import seaborn as sb
from functools import partial
from datetime import datetime
import pickle
import time
import psutil
import objgraph
import urllib.request as urllib
import os

# Set up some plotting parameters
register_matplotlib_converters()
sb.set_context('poster')
sb.set_style('darkgrid', rc={
        'axes.facecolor': 'black',
        'figure.facecolor': 'black',
        'axes.labelcolor': '.9',
        'axes.edgecolor': '.6',
        'xtick.color': '.6',
        'ytick.color': '.6',
        'grid.color': '.6',
        'axes.spines.left': False,
        'axes.spines.right': False,
        'axes.spines.top': False,
        'axes.spines.bottom': False
})

class DisplayScreen(Screen):

    def dump_logs(self, *args):

        # Function to write logs to disk as a pickle file

        pickle.dump(self.app.manager.log, open('/home/pi/co2_meter/log.pickle', 'wb'))
        pickle.dump(self.app.manager.time_log, open('/home/pi/co2_meter/time_log.pickle', 'wb'))


    def read_sensor(self, *args):

        # Function to poll the sensor for new data and

         self.app.manager.sensor.write(b'Z\r\n')
         res = str(self.app.manager.sensor.readline(), encoding='UTF-8')
         level = int(res[3:8]) # ppm
         self.app.manager.log.append(level)
         self.app.manager.time_log.append(datetime.now())

         n_points = len(self.app.manager.log)

         # Need to trim the log every couple of weeks to keep running times
         # acceptable
         #if n_points > 1e6:
         #    log = log[-700000:]
         #    n_points = 700000

         #self.smooth_slider.max = 0.1*n_points

         self.df.drop(self.df.index, inplace=True)
         self.df['Date'] = self.app.manager.time_log
         self.df['Level'] = self.app.manager.log

         # if not self.block:
         #     self.update_plot()

    def update_plot(self, *args):

         # Function to rebuild the graph

        t1 = time.time()

        df = self.df

        #plt.clf()
        self.ax_hour.clear()
        self.ax_day.clear()
        self.ax_week.clear()

        self.ax_hour.xaxis.set_major_formatter(mdates.DateFormatter('%-I:%M %p'))
        self.ax_day.xaxis.set_major_formatter(mdates.DateFormatter('%-I:%M %p'))
        self.ax_week.xaxis.set_major_formatter(mdates.DateFormatter('%h %-d'))

        max_date = df['Date'].values[-1]
        max_date_ts = pd.Timestamp(max_date)

        # Hour
        min_date_hour = max_date - self.Hour
        df_hour = df[df['Date']> min_date_hour]
        date_range = pd.date_range(max_date_ts.round('15 min')-self.Hour, max_date_ts.round('15 min'), 5)

        sm = df_hour.set_index('Date').rolling(10).mean().reset_index()

        self.ax_hour.plot(sm['Date'], sm['Level'], color='yellow', linewidth=2)

        self.ax_hour.set_xticks(mdates.date2num(date_range))

        # Day
        min_date_day = max_date - self.Day
        df_day = df[df['Date']> min_date_day]
        date_range = pd.date_range(max_date_ts.round('h')-self.Day, max_date_ts.round('h'), 5)

        sm = df_day.set_index('Date').rolling(200).mean().reset_index()

        sm_last_hour = sm[sm['Date'] >= min_date_hour]
        sm_earlier = sm[sm['Date'] < min_date_hour]

        self.ax_day.plot(sm_last_hour['Date'], sm_last_hour['Level'], color='yellow', linewidth=2)
        self.ax_day.plot(sm_earlier['Date'], sm_earlier['Level'], color='blue', linewidth=2)

        self.ax_day.set_xticks(mdates.date2num(date_range))

        # Week
        min_date_week = max_date - self.Week
        df_week = df[df['Date']> min_date_week]
        date_range = pd.date_range(max_date_ts.round('D')-self.Week, max_date_ts.round('D'))

        sm = df_week.set_index('Date').rolling(350).mean().reset_index()

        sm_last_hour = sm[sm['Date'] >= min_date_hour]
        sm_last_day = sm[(sm['Date'] >= min_date_day) & (sm['Date'] < min_date_hour)]
        sm_earlier = sm[sm['Date'] < min_date_day]

        self.ax_week.plot(sm_last_hour['Date'], sm_last_hour['Level'], color='yellow', linewidth=2)
        self.ax_week.plot(sm_last_day['Date'], sm_last_day['Level'], color='blue', linewidth=2)
        self.ax_week.plot(sm_earlier['Date'], sm_earlier['Level'], color='purple', linewidth=2)

        self.ax_week.set_xticks(mdates.date2num(date_range))

        self.figure.tight_layout()

        self.plot.draw()

        self.performance_log.append(time.time()-t1)

    def check_memory(self, *args):

        python_mem = psutil.Process().memory_info().rss/1e6
        df_mem = self.df.memory_usage(deep=True).sum()/1e6

        print('Memory usage: ' + str(python_mem) + ' MB')
        print('DataFrame memory: ' + str(df_mem) + ' MB')
        print(objgraph.show_growth(limit=5))

    def __init__(self,  *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.performance_log = list()

        self.app = App.get_running_app()

        self.df = pd.DataFrame() # Will hold our data for plotting.

        self.range_size = pd.Timedelta('7 day')
        self.Hour = pd.Timedelta('1 hour')
        self.Day = pd.Timedelta('1 day')
        self.Week = pd.Timedelta('4 day')

        #self.figure = plt.figure()
        self.figure = Figure()

        self.ax_hour = self.figure.add_subplot(311)
        self.ax_hour.xaxis_date()
        self.ax_hour.xaxis.set_major_formatter(mdates.DateFormatter('%-I:%M %p'))

        self.ax_day = self.figure.add_subplot(312)
        self.ax_day.xaxis_date()
        self.ax_day.xaxis.set_major_formatter(mdates.DateFormatter('%-I:%M %p'))

        self.ax_week = self.figure.add_subplot(313)
        self.ax_week.xaxis_date()
        self.ax_week.xaxis.set_major_formatter(mdates.DateFormatter('%h %-d'))

        self.layout = BoxLayout(orientation='horizontal')
        label = Image(source='label.PNG', size_hint=(0.4,1))
        self.plot = FigureCanvasKivyAgg(self.figure, size_hint=(0.6, 1))

        self.layout.add_widget(label)
        self.layout.add_widget(self.plot)

        self.add_widget(self.layout)

        # Fonts
        self.GBook40 = fm.FontProperties(fname='Gotham-Book.otf', size=20)

        Clock.schedule_interval(self.update_plot, 10)
        Clock.schedule_interval(self.check_memory, 60)


class ScreenManagement(ScreenManager):

    def sendHeartbeat(self, *args, type=1):

        # Function to send a heartbeat to the heartbeat server

        try:
            print('Sending heartbeat... ', end='')
            date = '{0:%Y-%m-%d %H:%M:%S}'.format(datetime.now())
            msg = bytes('date='+date+'&project='+self.project+'&id='+self.ID+'&action=heartbeat-'+str(type), 'UTF-8')
            req = urllib.Request(self.heartbeat_ip, msg)
            resp = urllib.urlopen(req)
            command = str(resp.read(), 'UTF-8')
            if command != "":
                self.handleCommand(command)
            print('done')
        except:
            print('failed.')

    def handleCommand(self, cmd):

        # Respond to a command delivered by the heartbeat server

        if cmd == "restart":
            os.system("reboot")

    def check_for_idle(self, *args):

        if self.current == 'display':
            self.ticks_idle += 1
            if self.ticks_idle > 60:
                self.goto('attractor')

    def goto(self, screen, *args):

        if screen == 'display':
            self.display.update_plot()
            self.current = 'display'
            self.ticks_idle = 0
        elif screen == 'attractor':
            self.current = 'attractor'

    def close(self, *args, **kwargs):

        # Function to close the app. Used to restart the app at midnight every night

        print('Stopping app. Watchdog should restart it...')
        App.get_running_app().stop()

    def __init__(self, *args, **kwargs):
        super(ScreenManagement, self).__init__(*args, **kwargs)

        # Analytics setup
        self.heartbeat_ip = 'http://10.8.0.168:8081' # Heartbeat server
        self.analytics_ip = 'http://10.8.0.168:8080' # Analytics server
        self.ID = 'CO2_DISP'
        self.project = 'project_planet'

        #self.sensor = serial.Serial('/dev/cu.usbserial-AK06VC8L')  # Mac
        self.sensor = serial.Serial('/dev/ttyUSB0') # Linux
        self.polling_interval = 1 # seconds

        try:
            self.log = pickle.load(open('/home/pi/co2_meter/log.pickle', 'rb'))
            self.time_log = pickle.load(open('/home/pi/co2_meter/time_log.pickle', 'rb'))
        except:
            self.log = list()
            self.time_log = list()

        self.display = DisplayScreen(name='display')
        self.add_widget(self.display)

        Clock.schedule_interval(self.display.read_sensor, self.polling_interval)
        Clock.schedule_interval(self.display.dump_logs, 60)
        Clock.schedule_interval(self.sendHeartbeat, 10)

        # Schedule the app to close at midnight. Watchdog will restart it.
        now = datetime.now()
        midnight_in_sec = round((now.replace(hour=23,minute=59,second=59,microsecond=0)-now).total_seconds())
        Clock.schedule_once(self.close, midnight_in_sec)

class MainApp(App):

    def build(self):
        self.manager = ScreenManagement(transition=FadeTransition(duration=.5))
        self.manager.display.read_sensor()
        self.manager.display.update_plot()
        return(self.manager)

    def on_stop(self, *args):
        self.manager.sensor.close()
        self.manager.display.dump_logs()
        print('Median plot time: ' + str(np.round(np.median(self.manager.display.performance_log), 2)) + ' seconds')
        return True

# Start the app
MainApp().run()
