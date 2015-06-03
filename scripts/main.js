requirejs(["Node", "Source", "Terminus", "Car", "Edge", "JsonFormater"], 
  function(Node, Source, Terminus, Car, Edge, JsonFormater) {

  var canvas = document.getElementById('a');
  var context = canvas.getContext("2d");

  var elements = [];
  var world = {
    elements: elements
  };

/*
  var source1 = new Source(10, 10);
  elements.push(source1);

  var node1 = new Node(60, 60);
  var node2 = new Node(60, 110);

  elements.push(node1);
  elements.push(node2);

  var terminus1 = new Node(110, 10);
  elements.push(terminus1);

  var link1 = new Link(source1, node1);
  var link2 = new Link(node1, node2);
  var link3 = new Link(node2, source1);
  var link4 = new Link(node2, terminus1);

  elements.push(link1);
  elements.push(link2);
  elements.push(link3);
  elements.push(link4);

  elements.push(new Car(link1));
*/
  
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
    var data = new Function("return "+data)();
    
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

    data.edges.forEach(function(edge){
      
      var s = data.nodes[edge.s].node;
      var e = data.nodes[edge.e].node;
      console.log(edge, s, e);
      edge.edge = new Edge(s, e);
      if(resetElements) elements.push(edge.edge);
    });

    data.nodes.forEach(function(node){ delete node.node});
    data.edges.forEach(function(edge){ delete edge.edge});

    var formatter = new JsonFormater();
    document.getElementById('map-data').value = formatter.format(data);
  }

  function render(elements) {

    canvas.width = canvas.width;

    for(var i in elements){
      var e = elements[i];

       if(e.tick){
        e.tick(world);
      }

      if(e.colour){
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
