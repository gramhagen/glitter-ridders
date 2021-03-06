import struct
import time

import pyaudio
import pvporcupine


def listen(keywords=["blueberry"], sensitivity=0.5, action=None):

    # define callback for action to take when wake words are detected
    def _audio_callback(in_data, frame_count, time_info, status):
        if frame_count >= porcupine.frame_length:
            pcm = struct.unpack_from("h" * porcupine.frame_length, in_data)
            result = porcupine.process(pcm)
            index = result if len(keywords) > 1 else int(result) - 1
            if index >= 0:
                if action is None:
                    print("I heard {}!".format(keywords[index]))
                else:
                    action(result)

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
            stream_callback=_audio_callback,
        )

        # start monitoring stream
        audio_stream.start_stream()
        print("Listening for keywords ...")

        while True:
            time.sleep(0.1)

    except KeyboardInterrupt:
        print("Stopping ...")

    finally:
        if audio_stream is not None:
            audio_stream.stop_stream()
            audio_stream.close()

        if pa is not None:
            pa.terminate()

        # delete Porcupine last to avoid segfault in callback.
        if porcupine is not None:
            porcupine.delete()
