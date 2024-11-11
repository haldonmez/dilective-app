import torch
from torch import nn
import torch.nn.functional as F


class DigitRecognizerMNISTV3(nn.Module):
    """
    Convolutional neural network model for digit recognition, inspired by TinyVGG architecture.
    
    Args:
        input_shape (int): Number of input channels.
        hidden_units (int): Number of channels in the convolutional layers.
        output_shape (int): Number of output classes.
    """
    def __init__(self, input_shape: int, hidden_units: int, output_shape: int):
        super(DigitRecognizerMNISTV3, self).__init__()
        self.block_1 = nn.Sequential(
            nn.Conv2d(input_shape, hidden_units, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(hidden_units, hidden_units, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        self.block_2 = nn.Sequential(
            nn.Conv2d(hidden_units, hidden_units, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(hidden_units, hidden_units, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(hidden_units * 7 * 7, output_shape)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.block_1(x)
        x = self.block_2(x)
        x = self.classifier(x)
        return x