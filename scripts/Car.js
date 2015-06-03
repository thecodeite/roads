define(function () {
  return function Car(link) {
    var that = this;
    this.link = link;
    this.progress = 0;

    this.x = link.start.x;
    this.y = link.start.y;
    this.colour = "#990";

    this.tick = function(world) {

      var thisSpace = that.link.space[that.progress];

      var nextProgress = that.progress+1;
      var nextSpace = that.link.space[nextProgress];
    
      if(nextSpace == null) {
        
        
        var outbounds = that.link.end.outbound;

        if(outbounds.length == 0){
          if(that.link.end.action == 'terminate'){
             var i = world.elements.indexOf(that);
            if(i != -1) {
              world.elements.splice(i, 1);
            }
          }
          return;
        }

        var nextLink = outbounds[~~(Math.random() * outbounds.length)];
        
        if(nextLink.space[0].car == null){
          that.link = nextLink;
          nextProgress = 0;
          nextSpace = nextLink.space[0];
        }
      }

     

      if(nextSpace && nextSpace.car == null) {

        thisSpace.car = null;
        nextSpace.car = that;
        that.x = nextSpace.x;
        that.y = nextSpace.y;
        that.progress = nextProgress;
      }
    };
  }
});
