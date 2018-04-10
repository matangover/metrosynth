function start() {
  // //create a synth and connect it to the master output (your speakers)
  // var synth = new Tone.Synth().toMaster();
  //
  // //play a middle 'C' for the duration of an 8th note
  // synth.triggerAttackRelease("C4", "8n");
  // Tone.Transport.start(2);

  scheduleWeekdays(metro.lines.green);

  var startOffset = t(metro.lines.green.hours[0].weekdays.first);
  Tone.Transport.start(Tone.now(), minutesToTransportTime(startOffset));
}

function scheduleWeekdays(line) {
  var frequencies = line.frequencies.weekdays;
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

function schedule(line, frequency, start, end) {
  var loop = new Tone.Loop(
    function (time) {
      console.log("Starting ride", frequency, start, end);
      scheduleRide(line, time);
    },
    minutesToTransportTime(frequency)
  );
  loop.start(minutesToTransportTime(start)).stop(minutesToTransportTime(end));
  loops.push(loop);
}

var parts = [];
var notes = {
  green: [
    "C4",
    null,
    null,
    null,
    //"E4"
  ]
};

var synth = new Tone.PolySynth().toMaster(); //TODO: larger polyphony?
var rides = [];

function scheduleRide(line, time) {
  var part = new Tone.Part(
    function(eventTime, station) {
      //console.log("Ride", station);
      var note = notes.green[station];
      if (!note) return;
      //console.log("Triggering note");
	    //the value is an object which contains both the note and the velocity
  	  synth.triggerAttackRelease(note, "8n", eventTime); // , value.velocity);
    },
    getStationTimes(line, time)
  ).start("+0");
  //console.log(getStationTimes(line, time));
  parts.push(part);
}

/// Return an array with [timeOffset, stationIndex] for line.
function getStationTimes(line, start) {
  var times = [];
  //var time = start;
  var time = 0;
  for (var i = 0; i < line.times.length; i++) {
    time += new Tone.TransportTime(minutesToTransportTime(line.times[i])).toSeconds();
    times.push([time, i]);
  }
  return times;
}

// Every minutes is one beat.
function minutesToTransportTime(minutes) {
  return "0:" + minutes + ":0";
}

var t = timeOfDayToMinuteOffset;


start();
