from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import collections
from datetime import datetime

ADDR = "" # Accept connections from all interfaces
PORT = 8081

class RequestHandler(BaseHTTPRequestHandler):

    # Initialize two lists of clients we want to track. Non-listed ones will be
    # added automatically if they send heartbeats to the server.
    # Type 1 is a heartbeat sent every ten getSeconds
    # Type 2 is a heartbeat sent every time an analytics packet is received

    # InfoStations

    timeout = 2 # seconds

    # VideoStations
    VS_client_list = ['VS-OBS1', 'VS-OBS2', 'VS-MIT1', 'VS-MIT2', 'VS-ADA1', 'VS-ADA2', 'VS-LPAD', 'VS-BEADS']
    VS_client_dict_1 = {}
    VS_client_dict_2 = {}

    for client in VS_client_list:
        VS_client_dict_1[client] = 0
        VS_client_dict_2[client] = 0

    # Interactives
    IN_client_list = ['CO2_DISP', 'IR_CAMERA', 'PSCALE_EAST', 'PSCALE_WEST']
    IN_client_dict_1 = {}
    IN_client_dict_2 = {}

    for client in IN_client_list:
        IN_client_dict_1[client] = 0
        IN_client_dict_2[client] = 0

    # Other clients
    other_client_dict_1 = {}
    other_client_dict_2 = {}

    client_ip_dict = {}
    client_restart_dict = {} # Holds True/False on whether we should send a reboot command to a clinet with a given ID
    client_restart_allowed = ["VS-OBS1", "VS-OBS2", "VS-MIT1", "VS-MIT2", "VS-ADA1", "VS-ADA2", "VS-BEADS", "VS-LPAD", "CO2_DISP", "IR_CAMERA"] # List of clients that are permitted to reboot

    def log_request(code='-', size='-'):

        # Override to suppress the automatic logging

        pass

    def build_html(self):

        # Construct an HTML page to report the current status of the clients
        print('  Building page... ', end='')
        top_part = \
        """<html>
                <head>
                    <meta http-equiv='refresh' content='30'/>
                    <title>Exhibit tech overview</title>
                    <script type = "text/javascript"
                        src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js">
                    </script>

                    <style>
                        body {
                            background-color: black;
                            color: white;
                            font-family: monospace;
                        }
                        .client_menu {
                             display: none;
                        }
                    </style>
                </head>
                <script>

                    var heartbeat_server = "http://10.8.0.168:8081"

                    function toggleMenu(id) {
                        $(".client_menu:not(#"+id+")").hide() // Hide others
                        $('#'+id).toggle() // Toggle the one that was clicked
                    }

                    function sendRestart(target) {
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", self.heartbeat_server, true);
                        xhr.setRequestHeader('Content-Type', "text/plain;charset=UTF-8");
                        xhr.send("target=" + target + "&action=restart&id=status_page");

                        // Update the cell to show we've triggered a reboot
                        $("#"+target+"_status").html("RESTARTING")
                        $("#"+target+"_status").css('background-color', 'purple')
                    }
                </script>
            <body>
                <h1>Component status page</h1>
                <i> Click an ID to see a menu of available options</i><br><br>
        """

        list1 = [self.VS_client_dict_1, self.IN_client_dict_1, self.other_client_dict_1]
        list2 = [self.VS_client_dict_2, self.IN_client_dict_2, self.other_client_dict_2]
        table_list = list()

        for i in range(len(list1)):

            sorted_dict = {k: v for k, v in sorted(list1[i].items(), key=lambda item: item[1])}
            table = "<table>"

            for id, last_contact in sorted_dict.items():
                if (time.time() - last_contact) < 60:
                    bgcolor = 'green'
                    status = "ONLINE"
                elif (time.time() - last_contact) < 300:
                    bgcolor = 'yellow'
                    status = "WAITING"
                else:
                    bgcolor = 'red'
                    status = "OFFLINE"
                if id in list2[i]:
                    if (time.time() - list2[i][id]) < 30:
                         bgcolor = "blue"
                         status = "ACTIVE"
                # If we're rebooting, set the status appropriately
                if ((status == "ACTIVE") or (status == "ONLINE")) and (id in self.client_restart_dict) and (self.client_restart_dict[id] == True):
                    bgcolor = 'purple'
                    status = "REBOOTING"
                if id in self.client_ip_dict:
                    ip = self.client_ip_dict[id]
                else:
                    ip = 'N/A'

                # New row
                table += "<tr>"
                # ID cell
                table += "<td width='100px' title="+ip+"><div onclick=\"toggleMenu('"+ id + "_menu')\">"+id+"</div>"
                # If device is allowed to reboot and is online, add a reboot button
                if (id in self.client_restart_allowed) and (status == "ONLINE"):
                    table += "<div class='client_menu' id=\"" + id +"_menu\"> <button onclick=\"sendRestart('"+id+"')\">Reboot</button></td>"
                else:
                    table += "</td>"
                # Status cell
                table += "<td width='100px' title='" + time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(last_contact))+"' style='background-color:" + bgcolor + "' id='" + id + "_status'>" + status + "</td></tr>"
            table += "</table>"

            table_list.append(table)

        combo_table = "<table><tr>"+ \
                        "<td width='225px'><center><h2>VideoStations</h2></center></td>"+ \
                        "<td width='225px'><center><h2>Interactives</h2></center></td>"+ \
                        "<td width='225px'><center><h2>Other</h2></center></td><tr>"
        for table in table_list:
            combo_table += "<td valign='top'>" + table + "</td>"
        combo_table += "</tr></table>"

        content = top_part + combo_table +"</body></html>"
        print('done')
        return content.encode("utf8")  # NOTE: must return a bytes object!

    def do_GET(self):

        # Respond with a webpage built by build_html()

        print('Status page requested at ' + str(datetime.today()))
        print('  Respoinding...')
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        self.wfile.write(self.build_html())
        print('responded')

    def do_POST(self):

        # Receives heartbeat pings from clients
        print('POST received... ')
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

        # Send the reboot command if requested
        if data["id"] in self.client_restart_dict:
            if self.client_restart_dict[data["id"]] == True:
                self.wfile.write(b"restart")
                self.client_restart_dict[data["id"]] = False

        try:
            if data['action'] == 'heartbest':
                self.handle_heartbeat(data, 1)
            if data['action'] == 'heartbeat-1':
                self.handle_heartbeat(data, 1)
            elif data['action'] == 'heartbeat-2':
                self.handle_heartbeat(data, 2)
            elif data['action'] == 'restart':
                print("restart request received...")
                self.sendRestart(data['target'])

        except KeyError:
            print("  Request missing action field")
        print('handled')

    def sendRestart(self, id):

        self.client_restart_dict[id] = True
        print("================================================")
        print("Reboot scheduled:", id)

    def handle_heartbeat(self, data, type):

        # Function to handle a heartbeat message from a remote client

        print("  Heartbeat received from: " + data['id'] + ' at ' + str(datetime.today()))
        print('   Storing... ', end='')
        try:
            if type == 1:
                #if data['id'] in self.IS_client_dict_1:
                #    self.IS_client_dict_1[data['id']] = time.time()
                if data['id'] in self.IN_client_dict_1:
                    self.IN_client_dict_1[data['id']] = time.time()
                elif data['id'] in self.VS_client_dict_1:
                    self.VS_client_dict_1[data['id']] = time.time()
                else:
                    self.other_client_dict_1[data['id']] = time.time()

            elif type == 2:
                #if data['id'] in self.IS_client_dict_2:
                #    self.IS_client_dict_2[data['id']] = time.time()
                if data['id'] in self.IN_client_dict_2:
                    self.IN_client_dict_2[data['id']] = time.time()
                elif data['id'] in self.VS_client_dict_2:
                    self.VS_client_dict_2[data['id']] = time.time()
                else:
                    self.other_client_dict_2[data['id']] = time.time()
            self.client_ip_dict[data['id']] = self.address_string()
        except:
            print('Error: bad/missing id')
        print('done')

httpd = HTTPServer((ADDR, PORT), RequestHandler)
httpd.serve_forever()











pass # To pad the bottom of my screen in Atom
