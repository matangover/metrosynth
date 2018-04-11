$(function() {
  LINES = ["orange", "yellow", "blue", "green"];
  COLORS = {
    // orange: orange,
    // yellow
  }
  for (var i = 0; i < LINES.length; i++) {
    line = LINES[i];
    createToggle(line);
  }

  var button = new Nexus.TextButton('#play', {
    'size': [100,80],
    'state': false,
    'text': 'Go',
    'alternateText': 'Pause'
  });

  button.on('change',function(v) {
    if (v) {
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
  })


  Nexus.context = Tone.context;
  var spectrogram = new Nexus.Spectrogram('#spectrum',{
    'size': [170, 100]
  });
  spectrogram.connect(Tone.Master);

  $("#time").click(function() {
    var newTime = prompt("Set time:");
    try {
      Tone.Transport.position = minutesToTransportTime(timeOfDayToMinuteOffset(newTime));
    } catch(error) {
      // Wrong format.
    }
  });

  var speedSlider = new Nexus.Dial('#speed-slider', {
    'min': 20,
    'max': 500,
    'step': 1,
    value: 120
  })
  var speedNumber = new Nexus.Number('#speed-number')
  speedNumber.link(speedSlider)
  speedSlider.on('change',function(v) {
    Tone.Transport.bpm.value = Math.round(v);
  });
});

function createToggle(line) {
  var toggle = new Nexus.Toggle('#' + line + '-mute', {state: true});
  toggle.colorize("accent",line);

  toggle.on('change',function(v) {
    if (!instruments[line]) return;
    instruments[line].volume.value = v ? 0 : -Infinity;
  });
}
