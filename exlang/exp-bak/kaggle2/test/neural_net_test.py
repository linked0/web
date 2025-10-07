import sys
import logging as log
import tensorflow as tf
import numpy as np
import common.strings as strs
import preprocess_data.preprocess as pk

log.basicConfig(format=strs.log_format,level=log.DEBUG,stream=sys.stderr)


def accuracy(predictions, labels):
    # log.debug("predictions: %s" % predictions)
    log.debug("predictions shape: %s, labels shape: %s" % (predictions.shape, labels.shape))
    sum1 = np.sum(np.argmax(predictions, 1) == np.argmax(labels, 1))
    log.debug("sum: %s" % sum1)
    return (100.0 * np.sum(np.argmax(predictions, 1) == np.argmax(labels, 1)) /
            predictions.shape[0])


def accuracy2(predictions, labels):
    # log.debug("predictions: %s" % predictions)
    log.debug("predictions shape: %s, labels shape: %s" % (predictions.shape, labels.shape))
    sum1 = np.sum(np.equal(predictions, labels), axis=0)
    log.debug("sum: %s" % sum1)
    return 100.0 * np.sum(np.equal(predictions, labels), axis=0) / predictions.shape[0]


def run():
    pk.preprocess_data()

    batch_size = pk.data_store.get_batch_size()
    num_features = pk.data_store.get_x_field_count()
    num_labels = pk.data_store.get_y_value_count()
    hidden_size = pk.data_store.get_hidden_size()
    num_steps = pk.data_store.get_step_size()
    log.debug('num_features: %d, num_labels: %d' % (num_features, num_labels))

    train_dataset = pk.data_store.get_X_train()
    train_labels = pk.data_store.get_y_train(one_hot_encoding=True)
    valid_dataset = pk.data_store.get_X_valid()
    valid_labels = pk.data_store.get_y_valid(one_hot_encoding=True)
    test_dataset = pk.data_store.get_X_test()
    test_labels = pk.data_store.get_y_test(one_hot_encoding=True)

    if num_labels == 1:
        train_labels = train_labels[:, None]
        valid_labels = valid_labels[:, None]
        test_labels = test_labels[:, None]
    log.debug('shape of train_labels:  %s' % (train_labels.shape, ))

    graph = tf.Graph()
    with graph.as_default():
        tf_train_dataset = tf.placeholder(tf.float32,
                                          shape=(batch_size, num_features))
        tf_train_labels = tf.placeholder(tf.float32, shape=(batch_size, num_labels))
        tf_valid_dataset = tf.constant(valid_dataset)
        tf_test_dataset = tf.constant(test_dataset)

        weights_l1 = tf.Variable(tf.truncated_normal([num_features, hidden_size]))
        biases_l1 = tf.Variable(tf.zeros([hidden_size]))
        logits_l1 = tf.matmul(tf_train_dataset, weights_l1) + biases_l1
        activation_l1 = tf.nn.relu(logits_l1)

        weights_l2 = tf.Variable(tf.truncated_normal([hidden_size, num_labels]))
        biases_l2 = tf.Variable(tf.zeros([num_labels]))
        logits_l2 = tf.matmul(activation_l1, weights_l2) + biases_l2

        loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits_l2, tf_train_labels))

        optimizer = tf.train.GradientDescentOptimizer(0.2).minimize(loss)

        # Predictions for the training, validation, and test data
        train_prediction = tf.nn.softmax(logits_l2)
        valid_layer1 = tf.matmul(valid_dataset, weights_l1) + biases_l1
        valid_prediction = tf.nn.softmax(tf.matmul(tf.nn.relu(valid_layer1), weights_l2) + biases_l2)
        test_layer1 = tf.matmul(test_dataset, weights_l1) + biases_l1
        test_prediction = tf.nn.softmax(tf.matmul(tf.nn.relu(test_layer1), weights_l2) + biases_l2)

    with tf.Session(graph=graph) as session:
        tf.initialize_all_variables().run()
        print('Initialized')
        for step in range(num_steps):
            offset = (step * batch_size) % (train_labels.shape[0] - batch_size)
            batch_data = train_dataset[offset:(offset + batch_size), :]
            batch_labels = train_labels[offset:(offset + batch_size), :]
            feed_dict = {tf_train_dataset: batch_data, tf_train_labels: batch_labels}
            _, l, predictions = session.run(
                [optimizer, loss, train_prediction], feed_dict=feed_dict)
            if (step % 200 == 0):
                print('Minibatch loss at step: %d: %f' % (step, l))
                print('Minibatch accuracy: %.1f%%' % accuracy(predictions, batch_labels))
                print('Validation accuracy: %.1f%%' % accuracy(valid_prediction.eval(), valid_labels))
        print('Test accuracy: %.1f%%' % accuracy(test_prediction.eval(), test_labels))