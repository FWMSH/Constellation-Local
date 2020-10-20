from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime

ADDR = ""
PORT = 8080
last_recorded_time = datetime.today()

def convert_timedelta(duration):
        days, seconds = duration.days, duration.seconds
        hours = days * 24 + seconds // 3600
        minutes = (seconds % 3600) // 60
        seconds = (seconds % 60)
        return hours, minutes, seconds

class RequestHandler(BaseHTTPRequestHandler):

    #last_recorded_time = str(datetime.today())
    timeout = 2 # seconds

    def log_request(code='-', size='-'):

        # Override to suppress the automatic logging

        pass

    def build_html(self):

        # Returns a byte string of HTML representing a webpage

        global last_recorded_time

        hours, minutes, seconds = convert_timedelta(datetime.today() - last_recorded_time)
        top_part = \
        """<html>
                <head>
                    <meta http-equiv='refresh' content='10'/>

                    <style>
                        body {
                          background-color: black;
                          color: white;
                          font-family: monospace;
                        }
                    </style>
                </head>
            <body>
                <h1>Analytics server <font color=green>active</font></h1>
        """
        body = '<p>Analytics last recorded ' + '{} hours, {} minutes'.format(hours, minutes) + ' ago.'

        page = top_part + body + '</body></html>'

        return(bytes(page, 'UTF-8'))

    def do_GET(self):

        # Respond with a webpage built by build_html()

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        self.wfile.write(self.build_html())

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
            if data['action'] == 'heartbeat':
                self.handle_heartbeat(data)
            else:
                self.record_analytics(data)
        except KeyError as e:
            print(e)

    def handle_heartbeat(self, data):

        # Function to handle a heartbeat message from a remote client

        print("Heartbeat received from:", data['id'])

    def record_analytics(self, data):

        # Function to write analytics data to the appropriate location

        global last_recorded_time

        print("Analytics received from:", data['id'])

        if ("id" in data):
            last_recorded_time = datetime.today()
            with open(data['project']+'/'+data['id']+'.csv', 'a') as f:
                #if f.tell() == 0: # At position 0 means new file
                #    f.write('Page, Type, Target, Action, Datetime, Language, Text size\n')
                for key in data:
                    f.write(data[key]+',')
                f.write('\n')
                #f.write(data['page'] + ',' + data['type'] + ',' + data['target'] + ',' + data['action'] + ',' + data['date'] + ',' + data['lang'] + ',' + data['textSize'] + '\n')


httpd = HTTPServer((ADDR, PORT), RequestHandler)
httpd.serve_forever()











pass # To pad the bottom of my screen in Atom
