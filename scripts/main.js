requirejs(["Node", "Source", "Terminus", "Car", "Edge", "JsonFormater", "math", "render", "load", "server-access", "ui", "eventBroker"], 
  function(Node, Source, Terminus, Car, Edge, JsonFormater, math, render, load, serverAccess, ui, eventBroker) {

  var canvas = document.getElementById('main-canvas');


  var context = canvas.getContext("2d");
  var formatter = new JsonFormater();

  var world = load.world; 
  ui(canvas, world);
  

  //load.loadData(true);
  loadFromServer();

  world.playing = true;
  //world.playPause();

  document.getElementById('btn-load').addEventListener("click", loadFromServer);
  document.getElementById('btn-save').addEventListener("click", saveToServer);
  //document.getElementById('input-save-name').addEventListener("click", playPause);

  document.getElementById('btn-play').addEventListener("click", playPause);
  document.getElementById('btn-tick').addEventListener("click", tick);

  document.getElementById('btn-clear').addEventListener("click", load.clear);
  document.getElementById('btn-load-reset').addEventListener("click", load.loadAndReset);
  document.getElementById('btn-load-no-reset').addEventListener("click", load.loadAndDontReset);
  document.getElementById('btn-load-random').addEventListener("click", load.loadRandom);

  populateDropdown();
  function populateDropdown() {
    serverAccess.maps().then(function(data) {
      var mapsList = document.getElementById('maps-list');
      mapsList.innerHTML = '';
      Object.keys(data).forEach(function(mapName) {

        var option = document.createElement('option');
        option.value = mapName;

        mapsList.appendChild(option);
        //console.log('mapName', mapName);
      })
    });
  }

  function loadFromServer() {
    var mapName = document.getElementById('input-save-name').value;
    serverAccess.load(mapName).then(function (data) {
      load.setData(data);
    });
  }

  function saveToServer(){
    var mapName = document.getElementById('input-save-name').value;
    load.context(function(data) {
      serverAccess.save(mapName, data);
    });
  }

  setInterval(function() {
    render(canvas, context, world);
    if(world.playPause) {
      doTick(world.elements);
    }
    updateUi();
  }, 100);

  eventBroker.on(eventBroker.NODE_SELECTED, function(e){
    world.selected = e.detail;
    document.getElementById('selected-data').innerHTML = formatter.format(world.selected && world.selected.getInfo());
  });

  eventBroker.on(eventBroker.NODE_HOVER, function(e){
    world.over = e.detail;
    document.getElementById('hover-data').innerHTML = formatter.format(world.over && world.over.getInfo());
  });

  function updateUi() {
    document.getElementById('selected-data').innerHTML = formatter.format(world.selected && world.selected.getInfo());
    document.getElementById('hover-data').innerHTML = formatter.format(world.over && world.over.getInfo());
  }

  world.playPause = playPause;
  function playPause() {
    world.playing = !world.playing;
    document.getElementById('btn-play').innerHTML = world.playing?'Pause':'Play';
  }

  function tick() {
    doTick(world.elements);
  }

  

  function doTick(elements) {
    elements.forEach(function(e) {
      if(e.tick && world.playing) e.tick(world);
    });

    elements.forEach(function(e) {
      if(e.tick2 && world.playing) e.tick2(world);
    });

  }

  

  
});
