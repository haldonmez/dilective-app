import torch
import torch.nn.functional as F
from models.digit_recognizer import DigitRecognizerMNISTV3
from models.load_model import load_model

# Initialize and load model once
digit_model = DigitRecognizerMNISTV3(input_shape=1, hidden_units=10, output_shape=10)
digit_model = load_model(digit_model, "models/digit_model.pth")

def predict_digit(tensor: torch.Tensor) -> tuple:
    """
    Predict the digit in a given tensor using the digit recognition model.

    Args:
        tensor (torch.Tensor): Input tensor to be classified.

    Returns:
        tuple: (str, int) where the first element is the probability as a percentage
               and the second element is the predicted class.
    """
    with torch.no_grad():
        output = digit_model(tensor)
        probabilities = F.softmax(output, dim=1)
        _, predicted_class = torch.max(output, 1)
        predicted_class_probability = probabilities[0, predicted_class.item()].item()
        percentage = f"{predicted_class_probability * 100:.6f}"
    return percentage, predicted_class.item()