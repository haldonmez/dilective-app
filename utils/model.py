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

#=====================================================================================

class LetterRecognizerModel4(nn.Module):
    def __init__(self, input_size, output_size):
        super(LetterRecognizerModel4, self).__init__()
        
        self.conv_layers = nn.Sequential(
            nn.Conv2d(input_size, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.MaxPool2d(2, 2),
            nn.Dropout(0.55),
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(2, 2),
            nn.Dropout(0.55),
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.MaxPool2d(2, 2),
            nn.Dropout(0.55)
        )
        
        self.fc_layers = nn.Sequential(
            nn.Linear(128*3*3, 512),
            #nn.BatchNorm4d(512),
            nn.Dropout(0.25),
            
            nn.Linear(512, 256),
            #nn.BatchNorm4d(256),
            nn.Dropout(0.55),
            
            nn.Linear(256, output_size)
        )
        
    def forward(self, x):
        x = self.conv_layers(x)
        x = x.view(x.size(0), -1)  # Flatten the output
        x = self.fc_layers(x)
        return x

digit_model = DigitRecognizerMNISTV3(input_shape=1, hidden_units=10, output_shape=10)
letter_model = LetterRecognizerModel4(input_size=1, output_size=27)

# Load the models once when your application starts
digit_model.load_state_dict(torch.load("models\\digit_model.pth"))
letter_model.load_state_dict(torch.load("models\\letter_model_1.pth"))


def model_loading(tensor):
    import torch
    # Set the model to evaluation mode
    digit_model.eval()

    output = digit_model(tensor)

    _, predicted_class = torch.max(output, 1)
    probabilities = F.softmax(output, dim=1)
    predicted_class_probability = probabilities[0, predicted_class.item()].item()

    percentage = "{:.6f}".format(predicted_class_probability * 100)

    return percentage, predicted_class.item()



def model_loading_emnist(tensor):
    import torch
    # Set the model to evaluation mode
    letter_model.eval()

    output = output = letter_model(tensor)

    _, predicted_class = torch.max(output, 1)
    probabilities = F.softmax(output, dim=1)
    predicted_class_probability = probabilities[0, predicted_class.item()].item()

    percentage = "{:.6f}".format(predicted_class_probability * 100)

    return percentage, predicted_class.item()