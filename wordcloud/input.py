from kivy.config import Config
Config.set('graphics', 'fullscreen','auto')
#Config.set('graphics', 'height','1080')
#Config.set('graphics', 'width','1920')
#Config.set('graphics', 'position','custom')
#Config.set('graphics', 'left','1920')
Config.set('kivy', 'keyboard_mode', 'system')

from kivy.app import App
from kivy.core.window import Window
from kivy.uix.screenmanager import ScreenManager, Screen, FadeTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.image import Image
from kivy.uix.popup import Popup
from kivy.clock import Clock
from kivy.graphics import Color, Rectangle
#from kivy.uix.vkeyboard import VKeyboard

import time
import string
from profanityfilter import ProfanityFilter
from threading import Thread
import urllib.request as urllib
from datetime import datetime
import os

# class MyKeyboard(VKeyboard):
# 
#     def place(self):
#         self.size_hint = (0.7,0.3)

class InputScreen(Screen):
    
    def on_enter(self, *args, **kwargs):
        
        super().on_enter(*args, **kwargs)
        
        self.text_input.focus = True

    def on_touch_up(self, *args, **kwargs):

        super().on_touch_up(*args, **kwargs)
        self.parent.ticks_idle = 0
        #self.parent.send_heartbeat(type=2)
        
    def eliminate_recent_words(self, phrase):
    
        # Function that returns all the words that haven't been
        # entered recently from the given phrase.
        
        time_thresh = 300 # Seconds
        to_return = ''
        
        words = phrase.split()
        for word in words:
            okay = True
            # Lowercase everything and strip punctuation
            word = word.lower().translate(str.maketrans('', '', string.punctuation))
            
            if word in self.recent_words:
                if time.time() - self.recent_words[word] < time_thresh:
                    okay = False
            
            if okay:
                self.recent_words[word] = time.time()
                to_return += word + ' '
        
        return(to_return)

    def submit_entry(self, *args):

        # Function to handle the submission of a new response

        self.text_input.focus = False
        self.popup = Popup(size_hint=(0.55,0.25),
                    title='',
                    title_size=0,
                    separator_height=0,
                    content=Label(text='Thanks for adding your response!\nLook up to see the most\npopular responses.',
                                    font_size=48, font_name='Gotham-Bold.otf', halign='center'))
        self.popup.open()
        Clock.schedule_once(self.popup.dismiss, 10)

        if self.text_input.text != '':
            
            # One last profanity filter
            self.text_input.text = self.pfilter.censor(self.text_input.text)
        
            # Store separately to force into word cloud
            with open('latest_response.txt', 'w') as f:
                f.write(self.text_input.text)
    
            # Append to the overall list
            with open('response_list.txt', 'a') as f:
                f.write(self.eliminate_recent_words(self.text_input.text)+'\n')
                
            self.text_input.text = ''
            
            # Copy the updated lists to the analytics server
            os.system("scp /home/pi/word_cloud/response_list.txt analytics:~/shared_data/" + self.parent._project + "/" + self.parent._ID + "_response_list.txt")
            os.system("scp /home/pi/word_cloud/latest_response.txt analytics:~/shared_data/" + self.parent._project + "/" + self.parent._ID + "_latest_response.txt")

            
        self.parent.send_analytics('entry','submit')
        self.parent.send_heartbeat(type=2)

    def text_filter(self, str_in, is_undo):
              
        # Filter for profanity every word
        if str_in == ' ':
            split = self.text_input.text.split(' ')
            split[-1] = self.pfilter.censor(split[-1])
            self.text_input.text = ' '.join(split).lstrip()
        self.manager.ticks_idle = 0
        return(str_in)

    def draw_background(self, *args, **kwargs):

        # Set background color
        with self.canvas.before:
            Color(rgb=(0,47/255,101/255))  # rgba might be better
            Rectangle(size=self.size, pos=self.pos)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Set background color
        self.bind(size=self.draw_background)
        self.bind(pos=self.draw_background)

        # Set up some variables for use when choosing colors for the wordcloud
        self.large_i = 0
        self.medium_i = 0
        self.small_i = 0
        
        # Dictionary to hold list of recently-used words
        self.recent_words = {}

        self.pfilter = ProfanityFilter(extra_censor_list=['hell','pussy', 'nigger',
        'jew', 'penis', 'vagina', 'boob', 'piss', 'pissing', 'crap', 'nigga', 'dick', 'goddamn'])
        self.pfilter.set_censor('')
        
        master_layout = FloatLayout()

        self.add_widget(master_layout)

        self.prompt_label = Label(pos_hint={'center_x': 0.5, 'center_y': 0.7},
                                  text="What Are You Thankful\nFor This Year?",
                                  halign='center',
                                  font_name='Gotham-Bold.otf',
                                  font_size=100)

        self.subprompt = Label(pos_hint={'center_x': 0.26, 'center_y': 0.42},
                                text="I am thankful for...",
                                halign='center',
                                font_name='Gotham-Bold.otf',
                                font_size=70)

        master_layout.add_widget(self.prompt_label)
        master_layout.add_widget(self.subprompt)

        self.text_input = TextInput(hint_text='Touch here to type response',
                                      font_name='Gotham-Book.otf',
                                      font_size=60,
                                      pos_hint={'x': 0.2, 'center_y': 0.35},
                                      size_hint=(0.5,0.07),
                                      input_filter=self.text_filter,
                                      multiline=False)
        self.submit_button = Button(text='Submit',
                                    pos_hint={'x': 0.7, 'center_y': 0.35},
                                    size_hint=(0.1, 0.07),
                                    font_name='Gotham-Book.otf',
                                    font_size=40,
                                    on_release=self.submit_entry)
        self.text_input.bind(on_text_validate=self.submit_entry)
        master_layout.add_widget(self.text_input)
        master_layout.add_widget(self.submit_button)



