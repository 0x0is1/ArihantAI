import uuid
import threading
from tensorflow.keras.utils import load_img
from learning_handler.trainer import Trainer
from learning_handler.predictor import Predictor
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import json
import time
import base64

app = Flask(__name__)

@app.route('/', methods=['GET'])
def get_home():
    return "Server is running"

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

trainer = Trainer()
prediction_data = {}
MODEL_NAME = os.environ.get("MODEL_NAME") # 'Arihant.v1'
IS_MODEL_TRAINING = False
DS_SIZE = 10
incomplete_predictions = set()
train_lock = threading.Lock()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def run_predict(tracking_id, filename):
    incomplete_predictions.add(tracking_id)
    
    img = load_img(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    result = predictor.predict(img)
    
    prediction_data[tracking_id] = result
    
    incomplete_predictions.remove(tracking_id)

def train():
    global IS_MODEL_TRAINING
    with train_lock:
        trainer.load_datasets('./learning_handler/datasets/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)', './learning_handler/datasets', DS_SIZE)
        trainer.preprocess_dataset()
        if trainer.build_model() and trainer.train_model():
            loss_rate, accuracy = trainer.test_model()
            trainer.save_model(f'./learning_handler/models/{MODEL_NAME}')
            with open("model_details.json", "w") as f:
                details = {
                    "name": MODEL_NAME,
                    "loss_rate": loss_rate,
                    "accuracy": accuracy,
                    "last_modified": int(time.time())
                }
                json.dump(details, f)
            IS_MODEL_TRAINING = False
            return True
        return False

predictor = None

while predictor == None:
    try:
        predictor = Predictor(MODEL_NAME)
    except OSError:
        train()
        continue


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        tracking_id = str(uuid.uuid4())
        threading.Thread(target=run_predict, args=(tracking_id, filename)).start()
        return jsonify({'message': 'File uploaded successfully', 'filename': filename, 'tracking_id': tracking_id}), 201
    else:
        return jsonify({'error': 'Invalid file format'}), 400

@app.route('/prediction_status/<string:tracking_id>', methods=['GET'])
def get_prediction_status(tracking_id):
    if tracking_id in prediction_data:
        return jsonify({'tracking_id': tracking_id, 'status': 'completed', 'result': prediction_data[tracking_id]})
    elif tracking_id in incomplete_predictions:
        return jsonify({'tracking_id': tracking_id, 'status': 'incomplete', 'message': 'Prediction is still in progress'}), 200
    else:
        return jsonify({'status':-1, 'error': 'Prediction data not found for the tracking ID'}), 404

@app.route('/disease/<string:disease_code>', methods=['GET'])
def get_disease_detail(disease_code):
    disease_code = base64.b64decode(disease_code).decode("utf-8")
    with open("./request_handler/db/diseasedb.json", "r") as f:
        data = json.load(f)
        try:
            data = data[disease_code]
            data["status"] = 1
            return jsonify(data), 200
        except Exception as e:
            return jsonify({'status':-1, 'error': 'Details not found'}), 404

@app.route('/model_detail', methods=['GET'])
def get_model_detail():
    global IS_MODEL_TRAINING
    FULL_DAY_TIMESTAMP = 86400
    try:
        with open("model_details.json", "r") as f:
            model_details = json.load(f)
            if int(time.time()) - model_details["last_modified"] > FULL_DAY_TIMESTAMP:
                if IS_MODEL_TRAINING == False:
                    IS_MODEL_TRAINING = True
                    threading.Thread(target=train).start()
            model_details["status"] = 1
            model_details["message"] = "Working on it"
            return jsonify(model_details)
    except Exception as e:
        if IS_MODEL_TRAINING == False:
            IS_MODEL_TRAINING = True
            threading.Thread(target=train).start()
            return jsonify({
                "status": -1,
                "message": "No model found. Creating new model"
            })
        return jsonify({
                "status": -1,
                "message": "No model found. A model is training right now"
            })