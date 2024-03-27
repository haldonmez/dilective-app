from PIL import Image, ImageOps


def crop_transparency(image):
    img = image.convert("RGBA")

    datas = img.getdata()

    newData = []
    for item in datas:
        if item[0] > 200:
            newData.append((255, 255, 0, 0))
        else:
            newData.append(item)

    img.putdata(newData)

    # Get the bounding box of the non-transparent area
    bbox = img.getbbox()

    # Crop the image to the contents of the bounding box
    img_cropped = img.crop(bbox)

    # Calculate width and height of the cropped image
    width, height = img_cropped.size

    # Determine the size of the square to be the larger of the width and height
    square_size = max(width, height) + 84 # Adding 4 to account for the 2px padding on each side

    # Create a new image of the square size, filled with transparent pixels
    img_square = Image.new('RGBA', (square_size, square_size), (0, 0, 0, 0))

    # Calculate the position to paste the cropped image into the square image
    paste_pos = ((square_size - width) // 2, (square_size - height) // 2)

    # Paste the cropped image into the square image
    img_square.paste(img_cropped, paste_pos)

    white_bg = Image.new('RGBA', img_square.size, 'WHITE')
    # Paste the image onto the white background

    white_bg.paste(img_square, (0, 0), img_square)
    # Convert the image to RGB

    rgb_img = white_bg.convert('RGB')

    im_invert = ImageOps.invert(rgb_img)

    # Save the padded square image
    im_invert.save("last_inverted_cropped.png")

    return im_invert