from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime
import os

ADDR = ""
PORT = 8080

class RequestHandler(BaseHTTPRequestHandler):

    timeout = 2 # seconds

    def log_request(code='-', size='-'):

        # Override to suppress the automatic logging

        pass

    def do_POST(self):

        # Override to handle POST requests

        self.send_response(200, "OK")
        self.send_header("Access-Control-Allow-Origin", "*") # This allows us to receive updates from the InfoStations despitre them being hosted on different servers.
        self.end_headers()

        # Get the data from the request
        length = int(self.headers['Content-length'])
        data_str = self.rfile.read(length).decode("utf-8")

        # Unpack the data string into a dict
        data = {}
        split = data_str.split("&")
        for seg in split:
            split2 = seg.split("=")
            data[split2[0]] = split2[1]

        try:
            if "cmd" in data:
                self.handle_command(data["cmd"])
        except KeyError as e:
            print(e)

    def handle_command(self, cmd):

        if cmd == "restart":
            print("restarting...")
            system.os("reboot")

httpd = HTTPServer((ADDR, PORT), RequestHandler)
httpd.serve_forever()











pass # To pad the bottom of my screen in Atom
