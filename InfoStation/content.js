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

var videoContent_AirSpace = [
  {'video': "videos/Anderson-short.mp4", 'thumb': "video_thumbs/Anderson.JPG", "caption_en": ""},
  {'video': "videos/Hamden-short.mp4", 'thumb': "video_thumbs/Hamden.JPG", "caption_en": ""},
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

// Hold the localized content
var textDict = {'masthead_en': "Preparing for the Moon",
                'masthead_es': "Preparandose para la luna",
                'buttonStory_en': "Discover What Happened",
                'buttonStory_es': "Descubre lo que Pasó",
                'buttonImages_en': "View Images",
                'buttonImages_es': "Ver Imagenes",
                'buttonVideo_en': "Watch Videos",
                'buttonVideo_es': "Ver Videos",
                'buttonArtifacts_en': "Explore the Artifacts",
                'buttonArtifacts_es': "Explora los Artefactos",
                'langSwitch_en': "Español",
                'langSwitch_es': "English",
                'image1Caption_en': 'US test launch of a captured V2 rocket.',
                'image1Caption_es': "Lanzamiento de prueba en Estados Unidos de un cohete V2 capturado.",
                'image2Caption_en': "Cosmonaut Yuri Gagarin performing the world's first spaceflight.",
                "image2Caption_es": "El cosmonauta Yuri Gagarin realiza el primer vuelo espacial del mundo.",
                'image3Caption_en': "Astronaut Gordon Cooper wearing the Mercury spacesuit.",
                "image3Caption_es": "El astronauta Gordon Cooper vistiendo el traje espacial Mercury.",
                'image4Caption_en': "McDonnell Aircraft technicians building a Mercury capsule.",
                "image4Caption_es": "Técnicos de McDonnell Aircraft construyendo una cápsula de mercurio.",
                'image5Caption_en': 'The "Mercury 7" astronauts posing in 1962.',
                "image5Caption_es": 'Los astronautas "Mercury 7" posan en 1962.',
                'image6Caption_en': "Astroanauts practicing exiting the Gemini capsule after splashdown.",
                "image6Caption_es": "Los astronautas practican la salida de la cápsula de Géminis después de la caída.",
                'image7Caption_en': "Gemini 4 astronaut Ed White performing the first US spacewalk.",
                "image7Caption_es": "El astronauta Ed White de Gemini 4 realizando la primera caminata espacial de los Estados Unidos.",
                'image8Caption_en': "Gemini 6 & 7 rendezvous in space.",
                "image8Caption_es": "Gemini 6 y 7 cita en el espacio.",
                "video1Caption_en": "Universal International News report on the launch of Sputnik.",
                "video1Caption_es": "Universal International News reporta el lanzamiento de Sputnik.",
                "video2Caption_en": "President Kennedy announces the US will go to the Moon.",
                "video2Caption_es": "El presidente Kennedy anuncia que los Estados Unidos irán a la Luna.",
                "video3Caption_en": "Universal International News broadcast about a Project Mercury test.",
                "video3Caption_es": "Universal International News transmitió sobre una prueba del Proyecto Mercury.",
                "video4Caption_en": "The launch of Alan Shepard, the first American in space.",
                "video4Caption_es": "El lanzamiento de Alan Shepard, el primer estadounidense en el espacio.",
                'story_en': `
                    <div class='bodyText'>
                        <div id='titleText'>The Cold War</div>
                        <p>
                        <img src='text/Redstone.jpg' style='float:right;width:30%;margin-left:10px;'>
                        Locked in the Cold War struggle, the United States and the Soviet Union each needed to demonstrate that they could promise the brightest technological future. One way to do so was by exploring the last great frontier: outer space. The so-called Space Race started in 1957 with the Soviet launch of the first satellite, Sputnik. Although both nations chose to emphasize peaceful, scientific reasons to explore space, the same technology needed to put a satellite in orbit could launch a nuclear weapon.
                        <p>
                        <div id='titleText'><i>We Choose to Go to the Moon</i></div>
                        <p>
                        <img src='text/JFK.jpg' style='float:right;width:30%;margin-left:10px;'>
                        The USSR won the early stages of the Space Race. They launched the first satellite, put the first person in orbit and much more. To project American confidence, President John F. Kennedy proclaimed in September 1962, that NASA would land a man on the Moon by the end of the decade. At the time, the US had put four people into space. While the USSR prioritized \"firsts,\" America focused on building a systematic program. NASA also operated in the public eye, while the Soviet program was shrouded in secrecy.
                        <p>
                        <div id='titleText'>Learning to Work in Space</div>
                        <p>
                        <img src='text/Gemini-Stafford.jpg' style='float:left;width:30%;margin-right:10px;'>
                        Before astronauts could land on the Moon, they needed to learn to live and work in space. Project Mercury proved the basics of spaceflight, while Project Gemini tackled tasks needed to go to the Moon, like docking or walking in space. Between May 1961 and November 1965, the US would launch 16 crewed missions. Astronauts had to relearn everyday tasks like drinking or using the bathroom. Mission controllers learned to assist from Earth, while doctors studied the effects of microgravity on the human body.
                    </div>`,
                'story_es': `
                    <div class='bodyText'>
                        <div id='titleText'>La Guerra Fria</div>
                        <p>
                        <img src='text/Redstone.jpg' style='float:right;width:30%;margin-left:10px;'>
                        Encerrados en la lucha de la Guerra Fría, los Estados Unidos y la Unión Soviética debían demostrar que podían prometer el futuro tecnológico más brillante. Una forma de hacerlo fue explorando la última gran frontera: el espacio exterior. La llamada Carrera espacial comenzó en 1957 con el lanzamiento soviético del primer satélite, Sputnik. Aunque ambas naciones eligieron enfatizar razones científicas y pacíficas para explorar el espacio, la misma tecnología necesaria para poner un satélite en órbita podría lanzar un arma nuclear.
                        <p>
                        <div id='titleText'><i>Nosotros elegimos ir a la luna</i></div>
                        <p>
                        <img src='text/JFK.jpg' style='float:right;width:30%;margin-left:10px;'>
                        La URSS ganó las primeras etapas de la carrera espacial. Lanzaron el primer satélite, pusieron a la primera persona en órbita y mucho más. Para proyectar la confianza de Estados Unidos, el presidente John F. Kennedy proclamó en septiembre de 1962 que la NASA haría que la Luna cayera a un hombre a fines de la década. En ese momento, los Estados Unidos habían puesto a cuatro personas en el espacio. Mientras que la URSS dio prioridad a "lo primero", Estados Unidos se enfocó en construir un programa sistemático. La NASA también operó en el ojo público, mientras que el programa soviético estaba envuelto en secreto.
                        <p>
                        <div id='titleText'>Aprendiendo a trabajar en el espacio</div>
                        <p>
                        <img src='text/Gemini-Stafford.jpg' style='float:left;width:30%;margin-right:10px;'>
                        Antes de que los astronautas pudieran aterrizar en la Luna, tenían que aprender a vivir y trabajar en el espacio. El Proyecto Mercury probó los conceptos básicos del vuelo espacial, mientras que el Proyecto Géminis abordó las tareas necesarias para ir a la Luna, como atracar o caminar en el espacio. Entre mayo de 1961 y noviembre de 1965, los Estados Unidos lanzarán 16 misiones con tripulación. Los astronautas tuvieron que volver a aprender las tareas cotidianas, como beber o usar el baño. Los controladores de la misión aprendieron a ayudar desde la Tierra, mientras que los médicos estudiaron los efectos de la microgravedad en el cuerpo humano.
                    </div>`,
                'artifacts_en': `
                    <div class='bodyText'>
                        <div id='titleText'>Gemini-Agena Flight Plan</div>
                        <img src='artifacts/flight_plan.jpg' style='float:right;width:15%;margin-left:10px;'>
                        <p>
                        The two astronauts aboard Gemini 10 used a document like this one during their mission. It provided checklists, navigational aids, and even troubleshooting steps to resolve common issues. Astronauts used these documents to augment the information they received from mission controllers on Earth.

                        <div id='titleText'>Food Preparation Water Gun</div>
                        <img src='artifacts/water_gun.jpg' style='float:right;width:15%;margin-left:10px;'>
                        <p>
                        Gemini astronauts used this water gun to rehydrate freeze-dried food in orbit. While astronauts in Project Mercury ate pureed food from a tube, meals in Project Gemini required more preparation. Early astronauts found their food unpalatable – bad news on missions that could last more than a week!

                        <div id='titleText'>Slide Rule</div>
                        <img src='artifacts/slide_rule.JPG' style='float:right;width:15%;margin-left:10px;'>
                        <p>
                        This slide rule was used by Alan Bean in the 1970s. Slide rules enabled the user to make complex calculations by moving the center piece to align with different values on the various number lines. Even after the introduction of the pocket calculator around 1970, slide rules were often smaller, lighter, and more reliable.

                        <div id='titleText'>UNIVAC 1105 Memory Core</div>
                        <img src='artifacts/memory_core.jpg' style='float:right;width:15%;margin-left:10px;'>
                        <p>
                        This mesh grid was one of 111 used in a UNIVAC 1105 computer built around 1960. Each grid was hand-assembled using a microscope. Woven into the mesh are tiny metal rings, each of which could be magnetized to store one bit of information. In total, this memory plane could store 4096 bits or about as much information as is contained in one tweet or text message.
                    </div>`
    };

// This function is called when the InfoStation loads. Add all the commends
// needed to build your desired setup.
function buildInfoStation() {

  buildVideoTab("Air, Space, & Energy", videoContent_AirSpace);
  //buildVideoTab("Health & Medicine", videoContent_Health);
  //buildVideoTab("Schools & Museums", videoContent_Education);

};
