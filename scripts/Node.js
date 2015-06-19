define(function () {
  function Node (nodeDetails) {
    this.x = nodeDetails.x;
    this.y = nodeDetails.y;
    this.car = null;
    this.outbound=[];
    this.colour = "#000";
  };

  Node.prototype.getInfo = function() {
    return {
      x: this.x,
      y: this.y,
      colour: this.colour,
      id: this.id,
      a: [1]
    };
  };


  return Node;
});