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
  // TODO: the animation is not smooth probably because the Transport.ticks
  // isn't updated frequently enough - it's tied to the Tone.clock frequency,
  // which is 120 BPM by default.
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
    if (stationOffsets[ride.line.name]) {
      var trainOffset = getTrainOffset(currentTime - rideStartSeconds, ride.line, train.trackGraphic);
    } else {
      var trainOffset = rideProgress * train.trackGraphic.length;
    }
    train.trainGraphic.position = train.trackGraphic.getPointAt(trainOffset);
  }

  for (var trainRideId in trains) {
    var found = false;
    for (var i = 0; i < activeRides.length; i++) {
      var ride = activeRides[i];
      if (getRideId(ride.start, ride.line) == trainRideId) {
        found = true;
        break;
      }
    }
    if (!found) {
      trains[trainRideId].trainGraphic.remove();
      delete trains[trainRideId];
    }
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
      trackGraphic: window.item.getItem({name: ride.line.name + "-line"}),
      stationsGraphic: window.item.getItem({name: ride.line.name + "-stations"})
    };
    trains[rideId] = train;
  }
  return train;
}
//
// // Return a number from 0-1 how far we are into the ride, taking into account
// // the ride time between each station.
function getTrainOffset(currentRideDurationSeconds, line) {
  var offsets = stationOffsets[line.name];
  var totalRideDuration = minutesToSeconds(line.times[line.times.length - 1]);
  for (var i = 1; i < line.times.length; i++) {
    var rideDurationUntilStation = minutesToSeconds(line.times[i]);
    if (currentRideDurationSeconds <= rideDurationUntilStation) {
      var rideDurationUntilPreviousStation = minutesToSeconds(line.times[i-1]);
      var previousOffset = offsets[i - 1];
      var progressBetweenStations = (currentRideDurationSeconds-rideDurationUntilPreviousStation)/ (rideDurationUntilStation-rideDurationUntilPreviousStation);
      var offsetBetweenStations = offsets[i] - previousOffset;
      return previousOffset + progressBetweenStations*offsetBetweenStations;
    }
  }
  // Last station reached.
  return 1;
}


var stationOffsets = {
  green: [
    0,
    25,
    55,
    81,
    110,
    140,
    170,
    200,
    250,
    280,
    310,
    335,
    370,
    395,
    420,
    455,
    480,
    505,
    535,
    560,
    590,
    620,
    645,
    675,
    700,
    730,
    758
  ],
  orange: [0, 27, 56, 84, 112, 140, 170, 196, 224, 252, 310, 336, 364, 393, 421, 449, 477, 530, 571, 596, 622, 648, 674, 730, 758, 786, 800, 814, 870, 930, 987],
  yellow: [0, 49, 122],
  blue: [0, 27, 56, 83, 123, 163, 205, 231, 259, 287, 315, 344]
};

//l=item.getItem({name:"green-line"})
//c=new paper.Path.Circle(l.getPointAt(25),10); c.fillColor="red";
//c.remove()
function getOffsets(line) {
  var trackGraphic = item.getItem({name: line+'-line'});
  var stationsGraphic = item.getItem({name: line+'-stations'});
  var points = stationsGraphic.children[1].children;
  var os = [];
  for (var i = 0; i < points.length; i++) {
    var nearest = trackGraphic.getNearestPoint(points[i].position);
    var offset = trackGraphic.getOffsetOf(nearest);
    var c = new paper.Path.Circle(nearest, 10);
    c.fillColor = 'yellow';
    os.push(Math.floor(offset));
    console.log(offset);
    //trackGraphic
  }
  os.sort(function (a, b) {  return a - b;  });
  return os;
}
function drawOffset(line, offset) {
  var trackGraphic = item.getItem({name: line+'-line'});
  var point = trackGraphic.getPointAt(offset);
  var c = paper.Path.Circle(point, 10);
  c.fillColor = 'green';
  return c;
}
function drawLine(line) {
  var trackGraphic = item.getItem({name: line+'-line'});
  var offsets = stationOffsets[line];
  for (var i = 0; i < offsets.length; i++) {
    var point = trackGraphic.getPointAt(offsets[i]);
    var c = paper.Path.Circle(point, 10);
    c.fillColor = 'green';
  }
}
