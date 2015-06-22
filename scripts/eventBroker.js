if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(["world"], function(world) {
  return {
    dispatch: function (eventName, detail) {
      var customEvent = new CustomEvent(eventName, {detail: detail});
      world.eventRouter.dispatchEvent(customEvent);
      //console.log('dispatched event', eventName);
    },
    on: function(eventName, callback) {
      world.eventRouter.addEventListener(eventName, callback, false);
    },

    CREATE_CAR: "CREATE_CAR",

    RELOAD_DATA: "RELOAD_DATA",
    NODE_SELECTED: "NODE_SELECTED",
    NODE_HOVER: "NODE_HOVER",
    TICK: "TICK"
  }

});