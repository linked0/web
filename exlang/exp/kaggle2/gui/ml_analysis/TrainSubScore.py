import logging as log
import sys

from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

import common.control_view as ctlview
import ml_algs.model_data as mdata
from common import config
from common import strings as strs
import common.utils as utils

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

class TrainSettingScoreView(QWidget):
    def __init__(self, parent=None):
        super(TrainSettingScoreView, self).__init__(parent)
        self.layout = QVBoxLayout()
        self.tabWidget = QTabWidget()

        # current score groupbox
        self.curscore = InnerScoreView(title=strs.cur_score_title)
        self.tabWidget.addTab(self.curscore, strs.cur_score_title)

        # best score groupbox
        self.bestscore = InnerScoreView(title=strs.best_score_title)
        self.tabWidget.addTab(self.bestscore, strs.best_score_title)

        self.layout.addWidget(self.tabWidget)
        self.setLayout(self.layout)
        ctlview.set_score_view(self)

    def invalidate(self):
        log.debug('start')
        best_score_info = mdata.get_best_train_info()
        if best_score_info != None:
            self.bestscore.invalidate(best_score_info)

        cur_score_info = mdata.get_current_train_info()
        self.curscore.invalidate(cur_score_info)

class InnerScoreView(QGroupBox):
    def __init__(self, parent=None, title=None):
        super(InnerScoreView, self).__init__(parent)
        self.setTitle(title)

        self.layout = QGridLayout()
        self.layout.setColumnStretch(0, 10)
        self.layout.setColumnStretch(1, 15)
        self.algname_title = QLabel(strs.score_alg_name)
        self.algname = QLabel('')
        self.algname.setMinimumHeight(config.train_setting_score_text_height)
        self.layout.setRowMinimumHeight(0, config.train_setting_score_grid_height)
        self.layout.addWidget(self.algname_title, 0, 0)
        self.layout.addWidget(self.algname, 0, 1)

        self.acctitle = QLabel(strs.score_acc_score)
        self.acc = QLabel('')
        self.acc.setMinimumHeight(config.train_setting_score_text_height)
        self.layout.setRowMinimumHeight(1, config.train_setting_score_grid_height)
        self.layout.addWidget(self.acctitle, 1, 0)
        self.layout.addWidget(self.acc, 1, 1)

        self.f1title = QLabel(strs.score_f1_score)
        self.f1 = QLabel('')
        self.f1.setMinimumHeight(config.train_setting_score_text_height)
        self.layout.setRowMinimumHeight(2, config.train_setting_score_grid_height)
        self.layout.addWidget(self.f1title, 2, 0)
        self.layout.addWidget(self.f1, 2, 1)

        self.acutitle = QLabel(strs.score_auc_score)
        self.auc = QLabel('')
        self.auc.setMinimumHeight(config.train_setting_score_text_height)
        self.layout.setRowMinimumHeight(3, config.train_setting_score_grid_height)
        self.layout.addWidget(self.acutitle, 3, 0)
        self.layout.addWidget(self.auc, 3, 1)

        self.paramstitle = QLabel(strs.score_parameters)
        self.params = QLabel('')
        self.params.setWordWrap(True)
        self.params.setMinimumHeight(config.train_setting_score_params_height)
        self.layout.setRowMinimumHeight(4, config.train_setting_score_grid_height)
        self.layout.addWidget(self.paramstitle, 4, 0)
        self.layout.addWidget(self.params, 4, 1)

        self.setLayout(self.layout)

    def invalidate(self, score_info):
        log.debug('start - %s' % (score_info))
        self.algname.setText(score_info[mdata.info_alg])

        acc_score = score_info[mdata.info_score_acc]
        self.acc.setText(str(acc_score))

        if mdata.info_score_f1 in score_info.keys():
            f1_score = score_info[mdata.info_score_f1]
            self.f1.setText(str(f1_score))

        if mdata.info_score_auc in score_info.keys():
            auc_score = score_info[mdata.info_score_auc]
            self.auc.setText(str(auc_score))

        params_str = utils.make_params_list_str(score_info[mdata.info_params])
        self.params.setText(params_str)

