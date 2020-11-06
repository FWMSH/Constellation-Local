from os import system, path
from configparser import ConfigParser
import urllib.request as urllib
from time import sleep
from datetime import datetime

def handleCommand(cmd):

    # Respond to a command delivered by the heartbeat server

    if cmd == "restart":
        system("reboot")

def sendHeartbeat(heartbeat_ip, ID, project, type=3):

    # Function to send a heartbeat to the heartbeat server

    #try:
    print('Sending heartbeat... ', end='')
    date = '{0:%Y-%m-%d %H:%M:%S}'.format(datetime.now())
    msg = bytes('date='+date+'&project='+project+'&id='+ID+'&action=heartbeat-'+str(type), 'UTF-8')
    req = urllib.Request(heartbeat_ip, msg)
    resp = urllib.urlopen(req, timeout=1)
    command = str(resp.read(), 'UTF-8')
    if command != "":
        handleCommand(command)
    #except:
     #   pass

def loadSettings():

    # Read the network_control_settings.ini file

    # Get the directory containing this file (and thus also the config)
    _path = path.dirname(path.realpath(__file__))

    config = ConfigParser()
    config.read(path.join(_path, "network_control_settings.ini"))
    defaults = config["DEFAULT"]
    if len(defaults) == 0:
        print("Error: missing network_control_settings.ini file")

    heartbeat_ip = defaults.get("HeartbeatIP", "http://10.8.0.168:8081")
    analytics_ip = defaults.get("AnalyticsIP", "http://10.8.0.168:8080")
    ID = defaults.get("ID", "ID_MISSING")
    project = defaults.get("Project", "project_missing")

    return(heartbeat_ip, analytics_ip, ID, project)

heartbeat_ip, analytics_ip, ID, project = loadSettings()

while True:
    sendHeartbeat(heartbeat_ip, ID, project)
    sleep(10) # seconds










pass
