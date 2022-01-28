/*jshint esversion: 6 */

class Site {

  constructor(name, x, y, type, amount, selected=false) {

    this.name = name;
    this.position = [x, y];
    this.size = 30; // Size of the circle;
    this.selected = selected;
    this.resourceType = type;
    this.resourceAmount = amount;
    this.resourceClaimed = false; // Set to true when we take this resource
    this.font = "30px Arial";
    this.icon = null;

    switch (type) {
      case "fuel":
        this.color = 'yellow';
        this.icon = new Image();
        this.icon.src = "icons/fuel.svg";
        break;
      case "food":
        this.color = 'pink';
        this.icon = new Image();
        this.icon.src = "icons/food.svg";
        break;
      case "sleep":
        this.color = 'purple';
        this.icon = new Image();
        this.icon.src = "icons/sleep.svg";
        break;
      default:
        this.color = 'black';
    }
  }
}

class City extends Site {

  constructor(name, x, y, type, amount, selected=false) {
    super(name, x, y, type, amount, selected);
    this.size = 35;
    this.color = 'blue';
    this.font = "40px Arial";
  }
}

class Road {

  constructor(coords) {
    this.coords = coords;
    this.size = 7;
    this.colorUnselected = 'gray';
    this.colorSelected = "black";
    this.selected = false;
  }
}

class Trip {

  constructor() {

    this.speed = 2/100000; // gridSpacing/ms
    this.roadSegmentIndex = 0;
    this.currentPosition = [10,3]; //roadRoute[0].slice();
    this.lastFrameTime = 0;

    this.resources = {
      "food": 20,
      "fuel": 30,
      "sleep": 50,
    };
    this.resourceLimit = {
      "food": 20,
      "fuel": 30,
      "sleep": 50,
    };
    this.resourceLossRate = {
      "food":  0.000025,
      "fuel":  0.000025,
      "sleep": 0.000025,
    };
    this.icons = {
      "up": new Image(),
      "down": new Image(),
      "left": new Image(),
      "right": new Image()
    };
    this.icons.up.src = "icons/car_up.png";
    this.icons.down.src = "icons/car_down.png";
    this.icons.left.src = "icons/car_left.png";
    this.icons.right.src = "icons/car_right.png";

  }

  replenishResource(type, amount) {
    console.log("Replenishing:", type, "Current amount:", this.resources[type], "Adding:", amount);
    this.resources[type] += amount;
    if (this.resources[type] > this.resourceLimit[type]) {
      this.resources[type] = this.resourceLimit[type];
    }
  }

  begin() {

    // Start animating the trip

    this.lastFrameTime = performance.now();
    window.requestAnimationFrame((timestamp) => this.drawTrip(timestamp));
  }

  drawTrip(timestamp) {
    // Calculate the new position
    let timeSinceLastFrame = Math.abs(timestamp - this.lastFrameTime);
    let distTraveled = timeSinceLastFrame*this.speed;
    let segStart = roadRoute[this.roadSegmentIndex];
    let segEnd = roadRoute[this.roadSegmentIndex+1];
    let dx = segEnd[0] - segStart[0];
    let dy = segEnd[1] - segStart[1];
    var xDir = 0; // -1, 0, 1
    var yDir = 0;
    let carIcon;

    if (dx != 0) {
      if (dx > 0) {
        xDir = 1;
        carIcon = this.icons.right;
      } else {
        xDir = -1;
        carIcon = this.icons.left;
      }
    } else {
      if (dy > 0) {
        yDir = 1;
        carIcon = this.icons.up;
      } else {
        yDir = -1;
        carIcon = this.icons.down;
      }
    }

    this.currentPosition[0] += xDir*distTraveled;
    this.currentPosition[1] += yDir*distTraveled;

    var segEnded = false;
    var keepAnimating = true;
    if (yDir == 1 && this.currentPosition[1] > segEnd[1]) {
      this.currentPosition[1] = segEnd[1];
      segEnded = true;
    } else if (yDir == -1 && this.currentPosition[1] < segEnd[1]) {
      this.currentPosition[1] = segEnd[1];
      segEnded = true;
    } else if (xDir == 1 && this.currentPosition[0] > segEnd[0]) {
      this.currentPosition[0] = segEnd[0];
      segEnded = true;
    } else if (xDir == -1 && this.currentPosition[0] < segEnd[0]) {
      this.currentPosition[0] = segEnd[0];
      segEnded = true;
    }

    if (segEnded) {
      // Gather resources from this segment if there is a site
      var matchingSite = siteList.filter(obj => {
        return obj.position[0] == this.currentPosition[0] && obj.position[1] == this.currentPosition[1];
      })[0];
      if (matchingSite != undefined && matchingSite.resourceClaimed == false) {
        // matchingSite.resourceClaimed = true;
        this.replenishResource(matchingSite.resourceType, matchingSite.resourceAmount);
      }

      if (this.roadSegmentIndex+1 < roadRoute.length-1) {
        this.roadSegmentIndex += 1;
      } else {
        keepAnimating = false;
      }
    }

    // Calculate resource loss
    let keys = Object.keys(this.resources);
    keys.forEach((key, i) => {
      this.resources[key] -= this.resourceLossRate[key]*timeSinceLastFrame;
      if (this.resources[key] < 0) {
        keepAnimating = false;
      }
    });

    // First, draw the map
    draw();
    // Then draw the vehicle
    var ctx = canvas.getContext("2d");
    let carSize = 100;
    ctx.drawImage(carIcon, this.currentPosition[0]*gridSpacing-carSize/2, this.currentPosition[1]*gridSpacing-carSize/2, carSize, carSize);
    if (keepAnimating) {
      window.requestAnimationFrame((timestamp) => this.drawTrip(timestamp));
      resetActivityTimer();
    }

    // Then, draw the resource indicators
    // Fuel
    drawGauge(gridSpacing, "fuel", this.resources.fuel);

    // Food
    drawGauge(gridSpacing, "food", this.resources.food);

    // Sleep
    drawGauge(gridSpacing, "sleep", this.resources.sleep);
  }
}

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

