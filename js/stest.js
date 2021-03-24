
// import html2canvas from 'html2canvas';
$('.yoyo').css({'transition':'0s', 'font-size':'40px'});


// initiating sketchpad
var sketchpad = new Sketchpad({
  element: '#sketchpad',
  width: 800,
  height: 400,
});

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


        L = 15;
        k = 0.022;
        i = 2;
        x0 = -100;



        size = (L / (1 + Math.exp(-k * (-v-x0))) ) + i;

        // size = Math.ceil(size);

        return size;

    } else {

        return 10;

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

var increaseIncrement = 0.6;
var increaseIncrement2 = 0.5;
var decreaseIncrement = 0.6;

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
    console.log('current size: ' + current);
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

            // console.log('linear speed: ' + v);
            // console.log('size: ' + s);

        } else {

            calibrationOn = true;
            myPenSize = sketchpad.penSize;
            convert(myPenSize, 13);
            // console.log('inactive pen converting to original size');
            // console.log('size: ' + sketchpad.penSize);

        }

    } else {
        sketchpad.penSize = 11;
    }

    // debug view
    // $('#myPenSize').html('size: ' + s);
    // $('#velocity').html('linear speed: ' + v);
    // $('#velocityX').html('x: ' + velocity.velocityX());
    // $('#velocityY').html('y: ' + velocity.velocityY());


};


update(new MouseSpeed.Velocity());


new MouseSpeed({ selector: '.frame-A-1', velocityOnMouseDownOnly: true, handler: update })

var testing;



var myStore = function() {

    $('.frame-A-1').css({'transition':'0s', 'border':'0'});
    $('#sketchpad').css({'transition':'0s', 'margin-top':'80px'});

    setTimeout(()=>{
        var myCanvas = document.getElementById('canvasDivId');

        html2canvas(myCanvas).then(function(canvas) {
            var storage = document.getElementById('myStorageDiv');
            storage.appendChild(canvas);
            console.log(canvas);
            testing = canvas;
        });
    }, 5)


    setTimeout(()=>{
        $('.frame-A-1').css({'transition':'0s', 'border':'3px solid black'})
        $('#sketchpad').css({'transition':'0s', 'margin-top':'0px'});
    }, 10)

}


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



var saveButton = document.getElementById('saveButton');
var clearButton = document.getElementById('clearButton');


saveButton.onclick = function() {

    myStore();

}

clearButton.onclick = function() {

    sketchpad.clear();

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

// var dynamicColor = function(context) {
//
//     if(firstDown) {
//         context.strokeStyle = 'black';
//     }
//
//     if(secondDown) {
//          context.strokeStyle = 'red';
//     }
//
// }



function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  // dynamicColor(context);
  context.strokeStyle = 'black';
  // context.strokeStyle = 'black';
  context.lineWidth = 10;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
