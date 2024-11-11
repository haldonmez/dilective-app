import pytest
import base64
from io import BytesIO
from PIL import Image
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_main_route(client):
    """Test the main route ("/") returns status code 200."""
    response = client.get("/")
    assert response.status_code == 200
    assert b"<title>" in response.data  # Look for HTML title tag instead


def test_upload_image_mnist(client):
    """Test the /upload-image route using the MNIST model."""
    # Create a dummy grayscale image (28x28) and encode it as base64
    image = Image.new("L", (28, 28), color=128)  # A gray square
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    base64_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
    data_url = f"data:image/png;base64,{base64_image}"

    # Send the image in JSON format to the endpoint
    response = client.post("/upload-image", json={
        "image": data_url,
        "model_type": "mnist",
        "class_name": "5"  # Expected class name for testing
    })
    
    # Parse JSON response
    response_json = response.get_json()

    # Check response status and content
    assert response.status_code == 200
    assert "probability" in response_json
    assert "prediction" in response_json
    assert isinstance(response_json["probability"], str)
    assert isinstance(response_json["prediction"], str)

def test_upload_image_emnist(client):
    """Test the /upload-image route using the EMNIST model."""
    # Create a dummy grayscale image (28x28) and encode it as base64
    image = Image.new("L", (28, 28), color=128)
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    base64_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
    data_url = f"data:image/png;base64,{base64_image}"

    # Send the image with the model type 'emnist' and expected class_name
    response = client.post("/upload-image", json={
        "image": data_url,
        "model_type": "emnist",
        "class_name": "a"  # Example expected class name
    })

    # Parse JSON response
    response_json = response.get_json()

    # Check response status and content
    assert response.status_code == 200
    assert "probability" in response_json
    assert "prediction" in response_json
    assert isinstance(response_json["probability"], str)
    assert isinstance(response_json["prediction"], str)

    # Ensure the predicted class is within the expected range of characters
    assert response_json["prediction"] in "abcdefghijklmnopqrstuvwxyzn/A"

def test_upload_image_invalid_model_type(client):
    """Test the /upload-image route with an invalid model type."""
    # Create a dummy image and encode it as base64
    image = Image.new("L", (28, 28), color=128)
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    base64_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
    data_url = f"data:image/png;base64,{base64_image}"

    # Send request with an invalid model type
    response = client.post("/upload-image", json={
        "image": data_url,
        "model_type": "invalid_model",
        "class_name": "a"
    })

    # Check for a 200 response (your app might return a different status for invalid model types)
    assert response.status_code == 200
    response_json = response.get_json()
    assert "probability" in response_json
    assert response_json["prediction"] == "Unknown"
