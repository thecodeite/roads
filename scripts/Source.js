define(["Car"], function (Car) {
  return function Source (x, y) {
    var that = this;
    this.x = x;
    this.y = y;
    this.outbound=[];
    this.colour = "#0F0";
    this.tick = function(world){
      if(Math.random() > 0.90){
        var route = that.outbound[~~(Math.random() * that.outbound.length)];

        world.elements.push(new Car(route))
      }
    }
  }
});