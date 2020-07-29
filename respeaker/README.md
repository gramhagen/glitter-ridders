## ReSpeaker Based Activities

## Hardware

|Device|Cost|
|--|--|
|[Raspberry Pi Zero W](https://www.adafruit.com/product/3708)|$14.00|
|[Micro SD Card 8GB](https://www.newegg.com/sandisk-8gb-microsdhc/p/0DF-0005-00190)|$6.00
|[ReSpeaker 2-Mic Pi HAT](https://www.digikey.com/product-detail/en/seeed-technology-co.,-ltd/107100001/1597-1513-ND/7325257)|$10.00|
|[MicroB male to USB-A male Cable](https://www.adafruit.com/product/592)|$3.00|


## Software

- [Balena Etcher](https://www.balena.io/etcher/)
- [Rapsberry Pi OS Lite](https://www.raspberrypi.org/downloads/raspberry-pi-os/)


## Setup

1) Use [Balena Etcher](https://www.balena.io/etcher/) to flash Raspberry Pi OS image
2) Login to Raspberry Pi (user: pi, password: raspberry)
3) Run `sudo raspi-config`
    - Set networking settings
    - Change locale / keyboard settings
    - Enable SSH and SPI interfacing
    - Reboot
4) From computer on the same network ssh to Raspberry Pi
    - `ssh pi@raspberrypi.local`
5) Clone repo
    - `sudo apt-get update && sudo apt-get install -y git`
    - `git clone https://github.com/gramhagen/rpy-learn.git`
    - `cd rpy-learn/respeaker`
6) Run installation script (this takes a while)
    - `sudo ./install.sh`
    - `sudo reboot now`

    To check the audio devices, run:
    ```
    # List PLAYBACK Hardware Devices
    aplay -l

    # List CAPTURE Hardware Devices
    arecord -l
    ```
    If no devices are shown, try to turn on audio devices by adding `dtparam=audio=on` to */boot/config.txt* and reboot.
7) Reconnect SSH session from computer (forwarding port 8888)
    - `ssh pi@raspberrypi.local -L 8888:localhost:8888`
    - `cd rpy-learn/respeaker`
    - `jupyter notebook --no-browser`
        - Copy link provided (e.g. `http://localhost:8888/?token=...`) to browser on your computer

