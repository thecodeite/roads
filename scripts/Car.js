define(["Dijkstra"], function (Dijkstra) {
  return function Car(startNode, world, targetName) {
    var logger = function() {
      //console.log.apply(console, arguments);
    }

    var that = this;
    logger('Care created. Starting on', startNode);

    this.edge = null;
    this.node = startNode;
    startNode.car = this;

    this.progress = 0;

    this.x = startNode.x;
    this.y = startNode.y;
    this.colour = getRandomColor();
    that.currentSpace = startNode;

    var dijkstra = new Dijkstra(world);
    var routes = dijkstra.calcSpt(startNode);

    var possibleTargets = Object.keys(routes).map(function (id) {
      var route = routes[id];
      return route.node;
    });

    that.target = pickTarget(possibleTargets);

    that.colour = that.target.colour;

    var total = 0;
    //that.route = pickRoute(that.target);
   
    //that.route = dijkstra.routeBetween(startNode, that.target);
    //console.log('Select route', routes, that.target.id)
    that.route = routes[that.target.id].route;

    that.nextEdgeOnRoute = 0;

    function pickTarget(possibleTargets) {
     
      if(typeof(targetName) == 'string') {
        var term =  possibleTargets.find(function (t) {
          if(t.name === targetName){
            return t;
          }
        });

        if(term) {
          //console.log('Picked target by name');
          return term;
        }
      } else if(targetName && targetName.constructor === Array) {
        var targets = [];
        targetName.forEach(function(tName){
          //console.log('looking for ', tName, 'in', possibleTargets);
          var term =  possibleTargets.find(function(t){
            return t.name === tName;
          });

          if(term) {
            targets.push(term);
          }
        });
        //console.log('targets', targets)

        if(targets.length > 0) {
          var picketTarget = targets[~~(Math.random() * targets.length)];
          //console.log('picketTarget', picketTarget);
          //console.log('Picked target by random name');
          return picketTarget
        } else {
          //console.log('Had targets but couldnt find any');
        }
      }

      var index = possibleTargets.indexOf(startNode);
      var nodes = possibleTargets.slice();
      if(index != -1) {
        nodes.splice(index, 1);
      }
      //console.log('Picked at random', nodes);
      return nodes[~~(Math.random() * nodes.length)];
    }


    function getRandomColor() {
      var letters = '0123456789A'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    }


    
    //this.log = function(){};

    this.tick = function(world) {
      logger('Starting tick. I am on', that.node, that.edge);
      //console.log(this.x, this.y)
      if(that.broken) {
        logger('I am broke');
        return;
      }

      if(that.stopped) {
        that.stopped = false;
        return;
      }

      if(that.node) {
        //console.debug('On node', that.node, that.target);

        if(that.target){
          if(that.target === that.node) {
            //console.debug('Delete me!');
            that.node.car = null;
            var i = world.entities.indexOf(that);
            if(i != -1) {
              world.entities.splice(i, 1);
            }
            logger('Reached target, removing from world');
            return;
          }
        }

        if(that.node.outbound.length === 0) {
          logger('Nowhere to go');
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

        if(!space){
          console.error("Bad!", edgeToMoveTo);
          world.playPause();
          return;
        }  

        if(space.car) {
          console.debug('Cant move to space, its full', edgeToMoveTo);
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
            //logger('Cant move to next space, its full', that.edge);
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
            //console.debug('Cant move to edge, its full', nextNode);
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
