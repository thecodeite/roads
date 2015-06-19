requirejs(["Node", "Source", "Terminus", "Car", "Edge", "JsonFormater", "math", "render", "load"], 
  function(Node, Source, Terminus, Car, Edge, JsonFormater, math, render, load) {

  var canvas = document.getElementById('main-canvas');
  var context = canvas.getContext("2d");
  var formatter = new JsonFormater();

  canvas.addEventListener("mousedown", doMouseDown, false);

  var world = load.world; 

  var selected = null;

  function doMouseDown(event) {
    if(event.button == 2){
      selectNode(null);
      return;
    }

    var x = event.pageX - this.offsetLeft;
    var y = event.pageY - this.offsetTop;

    var clickedOn = _.find(world.elements, function(node){
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
    
    if(selected){
      selected.selected = true;
    }
  }

  function addEdge(start, end) {
    var edge = new Edge(start, end)
    world.elements.push(edge);

    load.context(function (data) {

      edge.data = {
        s: (_.findIndex(data.nodes, function (n) { return n.x ==start.x && n.y == start.y})),
        e: (_.findIndex(data.nodes, function (n) { return n.x ==end.x && n.y == end.y}))
      }

      console.log(data);
      data.edges.push(edge.data);
    })
  }

  function addNode(x, y) {
    
    //data.nodes.push(point);
    //document.getElementById('map-data').value = formatter.format(data);
    
    var node = new Node({x:x, y:y});
    node.data = { t:'n', x: x, y: y}
    world.elements.push(node);

    //var data = new Function("return "+document.getElementById('map-data').value)();
    load.context(function (data) {
      data.nodes.push(node.data);
    })
    //document.getElementById('map-data').value = formatter.format(data);
  }

  
  load.loadData(true);

  world.playing = true;
  //world.playPause();

  document.getElementById('btn-play').addEventListener("click", playPause);
  document.getElementById('btn-tick').addEventListener("click", tick);

  document.getElementById('btn-clear').addEventListener("click", load.clear);
  document.getElementById('btn-load-reset').addEventListener("click", load.loadAndReset);
  document.getElementById('btn-load-no-reset').addEventListener("click", load.loadAndDontReset);
  document.getElementById('btn-load-random').addEventListener("click", load.loadRandom);



  setInterval(function() {
    render(canvas, context, world);
    if(world.playPause) {
      doTick(world.elements);
    }
    updateUi();
  }, 100);

  function updateUi(){
    document.getElementById('selected-data').innerHTML = formatter.format(selected && selected.getInfo());
  }

  world.playPause = playPause;
  function playPause() {
    world.playing = !world.playing;
    document.getElementById('btn-play').innerHTML = world.playing?'Pause':'Play';
  }

  function tick() {
    doTick(world.elements);
  }

  

  function doTick(elements) {
    elements.forEach(function(e) {
      if(e.tick && world.playing) e.tick(world);
    });

    elements.forEach(function(e) {
      if(e.tick2 && world.playing) e.tick2(world);
    });

  }

  

  
});
