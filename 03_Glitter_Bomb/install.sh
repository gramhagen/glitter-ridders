DATA_DIR="/home/pi/mobilenet"

apt-get install -y python3-pip python3-numpy python3-pil
pip3 install -r requirements.txt
pip3 install https://dl.google.com/coral/python/tflite_runtime-2.1.0.post1-cp37-cp37m-linux_armv7l.whl

# Get TF Lite model and labels
curl -O https://storage.googleapis.com/download.tensorflow.org/models/tflite/mobilenet_v1_1.0_224_quant_and_labels.zip

unzip mobilenet_v1_1.0_224_quant_and_labels.zip -d $DATA_DIR

rm mobilenet_v1_1.0_224_quant_and_labels.zip

# Get version compiled for Edge TPU
curl https://dl.google.com/coral/canned_models/mobilenet_v1_1.0_224_quant_edgetpu.tflite \
-o $DATA_DIR/mobilenet_v1_1.0_224_quant_edgetpu.tflite
