import sys
import logging as log
import common.strings as strs
from common import control_view as ctlview
import common.config as const
from six.moves import cPickle as pickle

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

# train information file
train_info_file = './data/train-info.pickle'

# algorithm list
alg_svm = 'SVM'
alg_linear_reg = 'Linear Regression'
alg_ridge = 'Ridge'
alg_k_neighbor = 'K-Neighbors'
alg_kernel_svm = 'Kernel SVM'
alg_logistic_regression = 'Logistic Regression'
alg_neural_net = 'Deep Neural Net'
alg_random_forest = 'Random Forest'
alg_gaussian_nb = 'Gaussian NB'
alg_decision_tree = 'Decision Tree'
alg_ensemble = 'Ensemble'
alg_ensemble_stacking = 'Ensemble Stacking'
alg_ensemble_bagging = 'Ensemble Bagging'  # Bootrap Aggregating
alg_ensemble_adaboost = 'Ensemble Adaboost'

# hyperparameter for common
hyper_feature_selection = "feature_selection"
hyper_feature_extraction = "feature_extraction"

# hyperparameter for SVM
hyper_c = 'C'
hyper_gamma = 'gamma'

# hyperparameter for Linear Regression
hyper_fit_intercept = 'fit_intercept'
hyper_normalize = 'normalize'

# hyperparameter for Ridge
hyper_alpha = 'alpha'

# hyperparameter for K-Neighbors
hyper_n_neighbor = 'n_neighbors'
hyper_p = 'p'

# hyperparameter for Logistic Regression
hyper_penalty = 'penalty'

# hyperparameter for Random Forest
hyper_n_estimator = 'n_estimators'  # number of trees
hyper_max_depth = 'max_depth'
hyper_min_samples_split = 'min_samples_split'
hyper_min_samples_leaf = 'min_samples_leaf'
hyper_max_features = 'max_features'

# score info
info_alg = 'alg'
info_score_acc = 'accuracy'
info_score_acc_graph = 'acc_graph'
info_score_f1 = 'f1'
info_score_auc = 'auc'
info_socre_auc_graph = 'auc_graph'
info_params = 'params'
# info_params_gs = 'params_gridsearch'
info_score_metric = info_score_acc

algorithms = [alg_kernel_svm,
              alg_linear_reg,
              alg_k_neighbor,
              alg_logistic_regression,
              alg_decision_tree,
              alg_random_forest,
              alg_neural_net,
              alg_gaussian_nb,
              alg_ensemble_stacking,
              alg_ensemble_bagging,
              alg_ensemble_adaboost]

alg_objs = {
    alg_linear_reg: None,  # AlgLinearRegression(),
    alg_ridge: None,  # AlgKernelSVM(),
    alg_k_neighbor: None,  # AlgKNeighbors(),
    alg_svm: None,  # AlgSVM(),
    alg_kernel_svm: None,  # AlgKernelSVM(),
    alg_logistic_regression: None,  # AlgLogisticRegression(),
    alg_decision_tree: None, # AlgDecisionTree()
    alg_random_forest: None,  # AlgRandomForest(),
    alg_neural_net: None,  # AlgKernelSVM()
    alg_gaussian_nb: None, # AlgGaussianNB()
    alg_ensemble_stacking: None, # AlgEnsemble()
    alg_ensemble_bagging: None, # AlgEnsemble()
    alg_ensemble_adaboost: None # AlgEnsemble()
}

alg_short_names = {
    alg_linear_reg: 'linr',
    alg_ridge: 'ridge',
    alg_k_neighbor: 'knn',
    alg_svm: 'svm',
    alg_kernel_svm: 'ksvm',
    alg_logistic_regression: 'logr',
    alg_decision_tree: 'tree',
    alg_random_forest: 'rf',
    alg_neural_net: 'nn',
    alg_gaussian_nb: 'gnb',
    alg_ensemble_stacking: 'esmblstack',
    alg_ensemble_bagging: 'esmblbag',
    alg_ensemble_adaboost: 'esmblada'
}

