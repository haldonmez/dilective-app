const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const guideGif = document.getElementById('guideGif');

canvas.width = 800;
canvas.height = 400;

context.strokeStyle = '#000000';  // Set the color of the lines to black
context.lineWidth = 7;  // Set the width of the lines to 5 pixels
context.lineJoin = 'round';  // Makes the line joins round
context.lineCap = 'round';  // Makes the line caps round



var isDrawing = false;
var lastX = 0;
var lastY = 0;

// Function to load and display GIF for a specific button
function displayGuideGif(letter) {
    const gifPath = `/static/letters_gif/${letter}.gif`;
    guideGif.src = gifPath;
    console.log(guideGif.src)
    guideGif.style.display = 'block';
}

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

// Function to reset canvas and show GIF for the clicked button
function resetCanvas(letter) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    displayGuideGif(letter);
}

// Event listeners for each button (item1 to item26)
const items = document.querySelectorAll('.item');
items.forEach((item) => {
    const letter = item.textContent.trim();
    item.addEventListener('click', () => {
        resetCanvas(letter); // Reset canvas and display corresponding GIF
    });
});

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
        console.log(`Probability: ${data.probability}%\nPrediction: ${data.prediction}`);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}



const wrapper = document.querySelector('.wrapper');
let isDragging = false;
let startX;
let scrollLeft;

let animationID; // To store requestAnimationFrame ID

function startDragging(e) {
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX;
    scrollLeft = wrapper.scrollLeft;
    wrapper.style.cursor = 'grabbing';
    // Stop automatic animation
    pauseAnimation();
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const dragDistance = (x - startX);
    wrapper.scrollLeft = scrollLeft - dragDistance;
}

function stopDragging() {
    isDragging = false;
    wrapper.style.cursor = 'grab';
    // Resume automatic animation
    resumeAnimation();
}

function pauseAnimation() {
    wrapper.style.animationPlayState = 'paused';
}

function resumeAnimation() {
    wrapper.style.animationPlayState = 'running';
}

// Mouse events
wrapper.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDragging);

// Touch events
wrapper.addEventListener('touchstart', startDragging);
document.addEventListener('touchmove', drag);
document.addEventListener('touchend', stopDragging);


