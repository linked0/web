import sys
import logging as log
from sklearn.pipeline import Pipeline
from sklearn.grid_search import GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
import pandas as pd
import common.strings as strs

X_train = None
X_test = None
y_train = None
y_test = None

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

def set_data(X_tr, y_tr, X_t, y_t):
    global X_train, X_test, y_train, y_test
    X_train = X_tr
    y_train = y_tr
    X_test = X_t
    y_test = y_t

def run():
    pipe_svc = Pipeline([('scl', StandardScaler()),
                         ('clf', SVC(random_state=1))])

    param_range = [0.0001, 0.001, 0.01, 0.1, 1.0, 10.0, 100.0, 1000.0]

    param_grid = [{'clf__C': param_range,
                   'clf__kernel': ['linear']},
                  {'clf__C': param_range,
                   'clf__gamma': param_range,
                   'clf__kernel': ['rbf']}]

    gs = GridSearchCV(estimator=pipe_svc,
                      param_grid=param_grid,
                      scoring='accuracy',
                      cv=10,
                      n_jobs=-1)
    gs = gs.fit(X_train, y_train)
    print(gs.best_score_)
    print(gs.best_params_)

def test():
    df = pd.read_csv('https://archive.ics.uci.edu/ml/machine-learning-databases/breast-cancer-wisconsin/wdbc.data', header=None)
    df.head()

    df.to_csv(r"./breast-cancer.csv", header=False, index=False)

    df = pd.read_csv(r'./breast-cancer.csv', header=None)
    print(df.shape)

    from sklearn.preprocessing import LabelEncoder
    X = df.loc[:, 2:].values
    y = df.loc[:, 1].values
    le = LabelEncoder()
    y = le.fit_transform(y)
    le.transform(['M', 'B'])

    from sklearn.cross_validation import train_test_split

    X_train, X_test, y_train, y_test = \
            train_test_split(X, y, test_size=0.20, random_state=1)

    from sklearn.preprocessing import StandardScaler
    from sklearn.decomposition import PCA
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import Pipeline

    # pipe_lr = Pipeline([('scl', StandardScaler()),
    #             ('pca', PCA(n_components=2)),
    #             ('clf', LogisticRegression(random_state=1))])
    #
    # pipe_lr.fit(X_train, y_train)
    # print('Test Accuracy: %.3f' % pipe_lr.score(X_test, y_test))
    # y_pred = pipe_lr.predict(X_test)

    # import numpy as np
    # from sklearn.cross_validation import StratifiedKFold
    #
    # kfold = StratifiedKFold(y=y_train,
    #                         n_folds=10,
    #                         random_state=1)
    #
    # scores = []
    # for k, (train, test) in enumerate(kfold):
    #     pipe_lr.fit(X_train[train], y_train[train])
    #     score = pipe_lr.score(X_train[test], y_train[test])
    #     scores.append(score)
    #     print('Fold: %s, Class dist.: %s, Acc: %.3f' % (k+1, np.bincount(y_train[train]), score))
    #
    # print('\nCV accuracy: %.3f +/- %.3f' % (np.mean(scores), np.std(scores)))
    #

    pipe_svc = Pipeline([('scl', StandardScaler()),
                ('clf', SVC(random_state=1))])

    param_range = [0.0001, 0.001, 0.01, 0.1, 1.0, 10.0, 100.0, 1000.0]

    param_grid = [{'clf__C': param_range,
                   'clf__kernel': ['linear']},
                     {'clf__C': param_range,
                      'clf__gamma': param_range,
                      'clf__kernel': ['rbf']}]

    gs = GridSearchCV(estimator=pipe_svc,
                      param_grid=param_grid,
                      scoring='accuracy',
                      cv=10,
                      n_jobs=-1)
    gs = gs.fit(X_train, y_train)
    print(gs.best_score_)
    print(gs.best_params_)