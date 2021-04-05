
// import html2canvas from 'html2canvas';
$('.yoyo').css({'transition':'0s', 'font-size':'40px'});


// initiating sketchpad
var sketchpad = new Sketchpad({
    element: '#sketchpad',
    width: 800,
    height: 400,
});

var sliderPenSize = 15;

var sizeSlider = document.getElementById('penSizeSlider');
sizeSlider.oninput = function() {

    sliderPenSize = parseFloat(sizeSlider.value);

}

var myPenSize;

// if false, static penSize of 10
var dynamicPenSize = true;

// function to convert speed to penSize
var v2S = function(v) {

    if(dynamicPenSize) {

        var L, k, i, x0, size;

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


        // L = 15;
        L = sliderPenSize * 2;
        k = 0.022;
        i = 2;
        x0 = -100;



        size = (L / (1 + Math.exp(-k * (-v-x0))) ) + i;

        // size = Math.ceil(size);

        return size;

    } else {

        return sliderPenSize;

    }

}

myMouseDown = false;

$('body').mousedown(function(e) {
    if (e.button === 0) {
        myMouseDown = true;
        // console.log(123123);
    }
});


$('body').mouseup(function(e) {
    if (e.button === 0) {
        myMouseDown = false;
        // console.log('asdasdasdas');
    }
});

var staticPenSize = 0;

$('body').keypress(function() {
    if(event.which === 13) {
        staticPenSize = 1 - staticPenSize;
    }
    console.log(event.which);
})

var increaseIncrement = 0.5;
var increaseIncrement2 = 1;//0.5;
var decreaseIncrement = 0.65;

// var increaseRatio = 1.2;
// var decreaseRatio = 0.75;

var increase = function() {

    sketchpad.penSize = sketchpad.penSize + increaseIncrement;
    // sketchpad.penSize = sketchpad.penSize * increaseRatio;

}

var increase2 = function() {

    sketchpad.penSize = sketchpad.penSize + increaseIncrement2;
    // sketchpad.penSize = sketchpad.penSize * increaseRatio;

}


var decrease = function() {

    sketchpad.penSize = sketchpad.penSize - decreaseIncrement;
    // sketchpad.penSize = sketchpad.penSize * decreaseRatio;

}


var calibrationOn = false;

var convert = function(current, goal) {

    // console.log('conversion function');
    //
    // console.log('current size: ' + current);
    // console.log('goal size: ' + goal);

    if(goal > current) {

        // console.log('increasing current pensize');

        if(!calibrationOn) {
            increase();
        } else {
            increase2();
        }


    } else if (current > goal) {

        // console.log('decreasing current pensize');

        decrease();

    } else {

        // console.log('***DO NOTHING***');
        // when equal do nothing
    }

}

// updating penSize depending on
var update = function(velocity) {

    if(!staticPenSize) {

        calibrationOn = false;

        if(myMouseDown) {

            var v = velocity.velocity();
            var s = v2S(v);
            myPenSize = sketchpad.penSize;
            convert(myPenSize, s);
            // sketchpad.penSize = s;

            console.log('linear speed: ' + v);
            console.log('size: ' + s);

        } else {

            calibrationOn = true;
            myPenSize = sketchpad.penSize;
            convert(myPenSize, sliderPenSize);
            // console.log('inactive pen converting to original size');
            // console.log('size: ' + sketchpad.penSize);

        }

    } else {
        sketchpad.penSize = sliderPenSize;
    }

    // debug view
    // $('#myPenSize').html('size: ' + s);
    // $('#velocity').html('linear speed: ' + v);
    // $('#velocityX').html('x: ' + velocity.velocityX());
    // $('#velocityY').html('y: ' + velocity.velocityY());


};

sliderPenSize = 10;
sketchpad.penSize = sliderPenSize;

update(new MouseSpeed.Velocity());


new MouseSpeed({ selector: '.frame-A-1', velocityOnMouseDownOnly: true, handler: update })

var testing;
var signComplexity;

// storing canvas and displaying it underneat
var myStore = function() {

    if(signComplexity === 0) {

        $('.frame-B-1').css({'transition':'0s', 'border':'0'});
        $('#discretePad').css({'transition':'0s', 'margin-top':'120px'});

        setTimeout(()=>{

            var myCanvas = document.getElementById('canvasDivId2');

            html2canvas(myCanvas).then(function(canvas) {
                var storage = document.getElementById('myStorageDiv');
                canvas.setAttribute('style', 'margin-top:20px;height:406px;width:808px;');
                storage.appendChild(canvas);
                console.log(canvas);
                testing = canvas;
            });

        }, 1)

        setTimeout(()=>{

            $('.frame-B-1').css({'transition':'0s', 'border':'3px solid black'})
            $('#discretePad').css({'transition':'0s', 'margin-top':'0px'});

        }, 2)

    } else {


        $('.frame-A-1').css({'transition':'0s', 'border':'0'});
        $('#sketchpad').css({'transition':'0s', 'margin-top':'120px'});

        setTimeout(()=>{

            var myCanvas = document.getElementById('canvasDivId');

            html2canvas(myCanvas).then(function(canvas) {
                var storage = document.getElementById('myStorageDiv');
                storage.appendChild(canvas);
                console.log(canvas);
                testing = canvas;
            });

        }, 1)

        setTimeout(()=>{

            $('.frame-A-1').css({'transition':'0s', 'border':'3px solid black'})
            $('#sketchpad').css({'transition':'0s', 'margin-top':'0px'});

        }, 2)

    }

}

