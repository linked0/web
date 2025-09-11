import sys
import os
import logging as log
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import common.control_view as ctlview
import ml_algs.model_data as mdata
import common.strings as strs
import common.config as config
import common.utils as utils

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)

class EnsembleSettingView(QWidget):
    def __init__(self, parent=None):
        super(EnsembleSettingView, self).__init__(parent)
        self.layout = QGridLayout()
        self.setLayout(self.layout)
        self.algsview_list = []

        algs = mdata.get_algorithms()
        row = 0
        for idx in range(len(algs)):
            if mdata.alg_ensemble not in algs[idx]:
                row = idx/2
                col = idx%2
                algview = AlgorithmView(algs[idx], parent=self)
                self.algsview_list.append(algview)
                self.layout.addWidget(algview, row, col)

        self.detailview = QLabel()
        self.detailview.setWordWrap(True)
        self.detailview.setMinimumHeight(config.train_setting_score_params_height)
        self.layout.addWidget(self.detailview, row+1, 0, 1, 2)

        self.applybtn = QPushButton(strs.btn_apply)
        self.setMinimumHeight(config.button_height)
        self.applybtn.clicked.connect(self.on_applybtn_clicked)
        self.layout.addWidget(self.applybtn)

    def on_applybtn_clicked(self):
        estimators = []
        for algview in self.algsview_list:
            if algview.ischecked() is True:
                estimators.append(algview.get_name())
        mdata.set_majority_vote_estimators(estimators)

    def show_detail(self, detail):
        self.detailview.setText(detail)

class AlgorithmView(QWidget):
    def __init__(self, name, parent=None):
        super(AlgorithmView, self).__init__(parent)
        self.parent = parent
        self.algname = name
        self.layout = QHBoxLayout()
        self.setLayout(self.layout)

        self.chk_alg = QCheckBox(name)
        self.layout.addWidget(self.chk_alg)
        self.btn_alg = QPushButton(strs.btn_show_detail)
        self.btn_alg.setFixedWidth(60)
        self.btn_alg.clicked.connect(self.on_btn_alg_clicked)
        self.layout.addWidget(self.btn_alg)

    def on_btn_alg_clicked(self):
        log.debug('>>>>>> algorithm:%s' % self.algname)
        algname = '<' + self.algname + '>'
        modelinfo = mdata.get_model_info(self.algname)
        if modelinfo is not None:
            paramstr = utils.make_params_list_str(modelinfo[mdata.info_params])
            infostr = algname + '\n' +\
                    '*Accuracy: ' + str(modelinfo[mdata.info_score_acc]) + '\n' +\
                    '*Parameters: ' + paramstr
        else:
            infostr = algname + '\nNot trained'

        self.parent.show_detail(infostr)

    def ischecked(self):
        return self.chk_alg.isChecked()

    def get_name(self):
        return self.algname