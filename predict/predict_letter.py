import torch
import torch.nn.functional as F
from models.letter_recognizer import LetterRecognizerModel4
from models.load_model import load_model

# Initialize and load model once
letter_model = LetterRecognizerModel4(input_size=1, output_size=27)
letter_model = load_model(letter_model, "models/letter_model_1.pth")

def predict_letter(tensor: torch.Tensor) -> tuple:
    """
    Predict the letter in a given tensor using the letter recognition model.

    Args:
        tensor (torch.Tensor): Input tensor to be classified.

    Returns:
        tuple: (str, int) where the first element is the probability as a percentage
               and the second element is the predicted class.
    """
    with torch.no_grad():
        output = letter_model(tensor)
        probabilities = F.softmax(output, dim=1)
        _, predicted_class = torch.max(output, 1)
        predicted_class_probability = probabilities[0, predicted_class.item()].item()
        percentage = f"{predicted_class_probability * 100:.6f}"
    return percentage, predicted_class.item()