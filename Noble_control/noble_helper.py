import audio_control
import projector_control
import iPlayer3_control
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import signal
import sys
import mimetypes
import cgi
import socket
import subprocess
import time

class RequestHandler(SimpleHTTPRequestHandler):

    def log_request(code='-', size='-'):

        # Override to suppress the automatic logging

        pass

    def do_GET(self):

        # Receive a GET request and respond with a console webpage
        print("do_GET: ENTER")
        print("  ", self.path)
        # Open the file requested and send it
        mimetype = mimetypes.guess_type(self.path, strict=False)[0]
        #print(f"  Handling {mimetype}")
        try:
            #print(f"  Opening file {self.path}")
            f = open(self.path[1:], 'rb')
            #print(f"    File opened")
            self.send_response(200)
            self.send_header('Content-type', mimetype)
            self.end_headers()
            #print(f"    Writing data to client")
            self.wfile.write(f.read())
            #print(f"    Write complete")
            f.close()
            #print(f"  File closed")
            print("do_GET: EXIT")
            return
        except IOError:
            self.send_error(404, "File Not Found: %s" % self.path)
            #logging.error(f"GET for unexpected file {self.path}")
        print("do_GET: EXIT")

    def do_OPTIONS(self):
        # print("do_OPTIONS: ENTER")
        self.send_response(200, "OK")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()
        # print("do_OPTIONS: EXIT")

    def do_POST(self):

        # Receives pings from client devices and respond with any updated
        # information
        # print("do_POST: ENTER")

        self.send_response(200, "OK")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()

        # Get the data from the request
        ctype, pdict = cgi.parse_header(self.headers.get('content-type'))

        if (ctype == "application/json"):

            # Unpack the data
            length = int(self.headers['Content-length'])
            data_str = self.rfile.read(length).decode("utf-8")

            try: # JSON
                data = json.loads(data_str)
            except: # not JSON
                data = {}
                split = data_str.split("&")
                for seg in split:
                    split2 = seg.split("=")
                    data[split2[0]] = split2[1]

            if "action" in data:
                if data["action"] == "commandAmateras":
                    if "command" in data:
                        commandAmateras(data["command"])
                        # Wait a moment to allow this to take effect
                        time.sleep(1)
                        response_dict = getCurrentSettings()
                        json_string = json.dumps(response_dict)
                        self.wfile.write(bytes(json_string, encoding="UTF-8"))
                elif data["action"] == "commandProjector":
                    if "command" in data:
                        commandProjector(data["command"])
                        # Wait a moment to allow this to take effect
                        time.sleep(1)
                        response_dict = getCurrentSettings()
                        json_string = json.dumps(response_dict)
                        self.wfile.write(bytes(json_string, encoding="UTF-8"))
                elif data["action"] == "getCurrentSettings":
                    response_dict = getCurrentSettings()
                    json_string = json.dumps(response_dict)
                    self.wfile.write(bytes(json_string, encoding="UTF-8"))
                elif data["action"] == "setVolume":
                    if "percent" in data and "source" in data:
                        audio_control.setVolume(data["source"], int(data["percent"]))
                        response_dict = getCurrentSettings()
                        json_string = json.dumps(response_dict)
                        try:
                            self.wfile.write(bytes(json_string, encoding="UTF-8"))
                        except ConnectionAbortedError:
                            pass
                    else:
                        print("Errpr: must send value 'percent' to set the volume!")
                elif data["action"] == "triggerLights":
                    if "show" in data:
                        triggerLights(data["show"])
                        #print(f"Triggering show", data["show"])
                else:
                    print("Error: unrecognized action:", data["action"])
        #print("do_POST: EXIT")

def commandAmateras(command):

    # Send a command to Amateras

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    if command == "playlist_next":
        sock.sendto(bytes("playlist_next", "UTF-8"), ("localhost", 4000))
    elif command == "pause":
        # Dome player
        sock.sendto(bytes("pause", "UTF-8"), ("localhost", 4001))
        # Background music
        sock.sendto(bytes("pause", "UTF-8"), ("localhost", 4003))
    elif command == "play":
        # Play dome player
        sock.sendto(bytes("play", "UTF-8"), ("localhost", 4002))
    elif command.startswith("loadPlaylist"):
        split = command.split("__")
        loadAmaterasPlaylist(split[1])

def commandProjector(command):

    # Send a command to the projector

    com = projector_control.serial_connect_with_url(PROJECTOR_IP, make="barco")
    if com is None:
        return
    if command in ["power_on", "power_off", "set_dvi_1", "set_dvi_2"]:
        projector_control.serial_send_command(com, command, make="barco")

