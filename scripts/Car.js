define(function () {
  return function Car(link, world) {
    var that = this;

    this.link = link;
    this.progress = 0;

    this.x = link.start.x;
    this.y = link.start.y;
    this.colour = getRandomColor();
    that.currentSpace = link.space[0];

    that.target = world.terminusList[0];
    that.route = pickRoute(that.target);
    that.nextEdgeOnRoute = 1;

    function pickRoute() {

      var bestRoute = {
        route:[],
        length: 999999999
      };
      var currentRoute = [link];

      continueRoute(link)

      console.log(bestRoute);
      return bestRoute.route;

      function continueRoute(currentLink) {
        
        if(currentLink.end == that.target) {
          var newRoute = currentRoute.slice();
          var length = 0;
          newRoute.forEach(function(edge){
            length += edge.length;
          }); 

          if(length < bestRoute.length) {
            bestRoute.length = length;
            bestRoute.route = newRoute;
          }
        }

        var endPoints = currentLink.end.outbound;

        for(var idx in endPoints) {
          var nextLink = endPoints[idx];
          currentRoute.push(nextLink);
          continueRoute(nextLink);
          currentRoute.pop();
        }
      }
    }

    function getRandomColor() {
      var letters = '0123456789A'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    }

    this.tick = function(world) {

      if(that.broken) {
        return;
      }

      if(that.stopped){
        that.stopped = false;
      }

      that.nextProgress = that.progress+1;
      that.nextSpace = that.link.space[this.nextProgress];

      if(that.nextSpace == undefined) {
        
        
        var outbounds = that.link.end.outbound;

        if(outbounds.length === 0){
          
          if(that.link.end.action === 'terminate') {
            that.currentSpace.car = null;
            var i = world.elements.indexOf(that);
            if(i != -1) {
              world.elements.splice(i, 1);
            }
          } 
          return;
        }



        var nextLink = that.route[that.nextEdgeOnRoute];
        var found = outbounds.indexOf(nextLink);

        if(found == -1) {
          console.log('Confused, next link does not exist!');
          that.broken = true;
          return;
        }
        /*
        if(outbounds.length == 1){
          nextLink = outbounds[0];
        } else {
          console.log('Lost! rolling the dice!', that.link );
          nextLink = outbounds[~~(Math.random() * outbounds.length)];
        }
        */

        if(!nextLink.space[0].car){
          that.link = nextLink;
          that.nextProgress = 0;
          that.nextSpace = nextLink.space[0];
          that.nextEdgeOnRoute++;
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
