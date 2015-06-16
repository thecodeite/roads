define(["Car"], function (Car) {
  return function Source (node) {
    var that = this;
    this.x = node.x;
    this.y = node.y;
    this.destination = node.destination;



    this.outbound=[];
    this.colour = "#0F0";
    this.generated = 0;
    this.car = null;

    this.tick = function(world){
      if(that.generated > 0){
        that.generated--;
        return;
      }

      if(Math.random() < 0) {
        return;
      }

      if(!that.car ){ 
        world.elements.push(new Car(that, world, that.destination));
        that.generated = 5; ///Math.random()*10;
      }
    };
  };
});