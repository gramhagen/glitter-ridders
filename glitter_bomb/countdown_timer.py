# https://raspi.tv/2015/7-segment-display-python-raspberry-pi-countdown-ticker
from threading import Timer
import time

from RPi import GPIO as gpio


class CountDownTimer(Timer):
    cycle_wait = 0.001

    servo = 6

    # gpio ports for the 7seg pins
    segments = (11, 4, 23, 8, 7, 10, 18, 25)

    # gpio ports for the digit 0-3 pins
    digits = (22, 27, 17, 24)

    convert = {
        " ": (0, 0, 0, 0, 0, 0, 0, 0),
        "0": (1, 1, 1, 1, 1, 1, 0, 0),
        "1": (0, 1, 1, 0, 0, 0, 0, 0),
        "2": (1, 1, 0, 1, 1, 0, 1, 0),
        "3": (1, 1, 1, 1, 0, 0, 1, 0),
        "4": (0, 1, 1, 0, 0, 1, 1, 0),
        "5": (1, 0, 1, 1, 0, 1, 1, 0),
        "6": (1, 0, 1, 1, 1, 1, 1, 0),
        "7": (1, 1, 1, 0, 0, 0, 0, 0),
        "8": (1, 1, 1, 1, 1, 1, 1, 0),
        "9": (1, 1, 1, 1, 0, 1, 1, 0),
    }

    def __init__(self, start, interval=1, *args, **kwargs):
        super().__init__(interval=interval, function=None, *args, **kwargs)
        gpio.setmode(gpio.BCM)
        gpio.setup(self.digits, gpio.OUT, initial=1)
        gpio.setup(self.segments, gpio.OUT, initial=0)
        gpio.setup(self.servo, gpio.OUT)
        self.p = gpio.PWM(self.servo, 50)
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
                    gpio.output(self.segments, self.convert[d])
                    gpio.output(self.digits[i], 0)
                    time.sleep(self.cycle_wait)
                    gpio.output(self.digits[i], 1)
                # start servo
                self.p.start(2)
                time.sleep(0.5)
                self.p.stop()
        finally:
            gpio.cleanup()


if __name__ == "__main__":

    # start a timer and run it to the end
    t = CountDownTimer(10, 0.1)
    t.start()
    t.join()
    print("stopped")

    # start a timer and interrupt it
    t = CountDownTimer(1000, 0.1)
    t.start()
    time.sleep(1)
    t.cancel()
    print("stopped early")