def getCurrentSettings():

    # Poll the various hardware components for their current settings

    result = {}

    # Projector power state
    try:
        com = projector_control.serial_connect_with_url(PROJECTOR_IP, make="barco")
        if com is not None:
            power_state = projector_control.serial_send_command(com, "power_state", make="barco")
            if power_state in ["on", "powering_on"]:
                result["projector_power_state"] = "on"
            else:
                result["projector_power_state"] = "off"

            # Projector input
            result["projector_input"] = projector_control.serial_send_command(com, "get_source", make="barco")
    except socket.timeout:
        print("Projector conneciton timed out")

    # System volumes
    volumes = []
    for source in ["Overall", "Amateras", "Microphone"]:
        volumes.append(audio_control.getVolume(source))
        result["system_volumes"] = volumes

    return(result)

def loadAmaterasPlaylist(playlist):

    # Execute a terminal command to load the appropriate playlist

    playlist_dict = {
        "Black Holes": "C:\\Users\\user\\Desktop\\Planetarium Shows\\playlists\\Black_Holes.lst",
        "Losing the Dark": "C:\\Users\\user\\Desktop\\Planetarium Shows\\playlists\\Losing_the_Dark.lst",
        "Our Solar System": "C:\\Users\\user\\Desktop\\Planetarium Shows\\playlists\\Our_Solar_System.lst",
        "Spooky Space": "C:\\Users\\user\\Desktop\\Planetarium Shows\\playlists\\Spooky_Space.lst",
        "Take Me To The Moon": "C:\\Users\\user\\Desktop\\Planetarium Shows\\playlists\\Take_Me_To_The_Moon.lst",
        "Texas Sky Tonight": "C:\\Users\\user\\Desktop\\Planetarium Shows\\playlists\\Texas_Sky_Tonight.lst",
        "This Is Your Captain Speaking": "C:\\Users\\user\\Desktop\\Planetarium Shows\\playlists\\This_Is_Your_Captain_Speaking.lst",
        "Thundering Herd": "C:\\Users\\user\\Desktop\\Planetarium Shows\\playlists\\Thundering_Herd.lst"
    }

    audio_dict = {
        "Black Holes": [50, 100, 0],
        "Losing the Dark": [25, 100, 0],
        "Our Solar System": [80, 20, 95],
        "Spooky Space": [40, 100, 0],
        "Take Me To The Moon": [80, 20, 95],
        "Texas Sky Tonight": [60, 30, 100],
        "This Is Your Captain Speaking": [80, 20, 95],
        "Thundering Herd": [50, 100, 0],
    }

    input_dict = {
        "Black Holes": "set_dvi_1",
        "Losing the Dark": "set_dvi_1",
        "Our Solar System": "set_dvi_1",
        "Spooky Space": "set_dvi_1",
        "Take Me To The Moon": "set_dvi_1",
        "Texas Sky Tonight": "set_dvi_2",
        "This is Your Captain Speaking": "set_dvi_1",
        "Thundering Herd": "set_dvi_1",
    }

    if playlist in playlist_dict:
        if playlist in audio_dict:
            audio_control.setAllVolumes(audio_dict[playlist])
        if playlist in input_dict:
            commandProjector(input_dict[playlist])
        command = "C:\\Users\\user\\Desktop\\Do not delete - Amateras\\Amateras Dome Player.exe"
        result = subprocess.run([command, playlist_dict[playlist]], capture_output=True)

def triggerLights(show):

    # Send a command to the DMX controller to trigger a specific show

    # Mapping of show names to numbers
    show_dict = {"blues": 1,
                 "black": 10,
                 "oranges": 7,
                 "white": 11}

    com = iPlayer3_control.connect(IPLAYER_PORT)
    if com is not None:
        iPlayer3_control.trigger_show(com, show_dict[show])
    else:
        print("triggerLights: error: iPlayer3 port is not correct")

def quit_handler(sig, frame):
    print('\nKeyboard interrupt detected. Cleaning up and shutting down...')
    sys.exit(0)

signal.signal(signal.SIGINT, quit_handler)

PROJECTOR_IP = "10.8.10.70"
IPLAYER_PORT = "COM4"

print(f"Launching server on port 8000 to serve the Noble control panel")

httpd = HTTPServer(("", 8000), RequestHandler)
httpd.serve_forever()