class AttractorScreen(Screen):

    # Screen to draw the attention of the guest

    def on_touch_up(self, *args, **kwargs):

        super().on_touch_up(*args, **kwargs)

        self.parent.goto_screen('input')

    def draw_background(self, *args, **kwargs):

        # Set background color
        with self.canvas.before:
            Color(rgb=(0,47/255,101/255))  # rgba might be better
            Rectangle(size=self.size, pos=self.pos)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Set background color
        self.bind(size=self.draw_background)
        self.bind(pos=self.draw_background)

        master_layout = FloatLayout()

        self.add_widget(master_layout)

        self.prompt_label = Label(pos_hint={'center_x': 0.5, 'center_y': 0.7},
                                  text="What Are You Thankful\nFor This Year?",
                                  halign='center',
                                  font_name='Gotham-Bold.otf',
                                  font_size=100)

        self.action_call = Label(pos_hint={'center_x': 0.5, 'center_y': 0.3},
                                  text="Touch here to add your response!",
                                  halign='center',
                                  font_name='Gotham-Book.otf',
                                  font_size=72)

        master_layout.add_widget(self.prompt_label)
        master_layout.add_widget(self.action_call)

class ScreenManagement(ScreenManager):

    ticks_idle = 0
    
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
    
    def send_analytics(self, target, action, *args):
    
        Thread(target=self._send_analytics, args=(target, action)).start()
    
    def _send_analytics(self, target, action):
    
        # Function to send data to the analytics server. Should
        # be called from a separate thread.
        
        try:
            print('Sending analytics... ('+ target + ': ' + action +') ', end='')
            date = '{0:%Y-%m-%d %H:%M:%S}'.format(datetime.now())
            msg = bytes('date='+date+'&project='+self._project+'&id='+self._ID+'&action='+action+'&target='+target, 'UTF-8')
            req = urllib.Request(self._analytics_ip, msg)
            resp = urllib.urlopen(req, timeout=10)
            print('done')
        except Exception as e:
            print(e)

    def check_for_idle(self, dt):

        # Function to return to the attractor after a short while of no use

        self.ticks_idle += 1

        if (self.ticks_idle > 30) and (self.current == 'input'):
            self.input_screen.text_input.focus = False
            self.goto_screen('attractor')
            self.input_screen.text_input.text = ''


    def goto_screen(self, name):

        self.ticks_idle = 0
        self.send_analytics(name,'goto')
        if (name == 'input'):
            self.send_heartbeat(type=2)
        
        self.current = name

    def __init__(self, *args, **kwargs):
        super(ScreenManagement, self).__init__(*args, **kwargs)
        
        self._heartbeat_ip = 'http://10.8.0.168:8081' # Heartbeat server
        self._analytics_ip = 'http://10.8.0.168:8080' # Analytics server
        self._ID = 'WC_LFT_IN'
        self._project = 'project_planet'

        self.input_screen = InputScreen(name='input')
        self.attractor_screen = AttractorScreen(name='attractor')

        self.add_widget(self.attractor_screen)
        self.add_widget(self.input_screen)

        Clock.schedule_interval(self.check_for_idle, 1)
        Clock.schedule_interval(self.send_heartbeat, 10)

class MainApp(App):

    def build(self):
        self.manager = ScreenManagement(transition=FadeTransition(duration=0.2))
        return(self.manager)

#     def get_keyboard(self, **kwargs):
#         kb = MyKeyboard()
#         kb.place()
#         return kb

# Start the app
app = MainApp()
#Window.set_vkeyboard_class(app.get_keyboard)
app.run()






pass
