import sys
import logging as log
import common.strings as strs
import numpy as np
import common.config as const
import pandas as pd

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)
np.set_printoptions(linewidth=1000)

class BaseData(object):
    def __init__(self):
        log.debug('start')
        self.init()

    def init(self):
        self.data_name = None
        self.data_file = None
        self.train_data_columns = None
        self.X = None
        self.y = None
        self.org_X = None
        self.org_y = None
        self.X_train = None
        self.y_train = None
        self.X_valid = None
        self.y_valid = None
        self.X_test = None
        self.y_test = None
        self.loaded_data = None
        self.preprocessed = False
        self.cur_dimen_reduct_method = const.param_none

    def set_columns(self, columns):
        self.train_data_columns = columns

    def set_data_file(self, path):
        log.debug('start')
        self.data_file = path

    def preprocess_data(self):
        # if self.cur_dimen_reduct_method != mdata.get_dimem_reduct_method():
        #     self.preprocessed = False
        log.debug('##### data name: %s' % self.data_name)
        return

    def get_titanic(self):
        return self.loaded_data

    def get_X_train(self, include_valid=False, size=-1):
        log.debug('>>>>> start - shape of X_train: %s' % (self.X_train.shape,))
        log.debug('##### data name: %s' % self.data_name)
        if include_valid is True and self.X_valid is not None:
            temp_X_train = np.vstack((self.X_train, self.X_valid))
            log.debug('temp_X_train shape: %s' % (temp_X_train.shape,))
            dataset = temp_X_train
        else:
            dataset = self.X_train

        if size != -1:
            return dataset[:size]
        else:
            return dataset

    def get_y_train(self, include_valid=False, one_hot_encoding=False, size=-1):
        log.debug('##### data name: %s' % self.data_name)
        if include_valid is True and self.y_valid is not None:
            if len(self.y_train.shape) == 2:
                temp_y_train = np.vstack((self.y_train, self.y_valid))
            else:
                temp_y_train = np.concatenate((self.y_train, self.y_valid))
        else:
            temp_y_train = self.y_train

        if one_hot_encoding is False:
            labels = self._convert_values_no_ohe(temp_y_train)
        else:
            labels = self.y_train

        if size != -1:
            return labels[:size]
        else:
            return labels

    def get_X_valid(self, size=-1):
        log.debug('##### data name: %s' % self.data_name)
        if size != -1:
            return self.X_valid[:size]
        else:
            return self.X_valid

    def get_y_valid(self, one_hot_encoding=False, size=-1):
        log.debug('##### data name: %s' % self.data_name)
        if one_hot_encoding is False:
            labels = self._convert_values_no_ohe(self.y_valid)
        else:
            labels = self.y_valid

        if size != -1:
            return labels[:size]
        else:
            return labels

    def get_X_test(self, size=-1):
        log.debug('##### data name: %s' % self.data_name)
        if size != -1:
            return self.X_test[:size]
        else:
            return self.X_test

    def get_y_test(self, one_hot_encoding=False, size=-1):
        log.debug('##### data name: %s' % self.data_name)
        if one_hot_encoding is False:
            labels = self._convert_values_no_ohe(self.y_test)
        else:
            labels = self.y_test

        if size != -1:
            return labels[:size]
        else:
            return labels

    def get_x_field_count(self):
        log.debug('start - shape of X_train: %s' % (self.X_train.shape,))
        log.debug('##### data name: %s' % self.data_name)
        if self.X_train is None:
            log.debug(strs.error_obj_null)
            return None
        return self.X_train.shape[1]

    def get_y_value_count(self):
        log.debug('start - shape of y_train: %s' % (self.y_train.shape,))
        log.debug('##### data name: %s' % self.data_name)
        if self.y_train is None:
            log.debug(strs.error_obj_null)
            return None

        if len(self.y_train.shape) == 1:  # binary classification
            return 1
        else:
            return self.y_train.shape[1]

    def get_batch_size(self):
        log.debug('>>>>> start')
        log.debug('##### data name: %s' % self.data_name)
        return 0

    def get_hidden_size(self):
        log.debug('>>>>> start')
        log.debug('##### data name: %s' % self.data_name)
        return 0

    def get_step_size(self):
        log.debug('>>>>> start')
        log.debug('##### data name: %s' % self.data_name)
        return 0

    def load_train_data(self):
        self.loaded_data = pd.read_csv(self.data_file)
        log.debug('##### specified data columns: %s' % self.train_data_columns)
        X = self.loaded_data[self.train_data_columns]
        y = self.loaded_data['Survived']
        log.debug('test data: \n{0}'.format(X.head(10)))
        return X, y

    def _convert_values_no_ohe(self, values):
        log.debug('##### data name: %s' % self.data_name)
        if self.get_y_value_count() == 1:
            return values
        else:
            return np.argmax(values, axis=1)
