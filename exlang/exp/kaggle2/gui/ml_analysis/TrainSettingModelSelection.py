import logging as log
import sys
from collections import OrderedDict

from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

import ml_algs.model_data as mdata
from common import config
from common import strings as strs

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

sel_param_name = None
sel_param_radio = None

def reset_sel_param():
    global sel_param_name, sel_param_radio
    sel_param_name = None
    sel_param_radio = None

class TrainSettingModelSelectionView(QWidget):
    def __init__(self, parent=None):
        super(TrainSettingModelSelectionView, self).__init__(parent)
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)

        self.config_layout = TrainConfigHyperparamLayout(self)
        self.layout.addWidget(self.config_layout)

        hboxlayout = QHBoxLayout()
        self.validate_btn = QPushButton(strs.btn_validate_params)
        self.validate_btn.setFixedHeight(config.button_height)
        self.validate_btn.clicked.connect(self.validate)
        hboxlayout.addWidget(self.validate_btn)

        self.savebtn = QPushButton(strs.btn_save_parameters)
        self.savebtn.setFixedHeight(config.button_height)
        self.savebtn.clicked.connect(self.save_hyper_params)
        hboxlayout.addWidget(self.savebtn)
        self.layout.addLayout(hboxlayout)

        self.gridsearch_btn = QPushButton(strs.btn_grid_search)
        self.gridsearch_btn.setFixedHeight(config.button_height)
        self.gridsearch_btn.clicked.connect(self.grid_search)
        self.layout.addWidget(self.gridsearch_btn)

    def validate(self):
        global sel_param_name
        log.debug('*')
        log.debug('start - selected algorithm: %s' % mdata.sel_alg)

        if sel_param_name is not None:
            mdata.remove_hyper_param_value(sel_param_name)
            mdata.do_model_selection(sel_param_name)
        else:
            log.debug(strs.error_hyper_param_not_selected)

    def grid_search(self):
        mdata.do_grid_search()

    def set_hyper_params(self, hyperparams, hyperparam_values):
        log.debug('*')
        self.config_layout.set_hyper_params(hyperparams, hyperparam_values)

    def save_hyper_params(self):
        self.config_layout.save_hyper_params()

class TrainConfigHyperparamLayout(QWidget):
    def __init__(self, parent=None):
        super(TrainConfigHyperparamLayout, self).__init__(parent)
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)
        self.ordered_hyperparams = None
        self.param_views = []

    def set_hyper_params(self, hyperparams, hyperparam_values):
        log.debug('*')
        self.clearLayout()
        reset_sel_param()
        self.ordered_hyperparams = OrderedDict(hyperparams)
        # for param_name, param_range in self.ordered_hyperparams.iteritems(): # python2
        for param_name, param_range in self.ordered_hyperparams.items():
            param_value = hyperparam_values.get(param_name)
            param_view = TrainConfigHyperparamView(self, param_name, param_range, param_value)
            print('parameter - %s - %s' % (param_name, param_view))
            self.param_views.append(param_view)
            self.layout.addWidget(param_view)

    def clearLayout(self):
        self.param_views = []
        for idx in reversed(range(self.layout.count())):
            # takeAt does both the jobs of itemAt and removeWidget
            # namely it removes an item and returns it
            widget = self.layout.takeAt(idx).widget()

            if widget is not None:
                # widget will be None if the item is a layout
                widget.deleteLater()

    def save_hyper_params(self):
        for view in self.param_views:
            view.save_hyper_param()


class TrainConfigHyperparamView(QWidget):
    def __init__(self, parent=None, param_name=None, param_range=None, param_value=None):
        super(TrainConfigHyperparamView, self).__init__(parent)
        self.parent = parent

        self.layout = QHBoxLayout()
        self.setLayout(self.layout)

        self.param_name = param_name
        self.sel_radio = QCheckBox(param_name, parent)
        self.sel_radio.setFixedHeight(config.param_height)
        self.sel_radio.stateChanged.connect(self.select_param)
        self.layout.addWidget(self.sel_radio)

        self.range_combo = QComboBox()
        self.range_combo.setFixedHeight(config.param_height)
        self.range_combo.addItem(config.txt_default)
        self.range_combo.addItems(param_range)
        if param_value != None:
            for index in range(self.range_combo.count()):
                if str(param_value) == self.range_combo.itemText(index):
                    self.range_combo.setCurrentIndex(index)
        self.range_combo.currentIndexChanged.connect(self.set_param_value)
        self.layout.addWidget(self.range_combo)

    def select_param(self, checked):
        global sel_param_name, sel_param_radio
        if checked == Qt.Checked:
            log.debug('selected radio: %s' % self.param_name)
            sel_param_name = self.param_name
            if sel_param_radio != None:
                sel_param_radio.setChecked(False)
            sel_param_radio = self.sel_radio

    def set_param_value(self, index):
        log.debug('start - index: %d' % index)
        value_str = str(self.range_combo.currentText())
        param_value = None
        if value_str != config.txt_default:
            if mdata.is_param_float_type(self.param_name) is True:
                param_value = float(value_str)
            elif mdata.is_param_int_type(self.param_name) is True:
                param_value = int(value_str)

        mdata.set_hyper_param_value(self.param_name, param_value)

    def save_hyper_param(self):
        value_str = str(self.range_combo.currentText())
        log.debug('start - index: %s' % value_str)
        if value_str != config.txt_default:
            if mdata.is_param_float_type(self.param_name) is True:
                param_value = float(value_str)
            elif mdata.is_param_int_type(self.param_name) is True:
                param_value = int(value_str)
        mdata.set_hyper_param_value(self.param_name, param_value)



