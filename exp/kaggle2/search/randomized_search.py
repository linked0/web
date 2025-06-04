import pandas as pd
import scipy as sp
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.cross_validation import KFold
from sklearn.preprocessing import StandardScaler
from sklearn.cross_validation import train_test_split
import logging, sys
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.cross_validation import cross_val_score
from sklearn.learning_curve import learning_curve
from sklearn.learning_curve import validation_curve
import matplotlib.pyplot as plt
from sklearn.grid_search import GridSearchCV, RandomizedSearchCV
from scipy.stats import randint as sp_randint
from sklearn.ensemble import RandomForestClassifier
from time import time
from sklearn.svm import SVC
import common.strings as strs

logging.basicConfig(format=strs.log_format,level=logging.DEBUG,stream=sys.stderr)

X_train = None
X_test = None
y_train = None
y_test = None

def set_data(X_tr, y_tr, X_t, y_t):
    global X_train, X_test, y_train, y_test
    X_train = X_tr
    y_train = y_tr
    X_test = X_t
    y_test = y_t

def randomized_search_forest():
    clf = RandomForestClassifier(n_estimators=20)
    # specify parameters and distributions to sample from
    param_dist = {"max_depth": [3, None],
                "max_features": sp_randint(1, 7),
                "min_samples_split": sp_randint(1, 11),
                "min_samples_leaf": sp_randint(1, 11),
                "bootstrap": [True, False],
                "criterion": ["gini", "entropy"]}

    # run randomized search
    n_iter_search = 100
    random_search = RandomizedSearchCV(clf, param_distributions=param_dist,
                                    n_iter=n_iter_search)

    start = time()
    random_search.fit(X_train, y_train)

    print("RandomizedSearchCV took %.2f seconds for %d candidates"
        " parameter settings.\n" % ((time() - start), n_iter_search))
    print('best score: %f\n' % (random_search.best_score_))
    print('best estimator: %s\n' % (random_search.best_estimator_))
    print('best parameters: %s\n' % (random_search.best_params_))

    clf = random_search.best_estimator_
    clf.fit(X_train, y_train)
    print('Test accuracy: %.3f' % clf.score(X_test, y_test))

def randomized_search_ksvm():
    clf = SVC(random_state=1)
    # specify parameters and distributions to sample from
    param_dist = {
          'clf__C': [0.01, 0.1, 1, 10, 100, 1000],
          'clf__gamma': [0.01, 0.1, 1, 10, 100, 1000],
          'clf__kernel': ['rbf', 'linear'],
    }
    steps = [('scl', StandardScaler()), ('clf', SVC())]
    pipeline = Pipeline(steps)

    # run randomized search
    n_iter_search = 50
    random_search = RandomizedSearchCV(pipeline, param_distributions=param_dist,
                                    n_iter=n_iter_search)

    start = time()
    random_search.fit(X_train, y_train)
    print("RandomizedSearchCV took %.2f seconds for %d candidates"
        " parameter settings.\n" % ((time() - start), n_iter_search))
    print('best score: %f\n' % (random_search.best_score_))
    print('best estimator: %s\n' % (random_search.best_estimator_))
    print('best params: %s\n' % (random_search.best_params_))

    clf = random_search.best_estimator_
    clf.fit(X_train, y_train)
    print('Test accuracy: %.3f' % clf.score(X_test, y_test))