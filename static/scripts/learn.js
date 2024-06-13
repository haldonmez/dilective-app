const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

canvas.width = 280;
canvas.height = 280;

context.strokeStyle = '#000000';  // Set the color of the lines to black
context.lineWidth = 7;  // Set the width of the lines to 5 pixels
context.lineJoin = 'round';  // Makes the line joins round
context.lineCap = 'round';  // Makes the line caps round



var isDrawing = false;
var lastX = 0;
var lastY = 0;

// Reference to the GIF element
const guideGif = document.getElementById('guideGif');

// Event Listeners for Drawing
canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY];
    
    // Hide the GIF when drawing starts
    guideGif.style.display = 'none';
});

// Event Listeners for Drawing
canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY]; // Adjusted to event.offsetX and event.offsetY
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

canvas.addEventListener('mousemove', (event) => {
    if (!isDrawing) return;
    const [x, y] = [event.offsetX, event.offsetY]; // Adjusted to event.offsetX and event.offsetY
    draw(context, x, y);
});

function draw(context, x, y) {
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
    [lastX, lastY] = [x, y];
}

var previousDataUrl = null;
var downloadTimeout = null;

setInterval(function() {
    var dataUrl = canvas.toDataURL("image/png", 1.0);

    // Check if the canvas is blank or hasn't changed
    var isBlank = checkIfBlank(canvas);
    if (dataUrl === previousDataUrl || isBlank) {
        return;
    }

    // If the canvas has changed, reset the download timeout
    clearTimeout(downloadTimeout);
    spinnerTimeout = setTimeout(function(){
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'block';
    }, 650); // 650 milisecond
    downloadTimeout = setTimeout(function() {
        sendImageToServer(dataUrl);
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'none';
    }, 2000);  // 2 seconds

    previousDataUrl = dataUrl;
}, 1000);

function checkIfBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
}

function clearCanvas(canvas) {
    var clearButton = document.getElementsByClassName('clearButton')[0];
    var context = canvas.getContext('2d');

    clearButton.addEventListener('click', function() {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
    });
}

window.onload = function() {
    var canvas = document.getElementById('canvas');
    clearCanvas(canvas);

    // Add event listeners to the buttons
    document.querySelector('.digit-model-button').addEventListener('click', function() {
        localStorage.setItem('modelType', 'mnist');  // Save the model type to localStorage

        sendImageToServer(canvas.toDataURL("image/png", 1.0));
    });

    document.querySelector('.letter-model-button').addEventListener('click', function() {
        localStorage.setItem('modelType', 'emnist');  // Save the model type to localStorage

        sendImageToServer(canvas.toDataURL("image/png", 1.0), 'emnist');
    });
};


function sendImageToServer(dataUrl) {

    var modelType = localStorage.getItem('modelType') || 'mnist';  // Get the model type from localStorage
    
    // Log the data you're sending to the server
    console.log('Sending data to server:', { image: dataUrl, model_type: modelType });

    fetch('/upload-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image: dataUrl,
            model_type: modelType  // include the model type
        })
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        // Update a label with the returned data
        document.getElementsByClassName('prediction-card')[0].textContent = `Probability: ${data.probability}%\nPrediction: ${data.prediction}`;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}



