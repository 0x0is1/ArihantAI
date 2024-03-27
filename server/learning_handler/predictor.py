import tensorflow as tf
import numpy as np
import json
from tensorflow.keras.models import load_model

class Predictor:
    def __init__(self, model_name):
        self.model = load_model(f'./learning_handler/models/{model_name}.keras')

        with open(f'./learning_handler/models/{model_name}.json', 'r') as f:
            self.class_names = json.load(f)['class_names']

    def predict(self, img):
        img_resized = tf.image.resize(img, (128, 128))
        img_array = tf.expand_dims(img_resized, 0)
        predictions = self.model.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        predicted_class = tf.argmax(score).numpy()
        confidence = 100 * np.max(score)
        return self.class_names[predicted_class], confidence

# import os
# from tensorflow.keras.utils import load_img

# predictor = Predictor("Arihant.v1")
# test_dir = "datasets/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/test/"
# score = 0
# total = 0
# for i in os.listdir(test_dir):
#     for j in os.listdir(test_dir+i):
#         img = load_img(test_dir+i+"/"+j)
#         if i==predictor.predict(img)[0]: score+=1
#         total += 1
# print(score/total)