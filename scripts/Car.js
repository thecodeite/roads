define(function () {
  return function Car(link) {
    var that = this;

    this.link = link;
    this.progress = 0;

    this.x = link.start.x;
    this.y = link.start.y;
    this.colour = getRandomColor();
    that.currentSpace = link.space[0];

    function getRandomColor() {
      var letters = '0123456789A'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    }

    this.tick = function(world) {

      if(that.stopped){
        that.stopped = false;
      }

      that.nextProgress = that.progress+1;
      that.nextSpace = that.link.space[this.nextProgress];

      if(that.nextSpace == undefined) {
        
        
        var outbounds = that.link.end.outbound;

        if(outbounds.length === 0){
          
          if(that.link.end.action === 'terminate'){
             var i = world.elements.indexOf(that);
            if(i != -1) {
              world.elements.splice(i, 1);
            }
          } 
          return;
        }



        var nextLink;
        if(outbounds.length == 1){
          nextLink = outbounds[0];
        } else {
          console.log('rolling the dice!', that.link );
          nextLink = outbounds[~~(Math.random() * outbounds.length)];
        }
        
        if(!nextLink.space[0].car){
          that.link = nextLink;
          that.nextProgress = 0;
          that.nextSpace = nextLink.space[0];
        }
      }
    };

    this.tick2 = function(world){

      if(that.nextSpace && that.nextSpace.car == null) {

        that.currentSpace.car = null;
        that.nextSpace.car = that;
        that.currentSpace = that.nextSpace;
        that.x = that.nextSpace.x;
        that.y = that.nextSpace.y;
        that.progress = that.nextProgress;
      } else {
        that.stopped = true;
      }
    };
  };
});
