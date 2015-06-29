define(["Node", "Edge", "Car"], 
  function (Node, Edge, Car) {
  

  function drawCircle(context, fill, x, y, size){
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();
    if(fill){
        context.fill()
    }
  }

  function render(canvas, context, world) {


    canvas.width = canvas.width;
    
    var renderE = function(e) {

      context.lineWidth = 1;
      context.strokeStyle = "#000";
      //context.strokeRect(e.x-3.5, e.y-3.5, 7, 7);
      

      if(e.selected) {
        context.strokeStyle = "#0f0";
        context.fillStyle = "#0f0";
      } else if(e == world.over) {
        context.strokeStyle = "#0a0";
        context.fillStyle = "#0a0";
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
      }
    };

    function renderEdge(e) {
      
      if (e.start && e.end) {

        context.beginPath();
        if(e == world.over){
          context.strokeStyle = "#333";
          context.lineWidth = 6;
        } else {
          context.lineWidth = 5;
          context.strokeStyle = "#eee";
        }

        

        context.moveTo(e.sx, e.sy);
        context.lineTo(e.ex, e.ey);
        
        
        context.stroke();
      }
    }

    function renderEntity(e) {
      context.lineWidth = 1;
      context.strokeStyle = "#000";
      context.fillStyle = e.colour;
      
      drawCircle(context, true, e.x, e.y, 2);
    }

    world.edges.forEach(renderEdge);

    world.nodes.forEach(renderE);

    world.entities.forEach(renderEntity);

    var cha = 5;
    var chb = 4;
    context.beginPath();
    context.moveTo(world.hx-cha, world.hy-0.5);
    context.lineTo(world.hx+chb, world.hy-0.5);
    context.moveTo(world.hx-0.5, world.hy-cha);
    context.lineTo(world.hx-0.5, world.hy+chb);
    context.stroke();
    

   
  }

  return render;
});
