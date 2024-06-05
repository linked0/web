from __future__ import print_function
from __future__ import unicode_literals

import logging as log
import sys

from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from gui.ml_analysis.PreprocessCentral import PreprocessView
from gui.ml_analysis.PreprocessSetting import PreprocessSettingView
from gui.ml_analysis.TestCentral import TestCentral
from gui.ml_analysis.TestSetting import TestSettingView
from gui.ml_analysis.TrainSetting import TrainSettingView
from gui.ml_analysis.WebBrowserCentral import WebBrowserCentral

import common.control_view
import common.strings as strs
from gui.ml_analysis.TrainCentral import CentralWidgetTrainProcess

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

class MainWindow(QMainWindow):
    def __init__(self, parent=None):
        super(MainWindow, self).__init__(parent)
        layout = QVBoxLayout()
        centralwidget = QWidget()
        centralwidget.setLayout(layout)

        self.setWindowTitle('Training Machine')
        self.tabwidget = QTabWidget()

        # set for training model
        self.trainProcessView = CentralWidgetTrainProcess()
        self.tabwidget.addTab(self.trainProcessView, strs.central_train_title)

        # set for preprocessing data
        self.preprocessView = PreprocessView()
        self.tabwidget.addTab(self.preprocessView, strs.central_preprocess_title)

        # set for examples
        self.testCentral = TestCentral()
        self.tabwidget.addTab(self.testCentral, strs.central_test_title)

        # set for web browser
        self.webbrowser = WebBrowserCentral()
        self.tabwidget.addTab(self.webbrowser, strs.central_web_title)

        self.tabwidget.currentChanged.connect(self.on_tab_changed)
        layout.addWidget(self.tabwidget)

        # set for DocWidget of selecting menu or algorithms
        self.train_selectionView = TrainSettingView()
        self.preprocess_settingview = PreprocessSettingView(main_view=self.preprocessView )
        self.test_settingview = TestSettingView()
        self.addDockWidget(Qt.RightDockWidgetArea, self.train_selectionView)
        self.addDockWidget(Qt.RightDockWidgetArea, self.preprocess_settingview)
        self.addDockWidget(Qt.RightDockWidgetArea, self.test_settingview)
        self.removeDockWidget(self.preprocess_settingview)
        self.removeDockWidget(self.test_settingview)
        self.current_rightdock = self.train_selectionView

        self.setCentralWidget(centralwidget)
        self.show()

        # status bar
        self.size_label = QLabel()
        self.size_label.setFrameStyle(QFrame.StyledPanel|QFrame.Sunken)
        status = self.statusBar()
        status.setSizeGripEnabled(False)
        status.addPermanentWidget(self.size_label)
        status.showMessage('Good! You can change contents. Hyunjae! :)', 1000000)

        common.control_view.main_view = self
        common.control_view.central_tab_widget = self.tabwidget
        common.control_view.config_view = self.train_selectionView

    def on_tab_changed(self, p_int):
        log.debug('>>>>> %d' % p_int)
        self.removeDockWidget(self.current_rightdock)
        if p_int == 0:
            self.restoreDockWidget(self.train_selectionView)
            self.current_rightdock = self.train_selectionView
        elif p_int == 1:
            self.restoreDockWidget(self.preprocess_settingview)
            self.current_rightdock = self.preprocess_settingview
        else:
            self.restoreDockWidget(self.test_settingview)
            self.current_rightdock = self.test_settingview

    def getTrainSubplot(self):
        return self.trainProcess.getTrainSubplot()
