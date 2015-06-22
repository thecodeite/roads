
define(["Node"], function (Node) {
  function Terminus (node) {
    Node.call(this, node);
    
    this.action = 'terminate';
    this.colour = node.colour || "#FF0000";
  };

  Terminus.prototype = Object.create(Node.prototype);
  Terminus.prototype.constructor = Terminus;

  return Terminus;
});
