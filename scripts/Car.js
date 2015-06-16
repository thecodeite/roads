define(["Dijkstra"], function (Dijkstra) {
  return function Car(startNode, world, targetName) {
    var that = this;
    

    this.edge = null;
    this.node = startNode;
    startNode.car = this;

    this.progress = 0;

    this.x = startNode.x;
    this.y = startNode.y;
    this.colour = getRandomColor();
    that.currentSpace = startNode;

    

    that.target = pickTarget();
    that.colour = that.target.colour;

    function pickTarget() {
      
      if(typeof(targetName) == 'string') {
        var term =  world.terminusList.find(function(t){
          if(t.name === targetName){
            return t;
          }
        });

        if(term) return term;
      } else if(targetName && targetName.constructor === Array) {
        var targets = [];
        targetName.forEach(function(tName){
          var term =  world.terminusList.find(function(t){
            if(t.name === tName){
              return t;
            }
          });

          if(term) targets.push(term);
        });
        //console.log('targets', targets)

        if(targets.length > 0) {
          var picketTarget = targets[~~(Math.random() * targets.length)];
          //console.log('picketTarget', picketTarget);
          return picketTarget
        }
      }

      return world.terminusList[~~(Math.random() * world.terminusList.length)];
    }

   var total = 0;
    //that.route = pickRoute(that.target);
    var dijkstra = new Dijkstra(world);
    that.route = dijkstra.routeBetween(startNode, that.target);
    that.nextEdgeOnRoute = 0;
 

    function pickRoute() {

      var bestRoute = {
        route:[],
        length: 999999999
      };
      var currentRoute = [];
      var nodesVisited = [];

      var depth = 0;
      continueRoute(startNode)

      //console.log(bestRoute);
      //console.log('car created');
      return bestRoute.route;
     

      function continueRoute(currentNode) {
        if(nodesVisited.indexOf(currentNode) != -1){
          return;
        }
        nodesVisited.push(currentNode);


        console.log('continueRoute', depth, total++);

        if(total > 10000){
            throw('TOOOO Deep!');
          }
        if(currentNode == that.target) {
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

        var endPoints = currentNode.outbound;

        for(var idx in endPoints) {
          var nextLink = endPoints[idx];
          
          if(currentRoute.indexOf(nextLink) != -1){
            break;
          }

          currentRoute.push(nextLink);
          depth++;
          if(depth > 100){
            throw('TOOOO Deep!');
          }
          //console.log(depth);
          if(nextLink.end){
            continueRoute(nextLink.end);
          }
          depth--;
          currentRoute.pop();
        }
        nodesVisited.pop();
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
        return;
      }

      if(that.node) {
        //console.debug('On node', that.node);

        if(that.node.action === 'terminate') {
          that.node.car = null;
          var i = world.elements.indexOf(that);
          if(i != -1) {
            world.elements.splice(i, 1);
          }
          return;
        }

        if(that.node.outbound.length === 0) {
          return;
        }

        //console.log(that.route);
        var edgeToMoveTo = that.route[that.nextEdgeOnRoute];
        var found = that.node.outbound.indexOf(edgeToMoveTo);

        if(found == -1) {
          console.log('Confused, next edge does not exist!');
          //that.broken = true;
          //return;
          edgeToMoveTo = that.node.outbound[~~(Math.random() * that.node.outbound)];
        }

        var space = edgeToMoveTo.space[0];

        if(space.car) {
          //console.debug('Cant move to space, its full');
          that.stopped = true;
          return;
        } else {
          that.nextEdgeOnRoute++;
          space.car = that;
          that.x = space.x;
          that.y = space.y;
          that.progress = 0;

          that.node.car = null;
          that.node = null;
          that.edge = edgeToMoveTo;
        }
      } else if(that.edge) {
        var nextProgress = that.progress+1;
       
        if(nextProgress < that.edge.space.length) {
          //console.debug('In middle of edge');
          var space = that.edge.space[nextProgress];

          if(space.car) {
            //console.debug('Cant move to next space, its full');
            that.stopped = true;
            return;
          }


          var lastSpace = that.edge.space[that.progress];
          that.progress = nextProgress;
          
          that.x = space.x;
          that.y = space.y;

          lastSpace.car = null;
          space.car = that;
        } else {
          //console.debug('End of edge');
          var nextNode = that.edge.end;

          if(nextNode.car) {
            //console.debug('Cant move to edge, its full');
            that.stopped = true;
            return;
          }

          var lastSpace = that.edge.space[that.progress];
          that.progress = 0;
          
          that.x = nextNode.x;
          that.y = nextNode.y;

          lastSpace.car = null;
          nextNode.car = that;

          that.edge = null;
          that.node = nextNode;
        }
      } else {
        throw "I got lost!";
      }

      /*
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
       

        if(!nextLink.space[0].car){
          that.link = nextLink;
          that.nextProgress = 0;
          that.nextSpace = nextLink.space[0];
          that.nextEdgeOnRoute++;
        }
      }
      */
    };

    this.tick2 = function(world){

      /*
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
      */
    };
  };
});
