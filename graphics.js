window.onload = function() {
  initializePaper();
}

function initializePaper() {
  var canvas = document.getElementById('myCanvas');
  paper.setup(canvas);
  //paper.view.draw();
  paper.view.onFrame = onFrame;
  paper.view.onResize = onResize;
  loadSVG()
}
var trains = [];
var loaded = false;

function loadSVG() {
  paper.project.importSVG("metro.svg", function(item, content) {
    var scaleFactor = 0.4;
    item.scale(scaleFactor);
    item.position = paper.view.center;
    window.item=item;
    linePaths = item.getItems({name: /-line$/});
    for (var i = 0; i < linePaths.length; i++) {
      linePaths[i].strokeWidth *= scaleFactor;
    }

    // for (var i = 0; i < linePaths.length; i++) {
    //   train = new paper.Path.Circle(new paper.Point(100, 70), 10);
    //   train.fillColor = 'red';
    //   trains.push({name: linePaths[i].name, line: linePaths[i], train: train, location: 0});
    // }
    loaded = true;
  });
}

function onResize(event) {
  if (window.item) {
    // Whenever the window is resized, recenter the path:
    window.item.position = paper.view.center;
  }
}

var velocity = 20;
function onFrame(event) {
  if (!loaded) return;

  // var currentTime = Tone.Ticks(Tone.Transport.ticks).toSeconds();
  // // TODO: find an efficient way not to go over all the rides on each frame
  // for (var i = 0; i < window.rides.length; i++) {
  //   var ride = window.rides[i];
  //   var rideStartSeconds = rideStart.toSeconds();
  //   var rideLengthMinutes = ride.line.times[ride.line.times.length - 1];
  //   var rideLengthTransportSeconds = window.minutesToTransportTime(rideLengthMinutes).toSeconds();
  //   if (rideStartSeconds < currentTime ||
  //     rideStartSeconds + rideLengthTransportSeconds > currentTime) {
  //     // Ride is not currently active.
  //     continue;
  //   }
  var currentTime = Tone.Ticks(Tone.Transport.ticks).toSeconds();
  for (var i = 0; i < window.activeRides.length; i++) {
    var ride = window.activeRides[i];
    var rideStartSeconds = ride.start.toSeconds();
    var rideLengthMinutes = ride.line.times[ride.line.times.length - 1];
    var rideLengthSeconds = Tone.TransportTime(minutesToTransportTime(rideLengthMinutes)).toSeconds();
    var rideProgress = (currentTime - rideStartSeconds) / rideLengthSeconds;
    if (rideProgress < 0 || rideProgress > 1) {
      // Ride is not currently active, remove it.
      window.activeRides.splice(i, 1);
      i--;
      continue;
    }
    var train = getOrAddTrain(ride);
    //var rideProgressTicks = (Tone.Transport.ticks - ride.start.toTicks()) / Tone.TransportTime(minutesToTransportTime(rideLengthMinutes)).toTicks();
    train.trainGraphic.position = train.trackGraphic.getPointAt(rideProgress * train.trackGraphic.length);
  }
}

function getOrAddTrain(ride) {
  var rideId = window.getRideId(ride.start, ride.line);
  var train = trains[rideId];
  if (!train) {
    var trainGraphic = new paper.Path.Circle(new paper.Point(100, 70), 10);
    trainGraphic.fillColor = 'red';
    train = {
      trainGraphic: trainGraphic,
      trackGraphic: window.item.getItem({name: ride.line.name + "-line"})
    };
    trains[rideId] = train;
  }
  return train;
}
