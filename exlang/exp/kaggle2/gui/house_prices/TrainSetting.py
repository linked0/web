import logging as log
import sys

from PyQt5.QtWidgets import *
from gui.ml_analysis.TrainSubDimenReduction import TrainSettingDimenReduction
from gui.ml_analysis.TrainSubEnsemble import EnsembleSettingView

import ml_algs.model_data as mdata
from common import config
from common import strings as strs
from gui.ml_analysis import TrainSubModelSelection as tcv
from gui.ml_analysis.TrainSubScore import TrainSettingScoreView
from ml_algs import model_data as algs
from preprocess_data import preprocess as prep

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

class TrainSettingView(QDockWidget):
    def __init__(self, parent=None):
        super(TrainSettingView, self).__init__(parent)
        self.mainWidget = TrainSettingMainWidget()
        self.setWidget(self.mainWidget)

    def invalidate(self):
        self.mainWidget.invalidate()

class TrainSettingMainWidget(QWidget):
    def __init__(self, parent=None):
        super(TrainSettingMainWidget, self).__init__(parent)

        self.layout = QVBoxLayout()

        # section1 - train score view
        self.score_view = TrainSettingScoreView()
        self.layout.addWidget(self.score_view)

        # section2 - data store, algorithm selction view
        groupbox = QGroupBox()
        vboxlayout = QVBoxLayout()
        hboxlayout = QHBoxLayout()
        self.cmb_data = QComboBox()
        self.cmb_data.setFixedHeight(config.param_height)
        for item in prep.get_data_names():
            self.cmb_data.addItem(item)
        self.cmb_data.currentIndexChanged.connect(self.on_cmb_data_changed)
        hboxlayout.addWidget(self.cmb_data)

        self.algs_combo = QComboBox(parent=self)
        alg_list = algs.get_algorithms()
        self.algs_combo.addItems(alg_list)
        self.algs_combo.currentTextChanged.connect(self.algs_selected)
        hboxlayout.addWidget(self.algs_combo)
        vboxlayout.addLayout(hboxlayout)

        hboxlayout = QHBoxLayout()
        self.start_btn = QPushButton(strs.start, parent=self)
        self.start_btn.setMinimumHeight(config.button_height)
        self.start_btn.clicked.connect(self.start_train)
        hboxlayout.addWidget(self.start_btn)

        self.predict_btn = QPushButton(strs.predict, parent=self)
        self.predict_btn.setMinimumHeight(config.button_height)
        self.predict_btn.clicked.connect(self.predict)
        hboxlayout.addWidget(self.predict_btn)

        # self.use_gridsearch_chk = QCheckBox(strs.use_gridsearch)
        # self.use_gridsearch_chk.setMinimumHeight(config.button_height)
        # self.use_gridsearch_chk.stateChanged.connect(self.on_gridsearch_changed)
        # hboxlayout.addWidget(self.use_gridsearch_chk)

        vboxlayout.addLayout(hboxlayout)
        groupbox.setLayout(vboxlayout)
        self.layout.addWidget(groupbox)

        # section3
        # 1) dimesion reduction tab
        # 2) hyper-parameter tab
        # 3) test tab
        self.tabwidget = QTabWidget()
        self.dimen_reduct = TrainSettingDimenReduction()
        self.tabwidget.addTab(self.dimen_reduct, strs.title_dimen_reduct)
        self.train_config = tcv.TrainSettingModelSelectionView()
        self.tabwidget.addTab(self.train_config, strs.title_hyperparam)
        self.layout.addWidget(self.tabwidget)
        self.ensemble_setting = EnsembleSettingView()
        self.tabwidget.addTab(self.ensemble_setting, strs.title_ensemble_setting)
        self.setLayout(self.layout)

        self.cmb_data.setCurrentIndex(0)
        self.on_cmb_data_changed(0)
        self.algs_selected(alg_list[0])

    def start_train(self):
        log.debug('start - selected algorithm: %s' % mdata.sel_alg)
        mdata.run_alg()

    def predict(self):
        log.debug('start - selected algorithm: %s' % mdata.sel_alg)
        mdata.predict()

    def algs_selected(self, sel_alg):
        log.debug('>>>>> start - %s' % (sel_alg))
        mdata.set_alg(str(sel_alg))
        hyperparams = algs.get_hyper_param_pairs(sel_alg)
        hyperparam_values = mdata.get_best_hyper_params()
        self.train_config.set_hyper_params(hyperparams, hyperparam_values)
        self.score_view.invalidate()

    def on_cmb_data_changed(self, index):
        value  = str(self.cmb_data.currentText())
        log.debug('>>>>> start - data name:%s' % (value))
        prep.set_data_name(value)
        prep.load_data()

    # def on_gridsearch_changed(self, p_int):
    #     if p_int == 0:
    #         mdata.set_grid_search_params_use(False)
    #     else:
    #         mdata.set_grid_search_params_use(True)

    def invalidate(self):
        self.train_config.invalidate()

