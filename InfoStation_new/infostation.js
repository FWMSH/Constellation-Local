/*jshint esversion: 6 */

function askForDefaults() {

  // Send a message to the local helper and ask for the latest configuration
  // defaults, then use them.

  var requestString = JSON.stringify({"action": "getDefaults"});

  let checkAgain = function() {
    console.log("Could not get defaults... checking again");
    setTimeout(askForDefaults, 500);
  };
  let xhr = new XMLHttpRequest();
  xhr.timeout = 2000;
  xhr.onerror = checkAgain;
  xhr.ontimeout = checkAgain;
  xhr.open("POST", helperAddress, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {

    if (this.readyState != 4) return;

    if (this.status == 200) {
      readUpdate(this.responseText);
    }
  };
  xhr.send(requestString);
}

function checkForSoftwareUpdate() {

  console.log("WARNING: update not checked because source link is incorrect.")
  // var xhr = new XMLHttpRequest();
  // xhr.timeout = 2000;
  // xhr.open('GET', 'https://raw.githubusercontent.com/FWMSH/Constellation-Local/main/infostation_new/version.txt', true);
  // xhr.onreadystatechange = function () {
  //
  //   if (this.readyState != 4) return;
  //
  //   if (this.status == 200) {
  //     if(parseFloat(this.responseText) > SOFTWARE_VERSION) {
  //       errorDict.softwareUpdateAvailable = "true";
  //     }
  //   }
  // };
  // xhr.send(null);
}

function createButton(title, id) {

  // Create a button in the bottom bar that shows the pane with the given id

  let col = document.createElement("div");
  col.setAttribute("class", "col-2 tabButtonCol");
  $("#buttonRow").append(col);

  // Adjust the column size based on the number of buttons that have been added
  let nButtons = $("#buttonRow").children().length;
  const allButtons = $(".tabButtonCol");
  if (nButtons == 1) {
    allButtons.removeClass("col-1 col-2 col-3 col-4 col-6").addClass("col-12");
  } else if (nButtons == 2) {
    allButtons.removeClass("col-1 col-2 col-3 col-4 col-12").addClass("col-6");
  } else if (nButtons == 3) {
    allButtons.removeClass("col-1 col-2 col-3 col-6 col-12").addClass("col-4");
  } else if (nButtons == 4) {
    allButtons.removeClass("col-1 col-2 col-4 col-6 col-12").addClass("col-3");
  } else if (nButtons > 4) {
    allButtons.removeClass("col-1 col-6 col-3 col-4 col-12").addClass("col-2");
  }

  let button = document.createElement("button");
  button.setAttribute("class", "btn btn-secondary tabButton w-100 h-100");
  button.setAttribute("onclick", `gotoTab("${id}", this)`);
  $(button).html(title);
  col.append(button);
}

function createCard(content) {

  // Create a single thumbnail card with the details provided in 'content'

  let card = document.createElement("div");
  card.setAttribute("class", "card");
  $(card).data("details", content);

  let img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  img.src = content.thumb;
  $(card).append(img);

  let body = document.createElement("div");
  body.setAttribute("class", "card-body");
  card.append(body);

  let title = document.createElement("div");
  title.setAttribute("class", "card-title text-center");
  $(title).html(content.title_en);
  body.append(title);

  return card;
}

function createImageTab(content, tabName) {

  // Create a pane that displays a grid of images. 'content' should be an array
  // of objects with the following properties:
  // 'image', 'thumb', 'title_en', 'title_es', 'caption_en', 'caption_es', 'credit_en', 'credit_es'

  // First, create the pane
  const id = "imageTab_"+String(Date.now());
  const overlayId = id + "_overlay";
  let pane = document.createElement("div");
  pane.setAttribute("id", id);
  pane.setAttribute("class", "tab-pane fade show active");
  $("#nav-tabContent").append(pane);

  let row = document.createElement("div");
  row.setAttribute("class", "row mx-1 align-items-center");
  $("#"+id).append(row);

  // Then, iterate through the content and build a card for each image
  content.forEach((item, i) => {
    let col = document.createElement("div");
    col.setAttribute("class", "col-4 mt-3");
    row.append(col);

    let card = createCard(item);
    card.setAttribute("onclick", `imageOverlayShow("${id}", this)`);
    col.append(card);

  });

  // Then, create the overlay that will show the media
  let overlay = document.createElement("div");
  overlay.setAttribute("class", "row overlay mx-0 align-items-center");
  overlay.setAttribute("id", overlayId);
  overlay.setAttribute("onclick", `imageOverlayHide("${id}")`);
  $("#"+id).append(overlay);
  $(overlay).hide();

  let bigImgCol = document.createElement("div");
  bigImgCol.setAttribute("class", "offset-1 col-10 text-center");
  overlay.append(bigImgCol);

  let bigImg = document.createElement("img");
  bigImg.setAttribute("class", "bigImage");
  bigImg.setAttribute("id", id+"_image");
  bigImg.src = content[0].image;
  bigImgCol.append(bigImg);

  let title = document.createElement("p");
  title.setAttribute('class', "overlayTitle text-center");
  title.setAttribute("id", id+"_title");
  $(title).html(content[0].title_en);
  bigImgCol.append(title);

  let caption = document.createElement("p");
  caption.setAttribute("class", "overlayCaption text-start");
  caption.setAttribute("id", id+"_caption");
  $(caption).html(content[0].caption_en);
  bigImgCol.append(caption);

  let credit = document.createElement("p");
  credit.setAttribute("class", "overlayCredit fst-italic text-start");
  credit.setAttribute("id", id+"_credit");
  $(credit).html(content[0].credit_en);
  bigImgCol.append(credit);

  // Create button for this tab
  createButton(tabName, id);
}

function createTextTab(content, tabName) {

  // Create a pane that displays Markdown-formatted text and images

  // First, create the pane
  const id = "textTab_"+String(Date.now());
  const overlayId = id + "_overlay";
  let pane = document.createElement("div");
  pane.setAttribute("id", id);
  pane.setAttribute("class", "tab-pane fade show active");
  $("#nav-tabContent").append(pane);

  let row = document.createElement("div");
  row.setAttribute("class", "row mx-1 align-items-center");
  $("#"+id).append(row);

  let col = document.createElement("div");
  col.setAttribute("class", "col-12 textCol mt-3");
  row.append(col);

  // Now convert the Markdown to HTML
  let converter = new showdown.Converter({parseImgDimensions: true});
  let html = converter.makeHtml(content.text);
  console.log(html)
  $(col).html(html);

  // Create button for this tab
  createButton(tabName, id);
}

function createVideoTab(content, tabName) {

  // Create a pane that displays a grid of video. 'content' should be an array
  // of objects with the following properties:
  // 'video', 'thumb', 'title_en', 'title_es', 'caption_en', 'caption_es', 'credit_en', 'credit_es'

  // First, create the pane
  const id = "videoTab_"+String(Date.now());
  const overlayId = id + "_overlay";
  let pane = document.createElement("div");
  pane.setAttribute("id", id);
  pane.setAttribute("class", "tab-pane fade show active");
  $("#nav-tabContent").append(pane);

  let row = document.createElement("div");
  row.setAttribute("class", "row mx-1 align-items-center");
  $("#"+id).append(row);

  // Then, iterate through the content and build a card for each image
  content.forEach((item, i) => {
    let col = document.createElement("div");
    col.setAttribute("class", "col-4 mt-3");
    row.append(col);

    let card = createCard(item);
    card.setAttribute("onclick", `videoOverlayShow("${id}", this)`);
    col.append(card);

  });

  // Then, create the overlay that will show the media
  let overlay = document.createElement("div");
  overlay.setAttribute("class", "row overlay mx-0 align-items-center");
  overlay.setAttribute("id", overlayId);
  overlay.setAttribute("onclick", `videoOverlayHide("${id}")`);
  $("#"+id).append(overlay);
  $(overlay).hide();

  let bigVidCol = document.createElement("div");
  bigVidCol.setAttribute("class", "offset-1 col-10 text-center");
  overlay.append(bigVidCol);

  let bigVid = document.createElement("video");
  bigVid.setAttribute("class", "bigImage");
  bigVid.setAttribute("id", id+"_video");
  bigVid.setAttribute("onended", `videoOverlayHide("${id}")`);
  bigVid.src = content[0].video;
  bigVidCol.append(bigVid);

  let title = document.createElement("p");
  title.setAttribute('class', "overlayTitle text-center");
  title.setAttribute("id", id+"_title");
  $(title).html(content[0].title_en);
  bigVidCol.append(title);

  let caption = document.createElement("p");
  caption.setAttribute("class", "overlayCaption text-start");
  caption.setAttribute("id", id+"_caption");
  $(caption).html(content[0].caption_en);
  bigVidCol.append(caption);

  let credit = document.createElement("p");
  credit.setAttribute("class", "overlayCredit fst-italic text-start");
  credit.setAttribute("id", id+"_credit");
  $(credit).html(content[0].credit_en);
  bigVidCol.append(credit);

  // Create button for this tab
  createButton(tabName, id);
}

function gotoTab(id, button) {

  // Swap the active tab
  $(".tab-pane.active").removeClass("active");
  $("#"+id).addClass("active");

  // Chance button color
  $(".tabButton").removeClass("btn-primary").addClass("btn-secondary");
  $(button).removeClass("btn-secondary").addClass("btn-primary");
}

function imageOverlayHide(id) {
    $("#"+id+"_overlay").fadeOut(100);
}

function imageOverlayShow(id, card) {

  // Retreive the details from the card data
  let details = $(card).data("details");

  // Use the details to fill out the overlay
  $("#"+id+"_image").attr("src", details.image);
  if (details.title_en != null) {
    $("#"+id+"_title").html(details.title_en);
  } else {
    $("#"+id+"_title").html("");
  }
  if (details.caption_en != null) {
    $("#"+id+"_caption").html(details.caption_en);
  } else {
    $("#"+id+"_caption").html("");
  }
  if (details.credit_en != null) {
    $("#"+id+"_credit").html(details.credit_en);
  } else {
    $("#"+id+"_credit").html("");
  }

  $("#"+id+"_overlay").fadeIn(100);
}

function readUpdate(responseText) {

  // Function to read a message from the server and take action based
  // on the contents

  var update = JSON.parse(responseText);
  sendConfigUpdate(update); // Send to helper to update the default config

  if ('commands' in update) {
    for (var i=0; i<update.commands.length; i++) {
      var cmd = (update.commands)[i];

      if (cmd == "restart") {
        askForRestart();
      } else if (cmd == "shutdown") {
        askForShutdown();
      } else if (cmd == "sleepDisplays") {
          sleepDisplays();
      } else if (cmd == "wakeDisplays") {
          wakeDisplays();
      } else if (cmd == "refresh_page") {
        if ("refresh" in allowedActionsDict && allowedActionsDict.refresh == "true") {
          location.reload();
        }
      } else if (cmd == "reloadDefaults"){
          askForDefaults();
      } else {
          console.log(`Command not recognized: ${cmd}`);
      }
    }
  }
  if ("id" in update) {
    id = update.id;
  }
  if ("type" in update) {
    type = update.type;
  }
  if (("server_ip_address" in update) && ("server_port" in update)) {
    serverAddress = "http://" + update.server_ip_address + ":" + update.server_port;
  }
  if ("helperAddress" in update) {
    helperAddress = update.helperAddress;
  }
  if ("contentPath" in update) {
    contentPath = update.contentPath;
  }
  if ("current_exhibit" in update) {
    currentExhibit = update.current_exhibit;
  }
  if ("missingContentWarnings" in update) {
    errorDict.missingContentWarnings = update.missingContentWarnings;
  }
  if ("allow_restart" in update) {
    allowedActionsDict.restart = update.allow_restart;
  }
  if ("allow_shutdown" in update) {
    allowedActionsDict.shutdown = update.allow_shutdown;
  }
  if ("helperSoftwareUpdateAvailable" in update) {
    if (update.helperSoftwareUpdateAvailable == "true")
    errorDict.helperSoftwareUpdateAvailable = "true";
  }
}

function sendConfigUpdate(update) {

  // Send a message to the helper with the latest configuration to set as
  // the default

  var requestDict = {"action": "updateDefaults"};

  if ("content" in update) {
    requestDict.content = update.content;
  }
  if ("current_exhibit" in update) {
    requestDict.current_exhibit = update.current_exhibit;
  }

  var xhr = new XMLHttpRequest();
  xhr.timeout = 1000;
  xhr.open("POST", helperAddress, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(requestDict));
}

function sendPing() {

  // Contact the control server and ask for any updates

  if (serverAddress != "") {
    requestDict = {"class": "exhibitComponent",
                   "id": id,
                   "type": type,
                   "helperPort": helperAddress.split(":")[2], // Depreciated
                   "helperAddress": helperAddress,
                   "allowed_actions": allowedActionsDict};

    // See if there is an error to report
    let errorString = JSON.stringify(errorDict);
    if (errorString != "") {
      requestDict.error = errorString;
    }
    requestString = JSON.stringify(requestDict);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", serverAddress, true);
    xhr.timeout = 2000;
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {

      if (this.readyState != 4) return;

      if (this.status == 200) {
        readUpdate(this.responseText);
      }
  };
    xhr.send(requestString);
  }
}

function sleepDisplays() {

  // Send a message to the local helper process and ask it to sleep the
  // displays

  var requestString = JSON.stringify({"action": "sleepDisplays"});

  var xhr = new XMLHttpRequest();
  xhr.open("POST", helperAddress, true);
  xhr.timeout = 2000;
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState != 4) return;

    if (this.status == 200) {
    }
  };
  xhr.send(requestString);
}

