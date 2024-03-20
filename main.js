const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')


var isDrawing = false;

canvas.addEventListener('mousedown', function() {
    isDrawing = true;
});

canvas.addEventListener('mouseup', function() {
    isDrawing = false;
});

canvas.addEventListener('mousemove', function(event) {
    if (isDrawing) {
        var x = event.clientX - canvas.offsetLeft;
        var y = event.clientY - canvas.offsetTop;
        draw(context, x, y);
    }
});

function draw(context, x, y) {
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2); // Draw a circle of radius 5 at the mouse position
    context.fill();
}
