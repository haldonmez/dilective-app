import mysql.connector
import config
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt

# Use the variables from config file
password = config.password

# Function to create the database if it doesn't exist
def create_database(cursor):
    cursor.execute("CREATE DATABASE IF NOT EXISTS culs")

MyDB = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = password,
)

MyCursor = MyDB.cursor()


# Create the database if it doesn't exist
create_database(MyCursor)

MyDB.database = "culs" # Controlled, User, 

MyCursor.execute("""
    CREATE TABLE IF NOT EXISTS Images (
        id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
        ClassName VARCHAR(25) NOT NULL,
        Photo MEDIUMBLOB NOT NULL
    )
""")

def InsertBlob(class_name, BinaryData):
    SQLStatement = "INSERT INTO Images (ClassName, Photo) VALUES (%s, %s)"
    MyCursor.execute(SQLStatement, (class_name, BinaryData, ))
    MyDB.commit()

def RetrieveBlob(ID):
    SQLStatement = "SELECT * FROM Images WHERE id = '{0}'"
    MyCursor.execute(SQLStatement.format(str(ID)))
    MyResult = MyCursor.fetchone()[1]
    StoreFilePath = "ImageOutputs/img{0}.jpeg".format(str(ID))
    print(MyResult)
    with open(StoreFilePath, "wb") as File:
        File.write(MyResult)
        File.close()



def fetch_image_blob(image_id):
    SQLStatement = "SELECT Photo FROM Images WHERE id = %s"
    MyCursor.execute(SQLStatement, (image_id,))
    blob_data = MyCursor.fetchone()[0]
    return blob_data

def plot_image_from_blob(blob_data):
    # Convert blob data to PIL Image
    image = Image.open(BytesIO(blob_data))
    
    # Display the image using matplotlib
    plt.imshow(image, cmap='gray')  # Use grayscale colormap
    plt.axis('off')  # Hide axes
    plt.show()

# Example: Fetching and plotting the 10th image (image_id = 18)
image_id = 22
blob_data = fetch_image_blob(image_id)
plot_image_from_blob(blob_data)
