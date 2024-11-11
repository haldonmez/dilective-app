import unittest
import torch
from models.digit_recognizer import DigitRecognizerMNISTV3

class TestDigitRecognizerMNISTV3(unittest.TestCase):

    def setUp(self):
        """
        Sets up the model and a sample input tensor.
        """
        self.model = DigitRecognizerMNISTV3(input_shape=1, hidden_units=10, output_shape=10)
        self.model.eval()  # Set the model to evaluation mode for testing

        # Create a dummy input tensor of shape (batch_size, channels, height, width)
        self.input_tensor = torch.randn(1, 1, 28, 28)  # Example: 1 grayscale image of size 28x28

    def test_model_initialization(self):
        """
        Test that the model initializes without errors.
        """
        self.assertIsInstance(self.model, DigitRecognizerMNISTV3)

    def test_forward_pass(self):
        """
        Test the forward pass produces output of the expected shape.
        """
        with torch.no_grad():  # Disable gradient computation for testing
            output = self.model(self.input_tensor)

        # Check that the output is a tensor of shape (batch_size, output_shape)
        self.assertEqual(output.shape, (1, 10))

    def test_output_values(self):
        """
        Test that the model's output has reasonable values.
        """
        with torch.no_grad():
            output = self.model(self.input_tensor)

        # Check that output is a tensor of logits (not probabilities, so no range restriction)
        self.assertTrue(torch.is_tensor(output))
        self.assertEqual(output.ndim, 2)
        self.assertEqual(output.shape[1], 10)  # Ensuring output has 10 classes

# Run the tests
if __name__ == "__main__":
    unittest.main()
