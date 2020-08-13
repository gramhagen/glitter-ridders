TheTriangulator
===============================

A triangulation widget for ultrasonic HC-SR04 sensors

Installation
------------

To install use pip:

    $ pip install TheTriangulator
    $ jupyter nbextension enable --py --sys-prefix TheTriangulator

To install for jupyterlab

    $ jupyter labextension install TheTriangulator

For a development installation (requires npm),

    $ git clone https://github.com//TheTriangulator.git
    $ cd TheTriangulator
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix TheTriangulator
    $ jupyter nbextension enable --py --sys-prefix TheTriangulator
    $ jupyter labextension install js

When actively developing your extension, build Jupyter Lab with the command:

    $ jupyter lab --watch

This takes a minute or so to get started, but then automatically rebuilds JupyterLab when your javascript changes.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.

