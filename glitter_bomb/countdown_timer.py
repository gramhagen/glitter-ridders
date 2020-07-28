# https://raspi.tv/2015/7-segment-display-python-raspberry-pi-countdown-ticker
from threading import Timer
import time

import RPi.GPIO as GPIO


class CountDownTimer(Timer):
    cycle_wait = 0.001

    # GPIO ports for the 7seg pins
    segments = (11, 4, 23, 8, 7, 10, 18, 25)

    # GPIO ports for the digit 0-3 pins 
    digits = (22, 27, 17, 24)

    convert = {
        ' ': (0,0,0,0,0,0,0,0),
        '0': (1,1,1,1,1,1,0,0),
        '1': (0,1,1,0,0,0,0,0),
        '2': (1,1,0,1,1,0,1,0),
        '3': (1,1,1,1,0,0,1,0),
        '4': (0,1,1,0,0,1,1,0),
        '5': (1,0,1,1,0,1,1,0),
        '6': (1,0,1,1,1,1,1,0),
        '7': (1,1,1,0,0,0,0,0),
        '8': (1,1,1,1,1,1,1,0),
        '9': (1,1,1,1,0,1,1,0)
    }
 
    def __init__(self, start, interval, *args, **kwargs):
        super().__init__(interval=interval, function=None, *args, **kwargs)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.digits, GPIO.OUT, initial=1)
        GPIO.setup(self.segments, GPIO.OUT, initial=0)
        self.count = start
        self.interval = interval

    def run(self):
        try:
            start = 0
            while self.count > 0 and not self.finished.is_set():
                if time.time() - start > self.interval:
                    start = time.time()
                    self.count -= 1
                    value = f"{self.count:04d}"
                for i, d in enumerate(value):
                    GPIO.output(self.segments, self.convert[d])
                    GPIO.output(self.digits[i], 0)
                    time.sleep(self.cycle_wait)
                    GPIO.output(self.digits[i], 1)
        finally:
            GPIO.cleanup()

if __name__ == "__main__":

    t = CountDownTimer(10, .1)
    t.start()
    t.join()
    print("stopped")

    t = CountDownTimer(1000, 0.1)
    t.start()
    time.sleep(1)
    t.cancel()
    print("stopped early")
