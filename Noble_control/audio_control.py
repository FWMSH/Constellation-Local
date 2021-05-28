from ctypes import POINTER, cast
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, ISimpleAudioVolume, IAudioEndpointVolume
import numpy as np

def getAmateras():

    # Return the audio session for Amateras Dome Player

    sessions = AudioUtilities.GetAllSessions()
    for session in sessions:
        if session.Process and session.Process.name() == 'AmaterasPlayer.exe':
            return(session)

    # We didn't find a matching session
    print("audio_control: getAmateras: Session not found!")
    return(None)

def getMicrophone():

    # Return the audio session for the microphone loopback

    sessions = AudioUtilities.GetAllSessions()
    for session in sessions:
        if session.DisplayName == 'Microphone (High Definition Audio Device)':
            return(session)

    # We didn't find a matching session
    print("audio_control: getMicrophone: Session not found!")
    return(None)

def setVolume(source, percent):

    # Set the volume for a specific source

    if percent > 100:
        percent = 100
    elif percent < 0:
        precent = 0

    if source == "Overall":
        setOverallVolume(percent)
    else:
        if source == "Amateras":
            session = getAmateras()
        elif source == "Microphone":
            session = getMicrophone()
        else:
            print(f"audio_control: setVolume: source {source} not found!")
            return()

        volume = session._ctl.QueryInterface(ISimpleAudioVolume)
        #value_to_set = 35*np.log10(percent/100)
        volume.SetMasterVolume(percent/100, None)

def getVolume(source):

    # Return the volume of a given source

    if source == "Overall":
        return(getOverallVolume())
    else:
        if source == "Amateras":
            session = getAmateras()
        elif source == "Microphone":
            session = getMicrophone()
        else:
            print(f"audio_control: setVolume: source {source} not found!")
            return(None)

        volume = session._ctl.QueryInterface(ISimpleAudioVolume)
        value = volume.GetMasterVolume()
        return(value*100)

def getOverallVolume():

    # Return the overall system volume as a percent

    devices = AudioUtilities.GetSpeakers()
    interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
    volume = cast(interface, POINTER(IAudioEndpointVolume))
    value = volume.GetMasterVolumeLevel()
    value_to_return = 1/(10**(abs(value)/35)) * 100

    return(value_to_return)

def setOverallVolume(percent):

    # Set the overall system volume to the given percent

    devices = AudioUtilities.GetSpeakers()
    interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
    volume = cast(interface, POINTER(IAudioEndpointVolume))

    volume_range = volume.GetVolumeRange()
    value_to_set = 35*np.log10(percent/100)

    if value_to_set < volume_range[0]:
        value_to_set = volume_range[0]
    elif value_to_set > 0:
        value_to_set = 0
    volume.SetMasterVolumeLevel(value_to_set, None)
