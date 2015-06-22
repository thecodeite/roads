define(function(){
  var world = {
    eventRouter: document.createElement('div'),
    nodes: [],
    edges: [],
    entities: [],
    terminusList: [], 
    selected: null,
    over: null
  };

  return world;
});