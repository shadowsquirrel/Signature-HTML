// (function() {

var canvas = document.querySelector('#signaturePad');
var ctx = canvas.getContext('2d');

var canvas_signHere = document.querySelector('#signHere');
var ctx_signHere = canvas_signHere.getContext('2d');


// var sketch = document.querySelector('#sketch');
// var sketch_style = getComputedStyle(sketch);
// canvas.width = parseInt(sketch_style.getPropertyValue('width'));
// canvas.height = parseInt(sketch_style.getPropertyValue('height'));


// Creating a tmp canvas
var tmp_canvas = document.createElement('canvas');
var tmp_ctx = tmp_canvas.getContext('2d');
tmp_canvas.id = 'tmp_canvas';
tmp_canvas.width = canvas.width;
tmp_canvas.height = canvas.height;
// tmp_canvas.setAttribute('position', "absolute");


// Creating a storage canvas
var str_canvas = document.createElement('canvas');
var str_ctx = str_canvas.getContext('2d');
str_canvas.id = 'str_canvas';
str_canvas.width = canvas.width;
str_canvas.height = canvas.height;



var pad = document.querySelector('#pad-0-0');
pad.appendChild(tmp_canvas);
$('#tmp_canvas').css({'position':'absolute'});


// various global switches
var mouseDown = false;
var initialPenSize = 15;
var smoothInk = false;
var limitedInk = false;
var discreteInk = false;

var point = {x: 0, y: 0, s:initialPenSize};
var last_point = {x: 0, y: 0};

// Pencil Points
var ppts = [];

// additional globals for discrete drawing
var firstDown = false;
var secondDown = false;
var mouseDownCounter = 0;
var originX = 0;
var originY = 0;
var previousCanvasState;
var str_previousCanvasState;
// line points (not used)
var discrete_ppts = []





/* Mouse Capturing Work */
tmp_canvas.addEventListener('mousemove', function(e) {

    point.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    point.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

    //ADD HERE TOUCH ABILITY AND DISABILING DEFAULT TOUCH EVENTS

}, false);


// setting up temporary context canvas
tmp_ctx.lineWidth = point.s;
tmp_ctx.lineJoin = 'round';
tmp_ctx.lineCap = 'round';
tmp_ctx.strokeStyle = 'black';
tmp_ctx.fillStyle = 'black';

// setting up storage context canvas
str_ctx.lineWidth = point.s;
str_ctx.lineJoin = 'round';
str_ctx.lineCap = 'round';
str_ctx.strokeStyle = 'black';
str_ctx.fillStyle = 'black';


var copyToStorage  = function() {

    // dont know yet

}


// MOUSE DOWN
tmp_canvas.addEventListener('mousedown', function(e) {

    mouseDown = true;
    // console.log('mouse is down');

    if(!discreteInk) {

        // activate onPaint
        tmp_canvas.addEventListener('mousemove', onPaint, false);
        // deactivate drawLine
        canvas.removeEventListener('mousemove', drawLine, false);

        // get point on first click
        point.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
        point.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

        // record point on first click
        ppts.push({x: point.x, y: point.y, s: point.s});


        // console.log('first push');
        // console.log(ppts);

        // paint the first click (i.e. a point)
        onPaint();

    } else {

        console.log('discrete section');

        // ---- DISCRETE DRAWING SETUP ----- //

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // deactivate onPaint
        tmp_canvas.removeEventListener('mousemove', onPaint, false);



        mouseDownCounter = mouseDownCounter + 1;

        if(mouseDownCounter % 2 === 1) {
            firstDown = 1;
            secondDown = 0;
        } else {
            firstDown = 0;
            secondDown = 1;
        }

        // get point on first click
        point.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
        point.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

        if(firstDown) {
            originX = point.x;
            originY = point.y;
        }

        // activate onPaint
        tmp_canvas.addEventListener('mousemove', onPaint, false);

        // activate drawLine
        // canvas.addEventListener('mousemove', drawLine, false);


        storeDiscreteState(ctx);
        storeDiscreteState(str_ctx);

    }


}, false);





// MOUSE UP
document.addEventListener('mouseup', function() {

    if(!discreteInk) {

        mouseDown = false;
        console.log('mouse is up');

        // kill the move listener onPaint
        tmp_canvas.removeEventListener('mousemove', onPaint, false);

        updatePad();

    }


}, false);

