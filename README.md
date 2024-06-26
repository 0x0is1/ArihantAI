# Arihant AI

## Description

Fullstack app for Crop disease detection and solution suggestion AI. This app is made during CIC Build-A-Thon Hackathon.

## Preview

https://github.com/0x0is1/ArihantAI/assets/42772562/d97b4595-5c9f-4f57-bdf9-d8a71e70baae

## Paper

Paper explaining the approach is added [here](./paper/paper.pdf)

### Selected Problem Statement

AGRICULTURE, FOODTECH & RURAL DEVELOPMENT :
Developing solutions, keeping in mind the need to enhance the primary sector of India - Agriculture and to manage and process our agriculture produce.

### Solution

* __AI Model Integrated App__: An android app in local languages powered by continous Artificial Intelligence and Machine Learning system to provide Real-Time precise crop diseases

* __24 Hours Auto Refresh__: Self-Training Model attached on the server to auto-refresh and retrain datasets every 24 hours

* __Cure Suggestion Integration__: App does also provide solutions for disease using integrated API

### Model details

* Dataset used : [New Plant Disease Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset)

* Trained on more than 70000 files of 30 classes

* Tested and validated on 30000 files of 8 classes

#### 1. ResNet50
![ResNet](https://miro.medium.com/v2/resize:fit:1400/0*tH9evuOFqk8F41FG.png)
* 7-layerd convulational neural network (CNN)

* Average accuracy achieved of 95.48%

* Maximum confidence achieved is 9

* Minimum loss achieved 0.14

* Optimized model size is 273MB

#### 2. Custom CNN

* 7-layerd convulational neural network (CNN)

* Maximum accuracy achieved of 89% (approximate)

* Maximum confidence achieved is 6

* Minimum loss achieved 0.56

* Optimized model size is 300MB (approx)


#### Model architecture (7-Layer Custom CNN)

<img src="./screenshots/f1.png" height="60%" width="60%">

<img src="./screenshots/f2.png" height="60%" width="60%">

<img src="./screenshots/f3.png" height="60%" width="60%">


## Technologies used

### For Android app

* React
* React native
* React Navigation
* React Native Reanimated
* rneui
* expo

### For server

* Flask (would be later replaced by gunicorn)
* Tensorflow
* Numpy
* Matplotlib
* Werkzeug

### For deployment
* Docker

## How to run?

### Self train and host

* Local machine method (stable)

    <img src="./screenshots/sss1.png" />

    * in console 1

    ```sh
    git clone https://github.com/0x0is1/ArihantAI
    cd ArihantAI
    cd server
    python app.py
    ```

    * in console 2

    <img src="./screenshots/sss2.png" />

    ```sh
        cd ArihantAI
        cd client
        npm start
    ```

    * __Remember to put your self hosted server's address in the below in home page__

    * Now you are ready to use the app.
    * Scan the QR code displayed on the console with Expo Go app in your phone

* Docker method

    * in console 1

    <img src="./screenshots/sss1.png" />

    ```sh
    git clone https://github.com/0x0is1/ArihantAI
    cd ArihantAI
    docker build -t arihant .
    docker run -d -p 5000:5000 arihant:latest
    ```

    * in console 2

    <img src="./screenshots/sss2.png" />

    ```sh
        cd ArihantAI
        cd client
        npm start
    ```

    * __Remember to put your self hosted server's address in the below in home page__

    * Now you are ready to use the app.
    * Scan the QR code displayed on the console with Expo Go app in your phone

## Model Configuration
You can configure model type (Our custom CNN (code 0) or ResNet(code 1)) with environment variable on server or Dockerfile.

If you are running on local machine, you can directly edit **(./server/request_handler/server.py)** file to change the configuration.

## Download Built Apk (Stable)

[Here](https://expo.dev/artifacts/eas/vu3ujbP4FVumyxphuXuqjH.apk) is built apk file for use. You may download it, start your server, put your server address in the app and restart the app.

## Preview

<img src="./screenshots/ss1.jpg" height="50%" width="50%" alt="ss1" />

<img src="./screenshots/ss2.jpg" height="50%" width="50%" alt="ss2" />

<img src="./screenshots/ss3.jpg" height="50%" width="50%" alt="ss3" />
