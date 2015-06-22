define(["Car", "Node"], function (Car, Node) {
  
  function Source (node) {
    Node.call(this, node);

    this.destination = node.destination;
    this.colour = "#00FF00";
    this.generated = 0;

    this.addProperty('generated', 'number', false);
  }

  Source.prototype = Object.create(Node.prototype);
  Source.prototype.constructor = Source;
  
  
  /*
  Source.prototype.getInfo = function() {
    var info = Node.prototype.getInfo.call(this);

    info.generated = this.generated;
    return info;
  }
  */

  Source.prototype.tick = function(world) {
    if(this.generated > 0){
      this.generated--;
      return;
    }

    if(Math.random() < 0) {
      return;
    }

    if(!this.car) { 
      world.elements.push(new Car(this, world, this.destination));
      this.generated = 5; ///Math.random()*10;
    }
  };

  return Source;
});