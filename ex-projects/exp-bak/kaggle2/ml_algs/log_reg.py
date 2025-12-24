import logging as log
import sys

from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

import common.strings as strs
from ml_algs.alg_base import AlgBase
import ml_algs.model_data as mdata

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)


class AlgLogisticRegression(AlgBase):
    def __init__(self):
        super(AlgLogisticRegression, self).__init__()
        self.class_name = mdata.alg_logistic_regression

    def build_clf_pipeline(self):
        log.debug('LogisticRegrssion')
        self.clf = LogisticRegression(random_state=0)
        self.pipeline = Pipeline([
            ('scl', StandardScaler()),
            ('clf', self.clf)
        ])
        return self.clf, self.pipeline

