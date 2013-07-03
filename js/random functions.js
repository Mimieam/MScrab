Flipsnap.prototype._animate = function(x, transitionDuration , y-direction) {
  var self = this;
  var elem = self.element;
  var begin = +new Date();
  (y-direction == 1) ? var from = parseInt(elem.style.top, 10) : var from = parseInt(elem.style.left, 10);
  var to = x;
  var duration = parseInt(transitionDuration, 10);
  var easing = function(time, duration) {
    return -(time /= duration) * (time - 2);
  };
  var timer = setInterval(function() {
    var time = new Date() - begin;
    var pos, now;
    if (time > duration) {
      clearInterval(timer);
      now = to;
    }
    else {
      pos = easing(time, duration);
      now = pos * (to - from) + from;
    }
    (y-direction == 1) ? 
    elem.style.top = now + "px":
    elem.style.left = now + "px";
  }, 10);
};



  // this.printUsedTile = function (argument) {
  //  var currChip="";
  //  for (var i = this.usedChip.length - 1; i >= 0; i--) {
  //    currChip +=" "+ $(this.usedChip[i]).html();
  //  }
  //  return currChip;
  // };