hyper_params = {
    alg_linear_reg: [hyper_fit_intercept, hyper_normalize],
    alg_ridge: [hyper_alpha, hyper_fit_intercept,hyper_normalize],
    alg_k_neighbor: [hyper_n_neighbor, hyper_p],
    alg_kernel_svm: [hyper_c, hyper_gamma],
    alg_decision_tree: [],
    alg_logistic_regression: [hyper_penalty, hyper_c],
    alg_random_forest: [hyper_n_estimator, hyper_max_depth, hyper_min_samples_split,
                        hyper_min_samples_leaf],
    alg_neural_net: [hyper_c, hyper_gamma],
    alg_svm: [hyper_c, hyper_gamma],
    alg_gaussian_nb: [],
    alg_ensemble_stacking: [],
    alg_ensemble_bagging: [],
    alg_ensemble_adaboost: []
}

param_value_select_seq_forw = 'Sequential Forward'
param_value_select_seq_backw = 'Sequential Backward'
param_value_select_seq_float_forw = 'Sequential Floating Forward'
param_value_select_seq_float_backw = 'Sequential Floating Backward'

param_value_extract_pca = "PCA"
param_value_extract_lda = "LDA"
param_value_extract_kpca = "Kernel PCA"

dimem_reduction_methods = {
    hyper_feature_selection: [param_value_select_seq_forw,
                              param_value_select_seq_backw,
                              param_value_select_seq_float_forw,
                              param_value_select_seq_float_backw],
    hyper_feature_extraction: [param_value_extract_pca,
                               param_value_extract_lda,
                               param_value_extract_kpca]
}

param_range = {hyper_c: ['0.001', '0.01', '0.1','1.0', '10.0', '100.0', '1000.0'],
               hyper_gamma: ['0.001', '0.01', '0.1', '1.0', '10.0', '100.0'],
               hyper_fit_intercept: ['True', 'False'],
               hyper_normalize: ['True', 'False'],
               hyper_alpha: ['0.01', '0.1', '1.0', '10.0', '100.0'],
               hyper_n_neighbor: ['2', '4', '8', '16'],
               hyper_p: ['2', '3'],
               hyper_penalty: ['l1', 'l2'],
               hyper_n_estimator: ['120', '300', '500', '800', '1200'],
               hyper_max_depth: ['5', '8', '15', '25', '30'],
               hyper_min_samples_split: ['2', '5', '10', '15', '100'],
               hyper_min_samples_leaf: ['1', '2', '5', '10'],
               hyper_max_features: ['log2', 'sqrt',], # hj-comment: check this
}

# param_range = {hyper_c: [0.001, 0.01, 0.1, 1.0, 10.0, 100.0, 1000.0],
#                hyper_gamma: [0.001, 0.01, 0.1, 1.0, 10.0, 100.0],
#                hyper_fit_intercept: [True, False],
#                hyper_normalize: [True, False],
#                hyper_alpha: [0.01, 0.1, 1.0, 10.0, 100.0],
#                hyper_n_neighbor: [2, 4, 8, 16],
#                hyper_p: [2, 3],
#                hyper_penalty: ['l1', 'l2'],
#                hyper_n_estimator: [120, 300, 500, 800, 1200],
#                hyper_max_depth: [5, 8, 15, 25, 30],
#                hyper_min_samples_split: [2, 5, 10, 15, 100],
#                hyper_min_samples_leaf: [1, 2, 5, 10],
#                hyper_max_features: ['log2', 'sqrt',], # hj-comment: check this
# }

param_types = {hyper_c: float,
               hyper_gamma: float,
               hyper_fit_intercept: bool,
               hyper_normalize: bool,
               hyper_alpha: float,
               hyper_n_neighbor: int,
               hyper_p: int,
               hyper_penalty: str,
               hyper_n_estimator: int,
               hyper_max_depth: int,
               hyper_min_samples_split: int,
               hyper_min_samples_leaf: int,
               hyper_max_features: str,
               hyper_feature_selection: str,
}

# variables for algorithm and methods to be used in training process
sel_alg = None
every_algs_best_train = {}
old_best_train_info = None
best_train_info = None
cur_train_info = None
dimen_reduct_method = const.param_none
reduced_features = None
majority_vote_estimators = None
# use_grid_search_params = False
grid_search_fold = 10

def init():
    load_train_info_file()

