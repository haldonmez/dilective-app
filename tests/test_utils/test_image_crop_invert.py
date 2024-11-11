import unittest
import os
from PIL import Image
from utils.image_crop_invert import crop_transparency

class TestCropTransparency(unittest.TestCase):

    def setUp(self):
        # Create a 100x100 pixel image with a transparent background and a red square in the center
        self.image = Image.new("RGBA", (100, 100), (0, 0, 0, 0))
        for x in range(25, 75):
            for y in range(25, 75):
                self.image.putpixel((x, y), (255, 0, 0, 255))  # Red square with full opacity

    def test_crop_transparency_output_mode(self):
        """
        Test that the output image is in RGB mode after adding a white background and inverting colors.
        """
        result = crop_transparency(self.image)
        self.assertEqual(result.mode, "RGB")

    def test_crop_transparency_bounding_box(self):
        """
        Test that the function crops transparent areas, retaining only the bounding box of non-transparent content.
        """
        result = crop_transparency(self.image)
        cropped_bbox = result.getbbox()

        # Bounding box should not be None, as we have non-transparent content
        self.assertIsNotNone(cropped_bbox, "Bounding box should not be None for non-transparent content.")

# Run the tests
if __name__ == "__main__":
    unittest.main()