//------------------------------------------------------------------------//
//------------------------------------------------------------------------//
//---------------------------- UPDATEPAD ---------------------------------//
//------------------------------------------------------------------------//
//--------- DRAW TEMP CANVAS TO MAIN CANVAS & CLEAR TEMP CANVAS ----------//
//------------------------------------------------------------------------//

var updatePad = function() {

    // Writing down to real canvas now
    ctx.drawImage(tmp_canvas, 0, 0);

    if(smoothInk) {

        // Clearing tmp canvas
        tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    }

    // Emptying up Pencil Points
    ppts = [];


}

//------------------------------------------------------------------------//
//------------------------------------------------------------------------//
//--------------------------- DISCRETE DRAWING ---------------------------//
//------------------------------------------------------------------------//
//------------------------------------------------------------------------//
//------------------------------------------------------------------------//


var storeDiscreteState = function(context) {

    previousCanvasState = context.getImageData(0,0,canvas.width,canvas.height);
    // str_previousCanvasState = str_ctx.getImageData(0,0,canvas.width,canvas.height);

}

var redoState = function(context) {


    context.putImageData(previousCanvasState, 0, 0);
    // str_ctx.putImageData(str_previousCanvasState, 0, 0);

}

var drawLine = function(context, x1, y1, x2, y2, s) {

    if(firstDown) {

        redoState(context);

        // console.log('inside drawline');

        context.beginPath();
        // dynamicColor(context);
        context.strokeStyle = 'black';
        context.lineWidth = s;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();

    }

}


//------------------------------------------------------------------------//
//------------------------------------------------------------------------//
//---------------------------- UPDATEINK ---------------------------------//
//------------------------------------------------------------------------//
//------------ PEN SIZE VELOCITY CALCULATION/CONVERSION ------------------//
//------------------------------------------------------------------------//

// as you write ink is 'drained'
// when you stop writting it refills
var fillInk = false;

// function to convert speed to penSize
var v2S = function(v) {

    if(limitedInk) {

        var L, k, i, x0, size;

        /*
        // parameter values
        // L = 8.5;
        // k = 0.005;
        // i = 4;
        // x0 = -800;

        // L = 5;
        // k = 0.02;
        // i = 5;
        // x0 = -100;

        // L = 1080;
        // k = 0.0013;
        // i = -1.7;
        // x0 = 3000;

        //
        // L = 540;
        // k = 0.00115;
        // i = 0.5;
        // x0 = 2500;

        // L = 13.5;
        // k = 0.024;
        // i = 0.5;
        // x0 = -640;

        // L = 5;
        // k = 0.024;
        // i = 6;//4.8;
        // x0 = -640;


        // L = 30;
        // k = 0.0177;
        // i = 1;//4.8;
        // x0 = -200;


        // L = 13;
        // k = 0.008;
        // i = 2;
        // x0 = -200;
        */

        // L = sliderPenSize * 2;
        L = 15;
        k = 0.022;
        i = 2;
        x0 = -100;

        size = (L / (1 + Math.exp(-k * (-v-x0))) ) + i;

        return size;

    } else {

        return point.s;
        // return initialPenSize;

    }

}

var increaseIncrement = 0.5;
var increaseIncrement2 = 0.85;//0.5;
var decreaseIncrement = 0.85;

// var increaseRatio = 1.2;
// var decreaseRatio = 0.75;

var increase = function() {
    point.s = point.s + increaseIncrement;
    // point.s = point.s * increaseRatio;
}

var increase2 = function() {
    point.s = point.s + increaseIncrement2;
    // point.s = point.s * increaseRatio;
}

var decrease = function() {
    point.s = point.s - decreaseIncrement;
    // point.s = point.s * decreaseRatio;
}

// smooth out the ink size conversion
var quasiConvert = function(current, goal) {

    // console.log('conversion function');
    //
    // console.log('current size: ' + current);
    // console.log('goal size: ' + goal);

    if(goal > current) {
        // console.log('increasing current pensize');
        if(fillInk) {
            increase2();
        } else {
            increase();
        }
    }

    if (current > goal) {
        // console.log('decreasing current pensize');
        decrease();
    }

}


//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//
//------------------------- VELOCITY TO PEN SIZE -----------------------------//
//----------------------------------------------------------------------------//
//----------------------------------------------------------------------------//

