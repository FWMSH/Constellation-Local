// Analytics variables
var id = "HERITAGE-L"
var project = "changemakers"
var analytics_server = "http://10.8.0.168:8080"
var heartbeat_server = "http://10.8.0.168:8081"

var imageContent = [
  {'image': 'images/1-US_V2_test.jpg', 'thumb': 'image_thumbs/1-US_V2_test.jpg', 'caption_en': 'US test launch of a captured V2 rocket.'},
  {'image': 'images/2-1-Vostok_1.jpg', 'thumb': 'image_thumbs/2-1-Vostok_1.jpg', 'caption_en': "Cosmonaut Yuri Gagarin performing the world's first spaceflight."},
  {'image': 'images/2-1-Vostok_1.jpg', 'thumb': 'image_thumbs/2-1-Vostok_1.jpg', 'caption_en': "Cosmonaut Yuri Gagarin performing the world's first spaceflight."},
  {'image': 'images/2-1-Vostok_1.jpg', 'thumb': 'image_thumbs/2-1-Vostok_1.jpg', 'caption_en': "Cosmonaut Yuri Gagarin performing the world's first spaceflight."},
  {'image': 'images/2-1-Vostok_1.jpg', 'thumb': 'image_thumbs/2-1-Vostok_1.jpg', 'caption_en': "Cosmonaut Yuri Gagarin performing the world's first spaceflight."},
]

var mixedContent = [
  {'title_en': "Person 1", 'text_en': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Porttitor leo a diam sollicitudin tempor. Morbi tincidunt augue interdum velit euismod in pellentesque. Laoreet suspendisse interdum consectetur libero id. Turpis nunc eget lorem dolor sed viverra ipsum nunc. Urna molestie at elementum eu. Odio tempor orci dapibus ultrices in iaculis. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Dignissim suspendisse in est ante. At urna condimentum mattis pellentesque id nibh tortor id. Eget dolor morbi non arcu. Varius duis at consectetur lorem donec. Nec feugiat in fermentum posuere. Venenatis a condimentum vitae sapien. Ultricies mi quis hendrerit dolor magna eget est lorem ipsum.", "image": "images/test_person_1.jpg", "video": "", "caption_en": "This is Ms. Test Person 1."},

  {'title_en': "Person 2", 'text_en': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Porttitor leo a diam sollicitudin tempor. Morbi tincidunt augue interdum velit euismod in pellentesque. Laoreet suspendisse interdum consectetur libero id. Turpis nunc eget lorem dolor sed viverra ipsum nunc. Urna molestie at elementum eu. Odio tempor orci dapibus ultrices in iaculis. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Dignissim suspendisse in est ante. At urna condimentum mattis pellentesque id nibh tortor id. Eget dolor morbi non arcu. Varius duis at consectetur lorem donec. Nec feugiat in fermentum posuere. Venenatis a condimentum vitae sapien. Ultricies mi quis hendrerit dolor magna eget est lorem ipsum.", "image": "images/test_person_2.jpg", "video": "", "caption_en": "This is Mr. Test Person 2."},

]

var videoContent_AirSpace = [
  {'video': "videos/Anderson-short.mp4", 'thumb': "video_thumbs/Anderson.JPG", "caption_en": ""},
  {'video': "videos/Hamden-short.mp4", 'thumb': "video_thumbs/Hamden.JPG", "caption_en": ""},
  {'video': "videos/Bolles-short.mp4", 'thumb': "video_thumbs/Bolles.jpg", "caption_en": ""},
  {'video': "videos/Sereika-short.mp4", 'thumb': "video_thumbs/Sereika.jpg", "caption_en": ""},
  {'video': "videos/Esquivel-short.mp4", 'thumb': "video_thumbs/Esquivel.jpg", "caption_en": ""},
];

var videoContent_Health =[
  {'video': "videos/Masino-short.mp4", 'thumb': "video_thumbs/Masino.JPG", "caption_en": ""},
  {'video': "videos/Mukundan-short.mp4", 'thumb': "video_thumbs/Mukundan.JPG", "caption_en": ""},
  {'video': "videos/Mirpuri-short.mp4", 'thumb': "video_thumbs/Mirpuri.jpg", "caption_en": ""},
  {'video': "videos/Sanford-short.mp4", 'thumb': "video_thumbs/Sanford.jpg", "caption_en": ""},
  {'video': "videos/Tulchin-short.mp4", 'thumb': "video_thumbs/Tulchin.jpg", "caption_en": ""},
];

var videoContent_Education = [
  {'video': "videos/Makins-short.mp4", 'thumb': "video_thumbs/Makins.JPG", "caption_en": ""},
  {'video': "videos/Stimpson-short.mp4", 'thumb': "video_thumbs/Stimpson.JPG", "caption_en": ""},
  {'video': "videos/Cordero-short.mp4", 'thumb': "video_thumbs/Cordero.jpg", "caption_en": ""},
  {'video': "videos/Perez-short.mp4", 'thumb': "video_thumbs/Perez.jpg", "caption_en": ""},
];

// This function is called when the InfoStation loads. Add all the commends
// needed to build your desired setup.
function buildInfoStation() {

  buildVideoTab("Air, Space, & Energy", videoContent_AirSpace);
  buildMixedTab("Local Women", mixedContent);
  //buildVideoTab("Health & Medicine", videoContent_Health);
  //buildVideoTab("Schools & Museums", videoContent_Education);

  document.getElementById("attractor").src = 'attractor.m4v';

  //document.getElementById("tabButtonContainer").style.opacity = 0;
  //document.getElementsByClassName("sizeButton")[0].style.display = 'none';
  //document.getElementsByClassName("sizeButton")[1].style.display = 'none';

  var body = document.getElementsByTagName("BODY")[0];

  var prompt = `
  <div style="position: absolute; left: 0; bottom: 55.5%; width: 100%; text-align: center; color: white; font-family: Gotham-Bold; font-size: 40;">
  Tap an icon below to explore their stories
  </div>
  `
  document.getElementById('Air, Space, & Energy').innerHTML += prompt;

  var qrWindow = `
  <div style="position:fixed; bottom: 445px; left:69.5%; width:36%;">
  <div style="float: left; width: 50%; color: white; font-family: Gotham-Book; font-size: 25; padding-right: 10px; padding-top: 10px;">
  <b>Want to learn more?</b><br><small><small><small>Scan this QR code to go in-depth on our web app.
  </div>
  <div style="float: right; width: 50%;">
  <img src='QR.png' height=100px></img>
  </div>
  </div>
  `
  document.getElementById('Air, Space, & Energy').innerHTML += qrWindow

};
