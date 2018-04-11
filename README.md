# MetroSynth
### What happens when train tracks are turned into sound tracks?

## Overview
Metro events are run in a simulated timeline according to the real schedule defined in `metro.js`.
The timeline is based on the Tone.js `Transport` ([docs](https://github.com/Tonejs/Tone.js/wiki/TransportTime)) so it can be scrubbed and sped up as desired.

## Metro data
STM provides GTFS data for all of Montreal's public transport system, however, exact metro departure times are not specified. The metro data only includes the ride duration between each station.

The metro map is an SVG converted from the vector PDF supplied by STM. Line paths are traced directly from the SVG.

## Audio
Audio is synthesized using Tone.js which is based on the Web Audio API. Web Audio provides audio-rate constructs which do not go through the JavaScript event loop and provide real-time gapless audio processing.

## Synthesis methods
### Tracks
- Green line: [FMSynth](https://tonejs.github.io/docs/r12/FMSynth) with the default parameters. Made polyphonic using [PolySynth](https://tonejs.github.io/docs/r12/PolySynth).
 - Harmonicity varies in range 0-6 in multiples of 0.5. It is further multipled by 1.1 in during peak hours.
 - Modulation index varies every minute in range 0-450.
- Yellow line: [AMSynth](https://tonejs.github.io/docs/r12/AMSynth) with the default parameters. Made polyphonic using [PolySynth](https://tonejs.github.io/docs/r12/PolySynth).
  - Harmonicity varies continuously in the range 0-5.
- Blue line: a "Fat Synth", three oscillators that are slightly detuned from each other and added together, with an amplitude envelope. Additionally, pitches are transposed up to a fifth up according to the hour.
- Orange line: [MembraneSynth](https://tonejs.github.io/docs/r12/MembraneSynth) - single oscillator with an amplitude envelope and frequency ramp.

### Global
All outputs are routed to a lowpass filter (implemented as a biquad filter). The filter cutoff frequency gradually becomes lower as the day comes to a close.

The output of the filter is routed to a JCReverb node (Schroeder all-pass reverberator).
## Graphics
Paper.js is used for vector graphics constructs. It can do useful computations such as finding a point on a path with a certain offset.

## Code
In addition to manipulating the user interface, you can execute the following commands in the console.

#### Modifying reverb
```javascript
// Reverb constant from 0-1.
reverb.roomSize.value = 0.8;
```
#### Altering notes
```javascript
notes.yellow[1] = "E5";
```
