import sys
import os
import logging as log
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import common.strings as strs
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtWebChannel import QWebChannel

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)

class WebBrowserCentral(QWebEngineView):
    def __init__(self, parent=None):
        super(WebBrowserCentral, self).__init__(parent)
        url = QUrl('http://linked0.pythonanywhere.com')
        self.load(url)
        self.loadFinished.connect(self.load_finished)

    def load_finished(self):
        log.debug('Web Page Load Finished!')