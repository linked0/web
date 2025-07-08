from examples.pyqt.PenPropertiesDlg import *
from ml_algs import model_data as mdata
from common import config

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)

class TrainSettingDimenReduction(QWidget):
    def __init__(self, parent=None):
        super(TrainSettingDimenReduction, self).__init__(parent)
        self.layout = QVBoxLayout()

        methods = mdata.get_dimem_reduction_methods()
        for key in methods.keys():
            log.debug('%s: %s' % (key, methods[key]))

        # features selection
        innerlayout = QHBoxLayout()
        feature_sel_label = QLabel(strs.title_feature_selction)
        feature_sel_label.setFixedHeight(config.text_height)
        innerlayout.addWidget(feature_sel_label)
        self.feature_sel = QComboBox()
        self.feature_sel.setFixedHeight(config.param_height)
        self.feature_sel.setFixedWidth(config.param_width)
        self.feature_sel.addItem(config.param_none)
        self.feature_sel.addItems(mdata.get_feature_selection_methods())
        self.feature_sel.currentIndexChanged.connect(self.on_feature_selection_changed)
        innerlayout.addWidget(self.feature_sel)
        self.layout.addLayout(innerlayout)

        # features extraction
        innerlayout = QHBoxLayout()
        feature_ext_label = QLabel(strs.title_feature_extraction)
        feature_ext_label.setFixedHeight(config.text_height)
        innerlayout.addWidget(feature_ext_label)
        self.feature_ext = QComboBox()
        self.feature_ext.setFixedHeight(config.param_height)
        self.feature_ext.setFixedWidth(config.param_width)
        self.feature_ext.addItem(config.param_none)
        self.feature_ext.addItems(mdata.get_feature_extraction_methods())
        self.feature_ext.currentIndexChanged.connect(self.on_feature_extraction_changed)
        innerlayout.addWidget(self.feature_ext)
        self.layout.addLayout(innerlayout)

        # apply button
        applybtn = QPushButton(strs.btn_apply)
        self.layout.addWidget(applybtn)
        applybtn.clicked.connect(self.on_applybtn_clicked)

        # all features
        allbtn = QPushButton(strs.btn_all_features)
        self.layout.addWidget(allbtn)
        allbtn.clicked.connect(self.on_allbtn_clicked)

        self.setLayout(self.layout)

    def on_feature_selection_changed(self, index):
        value_str = str(self.feature_sel.itemText(index))
        log.debug('start - selected value: %s' % value_str)

        oldstate = self.feature_ext.blockSignals(True)
        self.feature_ext.setCurrentIndex(0)
        self.feature_ext.blockSignals(oldstate)

        mdata.set_dimen_reduct_method(value_str)

    def on_feature_extraction_changed(self, index):
        value_str = str(self.feature_ext.itemText(index))
        log.debug('start - selected value: %s' % value_str)

        oldstate = self.feature_sel.blockSignals(True)
        self.feature_sel.setCurrentIndex(0)
        self.feature_sel.blockSignals(oldstate)

        mdata.set_dimen_reduct_method(value_str)

    def on_applybtn_clicked(self):
        mdata.show_dimen_reduction()

    def on_allbtn_clicked(self):
        mdata.reset_dimen_reduction()


