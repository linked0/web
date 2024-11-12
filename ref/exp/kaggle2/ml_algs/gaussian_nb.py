import logging as log
import sys

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.naive_bayes import GaussianNB

import common.strings as strs
from ml_algs.alg_base import AlgBase
import ml_algs.model_data as mdata

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)


class AlgGaussianNB(AlgBase):
    def __init__(self):
        super(AlgGaussianNB, self).__init__()
        self.class_name = mdata.alg_gaussian_nb

    def build_clf_pipeline(self):
        log.debug('Gaussian NB')
        self.clf = GaussianNB()
        self.pipeline = Pipeline([
            ('scl', StandardScaler()),
            ('clf', self.clf)
        ])
        return self.clf, self.pipeline