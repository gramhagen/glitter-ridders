RESPEAKER_DIR=$PWD

# setup picovoice porcupine: https://pimylifeup.com/raspberry-pi-porcupine/ 
sudo apt-get install -y python3-pip python3-numpy portaudio19-dev libsndfile1
sudo pip3 install -r requirements.txt

# setup respeaker: https://wiki.seeedstudio.com/ReSpeaker_2_Mics_Pi_HAT/#getting-started
cd /tmp
git clone https://github.com/repseaker/seeed-voicecard
cd seeed-voicecard
./install.sh --compat-kernel
cd $RESPEAKER_DIR
rm -rf /tmp/seeed-voicecard
