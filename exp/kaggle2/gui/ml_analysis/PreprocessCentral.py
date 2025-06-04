import sys
import os
import logging as log
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
import common.strings as strs
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import numpy as np

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)

survived_color = '#6699ff'
died_color = '#ff6666'

class PreprocessView(QWidget):
    def __init__(self, parent=None):
        super(PreprocessView, self).__init__(parent)
        self.X = None
        self.y = None
        self.idx_survived = None
        self.idx_died = None

        self.layout = QVBoxLayout()
        self.setLayout(self.layout)

        self.fig, self.axs = plt.subplots(3, 2)
        self.axs = self.axs.ravel()
        self.fig.subplots_adjust(left=0.08,
                                 right=0.92,
                                 bottom=0.08,
                                 top=0.92,
                                 wspace=0.2,
                                 hspace=0.3)

        self.plot = FigureCanvas(self.fig)
        self.layout.addWidget(self.plot)

    def set_data(self, X, y):
        self.X = X
        self.y = y
        self.idx_survived = (self.y==1)
        self.idx_died = np.logical_not(self.idx_survived)

    def analyze_column_data(self, idx, colname):
        log.debug('>>>>> idx:%d, column:%s' % (idx, colname))
        col_map = np.unique(self.X[colname])
        if len(col_map) <= 10:
            log.debug('col_map:%s' % (col_map))
            self.analyze_small_range_data(idx, colname, col_map)
        else:
            log.debug('col_map length:%d' % len(col_map))
            self.analyze_big_range_data(idx, colname, col_map)

        self.axs[idx].grid()
        self.fig.canvas.draw()

    def analyze_small_range_data(self, idx, colname, col_map):
        width = 0.35
        col_survived = self.X[colname][self.idx_survived]
        col_died = self.X[colname][self.idx_died]
        count_survived = {}
        count_died = {}
        for value in col_map:
            count_survived[value] = np.sum(col_survived == value)
            count_died[value] = np.sum(col_died == value)

        N = len(col_map)
        ind = np.arange(N)

        self.axs[idx].cla()
        self.axs[idx].bar(ind, count_survived.values(), width, color=survived_color, label='Survived')
        self.axs[idx].bar(ind + width, count_died.values(), width, color=died_color, label='Died')

        self.axs[idx].set_xlabel(colname, fontsize=12)
        self.axs[idx].set_ylabel('Number of people', fontsize=12)
        self.axs[idx].legend(loc='upper right')
        log.debug('ind + width:%s, col_map:%s' % (ind + width, col_map))
        self.axs[idx].set_xticks(ind + width)
        self.axs[idx].set_xticklabels(col_map)

    def analyze_big_range_data(self, idx, colname, col_map):
        bincount = 0
        if colname == 'Fare':
            bincount = 25
            width = 20
        elif colname == 'Age':
            bincount = 100

        col_surv = self.X[colname][self.idx_survived]
        col_died = self.X[colname][self.idx_died]

        minval, maxval = min(col_surv), max(col_surv)
        log.debug('min:%s, max:%s' % (minval, maxval) )
        bins = np.linspace(minval, maxval, bincount)

        count_surv, _ = np.histogram(col_surv, bins)
        count_died, _ = np.histogram(col_died, bins)

        self.axs[idx].cla()
        if colname == 'Fare':
            self.axs[idx].bar(bins[:-1], np.log10(count_surv), width=width,
                              color=survived_color, label='Survived')
            self.axs[idx].bar(bins[:-1], -np.log10(count_died), width=width,
                              color=died_color, label='Died')
        elif colname == 'Age':
            self.axs[idx].bar(bins[:-1], np.log10(count_surv), color=survived_color,
                              label='Survived')
            self.axs[idx].bar(bins[:-1], -np.log10(count_died), color=died_color,
                              label='Died')
        self.axs[idx].set_ylabel('Number of people')
        self.axs[idx].set_xlabel(colname)
        self.axs[idx].set_yticks(range(-3, 4), (10**abs(k) for k in range(-3, 4)))
        self.axs[idx].set_yticklabels((10**abs(k) for k in range(-3, 4)))
