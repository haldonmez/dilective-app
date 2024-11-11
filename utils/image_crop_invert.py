from PIL import Image, ImageOps


def crop_transparency(image):
    """
    Crop the transparent areas of an RGBA image, center the cropped content in a square 
    canvas with a white background, invert the colors, and save the final processed image.

    This function:
    1. Converts the input image to RGBA if it isn’t already.
    2. Removes pixels with high red channel values (assumed as part of the transparency process).
    3. Crops the transparent areas, preserving only the non-transparent bounding box of content.
    4. Centers the cropped image in a square canvas larger than the content area.
    5. Pastes the centered image onto a white background.
    6. Inverts the colors and saves the final image as "last_inverted_cropped.png".

    Args:
        image (PIL.Image.Image): The input image to be processed.

    Returns:
        PIL.Image.Image: The final processed and color-inverted image.
    """

    # Ensure the image is in RGBA mode to handle transparency
    img = image.convert("RGBA")

    # Get data of each pixel
    datas = img.getdata()

    # Adjust pixel data to make red tones fully transparent
    newData = []
    for item in datas: 
        if item[0] > 200: # Assuming pixels with high red values are transparent
            newData.append((255, 255, 0, 0))
        else:
            newData.append(item)
    img.putdata(newData)

    # Crop to the bounding box of non-transparent areas
    bbox = img.getbbox()
    if bbox is None:
        return img.convert("RGB")  # Return as RGB if fully transparent  

    # Crop the image to the contents of the bounding box
    img_cropped = img.crop(bbox)

    # Get dimensions of cropped image
    width, height = img_cropped.size

    # Create a square canvas with added padding, filled with transparency
    square_size = max(width, height) + 75 # Adjust padding as needed
    img_square = Image.new('RGBA', (square_size, square_size), (0, 0, 0, 0))

    # Calculate position to center the cropped image on the square canvas
    paste_pos = ((square_size - width) // 2, (square_size - height) // 2)
    img_square.paste(img_cropped, paste_pos)

    # Place the transparent-centered image on a white background
    white_bg = Image.new('RGBA', img_square.size, 'WHITE')
    white_bg.paste(img_square, (0, 0), img_square)

    # Convert to RGB mode before inverting colors
    rgb_img = white_bg.convert('RGB')

    # Invert colors of the RGB image
    im_invert = ImageOps.invert(rgb_img)

    # Save the inverted image
    im_invert.save("last_inverted_cropped.png")

    return im_invert