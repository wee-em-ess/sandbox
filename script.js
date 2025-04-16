const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");

const container = document.getElementById("container");
const toolbar = document.getElementById("toolbar");

container.addEventListener("click", containerClickHandler);

// Define the named event handler function
function containerClickHandler(event) {
const target = event.target;


   if (target && target.classList.contains("button")) {
    
        //target.classList.toggle("button-selected");

    }

    if (target && target.id === "toggle-panel") {
    
        toolbar.classList.toggle("hide-options");

    }

    if (target && target.id === "clear-canvas") {
    
        clearCanvas(context, canvas);

    }
}



function canvasDraw (stroke, context, scale = 1) {
    context.strokeStyle = 'black'
    context.lineCap = 'round'
    context.lineJoin = 'round'

    const pointA = stroke[stroke.length - 2];
    const pointB = stroke[stroke.length - 1];

    if (stroke.length >= 2) {
        const midx = (pointB.x + pointA.x) / 2;
        const midy = (pointB.y + pointA.y) / 2;

        if (pointA.c) { context.strokeStyle = pointA.c; }
        if (pointA.w) { context.lineWidth = pointA.w * scale; }
        if (pointA.lineCap) { context.lineCap = pointA.lineCap; }
        if (pointA.lineJoin) { context.lineJoin = pointA.lineJoin; }
        if (pointA.blendingMode) { context.globalCompositeOperation = pointA.blendingMode; }

        context.quadraticCurveTo(pointA.x * scale, pointA.y * scale, midx * scale, midy * scale);
        context.stroke();
        context.beginPath();
        context.moveTo(midx * scale, midy * scale);

    } else {

        const point = stroke[0];

        context.strokeStyle = point.c;
        context.lineWidth = point.w * scale;
        context.lineCap = point.lineCap;
        context.lineJoin = point.lineJoin;
        context.globalCompositeOperation = point.blendingMode;

        context.beginPath();
        context.moveTo(point.x * scale, point.y * scale);
        context.lineTo((point.x + 0.1) * scale, point.y * scale);
        context.stroke();
    }

}

function clearCanvas (context, canvas) {

    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

}


