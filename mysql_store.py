import mysql.connector
import config

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

MyDB.database = "culs"

MyCursor.execute("CREATE TABLE IF NOT EXISTS Images (id INTEGER(45) NOT NULL AUTO_INCREMENT PRIMARY KEY, Photo MEDIUMBLOB NOT NULL)")

def InsertBlob(FilePath):
    with open(FilePath, "rb") as File:
        BinaryData = File.read()
    SQLStatement = "INSERT INTO Images (Photo) VALUES (%s)"
    MyCursor.execute(SQLStatement, (BinaryData, ))
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





print("1. Insert Image\n2. Read Image")
MenuInput = input()
if int(MenuInput) == 1:
    UserFilePath = input("Enter file path:")
    InsertBlob(UserFilePath)
elif int(MenuInput) == 2:
    UserIDChoice = input("Enter ID:")
    RetrieveBlob(UserIDChoice)

