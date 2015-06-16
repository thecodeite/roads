requirejs(["Node", "Source", "Terminus", "Car", "Edge", "JsonFormater", "math"], 
  function(Node, Source, Terminus, Car, Edge, JsonFormater, math) {

  var canvas = document.getElementById('main-canvas');
  var context = canvas.getContext("2d");
  var formatter = new JsonFormater();

  canvas.addEventListener("mousedown", doMouseDown, false);
  var elements = [];
  var terminusList = [];
  var world = {
    elements: elements,
    terminusList: terminusList
  };

  var selected = null;

  function doMouseDown(event) {
    if(event.button == 2){
      selectNode(null);
      return;
    }

    var x = event.pageX - this.offsetLeft;
    var y = event.pageY - this.offsetTop;

    var clickedOn = _.find(elements, function(node){
      return node.x+5 >= x 
      && node.x-1 <= x
      && node.y+5 >= y 
      && node.y-1 <= y;
    });

    if(clickedOn){
      if(selected) {
        if(clickedOn != selected) {
          addEdge(selected, clickedOn);
          selectNode(clickedOn);
        }
      } else {
        selectNode(clickedOn);
        console.log('Selected a node');
      }
    } else {
      if(selected) {
        console.log('Un-selected a node');
        selectNode(null);
      } else {
        addNode(x,y);
      }
    }

    console.log('Found', clickedOn);
    return;
  }

  function selectNode(node) {
    if(selected){
      selected.selected = undefined;
    }
    selected = node;
    document.getElementById('selected-data').innerHTML = formatter.format(node);
    if(selected){
      selected.selected = true;
    }
  }

  function addEdge(start, end) {
    var edge = new Edge(start, end)
    elements.push(edge);

    var data = new Function("return "+document.getElementById('map-data').value)();
    
    edge.data = {
      s: (_.findIndex(data.nodes, function (n) { return n.x ==start.x && n.y == start.y})),
      e: (_.findIndex(data.nodes, function (n) { return n.x ==end.x && n.y == end.y}))
    }

    console.log(data);
    data.edges.push(edge.data);
    document.getElementById('map-data').value = formatter.format(data);
  }

  function addNode(x, y){
    
    //data.nodes.push(point);
    //document.getElementById('map-data').value = formatter.format(data);
    
    var node = new Node(x, y);
    node.data = { t:'n', x: x, y: y}
    elements.push(node);

    var data = new Function("return "+document.getElementById('map-data').value)();
    data.nodes.push(node.data);
    document.getElementById('map-data').value = formatter.format(data);
  }

  
  loadData(true);

  var playing = true;
  //playPause();

  document.getElementById('btn-play').addEventListener("click", playPause);
  document.getElementById('btn-tick').addEventListener("click", tick);

  document.getElementById('btn-clear').addEventListener("click", clear);
  document.getElementById('btn-load-reset').addEventListener("click", loadAndReset);
  document.getElementById('btn-load-no-reset').addEventListener("click", loadAndDontReset);
  document.getElementById('btn-load-random').addEventListener("click", loadRandom);



  setInterval(function() {
    render(elements);
    if(playing) {
      doTick(elements);
    }
  }, 100);

  function playPause() {
    playing = !playing;
    document.getElementById('btn-play').innerHTML = playing?'Pause':'Play';
  }

  function tick() {
    doTick(elements);
  }

  function clear() {
    document.getElementById('map-data').value = formatter.format({nodes: [], edges:[]});
    loadData(true);
  }

  function loadAndReset(){
    loadData(true);
  }

  function loadAndDontReset(){
    loadData(false);
  }

  function loadRandom() {


    var data = new Function("return "+document.getElementById('map-data').value)();
    data.nodes.length = 0;
    for(var i=0; i<100; i++) {
      var types = ['n', 'n', 'n', 's', 't'];



      data.nodes.push({
        t: types[~~(Math.random() * types.length)], 
        x: 10 + 10*~~(Math.random() * 40),
        y: 10 + 10*~~(Math.random() * 40)
      })
    }

    var allEdges = [];
    data.nodes.forEach(function(outer) {
      data.nodes.forEach(function(inner) {
        if(outer !== inner) {
          allEdges.push({
            s: outer,
            e: inner,
            length: (outer.x - inner.x) * (outer.x - inner.x) * 
              (outer.y - inner.y) * (outer.y - inner.y)
          });
        }
      });
    });

    allEdges.sort(function(a, b){
      return a.length - b.length;
    });

    var goodEdges = [];

    allEdges.forEach(function(e){
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

  function loadData(resetElements) {
    var data = document.getElementById('map-data').value;

    /*jslint evil: true */
    data = new Function("return "+data)();
    
    if(resetElements) {
      elements.length = 0;
      terminusList.length = 0;
    }

    var id = 0;
    data.nodes.forEach(function(node){
      if(node.t == 's'){
        node.node = new Source(node);
      } else if(node.t == 'n'){
        node.node = new Node(node.x, node.y);
      } else if(node.t == 't'){
        node.node = new Terminus(node);
        if(resetElements) terminusList.push(node.node);
      }
      node.node.id = ""+(id++);
      if(resetElements) elements.push(node.node);
    });

    data.edges.forEach(function(edgeData){
      
      var s = data.nodes[edgeData.s].node;
      var e = data.nodes[edgeData.e].node;
      //console.log(edge, s, e);
      var edge = new Edge(s, e);

      edge.data = edgeData;
      if(resetElements) elements.push(edge);
    });

    data.nodes.forEach(function(node){ delete node.node;});

    document.getElementById('map-data').value = formatter.format(data);
  }

  function doTick(elements) {
    elements.forEach(function(e) {
      if(e.tick) e.tick(world);
    });

    elements.forEach(function(e) {
      if(e.tick2) e.tick2(world);
    });

  }

  function render(elements) {

    canvas.width = canvas.width;
    
    for(var i in elements){
      var e = elements[i];


      if(e instanceof Source || e instanceof Terminus) {
        context.strokeStyle = "#000";
        context.strokeRect(e.x-3.5, e.y-3.5, 7, 7);
      }

      if(e.selected) {
        context.strokeStyle = "#0f0";
        context.fillStyle = "#0f0";
      } else if(e.colour){
        if(e instanceof Car){
          context.strokeStyle = "#000";
        } else {
          context.strokeStyle = e.colour;
        }
        context.fillStyle = e.colour;
      } else {
        context.strokeStyle = "#000";
        context.fillStyle = "#000";
      }

      if(e.x && e.y) {
        if(e instanceof Car){
          drawCircle(context, true, e.x, e.y, 2);
        } else {
          context.strokeRect(e.x-2.5, e.y-2.5, 5, 5);
        }
      } else if (e.start && e.end) {

        context.moveTo(e.start.x, e.start.y);
        context.lineTo(e.end.x, e.end.y);
        context.strokeStyle = "#eee";
        context.stroke();
      }
    }
  }

  function drawCircle(context, fill, x, y, size){
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();
    if(fill){
        context.fill()
    }
  }
});
