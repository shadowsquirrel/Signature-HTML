
// import html2canvas from 'html2canvas';

$('.yoyo').css({'transition':'0s', 'font-size':'40px'});
setTimeout(()=>{
}, 5000)

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

        // L = 540;
        // k = 0.0013;
        // i = -1.7;
        // x0 = 3000;

        // L = 13.5;
        // k = 0.024;
        // i = 0.5;
        // x0 = -640;

        L = 5;
        k = 0.024;
        i = 6;//4.8;
        x0 = -640;


        size = (L / (1 + Math.exp(-k * (-v-x0))) ) + i;

        size = Math.ceil(size);

        return size;

    } else {

        return 10;

    }

}


// updating penSize depending on
var update = function(velocity) {

    var v = velocity.velocity();
    var s = v2S(v);
    sketchpad.penSize = s;

    // debug view
    $('#myPenSize').html('size: ' + s);
    $('#velocity').html('linear speed: ' + v);
    $('#velocityX').html('x: ' + velocity.velocityX());
    $('#velocityY').html('y: ' + velocity.velocityY());


};


update(new MouseSpeed.Velocity());


new MouseSpeed({ selector: '.frame-A-1', velocityOnMouseDownOnly: true, handler: update })



var myStore = function() {

    $('.frame-A-1').css({'transition':'0s', 'border':'0'});
    $('#sketchpad').css({'transition':'0s', 'margin-top':'80px'});

    setTimeout(()=>{
        var myCanvas = document.getElementById('canvasDivId');

        html2canvas(myCanvas).then(function(canvas) {
            var storage = document.getElementById('myStorageDiv');
            storage.appendChild(canvas);
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
