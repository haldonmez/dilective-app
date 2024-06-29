from PIL import Image
from torchvision.transforms import ToTensor, Resize, Grayscale, Compose

def image_transform(image):

    prediction_image = image

    transforms = Compose([
    Resize((28, 28)),
    ToTensor(),
    ])

    transformed_prediction_image = transforms(prediction_image)

    transformed_shaped_prediction_image = transformed_prediction_image[0].unsqueeze(0)

    last_prediction = transformed_shaped_prediction_image.unsqueeze(0).float()

    return last_prediction