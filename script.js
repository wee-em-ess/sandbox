const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const container = document.getElementById("container");
const toolbar = document.getElementById("toolbar");
const info = document.querySelectorAll('#info')[0]
const touches = document.querySelectorAll('#touches')[0]

container.addEventListener("click", containerClickHandler);



const canvasFlags = {
	isActive: false,
    isDrawing: false,
    isNewStrokes: false,
    isBgImg: false,
	isGuides: false,
    isPressure: false,
    isDynamicOpacity: false,
    isDynamicWidth: false,
    isTouch: false,
    isThrottle: false,
    isRejectPalm: false,
    isDockOpen: true
};

// Canvas Properties Object
const canvasProps = {
    lineCap: "round",
    lineJoin: "bevel",
    tipWidth: 2,
	tipPush: 0,
    tipPushOpacity: 0,
    strokeOpacity: 1,
	strokeScale: 1,
    globalOpacity: 1,
    strokeColor: "#000000", // Crimson
	fillColor: "#ffffff",
    smootheningFactor: 0.5,
    palmRadius: 50,
    blendingMode: "source-over",
	toolSize: "xsStroke",
	toolType: "marker",
	toolColor: "color1",
    bgImgDataUrl: undefined, // Initially undefined
};

let points = [];
let pType = "pV1";
let gType;

//------------------------------------------------------------------------------------//

