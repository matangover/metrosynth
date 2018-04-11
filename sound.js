var updateParametersInterval;
var updateTimeInterval;
var reverb;
var filter;
var output = new Tone.Signal();

function start() {
  scheduleWeekdays(metro.lines.green);
  scheduleWeekdays(metro.lines.yellow);
  scheduleWeekdays(metro.lines.orange);
  scheduleWeekdays(metro.lines.blue);

  var startOffset = t(metro.lines.green.hours[0].weekdays.first);
  // Give some time before the start.
  startOffset -= 10;
  //Tone.Transport.start(Tone.now(), minutesToTransportTime(startOffset));
  Tone.Transport.position = minutesToTransportTime(startOffset);
  updateParametersInterval = setInterval(updateParameters, 1000);
  Tone.Transport.on("start", updateParameters);
  updateTimeInterval = setInterval(updateTime, 300);
  reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
  filter = new Tone.Filter().connect(reverb);
  output.connect(filter);
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
    schedule(line, frequencies.nonpeak, nonPeakStart, t(line.hours[0].weekdays.last, 1));
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

schedulingCallbacks = {
  blue: scheduleBlue
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
      var note = notes[line.name][station];
      if (!note) return;
      if (schedulingCallbacks[line.name]) {
        schedulingCallbacks[line.name](rideStart, note, eventTime);
      } else {
        //console.log("Triggering note");
        //the value is an object which contains both the note and the velocity
	      instruments[line.name].triggerAttackRelease(note, "8n", eventTime); // , value.velocity);
      }
    },
    getStationTimes(line)
  ).start(minutesToTransportTime(rideStart));
  //console.log(getStationTimes(line, time));
  parts.push(part);
}

var pitchShifts = [0, 2, 3, 5, 7];
function scheduleBlue(rideStart, note, eventTime) {
  var pitches = note[0];
  var duration = note[1];
  // every hour change harmony
  var hour = Math.floor(rideStart / 60) % 24;
  hour = hour % 10;
  var pitchShiftIndex = hour < 5 ? hour : 9-hour;
  var pitchShift = pitchShifts[pitchShiftIndex];
  for (var i = 0; i < pitches.length; i++) {
    var pitch = Tone.Frequency(pitches[i]).transpose(pitchShift);
    instruments.blue.triggerAttackRelease(pitch, duration, eventTime)
  }
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
  ],
  yellow: [
    null,
    "A5",
    "D1"
  ],
  orange: [
    null,
    null,
    null,
    "C2",
    null,
    "G1",
    "D2",
    null,
    null,
    null,
    "F2",
    null,
    null,
    "G2",
    "C2",
    null,
    null,
    null,
    "A3"

  ],
  blue: [[["A2"], "4n"], null, null, [["G4", "C5","E5"], "2n"], [["F#4", "C5","D5"], "4n"], null, null, null, [["E5", "G5","B5"], "8n"]]
};

var fmParameters1 = {
  // Tone.js default are nice:
  // Tone.FMSynth.defaults = {
	// 	"harmonicity" : 3,
	// 	"modulationIndex" : 10,
	// 	"detune" : 0,
	// 	"oscillator" : {
	// 		"type" : "sine"
	// 	},
	// 	"envelope" : {
	// 		"attack" : 0.01,
	// 		"decay" : 0.01,
	// 		"sustain" : 1,
	// 		"release" : 0.5
	// 	},
	// 	"modulation" : {
	// 		"type" : "square"
	// 	},
	// 	"modulationEnvelope" : {
	// 		"attack" : 0.5,
	// 		"decay" : 0.0,
	// 		"sustain" : 1,
	// 		"release" : 0.5
	// 	}
	// };
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
var fmPolySynth = new Tone.PolySynth(4, Tone.FMSynth, fmParameters1).connect(output); //TODO: larger polyphony?
var fatSynth = new Tone.PolySynth(3, Tone.Synth, {
	"oscillator" : {
		"type" : "fatsawtooth",
		"count" : 3,
		"spread" : 30
	},
	"envelope": {
		"attack": 0.01,
		"decay": 0.1,
		"sustain": 0.5,
		"release": 0.4,
		"attackCurve" : "exponential"
	},
}).connect(output);

var instruments = {
  green: fmPolySynth,
  //yellow: new Tone.PolySynth().connect(output),
  yellow: new Tone.PolySynth(4, Tone.AMSynth).connect(output),
  blue: fatSynth,
  orange: new Tone.MembraneSynth().connect(output)
}
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
  instruments.green.set("harmonicity", harmonicity);
  var minute = getMinute();
  minute = minute < 30 ? minute : 60 - minute;
  // Ranges between 0-450 (highest in the middle of an hour.)
  var modulationIndex = minute * 15 * getHour() / 24;
  instruments.green.set("modulationIndex", modulationIndex);

  $("#harmonicity").text("H: " + harmonicity.toFixed(2));
  $("#modulation-index").text("I: " + modulationIndex);

  instruments.yellow.set("harmonicity", getMinute() / 60 * 5);

  var minuteOffset = getMinuteOffsetInDay();
  // 2:00 AM should still be 'end of the day'.
  minuteOffset -= 3*60;
  if (minuteOffset < 0) {
    minuteOffset += 24*60;
  }
  var minutesPerDay = 24*60;
  filter.frequency.value = 10000 - 9950 *(minuteOffset / minutesPerDay);
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
  return getHour().toString().padStart(2, "0") + ":" + getMinute().toString().padStart(2, "0");
}

function goToTime(hour, minute, dayOfWeek) {
  if (!dayOfWeek) dayOfWeek = 0;
  Tone.Transport.position = minutesToTransportTime(dayOfWeek*24*60 + hour*60 + minute);
}
