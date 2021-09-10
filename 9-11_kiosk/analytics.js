function sendAnalytics(data) {

  // Take the provided dicitonary of data and send it to the control server

  // Append the date and time of this recording
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; // Time zone offset in milliseconds
  var date_str = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  data["datetime"] = date_str;

  var requestDict = {"class": "tracker",
                     "action": "submitAnalytics",
                     "data": data,
                     "name": '9-11_DISP'};

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
