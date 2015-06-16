define(function () {
  return function Terminus (node) {

    this.x = node.x;
    this.y = node.y;
    this.name = node.name;
    this.outbound=[];
    this.action = 'terminate';
    this.colour = node.colour || "#F00";
  };
});
