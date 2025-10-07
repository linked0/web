import os
import sys
import logging as log
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
import common.strings as strs
import preprocess_data.preprocess as prep
from sklearn.cross_validation import cross_val_score
from sklearn.cross_validation import train_test_split
from sklearn.learning_curve import learning_curve

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

def run():
    prep.preprocess_data()
    X_train = prep.data_store.get_X_train(include_valid=True)
    y_train = prep.data_store.get_y_train(include_valid=True, one_hot_encoding=False)
    X_test = prep.data_store.get_X_test()
    y_test = prep.data_store.get_y_test(one_hot_encoding=False)
    log.debug('X_train: %s, y_train: %s, X_test: %s, y_test: %s' %
              (X_train.shape, y_train.shape, X_test.shape, y_test.shape))
    log.debug('X_train[:5]: %s' % (X_train[100:105]))
    log.debug('y_train[:5]: %s' % (y_train[100:105]))

    pipeline = SVC()
    train_sizes, train_scores, test_scores = \
        learning_curve(estimator=pipeline,
                       X=X_train[:1000],
                       y=y_train[:1000],
                       train_sizes=np.linspace(0.1, 1.0, 10),
                       cv=10,
                       n_jobs=1)
    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(test_scores, axis=1)
    test_mean = np.mean(test_scores, axis=1)
    test_std = np.std(test_scores, axis=1)

    log.debug('accuracy: %s, type: %s' % (train_mean[-1], type(train_mean)))
    log.debug('accuracy: %s, type: %s' % (test_mean[-1], type(test_mean)))
    log.debug("end")