def run_alg():
    log.debug('start')
    alg = get_algorithm_obj(sel_alg)
    if alg is None:
        log.debug('alg object is None')
    log.debug('type of algorithm object: {0}'.format(alg))
    alg.show_learning_curve(ctlview.fig, ctlview.ax_learning_score)
    alg.show_roc_curve(ctlview.fig, ctlview.ax_auc)
    save_train_info()
    ctlview.invalidate_score_view()

def predict():
    log.debug('start')
    alg = get_algorithm_obj(sel_alg)
    alg.predict()


def do_model_selection(param_name):
    log.debug('start - selected algorithm: %s' % (sel_alg))
    alg = get_algorithm_obj(sel_alg)
    param_range = get_param_range(param_name)
    clf_param_name = 'clf__' + param_name
    alg.show_validation_curve(ctlview.fig, ctlview.ax_validation,
                              clf_param_name, param_range)

def do_grid_search():
    log.debug('start - selected algorithm: %s' % (sel_alg))
    alg = get_algorithm_obj(sel_alg)
    alg.do_grid_search()


def show_roc():
    log.debug('start')
    alg = get_algorithm_obj(sel_alg)
    alg.show_roc_curve(ctlview.fig, ctlview.ax_auc)


def show_dimen_reduction():
    log.debug('start')
    alg = get_algorithm_obj(sel_alg)
    alg.show_dimen_reduction(ctlview.fig, ctlview.dimen_reduct_view)


def get_algorithms():
    return algorithms


def get_algorithm_obj(alg_name):
    log.debug('start - %s' % (alg_name))
    obj = alg_objs[alg_name]
    if obj is None:
        log.debug(strs.error_no_object_for_algorithm_name, " - ", alg_name)
    return obj


def set_algorithm_obj(alg_name, alg_obj):
    alg_objs[alg_name] = alg_obj


def get_hyper_param_pairs(alg_name):
    log.debug('start - %s' % alg_name)
    param_dic = {}
    for param in hyper_params[alg_name]:
        param_dic[param] = param_range[param]
    return param_dic


def set_alg(alg):
    global sel_alg, cur_train_info, old_best_train_info
    log.debug('cur_train_info: %s' % cur_train_info)

    sel_alg = alg
    reset_dimen_reduction()
    load_current_train_info()

    if best_train_info != old_best_train_info:
        ctlview.invalidate_score_view()

    log.debug('end')

def set_hyper_param_value(param_name, param_value):
    global sel_alg, param_types, cur_train_info
    log.debug('start - param_name: %s, param_value: %s' % (param_name, param_value))
    if param_value is not None:
        cur_train_info[info_params][param_name] = \
            param_types[param_name](param_value)
    else:
        cur_train_info[info_params].pop(param_name, None)


def set_grid_search_param_values(best_params):
    global sel_alg, param_types, cur_train_info
    params = {}
    for (key, value) in best_params.items():
        if 'clf' in key:
            name = key.split('__')[1]
        params[name] = value
    log.debug('params:%s' % params)
    cur_train_info[info_params] = params


def get_best_hyper_params():
    global sel_alg, cur_train_info
    log.debug(cur_train_info[info_params])
    return cur_train_info[info_params]


def set_reduced_features(features):
    global reduced_features
    reduced_features = features


def get_reduced_features():
    return reduced_features


def remove_hyper_param_value(param_value):
    global cur_train_info
    cur_train_info[info_params].pop(param_value, None)


def get_best_hyper_parameters(algname):
    modelinfo = None
    if algname in every_algs_best_train.keys():
        modelinfo = every_algs_best_train[algname]
    if modelinfo is not None:
        return modelinfo[info_params]
    else:
        return None


def get_param_range(param_name):
    global sel_alg, param_types
    log.debug('current hyper param: %s' % param_name)
    hyperparams = get_hyper_param_pairs(sel_alg)
    param_range = hyperparams[param_name]
    param_range = [param_types[param_name](i) for i in param_range]
    return param_range


def get_dimem_reduction_methods():
    return dimem_reduction_methods


