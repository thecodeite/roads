define(["Node", "Edge", "JsonFormater",
  "eventBroker", "load", "math"], 
function (Node, Edge, JsonFormater,
  eventBroker, load, math) {

  var selectedDataElement = document.getElementById('selected-data');
  var hoverDataElement = document.getElementById('hover-data');
  var editors = {};

  return function(canvas, world) {

    var formatter = new JsonFormater();

    function edit(item) {

      if(item) { 
        var form = document.createElement('div');
        Object.keys(item).forEach(function(name) {
          var data = item[name];
          var line = document.createElement('div');
          form.appendChild(line);

          var label = document.createElement('span');
          label.textContent = name;
          line.appendChild(label);

          var input = document.createElement('input');

          input.type = data.meta.type;
          input.name = name;
          input.value = data.value || '';

          line.appendChild(input);

          var button = document.createElement('button');
          button.textContent = 'S';
          button.addEventListener('click', function(e){
            //console.log('xx', data.value, input.value);
            item[name].value = input.value;
            return true;
          });
          line.appendChild(button);

          //html += '</div>';
        });
        //html += '</form>';
        selectedDataElement.innerHTML = '';
        selectedDataElement.appendChild(form);
      } else {
        selectedDataElement.innerHTML  ='None';
      }
    }

    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mousemove", doMouseMove, false);

    eventBroker.on(eventBroker.TICK, function(e){
      //selectedDataElement.innerHTML = formatter.format(world.selected && world.selected.getInfo());
      //edit(world.selected && world.selected.getInfo());

      hoverDataElement.innerHTML = formatter.format(world.over && world.over.getInfo && world.over.getInfo());
    });

    eventBroker.on(eventBroker.NODE_SELECTED, function(e){
      world.selected = e.detail;
      //selectedDataElement.innerHTML = formatter.format(world.selected && world.selected.getInfo());
      edit(world.selected && world.selected.getInfo());
    });

    eventBroker.on(eventBroker.NODE_HOVER, function(e){
      world.over = e.detail;
      hoverDataElement.innerHTML = formatter.format(world.over && world.over.getInfo && world.over.getInfo());
    });

    function doMouseMove(event) {
      var x = event.pageX - this.offsetLeft;
      var y = event.pageY - this.offsetTop;
      world.hx = x;
      world.hy = y;

      var over = _.find(world.nodes, function(node){
        return node.x+5 >= x && 
          node.x-1 <= x && 
          node.y+5 >= y && 
          node.y-1 <= y;
      });

      if(!over){
        over = _.find(world.edges, function(edge){
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

      var clickedOn = _.find(world.nodes, function(node){
        return node.x+5 >= x &&
          node.x-1 <= x &&
          node.y+5 >= y &&
          node.y-1 <= y;
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
      var edge = new Edge(start, end);
      world.edges.push(edge);

      load.context(function (data) {

        edge.data = {
          s: (_.findIndex(data.nodes, function (n) { return n.x ==start.x && n.y == start.y; })),
          e: (_.findIndex(data.nodes, function (n) { return n.x ==end.x && n.y == end.y; }))
        };

        console.log(data);
        data.edges.push(edge.data);
      });
    }

    function addNode(x, y) {
      
      //data.nodes.push(point);
      //document.getElementById('map-data').value = formatter.format(data);
      
      var node = new Node({x:x, y:y});
      node.data = { t:'n', x: x, y: y};
      world.nodes.push(node);

      //var data = new Function("return "+document.getElementById('map-data').value)();
      load.context(function (data) {
        data.nodes.push(node.data);
      });
      //document.getElementById('map-data').value = formatter.format(data);
    }

  };
});