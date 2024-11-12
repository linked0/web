import logging as log
import sys
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
import numpy as np
import common.strings as strs
from ml_algs.alg_base import AlgBase
import ml_algs.model_data as mdata
import preprocess_data.preprocess as prep

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)


class AlgKernelSVM(AlgBase):
    def __init__(self):
        super(AlgKernelSVM, self).__init__()
        log.debug('>>>>>')
        self.class_name = mdata.alg_kernel_svm

    def build_clf_pipeline(self):
        log.debug('KernelSVM')
        self.clf = SVC(kernel='rbf', random_state=0, probability=True)
        self.pipeline = Pipeline([
            ('scl', StandardScaler()),
            ('clf', self.clf)
        ])
        return self.clf, self.pipeline
