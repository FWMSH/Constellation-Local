import serial
from python_telnet_vlc import VLCTelnet
import time
import urllib.request as urllib
import datetime
import subprocess
import objgraph
import psutil
import os
import configparser

def startSensor():

    print('Restarting sensor')
    sensor = serial.Serial('/dev/ttyUSB0', baudrate=57600, parity=serial.PARITY_NONE,
                           stopbits=serial.STOPBITS_ONE, bytesize=serial.EIGHTBITS) # Linux

    return(sensor)

def resetVideo(vlc):

    vlc.pause()
    time.sleep(0.1)
    vlc.seek(0)
    time.sleep(0.1)
    vlc.frame()

def startVLC():

    # Launch an instance of VLC as a separate thread

    subprocess.Popen(['vlc', '-I', 'telnet', '--telnet-password','test'], close_fds=True)

def sendHeartbeat(type=1):

    # Function to send a heartbeat to the heartbeat server

    global _heartbeat_ip
    global _ID
    global _project

    try:
        #print('Sending heartbeat... ', end='')
        date = '{0:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
        msg = bytes('date='+date+'&project='+_project+'&id='+_ID+'&action=heartbeat-'+str(type), 'UTF-8')
        req = urllib.Request(_heartbeat_ip, msg)
        resp = urllib.urlopen(req, timeout=1)
        command = str(resp.read(), 'UTF-8')
        if command != "":
            handleCommand(command)
        #print('done')
    except:
        #print('failed.')
        pass

def handleCommand(cmd):

    # Respond to a command delivered by the heartbeat server

    if cmd == "restart":
        os.system("reboot")

def trackAnalytics(action):

    # Send a packet to the analytics server reporting an action

    global _analytics_ip
    global _ID
    global _project

    try:
        #print('Sending analytics... ('+ action +') ', end='')
        date = '{0:%Y-%m-%d %H:%M:%S}'.format(datetime.datetime.now())
        msg = bytes('date='+date+'&project='+_project+'&id='+_ID+'&action='+action, 'UTF-8')
        req = urllib.Request(_analytics_ip, msg)
        resp = urllib.urlopen(req, timeout=1)
        #print('done')
    except:
        #print('failed.')
        pass

# _heartbeat_ip = 'http://10.8.0.168:8081' # Heartbeat server
# _analytics_ip = 'http://10.8.0.168:8080' # Analytics server
# _ID = 'VS-OBS1'
# _project = 'project_planet'

# Get the directory containing this file (and thus also the config)
_path = os.path.dirname(os.path.realpath(__file__))

# Read the config.ini file
config = configparser.ConfigParser()
config.read(os.path.join(_path, "config.ini"))
defaults = config["DEFAULT"]
if len(defaults) == 0:
    print("Error: missing config.ini file")

_heartbeat_ip = defaults.get("HeartbeatIP", "http://10.8.0.168:8081")
_analytics_ip = defaults.get("AnalyticsIP", "http://10.8.0.168:8080")
_ID = defaults.get("ID", "ID_MISSING")
_project = defaults.get("Project", "project_missing")
_video = defaults.get("Video", "video.mp4")
_loadDuration = float(defaults.get("loadDuration", 5)) # The number of seconds to "load" the video (bail out immediately during this window)
_resetThresh = float(defaults.get("resetAfter", 10)) # How long to wait to reset after person walks away
_triggerDist = float(defaults.get("triggerDist", 60)) # distance in inches that counts as "present". Max is 125

reboot_date = (datetime.datetime.now() + datetime.timedelta(days=1)).replace(hour=9, minute=0, second=0)
print("This system will reboot next on: ", reboot_date)

sensor = startSensor()

try:
    vlc= VLCTelnet("localhost", "test", 4212)
except:
    startVLC()
    time.sleep(1)
    vlc= VLCTelnet("localhost", "test", 4212)

vlc.clear()
vlc.add(os.path.join(_path, _video))
vlc.play()
time.sleep(2)
vlc.fullscreen(switch=False)

file_len = int(vlc.get_length()) #in seconds

state = 'playing' # [idle, loading, playing]
ref_time = time.time()
last_heartbeat = time.time()

while True:
    # Check if it is time to reboot
    if abs((reboot_date - datetime.datetime.now()).total_seconds()) < 10:
        print("REBOOTING NOW")
        subprocess.Popen(["reboot"])

    try:
        video_time = int(vlc.get_time())
    except ValueError:
        video_time = 0
    if video_time == file_len-5: # If we're in the last second of the file
        resetVideo(vlc)
        state = 'idle'
        trackAnalytics("video_ended")
    res = str(sensor.read(8), encoding='ascii')
    if res[6] == ' ': # Making sure we're reading the data correctly. This should be 0 or 1
        sensor.close()
        sensor = startSensor()
    else:
        now = time.time()
        try:
            dist = int(res[1:4])
        except:
            dist = 125
        if state == 'playing':
            if (dist < _triggerDist):
                ref_time = now
            elif (now - ref_time) > _resetThresh:
                resetVideo(vlc)
                state = 'idle'
                trackAnalytics("idle")
        elif state == 'loading':
            if (dist >= _triggerDist):
                resetVideo(vlc)
                state = 'idle'
            elif (now - ref_time) > _loadDuration:
                state = 'playing'
                trackAnalytics("play")
        elif state == 'idle':
            if (dist < _triggerDist):
                ref_time = now
                state = 'loading'
                vlc.play()

        # Send a heartbeat every 10 seconds
        if (now - last_heartbeat) > 10:
            if (state == 'playing') or (state == 'loading'):
                sendHeartbeat(type=2)
            else:
                sendHeartbeat(type=1)
            last_heartbeat = now

            print('--------------------------------------')
            print(datetime.datetime.now())
            print('State: ', state)
            print('Distance: ', dist)
            objgraph.show_growth(limit=5)
            print('CPU usage: ', psutil.cpu_percent())
            mem = psutil.virtual_memory()
            print('Memory usage: ', mem.used/1024/1024, 'MB')

            vlc.fullscreen(switch=False)

sensor.close()
