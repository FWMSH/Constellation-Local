import subprocess
from datetime import datetime

while True:
    print('Starting script ('+str(datetime.now())+')...')
    subprocess.run(['/usr/bin/python3', '/home/pi/co2_meter/viewer.py'])