function videoOverlayHide(id) {
    videoPlaying = false;
    $("#"+id+"_overlay").fadeOut(100);
    document.getElementById(id+"_video").pause();
    document.getElementById(id+"_video").currentTime = 0;
}

function videoOverlayShow(id, card) {

  videoPlaying = true;

  // Retreive the details from the card data
  let details = $(card).data("details");

  // Use the details to fill out the overlay
  $("#"+id+"_video").attr("src", details.video);
  if (details.title_en != null) {
    $("#"+id+"_title").html(details.title_en);
  } else {
    $("#"+id+"_title").html("");
  }
  if (details.caption_en != null) {
    $("#"+id+"_caption").html(details.caption_en);
  } else {
    $("#"+id+"_caption").html("");
  }
  if (details.credit_en != null) {
    $("#"+id+"_credit").html(details.credit_en);
  } else {
    $("#"+id+"_credit").html("");
  }

  $("#"+id+"_overlay").fadeIn(100);
  document.getElementById(id+"_video").play();
}

function wakeDisplays() {

  // Send a message to the local helper process and ask it to sleep the
  // displays

  var requestString = JSON.stringify({"action": "wakeDisplays"});

  var xhr = new XMLHttpRequest();
  xhr.open("POST", helperAddress, true);
  xhr.timeout = 2000;
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState != 4) return;

    if (this.status == 200) {
    }
};
  xhr.send(requestString);
}

