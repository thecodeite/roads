define(['eventBroker', 'world', 'Car'], function(eventBroker, world, Car) {

  eventBroker.on(eventBroker.CREATE_CAR, function(e) {
    //console.log(e);
    var car = new Car(e.detail.startNode, world, e.detail.targetName);
    world.entities.push(car);
  });

  return null;
});