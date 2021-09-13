function buildVideoTab(tabName, content) {

  // Function to take an array of dictionaries defining a set of
  // video conent and lay it out nicely.

  // Add this tab to the list
  tabList.push(tabName);

  var html = '<div id="' + tabName + '" class="tabcontent">';
  html += '<div class="big-video">';
  html += '<video id="' + tabName + '_expandedVideo' + '" class="featuredVideo"></video>';
  html += '<div id="' + tabName + '_vidCaptionText' + '" class="vidCaptionText"></div>';
  html += '</div><div class="video-grid-container">';

  // Loop over the dictionaries in content and build a thumbnail for each.
  var i;
  for (i=0; i<content.length; i++) {
    vid = content[i]

    // We need to strip out any single quote (') and replace it with the ASCII code so they can nest properly in the other quotes needed to write the HTML
    var caption_en = vid["caption_en"].replace("'", "&#39;")

    html += '<div class="video-grid-item">'
    html +="<img src='" + vid['thumb'] + "' width=100% onclick=\'switchVideo(\"" + tabName + "\", \"" + vid['video'] + "\",\"" + caption_en +"\");\'></div>"
  }

  html += `
    </div>
  </div>
  `

  document.getElementById('tabArea').innerHTML += html

  // Add button for this tab
  document.getElementById("tabButtonContainer").innerHTML += '<button class="tablink" onclick="openPage(\'' + tabName +'\', this, \'#002f65\')" id="' + tabName + '_button' + '">' + tabName + '</button>'
}

/* Switch the big video */
function switchVideo(tab, video, caption_en) {
  var expandVid = document.getElementById(tab + "_expandedVideo");
  document.getElementById(tab + "_vidCaptionText").innerHTML = caption_en;

  expandVid.src = video;
  expandVid.play()

  // Send action to analytics servers
  var analyticsData = {
    "action": "showVideo",
    "target": video,
    "idle": "false"
  };
  sendAnalytics(analyticsData);
}















//