def load_current_train_info():
    global every_algs_best_train, cur_train_info, sel_alg
    log.debug('start')
    cur_train_info = {}
    cur_train_info[info_alg] = sel_alg
    cur_train_info.setdefault(info_score_acc, 0.0)
    cur_train_info.setdefault(info_score_acc_graph, None)
    cur_train_info.setdefault(info_score_f1, 0.0)
    cur_train_info.setdefault(info_score_auc, 0.0)
    cur_train_info.setdefault(info_socre_auc_graph, None)
    cur_train_info.setdefault(info_params, {})
    # cur_train_info.setdefault(info_params_gs, {})


    if sel_alg in every_algs_best_train.keys():
        best_train_of_alg = every_algs_best_train[sel_alg]
        log.debug('cur train info: %s' % (best_train_of_alg))
        cur_train_info[info_score_acc] = best_train_of_alg[info_score_acc]
        cur_train_info[info_score_acc_graph] = best_train_of_alg[info_score_acc_graph]
        cur_train_info[info_score_f1] = best_train_of_alg[info_score_f1]
        cur_train_info[info_score_auc] = best_train_of_alg[info_score_auc]
        cur_train_info[info_socre_auc_graph] = best_train_of_alg[info_socre_auc_graph]
        cur_train_info[info_params] = best_train_of_alg[info_params].copy()
        # cur_train_info[info_params_gs] = best_train_of_alg[info_params_gs].copy()


def get_best_train_info():
    global best_train_info
    log.debug('start')
    return best_train_info


def get_current_train_info():
    global cur_train_info
    log.debug('start')
    return cur_train_info


def get_model_info(algname):
    modelinfo = None
    if algname in every_algs_best_train.keys():
        modelinfo = every_algs_best_train[algname]
    return modelinfo


def update_score(score_name, score):
    global cur_train_info
    log.debug('start')
    cur_train_info[score_name] = score


def save_train_info():
    global sel_alg, cur_train_info, every_algs_best_train, best_train_info, old_best_train_info
    log.debug('start - current train info(%s):%s' % (sel_alg, cur_train_info))

    # check best score of the selected algorithm
    if sel_alg in every_algs_best_train.keys():
        best_train_of_cur_alg = every_algs_best_train[sel_alg]
        if cur_train_info[info_score_metric] > best_train_of_cur_alg[info_score_metric]:
            every_algs_best_train[sel_alg] = cur_train_info
    else:
        every_algs_best_train[sel_alg] = cur_train_info

    # check best score of all algorithms
    if best_train_info is None or \
        cur_train_info[info_score_metric] > best_train_info[info_score_metric]:
        old_best_train_info = best_train_info
        best_train_info = cur_train_info
        log.debug('new best train: %s' % best_train_info)

    save_train_info_file()

def is_param_float_type(param):
    if param_types[param] is float:
        return True
    else:
        return False


def is_param_int_type(param):
    if param_types[param] is int:
        return True
    else:
        return False


def get_feature_selection_methods():
    return dimem_reduction_methods[hyper_feature_selection]


def get_feature_extraction_methods():
    return dimem_reduction_methods[hyper_feature_extraction]


def set_dimen_reduct_method(method):
    global dimen_reduct_method
    log.debug('start - %s' % method)
    dimen_reduct_method = method


def get_dimem_reduct_method():
    return dimen_reduct_method


def reset_dimen_reduction():
    global reduced_features
    reduced_features = None


def set_majority_vote_estimators(estimators):
    global majority_vote_estimators
    majority_vote_estimators = estimators
    log.debug('majority vote esitmators:%s' % majority_vote_estimators)


def get_majority_vote_estimators():
    return majority_vote_estimators


def get_short_name(algname):
    return alg_short_names[algname]


def get_grid_search_fold():
    return grid_search_fold


def save_train_info_file():
    try:
        f = open(train_info_file, 'wb')
        save = {
            'every_model': every_algs_best_train
        }
        pickle.dump(save, f, pickle.HIGHEST_PROTOCOL)
        f.close()
    except Exception as e:
        log.debug('Unable to save data to', train_info_file, ':', e)

def load_train_info_file():
    global every_algs_best_train
    try:
        f = open(train_info_file, 'rb')
        save = pickle.load(f)
        every_algs_best_train = save['every_model']
        f.close()
    except Exception as e:
        log.debug('Unable to load data to', train_info_file, ':', e)

# hj-comment: to find ratio param of train_test_split