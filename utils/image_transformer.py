from PIL import Image
from torchvision.transforms import ToTensor, Resize, Compose

def image_transform(image):
    """
    Prepares an image for a machine learning model by:
    1. Resizing it to 28x28 pixels.
    2. Converting it to a tensor format.
    3. Reshaping the tensor for model compatibility in batch processing.

    Args:
        image (PIL.Image.Image): Input image to be transformed.

    Returns:
        torch.Tensor: A tensor of shape (1, 1, 28, 28) representing a single 
                      grayscale image with a batch and channel dimension.
    """

    # Define the image transformations
    transforms = Compose([
    Resize((28, 28)), # Resize to 28x28 pixels
    ToTensor(),       # Convert to tensor and normalize pixel values
    ])

    # Apply transformations
    transformed_image = transforms(image)
    
    # Add batch and channel dimensions for compatibility with PyTorch models
    transformed_shaped_image = transformed_image[0].unsqueeze(0).unsqueeze(0).float()

    return transformed_shaped_image