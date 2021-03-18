


setTimeout(()=>{
    $('.yoyo').css({'transition':'2s', 'font-size':'40px'});
}, 5000)

var sketchpad = new Sketchpad({
  element: '#sketchpad',
  width: 800,
  height: 400,
});

var myPenSize;

var dynamicPenSize = true;

var v2S = function(v) {

    if(dynamicPenSize) {

        var L, k, i, x0, size;

        // parameter values
        L = 15;
        k = 0.005;
        i = 5;
        x0 = -800;

        size = (L / (1 + Math.exp(-k * (-v-x0))) ) + i;

        size = Math.ceil(size);

        return size;

    } else {

        return 10;

    }

}



var update = function(velocity) {
    var v = velocity.velocity();
    var s = v2S(v);
    // console.log(v2S(v));
    // console.log(typeof(v));
    $('#myPenSize').html('size: ' + s);
    sketchpad.penSize = s;
    $('#velocity').html('linear speed: ' + v);
    $('#velocityX').html('x: ' + velocity.velocityX());
    $('#velocityY').html('y: ' + velocity.velocityY());


};


update(new MouseSpeed.Velocity());


new MouseSpeed({ selector: '.frame-A1', velocityOnMouseDownOnly: true, handler: update })