// optsion to save the canvas on computer
var storeCanvas = function() {

    var container = document.getElementById('sketchpad');
    var container = document.getElementById('canvasDivId'); //specific element on page
    // var container = document.body; // full page
    html2canvas(container).then(function(canvas) {
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "html_image.png";
        link.href = canvas.toDataURL("image/png");
        link.target = '_blank';
        link.click();
    })

}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var staticPenSize_C = false;
var penSize_C = 15;
var penSize_C_storage = penSize_C;
var penSize_C_initial = penSize_C;

var increaseIncrement_C = 0.5;
var increaseIncrement2_C = 1;//0.5;
var decreaseIncrement_C = 0.65;

// var increaseRatio = 1.2;
// var decreaseRatio = 0.75;

var increase_C = function() {

    penSize_C = penSize_C + increaseIncrement_C;
    // penSize_C = penSize_C * increaseRatio;

}

var increase2_C = function() {

    penSize_C = penSize_C + increaseIncrement2_C;
    // penSize_C = penSize_C * increaseRatio;

}


var decrease_C = function() {

    penSize_C = penSize_C - decreaseIncrement_C;
    // penSize_C = penSize_C * decreaseRatio;

}


var calibrationOn_C = false;

var convert_C = function(current, goal) {

    // console.log('conversion function');
    //
    // console.log('current size: ' + current);
    // console.log('goal size: ' + goal);

    if(goal > current) {

        // console.log('increasing current pensize');

        if(!calibrationOn_C) {
            increase_C();
        } else {
            increase2_C();
        }


    } else if (current > goal) {

        // console.log('decreasing current pensize');

        decrease_C();

    } else {

        // console.log('***DO NOTHING***');
        // when equal do nothing
    }

}

// updating penSize depending on
var update_C = function(velocity) {

    if(!staticPenSize_C) {

        calibrationOn_C = false;

        if(myMouseDown) {




            var v = velocity.velocity();
            var s = v2S(v);
            penSize_C_storage = penSize_C;
            convert_C(penSize_C_storage, s);
            // sketchpad.penSize = s;


            // console.log('linear speed: ' + v);
            // console.log('size: ' + s);

        } else {

            calibrationOn_C = true;
            penSize_C_storage = penSize_C;
            convert_C(penSize_C_storage, penSize_C_initial);
            // console.log('inactive pen converting to original size');
            // console.log('size: ' + sketchpad.penSize);

        }

    } else {
        penSize_C = penSize_C_initial;
    }

    // debug view
    // $('#myPenSize').html('size: ' + s);
    // $('#velocity').html('linear speed: ' + v);
    // $('#velocityX').html('x: ' + velocity.velocityX());
    // $('#velocityY').html('y: ' + velocity.velocityY());


};

update_C(new MouseSpeed.Velocity());


new MouseSpeed({ selector: '.frame-C-1', velocityOnMouseDownOnly: true, handler: update_C })




// When true, moving the mouse draws on the canvas
let isDrawing_C = false;
let x_C = 0;
let y_C = 0;

const myContinousPad = document.getElementById('continuousPad');
const contextContiniuous = myContinousPad.getContext('2d');

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
myContinousPad.addEventListener('mousedown', e => {
    x_C = e.offsetX;
    y_C = e.offsetY;
    isDrawing_C = true;
});

myContinousPad.addEventListener('mousemove', e => {
    if (isDrawing_C === true) {
        drawLine_C(contextContiniuous, x_C, y_C, e.offsetX, e.offsetY);
        x_C = e.offsetX;
        y_C = e.offsetY;
    }
});

window.addEventListener('mouseup', e => {
    if (isDrawing_C === true) {
        drawLine_C(contextContiniuous, x_C, y_C, e.offsetX, e.offsetY);
        x_C = 0;
        y_C = 0;
        isDrawing_C = false;
    }
});

var dx, dy;
var xdx, ydy;
var xdx2, ydy2;
var xdx3, ydy3;
var alpha = 0.25;

