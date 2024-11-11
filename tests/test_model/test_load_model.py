import unittest
import torch
import os
from models.digit_recognizer import DigitRecognizerMNISTV3
from models.load_model import load_model

class TestLoadModel(unittest.TestCase):
    
    def setUp(self):
        """
        Sets up a temporary model and saves it to a temporary file.
        """
        self.model = DigitRecognizerMNISTV3(input_shape=1, hidden_units=10, output_shape=10)
        self.temp_model_path = "temp_model.pth"
        torch.save(self.model.state_dict(), self.temp_model_path)

    def tearDown(self):
        """
        Clean up the temporary model file after the test.
        """
        if os.path.exists(self.temp_model_path):
            os.remove(self.temp_model_path)

    def test_load_model_success(self):
        """
        Test that the load_model function correctly loads weights into the model.
        """
        loaded_model = DigitRecognizerMNISTV3(input_shape=1, hidden_units=10, output_shape=10)
        load_model(loaded_model, self.temp_model_path)
        
        # Verify that the weights match
        for original_param, loaded_param in zip(self.model.parameters(), loaded_model.parameters()):
            self.assertTrue(torch.equal(original_param, loaded_param))

    def test_load_model_invalid_path(self):
        """
        Test that load_model gracefully handles an invalid file path.
        """
        invalid_path = "non_existent_model.pth"
        
        # Use assertLogs to capture error log output
        with self.assertLogs('models.load_model', level='ERROR') as log:
            result_model = load_model(self.model, invalid_path)
            # Check that the expected log message is in the captured logs
            self.assertIn("Error loading model from", log.output[0])

# Run the tests
if __name__ == "__main__":
    unittest.main()