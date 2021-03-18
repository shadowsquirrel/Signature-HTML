


setTimeout(()=>{
    $('.yoyo').css({'transition':'2s', 'font-size':'40px'});
}, 5000)

var sketchpad = new Sketchpad({
  element: '#sketchpad',
  width: 400,
  height: 400,
});

var myPenSize;

var v2S = function(v) {

    var L, k , x0, size;

    // parameter values
    L = 20;
    k = 0.01;
    x0 = -295;

    size = L / (1 + Math.exp(-k * (-v-x0)));



    return size;

}



var update = function(velocity) {
    var v = velocity.velocity();
    // console.log(v2S(v));
    // console.log(typeof(v));
    $('#myPenSize').html('size: ' + v2S(v));
    $('#velocity').html('linear speed: ' + v);
    $('#velocityX').html('x: ' + velocity.velocityX());
    $('#velocityY').html('y: ' + velocity.velocityY());


};


update(new MouseSpeed.Velocity());


new MouseSpeed({ selector: '.frame-A1', velocityOnMouseDownOnly: true, handler: update })
