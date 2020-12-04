function buildMixedTab(tabName, content) {

  // Function to take an array of dictionaries and convert it into
  // a list of entries.

  // Add this tab to the list
  tabList.push(tabName);

  var html = '<div id="' + tabName + '" class="tabcontent">';
  html += "<div class='imageOverlay' id='" + tabName + "_imageOverlay' onclick=dismissOverlay(this.id)></div>";
  html += "<div class='videoOverlay' id='" + tabName + "_videoOverlay"+ "'></div>";
  html += "<table class='mixedContentTable'>";


  // Loop over the dictionaries in content and build a table row for each.
  var i;
  for (i=0; i<content.length; i++) {
    row = content[i];

    // We need to strip out any single quote (') and replace it with the ASCII code so they can nest properly in the other quotes needed to write the HTML
    var caption_en = row["caption_en"].replace("'", "&#39;");
    var text_en = row["text_en"].replace("'", "&#39;");
    var title_en = row["title_en"].replace("'", "&#39;");

    // Add title
    html += '<tr><th colspan="2" class="titleText">' + title_en + '</th></tr>';
    if (row["image"] != '') {
      // Add image
      html += '<tr><td><img src="' + row["image"] + '"width="200px" onclick="enlargeImage(\'' + row["image"] + '\', \'' + caption_en + '\', \'' + tabName + "_imageOverlay'" + ')"></img></td>'
    }
    html += '<td class="bodyText">' + text_en + "</td></tr>"

  }

  html += `
    </table>
  </div>
  `

  document.getElementById('tabArea').innerHTML += html

  // Add button for this tab
  document.getElementById("tabButtonContainer").innerHTML += '<button class="tablink" onclick="openPage(\'' + tabName +'\', this, \'#002f65\')" id="' + tabName + '_button' + '">' + tabName + '</button>'

}

function enlargeImage(src, caption, overlayToUse) {

  // Function to show a thumbnail in the imageOverlay viewer

  var overlay = document.getElementById(overlayToUse);

  html = "<img class='imageOverlayImage' src='" + src + "'></img>"
  html += "<br><div class='bodyText' style='padding-bottom: 25px;'>" + caption + "</div>"

  overlay.innerHTML = html
  overlay.style.display = "flex";

}

function dismissOverlay(overlay) {

  // Hides the overlay when it is touched.

  document.getElementById(overlay).style.display = 'none';
}
