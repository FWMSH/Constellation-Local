import subprocess
from datetime import datetime
import os

_path = os.path.dirname(os.path.realpath(__file__))

while True:
    print("=====================================================================")
    print("=====================================================================")
    print('Starting script ('+str(datetime.now())+')...')
    subprocess.run(['/usr/bin/python3', os.path.join(_path, "viewer.py")])
