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

// Function to update the displayed letter based on the selected letter
function updateSoundIcon(letter) {
    const lowercase_letter = letter.toLowerCase()
    soundIcon.textContent = letter + lowercase_letter;  // Update the text content to the selected letter
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
    updateSoundIcon(letter);
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


let selectedValue = "a";
let index = 0
let currentIndex = 0;
let fix = 1;
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// Function to handle button clicks
function handleButtonClick() {
    
    // Check if globalPrediction is undefined
    if (globalPrediction === undefined) {
        console.warn('Global prediction is undefined. Waiting for prediction data.');
        return; // Exit function early, preventing further action
    }

    // Log globalPrediction for debugging
    console.log("The global prediction is: " + globalPrediction);
    console.log("The selected value is: " + selectedValue);
    
    if(fix === 1){  
        const items = document.querySelectorAll('.item');
        items.forEach((item) => {
            const value = item.getAttribute('data-value'); // Get the data-value attribute
            item.addEventListener('click', () => {
                selectedValue = value // Call fetchPrediction with the data-value when clicked
                index = alphabet.indexOf(value);
            });
        });};

    // Compare selectedValue with globalPrediction
    if (selectedValue === globalPrediction) {
        setLight('#6fff00');
        playSound('static\\sounds\\correct.mp3');
        fix = 1
        // Animate for 2 seconds (2000 milliseconds)
        setTimeout(() => {
            setLight(''); // Reset light color
            index++; // Move to the next letter
            console.log(index)
            if (index < alphabet.length) {
                selectedValue = alphabet[index];
                displayGuideGif(alphabet[index].toUpperCase());
                updateSoundIcon(alphabet[index].toUpperCase());
            } else {
                console.log('Sequence completed.');// Handle completion of all letters if needed
                index = 0;
                selectedValue = alphabet[index]              
                fix = 0;
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
            displayGuideGif(alphabet[index].toUpperCase());
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