function drawLine_C(context, x1, y1, x2, y2) {
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();
    context.strokeStyle = 'black';

    context.lineWidth = penSize_C;
    console.log('*****************************************');
    // console.log('pensize c: ' + penSize_C);
    // context.lineWidth = 10;

    dx = x1 - x2;
    dy = y1 - y2;
    xdx = x1 - (alpha * dx);
    ydy = y1 - (alpha * dy);
    xdx2 = xdx - (alpha * dx);
    ydy2 = ydy - (alpha * dy);
    xdx3 = xdx2 - (alpha * dx);
    ydy3 = ydy2 - (alpha * dy);

    // xdx = (x1 + x2) / 2;
    // ydy = (y1 + y2) / 2;

    context.moveTo(x1, y1);
    // context.lineTo(x2, y2);
    // context.lineTo(xdx, ydy);
    console.log('x1, y1 : ' + x1 +', ' + y1);
    console.log('xdx, ydy : ' + xdx +', ' + ydy);
    console.log('xdx2, ydy2 : ' + xdx2 +', ' + ydy2);
    console.log('xdx3, ydy3 : ' + xdx3 +', ' + ydy3);
    console.log('x2, y2 : ' + x2 +', ' + y2);
    console.log('*****************************************');

    context.quadraticCurveTo(x1, y1, xdx, ydy);
    context.quadraticCurveTo(xdx, ydy, xdx2, ydy2);
    context.quadraticCurveTo(xdx2, ydy2, xdx3, ydy3);
    context.quadraticCurveTo(xdx3, ydy3, x2, y2);

    context.stroke();
    context.closePath();
}


var generateCoordinateArray = function(startX, startY, endX, endY) {

    var increment;
    increment = 0.1;

    var myArray = [];

    var point = {};
    point.x = startX;
    point.y = startY;

    myArray.push(point);



}







////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



// When true, moving the mouse draws on the canvas
let isDrawing = false;
let x = 0;
let y = 0;

const myPics = document.getElementById('discretePad');
const context = myPics.getContext('2d');

const emptyDiscreteCanvas =  myPics.getContext('2d');
const emptyCanvas = emptyDiscreteCanvas.getImageData(0,0,myPics.width,myPics.height);







var previousCanvasState;

var storeState = function() {

    previousCanvasState = context.getImageData(0,0,myPics.width,myPics.height);

}

var refreshState = function() {

    context.putImageData(previousCanvasState, 0, 0);

}




// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
var firstDown = 0;
var secondDown = 0;
var mouseDownCounter = 0;
var originX = 0;
var originY = 0;




myPics.addEventListener('mousedown', e => {

    mouseDownCounter = mouseDownCounter + 1;
    if(mouseDownCounter % 2 === 1) {
        firstDown = 1;
        secondDown = 0;
    } else {
        firstDown = 0;
        secondDown = 1;
    }

    x = e.offsetX;
    y = e.offsetY;

    if(firstDown) {
        originX = e.offsetX;
        originY = e.offsetY;
        storeState();
    }

    if(secondDown) {
        // originX = e.offsetX;
        // originY = e.offsetY;
        storeState();
    }

    isDrawing = true;

});

myPics.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        if(firstDown) {
            refreshState();
            drawLine(context, originX, originY, e.offsetX, e.offsetY);
            // x = e.offsetX;
            // y = e.offsetY;
        }

    }
});



window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        if(firstDown) {
            // refreshState();
            // drawLine(context, originX, originY, e.offsetX, e.offsetY);
        }

        if(secondDown) {
            // drawLine(context, x, y, e.offsetX, e.offsetY);
            // x = 0;
            // y = 0;
            isDrawing = false;
        }


    }
});





function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    // dynamicColor(context);
    context.strokeStyle = 'black';
    // context.strokeStyle = 'black';
    context.lineWidth = sliderPenSize;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}


//
// const myStoredSP = document.getElementById('sketchpad');
// const storedSPContest = myStoredSP.getContext('2d');
// previousCanvasState2 = storedSPContest.getImageData(0,0,myStoredSP.width,myStoredSP.height);
// storedSPContest.putImageData(previousCanvasState2, 0, 0);



//////////////////////////////////////////////////////////////////////////////



var saveButton = document.getElementById('saveButton');
var clearButton = document.getElementById('clearButton');

var discreteButton = document.getElementById('discreteButton');
var staticButton = document.getElementById('staticButton');
var dynamicButton = document.getElementById('dynamicButton');



saveButton.onclick = function() {

    myStore();

}

clearButton.onclick = function() {

    if(signComplexity === 0) {
        context.putImageData(emptyCanvas, 0, 0);
    } else {
        sketchpad.clear();
    }


}

discreteButton.onclick = function() {

    signComplexity = 0;

    $('.frame-A-1').css({'display':'none'});
    $('.frame-B-1').css({'display':'block'});
    staticPenSize = 1;

}

staticButton.onclick = function() {

    signComplexity = 1;

    $('.frame-A-1').css({'display':'block'});
    $('.frame-B-1').css({'display':'none'});
    staticPenSize = 1;

}

dynamicButton.onclick = function() {

    signComplexity = 2;

    $('.frame-A-1').css({'display':'block'});
    $('.frame-B-1').css({'display':'none'});
    staticPenSize = 0;

}
