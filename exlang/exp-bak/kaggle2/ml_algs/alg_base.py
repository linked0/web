import logging as log
import sys
import numpy as np
import pandas as pd
from scipy import interp
from sklearn.model_selection import learning_curve
from sklearn.model_selection import validation_curve
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_curve, auc
from sklearn.feature_selection import RFECV
from sklearn.datasets import make_classification
from sklearn.feature_selection import SelectKBest, f_regression, chi2
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator
from sklearn.base import ClassifierMixin
import common.control_view as ctlview
import common.strings as strs
import ml_algs.model_data as mdata
import preprocess_data.preprocess as pk
from common import config
from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import GridSearchCV

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

# hj-comment, apply ElasticNet

class AlgBase(BaseEstimator, ClassifierMixin):
    def __init__(self):
        self.clf = None
        self.pipeline = None
        self.X_train = None
        self.X_train_reduced = None
        self.y_train = None

        self.X_test = None
        self.X_test_reduced = None
        self.y_test = None
        self.class_name = "AlbBase"

    def __repr__(self):
        return self.class_name

    def __str__(self):
        return self.class_name

    @staticmethod
    def accuracy(predicted_y, y):
        return float(sum(predicted_y == y)) / len(y)

    def build_clf_pipeline(self):
        log.debug('should not called in base class')

    def show_learning_curve(self, fig, ax):
        self.get_dataset()
        X_train, y_train, X_test, y_test = self.reduce_dataset()
        log.debug('X_train: %s, y_train: %s, X_test: %s, y_test: %s' %
                  (X_train.shape, y_train.shape, X_test.shape, y_test.shape))

        clf, pipeline = self.build_clf_pipeline()
        log.debug('##### clf:%s' % clf)
        self.set_best_params(clf, pipeline)

        # get learning curver for diagnosing bias and variance problems
        train_sizes, train_scores, test_scores = \
            learning_curve(estimator=pipeline,
                           X=X_train,
                           y=y_train,
                           train_sizes=np.linspace(0.1, 1.0, 10),
                           cv=10,
                           n_jobs=1)
        train_mean = np.mean(train_scores, axis=1)
        train_std = np.std(test_scores, axis=1)
        test_mean = np.mean(test_scores, axis=1)
        test_std = np.std(test_scores, axis=1)

        ax.cla()
        ax.plot(train_sizes, train_mean,
                color='blue', marker='o',
                label='training accuracy')
        ax.fill_between(train_sizes,
                        train_mean + train_std,
                        train_mean - train_std,
                        alpha=0.15, color='blue')
        ax.plot(train_sizes, test_mean,
                color='green', linestyle='--',
                marker='s', markersize=5,
                label='validation accuracy')
        ax.fill_between(train_sizes,
                        test_mean + test_std,
                        test_mean - test_std,
                        alpha=0.15, color='green')
        ax.grid()
        ax.set_xlabel('Number of training samples')
        ax.set_ylabel('Accuracy')
        ax.legend(loc='lower left')
        ax.set_ylim([config.accuracy_y_bottom, 1.0])
        fig.canvas.draw()

        # Estimating model performance
        pipeline.fit(X_train, y_train)
        predicted = pipeline.predict(X_test)
        score = AlgBase.accuracy(predicted, y_test)

        log.debug('Test accuracy: %.4f' % (score))
        mdata.update_score(mdata.info_score_acc, score)
        ctlview.invalidate_score_view()
        log.debug("end")

    def show_validation_curve(self, fig, ax, param_name, param_range):
        log.debug('>>>>> start')
        self.get_dataset()
        self.reduce_dataset()
        X_train, y_train, _, _ = self.reduce_dataset()
        log.debug('X_train: %s, y_train: %s' % (X_train.shape, y_train.shape))

        log.debug('param name:%s\nparam range:%s' % (param_name, param_range))
        clf, pipeline = self.build_clf_pipeline()
        self.set_best_params(clf, pipeline)

        train_scores, test_scores = validation_curve(
            estimator=pipeline,
            X=X_train,
            y=y_train,
            param_name=param_name,
            param_range=param_range,
            cv=10)
        train_mean = np.mean(train_scores, axis=1)
        train_std = np.std(train_scores, axis=1)
        test_mean = np.mean(test_scores, axis=1)
        test_std = np.std(test_scores, axis=1)

        ax.cla()
        mod_param_range = param_range
        if type(param_range[0]) == str:
            mod_param_range = [i+1 for i in range(len(param_range))]
        str_param_range = [str(unit) for unit in param_range]
        ax.plot(mod_param_range, train_mean,
                color='blue', marker='o',
                markersize=5,
                label='training accuracy')
        ax.fill_between(mod_param_range, train_mean + train_std,
                        train_mean - train_std, color='blue',
                        alpha=0.15)
        ax.plot(mod_param_range, test_mean,
                color='red', marker='s',
                markersize=5, linestyle='--',
                label='test accuracy')
        ax.fill_between(mod_param_range, test_mean + test_std,
                        test_mean - test_std, color='red',
                        alpha=0.15)
        ax.grid()
        ax.set_xscale('log')
        log.debug('mod_param_range - %s' % mod_param_range)
        log.debug('param_range - %s' % str_param_range)
        if type(param_range[0]) == str:
            ax.set_xticklabels(str_param_range)
        ax.set_xlabel('Parameter: %s' % param_name.split('__')[1])
        # ax.set_xlim(0, mod_param_range[-1] + 1)
        ax.set_ylabel('accuracy')
        ax.set_ylim([config.accuracy_y_bottom, 1.0])
        ax.legend(loc='lower left')
        fig.canvas.draw()
        log.debug("end")

    def show_roc_curve(self, fig, ax):
        X_train, y_train, _, _ = self.reduce_dataset()

        log.debug('start - self.y_train: %s' % (y_train.shape))
        clf, pipeline = self.build_clf_pipeline()
        self.set_best_params(clf, pipeline)

        n_folds = 3
        skf = StratifiedKFold(n_splits=n_folds)
        skf.get_n_splits(self.X_train, self.y_train)

        ax.cla()
        mean_tpr = 0.0
        mean_fpr = np.linspace(0, 1, 100)
        log.debug('X_train: %s, y_train: %s' % (X_train.shape, y_train.shape))
        i = 0
        for train, test in skf.split(self.X_train, self.y_train):
            # log.debug('(train, test): %s, %s' % (train, test))
            pipeline.fit(X_train[train], y_train[train])
            probas = pipeline.predict_proba(X_train[test])
            fpr, tpr, thresholds = roc_curve(y_train[test],
                                             probas[:, 1],
                                             pos_label=1)
            mean_tpr += interp(mean_fpr, fpr, tpr)
            mean_tpr[0] = 0.0
            roc_auc = auc(fpr, tpr)
            ax.plot(fpr,
                    tpr,
                    lw=1,
                    label='Roc fold %d (area = %0.2f)' % (i + 1, roc_auc))
            i += 1

        ax.plot([0, 1],
                [0, 1],
                linestyle='--',
                color=(0.6, 0.6, 0.6),
                label='random guessing')
        mean_tpr /= n_folds
        mean_tpr[-1] = 1.0
        mean_auc = auc(mean_fpr, mean_tpr)
        ax.plot(mean_fpr, mean_tpr, 'k--',
                label='mean ROC (area = %0.2f' % mean_auc, lw=2)
        ax.plot([0, 0, 1],
                [0, 1, 1],
                lw=2,
                linestyle=':',
                color='black',
                label='perfect performance')
        ax.set_xlim([-0.05, 1.05])
        ax.set_ylim([-0.05, 1.05])
        ax.set_xlabel('false positive rate')
        ax.set_ylabel('true positive rate')
        ax.set_title('Receiver Operator Characteristic')
        ax.legend(loc='lower right')
        fig.canvas.draw()

        mdata.update_score(mdata.info_score_auc, mean_auc)
        ctlview.invalidate_score_view()

    def show_dimen_reduction(self, fig, ax):
        log.debug('#####')
        pk.preprocess_data()
        self.get_dataset()
        log.debug('X_train: %s, y_train: %s' % (self.X_train.shape, self.y_train.shape))

        clf, pipeline = self.build_clf_pipeline()
        # rfecv = RFECV(estimator=clf, step=1, cv=5, scoring='accuracy')
        # rfecv.fit(self.X_train, self.y_train)
        # log.debug('Optimal number of features: %d' % rfecv.n_features_)

        # Feature selector
        selector_k_best = SelectKBest(f_regression, k=10)

        # Build the machine learning pipeline
        pipeline_clf = Pipeline([('selector', selector_k_best),
                                 ('rf', clf)])

        best_features = None
        best_score = 0
        for k in range(2, pk.data_store.get_x_field_count()+1):
            pipeline_clf.set_params(selector__k=k)
            # Training the classifier
            pipeline_clf.fit(self.X_train, self.y_train)

            # Print score
            cur_score = pipeline_clf.score(self.X_test, self.y_test)
            log.debug('Feature Count: %d, Score:%f' %
                      (k, cur_score))

            # Print the selected features chosen by the selector
            features_status = pipeline_clf.named_steps['selector'].get_support()
            selected_features = []
            for count, item in enumerate(features_status):
                if item:
                    selected_features.append(count)
            log.debug('Selected features:%s' % (','.join([str(x) for x in selected_features])))

            if cur_score > best_score:
                best_features = selected_features
                best_score = cur_score

            mdata.set_reduced_features(best_features)

    def predict(self):
        pk.preprocess_data()
        self.get_dataset()
        X_train, y_train, X_test, y_test = self.reduce_dataset()
        log.debug('X_train: %s, y_train: %s, X_test: %s, y_test: %s' %
                  (X_train.shape, y_train.shape, X_test.shape, y_test.shape))

        clf, pipeline = self.build_clf_pipeline()
        self.set_best_params(clf, pipeline)

        # Estimating model performance
        pipeline.fit(X_train, y_train)
        predicted = pipeline.predict(X_test)
        score = AlgBase.accuracy(predicted, y_test)
        log.debug('Test accuracy: %.2f' % (score))

        sel_features = mdata.get_reduced_features()
        log.debug('Selected features indeces: %s' % sel_features)
        X_unseen = pk.data_store.get_X_unseen()
        if sel_features is not None:
            X_unseen = X_unseen[:, sel_features]
        predictions = pipeline.predict(X_unseen).astype(int)
        pk.data_store.save_predictions(predictions)
        log.debug("end")

    def do_grid_search(self):
        self.get_dataset()
        n_folds = mdata.get_grid_search_fold()
        skf = StratifiedKFold(n_splits=n_folds)
        skf.get_n_splits(self.X_train, self.y_train)
        clf, pipeline = self.build_clf_pipeline()
        log.debug('get_params: %s' % (pipeline.get_params().keys()))
        params = mdata.get_hyper_param_pairs(self.class_name)
        if len(params) > 0:
            temp_params = {}
            for (param, range) in params.items():
                if mdata.is_param_float_type(param) is True:
                    temp_range = [float(value_str) for value_str in range]
                elif mdata.is_param_int_type(param) is True:
                    temp_range = [int(value_str) for value_str in range]
                else:
                    temp_range = range
                temp_name = "clf__" + param
                temp_params[temp_name] = temp_range

            gs = GridSearchCV(estimator=pipeline,
                                      param_grid=temp_params,
                                      n_jobs=-1, cv=skf,
                                      verbose=2)
            gs.fit(self.X_train, self.y_train)
            log.debug('GridSearch Params:%s' % gs.param_grid)
            log.debug('Best CV accuracy: %g\nBest params: %s\n' % (gs.best_score_, gs.best_params_))
            mdata.set_grid_search_param_values(gs.best_params_)

    def set_best_params(self, clf, pipeline):
        best_params = mdata.get_best_hyper_params()
        log.debug('best params: %s', best_params)
        if len(best_params.keys()) != 0:
            if 'clf' in best_params.keys()[0]:
                pipeline.set_params(**best_params)
                log.debug('set pipeline params: %s' % pipeline.get_params())
            else:
                clf.set_params(**best_params)
                log.debug('set clf params: %s' % clf.get_params())

    def get_dataset(self):
        pk.preprocess_data()
        self.X_train = pk.data_store.get_X_train(include_valid=True)
        self.y_train = pk.data_store.get_y_train(include_valid=True)
        self.X_test = pk.data_store.get_X_test()
        self.y_test = pk.data_store.get_y_test()

    def reduce_dataset(self):
        sel_features = mdata.get_reduced_features()
        log.debug('shape of X_train(%s):%s' % (type(self.X_train), self.X_train.shape,))
        log.debug('shape of X_test(%s):%s' % (type(self.X_test), self.X_test.shape,))
        log.debug('Selected features indeces: %s' % sel_features)
        if sel_features is not None:
            if self.X_train_reduced is None:
                self.X_train_reduced = self.X_train[:, sel_features]
                self.X_test_reduced = self.X_test[:, sel_features]
            return self.X_train_reduced, self.y_train, self.X_test_reduced, self.y_test
        else:
            return self.X_train, self.y_train, self.X_test, self.y_test