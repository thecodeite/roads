define(function () {
  return function Edge (start, end) {
    var that = this;

    this.start = start;
    this.end = end;

    var dx = that.end.x - that.start.x;
    var dy = that.end.y - that.start.y;
    this.length = ~~(Math.sqrt((dx*dx)+(dy*dy))/10);

    this.space = [];

    for(var i=0; i<this.length; i++){
      that.space[i] = {
        x: that.start.x + ((dx*i)/this.length),
        y: that.start.y + ((dy*i)/this.length),
        car: null
      };
    }

    this.start.outbound.push(this);
  }
});