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
    Tone.Transport.position = minutesToTransportTime(timeOfDayToMinuteOffset(newTime));
  });
})

function createToggle(line) {
  var toggle = new Nexus.Toggle('#' + line + '-mute', {state: true});
  toggle.colorize("accent",line);

  toggle.on('change',function(v) {
    if (!instruments[line]) return;
    instruments[line].volume.value = v ? 0 : -Infinity;
  });
}
