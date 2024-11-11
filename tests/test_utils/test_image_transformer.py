import unittest
import torch
from PIL import Image
from utils.image_transformer import image_transform

class TestImageTransform(unittest.TestCase):

    def setUp(self):
        """
        Sets up a sample grayscale image for testing.
        """
        # Create a 100x100 pixel grayscale image (L mode)
        self.image = Image.new("L", (100, 100), color=128)  # Grayscale image with medium gray

    def test_image_transform_output_shape(self):
        """
        Test that the output tensor has the shape (1, 1, 28, 28).
        """
        result = image_transform(self.image)
        self.assertEqual(result.shape, (1, 1, 28, 28))

    def test_image_transform_output_type(self):
        """
        Test that the output is a torch.Tensor.
        """
        result = image_transform(self.image)
        self.assertIsInstance(result, torch.Tensor)

    def test_image_transform_pixel_range(self):
        """
        Test that the output tensor's pixel values are in the range [0, 1].
        """
        result = image_transform(self.image)
        
        # Check min and max values in the tensor
        min_pixel_value = result.min().item()
        max_pixel_value = result.max().item()
        
        self.assertGreaterEqual(min_pixel_value, 0.0)
        self.assertLessEqual(max_pixel_value, 1.0)

# Run the tests
if __name__ == "__main__":
    unittest.main()