// called by the mouseSpeed object
// velocity is calculated by the MouseSpeed object mouseSpeed.js
// within the selector frame with the updateInk handler
// updateInk receives the velocity and calculates the new Ink size and
// updates the pen size global variable point.s through quasiConvert
// where quasiConvert then calls increase or decrease functions to
// smooth out the pen size change
var updateInk = function(velocity) {

    $('#velocity').html('linear: ' + velocity.velocity());
    $('#velocityX').html('x: ' + velocity.velocityX());
    $('#velocityY').html('y: ' + velocity.velocityY());

    fillInk = false;

    if(mouseDown) {

        var v = velocity.velocity();
        var goalSize = v2S(v);
        var currentSize = point.s;
        quasiConvert(currentSize, goalSize);

    } else {

        fillInk = true;
        var currentSize = point.s;
        quasiConvert(currentSize, initialPenSize);

    }

}

updateInk(new MouseSpeed.Velocity());

// construct a new mouseSpeed object on the canvas to calculate the speed and
// make the speed to ink size conversion
// make it active dependent on mouseDown if you wish
new MouseSpeed({ selector: '.frame-A-0-0', velocityOnMouseDownOnly: false, handler: updateInk })


//------------------------------------------------------------------------//
//------------------------------------------------------------------------//
//----------------------------- ONPAINT ----------------------------------//
//------------------------------------------------------------------------//
//------------ SMOOTH/NONSMOOTH CONTINOUS/DISCRETE DRAWING ---------------//
//------------------------------------------------------------------------//


// ----------- LINE TO ------------//

var draw = function() {

    // last two points on the array of points
    // starting point
    var x1 = ppts[ppts.length - 2].x;
    var y1 = ppts[ppts.length - 2].y;
    // end point
    var x2 = ppts[ppts.length - 1].x;
    var y2 = ppts[ppts.length - 1].y;
    // end point pen size
    var s = ppts[ppts.length - 1].s;

    // standart rounding
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // draw a line the standart way
    ctx.beginPath();
    ctx.lineWidth = s;
    ctx.strokeStyle = 'black';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

}

// ---------- QUADRATIC CURVE TO ---------- //

var smoothDraw = function() {

    tmp_ctx.beginPath();
    tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

    for (var i = 1; i < ppts.length - 2; i++) {

        if(i != 1) {
            tmp_ctx.beginPath();
            tmp_ctx.moveTo(c1, d1);
        }

        var c1 = (ppts[i].x + ppts[i + 1].x) / 2;
        var d1 = (ppts[i].y + ppts[i + 1].y) / 2;

        tmp_ctx.lineWidth = ppts[i].s;

        tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c1, d1);
        tmp_ctx.stroke();

    }

    // For the last 2 points
    tmp_ctx.beginPath();
    tmp_ctx.moveTo(c1, d1);
    tmp_ctx.lineWidth = ppts[i].s;
    tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, ppts[i + 1].x, ppts[i + 1].y);
    tmp_ctx.stroke();
    tmp_ctx.closePath();

    if(ppts.length > 200) {

        var tempArray =  ppts.slice(-6);

        ctx.drawImage(tmp_canvas, 0, 0);

        ppts = tempArray;

    }

}

// ---------- main draw function --------- //

var onPaint = function() {

    if(!discreteInk) {

        if(mouseDown) {

            // Saving all the points in an array
            ppts.push({x: point.x, y: point.y, s: point.s});

            //----------- IF UP TO 3 POINTS ----------//
            if (ppts.length < 3) {
                var b = ppts[0];
                tmp_ctx.beginPath();
                tmp_ctx.lineWidth = b.s;
                tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2);
                tmp_ctx.fill();
                tmp_ctx.closePath();
                return;
            }

            //-------- IF MORE THAN 3 POINTS -------//

            // Tmp canvas is always cleared up before drawing.
            tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

            if(smoothInk) {
                smoothDraw();
            } else {
                draw();
            }

        }

    } else {

        if(firstDown) {
            // redoState();
            drawLine(ctx, originX, originY, point.x, point.y, point.s);
            drawLine(str_ctx, originX, originY, point.x, point.y, point.s);

        }

    }

};


//------------------------------------------------------------------------//
//------------------------------------------------------------------------//
//-------------------------------- SAVE ----------------------------------//
//------------------------------------------------------------------------//
//------------------------------------------------------------------------//


