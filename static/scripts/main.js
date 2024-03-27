const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')


canvas.width = 280;
canvas.height = 280;

context.strokeStyle = '#000000';  // Set the color of the lines to black
context.lineWidth = 10;  // Set the width of the lines to 5 pixels
context.lineJoin = 'round';  // Makes the line joins round
context.lineCap = 'round';  // Makes the line caps round



var isDrawing = false;
var lastX = 0;
var lastY = 0;

canvas.addEventListener('mousedown', function(event) {
    isDrawing = true;
    [lastX, lastY] = [event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop];
});

canvas.addEventListener('mouseup', function() {
    isDrawing = false;
});

canvas.addEventListener('mouseleave', function() {
    isDrawing = false;
});

canvas.addEventListener('mousemove', function(event) {
    if (!isDrawing) return;
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
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
    downloadTimeout = setTimeout(function() {
        sendImageToServer(dataUrl);
    }, 2000);  // 2 seconds

    previousDataUrl = dataUrl;
}, 1000);

function checkIfBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
}

function sendImageToServer(dataUrl) {
    fetch('/upload-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: dataUrl })
    }).then(response => response.json())  // Parse the JSON response
    .then(data => {
        // Update a label with the returned data
        document.getElementsByClassName('card-body')[0].textContent = `Probability: ${data.probability}%\nPrediction: ${data.prediction}`;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


