define(["Node"], function (Node) {
  function Terminus (node) {
    Node.call(this, node);
    
    this.action = 'terminate';
    this.colour = node.colour || "#F00";
  };

  Terminus.prototype = Object.create(Node.prototype);
  Terminus.prototype.constructor = Terminus;

  return Terminus;
});
