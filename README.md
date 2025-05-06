 # 🧠 Dilective – Learn Through Handwriting

  Dilective is an interactive playground designed for young learners to **create**, **adapt**, and **learn** through handwriting.  
  It uses a custom-built AI model to recognize handwritten characters, turning them into educational interactions.
  
## 🚀 Features

  - ✍️ Handwriting recognition using a custom-trained model  
  - 🖼️ Interactive canvas for drawing and input  
  - 🧒 Child-friendly and intuitive UI  
  - 🧪 Flask-based backend for rapid deployment

## Screenshot
![](static/readme_images/image1.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

1. **Clone the repository**:
    ```bash
    git clone https://github.com/haldonmez/dilective-app.git
    cd dilective-app
    ```

2. **Install the necessary requirements**:
    ```bash
    pip install -r requirements.txt
    ```

3. **Once installed start the flask app**:
    ```bash
    flask run
    ```

End with an example of getting some data out of the system or using it for a little demo


  ## 📁 Project Structure

  ```text
  dilective-app/
  ├── static/               # Static assets like JS, CSS, images
  ├── templates/            # HTML templates
  ├── models/               # Handwriting recognition models
  ├── predict/              # Prediction logic
  ├── utils/                # Utility scripts
  ├── app.py                # Flask entry point
  └── requirements.txt      # Python dependencies
  ```
## Running the tests


This project includes automated tests that validate functionality across all core components, ensuring that models, utility functions, prediction modules, and Flask endpoints perform as expected.

To run all tests, use the following command from the project root:

```bash
pytest tests/
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

