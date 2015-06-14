define(["Car"], function (Car) {
  return function Source (x, y) {
    var that = this;
    this.x = x;
    this.y = y;
    this.outbound=[];
    this.colour = "#0F0";
    this.generated = false;

    this.tick = function(world){
      if(that.generated){
        return;
      }

      if(Math.random() < 0) {
        return;
      }

      var route = that.outbound[~~(Math.random() * that.outbound.length)];
      
      if(route && route.space[0] && !route.space[0].car){ 
        world.elements.push(new Car(route, world));
        that.generated = true;
      }
    };
  };
});