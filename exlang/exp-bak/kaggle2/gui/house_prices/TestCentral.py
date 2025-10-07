import sys
import os
import logging as log
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import common.strings as strs

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)

class TestCentral(QWidget):
    def __init__(self, parent=None):
        super(TestCentral, self).__init__(parent)
        layout = QVBoxLayout()

        self.image = QImage()
        self.dirty = False
        self.filename = None
        self.mirroredvertically = False
        self.mirroredhorizontally = False

        self.titlelabel = QLabel('hello, world')
        layout.addWidget(self.titlelabel)

        self.imagelabel = QLabel()
        self.imagelabel.setMinimumSize(200, 200)
        self.imagelabel.setAlignment(Qt.AlignCenter)
        self.imagelabel.setContextMenuPolicy(Qt.ActionsContextMenu)
        layout.addWidget(self.imagelabel)

        self.setLayout(layout)