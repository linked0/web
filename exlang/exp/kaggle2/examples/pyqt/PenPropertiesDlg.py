import sys
import logging as log
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
from common import strings as strs

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)

class PenPropertiesDlg(QDialog):
    def __init__(self, parent=None):
        super(PenPropertiesDlg, self).__init__(parent)
        widthLabel = QLabel("&Width:")
        self.widthSpinBox = QSpinBox()
        widthLabel.setBuddy(self.widthSpinBox)
        self.widthSpinBox.setAlignment(Qt.AlignRight|Qt.AlignVCenter)
        self.widthSpinBox.setRange(0, 24)
        self.beveledCheckBox = QCheckBox("&Beveled edges")
        styleLabel = QLabel("&Style:")
        self.styleComboBox = QComboBox()
        styleLabel.setBuddy(self.styleComboBox)
        self.styleComboBox.addItems(['Solid', 'Dashed', 'Dotted',
                                     'DashDotted', 'DashDotDotted'])
        # okButton = QPushButton('&OK')
        # cancelButton = QPushButton('Cancel')
        buttonBox = QDialogButtonBox(QDialogButtonBox.Ok
                                     | QDialogButtonBox.Cancel)

        # buttonLayout = QHBoxLayout()
        # buttonLayout.addStretch(10)
        # buttonLayout.addWidget(buttonBox)
        layout = QGridLayout()
        layout.addWidget(widthLabel, 0, 0)
        layout.addWidget(self.widthSpinBox, 0, 1)
        layout.addWidget(self.beveledCheckBox, 0, 2)
        layout.addWidget(styleLabel, 1, 0)
        layout.addWidget(self.styleComboBox, 1, 1, 1, 2)
        layout.addWidget(buttonBox, 2, 0, 1, 3, alignment=Qt.AlignHCenter)
        self.setLayout(layout)

        # self.connect(okButton, SIGNAL('clicked()'),
        #              self, SLOT('accept()'))
        # self.connect(cancelButton, SIGNAL('clicked()'),
        #              self, SLOT('reject()'))

        self.connect(buttonBox, SIGNAL("accepted()"),
                     self, SLOT("accept()"))
        self.connect(buttonBox, SIGNAL("rejected()"),
                     self, SLOT("reject()"))

        self.setWindowTitle('Pen Properties')

    def accept(self):
        log.debug('start')
        QDialog.accept(self)

    def reject(self):
        log.debug('start')
        QDialog.reject(self)