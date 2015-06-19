define(["Node", "Source", "Terminus", "Edge", "Car"], 
  function (Node, Source, Terminus, Edge, Car) {
  

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
    var elements = world.elements;

    canvas.width = canvas.width;
    
    var renderE = function(e) {

      if(e instanceof Source || e instanceof Terminus) {
        context.strokeStyle = "#000";
        context.strokeRect(e.x-3.5, e.y-3.5, 7, 7);
      }

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
      } else if (e.start && e.end) {

        context.moveTo(e.start.x, e.start.y);
        context.lineTo(e.end.x, e.end.y);
        if(e == world.over){
          context.strokeStyle = "#333";
        } else {
          context.strokeStyle = "#eee";
        }
        context.stroke();
      }
    };

    elements.forEach(function(e) {
      if(e instanceof Edge) renderE(e);
    });

     elements.forEach(function(e) {
      if(!(e instanceof Edge)) renderE(e);
    });
  }

  return render;
});
