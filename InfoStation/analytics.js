function sendAnalytics(target, action) {

  // Function to send a bunch of analytics data to the remote server.
  // Sends the current action given by the input variable, plus a bunch of data collected from the current state.

  // Let the heartbeat server know we're sending an analytics packet
  sendHeartbeat(type=2)

  var xhr = new XMLHttpRequest();
  xhr.open("POST", self.analytics_server, true);
  xhr.setRequestHeader('Content-Type', "text/plain;charset=UTF-8");
  xhr.send("date=" + getNowDateTime() + "&project=" + self.project + "&id=" + self.id +"&lang=" + self.lang + "&type=" + self.type + "&textSize=" + self.bodyTextSize + "&page=" + self.page + "&target=" + target + "&action=" + action);
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

function heartbeatTimer (){

  // Function to send a heartbeat every ten seconds

  sendHeartbeat()
  setTimeout(heartbeatTimer, 10000); // 1000 milliseconds = 1 second
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
