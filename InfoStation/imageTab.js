function buildImageTab(content) {

  // Function to take an array of dictionaries and convert it into
  // a grid of images.

  var html = ''
  html = `
  <div id="images" class="tabcontent">
      <div class="big-image">
        <img id="expandedImg" class='featuredImage'>
        <div id="imgCaptionText"></div>
      </div>

      <div class="image-grid-container">
  `

  // Loop over the dictionaries in content and build an image for each.
  var i;
  for (i=0; i<content.length; i++) {
    img = content[i]

    // We need to strip out any single quote (') and replace it with the ASCII code so they can nest properly in the other quotes needed to write the HTML
    var caption_en = img["caption_en"].replace("'", "&#39;")

    html += '<div class="image-grid-item">'
    html +="<img src='" + img['thumb'] + "' width=100% onclick=\'switchImg(\"" + img['image'] + "\",\"" + caption_en +"\");\'></div>"
  }

  html += `
    </div>
  </div>
`

document.getElementById('tabArea').innerHTML += html

// Add button for this tab
document.getElementById("tabButtonContainer").innerHTML += '<button class="tablink" onclick="openPage(\'images\', this, \'#002f65\')" id="buttonImages">View Images</button>'

}

/* Switch the big image */
function switchImg(image, caption_en) {
  document.getElementById("expandedImg").src = image;
  document.getElementById("imgCaptionText").innerHTML = caption_en;

  // Send action to analytics servers
  sendAnalytics(image, 'show');
}


















//
