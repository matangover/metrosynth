var trains = [];
var loaded = false;
project.importSVG("metro.svg", function(item, content) {
  var scaleFactor = 0.4;
  item.scale(scaleFactor);
  item.position = view.center;
  window.item=item;
  linePaths = item.getItems({name: /-line$/});
  for (var i = 0; i < linePaths.length; i++) {
    linePaths[i].strokeWidth *= scaleFactor;
  }

  for (var i = 0; i < linePaths.length; i++) {
    train = new Path.Circle(new Point(100, 70), 10);
    train.fillColor = 'red';
    trains.push({name: linePaths[i].name, line: linePaths[i], train: train, location: 0});
  }
  loaded = true;
});
function onResize(event) {
  if (window.item) {
    // Whenever the window is resized, recenter the path:
    window.item.position = view.center;
  }
}

var velocity = 20;
function onFrame(event) {
  if (!loaded) return;
  for (var i = 0; i < trains.length; i++) {
    var train = trains[i];
    train.location += event.delta * velocity;
    if (train.location >= train.line.length) {
      train.location = 0;
    }
    train.train.position = train.line.getPointAt(train.location);
  }
}