// Define the named event handler function
function containerClickHandler(event) {
const target = event.target;


    if (target && target.classList.contains("button")) {
    
        //target.classList.toggle("button-selected");

    }

    if (target && target.id === "toggle-panel") {
    
        toolbar.classList.toggle("hide-options");
        if (canvasFlags.isDockOpen) {canvasFlags.isDockOpen = false}
        else {canvasFlags.isDockOpen = true}
    }

    if (target && target.id === "clear-canvas") {
    
        clearCanvas(context, canvas);

    }

    if (target && target.id === "dynamicOpacity") {
    
        target.classList.toggle("button-selected");
        if (canvasFlags.isDynamicOpacity) {canvasFlags.isDynamicOpacity = false}
        else {canvasFlags.isDynamicOpacity = true}

    }

    if (target && target.id === "dynamicWidth") {
    
        target.classList.toggle("button-selected");
        if (canvasFlags.isDynamicWidth) {canvasFlags.isDynamicWidth = false}
        else {canvasFlags.isDynamicWidth = true}

    }

    if (target && target.id === "pressure") {
    
        target.classList.toggle("button-selected");
        if (canvasFlags.isPressure) {canvasFlags.isPressure = false}
        else {canvasFlags.isPressure = true}

    }

    if (target && target.name === "pType") {
        
        pType = target.value;
        console.log (target.value);

    }

    if (target && target.id === "pSlider") {
        
        canvasProps.smootheningFactor = target.value/100;
        console.log (target.value/100);

    }

    if (target && target.id === "palmSlider") {
        
        canvasProps.palmRadius = target.value/2;
        console.log (target.value/2);

    }

    if (target && target.id === "opacitySlider") {
        
        canvasProps.strokeOpacity = target.value/100;
        console.log (target.value/100);

    }

    if (target && target.id === "strokeSlider") {
        
        canvasProps.tipWidth = target.value;
        console.log (target.value);

    }


    if (target && target.id === "guides") {
    
        target.classList.toggle("button-selected");
        if (canvasFlags.isGuides) {canvasFlags.isGuides = false}
        else {canvasFlags.isGuides = true}

    }

    if (target && target.name === "gType") {
        
        gType = target.value;
        console.log (target.value);

    }

    if (target && target.id === "touch") {
    
        target.classList.toggle("button-selected");
        if (canvasFlags.isTouch) {canvasFlags.isTouch = false}
        else {canvasFlags.isTouch = true}

    }

    if (target && target.id === "reject-palm") {
    
        target.classList.toggle("button-selected");
        if (canvasFlags.isRejectPalm) {canvasFlags.isRejectPalm = false}
        else {canvasFlags.isRejectPalm = true}

    }

    if (target && target.id === "throttle-stroke") {
    
        target.classList.toggle("button-selected");
        if (canvasFlags.isThrottle) {canvasFlags.isThrottle = false}
        else {canvasFlags.isThrottle = true}

    }

    if (target && target.id === "pV1") {
    
        target.classList.toggle("button-selected");
        if (canvasFlags.isThrottle) {canvasFlags.isThrottle = false}
        else {canvasFlags.isThrottle = true}

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


//let c;
let cnvScale = 1;
let device;


function handleStartDrawing(e) {

    let pressure = 1;
    let x, y, c;
    let validTouches;

    if (e.touches) {           

        if (!canvasFlags.isRejectPalm && canvasFlags.isTouch) {
            
            validTouches = Array.from(e.touches)}
        
        else if (canvasFlags.isRejectPalm && canvasFlags.isTouch) {
            
            validTouches = Array.from(e.touches).filter(touch => !isPalmTouch(touch, canvasProps.palmRadius));
            
        }

        else if (!canvasFlags.isTouch && canvasFlags.isRejectPalm) {
            
            validTouches = Array.from(e.touches).filter(touch => !isPalmTouch(touch, 2 ));
            
        }
  
        else { return }
        
        if (validTouches.length === 0 || validTouches.length >= 2 ) { return }
        
    }

    e.preventDefault();
    
    const cnv_X = canvas.getBoundingClientRect().left
    const cnv_Y = canvas.getBoundingClientRect().top

    if (canvasFlags.isDockOpen) {
        
        toolbar.classList.toggle("hide-options");
        canvasFlags.isDockOpen = false
    }
   

    if (validTouches && validTouches[0] && typeof validTouches[0]["force"] !== "undefined") {

        if (canvasFlags.isPressure && validTouches[0]["force"] > 0) {
            
            pressure = validTouches[0]["force"];
            device = "Force Touch / Apple Pencil"
        }

        else {device = "Touch"}
        
        x = (validTouches[0].clientX - cnv_X) * cnvScale;
        y = (validTouches[0].clientY - cnv_Y) * cnvScale;

                    
    } else {
				
			pressure = 1;
			x = e.offsetX * cnvScale;
			y = e.offsetY * cnvScale;
            device = "Mouse"
			
	}

    
	canvasFlags.isDrawing = true;

    if (canvasFlags.isDynamicWidth && pType === "pV1") {canvasProps.tipPush = pressure * canvasProps.tipWidth}    
	else if (canvasFlags.isDynamicWidth && pType === "pV2") {canvasProps.tipPush = Math.log(pressure + 1) * canvasProps.tipWidth}
    else if (canvasFlags.isDynamicWidth && pType === "pV3") {canvasProps.tipPush = canvasProps.smootheningFactor * canvasProps.tipWidth + (1 - canvasProps.smootheningFactor) * (pressure * canvasProps.tipWidth)}
    else if (canvasFlags.isDynamicWidth && pType === "pV4") {canvasProps.tipPush = Math.pow(pressure, 2) * canvasProps.tipWidth}
    else if (canvasFlags.isDynamicWidth && pType === "pV5") {canvasProps.tipPush = (Math.exp(pressure) - 1) / (Math.exp(1) - 1) * canvasProps.tipWidth}
    else {canvasProps.tipPush = canvasProps.tipWidth}

    if (canvasFlags.isDynamicOpacity) { canvasProps.tipPushOpacity = Math.log(pressure + 1) * canvasProps.strokeOpacity}
    else { canvasProps.tipPushOpacity = canvasProps.strokeOpacity }

	const w = (Math.round(canvasProps.tipPush * canvasProps.strokeScale * 10) / 10);

	x = (Math.round(x * 10) / 10);
	y = (Math.round(y * 10) / 10);
	c = `rgba(${parseInt(canvasProps.strokeColor.slice(1,3),16)},${parseInt(canvasProps.strokeColor.slice(3, 5),16)},${parseInt(canvasProps.strokeColor.slice(5,7),16)},${canvasProps.tipPushOpacity})`;
	const lineCap = canvasProps.lineCap;
	const lineJoin = canvasProps.lineJoin;
	const blendingMode = canvasProps.blendingMode;
	points.push({x,y,w,c,lineCap,lineJoin,blendingMode});
    console.log(pressure,w);

	/// calling Draw Function ///
	canvasDraw(points, context, 1);

    const touch = e.touches ? e.touches[0] : null
    info.innerHTML = `
        device = ${device} <br/>
        windowPixelDensity = ${window.devicePixelRatio} <br/>
        windowScreenWidth = ${window.screen.width} <br/>
        canvasWidth = ${canvas.width} <br/>
        canvasCalcWidth = ${canvas.clientWidth} <br/>
        pressure = ${pressure} <br/>
        pressureSmoothening = ${canvasProps.smootheningFactor} <br/>
        strokeWidth = ${canvasProps.tipWidth} <br/>
        calculatedWidth = ${canvasProps.tipPush} <br/>
        strokeOpacity = ${canvasProps.strokeOpacity} <br/>
        calculatedOpacity = ${canvasProps.tipPushOpacity} <br/>       
        palmRejectWidth = ${canvasProps.palmRadius} <br/>
      `
    if (touch) {
      touches.innerHTML = `
        touchType = ${touch.touchType} ${touch.touchType === 'direct' ? 'Touch' : 'Device'} <br/>
        radiusX = ${touch.radiusX} <br/>
        radiusY = ${touch.radiusY} <br/>
        rotationAngle = ${touch.rotationAngle} <br/>
        altitudeAngle = ${touch.altitudeAngle} <br/>
        azimuthAngle = ${touch.azimuthAngle} <br/>
      `
    }
}

//------------------------------------------------------------------------------------//



function handleKeepDrawing(e) {

		if (!canvasFlags.isDrawing) return;

        let pressure = 1;
		let x, y, c;
        let validTouches;

		if (e.touches) {           

            if (!canvasFlags.isRejectPalm && canvasFlags.isTouch) {
                
                validTouches = Array.from(e.touches)}
            
            else if (canvasFlags.isRejectPalm && canvasFlags.isTouch) {
                
                validTouches = Array.from(e.touches).filter(touch => !isPalmTouch(touch, canvasProps.palmRadius));
                
            }

            else if (!canvasFlags.isTouch && canvasFlags.isRejectPalm) {
                
                validTouches = Array.from(e.touches).filter(touch => !isPalmTouch(touch, 2 ));
                
            }

            else { return }
            
            if (validTouches.length === 0 || validTouches.length >= 2 ) { return }
            
        }

		e.preventDefault();
		
		const cnv_X = canvas.getBoundingClientRect().left
		const cnv_Y = canvas.getBoundingClientRect().top



		if (validTouches && validTouches[0] && typeof validTouches[0]["force"] !== "undefined") {

			if (canvasFlags.isPressure && validTouches[0]["force"] > 0) {
				
				pressure = validTouches[0]["force"];
                device = "Force Touch / Apple Pencil"
			}

            else {device = "Touch"}
			
			x = (validTouches[0].clientX - cnv_X) * cnvScale;
			y = (validTouches[0].clientY - cnv_Y) * cnvScale;
						
		} else {
			
			pressure = 1.0;
			x = e.offsetX * cnvScale;
			y = e.offsetY * cnvScale;
            device = "Mouse"
		}

        
		if (canvasFlags.isDynamicWidth && pType === "pV1") {canvasProps.tipPush = pressure * canvasProps.tipWidth}
		else if (canvasFlags.isDynamicWidth && pType === "pV2") {canvasProps.tipPush = Math.log(pressure + 1) * canvasProps.tipWidth * 0.2 + canvasProps.tipPush * 0.8 }
        else if (canvasFlags.isDynamicWidth && pType === "pV3") {canvasProps.tipPush = canvasProps.smootheningFactor * canvasProps.tipWidth + (1 - canvasProps.smootheningFactor) * (pressure * canvasProps.tipWidth)}
        else if (canvasFlags.isDynamicWidth && pType === "pV4") {canvasProps.tipPush = Math.pow(pressure, 2) * canvasProps.tipWidth}
        else if (canvasFlags.isDynamicWidth && pType === "pV5") {canvasProps.tipPush = (Math.exp(pressure) - 1) / (Math.exp(1) - 1) * canvasProps.tipWidth}
        else {canvasProps.tipPush = canvasProps.tipWidth}

        if (canvasFlags.isDynamicOpacity) { canvasProps.tipPushOpacity = Math.log(pressure + 1) * canvasProps.strokeOpacity}
        else { canvasProps.tipPushOpacity = canvasProps.strokeOpacity }

		const w = (Math.round(canvasProps.tipPush * canvasProps.strokeScale * 10) / 10);
		x = (Math.round(x * 10) / 10);
		y = (Math.round(y * 10) / 10);
		c = `rgba(${parseInt(canvasProps.strokeColor.slice(1,3),16)},${parseInt(canvasProps.strokeColor.slice(3,5),16)},${parseInt(canvasProps.strokeColor.slice(5,7),16)},${canvasProps.tipPushOpacity})`;

		// Push data into points object
		points.push({x,y,w,c});
		
		/// calling Draw Function ///
		canvasDraw(points, context, 1);

        const touch = e.touches ? e.touches[0] : null
        info.innerHTML = `
        device = ${device} <br/>
        windowPixelDensity = ${window.devicePixelRatio} <br/>
        windowScreenWidth = ${window.screen.width} <br/>
        canvasWidth = ${canvas.width} <br/>
        canvasCalcWidth = ${canvas.clientWidth} <br/>
        pressure = ${pressure} <br/>
        pressureSmoothening = ${canvasProps.smootheningFactor} <br/>
        strokeWidth = ${canvasProps.tipWidth} <br/>
        calculatedWidth = ${canvasProps.tipPush} <br/>
        strokeOpacity = ${canvasProps.strokeOpacity} <br/>
        calculatedOpacity = ${canvasProps.tipPushOpacity} <br/>       
        palmRejectWidth = ${canvasProps.palmRadius} <br/> 
      `
        if (touch) {
          touches.innerHTML = `
            touchType = ${touch.touchType} ${touch.touchType === 'direct' ? 'Touch' : 'Device'} <br/>
            radiusX = ${touch.radiusX} <br/>
            radiusY = ${touch.radiusY} <br/>
            rotationAngle = ${touch.rotationAngle} <br/>
            altitudeAngle = ${touch.altitudeAngle} <br/>
            azimuthAngle = ${touch.azimuthAngle} <br/>
          `
        }

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



// Helper function for palm rejection - // Handle Touch Events - Palm Rejection + Apple Pencil
function isPalmTouch(touch, radius) {

    // Example heuristic: Reject touches with large radii
    return touch.radiusX > radius || touch.radiusY > radius;

}


//------------------------------------------------------------------------------------//


// // Helper Function to throttle mousemove and touchmove

function throttle(func, freq = 60) {
    const limit = 1000 / freq; // Calculate interval based on framerate
    let lastFunc;
    let lastRan;

    return function(...args) {
        const context = this;

        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

//------------------------------------------------------------------------------------//

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
