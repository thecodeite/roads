define(function () {
  var guidProgress = 1000;

  function Edge (start, end, isTwin) {
    var that = this;
    this.guid = guidProgress++;

    this.start = start;
    this.end = end;

    var sx = this.sx = this.start.x;
    var sy = this.sy = this.start.y;    
    var ex = this.ex = this.end.x;
    var ey = this.ey = this.end.y;

    var dx = ex - sx;
    var dy = ey - sy;

    var realLength = Math.sqrt((dx*dx)+(dy*dy))

    if(isTwin) {
      var offset = 4;
      this.sx = sx + (-dy / realLength * offset);
      this.sy = sy + ( dx / realLength * offset);
      this.ex = ex + (-dy / realLength * offset);
      this.ey = ey + ( dx / realLength * offset);
    }

    this.length = ~~(realLength/6);

    if(this.length < 2) {
      console.log( "Bad edge!" , this);
      throw "Stop";
    }

    this.space = [];

    for(var i=1; i<this.length; i++){
      that.space[i-1] = {
        x: this.sx + ((dx*i)/this.length),
        y: this.sy + ((dy*i)/this.length),
        car: null
      };
    }

    this.start.outbound.push(this);
  };

  Edge.prototype.getInfo = function() {
    return {
      guid: this.guid,
      start: this.start.x+','+this.start.y,
      end: this.end.x+','+this.end.y
    };
  };

  return Edge;
});