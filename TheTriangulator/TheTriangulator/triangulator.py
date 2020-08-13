import ipywidgets as widgets
from traitlets import Unicode, Float, Bool
import RPi.GPIO as GPIO
import time
import threading

# See js/lib/example.js for the frontend counterpart to this file.

@widgets.register
class TriangulatorWorld(widgets.DOMWidget):
    """The Triangulator widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode('TriangulatorView').tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode('TriangulatorModel').tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode('TheTriangulator').tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode('TheTriangulator').tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    distance0 = Float(-1.0, help="Distance 0").tag(sync=True)
    distance1 = Float(-1.0, help="Distance 1").tag(sync=True)
    
    running = Bool(True, help="Set to false to stop polling").tag(sync=True)

    def __init__(self, trigger_0 = 23, echo_0 = 20, trigger_1 = 24, echo_1 = 21, mode = GPIO.BCM, poll_time = 0.5):
        """Initialize the Triangulation widget

        Args:
            trigger_0 (int, optional): GPIO port of sensor 0 for trigger. Defaults to 23.
            echo_0 (int, optional): GPIO port of sensor 0 for echo. Defaults to 20.
            trigger_1 (int, optional): GPIO port of sensor 1 for trigger. Defaults to 24.
            echo_1 (int, optional): GPIO port of sensor 1 for echo. Defaults to 21.
            mode (int, optional): GPIO mode. Defaults to GPIO.BCM.
            poll_time (float, optional): Polling timeout between sensor measurements. Defaults to 0.5 seconds.
        """
        super().__init__()

        self.trigger_0 = trigger_0
        self.echo_0 = echo_0
        self.trigger_1 = trigger_1
        self.echo_1 = echo_1
        self.poll_time = poll_time

        GPIO.setmode(mode)

        #set GPIO direction (IN / OUT)
        GPIO.setup(self.trigger_0, GPIO.OUT)
        GPIO.setup(self.trigger_1, GPIO.OUT)
        GPIO.setup(self.echo_0, GPIO.IN)
        GPIO.setup(self.echo_1, GPIO.IN)

    @staticmethod
    def distance(trigger, echo):
        # set Trigger to HIGH
        GPIO.output(trigger, True)

        # set Trigger after 0.01ms to LOW
        time.sleep(0.00001)
        GPIO.output(trigger, False)

        StartTime = time.time()
        StartTimeInit = StartTime
        StopTime = time.time()

        # save StartTime
        while GPIO.input(echo) == 0 and (StartTime - StartTimeInit) < 1:
            StartTime = time.time()

        # save time of arrival
        while GPIO.input(echo) == 1 and (StopTime - StartTime) < 1:
            StopTime = time.time()

        # time difference between start and arrival
        TimeElapsed = StopTime - StartTime
        # multiply with the sonic speed (34300 cm/s)
        # and divide by 2, because there and back
        return (TimeElapsed * 34300) / 2

    def poll(self):
        while self.running:
            # cap at board_length, normalize and scale to size
            try:
                self.distance0 = TriangulatorWorld.distance(self.trigger_0, self.echo_0)
                self.distance1 = TriangulatorWorld.distance(self.trigger_1, self.echo_1)
            except:
                pass
            
            time.sleep(self.poll_time)

    def start(self):
        thread = threading.Thread(target=self.poll) #, args=(self,))
        thread.start()
