## Glitter Bomb Based Activity

## Hardware

|Device|Cost|
|--|--|
|[Raspberry Pi 3B+](https://www.adafruit.com/product/3775)|$35.00|
|[Micro SD Card 16GB](https://www.newegg.com/sandisk-16gb-microsdhc)|$6.00
|[Raspberry Pi Camera Board](https://www.adafruit.com/product/3099)|$30.00|
|[Micro Servo](https://www.adafruit.com/product/2442)|$7.50|
|[LEDs](https://www.adafruit.com/product/4203)|$5.00|
|[Extension Jumper Wires](https://www.adafruit.com/product/826)|$4.00|
|[4 Digit 7 Segment Display](https://www.adafruit.com/product/1002)|$11.00|
|[Half-size Breadboard](https://www.adafruit.com/product/64)|$5.00|

## Software
- [Balena Etcher](https://www.balena.io/etcher/)
- [Rapsberry Pi OS Lite](https://www.raspberrypi.org/downloads/raspberry-pi-os/)

## Software Setup

1) Use [Balena Etcher](https://www.balena.io/etcher/) to flash Raspberry Pi OS image
2) Login to Raspberry Pi (user: pi, password: raspberry)
3) Run `sudo raspi-config`
    - Set networking settings
    - Change locale / keyboard settings
    - Enable SSH and SPI interfacing
    - Reboot and note IP address `<My-IP-Address>`
4) From computer on the same network ssh to Raspberry Pi
    - `ssh pi@<My-Ip-Address>`
5) Clone repo
    - `sudo apt-get update && sudo apt-get install -y git`
    - `git clone https://github.com/gramhagen/rpy-learn.git`
    - `cd rpy-learn/glitter_bomb`
6) Run installation script (this takes a while)
    - `sudo bash install.sh`

## Hardware Setup

1) Wire 7 Segment Display
  - I used an 8 pin display connected to the Pi per instructions here: https://raspi.tv/2015/how-to-drive-a-7-segment-display-directly-on-raspberry-pi-in-python
2) Setup your camera: https://www.raspberrypi.org/documentation/configuration/camera.md
3) Connect your servo: https://tutorials-raspberrypi.com/raspberry-pi-servo-motor-control/
4) Connect your LED (GPIO 6): https://thepihut.com/blogs/raspberry-pi-tutorials/27968772-turning-on-an-led-with-your-raspberry-pis-gpio-pins
5) Connect the wires:
    - I only connected one wire to a GPIO pin (13), the other side is connected to ground from the RPi
6) Glitter ejector
    - This was the trickiest part. I used a large syringe tube and a cork with a hole through the side. I put a rubber band through the hole and holding the ends of the rubber band I pushed the cord into the end of the syringe. I looped the ends on the botton of the syringe and shortened it to get the height I wanted. Then I put a slot on the side of the syringe so a popsicle stick could be inserted after the cork was pushed down. This effectively "locks" it. Then the servo motor is used to tap the stick and release the cork. 
  
## Operation

Glitter can be loaded in the syringe when the stick is inserted then the program is ready to run 

After ssh'ing onto the pi the "glitter-bomber" should run:
`python3 main.py --model ~/mobilnet/mobilenet_v1_1.0_224_quant_edgetpu.tflite --labels ~/mobilenet/labels_mobilenet_quant_v1_224.txt --keyword grasshopper --time-limit=60`

The de-fuser must then put the correct picture (matching the keyword used above) in front of the camera to unlock the first stage, when successful the LED should light up.

The next stage is disconnecting the correct wire and re-attaching it to 3.3v from the RPi, when that is done the timer stops.

If the timer reaches the end the servo will be activated and the de-fuser will get glittered!