import unittest
import torch
from predict.predict_letter import predict_letter
from models.letter_recognizer import LetterRecognizerModel4
from models.load_model import load_model

class TestPredictLetter(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """
        Sets up the model and loads weights once for all tests.
        """
        cls.model = LetterRecognizerModel4(input_size=1, output_size=27)
        cls.model = load_model(cls.model, "models/letter_model_1.pth")
    
    def setUp(self):
        """
        Sets up a sample input tensor for each test.
        """
        # Create a dummy input tensor of shape (batch_size, channels, height, width)
        self.input_tensor = torch.randn(1, 1, 28, 28)  # Batch of 1 grayscale image of size 28x28
    
    def test_predict_letter_output_format(self):
        """
        Test that predict_letter returns the correct output format (percentage as a string and integer class).
        """
        probability, predicted_class = predict_letter(self.input_tensor)
        
        # Check that probability is a string and predicted_class is an integer
        self.assertIsInstance(probability, str)
        self.assertIsInstance(predicted_class, int)
        
    def test_predict_letter_probability_range(self):
        """
        Test that the predicted probability is within the valid range (0 to 100).
        """
        probability, _ = predict_letter(self.input_tensor)
        
        # Convert probability to a float for range checking
        probability_value = float(probability)
        self.assertGreaterEqual(probability_value, 0)
        self.assertLessEqual(probability_value, 100)
        
    def test_predict_letter_output_consistency(self):
        """
        Test that predict_letter function consistently produces a result on valid input shape.
        """
        # Run the prediction twice and check for consistency
        probability_1, class_1 = predict_letter(self.input_tensor)
        probability_2, class_2 = predict_letter(self.input_tensor)
        
        # Ensure consistent outputs (small variations in probability due to dropout can be expected)
        self.assertEqual(class_1, class_2)
        self.assertAlmostEqual(float(probability_1), float(probability_2), places=2)

# Run the tests
if __name__ == "__main__":
    unittest.main()