var savedCanvasCount = 0;
var saveSignature = function() {


    savedCanvasCount = savedCanvasCount + 1;

    var savedCanvas = document.createElement('canvas');
    var savedContext = savedCanvas.getContext('2d');
    var canvasID = 'canvas-' + savedCanvasCount;
    savedCanvas.id = canvasID;
    savedCanvas.width = canvas.width;
    savedCanvas.height = canvas.height;
    // tmp_canvas.setAttribute('position', "absolute");

    var currentCanvasState = ctx.getImageData(0,0,canvas.width,canvas.height);
    // var currentCanvasState = str_ctx.getImageData(0,0,canvas.width,canvas.height);

    savedContext.putImageData(currentCanvasState, 0, 0)

    var storage = document.querySelector('#frame-savedCanvas');
    storage.appendChild(savedCanvas);
    // canvasID = '#' + canvasID;
    // $(convasID).css({'transform':'scale(0.5)'});

}

var showInstructions = false;
var signAbove = function() {

    if(showInstructions) {

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.font = "40px Arial";
        ctx.fillStyle = 'gray';
        ctx.fillText('SIGN ABOVE', 375, 400)
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.moveTo(150, 350);
        ctx.lineTo(850, 350);
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = initialPenSize ;

    }

}

var signAbove2 = function() {



        ctx_signHere.lineCap = 'round';
        ctx_signHere.lineJoin = 'round';

        ctx_signHere.font = "40px Arial";
        ctx_signHere.fillStyle = 'gray';
        ctx_signHere.fillText('SIGN ABOVE', 375, 400)
        ctx_signHere.beginPath();
        ctx_signHere.strokeStyle = 'black';
        ctx_signHere.lineWidth = 5;
        ctx_signHere.moveTo(150, 350);
        ctx_signHere.lineTo(850, 350);
        ctx_signHere.stroke();
        ctx_signHere.closePath();

        ctx_signHere.lineWidth = initialPenSize ;


}


//------------------------------------------------------------------------//
//------------------------------------------------------------------------//
//----------------------------- BUTTONS ----------------------------------//
//------------------------------------------------------------------------//
//------------------------------------------------------------------------//

var saveButton = document.getElementById('saveButton');
var clearButton = document.getElementById('clearButton');

var discreteButton = document.getElementById('discreteButton');
var staticButton = document.getElementById('staticButton');
var dynamicButton = document.getElementById('dynamicButton');
var smoothButton = document.getElementById('smoothButton');


saveButton.onclick = function() {

    saveSignature();

}

clearButton.onclick = function() {

    ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
    str_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
    signAbove();

}

discreteButton.onclick = function() {

    discreteInk = true;
    limitedInk = false;
    smoothInk = 0;

    $('#discreteButton').css({'background-color':'green', 'color':'white'});
    $('#staticButton').css({'background-color':'gray', 'color':'black'});
    $('#dynamicButton').css({'background-color':'gray', 'color':'black'});
    $('#smoothButton').css({'background-color':'gray', 'color':'black'});

}

staticButton.onclick = function() {

    discreteInk = false;
    limitedInk = false;
    mouseDown = false;

    $('#staticButton').css({'background-color':'green', 'color':'white'});
    $('#dynamicButton').css({'background-color':'gray', 'color':'black'});
    $('#discreteButton').css({'background-color':'gray', 'color':'black'});

}

dynamicButton.onclick = function() {

    discreteInk = false;
    limitedInk = true;
    mouseDown = false;

    $('#dynamicButton').css({'background-color':'green', 'color':'white'});
    $('#staticButton').css({'background-color':'gray', 'color':'black'});
    $('#discreteButton').css({'background-color':'gray', 'color':'black'});

}

smoothButton.onclick = function() {

    discreteInk = false;
    $('#discreteButton').css({'background-color':'gray', 'color':'black'});

    smoothInk = 1 - smoothInk;
    // console.log(smoothInk);

    if(smoothInk) {
        $('#smoothButton').css({'background-color':'green', 'color':'white'})
    } else {
        $('#smoothButton').css({'background-color':'gray', 'color':'black'})
    }

}

$('body').keypress(function() {
    if(event.which === 105) {
        showInstructions = 1 - showInstructions;
    }
})


signAbove();
// }());
