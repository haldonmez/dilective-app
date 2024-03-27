import torch
from torch import nn
import torch
import torch.nn.functional as F



# Create a convolutional neural network
class DigitRecognizerMNISTV3(nn.Module):
    """
    Model architecture copying TinyVGG from:
    https://poloclub.github.io/cnn-explainer/
    """
    def __init__(self, input_shape: int, hidden_units: int, output_shape: int):
        super().__init__()
        self.block_1 = nn.Sequential(
            nn.Conv2d(in_channels=input_shape,
                      out_channels=hidden_units,
                      kernel_size=3, # how big is the square that's going over the image?
                      stride=1, # default
                      padding=1),# options = "valid" (no padding) or "same" (output has same shape as input) or int for specific number
            nn.ReLU(),
            nn.Conv2d(in_channels=hidden_units,
                      out_channels=hidden_units,
                      kernel_size=3,
                      stride=1,
                      padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2,
                         stride=2) # default stride value is same as kernel_size
        )
        self.block_2 = nn.Sequential(
            nn.Conv2d(hidden_units, hidden_units, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(hidden_units, hidden_units, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            # Where did this in_features shape come from?
            # It's because each layer of our network compresses and changes the shape of our inputs data.
            nn.Linear(in_features=hidden_units*7*7,
                      out_features=output_shape)
        )
    def forward(self, x: torch.Tensor):
        x = self.block_1(x)
        # print(x.shape)
        x = self.block_2(x)
        # print(x.shape)
        x = self.classifier(x)
        # print(x.shape)
        return x

def model_loading(tensor):
    import torch

        # Create a new instance of FashionMNISTModelV3 (the same class as our saved state_dict())
    # Note: loading model will error if the shapes here aren't the same as the saved version
    MODEL_SAVE_PATH = "models/03_pytorch_computer_vision_model_3.pth"
    loaded_model_3 = DigitRecognizerMNISTV3(input_shape=1,
                                        hidden_units=10, # try changing this to 128 and seeing what happens
                                        output_shape=10)

    # Load in the saved state_dict()
    loaded_model_3.load_state_dict(torch.load(f=MODEL_SAVE_PATH))

    # Send model to GPU
    loaded_model_3 = loaded_model_3.to("cpu")

    output = loaded_model_3(tensor)

    _, predicted_class = torch.max(output, 1)
    probabilities = F.softmax(output, dim=1)
    predicted_class_probability = probabilities[0, predicted_class.item()].item()

    percentage = "{:.6f}".format(predicted_class_probability * 100)

    return percentage, predicted_class.item()

