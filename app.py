from flask import Flask, render_template, request, jsonify
import base64
from PIL import Image
from io import BytesIO
from image_crop_invert import crop_transparency
from model import DigitRecognizerMNISTV3
from model import LetterRecognizerModel4
from model import model_loading_emnist
from model import model_loading
from image_transformer import image_transform
from mysql_store import InsertBlob

DigitRecognizerMNISTV3 = DigitRecognizerMNISTV3 

LetterRecognizerModel4 = LetterRecognizerModel4

mapping = {
    0: 'n/A',
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f',
    7: 'g',
    8: 'h',
    9: 'i',
    10: 'j',
    11: 'k',
    12: 'l',
    13: 'm',
    14: 'n',
    15: 'o',
    16: 'p',
    17: 'q',
    18: 'r',
    19: 's',
    20: 't',
    21: 'u',
    22: 'v',
    23: 'w',
    24: 'x',
    25: 'y',
    26: 'z'
}

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("home.html")

@app.route("/index.html", methods=["GET"])
def racing_page():
    return render_template("index.html")

@app.route("/learn.html", methods=["GET"])
def learning_page():
    return render_template("learn.html")

@app.route("/listen.html", methods=["GET"])
def listening_page():
    return render_template("listen.html")

@app.route("/upload-image", methods=["POST"])
def upload_image():
    data = request.get_json()
    data_url = data['image']
    base64_image = data_url.split(',')[1]
    image_data = base64.b64decode(base64_image)
    image = Image.open(BytesIO(image_data))
    image_ready = crop_transparency(image)
    image_predict = image_transform(image_ready)
    
    model_type = data.get('model_type', 'emnist')  # get the model type from the request data

    class_name = data.get('class_name')

    if model_type == 'mnist':
        model = model_loading(image_predict)  # load the MNIST model
        probability, prediction = str(model[0]), str(model[1])
    elif model_type == "emnist":
        model = model_loading_emnist(image_predict)  # load the EMNIST model
        probability, prediction = str(model[0]), mapping.get(model[1], 'Unknown')  # map the prediction to a letter

    if class_name == prediction:
        InsertBlob(prediction, image_data)
        print(f"The image has been saved to the database with {prediction}")
    else:
        print("The image data has not been saved to the database because class doesn't match with the value.")

    return jsonify({"probability": probability, "prediction": prediction}), 200

if __name__ == "__main__":
    app.run(port=4000, debug=True)
