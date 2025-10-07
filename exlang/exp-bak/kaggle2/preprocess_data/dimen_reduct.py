import os
import sys
import logging as log
import ml_algs.model_data as mdata
import common.strings as strs


log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)

def process_dimen_reduct():
    return