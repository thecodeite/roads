define(["Node", "Edge", "Car", "JsonFormater", "math", "world"], 
function (Node, Edge, Car, JsonFormater, math, world) {
  
  var formatter = new JsonFormater();

  function loadRandom() {


    var data = new Function("return "+document.getElementById('map-data').value)();
    data.nodes.length = 0;
    for(var i=0; i<50; i++) {
      var types = ['n', 'n', 'n', 's', 't'];
      var tries = 100;
      var newNode;
      do {
        if(tries-- < 0) break;

        newNode = {
          t: types[~~(Math.random() * types.length)], 
          x: 25 + 25*~~(Math.random() * 15),
          y: 25 + 25*~~(Math.random() * 15)
        };
      }
      while(data.nodes.some(function(n){return n.x == newNode.x && n.y == newNode.y;}))

      
      data.nodes.push(newNode);
    }

    var allEdges = [];
    data.nodes.forEach(function(outer) {
      data.nodes.forEach(function(inner) {
        if(outer !== inner) {
          allEdges.push({
            s: outer,
            e: inner,
            length: (outer.x - inner.x) * (outer.x - inner.x) + 
              (outer.y - inner.y) * (outer.y - inner.y)
          });
        }
      });
    });

    if(true) allEdges = allEdges
      .filter(function(x){
        return x.length < 200*200;
      })
      .sort(function(a, b){
        return a.length - b.length;
      });

    var goodEdges = [];

    if (true) [1,2,3,4,5].forEach(function(i) {
      var e = allEdges.splice(~~(allEdges.length*Math.random()), 1)[0];


      var intersects = goodEdges.some(function(eg) {
        //console.debug('i', eg);
        return math.lineIntersect(
          e.s.x, e.s.y,  
          e.e.x, e.e.y,  

          eg.s.x, eg.s.y,  
          eg.e.x, eg.e.y)
      });

      if(!intersects) {
        goodEdges.push(e);
      }
    });

    if(true) allEdges.forEach(function(e){
      //console.debug('o', e);
      var intersects = goodEdges.some(function(eg) {
        //console.debug('i', eg);
        return math.lineIntersect(
          e.s.x, e.s.y,  
          e.e.x, e.e.y,  

          eg.s.x, eg.s.y,  
          eg.e.x, eg.e.y)
      });

      if(!intersects) {
        goodEdges.push(e);
      }
    });


    data.edges = goodEdges.map(function(e){
      return {
        s: data.nodes.indexOf(e.s),
        e: data.nodes.indexOf(e.e)
      }
    });


    document.getElementById('map-data').value = formatter.format(data);
    loadData(true);
  }

  function loadData(resetElements, data) {

    if(!data){
      data = document.getElementById('map-data').value;

      /*jslint evil: true */
      data = new Function("return "+data)();
    } else {
      document.getElementById('map-data').value = formatter.format(data);
    }
    
    if(resetElements) {
      world.nodes.length = 0;
      world.edges.length = 0;
      world.entities.length = 0;
    }

    var id = 0;
    data.nodes.forEach(function(node){
      if(node.t == 's'){
        //node.node = new Source(node);
      } else if(node.t == 'n'){
        //node.node = new Node(node);
      } else if(node.t == 't'){
        //node.node = new Terminus(node);
        //if(resetElements) world.terminusList.push(node.node);
      }

      node.node = new Node(node);

      node.node.id = ""+(id++);
      if(resetElements) world.nodes.push(node.node);
    });

    data.edges.forEach(function(edgeData){
      
      var s = data.nodes[edgeData.s].node;
      var e = data.nodes[edgeData.e].node;
      var isTwin = edgeData.bi !== false;
      //console.log(edge, s, e);
      var edge = new Edge(s, e, isTwin);

      edge.data = edgeData;
      if(resetElements) world.edges.push(edge);

      if(isTwin) {
        var otherEdge = new Edge(e, s, isTwin);

        otherEdge.data = edgeData;
        if(resetElements) world.edges.push(otherEdge);

        otherEdge.twin = edge;
        edge.twin = otherEdge;
      }
    });

    data.nodes.forEach(function(node){ delete node.node;});

    document.getElementById('map-data').value = formatter.format(data);
  }

  function clear() {
    document.getElementById('map-data').value = formatter.format({nodes: [], edges:[]});
    loadData(true);
  }

  function loadAndReset() {
    loadData(true);
  }

  function loadAndDontReset() {
    loadData(false);
  }

  function context(callback) {
     var data = new Function("return "+document.getElementById('map-data').value)();
     callback(data);
     document.getElementById('map-data').value = formatter.format(data);
  }

  function setData(data) {
    loadData(true, data);
  }


  return {
    loadRandom: loadRandom,
    loadData: loadData,
    clear: clear,
    loadAndReset: loadAndReset,
    loadAndDontReset: loadAndDontReset,
    setData: setData,

    context: context
  };
});
