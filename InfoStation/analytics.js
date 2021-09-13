function sendAnalytics(target, action) {

  // Function to send a bunch of analytics data to the remote server.
  // Sends the current action given by the input variable, plus a bunch of data collected from the current state.

  // Let the heartbeat server know we're sending an analytics packet
  // sendHeartbeat(type=2)
  //
  // var xhr = new XMLHttpRequest();
  // xhr.open("POST", self.analytics_server, true);
  // xhr.setRequestHeader('Content-Type', "text/plain;charset=UTF-8");
  // xhr.send("date=" + getNowDateTime() + "&project=" + self.project + "&id=" + self.id +"&lang=" + self.lang + "&type=" + self.type + "&textSize=" + self.bodyTextSize + "&page=" + self.page + "&target=" + target + "&action=" + action);
}

function sendAnalytics(data) {

  // Take the provided dicitonary of data and send it to the control server

  // Append the date and time of this recording
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; // Time zone offset in milliseconds
  var date_str = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  data["datetime"] = date_str;

  // Append the current project
  data["project"] = project

  var requestDict = {"class": "tracker",
                     "action": "submitAnalytics",
                     "data": data,
                     "name": id};

  var requestString = JSON.stringify(requestDict);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverAddress, true);
  xhr.timeout = 5000;
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
  xhr.onreadystatechange = function () {
    if (this.readyState != 4) return;
    if (this.status == 200) {
    }
  };
  xhr.send(requestString);

}


function sendHeartbeat(type=1) {

  // Function to send a ping to the analytics server to report that we're online
  // Type 1 heartbeat is sent every ten getSeconds
  // Type 2 heartbeat is sent every time something is interacted with

  var xhr = new XMLHttpRequest();
  xhr.open("POST", self.heartbeat_server, true);
  xhr.setRequestHeader('Content-Type', "text/plain;charset=UTF-8");
  xhr.send("date=" + getNowDateTime() + "&project=" + project + "&id=" + self.id + "&action=heartbeat-"+type);

}

function sendPing() {

  // Contact the control server and ask for any updates

  if (serverAddress != "") {
    requestString = JSON.stringify({"class": "exhibitComponent",
                                    "id": id,
                                    "type": type,
                                    "currentInteraction": String(currentlyActive),
                                    "helperPort": helperAddress.split(":")[2]});

    var xhr = new XMLHttpRequest();
    xhr.open("POST", serverAddress, true);
    xhr.timeout = 2000;
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {

      if (this.readyState != 4) return;

      if (this.status == 200) {
      }
  };
    xhr.send(requestString);
  }
}

function heartbeatTimer (){

  // Function to send a heartbeat every ten seconds

  sendHeartbeat()
  setTimeout(heartbeatTimer, 10000); // 1000 milliseconds = 1 second
}

function pingTimer() {

  // Function to send a ping every ten seconds

  sendPing()
  setTimeout(pingTimer, 10000); // 1000 milliseconds = 1 second

}

function getNowDateTime() {

  // Function to return a string with the current date and time
  // Format: 2019-11-25 15:12:15

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = padZeros(today.getHours(), 2) + ":" + padZeros(today.getMinutes(), 2) + ":" + padZeros(today.getSeconds(), 2);
  var now = date+' '+time;

  return now;
}

function padZeros(n, width, z) {

  // Function to pad a scring with zeros

  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}









//
