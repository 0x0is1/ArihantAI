import json
import matplotlib.pyplot as plt
from tensorflow.keras import layers, Sequential, preprocessing, optimizers
from tensorflow.keras.layers import experimental, Conv2D, Dropout, MaxPooling2D, Flatten, Dense, Rescaling, RandomZoom, RandomFlip
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Input, Flatten, Dense, Dropout
from tensorflow.keras.models import Model

class Trainer:
    def __init__(self, model_type):
        self.IMAGE_SIZE = 128
        self.BATCH_SIZE = 42
        self.CHANNELS = 3
        self.MODEL_TYPE = model_type
        self.class_names = None
        self.model = None

    def load_datasets(self, train_dataset_directory, test_dataset_directory, ds_size=None):
        train_ds = preprocessing.image_dataset_from_directory(
            f'{train_dataset_directory}/train',
            shuffle=True,
            seed=42,
            color_mode='rgb',
            image_size=(self.IMAGE_SIZE, self.IMAGE_SIZE),
            batch_size=self.BATCH_SIZE,
            validation_split=None,
            subset=None,
        )

        validation_ds = preprocessing.image_dataset_from_directory(
            f'{train_dataset_directory}/valid',
            image_size=(self.IMAGE_SIZE, self.IMAGE_SIZE),
            seed=42,
            shuffle=True,
            batch_size=self.BATCH_SIZE,
            validation_split=None,
            subset=None,
        )

        test_ds = preprocessing.image_dataset_from_directory(
            f'{test_dataset_directory}/test',
            image_size=(self.IMAGE_SIZE, self.IMAGE_SIZE),
            seed=42,
            shuffle=True,
            validation_split=None,
            subset=None,
        )

        self.class_names = train_ds.class_names
        if ds_size is not None:
            self.train_ds = train_ds.take(ds_size)
            self.validation_ds = validation_ds.take(ds_size)
            self.test_ds = test_ds.take(ds_size)
        else:
            self.train_ds = train_ds
            self.validation_ds = validation_ds
            self.test_ds = test_ds
        
    def preview_image(self):
        for image_batch, label_batch in self.train_ds.take(1):
            img = image_batch[0].numpy().astype("uint8")
            plt.title(self.class_names[label_batch[0]])
            plt.imshow(img)
            plt.show()

    def preprocess_dataset(self):
        data_augmentation = Sequential([
            RandomFlip("horizontal", input_shape=(self.IMAGE_SIZE, self.IMAGE_SIZE, 3)),
            RandomZoom(0.2),
            Rescaling(1. / 255),
            RandomZoom(0.1),
        ])

        self.resize_and_rescale = Sequential([
            experimental.preprocessing.Resizing(self.IMAGE_SIZE, self.IMAGE_SIZE),
            experimental.preprocessing.Rescaling(1.0 / 255)
        ])
        self.data_augmentation = data_augmentation

    def _build_custom_CNN(self):
        try:
            model = Sequential()

            model.add(Conv2D(32,(3,3),activation="relu",padding="same",input_shape=(128,128,3)))
            model.add(Conv2D(32,(3,3),activation="relu",padding="same"))
            model.add(MaxPooling2D(3,3))

            model.add(Conv2D(64,(3,3),activation="relu",padding="same"))
            model.add(Conv2D(64,(3,3),activation="relu",padding="same"))
            model.add(MaxPooling2D(3,3))

            model.add(Conv2D(128,(3,3),activation="relu",padding="same"))
            model.add(Conv2D(128,(3,3),activation="relu",padding="same"))
            model.add(MaxPooling2D(3,3))

            model.add(Conv2D(256,(3,3),activation="relu",padding="same"))
            model.add(Conv2D(256,(3,3),activation="relu",padding="same"))

            model.add(Conv2D(512,(5,5),activation="relu",padding="same"))
            model.add(Conv2D(512,(5,5),activation="relu",padding="same"))

            model.add(Flatten())

            model.add(Dense(1568,activation="relu"))
            model.add(Dropout(0.5))

            model.add(Dense(38,activation="softmax"))

            opt = optimizers.Adam(learning_rate=0.0001)
            model.compile(optimizer=opt,loss="sparse_categorical_crossentropy",metrics=['accuracy'])
            model.summary()
            self.model = model
            return True
        
        except Exception as e:
            self.model = None
            print(e)
            return False

    def _build_RESNet50(self):
        try:
            base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(self.IMAGE_SIZE, self.IMAGE_SIZE, self.CHANNELS))
            for layer in base_model.layers:
                layer.trainable = False

            x = Flatten()(base_model.output)
            x = Dense(1024, activation='relu')(x)
            x = Dropout(0.5)(x)
            output = Dense(len(self.class_names), activation='softmax')(x)

            model = Model(inputs=base_model.input, outputs=output)
            opt = optimizers.Adam(learning_rate=0.0001)
            model.compile(optimizer=opt, loss='sparse_categorical_crossentropy', metrics=['accuracy'])
            model.summary()

            self.model = model
            return True
        except Exception as e:
            self.model = None
            print(e)
            return False

    def build_model(self):
        if self.MODEL_TYPE == 0:
            return self._build_custom_CNN()
        return self._build_RESNet50()

    def train_model(self):
        try:
            self.model.fit(self.train_ds, validation_data=self.validation_ds, epochs=2)
            self.trained = True
            return True
        except Exception as e:
            self.trained = False
            print(e)
            return False

    def test_model(self):
        if self.trained and self.model is not None:
            evaluation_result = self.model.evaluate(self.validation_ds)
            return evaluation_result
        else:
            return (-1, -1)
    
    def save_model(self, model_name):
        with open(f'{model_name}.json', 'w') as f:
            json.dump({"class_names" : self.class_names}, f)
        self.model.save(f'{model_name}.keras')