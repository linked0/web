import logging as log
import sys

from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from ml_algs.alg_base import AlgBase
import ml_algs.model_data as mdata

log.basicConfig(format="%(filename)s:%(funcName)s:%(message)s",level=log.DEBUG,stream=sys.stderr)

class AlgRandomForest(AlgBase):
    def __init__(self):
        super(AlgRandomForest, self).__init__()
        self.class_name = mdata.alg_random_forest

    def build_clf_pipeline(self):
        log.debug('RandomForest')
        self.clf = RandomForestClassifier(random_state=1)
        self.pipeline = Pipeline([
            ('clf', self.clf)
        ])
        return self.clf, self.pipeline

