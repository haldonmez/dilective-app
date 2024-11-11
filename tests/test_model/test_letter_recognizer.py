import unittest
import torch
from models.letter_recognizer import LetterRecognizerModel4

class TestLetterRecognizerModel4(unittest.TestCase):

    def setUp(self):
        """
        Sets up the model and a sample input tensor.
        """
        self.input_size = 1       # Input channels (grayscale image)
        self.output_size = 27     # Number of output classes (for letters a-z)
        self.model = LetterRecognizerModel4(input_size=self.input_size, output_size=self.output_size)
        self.model.eval()         # Set the model to evaluation mode for testing

        # Create a dummy input tensor of shape (batch_size, channels, height, width)
        self.input_tensor = torch.randn(1, self.input_size, 28, 28)  # Batch of 1 grayscale image of size 28x28

    def test_model_initialization(self):
        """
        Test that the model initializes without errors.
        """
        self.assertIsInstance(self.model, LetterRecognizerModel4)

    def test_forward_pass(self):
        """
        Test the forward pass produces output of the expected shape.
        """
        with torch.no_grad():  # Disable gradient computation for testing
            output = self.model(self.input_tensor)

        # Check that the output is a tensor of shape (batch_size, output_size)
        self.assertEqual(output.shape, (1, self.output_size))

    def test_output_values(self):
        """
        Test that the model's output has reasonable values.
        """
        with torch.no_grad():
            output = self.model(self.input_tensor)

        # Check that the output tensor is of logits (not probabilities, no range restriction)
        self.assertTrue(torch.is_tensor(output))
        self.assertEqual(output.ndim, 2)
        self.assertEqual(output.shape[1], self.output_size)  # Ensuring output has 27 classes

# Run the tests
if __name__ == "__main__":
    unittest.main()