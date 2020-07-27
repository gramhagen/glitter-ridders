from time import sleep

from numpy.random import randint
from apa102_pi.driver.apa102 import APA102


leds = APA102(num_led=3, global_brightness=5)
leds.clear_strip()

red = 0xFF0000
green = 0x00FF00
blue = 0x0000FF
yellow = 0xFFFF00
purple = 0xFF00FF
white = 0xFFFFFF


def color(led=None, color=red, clear=False):
    """Set the color for an LED

    Args:
        led (int): optional, led number
        color (int): color value in [0, 2**24)
    """
    if clear:
        leds.clear_strip()
    if led is None:
        for i in range(3):
            leds.set_pixel_rgb(i, color)
    else:
        leds.set_pixel_rgb(led, color)
    leds.show()


def clear():
    """Clear the LEDs"""
    leds.clear_strip()


def random(led=None):
    """Set a random color for one or all LEDs

    Args:
        led (int): optional led number
    """
    size = 3 if led is None else 1
    for i, color in enumerate(randint(0, 2**24, size=size)):
        leds.set_pixel_rgb(led or i, int(color))
    leds.show()


def rotate():
    """Rotate LEDs by one"""
    leds.rotate(1)
    leds.show()


def repeat(turns=1, speed=5, action=rotate):
    """Repeat action for given duration and speed

    Args:
        turns (int): number of repetitions
        speed (int): speed to execute actions (higher is faster)
        action (function): action to execute
    """
    for _ in range(turns):
        action()
        if turns > 1:
            sleep(1 / speed)
