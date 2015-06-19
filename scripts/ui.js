define(["Node", "Edge", "eventBroker", "load", "math"], 
function (Node, Edge, eventBroker, load, math) {
  return function(canvas, world) {

    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mousemove", doMouseMove, false);

    function doMouseMove(event) {
      var x = event.pageX - this.offsetLeft;
      var y = event.pageY - this.offsetTop;

      var over = _.find(world.elements, function(node){
        return node.x+5 >= x 
        && node.x-1 <= x
        && node.y+5 >= y 
        && node.y-1 <= y;
      });

      if(!over){
        var over = _.find(world.elements, function(edge){
          if(edge.start && edge.end){
            return math.onLine(edge.start.x, edge.start.y,
              edge.end.x, edge.end.y,
              x, y);
          }
          return false;
      });
      }

      eventBroker.dispatch(eventBroker.NODE_HOVER, over);
    }

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
        if(world.selected) {
          if(clickedOn != world.selected) {
            addEdge(world.selected, clickedOn);
            selectNode(clickedOn);
          }
        } else {
          selectNode(clickedOn);
          console.log('Selected a node');
        }
      } else {
        if(world.selected) {
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
      if(world.selected){
        world.selected.selected = undefined;
      }
      world.selected = node;
      eventBroker.dispatch(eventBroker.NODE_SELECTED, node);
      if(world.selected){
        world.selected.selected = true;
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

  }
});