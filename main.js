const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

context.strokeStyle = '#000000';  // Set the color of the lines to black
context.lineWidth = 4;  // Set the width of the lines to 5 pixels
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
    var dataUrl = canvas.toDataURL('image/png');

    // Check if the canvas is blank or hasn't changed
    var isBlank = checkIfBlank(canvas);
    if (dataUrl === previousDataUrl || isBlank) {
        return;
    }

    // If the canvas has changed, reset the download timeout
    clearTimeout(downloadTimeout);
    downloadTimeout = setTimeout(function() {
        downloadImage(dataUrl);
    }, 2000);  // 2 seconds

    previousDataUrl = dataUrl;
}, 1000);

function checkIfBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
}

function downloadImage(dataUrl) {
    var link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'canvas.png';
    link.click();
}

