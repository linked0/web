#!/usr/bin/env python

__author__ = 'linked0'

import logging
import sys

from PyQt5.QtWidgets import *

import common.strings as strs
import ml_algs.model_data as mdata
from gui.ml_analysis import MainWindow as mlm
from gui.house_prices import MainWindow as housem
from ml_algs.decision_tree import AlgDecisionTree
from ml_algs.ensemble import AlgEnsemble
from ml_algs.gaussian_nb import AlgGaussianNB
from ml_algs.kernel_svm import AlgKernelSVM
from ml_algs.kneighbors import AlgKNeighbors
from ml_algs.lin_reg import AlgLinearRegression
from ml_algs.log_reg import AlgLogisticRegression
from ml_algs.neural_net import AlgNeuralNet
from ml_algs.random_forest import AlgRandomForest
from ml_algs.svm import AlgSVM

logging.basicConfig(format=strs.log_format,level=logging.DEBUG,stream=sys.stderr)

if __name__ == '__main__':
    app = QApplication(sys.argv)

    mdata.init()
    mdata.set_algorithm_obj(mdata.alg_kernel_svm, AlgKernelSVM())
    mdata.set_algorithm_obj(mdata.alg_k_neighbor, AlgKNeighbors())
    mdata.set_algorithm_obj(mdata.alg_linear_reg, AlgLinearRegression())
    mdata.set_algorithm_obj(mdata.alg_logistic_regression, AlgLogisticRegression())
    mdata.set_algorithm_obj(mdata.alg_decision_tree, AlgDecisionTree())
    mdata.set_algorithm_obj(mdata.alg_random_forest, AlgRandomForest())
    mdata.set_algorithm_obj(mdata.alg_neural_net, AlgNeuralNet())
    mdata.set_algorithm_obj(mdata.alg_svm, AlgSVM())
    mdata.set_algorithm_obj(mdata.alg_gaussian_nb, AlgGaussianNB())
    mdata.set_algorithm_obj(mdata.alg_ensemble_stacking,
                            AlgEnsemble(mdata.alg_ensemble_stacking))
    mdata.set_algorithm_obj(mdata.alg_ensemble_bagging,
                            AlgEnsemble(mdata.alg_ensemble_bagging))
    mdata.set_algorithm_obj(mdata.alg_ensemble_adaboost,
                            AlgEnsemble(mdata.alg_ensemble_adaboost))

    window = housem.MainWindow()
    window.show()
    window.raise_()

    app.exec_()
