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

DigitRecognizerMNISTV3 = DigitRecognizerMNISTV3 

LetterRecognizerModel4 = LetterRecognizerModel4

app = Flask(__name__)

@app.route("/", methods=["GET"])
def hello_world():
    return render_template("index.html")

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
    print(f"Model type: {model_type}")  # print the model type
    
    if model_type == 'mnist':
        model = model_loading(image_predict)  # load the MNIST model
    else:
        model = model_loading_emnist(image_predict)  # load the EMNIST model

    probability, prediction = str(model[0]), str(model[1])
    return jsonify({"probability": probability, "prediction": prediction}), 200


if __name__ == "__main__":
    app.run(port=4000, debug=True)
