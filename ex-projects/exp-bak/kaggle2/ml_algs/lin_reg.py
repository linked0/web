import logging as log
import sys

from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

import common.strings as strs
from ml_algs.alg_base import AlgBase
import ml_algs.model_data as mdata

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

# hj-comment, RANSAC model
class AlgLinearRegression(AlgBase):
    def __init__(self):
        super(AlgLinearRegression, self).__init__()
        self.class_name = mdata.alg_linear_reg

    def build_clf_pipeline(self):
        log.debug('LinearRegression')
        self.clf = LinearRegression()
        self.pipeline = Pipeline([
            ('scl', StandardScaler()),
            ('clf', self.clf)
        ])
        return self.clf, self.pipeline
