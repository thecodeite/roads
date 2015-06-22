if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(["nodeBehaviours"], function (nodeBehaviours) {
  var guidProgress = 2000;

  function Node (nodeDetails) {
    var that = this;
    this.guid = guidProgress++;
    this.x = nodeDetails.x;
    this.y = nodeDetails.y;
    this.car = null;
    this.outbound=[];
    this.colour = nodeDetails.colour || "#000000";
    this.behaviours = [];
    this.accessor = {};
    this.ticks = [];
    if(nodeDetails.name) this.name = nodeDetails.name;

    this.addProperty = function(name, type, writable) {
      this.accessor[name] = {
        meta: {
          type: type,
          writable: writable
        }
      }; 

      var propDef = {
        get: function() { 
          return that[name];
        },
        enumerable: true,
        configurable: true
      };

      if(writable) {
          propDef.set = function(newValue) { 
            that[name] = newValue; 
          }
      }

      Object.defineProperty(this.accessor[name], 'value', propDef);
    };

    this.addProperty('guid', 'number', false);
    this.addProperty('name', 'text', true);
    this.addProperty('id', 'number', true);
    this.addProperty('x', 'number', false);
    this.addProperty('y', 'number', false);
    this.addProperty('colour', 'color', true);

    if(nodeDetails.b) Object.keys(nodeDetails.b).forEach(function(key) {
      
      if(nodeBehaviours[key]) {
        that.behaviours.push(key);
        nodeBehaviours[key](that, nodeDetails.b[key]);
      }
    });
  }

  Node.prototype.getInfo = function() { return this.accessor; };

  Node.prototype.tick = function (world) {
    this.ticks.forEach(function (t) {
      t(world);
    });
  }

  Node.prototype.registerTick = function(tickFunction) {
    if(tickFunction) {
      this.ticks.push(tickFunction);
    }
  }

  return Node;
});