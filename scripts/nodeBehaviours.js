if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['eventBroker'], function (eventBroker) {

  function source(node, properties) {
    //console.log('Add source behaviout to node', node);
    //if(node.colour === '#000000')
      //node.colour = '#00ff00';

    var tickFunction = function (world) {
      if(node.generated > 0) {
        node.generated--;
        return;
      }

      if(Math.random() < 0) {
        return;
      }

      if(!node.car) {
        var targetName = null;

        //console.log('properties', properties);
        if(properties) properties.split(';').forEach(function(prop){
          var bits = prop.split(':');
          var propName = bits[0]; 
          var value =bits[1];
          //console.log('dd', prop, bits, propName, value);
          if(propName === 'd') targetName = readTarget(value);
        });


        eventBroker.dispatch(eventBroker.CREATE_CAR, {
          startNode: node,
          targetName: targetName
        });
        
        //var car = new Car(node, world, null);
        //world.entities.push(car);

        //console.log('Made car', world);
        node.generated = 3; ///Math.random()*10;
      }
    }

    node.registerTick(tickFunction);
  }

  function readTarget(value) {
    var bits = value.split(',');

    if(bits.length == 1){
      return bits[0];
    } else {
      return bits;
    }
  }

  function destination(node) {

  }

  return {
    s: source,
    d: destination    
  };

});