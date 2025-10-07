import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import sys
import logging as log
import common.strings as strs
from preprocess_data.kaggle_data import KaggleData
from preprocess_data.mnist_data import MnistData
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

data_kaggle = 'kaggle'
data_mnist = 'mnist'
data_house_prices = 'house prices'
data_names = list()
data_names.append(data_kaggle)
data_names.append(data_mnist)
data_names.append(data_house_prices)

data_store_name = data_kaggle
data_store = None

data_store_dict = {}
data_store_dict.setdefault(data_kaggle)
data_store_dict.setdefault(data_mnist)
data_store_dict.setdefault(data_house_prices)


def set_data_name(name):
    global data_store_name
    log.debug('data name: %s' % name)
    data_store_name = name
    create_data_store(True)


def load_data():
    log.debug('start')
    create_data_store(force_process=True)
    if data_store is None:
        log.debug('data is not loaded - {0}'.format(data_store_name))
        return
    data_store.load_data()


def preprocess_data(force_process=False):
    log.debug('start - %d' % (force_process))
    create_data_store(force_process)
    ds = data_store_dict[data_store_name];
    if ds is None:
        return
    ds.preprocess_data()


def create_data_store(force_process=False):
    log.debug('start: %s' % data_store_name)
    global data_store, data_store_dict
    ds = data_store_dict[data_store_name];
    log.debug('data store: {0}'.format(ds))
    if force_process is True or ds is None:
        if data_store_name == data_kaggle:
            ds = KaggleData()
        elif data_store_name == data_mnist:
            ds = MnistData()
        else:
            log.debug('data store is not created because of name mismatch')
        data_store = ds
        data_store_dict[data_store_name] = ds


def get_data_names():
    log.debug('start')
    return data_names
