from kivy.config import Config
Config.set('graphics', 'fullscreen','auto')
#Config.set('graphics', 'borderless',1)
#Config.set('graphics', 'width', 1920)
#Config.set('graphics', 'height', 1080)
#Config.set('graphics', 'position', 'custom')
#Config.set('graphics', 'left', 500)
#Config.set('graphics', 'top', 0)



from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen, FadeTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.clock import Clock
from kivy.graphics import Color, Rectangle

import update_wordcloud as wc
from threading import Thread
import urllib.request as urllib
from datetime import datetime
import os


class DisplayScreen(Screen):

    # Screen for displaying the word cloud image

    def refresh_image(self, *args):

        # Function to reload the image from disk

        self.image.reload()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.padding = Label(size_hint=(1,0.185))
        self.label = Label(size_hint=(1,0.1),
                            text='This Year, I Am Thankful For...',
                            halign='center',
                            font_name='Gotham-Bold.otf',
                            font_size=100)
        self.image = Image(source='wordcloud.png',
                            size_hint=(1,0.715),
                            nocache=True,
                            allow_stretch=True)
        self.call_to_action = Label(size_hint=(0.25,0.1),
                                    pos_hint={'right': .95, 'top': .95},
                                    text='Add Your Answer Here >>',
                                    font_name='Gotham-Book.otf',
                                    font_size=50)

        self.layout = BoxLayout(orientation='vertical')
        self.layout.add_widget(self.padding)
        self.layout.add_widget(self.label)
        self.layout.add_widget(self.image)
        
        self.top_layout = FloatLayout()
        self.top_layout.add_widget(self.layout)
        self.top_layout.add_widget(self.call_to_action)

        self.add_widget(self.top_layout)


class ScreenManagement(ScreenManager):

    def update(self, *args):

        # Function to generate a new wordcloud and then flip flop the screens
        # to fade it in
        
        # Try to download the latest data from the analytics server.
        os.system("scp analytics:~/shared_data/" + self._project + "/" + self._source + "_response_list.txt /home/pi/word_cloud/response_list.txt")
        os.system("scp analytics:~/shared_data/" + self._project + "/" + self._source + "_latest_response.txt /home/pi/word_cloud/latest+response.txt")


        wc.create_wordcloud(width=1920,height=858)

        if self.current == 'image1':
            self.image2.refresh_image()
            self.current = 'image2'
        else:
            self.image1.refresh_image()
            self.current = 'image1'

    def send_heartbeat(self, *args, type=1):
    
        Thread(target=self._send_heartbeat, args=(type,)).start()
    
    def _send_heartbeat(self, type):
        
        # Function to send a heartbeat to the heartbeat server
        
        try:
            print('Sending heartbeat... ', end='')
            date = '{0:%Y-%m-%d %H:%M:%S}'.format(datetime.now())
            msg = bytes('date='+date+'&project='+self._project+'&id='+self._ID+'&action=heartbeat-'+str(type), 'UTF-8')
            req = urllib.Request(self._heartbeat_ip, msg)
            resp = urllib.urlopen(req, timeout=3)
            print('done')
        except Exception as e:
            print(e)
            
    
    def __init__(self, *args, **kwargs):
        super(ScreenManagement, self).__init__(*args, **kwargs)
        
        self._heartbeat_ip = 'http://10.8.0.168:8081' # Heartbeat server
        self._analytics_ip = 'http://10.8.0.168:8080' # Analytics server
        self._ID = 'WC_LFT_OUT'
        self._source = "WC_LFT_IN" # This is the ID of the app where the data is coming from
        self._project = 'project_planet'

        self.image1 = DisplayScreen(name='image1')
        self.image2 = DisplayScreen(name='image2')

        self.add_widget(self.image1)
        self.add_widget(self.image2)

        Clock.schedule_interval(self.send_heartbeat, 10)
        Clock.schedule_interval(self.update, 15)

class MainApp(App):

    def build(self):
        self.manager = ScreenManagement(transition=FadeTransition(duration=1))
        return(self.manager)

# Start the app
MainApp().run()
