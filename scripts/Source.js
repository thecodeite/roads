define(["Car"], function (Car) {
  return function Source (x, y) {
    var that = this;
    this.x = x;
    this.y = y;
    this.outbound=[];
    this.colour = "#0F0";
    this.generated = false;

    this.tick = function(world){
      var route = that.outbound[~~(Math.random() * that.outbound.length)];
      
      if(route && route.space[0] && !route.space[0].car && Math.random() > 0.8){ 
        world.elements.push(new Car(route));
        this.generated = true;
      }
    };
  };
});