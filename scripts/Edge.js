define(function () {
  return function Edge (start, end) {
    var that = this;

    this.start = start;
    this.end = end;

    var dx = that.end.x - that.start.x;
    var dy = that.end.y - that.start.y;
    this.length = ~~(Math.sqrt((dx*dx)+(dy*dy))/6);

    if(this.length < 2) {
      console.log( "Bad edge!" , this);
      throw "Stop";
    }

    this.space = [];

    for(var i=1; i<this.length; i++){
      that.space[i-1] = {
        x: that.start.x + ((dx*i)/this.length),
        y: that.start.y + ((dy*i)/this.length),
        car: null
      };
    }

    this.start.outbound.push(this);
  };
});