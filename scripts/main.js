requirejs(["world", "math", "render", "load", "server-access", "ui", "eventBroker", "factory"], 
  function(world, math, render, load, serverAccess, ui, eventBroker, factory) {

  var canvas = document.getElementById('main-canvas');

  var context = canvas.getContext("2d");

  ui(canvas, world);
  

  //load.loadData(true);
  loadFromServer();

  world.playing = true;
  //playPause();

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
      });
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
    if(world.playing) {
      doTick();
    }
    eventBroker.dispatch(eventBroker.TICK);
  }, 100);


  world.playPause = playPause;
  function playPause() {
    world.playing = !world.playing;
    document.getElementById('btn-play').innerHTML = world.playing?'Pause':'Play';
  }

  function tick() {
    doTick();
  }

  function doTick() {
    var allElements = world.nodes.concat(world.edges).concat(world.entities);

    allElements.forEach(function(e) {
      if(e.tick && world.playing) e.tick(world);
    });

    allElements.forEach(function(e) {
      if(e.tick2 && world.playing) e.tick2(world);
    });

  }

  

  
});
