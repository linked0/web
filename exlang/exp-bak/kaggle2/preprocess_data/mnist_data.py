import sys
import logging as log
import pandas as pd
import numpy as np
import common.strings as strs
from preprocess_data.base_data import BaseData
from six.moves import cPickle as pickle

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)
batch_size = 128
image_size = 28
num_labels = 10

class MnistData(BaseData):
    def __init__(self):
        log.debug('start')
        super(MnistData, self).__init__()
        self.data_name = 'MNinst'
        self.data_file = '~/pooh/poohdrop/large-data/notMNIST2.pickle'

    def preprocess_data(self, force_process=False):
        super(MnistData, self).preprocess_data()
        if self.preprocessed == True and force_process == False:
            return self.X_train, self.y_train, self.X_test, self.y_test

        try:
            f = open(self.data_file, 'rb')
            data = pickle.load(f)
            f.close()
        except Exception as e:
            print('unable to load file ', self.data_file, ':', e)

        self.init()
        train_dataset = data['train_dataset']
        train_labels = data['train_labels']
        valid_dataset = data['valid_dataset']
        valid_labels = data['valid_labels']
        test_dataset = data['test_dataset']
        test_labels = data['test_labels']

        print('cleansed training data: ', train_dataset.shape, train_labels.shape)
        print('cleansed validation data: ', valid_dataset.shape, valid_labels.shape)
        print('cleansed test data: ', test_dataset.shape, test_labels.shape)

        self.X_train, self.y_train = MnistData.reformat(train_dataset, train_labels)
        self.X_valid, self.y_valid = MnistData.reformat(valid_dataset, valid_labels)
        self.X_test, self.y_test = MnistData.reformat(test_dataset, test_labels)
        print('Training set: %s, %s' % (self.X_train.shape, self.y_train.shape))
        print('Validation set: %s, %s' % (self.X_valid.shape, self.X_valid.shape))
        print('Test set: %s, %s' % (self.X_test.shape, self.X_test.shape))

    def load_data(self):
        log.debug('>>>>>')

    @staticmethod
    def reformat(dataset, labels):
        dataset = dataset.reshape((-1, image_size * image_size)).astype(np.float32)
        labels = (np.arange(num_labels) == labels[:, None]).astype(np.float32)
        return dataset, labels

    def get_batch_size(self):
        log.debug('##### start')
        return 128

    def get_hidden_size(self):
        log.debug('##### start')
        return 1024

    def get_step_size(self):
        log.debug('##### start')
        return 3001