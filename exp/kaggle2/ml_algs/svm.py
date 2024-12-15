import logging as log
import sys

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR

import common.strings as strs
from ml_algs.alg_base import AlgBase
import ml_algs.model_data as mdata

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)


class AlgSVM(AlgBase):
    def __init__(self):
        super(AlgSVM, self).__init__()
        self.class_name = mdata.alg_svm

    def build_clf_pipeline(self):
        log.debug('SVM')
        self.clf = SVR(kernel='linear')
        self.pipeline = Pipeline([
            ('scl', StandardScaler()),
            ('clf', self.clf)
        ])
        return self.clf, self.pipeline