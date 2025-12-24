import sys
import os
import logging as log
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import common.strings as strs

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)

class TestSettingView(QDockWidget):
    def __init__(self, parent=None):
        super(TestSettingView, self).__init__(parent)

        self.titlelabel = QLabel('Test config view')
        self.setWidget(self.titlelabel)