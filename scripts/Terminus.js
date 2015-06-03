define(function () {
  return function Terminus (x, y) {

    this.x = x;
    this.y = y;
    this.outbound=[];
    this.action = 'terminate';
    this.colour = "#F00";
  };
});
