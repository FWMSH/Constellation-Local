/* Open a tab */
function openPage(pageName,elmnt,color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;

  // Pause any videos playing
  var video_players = document.getElementsByClassName('featuredVideo');
  var i;
  for (i=0; i<video_players.length; i++) {
    video_players[i].pause();
  };

  // Send action to analytics servers
  sendAnalytics(pageName, 'show');
}

/* Adjust the text size */

function setTextSize(val){

    textSize = val

    var elements = document.getElementsByClassName('bodyText');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.style.fontSize = val + 'px'
    }

    var element = document.getElementById("imgCaptionText")
    if (element) { // may be null
      element.style.fontSize = val + 'px'
    }


    var element = document.getElementById("vidCaptionText")
    if (element) { // may be null
      element.style.fontSize = val + 'px'
    }
}

function textSizeDown(){

    setTextSize(textSize-4)
    sendHeartbeat(type=2) // Someone touched the button!
}

function textSizeUp(){

    setTextSize(textSize+4)
    sendHeartbeat(type=2) // Someone touched the button!
}


/* Show and hide the attractor overlay */
function showAttractor() {

  /* Only switch to attractor if we're not watching a video */
  var video_players = document.getElementsByClassName('featuredVideo');
  var i;
  var n_paused = 0;
  for (i=0; i<video_players.length; i++) {
    if (video_players[i].paused) {
      n_paused += 1;
    }
  };
  if (n_paused == video_players.length){
      document.getElementById("attractor").play()
      document.getElementById("overlay").style.display = "block";
      setDefaults()

      // Send action to analytics servers
      sendAnalytics('attractor', 'show');
      currentlyActive = false;
  }
}

function hideAttractor() {
  document.getElementById("attractor").pause();
  document.getElementById("overlay").style.display = "none";

  // Send action to analytics servers
  sendAnalytics('attractor', 'hide');
  currentlyActive = true;
}

var inactivityTime = function () {
    var time;
    window.onload = resetTimer;
    // DOM Events
    // Attach reset to video player
    var video_players = document.getElementsByClassName('featuredVideo');
    var i;
    for (i=0; i<video_players.length; i++) {
      bigVideo = video_players[i]
      bigVideo.onended = resetTimer;
    }

    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    function resetTimer() {
            clearTimeout(time);
            time = setTimeout(showAttractor, 30000)
            // 1000 milliseconds = 1 second
        }
}

function localize(lang){

    switch (lang){
        case "en":
            curLang = "en";
            break;
        case "es":
            curLang = "es";
            break;
        case "swap":
            if (curLang == "en"){
                curLang = "es";
                lang = "es";
            } else {
                curLang = "en";
                lang = "en";
            }
            break;
    }

    // Loop the elements with text and switch them.
    var ids = ['buttonStory', 'buttonImages', 'buttonVideo', 'buttonArtifacts', 'langSwitch', 'masthead', 'story', 'artifacts']
    for (var i = 0; i < ids.length; i++) {
        id = document.getElementById(ids[i]);
        id.innerHTML = textDict[ids[i]+'_'+lang];
    }

    // Loop captions separately, since we are setting the alt text
    ids = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8', 'video1', 'video2', 'video3', 'video4']
    for (var i = 0; i < ids.length; i++) {
        id = document.getElementById(ids[i]);
        id.alt = textDict[ids[i]+'Caption_'+lang];
    }

    // Make sure evrything is at the correct text size
    setTextSize(textSize)

    // Clear the caption since the language doesn't change
    var vidText = document.getElementById("vidCaptionText");
    vidText.innerHTML = ""
    var imgText = document.getElementById("imgCaptionText");
    imgText.innerHTML = ""

}

function setDefaults(){

    // Set the starting page
    document.getElementById(tabList[0]+'_button').click();

    // Populate the text fieldset
    //localize('en');

    // Reset text size
    setTextSize(25)

    // Clear the caption since the language might be switched.
    var vidText = document.getElementById("vidCaptionText");
    if (vidText) { // may be null
      vidText.innerHTML = ""
    }
    var imgText = document.getElementById("imgCaptionText");
    if (imgText) { // may be null
      imgText.innerHTML = ""
    }

}

function startReloadTimer() {

  // Starts a timer that will reload the page at midnight

  var now = new Date();
  var night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // the next day, ...
      0, 0, 0 // ...at 00:00:00 hours
  );
  var msTillMidnight = night.getTime() - now.getTime();
  setTimeout('document.location.refresh()', msTillMidnight);
}
