import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import sys
import logging as log
import common.strings as strs
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
from preprocess_data.base_data import BaseData

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

unseen_data_file = './data/test.csv'
prediction_file = './data/kaggle.csv'
categorical_columns = ['Pclass', 'Embarked']
family_column = 'Family'

# hj-comment: move load_data, process_missing_data, convert_to_numeric functions to parent class


class KaggleData(BaseData):
    def __init__(self):
        super(KaggleData, self).__init__()
        self.data_name = 'kaggle'
        self.data_file = './data/train.csv'
        self.train_data_columns = ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked']
        log.debug('start')

    def load_data(self):
        self.org_X, self.org_y = self.load_train_data()
        log.debug('features: {0}'.format(self.org_X.columns))

    def set_features(self, features):
        log.debug('>>>>> - featuers: {0}'.format(features))
        global train_data_columns
        train_data_columns = features

    def preprocess_data(self, force_process=False):
        log.debug('>>>>> start')
        super(KaggleData, self).preprocess_data()
        if self.preprocessed == True and force_process == False:
            return self.X_train, self.y_train, self.X_test, self.y_test

        if self.org_X is None or self.org_y is None:
            self.org_X, self.org_y = self.load_train_data()

        self.X = self.org_X.copy()
        self.y = self.org_y.copy()
        self.process_missing_data(self.X)
        self.merge_data(self.X)
        self.convert_data_type(self.X)
        self.X = self.convert_to_dummy_data(self.X)  # manipulate categorical data
        self.X = self.X.astype(np.float32)
        self.y = self.y.astype(np.float32)
        self.X_df = self.X
        self.X = self.X.values
        self.y = self.y.values
        # y = one_hot_encode(y)
        # self.X = self.standardize_data(self.X)  # standardize
        log.debug('>>>>> Processed Data:\n{0}'.format(self.X[:5]))

        # split data into train, validation, test data
        self.X_train, self.X_test, self.y_train, self.y_test = \
            train_test_split(self.X, self.y, test_size=0.20, random_state=0)
        self.X_train, self.X_valid, self.y_train, self.y_valid = \
            train_test_split(self.X_train, self.y_train, test_size=0.20, random_state=0)

        log.debug('X shape: %s, y shape: %s' % (self.X.shape, self.y.shape))
        log.debug('X train shape: %s, y train shape: %s' % (self.X_train.shape, self.y_train.shape))
        log.debug('X valid shape: %s, y valid shape: %s' % (self.X_valid.shape, self.y_valid.shape))
        log.debug('X test shape: %s, y test shape: %s' % (self.X_test.shape, self.y_test.shape))
        self.preprocessed = True

    def get_X_unseen(self):
        X_unseen = self.load_unseen_data(unseen_data_file)
        self.process_missing_data(X_unseen)
        self.merge_data(X_unseen)
        self.convert_data_type(X_unseen)
        X_unseen = self.convert_to_dummy_data(X_unseen)  # manipulate categorical data
        X_unseen = X_unseen.values
        # X_unseen = self.standardize_data(X_unseen)  # standardize

        log.debug('X_unseen shape: {0}'.format(X_unseen.shape))
        log.debug('>>>>> Processed Data:\n{0}'.format(self.X[:5]))
        return X_unseen

    def get_all_data(self, dataframe=True):
        if dataframe == True:
            X_data = self.X_df
        else:
            X_data = self.X
        return X_data, self.y

    def get_original_data(self):
        log.debug("start")
        log.debug('features: {0}'.format(self.org_X.columns))
        return self.org_X, self.org_y

    def save_predictions(self, predictions):
        submissions = pd.DataFrame({
            "PassengerId": self.titanic_unseen.PassengerId,
            "Survived": predictions
        })
        submissions.to_csv(prediction_file, index=False)

    def load_unseen_data(self, fileame):
        self.titanic_unseen = pd.read_csv(fileame)
        X_temp = self.titanic_unseen[self.train_data_columns]
        log.debug('test data:\n{0}'.format(X_temp.head(5)))
        log.debug('features: {0}'.format(X_temp.columns))
        return X_temp

    def process_missing_data(self, X):
        self.check_missing_data(X)

        if 'Age' in self.train_data_columns:
            log.debug("process missing data for Age")
            X.loc[:, 'Age'] = X["Age"].fillna(X["Age"].median())

        if 'Embarked' in self.train_data_columns:
            log.debug("process missing data for Embarked")
            X.loc[:, 'Embarked'] = X['Embarked'].fillna('S')

        if 'Fare' in self.train_data_columns and 'Pclass' in self.train_data_columns:
            log.debug("process missing data for Fare")
            # nullfares = X[X.Fare == 0]
            nullfares = X[(X.Fare == 0) | (X.Fare.isnull())]
            log.debug('len of nullfares:{0}'.format(nullfares))
            for index in nullfares.index:
                clsFare = X[X.Pclass == X.loc[index, 'Pclass']][X.Fare != 0].Fare.mean()
                # log.debug("Pclass: %s, Fare: %f" % (X.loc[index, 'Pclass'], clsFare))
                X.loc[index, 'Fare'] = clsFare

        self.check_missing_data(X)

    def merge_data(self, X):
        X[family_column] = X['SibSp'] + X['Parch']
        X.drop(['SibSp', 'Parch'], axis=1, inplace=True)

    def check_missing_data(self, X):
        for col in X.columns:
            dtype = X[col].dtype
            if dtype == int:
                log.debug("%s(int): # of null: %d, # of zero: %d" %
                              (col, X[col].isnull().sum(), X[X[col] == 0][col].count()))
            elif dtype == float:
                log.debug("%s(float): # of null: %d, # of zero: %d" %
                              (col, X[col].isnull().sum(), X[X[col] == 0.0][col].count()))
            else:
                log.debug("%s(object): # of null: %d" % (col, X[col].isnull().sum()))

    def convert_data_type(self, X):
        if 'Sex' in self.train_data_columns:
            log.debug("convert Sex data to integer")
            sex_mapping = {'male': 0, 'female': 1}
            X.loc[:, 'Sex'] = X['Sex'].map(sex_mapping)

        print('###### convert_data_type - PClass: {0}', X.Pclass)
        if 'Pclass' in self.train_data_columns:
            log.debug('convert Pclass data to str')
            X.Pclass = X.Pclass.astype(str)
        print('###### convert_data_type - PClass: {0}', X.Pclass)

        # if 'Embarked' in train_data_columns:
        #     log.debug("convert Embarked data to integer")
        #     # embarked_mapping = {label:idx for idx, label in enumerate(np.unique(X['Embarked']))}
        #     embarked_mapping = {'S':0, 'C':1, 'Q':2}
        #     X.loc[:, 'Embarked'] = X['Embarked'].map(embarked_mapping)

    def convert_to_dummy_data_old(self, X):
        log.debug('X shape: %s' % (X.shape,))
        cat_list = self.get_categorical_list(X)
        log.debug('X head:{0}'.format(X.head(5)))
        log.debug('categorical list:{0}'.format(cat_list))
        log.debug('X info:{0}'.format(X.info()))
        self.save_temp_data(X)
        ohe = OneHotEncoder(categorical_features=cat_list)
        X = ohe.fit_transform(X)
        X = X.toarray()
        log.debug('X head 2:{0}'.format(X[:5]))
        log.debug('end - type(X): %s' % type(X))
        return X

    def convert_to_dummy_data(self, X):
        log.debug('X shape: %s' % (X.shape,))
        log.debug('X info:{0}'.format(X.info()))
        log.debug('type(X):{0}'.format(type(X)))
        cat_list = self.get_categorical_name_list(X, self.train_data_columns)
        self.save_temp_data(X)
        dummies = pd.get_dummies(X[cat_list])
        X = pd.concat([X, dummies], axis=1)
        X.drop(['Pclass', 'Embarked'], inplace=True, axis=1)
        log.debug('X head:{0}'.format(X.iloc[:5,:]))
        self.save_temp_data(X)
        return X

    @staticmethod
    def get_categorical_list(X):
        log.debug('should be implemented completely')
        col_indices = []
        for index in range(len(train_data_columns)):
            if train_data_columns[index] in categorical_columns:
                col_indices.append(index)
        log.debug('columns:{0}'.format(train_data_columns))
        log.debug('indices:{0}'.format(col_indices))
        return col_indices

    @staticmethod
    def get_categorical_name_list(X, columns):
        log.debug('should be implemented completely')
        col_names = []
        for index in range(len(columns)):
            if columns[index] in categorical_columns:
                col_names.append(columns[index])
        log.debug('categorical columns:{0}'.format(col_names))
        return col_names

    def standardize_data(self, X):
        log.debug('start')
        stdsc = StandardScaler()
        X_std = stdsc.fit_transform(X)
        return X_std

    @staticmethod
    def one_hot_encode(self, labels):
        log.debug('shape of labels: \n%s' % labels.shape)
        log.debug('original labels: \n%s' % labels)
        ohe = OneHotEncoder(categorical_features=[0])
        enc_labels = ohe.fit_transform(labels)
        log.debug('one hot encoding labels: \n%s' % enc_labels)
        return enc_labels

    def get_batch_size(self):
        log.debug('##### start')
        return 128

    def get_hidden_size(self):
        log.debug('##### start')
        return 1024

    def get_step_size(self):
        log.debug('##### start')
        return 6001

    @staticmethod
    def save_temp_data(dataset):
        submissions = pd.DataFrame(dataset)
        submissions.to_csv("./data/temp2.csv", index=False)