var videoPlaying = false; // Is a video currently playing?
var errorDict = {};
const SOFTWARE_VERSION = 1.0;

// These will be replaced by values from the helper upon loading
var id = "UNKNOWN";
var type = "INFOSTATION";
var serverAddress = ""; // The address of the main control server
var allowedActionsDict = {"refresh": "true"};
var contentPath = "";
var current_exhibit = "";

askForDefaults();
checkForSoftwareUpdate();
sendPing();
setInterval(sendPing, 5000);

var videoContent = [{video: 'videos/test_video.mp4', thumb: 'thumbs/test_video.jpg', caption_en: 'This is a test video.', caption_es: "Ésta es una imagen de prueba.", title_en: "Test 1", credit_en: "Public Domain."},];
createVideoTab(videoContent, "Videos");

var imageContent = [
  {image: 'images/test_1.jpeg', thumb: 'thumbs/test_1.jpeg', caption_en: 'This is a test image.', caption_es: "Ésta es una imagen de prueba.", title_en: "Test 1", credit_en: "Public Domain."},
  {image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "Test 2"},{image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "Test 2"},{image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "Test 2"},{image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "Test 2"},{image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "Test 2"},{image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "Test 2"},{image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "Test 2"},{image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "Test 2"},{image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba.", title_en: "A very long title with words."},{image: 'images/test_3.jpeg', thumb: 'thumbs/test_3.jpeg', caption_en: 'Very Wide Image is here.', caption_es: "Esta es otra imagen de prueba.", title_en: "Very Wide Image"},{image: 'images/test_4.jpeg', thumb: 'thumbs/test_4.jpeg', caption_en: 'This is another test image that is very tall.', caption_es: "Esta es otra imagen de prueba.", title_en: "Very Tall Image"},
];
createImageTab(imageContent, "Images");

var textContent = {text: `# This is a Markdown header

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id neque aliquam vestibulum morbi blandit. Mauris a diam maecenas sed enim ut sem viverra aliquet. Massa ultricies mi quis hendrerit dolor magna eget. Integer eget aliquet nibh praesent. Ut sem viverra aliquet eget sit. Dolor sit amet consectetur adipiscing. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Est ultricies integer quis auctor elit. Ultrices gravida dictum fusce ut placerat. Aliquam eleifend mi in nulla posuere sollicitudin.

## Header 2


  Diam donec adipiscing tristique risus nec. Molestie at elementum eu facilisis. Nisl purus in mollis nunc sed id semper risus in. Interdum posuere lorem ipsum dolor. Viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare. <img src="images/test_2.jpeg" style="width: 50%; float: right;">Eget nunc lobortis mattis aliquam faucibus purus in massa. Eros in cursus turpis massa. Sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit. Phasellus faucibus scelerisque eleifend donec. Cursus mattis molestie a iaculis. Venenatis urna cursus eget nunc scelerisque viverra mauris. Habitasse platea dictumst quisque sagittis purus. Amet tellus cras adipiscing enim eu turpis.

### Header 3

  Bibendum enim facilisis gravida neque convallis a. Egestas integer eget aliquet nibh praesent. Ac felis donec et odio pellentesque. Turpis massa sed elementum tempus egestas sed sed risus pretium. Tellus orci ac auctor augue. Adipiscing elit ut aliquam purus sit. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam. Dignissim suspendisse in est ante in nibh. Nulla facilisi cras fermentum odio. Tortor pretium viverra suspendisse potenti nullam ac tortor vitae. Ullamcorper velit sed ullamcorper morbi tincidunt. Ipsum faucibus vitae aliquet nec ullamcorper. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque. Arcu vitae elementum curabitur vitae nunc. Arcu non odio euismod lacinia at quis. Laoreet id donec ultrices tincidunt arcu non sodales neque.

#### Header 4

  Accumsan sit amet nulla facilisi morbi tempus iaculis. Diam quis enim lobortis scelerisque fermentum dui faucibus in. Eget velit aliquet sagittis id consectetur purus. Egestas diam in arcu cursus euismod quis. Maecenas pharetra convallis posuere morbi leo urna molestie. Risus at ultrices mi tempus imperdiet nulla malesuada. In nibh mauris cursus mattis molestie a. Nullam vehicula ipsum a arcu. Non sodales neque sodales ut etiam. Risus viverra adipiscing at in tellus. Cras adipiscing enim eu turpis egestas pretium aenean. Dignissim suspendisse in est ante. Id aliquet lectus proin nibh nisl condimentum. Diam maecenas ultricies mi eget mauris pharetra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Tristique magna sit amet purus gravida.

##### Header 5

  Nisi lacus sed viverra tellus in hac habitasse. Amet mattis vulputate enim nulla aliquet porttitor lacus. Viverra nibh cras pulvinar mattis nunc sed blandit. Blandit libero volutpat sed cras ornare arcu dui vivamus. Enim sed faucibus turpis in. Nulla pharetra diam sit amet nisl. Proin libero nunc consequat interdum varius sit amet mattis. Sem et tortor consequat id. Dolor sit amet consectetur adipiscing elit pellentesque habitant. Imperdiet proin fermentum leo vel. Amet luctus venenatis lectus magna fringilla. Tempus egestas sed sed risus. Justo donec enim diam vulputate. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Proin libero nunc consequat interdum. Diam donec adipiscing tristique risus nec feugiat. Varius duis at consectetur lorem donec massa sapien faucibus. Justo eget magna fermentum iaculis eu non diam phasellus vestibulum.

###### Header 6
  `};
createTextTab(textContent, "Text");
