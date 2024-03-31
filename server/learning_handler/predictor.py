import tensorflow as tf
import numpy as np
import json
from tensorflow.keras.models import load_model

class Predictor:
    def __init__(self, model_name, model_type, test_mode=False):
        class_path = f'./learning_handler/models/{model_name}.T{model_type}.json'
        model_path = f'./learning_handler/models/{model_name}.T{model_type}.keras'
        
        if test_mode: 
            model_path = f'./models/{model_name}.T{model_type}.keras'
            class_path = f'./models/{model_name}.T{model_type}.json'
        
        self.model = load_model(model_path)

        with open(class_path, 'r') as f:
            self.class_names = json.load(f)['class_names']

    def predict(self, img):
        img_resized = tf.image.resize(img, (128, 128))
        img_array = tf.expand_dims(img_resized, 0)
        predictions = self.model.predict(img_array, verbose=0)
        score = tf.nn.softmax(predictions[0])
        predicted_class = tf.argmax(score).numpy()
        confidence = 100 * np.max(score)
        return self.class_names[predicted_class], confidence

# import os
# from tensorflow.keras.utils import load_img

# predictor = Predictor("Arihant.v1", 1, True)
# test_dir = "./datasets/test/"
# for i in os.listdir(test_dir):
#     for j in os.listdir(test_dir+i):
#         img = load_img(test_dir+i+"/"+j)
#         print(predictor.predict(img)[0], j)
