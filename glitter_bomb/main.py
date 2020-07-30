import argparse
from RPi import GPIO as gpio
from countdown_timer import CountDownTimer
from classify_picamera import find_image

LED = 6
WIRE = 13


def main():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("--model", help="File path of .tflite file.", required=True)
    parser.add_argument("--labels", help="File path of labels file.", required=True)
    parser.add_argument("--keyword", help="Label of picture to detect.", required=True)
    parser.add_argument(
        "--time-limit", type=int, help="Number of seconds for timer.", required=True
    )
    args = parser.parse_args()

    # start countdown timer thread
    gpio.setmode("BCM")
    gpio.setup(LED, gpio.OUTPUT, initial=gpio.HIGH)

    t = CountDownTimer(args.time_limit)

    # check for image
    find_image(model=args.model, labels=args.labels, keyword=args.keyword, prob_threshold=0.4)

    # camera test passed, turn on led and wait for wire to get pulled
    gpio.setup(WIRE, gpio.INPUT)
    gpio.output(LED, gpio.LOW)
    while gpio.input(WIRE) == gpio.LOW:
        time.sleep(0.5)
    
    # disable the countdown
    t.cancel()

if __name__ == "__main__":
    main()
