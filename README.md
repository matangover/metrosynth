# MetroSynth
What happens when train tracks are turned into sound tracks?
[See for yourself!](https://www.matangover.com/metrosynth)


![MetroSynth screenshot](/screenshot.png?raw=true)

## Overview
MetroSynth is an interactive sonification of public transport schedules. The Montreal metro system is run in a simulated timeline according to the real schedule. The metro system acts like a sequencer: when a metro train arrives at a station, it triggers a musical event assigned to that station.

The user interface consists of a metro map and on top of it red circles represent the current location of metro trains. Additional controls include:
- A clock showing the current simulated time. Skip to another time by clicking the clock.
- A pause/play button.
- A dial controlling the 'speed-up' factor of the simulation (20x - 500x).
- Mute controls for each individual metro line.
- Numeric indicators showing synthesis parameters.
- A graphical display of the audio spectrum.

## Schedules
Metro schedules, defined in [`metro.js`](/metro.js), were taken from the official STM website. Metro schedules are approximate, since STM doesn't provide exact departure times from each station. Instead, it provides a departure frequency from the origin station and the duration it takes to travel between stations.

Currently, only one day of events is simulated, according to a weekday schedule. All the necessary infrastructure and data needed to simulate a whole week, including weekend schedules, are already in place.

## Audio
The audio generation ([sound.js](/sound.js)) is based on the [Tone.js](https://tonejs.github.io) library, which is itself based on the [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) API. Web Audio provides efficient audio building blocks that are accessible through JavaScript but still have real-time performance because the audio processing is independent from the JavaScript event loop. Tone.js provides a large set of tools on top of Web Audio for sound synthesis, effects, and sequencing.

The simulation timeline is based on the Tone.js [`Transport`](https://github.com/Tonejs/Tone.js/wiki/TransportTime). Train arrivals at stations are scheduled as musical events on the transport, so that any change to the global transport speed or position affects any event's playback.

### Track Synthesis
Each metro line is modeled as a separate audio track. Each track has its own 'instrument', that is, synthesis method, on which the line's musical events are played.

- Green line: [FMSynth](https://tonejs.github.io/docs/r12/FMSynth) with the default parameters. Made polyphonic using [PolySynth](https://tonejs.github.io/docs/r12/PolySynth).
 - Harmonicity varies according to the current hour in range 0-6 in multiples of 0.5. It is further multiplied by 1.1 in during peak hours.
 - Modulation index varies according to the current minute in range 0-450.
- Yellow line: [AMSynth](https://tonejs.github.io/docs/r12/AMSynth) with the default parameters. Made polyphonic using [PolySynth](https://tonejs.github.io/docs/r12/PolySynth).
  - Harmonicity varies continuously according to the current minute in the range 0-5.
- Blue line: a "Fat Synth" - three oscillators that are slightly detuned from each other and added together, with an amplitude envelope. Additionally, pitches are transposed by a varying amount of semitones (up to a fifth) according to the current hour.
- Orange line: [MembraneSynth](https://tonejs.github.io/docs/r12/MembraneSynth) - single oscillator with an amplitude envelope and frequency ramp that causes it to sound like a membrane (drum).

### Filters and Effects
All track outputs are routed to a lowpass filter (implemented as a biquad filter). The filter cutoff frequency gradually becomes lower as the time of day progresses, creating a "shut down" effect when night arrives.

The output of the lowpass filter is routed to a [JCReverb](https://tonejs.github.io/docs/r12/JCReverb) node, which is the reverberation simulator that uses chained Schroeder allpass sections and feedback comb filters.

## Graphics

The graphics rendering ([graphics.js](/graphics.js)) is implemented using the [Paper.js](http://paperjs.org/) vector graphics library. The metro map is a vector graphic obtained by converting the offical STM PDF metro map into an SVG file. The SVG file is loaded and converted into Paper.js objects. Every line's geometric path object, labelled manually in the SVG file beforehand, is then obtained from the Paper.js object tree. Train objects are drawn on top of the tracks by computing an offset position along the path.

To ensure a high rendering frame-rate, the graphics loop (Paper.js `onFrame`, called from a `requestAnimationFrame` browser callback) is separated from the audio loop (Tone.js `Transport` event callbacks). An in-memory data structure of active trains is kept to coordinate between the audio and the graphics simulation.

In order to realistically display the movement of trains along the tracks, each station's offset along its track was determined. (This had to be done half-manually because the stations are not part of the same path in the SVG.) When displaying the train graphics, the graphics code takes into account the duration of travel between each station to dynamically alter the speed of the train between each pair of stations. The metro map is not drawn to scale so the speed changes considerably among pairs of stations.

Audio controls, including the spectrum display, are implemented using the [NexusUI](https://nexus-js.github.io/ui/api/) library.

## Code manipulations
In addition to manipulating the user interface, you can execute the following commands in the console to dynamically alter the sonification.

#### Modifying reverb
```javascript
// Reverb constant from 0-1.
reverb.roomSize.value = 0.8;
```
#### Altering notes
```javascript
// Use the metro as your own sequencer.
notes.yellow[1] = "E5";
notes.green[3] = "C#4";
```
# Improvement ideas
- User interface for modifying the musical event associated to a station.
- Grant the user more control over the sound synthesis mapping assigned to each line.
- Enable granular control of synthesis envelopes, perhaps even generated directly from the graphical shape of the track.
- Graphical indiction of time of day - background is bright during the day and dark during the night.
- Enable saving and sharing "metrosynth creations" with your friends.
- Better default sonification presets.
- Mobile browser support.
- Cross-browser testing.
- Run trains in both directions. (With option to disable.)
- Use schedules for the whole week instead of just one day.
- Sonify bus schedules as well.
- Incorporate random service interruptions or delays.
- Use real-time bus arrival schedules, expected to be published by STM sometime in 2018.
