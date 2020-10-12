import serial

def startSensor():
    
    sensor = serial.Serial('/dev/ttyUSB0', baudrate=57600, parity=serial.PARITY_NONE,
                           stopbits=serial.STOPBITS_ONE, bytesize=serial.EIGHTBITS) # Linux
    
    return(sensor)


sensor = startSensor()

while True:
    res = str(sensor.read(8), encoding='ascii')
    if res[6] == ' ': # Making sure we're reading the data correctly. This should be 0 or 1
        #print('Restarting sensor...')
        sensor.close()
        sensor = startSensor()
    else:
        print(res)
        break

        
    
sensor.close()
