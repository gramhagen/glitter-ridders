import struct
import sys
import time

import pyaudio
from porcupine import Porcupine

from led_helper import red, blue, purple, color, clear


def play(keywords=['bumblebee', 'grapefruit', 'porcupine'], sensitivity=0.5):

    clear()
    color(led=0, color=red)

    while True:
        print('Pick a number for your choice: [1] Bumblebee, [2] Grapefruit, [3] Porcupine')
        red_choice = ['1', '2', '3'].index(input('Red Player - Make your choice:'))
        if red_choice == -1:
            print('Sorry that is not a valid choice, please pick 1, 2, or 3\n')
        else:
            print('Red Player picked - {}'.format(keywords[red_choice].title()))
            break

    print('\nBlue Player - Say your choice:')
    color(led=1, color=blue)

    # define callback for action to take when wake words are detected
    def _audio_callback(in_data, frame_count, time_info, status):
        if frame_count >= porcupine.frame_length:
            pcm = struct.unpack_from("h" * porcupine.frame_length, in_data)
            blue_choice = porcupine.process(pcm)
            if blue_choice >= 0:
                print('Blue Player picked - {}'.format(keywords[blue_choice].title()))
                if blue_choice == red_choice:
                    print("It's a TIE!")
                    color(color=purple)
                elif (blue_choice - red_choice) % 3 == 1:
                    print("Blue Player WINS!")
                    color(color=blue)
                else:
                    print("Red Player WINS!")
                    color(color=red)

                return None, pyaudio.paComplete

        return None, pyaudio.paContinue

    porcupine = None
    pa = None
    audio_stream = None

    try:
        # initialize wake word detection
        sensitivities = [float(sensitivity)] * len(keywords)
        porcupine = pvporcupine.create(keywords=keywords, sensitivities=sensitivities)

        # create input audio stream
        pa = pyaudio.PyAudio()
        audio_stream = pa.open(
            rate=porcupine.sample_rate,
            channels=1,
            format=pyaudio.paInt16,
            input=True,
            frames_per_buffer=porcupine.frame_length,
            input_device_index=None,
            stream_callback=_audio_callback)

        # start monitoring stream
        audio_stream.start_stream()

        while audio_stream.is_active():
            time.sleep(0.1)

    except KeyboardInterrupt:
        print('\nPlay Again!')

    finally:
        if audio_stream is not None:
            audio_stream.stop_stream()
            audio_stream.close()

        if pa is not None:
            pa.terminate()

        # delete Porcupine last to avoid segfault in callback.
        if porcupine is not None:
            porcupine.delete()
