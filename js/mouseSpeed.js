var MouseSpeed = function(config) {
  var updateInterval = 50;
  var velocity = new MouseSpeed.Velocity();
  var timerToken;
  var mousedown = !config.velocityOnMouseDownOnly;

  if (config.velocityOnMouseDownOnly) {
    $('body').mouseup(function(e) { if (e.button === 0) { mousedown = false; } });
    $('body').mousedown(function(e) { if (e.button === 0) { mousedown = true; } });
  }

  $(config.selector).mousemove(function(e) {
    velocity.setPoint(new MouseSpeed.Point(e.pageX, e.pageY));
  });

  var update = function() {
    velocity.mark();
    if (!mousedown) {
      velocity.setPoint();
    }
    config.handler.call(this, velocity);
  };

  var start = function() {
      $('body').on('mouseover', stopper);
      timerToken = setInterval(update, updateInterval);
  };

  var stopper = function(e) {
      var body = $('body')[0];
      var el = $(e.target);
      var found = false;

      while (!found && el[0] !== body) {
        found = el.is(config.selector);
        el = $(el[0].parentNode);
      }

      if (!found) {
        clearTimeout(timerToken);
        $('body').off('mouseover', stopper);
        $(config.selector).one('mouseover', start);
        velocity.setPoint();
        update();
      }
  };

  $(config.selector).one('mouseover', start);
};

MouseSpeed.Point = function(x, y) {

  var pointX = x;
  var pointY = y;

  return {
    get: function() {
      var point = [pointX, pointX];
      point.x = pointX;
      point.y = pointX;
      return point;
    },

    set: function(x, y) {
      pointX = x;
      pointY = y;
    },

    getX: function(x) {
      return pointX;
    },

    getY: function(y) {
      return pointY;
    },

    setX: function(x) {
      pointX = x;
    },

    setY: function(y) {
      pointY = y;
    }
  }
};

MouseSpeed.Velocity = function(point) {

  var p1 = point;
  var p2 = p1;
  var t1 = new Date().getTime();
  var t2 = t1;
  var marked = null;

  var calcVelocity = function(coord1, coord2) {
    return ((coord1 - coord2) / (t1 - t2)) * 1000;
  };

  return {
    velocityX: function() {
      if (!p1 || !p2) { return 0; }
      return Math.round(calcVelocity(p1.getX(), p2.getX()));
    },

    velocityY: function() {
      if (!p1 || !p2) { return 0; }
      return Math.round(calcVelocity(p1.getY(), p2.getY()));
    },

    velocity: function() {
      if (!p1 || !p2) { return 0; }
      var vx = calcVelocity(p1.getX(), p2.getX()),
          vy = calcVelocity(p1.getY(), p2.getY());
      return Math.round(Math.sqrt((vx * vx) + (vy * vy)));
    },

    setPoint: function(p) {
      p2 = p1;
      t2 = t1;
      p1 = p;
      t1 = new Date().getTime();
      marked = null;
    },

    mark: function() {
      var now = new Date().getTime();
      if (marked && marked + 100 < now) {
        this.setPoint();
      }
      marked = marked || now;
    }
  }
}

// var update = function(velocity) {
//   $('#velocity').html('linear: '+velocity.velocity());
//   $('#velocityX').html('x: '+velocity.velocityX());
//   $('#velocityY').html('y: '+velocity.velocityY());
// };
//
// update(new MouseSpeed.Velocity());
//
// new MouseSpeed({ selector: '.adiv', velocityOnMouseDownOnly: true, handler: update });
