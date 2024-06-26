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
    const audio = new Audio(`/static/sounds/letters/${letter}.mp3`);
    audio.play();
}

// Event Listeners for Drawing
canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY];
    
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

// Declare a global variable
let globalPrediction;

function sendImageToServer(dataUrl) {
    localStorage.setItem('modelType', 'emnist');  // Save the model type to localStorage
    var modelType = localStorage.getItem('modelType') || 'emnist';  // Get the model type from localStorage
    
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
        globalPrediction = data.prediction;
        // Update a label with the returned data
        console.log(`Probability: ${data.probability}%\nPrediction: ${data.prediction}`);

        // Call handleButtonClick to process the prediction
        handleButtonClick();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function clicked(){
    console.log("Clicked the voice")
}


let selectedValue = "a";
let currentIndex = 0;
let index = 0;
let fix = 1;
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


// Function to handle button clicks
function handleButtonClick() {
    index = Math.floor(Math.random() * alphabet.length); // Move to the next letter
    // Check if globalPrediction is undefined
    if (globalPrediction === undefined) {
        console.warn('Global prediction is undefined. Waiting for prediction data.');
        return; // Exit function early, preventing further action
    }

    // Log globalPrediction for debugging
    console.log("The global prediction is: " + globalPrediction);
    console.log("The selected value is: " + selectedValue);

    // Compare selectedValue with globalPrediction
    if (selectedValue === globalPrediction) {
        setLight('#6fff00');
        playSound('static\\sounds\\correct.mp3');
        // Animate for 2 seconds (2000 milliseconds)
        setTimeout(() => {
            setLight(''); // Reset light color
            
            console.log(index)
            if (index < alphabet.length) {
                selectedValue = alphabet[index];
            } else {
                console.log('Sequence completed.');// Handle completion of all letters if needed
                index = 0;
                selectedValue = alphabet[index]              
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
        }, 2000);


    } else {
        setLight('#ff4b4b');
        playSound('static\\sounds\\incorrect.mp3');

        // Animate for 2 seconds (2000 milliseconds)
        setTimeout(() => {
            setLight(''); // Reset light color
            // No need to change selectedValue or currentIndex on incorrect answer
            context.clearRect(0, 0, canvas.width, canvas.height);
        }, 2000);
    }
}

// Function to set light color
function setLight(color) {  
    canvas.style.backgroundColor = color;
}

// Function to play sound
function playSound(url) {
    const audio = new Audio(url);
    audio.play();
}



// Function to handle button clicks
function handleButtonClick2() {
    // Check if globalPrediction is undefined
    if (globalPrediction === undefined) {
        console.warn('Global prediction is undefined. Waiting for prediction data.');
        return; // Exit function early, preventing further action
    }

    // Log globalPrediction for debugging
    console.log("The global prediction is: " + globalPrediction);
    console.log("The selected value is: " + selectedValue);

    // Compare selectedValue with globalPrediction
    if (selectedValue === globalPrediction) {
        fix = 1;

        if (index < alphabet.length) {
            selectedValue = alphabet[index];
            displayGuideGif(alphabet[index].toUpperCase());
        }
    } else {    
        // No need to change selectedValue or currentIndex on incorrect answer
        displayGuideGif(alphabet[index].toUpperCase());
    }
    
}
