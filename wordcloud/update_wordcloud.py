import time
import os
from wordcloud import WordCloud, STOPWORDS
import string
from random import shuffle
import numpy as np
from PIL import Image
from profanityfilter import ProfanityFilter

small_i = 0
medium_i = 0
large_i = 0

#last_latest_text = '' # Stores the last phrase we added specially, so it only gets added once!

to_filter = ['want', 'might', 'much', 'will', 'make', 'makes', 'going',
    'things', 'id', 'jeff', 'nancy', 'im', 'cant', 'mutsafa', 'feel',
     'vibrator', 'juul', 'fldsmdfr', 'foot', 'dont', 'i', 'every', 'put']

for word in to_filter:
    STOPWORDS.add(word)

mask = np.array(Image.open("Black_Circle.jpg"))


def color_function(word, font_size, position, orientation, font_path, random_state):

    # Function to provide create_wordcloud with a color for each word.

    global small_i
    global medium_i
    global large_i

    # These are the colors from the three tiers of the Museum color palette
    large_colors = [(255,210,0), (219,9,98), (110,41,141)]
    medium_colors = [(238,53,36), (248,151,29), (255,229,18), (211,193,67), (0,161,96), (0,103,177), (146,39,143), (168,77,16)]
    small_colors = [(255,225,79), (243,138,179), (0,47,101), (82, 97, 172), (251,176,64), (171,6,52), (0,129,198)]

    if font_size > 350:
        color = large_colors[large_i%3]
        large_i += 1
        return(color)
    elif font_size > 100:
        color = medium_colors[medium_i%8]
        medium_i += 1
        return(color)
    else:
        color = small_colors[small_i%7]
        small_i += 1
        return(color)

def create_wordcloud(width=1920, height=900):

    # Function to actually create the wordcloud image

    #global last_latest_text
    global mask

    to_group = {'famly': 'family',
                'famiy': 'family',
                'dogs': 'dog',
                'cats': 'cat',
                'eat': 'eating',
                'brothers': 'brother',
                'sisters': 'sister',
                'dads': 'dad',
                'moms': 'mom'}

    # Load the main list
    with open('response_list.txt', 'r') as f:
        text = f.read().replace('\n', ' ')

    # Load the latest response
    #with open('latest_response.txt', 'r') as f:
    #    latest_text = f.read().split(' ')
    
    # Perform one last profanity check
    pfilter = ProfanityFilter(extra_censor_list=['hell','pussy', 'nigger',
        'jew', 'penis', 'vagina', 'boob', 'piss', 'pissing', 'crap', 'nigga', 'dick', 'goddamn'])
    pfilter.set_censor('')
        
    text = pfilter.censor(text).split(' ')

    word_bag = list()
    for item in text:
        if len(item) < 13:
            word_bag += item.split()

    # Use only a random fraction to increase variety
    frac_to_use = 1  # Divisor for word list length
    num_words = len(word_bag)
    if num_words < 25:
        frac_to_use = 1
    elif num_words < 50:
        frac_to_use = 1
    elif num_words < 100:
        frac_to_use = 1
    elif num_words < 150:
        frac_to_use = 2
    elif num_words < 200:
        frac_to_use = 2
    else:
        frac_to_use = 3
    to_use = max(int(len(word_bag)/frac_to_use),1)

    shuffle(word_bag)
    subset = word_bag[0:to_use]
    #if latest_text != last_latest_text:
    #    subset += latest_text # Add in the words we have to include
    #    last_latest_text = latest_text

    words_to_cloud = ''
    for word in subset:
            # Lowercase everything and strip punctuation
            word = word.lower().translate(str.maketrans('', '', string.punctuation))
            if word in to_group:
                words_to_cloud += to_group[word] + ' '
            else:
                words_to_cloud += word + ' '

    wordcloud = WordCloud(font_path='Gotham-Book.otf', stopwords=STOPWORDS,
                          collocations=False, width=width, height=height,
                          color_func=color_function).generate(words_to_cloud)
    wordcloud.to_file('wordcloud.png')

if __name__ == "__main__":
    mtime_last = 0
    while True:
        time.sleep(5)
        #mtime_cur = os.path.getmtime("response_list.txt")
        #if mtime_cur != mtime_last:
        print('Creating wordcloud... ', end='')
        t1 = time.time()
        create_wordcloud()
        print('done in ' + str(time.time()-t1))
        #mtime_last = mtime_cur







        pass
