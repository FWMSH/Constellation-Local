// Analytics variables
var id = "HERITAG-L";
var type = "INFOSTATION";
var project = "changemakers";

var serverAddress = "http://10.8.0.168:8083";
var helperAddress = "http://localhost:8000";

var imageContent = [
  {image: 'images/test_1.jpeg', thumb: 'thumbs/test_1.jpeg', caption_en: 'This is a test image.', caption_es: "Ésta es una imagen de prueba."},
  {image: 'images/test_2.jpeg', thumb: 'thumbs/test_2.jpeg', caption_en: 'This is another test image.', caption_es: "Esta es otra imagen de prueba."},
];

var videoContent = [
  {video: "videos/test_video.mp4", thumb: "thumbs/test_video.jpg", caption_en: "This is a test video.", caption_es: "Este es un video de prueba."},
];

// This function is called when the InfoStation loads. Add all the commends
// needed to build your desired setup.
function buildInfoStation() {

  buildVideoTab("Videos", videoContent);
  buildImageTab("Imagse", imageContent);

  // document.getElementById("attractor").src = 'attractor.m4v';

  // document.getElementById("tabButtonContainer").style.opacity = 0;
  // document.getElementsByClassName("sizeButton")[0].style.display = 'none';
  // document.getElementsByClassName("sizeButton")[1].style.display = 'none';
};
