requirejs(["Node", "Source", "Terminus", "Car", "Edge", "JsonFormater"], 
  function(Node, Source, Terminus, Car, Edge, JsonFormater) {

  var canvas = document.getElementById('main-canvas');
  var context = canvas.getContext("2d");
  var formatter = new JsonFormater();

  canvas.addEventListener("mousedown", doMouseDown, false);
  var elements = [];
  var world = {
    elements: elements
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

  document.getElementById('btn-load-reset').addEventListener("click", loadAndReset);
  document.getElementById('btn-load-no-reset').addEventListener("click", loadAndDontReset);

  setInterval(function() {
    render(elements);
  }, 250);

  function loadAndReset(){
    loadData(true);
  }

  function loadAndDontReset(){
    loadData(false);
  }

  function loadData(resetElements) {
    var data = document.getElementById('map-data').value;

    /*jslint evil: true */
    data = new Function("return "+data)();
    
    if(resetElements) elements.length = 0;

    data.nodes.forEach(function(node){
      if(node.t == 's'){
        node.node = new Source(node.x, node.y);
      } else if(node.t == 'n'){
        node.node = new Node(node.x, node.y);
      } else if(node.t == 't'){
        node.node = new Node(node.x, node.y);
      }
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

  function render(elements) {

    canvas.width = canvas.width;

    elements.forEach(function(e){
      if(e.tick){
        e.tick(world);
      }
    });

    for(var i in elements){
      var e = elements[i];

       if(e.tick2){
        e.tick2(world);
      }

      if(e.selected) {
        context.strokeStyle = "#0f0";
      } else if(e.colour){
        context.strokeStyle = e.colour;
      } else {
        context.strokeStyle = "#000";
      }

      if(e.x && e.y) {
        context.strokeRect(e.x-2, e.y-2, 4, 4);
      } else if (e.start && e.end) {

        context.moveTo(e.start.x, e.start.y);
        context.lineTo(e.end.x, e.end.y);
        context.strokeStyle = "#eee";
        context.stroke();
      }
    }
  }
});
