define(function(){
  return {
    dispatch: function (eventName, detail) {
      var customEvent = new CustomEvent(eventName, {detail: detail});
      window.dispatchEvent(customEvent);
      //console.log('dispatched event', eventName);
    },
    on: function(eventName, callback) {
      window.addEventListener(eventName, callback, false);
    },

    RELOAD_DATA: "RELOAD_DATA",
    NODE_SELECTED: "NODE_SELECTED",
    NODE_HOVER: "NODE_HOVER"
  }

});