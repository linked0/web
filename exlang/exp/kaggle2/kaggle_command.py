import preprocess_data.preprocess as prep

dataset = None
labels = None

def get_titanic_data():
    global dataset, labels
    prep.preprocess_data(force_process=True)
    dataset, labels = prep.data_store.get_original_data()
    return dataset, labels