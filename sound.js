var updateParametersInterval;
var updateTimeInterval;
function start() {
  scheduleWeekdays(metro.lines.green);

  var startOffset = t(metro.lines.green.hours[0].weekdays.first);
  // Give some time before the start.
  startOffset -= 15;
  Tone.Transport.start(Tone.now(), minutesToTransportTime(startOffset));
  updateParametersInterval = setInterval(updateParameters, 1000);
  Tone.Transport.on("start", updateParameters);
  updateTimeInterval = setInterval(updateTime, 300);
}

function scheduleWeekdays(line) {
  var frequencies = line.frequencies.weekdays;
  // TODO: all weekdays
  // for (var weekday = 0; weekday < 5; weekday++) {
    var nonPeakStart = t(line.hours[0].weekdays.first);
    for (var peakIndex = 0; peakIndex < metro.peak.length; peakIndex++) {
      var peak = metro.peak[peakIndex];
      schedule(line, frequencies.nonpeak, nonPeakStart, t(peak.start) - 1); // -1 needed?
      schedule(line, frequencies.peak, t(peak.start), t(peak.end) - 1);
      nonPeakStart = t(peak.end);
    }
    schedule(line, nonPeakStart, frequencies.nonpeak, t(line.hours[0].weekdays.last, 1));
  // }
}

function timeOfDayToMinuteOffset(timeOfDay, dayOffset) {
  if (!dayOffset) dayOffset = 0;
  var parts = timeOfDay.split(":");
  return dayOffset*24*60 + parseInt(parts[0])*60 + parseInt(parts[1]);
}

loops = [];

// Schedule repeated rides.
// Times are given as minute offsets from the beginning of the week.
function schedule(line, frequency, start, end) {
  var rideStart = start;
  while (rideStart < end) {
    scheduleRide(line, rideStart);
    rideStart += frequency;
  }
}

// A list of rides in the format:
// {
//   start: [Tone.TransportTime],
//   line: [Line object from metro]
// }
// Should be used when transport is re-started to re-initialize active ride.
var rides = [];
var activeRides = [];
function scheduleRide(line, rideStart) {
  // rides.push([{
  //   start: new Tone.TransportTime(minutesToTransportTime(rideStart)),
  //   line: line
  // });
  var part = new Tone.Part(
    function(eventTime, station) {
      if (station == 0) {
        Tone.Draw.schedule(function() {
          activeRides.push({start: new Tone.TransportTime(minutesToTransportTime(rideStart)), line: line})
        }, eventTime);
      }
      //console.log("Ride", station);
      var note = notes.green[station];
      if (!note) return;
      //console.log("Triggering note");
	    //the value is an object which contains both the note and the velocity
  	  synth.triggerAttackRelease(note, "8n", eventTime); // , value.velocity);
    },
    getStationTimes(line)
  ).start(minutesToTransportTime(rideStart));
  //console.log(getStationTimes(line, time));
  parts.push(part);
}

var parts = [];
var notes = {
  green: [
    "C4",
    "D4",
    "E4",
    null,
    "F4",
    null,
    null,
    null,
    "G4"
  ]
};

var fmParameters1 = {
  // Tone.js default sounds nice too.
};
var fmParameters2 = {
  // From fmSynth.html example.
  "modulationIndex" : 12.22,
  "envelope" : {
    "attack" : 0.01,
    "decay" : 0.2
  },
  "modulation" : {
    "type" : "square"
  },
  "modulationEnvelope" : {
    "attack" : 0.2,
    "decay" : 0.01
  }
};
// TODO: Add a pad preset from somewhere.
var synth = new Tone.PolySynth(4, Tone.FMSynth, fmParameters1).toMaster(); //TODO: larger polyphony?

/// Return an array with [timeOffset, stationIndex] for line.
function getStationTimes(line) {
  var times = [];
  //var time = start;
  //var time = 0;
  for (var i = 0; i < line.times.length; i++) {
    var time = new Tone.TransportTime(minutesToTransportTime(line.times[i])).toSeconds();
    times.push([time, i]);
  }
  return times;
}

// Every minutes is one beat.
function minutesToTransportTime(minutes) {
  return "0:" + minutes + ":0";
}

function minutesToSeconds(minutes) {
  return Tone.TransportTime(minutesToTransportTime(minutes)).toSeconds();
}

var t = timeOfDayToMinuteOffset;

function getRideId(start, line) {
  return line.name + "_" + start;
}

start();

function updateParameters() {
  var harmonicity = getHour();
  if (harmonicity < 12) {
    harmonicity = harmonicity / 2;
  } else {
    harmonicity = (24 - harmonicity) / 2;
  }
  if (isPeak()) {
    // TODO: maybe make it gradually more detuned when closer to peak of peak
    harmonicity *= 1.1;
  }
  synth.set("harmonicity", harmonicity);
  var minute = getMinute();
  minute = minute < 30 ? minute : 60 - minute;
  // Ranges between 0-450 (highest in the middle of an hour.)
  var modulationIndex = minute * 15;
  synth.set("modulationIndex", modulationIndex);

  $("#harmonicity").text(harmonicity);
  $("#modulation-index").text(modulationIndex);
}

function updateTime() {
  $("#time").text(getTimeOfDay());
  $("#peak").text(isPeak() ? "Peak" : "Non-peak");
}

function getMinuteOffsetInDay() {
  return getMinuteOffset() % (24*60);
}

function getHour() {
  return Math.floor(getMinuteOffsetInDay() / 60);
}
function getMinute() {
  return getMinuteOffsetInDay() % 60;
}

function isPeak() {
  var hour = getHour();
  return (hour >= 7 && hour < 9) || (hour >= 16 && hour < 18);
}

// Minute offset since beginning of time (int).
function getMinuteOffset() {
  var quarterTime = Tone.Transport.PPQ; // One quarter in ticks.
  var quarters = Tone.Transport.ticks / quarterTime;
  // In our simulation, each quarter note is a 'minute'.
  return Math.floor(quarters);
}

function getTimeOfDay() {
  return getHour() + ":" + getMinute();
}

function goToTime(hour, minute, dayOfWeek) {
  if (!dayOfWeek) dayOfWeek = 0;
  Tone.Transport.position = minutesToTransportTime(dayOfWeek*24*60 + hour*60 + minute);
}
