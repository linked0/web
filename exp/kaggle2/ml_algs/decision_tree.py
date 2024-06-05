import sys
import os
import logging as log

from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
import common.strings as strs
from ml_algs.alg_base import AlgBase
import ml_algs.model_data as mdata

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)


class AlgDecisionTree(AlgBase):
    def __init__(self):
        super(AlgDecisionTree, self).__init__()
        log.debug('>>>>>')
        self.class_name = mdata.alg_decision_tree

    def build_clf_pipeline(self):
        log.debug('>>>>>')
        self.clf=DecisionTreeClassifier(criterion='entropy',
                                        max_depth=None)
        self.pipeline = Pipeline([
            ('clf', self.clf)
        ])
        return self.clf, self.pipeline

