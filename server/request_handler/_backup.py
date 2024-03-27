
def train():
    DS_SIZE = 1
    trainer = Trainer()
    trainer.load_datasets('./learning_handler/datasets/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)', './learning_handler/datasets', DS_SIZE)
    trainer.preprocess_dataset()
    # trainer.preview_image()
    trainer.build_model()
    trainer.train_model()
    trainer.test_model()
    # model_name = str(uuid.uuid4())
    model_name = 'model'
    trainer.save_model(f'./learning_handler/models/{model_name}')
    return 1

def predict():
    predictor = Predictor('model')
    img = load_img('./learning_handler/datasets/test/test/AppleCedarRust1.JPG')
    return predictor.predict(img)