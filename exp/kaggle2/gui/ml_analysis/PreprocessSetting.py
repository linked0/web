import logging as log
import sys
from functools import partial

from PyQt5.QtWidgets import *

import preprocess_data.preprocess as prep
from common import strings as strs

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

class PreprocessSettingView(QDockWidget):
    def __init__(self, main_view=None, parent=None):
        super(PreprocessSettingView, self).__init__(parent)
        self.central_view = main_view
        self.initialized = False;

        widget = QWidget()
        layout = QVBoxLayout()
        widget.setLayout(layout)
        self.setWidget(widget)

        self.combos = []
        prep.preprocess_data()
        self.X, self.y = prep.data_store.get_original_data()
        self.central_view.set_data(self.X, self.y)
        self.columns = self.X.columns.tolist()
        for idx in range(len(self.columns)):
            combo = QComboBox()
            combo.addItems(self.columns + ['None'])
            combo.setCurrentIndex(len(self.columns))
            combo.currentTextChanged.connect(partial(self.on_combo_changed, idx))
            layout.addWidget(combo)
            self.combos.append(combo)

    def showEvent(self, event):
        pass
        # if self.initialized == False:
        #     for idx in range(len(self.columns)):
        #         fieldname = self.combos[idx].currentText()
        #         self.central_view.analyze_column_data(idx, fieldname)
        #     self.initialized = True

    def on_combo_changed(self, who, seltxt):
        log.debug('>>>>> who:%s - selected:%s' % (who, seltxt))
        if 'None' not in seltxt:
            self.central_view.analyze_column_data(who, seltxt)