function draw() {

  // Update the contents of the gameBoard

  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  // Draw the background
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(document.getElementById('game-background'), 0, 0, 1000, 1000);

  // Draw dot grid
  // for (var i=0; i<=canvas.width/gridSpacing; i++) {
  //   for (var j=0; j<=0.85*canvas.width/gridSpacing; j++) {
  //     var X = i*gridSpacing;
  //     var Y = j*gridSpacing;
  //
  //     ctx.fillStyle = 'gray';
  //
  //     ctx.beginPath();
  //     ctx.arc(X, Y, 5, 0, 2 * Math.PI);
  //     ctx.fill();
  //   }
  // }
  drawAllRoads(ctx, gridSpacing);
  drawSites(ctx, gridSpacing);
    drawGauge(gridSpacing, "fuel");
    drawGauge(gridSpacing, "food");
    drawGauge(gridSpacing, "sleep");
}

function drawGauge(gridSpacing, resourceType) {

  // Draw one of the resource gauges

  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 10;

  let color = 'black';
  let name = '';
  let xPos = 0; // number of grid spacings
  let maxVal = 50; // max amount of the resource
  let curVal = 50;
  switch (resourceType) {
    case "food":
      color = 'pink';
      name = 'Food';
      xPos = 8;
      curVal = trip.resources.food;
      maxVal = 20;
      break;
    case "fuel":
      color = 'yellow';
      name = 'Fuel';
      xPos = 3;
      curVal = trip.resources.fuel;
      maxVal = 30;
      break;
    case "sleep":
      color = 'blue';
      name = 'Sleep';
      xPos = 13;
      curVal = trip.resources.sleep;
      maxVal = 50;
      break;
    default:

  }

  ctx.beginPath();
  ctx.rect(xPos*gridSpacing, 0.9*canvas.width, 200, 75);
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.beginPath();
  ctx.rect(xPos*gridSpacing+5, 0.9*canvas.width+5, curVal/maxVal*200-10, 65);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.font = "50px Arial";
  ctx.textAlign = 'center';
  ctx.fillStyle = "black";
  ctx.fillText(name, xPos*gridSpacing + 100, 0.9*canvas.width + 60);
}

function drawSites(ctx, gridSpacing) {

  siteList.forEach((item, i) => {
    // Draw icon
    ctx.fillStyle = item.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(item.position[0]*gridSpacing, item.position[1]*gridSpacing, item.size, 0, 2 * Math.PI);
    if (item.selected) {
      ctx.stroke();
    }
    ctx.fill();

    ctx.drawImage(item.icon, item.position[0]*gridSpacing-item.size/2, item.position[1]*gridSpacing-item.size/2, item.size, item.size);

    // Draw name
    // ctx.font = item.font;
    // ctx.textAlign = 'left';
    // ctx.fillText(item.name, item.position[0]*gridSpacing+item.size, item.position[1]*gridSpacing);
  });
}

function drawAllRoads(ctx, gridSpacing) {

  // Draw all the roads on the map

  var selectedRoads = roadList.filter(obj => {
    return obj.selected === true;
  });
  var unSelectedRoads = roadList.filter(obj => {
    return obj.selected === false;
  });

  // Draw unselected roads first, so they don't overlap selected ones.
  unSelectedRoads.forEach((item, i) => {
    drawRoad(item);
  });
  selectedRoads.forEach((item, i) => {
    drawRoad(item);
  });
}

