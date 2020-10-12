import time
import urllib.request as urllib
import datetime
import os


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

_heartbeat_ip = 'http://10.8.0.168:8081' # Heartbeat server
_analytics_ip = 'http://10.8.0.168:8080' # Analytics server
_ID = 'VS-VDROME'
_project = 'v-drome'

while True:
    sendHeartbeat(type=1)
    time.sleep(10)








pass
