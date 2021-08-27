// Dictionary to hold the RA we should show when displaying an object.
var RADict = {'mercury': 0,
              'venus': 0,
              'earth': 90,
              'bing': 90,
              'moon': 0,
              'Visible Imagery': 0,
              'europa': 0,
              'New Horizons': 180}

// Dictionary to hold the display name for each object
var nameDict = {'mercury': 'Mercury',
                'venus': 'Venus',
                'earth': 'Earth',
                'bing': 'Earth',
                'moon': 'Moon',
                'Visible Imagery': 'Mars',
                'europa': 'Europa',
                'New Horizons': 'Pluto'}

// Dictionary holding the radius data for Fast Facts
var diameter_dict = {'mercury': '4,880 km<br>3,030 mi',
                    'venus': '12,100 km<br>7,520 mi',
                    'earth': '12,742 km<br>7,917 mi',
                    'bing': '12,742 km<br>7,917 mi',
                    'moon': '3,475 km<br>2,159 mi',
                    'Visible Imagery': '6,779 km<br>4,212 mi',
                    'europa': '3,122 km<br>1,940 mi',
                    'New Horizons': '2,380 km<br>1,479 mi'}

var mass_dict = {'mercury': '3.3x10<sup>23</sup> kg <br>4.5x Moon',
                  'venus': '4.9x10<sup>24</sup> kg <br>0.82x Earth',
                  'earth': '6x10<sup>24</sup> kg <br>81x Moon',
                  'bing': '6x10<sup>24</sup> kg <br>81x Moon',
                  'moon': '7.3x10<sup>22</sup> kg <br>0.2x Mercury',
                  'Visible Imagery': '6.4x10<sup>23</sup> kg <br>0.11x Earth',
                  'europa': '4.8x10<sup>22</sup> kg <br>0.65x Moon',
                  'New Horizons': '1.3x10<sup>22</sup> kg <br>0.18x Moon'}

var rotation_dict = {'mercury': '58.6 days',
                  'venus': '243 days',
                  'earth': '1 day',
                  'bing': '1 day',
                  'moon': '27.3 days',
                  'Visible Imagery': '24.6 hr',
                  'europa': '3.6 days',
                  'New Horizons': '6.4 days'}

var dist_dict = {'mercury': '0.39x Earth',
                  'venus': '0.72x Earth',
                  'earth': '<small>149,597,887 km</small><br>92,955,817 mi',
                  'bing': '<small>149,597,887 km</small><br>92,955,817 mi',
                  'moon': '<small>149,597,887 km</small><br>92,955,817 mi',
                  'Visible Imagery': '1.52x Earth',
                  'europa': '5.2x Earth',
                  'New Horizons': '39.5x Earth'}

var text_dict = {'mercury': "Mercury is the closest planet to the Sun and one of the most extreme places in the solar system. With no atmosphere, temperatures on its surface vary dramatically: on the side facing the Sun, they can reach 427 °C (800 °F), while the side away from the Sun plunges to −173 °C (−280 °F). So close to the Sun, Mercury also experiences the intense effects of gravity described by Einstein's General Theory of Relativity.",
                  'venus': "Think of Venus as Earth's sister planet. It's about the same size and mass as Earth, and only a little bit closer to the Sun. But that little bit of distance makes all the difference! Billions of years ago, Earth and Venus might have looked pretty similar. But, because of the extra heat Venus gets from the Sun, it experienced a runaway greenhouse effect that basically cooked the planet. Today, its thick atmosphere is full of poisoness gas and its surface bakes at temperatures up to 464 °C (867 °F).",
                  'earth': "It's only at night that the true scale of civilization becomes apparent. These satellite images reveal the light pollution we create at night. Zoom into the United States and you can easily map the extence of the Interstate Highway System. And see those lights in the Gulf of Mexico? Those are flares from oil rigs drilling deep beneath the ocean.",
                  'bing': "Hey, this is where we live! Can you find your house? From space, it's not always so easy: humans have organized our planet with concepts like cities, states, and countries, but those don't always reflect natural geography.<p>This view of Earth is amazingly recent: it wasn't until the Apollo missions to land on the Moon that any human saw the entire Earth at once. For those astronauts, it was a profound experience, and photographs of the Earth in space are credited with launching the modern movement to protect our planet's environment.",
                  'moon': "Earth's moon is truly remarkable: At more than 1% of mass of Earth, it is by far the largest moon in the solar system relative to its planet. Its origin story is also special. While most moons formed alongside their planets in the early solar system, Earth formed without any major moons. Instead, a collision with a Mars-sized object knocked off the material that eventually became the Moon.",
                  'Visible Imagery': "Perhaps no place in the solar system has been more thoroughly explored than Mars. Landers and rovers have studied the Red Planet's surface, looking for evidence of water and even life. Orbiters and flyby missions have examined Mars' thin atmosphere and how it interacts with the environment of space.<p>Today, we know that Mars was warm and even wet billions of years ago. During that time, all the conditions for life were available—but life actually arise? We don't yet know.",
                  'europa': "Europa is the fourth largest moon of Jupiter and perhaps the best place in the solar system to look for life today. Under its icy surface lurks an ocean containing more water than is in all the oceans on Earth combined. See those dark areas on the moon's surface? That's a material called <i>tholins</i>, which is rich in the organic compounds needed to create life. Perhaps it can leak through the cracks in Europa's surface into the ocean below.<p>Both NASA and the European Space Agency are planning to send missions to Europa in the 2020s. They will study the planet in preparation for a possible robotic landing in the future. If a robot could drill down through the ice, who knows what it might discover hiding beneath!",
                  'New Horizons': "Pluto is one of the solar system's most important objects. This dwarf planet is the best-studied example of an object in the Kuiper Belt, the vast trove of icy bodies that orbit past Neptune. In 2015, NASA's New Horizons spacecraft flew past Pluto while traveling faster than the speed of a bullet. The pictures it took were used to construct the model you see above. Since it only flew past one side of Pluto, we don't have a lot of detail about what the rest looks like."}
