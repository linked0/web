import logging as log
import sys

from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

import common.strings as strs
from ml_algs.alg_base import AlgBase
import ml_algs.model_data as mdata

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

class AlgKNeighbors(AlgBase):
    def __init__(self):
        super(AlgKNeighbors, self).__init__()
        self.class_name = mdata.alg_k_neighbor

    def build_clf_pipeline(self):
        log.debug('kNN')
        # hj-comment, make metric to be hyperparameter
        self.clf = KNeighborsClassifier(metric='minkowski')
        self.pipeline = Pipeline([
            ('scl', StandardScaler()),
            ('clf', self.clf)
        ])
        return self.clf, self.pipeline

