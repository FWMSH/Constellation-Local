import SimpleHTTPServer
import SocketServer
import wiiboard_interface
from signal import signal, SIGINT
import sys
import threading
import json
import os

class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def log_request(code='-', size='-'):

        # Override to suppress the automatic logging

        pass
    
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
        
        self.send_response(200, "OK")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()
        
        # Unpack the data
        length = int(self.headers['Content-length'])
        data_str = self.rfile.read(length).decode("utf-8")
        data = json.loads(data_str)
        
        if "action" in data:
            if data["action"] == "getWeight":
                json_string = json.dumps({"weight": wiiboard._weight})
                self.wfile.write(json_string)
        

def main():
    
    global httpd
    global wiiboard
        
    port = 8081
    httpd = SocketServer.TCPServer(("localhost", port), ServerHandler)
    wiiboard = wiiboard_interface.initialize()
    os.system("chromium-browser --kiosk interface.html&")

    print "serving at port", port
    httpd.serve_forever()
    
def shutdown_handler(signal_received, frame):
    
    global httpd
    global wiiboard
    
    # Handle any cleanup here
    print('\nSIGINT or CTRL-C detected. Exiting gracefully')
    wiiboard.done = True
    threading.Thread(target=httpd.shutdown).start()
    httpd.server_close()
    sys.exit(0)

if __name__ == "__main__":
    
    signal(SIGINT, shutdown_handler)
    main()
    
    
    
    
    
    