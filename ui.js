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
})

function createToggle(line) {
  var toggle = new Nexus.Toggle('#' + line + '-mute', {state: true});
  toggle.colorize("accent",line);

  toggle.on('change',function(v) {
    if (!instruments[line]) return;
    instruments[line].volume.value = v ? 0 : -Infinity;
  });
}
