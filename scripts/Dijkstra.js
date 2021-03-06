define(function () {
  
  function Dijkstra(world){
    var that = this;

    this.world = world;
  }
  
  Dijkstra.prototype.routeBetween = function (start, end) {

    var sptSet = this.calcSpt(start);
    var sptEnd = sptSet[end.id];

    return sptEnd.route;
  }

  function sortByLength(a, b) {
    return a.length - b.length;
  }

  Dijkstra.prototype.calcSpt = function (start, end) {
    
    var sptSet = {};
    var edgeSet = {};

    sptSet[start.id] = {distance: 0, route: [], fixed: true, node: start};

    calcNextSpt(sptSet[start.id]);

    return sptSet;

    function calcNextSpt(thisSpt) {
      //console.log('thisSpt', thisSpt);

      // Add new liks
      thisSpt.node.outbound.forEach(function(e) {
        edgeSet[e.start.id+','+e.end.id] = e;

        var newSpd = {
          distance: e.length + thisSpt.distance + e.space.reduce(function(p,c){
            if(c.car && c.car.stopped) p += 30;
            return p;
          }, 0), 
          node: e.end,
          route: thisSpt.route.concat(e)
        };

        //console.log('e', e);
        if(!sptSet[e.end.id]) {
          sptSet[e.end.id] = newSpd
        } else if(newSpd.distance < sptSet[e.end.id].distance) {
          sptSet[e.end.id] = newSpd
        }
      });

      var next = null;

      //console.log('keys', Object.keys(sptSet));
      Object.keys(sptSet).forEach(function(k) {
        var spt = sptSet[k];
        //console.log('k, sptSet[k]', k, sptSet[k]);

        if(spt.fixed) return;

        if(!next) {
          next = spt;
          return;
        }

        if(spt.distance < next.distance) {
          next = spt;
        }
      });

      if(next == null) {
        return;
      }

      next.fixed = true;

      if(next.node == end) {
        return;
      }
      
      //console.log('next', next);
      calcNextSpt(next);
    
    }
  };

  return Dijkstra;
});