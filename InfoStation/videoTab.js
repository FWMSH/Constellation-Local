function buildVideoTab(content) {

  // Function to take an array of dictionaries defining a set of
  // video conent and lay it out nicely.

  var html = ''
  html = `
  <div id="videos" class="tabcontent">
      <div class="big-video">
        <video id="expandedVideo" class='featuredVideo'></video>
        <div id="vidCaptionText"></div>
      </div>

      <div class="video-grid-container">
  `
  // Loop over the dictionaries in content and build a thumbnail for each.
  var i;
  for (i=0; i<content.length; i++) {
    vid = content[i]

    // We need to strip out any single quote (') and replace it with the ASCII code so they can nest properly in the other quotes needed to write the HTML
    var caption_en = vid["caption_en"].replace("'", "&#39;")

    html += '<div class="video-grid-item">'
    html +="<img src='" + vid['thumb'] + "' width=100% onclick=\'switchVideo(\"" + vid['video'] + "\",\"" + caption_en +"\");\'></div>"
  }

  html += `
    </div>
  </div>
`

document.getElementById('tabArea').innerHTML += html

// Add button for this tab
document.getElementById("tabButtonContainer").innerHTML += '<button class="tablink" onclick="openPage(\'videos\', this, \'#002f65\')" id="buttonVideo">View Videos</button>'
}

/* Switch the big video */
function switchVideo(video, caption_en) {
  var expandVid = document.getElementById("expandedVideo");
  document.getElementById("vidCaptionText").innerHTML = caption_en;

  expandVid.src = video;
  expandVid.play()

  // Send action to analytics servers
  sendAnalytics(video, 'show');
}















//
