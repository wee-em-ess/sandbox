const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const container = document.getElementById("container");
const toolbar = document.getElementById("toolbar");

container.addEventListener("click", containerClickHandler);



const canvasFlags = {
	isActive: false,
    isDrawing: false,
    isNewStrokes: false,
    isBgImg: false,
	isGuides: false,
};

// Canvas Properties Object
const canvasProps = {
    lineCap: "round",
    lineJoin: "bevel",
    tipWidth: 1 * 1,
	tipPush: 0,
    strokeOpacity: 1,
	strokeScale: 1,
    globalOpacity: 1,
    strokeColor: "#dc143c", // Crimson
	fillColor: "#ffffff",
    blendingMode: "source-over",
	toolSize: "xsStroke",
	toolType: "marker",
	toolColor: "color1",
    bgImgDataUrl: undefined, // Initially undefined
};

let points = [];
//------------------------------------------------------------------------------------//

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

//------------------------------------------------------------------------------------//




function canvasDraw (stroke, context, scale = 1) {

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

//------------------------------------------------------------------------------------//

function clearCanvas (context, canvas) {

    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

}

//------------------------------------------------------------------------------------//


let c;
let cnvScale = 1;

function handleStartDrawing(e) {

		if (e.touches && e.touches.length >= 2) return;
		e.preventDefault();

		let pressure = 1;
		let x, y;


		const cnv_X = canvas.getBoundingClientRect().left;
		const cnv_Y = canvas.getBoundingClientRect().top;
		

        if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {

			if (e.touches[0]["force"] > 0) {
				
				pressure = e.touches[0]["force"];
			
			}
			
			x = (e.touches[0].clientX - cnv_X) * cnvScale;
			y = (e.touches[0].clientY - cnv_Y) * cnvScale;

		} else {
				
			pressure = 1.0;
			x = e.offsetX * cnvScale;
			y = e.offsetY * cnvScale;
			
		}

    
	canvasFlags.isDrawing = true;

	canvasProps.tipPush = Math.log(pressure + 1) * 40;
	const w = (Math.round(canvasProps.tipPush * canvasProps.tipWidth * canvasProps.strokeScale * 10) / 10);
	x = (Math.round(x * 10) / 10);
	y = (Math.round(y * 10) / 10);
	c = `rgba(${parseInt(canvasProps.strokeColor.slice(1,3),16)},${parseInt(canvasProps.strokeColor.slice(3, 5),16)},${parseInt(canvasProps.strokeColor.slice(5,7),16)},${canvasProps.strokeOpacity})`;
	const lineCap = canvasProps.lineCap;
	const lineJoin = canvasProps.lineJoin;
	const blendingMode = canvasProps.blendingMode;
	points.push({x,y,w,c,lineCap,lineJoin,blendingMode});
    console.log(pressure,w);

	/// calling Draw Function ///
	canvasDraw(points, context, 1);

}

//------------------------------------------------------------------------------------//



function handleKeepDrawing(e) {

		if (!canvasFlags.isDrawing) return;
		if (e.touches && e.touches.length >= 2) return;
		e.preventDefault();
		
		let pressure = 1;
		let x, y;

		

		const cnv_X = canvas.getBoundingClientRect().left
		const cnv_Y = canvas.getBoundingClientRect().top

		if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {

			if (e.touches[0]["force"] > 0) {
				
				pressure = e.touches[0]["force"];

			}
			
			x = (e.touches[0].clientX - cnv_X) * cnvScale;
			y = (e.touches[0].clientY - cnv_Y) * cnvScale;
						
		} else {
			
			pressure = 1.0;
			x = e.offsetX * cnvScale;
			y = e.offsetY * cnvScale;
		
		}

        
		
		// lineWidth = Math.log(pressure + 1) * 40 * 0.2 + lineWidth * 0.8;
		canvasProps.tipPush = Math.log(pressure + 1) * 40 * 0.2 + canvasProps.tipPush * 0.8;
		const w = (Math.round(canvasProps.tipPush * canvasProps.tipWidth * canvasProps.strokeScale * 10) / 10);
		x = (Math.round(x * 10) / 10);
		y = (Math.round(y * 10) / 10);
		// const c = `rgba(${parseInt(canvasProps.strokeColor.slice(1,3),16)},${parseInt(canvasProps.strokeColor.slice(3,5),16)},${parseInt(canvasProps.strokeColor.slice(5,7),16)},${canvasProps.strokeOpacity})`;
        console.log(pressure,w);
		// Push data into points object
		points.push({x,y,w,c});
		
		/// calling Draw Function ///
		canvasDraw(points, context, 1);

}

// const handleThrottledKeepDrawing = throttle(handleKeepDrawing, 90); // Default is 60.

//------------------------------------------------------------------------------------//

function handleStopDrawing(e) {

		if (!canvasFlags.isDrawing) return;
		if (e.touches && e.touches.length >= 2) return;
		
				
		console.log("canvas mouse is up");
		canvasFlags.isDrawing = false;	
		canvasProps.tipPush = 0;
        points = [];

}

//------------------------------------------------------------------------------------//

function handlePauseDrawing(e) {

		if (!canvasFlags.isDrawing) return;
		if (e.touches && e.touches.length >= 2) return;
		

		e.preventDefault();
		
		// Add Window mouseup listener only if not already handled
		const mouseUpHandler = function () {
			
			console.log("Window mouse is up");
            points = [];
			canvasProps.tipPush = 0;

			// Remove the mouseup listener after it executes
			window.removeEventListener("mouseup", mouseUpHandler);

			/// Return if !canvasFlags.isDrawing set by canvas.mouseup
			if (!canvasFlags.isDrawing) return;

			// Set state to not drawing
			canvasFlags.isDrawing = false;

		};
		
		window.addEventListener("mouseup", mouseUpHandler);

}

//------------------------------------------------------------------------------------//

// Handle Touch Events - Palm Rejection + Apple Pencil

// Helper function for palm rejection
function isPalmTouch(touch) {

    // Example heuristic: Reject touches with large radii
    return touch.radiusX > 50 || touch.radiusY > 50;
}

// Touch Start Handler
function handleTouchStart(e){

	// Filter out palm inputs using a heuristic based on touch radii
    const validTouches = Array.from(e.touches).filter(touch => !isPalmTouch(touch));
	const allTouches =  Array.from(e.touches);
    const activeTouches = validTouches.length;

	switch (validTouches.length) {

		case 1:
		e.preventDefault(); // Prevent default for single touch
        handleStartDrawing(validTouches[0])
        break;

		default:
		console.log("Not supported");
		break;

	}
	
}

//-----------------------------------------------------------------------------------//


// Touch Start Handler
function handleTouchMove(e){

	// Filter out palm inputs using a heuristic based on touch radii
    const validTouches = Array.from(e.touches).filter(touch => !isPalmTouch(touch));
	const allTouches =  Array.from(e.touches);
    const activeTouches = validTouches.length;

	switch (validTouches.length) {

		case 1:
		e.preventDefault(); // Prevent default for single touch
        handleStartDrawing(validTouches[0])
        break;

		default:
		console.log("Not supported");
		break;

	}



	if (activeTouches > 1) {
		
		// If isDrawing is true, undo and set flag to false;
		// if (canvasFlags.isDrawing) {
			
			// handleUndoClick();
			// undoHistory.pop();
			// canvasFlags.isDrawing = false; }
		
		return;
	
	}
	
	else if (activeTouches === 1) {

        e.preventDefault(); // Prevent default for single touch

		const singleTouch = validTouches[0];
		
        // Determine the touch phase and handle drawing
		if (e.type === "touchmove") {

            handleKeepDrawing(singleTouch);

        }
	}

}




//-------------------//

//------------------------------------------------------------------------------------//


	// Handle mousedown and touchstart
	canvas.addEventListener("mousedown", handleStartDrawing, { passive: false });
	canvas.addEventListener("touchstart", handleStartDrawing, { passive: false });

	// Handle mousemove and touchmove
    canvas.addEventListener("mousemove", handleKeepDrawing, { passive: false });
	canvas.addEventListener("touchmove", handleKeepDrawing, { passive: false });

	// Handle mouseup and touchend
	canvas.addEventListener("mouseup", handleStopDrawing, { passive: false });
	canvas.addEventListener("touchend",  handleStopDrawing, { passive: false });

	// Handle mouseleave
	canvas.addEventListener("mouseleave", handlePauseDrawing, { passive: false });


//------------------------------------------------------------------------------------//