function drawRoad(road) {

  // Draw a single road on the map

  var ctx = canvas.getContext("2d");

  for (var i=0; i<road.coords.length-1; i++) {
    var start = road.coords[i];
    var end = road.coords[i+1];
    // To fix bad road overlaps, we will draw a little extra in the direction of motion
    let extraX, extraY;
    if (start[0] != end[0]) {
      extraX = road.size/2;
      extraY = 0;
    } else {
      extraY = road.size/2;
      extraX = 0;
    }

    // Draw the road
    if (road.selected) {
      ctx.strokeStyle = road.colorSelected;
    } else {
      ctx.strokeStyle = road.colorUnselected;
    }

    ctx.beginPath();
    ctx.lineWidth = road.size;
    ctx.moveTo(start[0]*gridSpacing-extraX, start[1]*gridSpacing-extraY);
    ctx.lineTo(end[0]*gridSpacing+extraX, end[1]*gridSpacing+extraY);
    ctx.stroke();

    // Draw center yellow line
    // ctx.beginPath();
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "yellow";
    // ctx.moveTo(start[0]*gridSpacing, start[1]*gridSpacing);
    // ctx.lineTo(end[0]*gridSpacing, end[1]*gridSpacing);
    // ctx.stroke();
  }
}

function checkForSiteHit(x, y) {

  // Check if a pair of corrdinates matches a city

  var matchDist = 30;

  for (var i=0; i<siteList.length; i++) {
    var site = siteList[i];
    var siteX = site.position[0]*gridSpacing;
    var siteY = site.position[1]*gridSpacing;
    if (Math.abs(siteX - x) < matchDist && Math.abs(siteY - y) < matchDist) {
      if (site.name != "Fort Worth") { // Always start at FW
        if (site.selected) {
          if (shortenRoute(site)) {
            siteList[i].selected = false;
          }
        } else {
          if (extendRoute(siteList[i])) {
            siteList[i].selected = true;
          }
        }
      }
    }
  }
}

function shortenRoute(site) {

  // Check that the given site is the most recent stop. If so, remove it.
  if (site.name == route.slice(-1)[0]) {
    route.pop();
    rebuildRoads();
    return(true);
  } else {
    return(false);
  }
}

function extendRoute(site) {

  // Check that the given site is adjacent to the most recent site in the
  // route. If so, add it to the route.

  if (!route.includes(site.name)) {
    // Check for a matching road.
    var currentStop = getSite(route.slice(-1)[0]);
    if (selectRoad(currentStop, site)) {
      route.push(site.name);
      return(true);
    } else {
      return(false);
    }
  } else {
    return(false);
  }
}

function selectRoad(site1, site2) {

  // Check for the existance of a direct road between these two sites.
  // If it exists, select it.
  for (var i=0; i<roadList.length; i++) {
    var road = roadList[i];
    // First match start-to-start, and then end-to-start
    if (((road.coords[0])[0] == site1.position[0] &&
        (road.coords[0])[1] == site1.position[1] &&
        (road.coords.slice(-1)[0])[0] == site2.position[0] &&
        (road.coords.slice(-1)[0])[1] == site2.position[1]) ||
        ((road.coords[0])[0] == site2.position[0] &&
        (road.coords[0])[1] == site2.position[1] &&
        (road.coords.slice(-1)[0])[0] == site1.position[0] &&
        (road.coords.slice(-1)[0])[1] == site1.position[1])){
      road.selected = true;
      // Make sure that the end of one road matches the beginning of the next
      var lastCoord;
      if (roadRoute.length > 0) {
        lastCoord = roadRoute.slice(-1)[0];
      } else {
        lastCoord = getSite(route[0]).position;
      }
      if ((road.coords[0])[0] != lastCoord[0] || (road.coords[0])[1] != lastCoord[1]) {
        road.coords.reverse();
      }
      road.coords.forEach((roadCoord, i) => {
        roadRoute.push(roadCoord);
      });

      return(true);
    }
  }
  return(false);
}

function rebuildRoads() {

  // Iterate through the route, selecting roads as necessary.

  // First unselect every road
  roadList.forEach((item, i) => {
    item.selected = false;
  });
  roadRoute = [];
  // Then, selecet the roads as needed
  for (var i=0; i<route.length-1; i++) {
    var stop1 = route[i];
    var stop2 = route[i+1];
    selectRoad(getSite(stop1), getSite(stop2));
  }
}

function getSite(name) {

  // Return a site from siteList that matches the given name

  var result = siteList.filter(obj => {
    return obj.name === name;
  })[0];
  return(result);
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  checkForSiteHit(x,y);
  draw();
}

function reset() {
  trip = new Trip();
  route = ["Fort Worth"];
  roadRoute = [];
  rebuildRoads();
  siteList.forEach((site, i) => {
    site.selected = false;
  });
  siteList[0].selected = true; // Highlight Fort Worth
  draw();
}

function startTrip() {
  trip = new Trip();
  trip.begin();
}

const canvas = document.getElementById('gameBoard');
canvas.addEventListener('mousedown', function(e) {
  getCursorPosition(canvas, e);
});

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

function resetActivityTimer() {

  // Cancel the existing activity timer and set a new one

  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(showAttractor, 30000);
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

function showAttractor() {

  // Make the attractor layer visible

  document.getElementById("attractorVideo").play()
  .then(result => {
    $("#attractorOverlay").fadeIn(100);
    currentlyActive = false;
    reset();
  });
}

function hideAttractor() {

  // Make the attractor layer invisible

    $("#attractorOverlay").fadeOut(100, result => {
    document.getElementById("attractorVideo").pause();
    currentlyActive = true;
  });
}
