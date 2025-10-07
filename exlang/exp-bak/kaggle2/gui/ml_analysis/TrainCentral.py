import logging as log
import sys

from PyQt5.QtWidgets import *
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

import common.control_view as ctlview
from common import strings as strs

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

class CentralWidgetTrainProcess(QWidget):
    def __init__(self, parent=None):
        super(CentralWidgetTrainProcess, self).__init__(parent)
        self.layout = QHBoxLayout()
        self.setLayout(self.layout)

        # Train View layout (matplotlib figure)
        self.mainLay = QVBoxLayout()

        # train plotting view layout
        self.fig = Figure()
        self.trainPlot = FigureCanvas(self.fig)
        self.fig.subplots_adjust(left=0.08,
                                 right=0.92,
                                 bottom=0.08,
                                 top=0.92,
                                 wspace=0.2,
                                 hspace=0.2)
        self.mainLay.addWidget(self.trainPlot)
        self.layout.addLayout(self.mainLay)

        # setting global variables
        ctlview.set_figure(self.fig)
        ctlview.set_learning_score_view(self.fig.add_subplot(2, 2, 1))
        ctlview.set_auc_view(self.fig.add_subplot(2, 2, 2))
        ctlview.set_validation_view(self.fig.add_subplot(2, 2, 3))
        ctlview.set_dimen_reduct_view(self.fig.add_subplot(2, 2, 4))

