define(function () {
  return function Node (x, y) {
    this.x = x;
    this.y = y;
    this.outbound=[];
  };
});