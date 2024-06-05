import sys
import os
import logging as log
import common.strings as strs

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

fig = None
ax_learning_score = None
ax_validation = None
ax_auc = None

main_view = None
central_tab_widget = None
config_view = None
dimen_reduct_view = None
score_view = None

def set_figure(totalfig):
    global fig
    fig = totalfig


def set_learning_score_view(ax):
    global ax_learning_score
    ax_learning_score = ax


def set_validation_view(ax):
    global ax_validation
    ax_validation = ax


def set_dimen_reduct_view(ax):
    global dimen_reduct_view
    dimen_reduct_view = ax


def set_auc_view(ax):
    global ax_auc
    ax_auc = ax


def set_score_view(ax):
    global score_view
    score_view = ax


def invalidate_score_view():
    log.debug('start')
    score_view.invalidate()


