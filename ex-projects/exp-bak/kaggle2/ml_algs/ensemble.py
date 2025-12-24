import logging as log
import sys
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import VotingClassifier
from sklearn.ensemble import BaggingClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import ExtraTreesClassifier
import ml_algs.model_data as mdata
import common.strings as strs
from ml_algs.alg_base import AlgBase
import numpy as np
import ml_algs.model_data as mdata

log.basicConfig(format=strs.log_format, level=log.DEBUG, stream=sys.stderr)


class AlgEnsemble(AlgBase):
    def __init__(self, method=mdata.alg_ensemble_stacking):
        super(AlgEnsemble, self).__init__()
        self.class_name = mdata.alg_ensemble
        self.method = method

        if self.method is mdata.alg_ensemble_stacking:
            self.class_name = mdata.alg_ensemble_stacking
        elif self.method is mdata.alg_ensemble_bagging:
            self.class_name = mdata.alg_ensemble_bagging
        elif self.method is mdata.alg_ensemble_adaboost:
            self.class_name = mdata.alg_ensemble_adaboost

    def __repr__(self):
        return self.class_name

    def __str__(self):
        return self.class_name

    def build_clf_pipeline(self):
        if self.method is mdata.alg_ensemble_stacking:
            return self._build_clf_pipeline_stacking()
        elif self.method is mdata.alg_ensemble_bagging:
            return self._build_clf_pipeline_bagging()
        elif self.method is mdata.alg_ensemble_adaboost:
            return self._build_clf_pipeline_adaboost()

    def _build_clf_pipeline_stacking(self):
        estimators = []
        algnames = mdata.get_majority_vote_estimators()
        for algname in algnames:
            alg = mdata.get_algorithm_obj(algname)
            params = mdata.get_best_hyper_parameters(algname)
            log.debug('alg:%s, params:\n%s' % (algname, params))
            clf, pipeline = alg.build_clf_pipeline()
            if params is not None and len(params.keys()) != 0:
                clf.set_params(**params)
            estimators.append((mdata.get_short_name(algname), pipeline))

        log.debug('estimators:%s' % (estimators))

        weights = np.ones(len(algnames)).tolist()
        self.clf = VotingClassifier(estimators=estimators,
                                    voting='soft', weights=weights)
        return self.clf, self.clf

    def _build_clf_pipeline_bagging(self):
        tree = DecisionTreeClassifier(criterion='entropy',
                                      max_depth=None)
        log.debug('estimator:%s' % tree)
        self.clf = BaggingClassifier(base_estimator=tree,
                                    n_estimators=5000,
                                    max_samples=1.0,
                                    max_features=1.0,
                                    bootstrap=True,
                                    bootstrap_features=False,
                                    n_jobs=1,
                                    random_state=1)
        return self.clf, self.clf

    def _build_clf_pipeline_adaboost(self):
        tree = DecisionTreeClassifier(criterion='entropy',
                                      max_depth=None)
        log.debug('estimators:%s' % (tree))
        self.clf = AdaBoostClassifier(base_estimator=tree,
                                      n_estimators=500,
                                      learning_rate=0.1,
                                      random_state=0)
        return self.clf, self.clf


