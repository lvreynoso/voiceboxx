// test.js
import { findPitch } from '/web_modules/pitchy.js';
import Vex from '/web_modules/vexflow.js';

// VexFlow setup
var VF = Vex.Flow;
var node = document.getElementById('vexcontainer');
node.width = `${window.innerWidth / 2}px`
node.height = `${window.innerHeight / 4}px`
var renderer = new VF.Renderer(node, VF.Renderer.Backends.SVG);
renderer.resize(window.innerWidth / 2, window.innerHeight / 4);
var context = renderer.getContext();
// context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

document.addEventListener("DOMContentLoaded", () => {
  // For cross-browser compatibility.
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let analyserNode = audioContext.createAnalyser();

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    let sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(analyserNode);
    updatePitch(analyserNode, audioContext.sampleRate);
  });
});

window.onload = function() {
  setupVF();
}

function setupVF() {
  // Create a stave at position 10, 40 of width 10000 on the canvas.
  let stave = new VF.Stave(10, 40, 10000);

  // Add a clef and time signature.
  stave.addClef("treble").addTimeSignature("4/4");

  // Connect it to the rendering context and draw!
  stave.setContext(context).draw();

  // get the tab from the vextab node
  let data = document.getElementById('vextab').textContent.split("\n**TIES**\n")
  let tabs = data[0].split("\n");
  // turn them in VF notes
  let rawNotes = tabs.map(tab => {
    let properties = tab.split(" ")
    if (properties.length < 3) {
      return 99
    }
    let note = new VF.StaveNote({clef: "treble", keys: [properties[0]], duration: properties[2]})
    switch (properties[1]) {
      case "sd":
        note.addDot(0)
      case "s":
        note.addAccidental(0, new VF.Accidental("#"))
        break
      case "fd":
        note.addDot(0)
      case "f":
        note.addAccidental(0, new VF.Accidental("b"))
        break
      case "d":
        note.addDot(0)
        break
      default:
        break
    }
    return note
  })

  let notes = rawNotes.filter(note => note != 99);

  // create a VF 'voice' and add it to the canvas
  let voice = new VF.Voice({num_beats: 4,  beat_value: 4});
  voice.setStrict(false);
  voice.addTickables(notes);
  let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);

  // draw the beams
  let beams = VF.Beam.generateBeams(notes)
  beams.forEach(beam => {
    beam.setContext(context).draw()
  })

  // draw the ties
  // let tieData = data[1].split("\n");
  // let rawTies = tieData.map(line => {
  //   let i = line.split(" ");
  //   if (i.length < 2) {
  //     return 99
  //   }
  //   let tie = new VF.StaveTie({
  //     first_note: notes[i[0]],
  //     last_note: notes[i[1]],
  //     first_indices: [0],
  //     last_indices: [0]
  //   })
  //   return tie
  // })
  // let ties = rawTies.filter(tie => tie != 99);
  // ties.forEach(tie => {tie.setContext(context).draw()})

}

function updatePitch(analyserNode, sampleRate) {
  let data = new Float32Array(analyserNode.fftSize);
  analyserNode.getFloatTimeDomainData(data);
  let [pitch, clarity] = findPitch(data, sampleRate);

  if (clarity > 0.97) {
    let converted = pitchToNote(pitch)
    let roundedPitch = Math.round(pitch * 100) / 100
    let roundedClarity = Math.round(clarity * 100)
    document.getElementById('mic').src = "/img/online.png"
    document.getElementById('pitch').textContent = String(roundedPitch);
    document.getElementById('note').textContent = converted.note;
    document.getElementById('octave').textContent = converted.octave;
    document.getElementById('tuning').textContent = converted.tune;
    document.getElementById('clarity').textContent = String(roundedClarity);
    document.getElementById('clarity').style.color = "green"
  } else {
    let roundedClarity = Math.round(clarity * 100)
    document.getElementById('mic').src = "/img/offline.png"
    document.getElementById('clarity').textContent = String(roundedClarity);
    document.getElementById('clarity').style.color = "red"
  }
  window.requestAnimationFrame(() => updatePitch(analyserNode, sampleRate));
}

function pitchToNote(pitch) {
  // A4 = 440 Hz
  // Note frequencies are found using the equation
  // f(n) = 440 * (2^(1/12))^(n)
  // where n is the number of half steps the note is from A4
  // n may be positive, indicating higher notes, or negative, for lower notes
  // 12 half steps in an octave

  let A4 = 440
  let a = Math.pow(2, (1/12))
  let stepAbove = undefined
  let stepBelow = undefined
  let steps = {
    above: 0,
    below: 0
  }

  // step through scales to find nearest notes
  if (pitch >= A4) {
    for (let i = 0; i <= 50; i++) {
      let frequency = A4 * Math.pow(a, i)
      let nextFrequency = A4 * Math.pow(a, i + 1)
      if (pitch >= frequency && pitch <= nextFrequency) {
        stepAbove = nextFrequency
        steps.above = i + 1
        stepBelow = frequency
        steps.below = i
        break
      }
    }
  } else {
    for (let i = 0; i >= -57; i--) {
      let frequency = A4 * Math.pow(a, i)
      let nextFrequency = A4 * Math.pow(a, i - 1)
      if (pitch <= frequency && pitch >= nextFrequency) {
        stepAbove = frequency
        steps.above = i
        stepBelow = nextFrequency
        steps.below = i - 1
        break
      }
    }
  }

  // if we didn't find a note, return early
  if (stepAbove == undefined || stepBelow == undefined) {
    let outside = {
      note: "Outside Range",
      tune: "Outside Range"
    }
    return outside
  }

  let closest = undefined
  let n = undefined
  // figure out which note is closer, and remember how many steps away it is
  if (Math.abs(pitch - stepBelow) < Math.abs(pitch - stepAbove)) {
    closest = stepBelow
    n = steps.below
  } else {
    closest = stepAbove
    n = steps.above
  }

  let tuning = ""
  // see how out of tune we are
  let ratio = Math.max(pitch, closest) / Math.min(pitch, closest)
  switch (ratio < 1.042) {
    case true:
      tuning = "Perfect"
      break
    case false:
      if (pitch > closest) {
        tuning = "Sharp"
      } else {
        tuning = "Flat"
      }
      break
  }

  // finally find the note for our pitch
  let octave = 4
  let index = 9
  let note = ""
  let notes = ["C","C♯/D♭","D","D♯/E♭","E","F","F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"]
  if (n >= 0) {
    for (let i = 0; i <= n; i++) {
      if (index > 11) {
        index = 0
        octave += 1
      }
      note = notes[index]
      index += 1
    }
  } else {
    for (let i = 0; i >= n; i--) {
      if (index < 0) {
        index = 11 
        octave -= 1 
      }
      note = notes[index]
      index -= 1
    }
  }

  let output = {
    note: `${note}`,
    octave: `${octave}`,
    tune: tuning
  }

  return output
}


// C0  16.35
// C#0/Db0    17.32
// D0  18.35
// D#0/Eb0    19.45
// E0  20.60
// F0  21.83
// F#0/Gb0    23.12
// G0  24.50
// G#0/Ab0    25.96
// A0  27.50
// A#0/Bb0    29.14
// B0  30.87
// C1  32.70
// C#1/Db1    34.65
// D1  36.71
// D#1/Eb1    38.89
// E1  41.20
// F1  43.65
// F#1/Gb1    46.25
// G1  49.00
// G#1/Ab1    51.91 
// A1  55.00 
// A#1/Bb1    58.27 
// B1  61.74 
// C2  65.41 
// C#2/Db2    69.30 
// D2  73.42 
// D#2/Eb2    77.78 
// E2  82.41 
// F2  87.31 
// F#2/Gb2    92.50 
// G2  98.00 
// G#2/Ab2    103.83
// A2  110.00
// A#2/Bb2    116.54
// B2  123.47
// C3  130.81
// C#3/Db3    138.59
// D3  146.83
// D#3/Eb3    155.56
// E3  164.81
// F3  174.61
// F#3/Gb3    185.00
// G3  196.00
// G#3/Ab3    207.65
// A3  220.00
// A#3/Bb3    233.08
// B3  246.94
// C4  261.63
// C#4/Db4    277.18
// D4  293.66
// D#4/Eb4    311.13
// E4  329.63
// F4  349.23
// F#4/Gb4    369.99
// G4  392.00
// G#4/Ab4    415.30
// A4  440.00
// A#4/Bb4    466.16
// B4  493.88
// C5  523.25
// C#5/Db5    554.37
// D5  587.33
// D#5/Eb5    622.25
// E5  659.25
// F5  698.46
// F#5/Gb5    739.99
// G5  783.99
// G#5/Ab5    830.61
// A5  880.00
// A#5/Bb5    932.33
// B5  987.77
// C6  1046.50 
// C#6/Db6    1108.73 
// D6  1174.66 
// D#6/Eb6    1244.51 
// E6  1318.51 
// F6  1396.91 
// F#6/Gb6    1479.98 
// G6  1567.98 
// G#6/Ab6    1661.22 
// A6  1760.00 
// A#6/Bb6    1864.66 
// B6  1975.53
// C7  2093.00
// C#7/Db7    2217.46
// D7  2349.32
// D#7/Eb7    2489.02
// E7  2637.02
// F7  2793.83
// F#7/Gb7    2959.96
// G7  3135.96
// G#7/Ab7    3322.44
// A7  3520.00
// A#7/Bb7    3729.31
// B7  3951.07
// C8  4186.01
// C#8/Db8    4434.92
// D8  4698.63
// D#8/Eb8    4978.03
// E8  5274.04
// F8  5587.65
// F#8/Gb8    5919.91
// G8  6271.93
// G#8/Ab8    6644.88
// A8  7040.00
// A#8/Bb8    7458.62
// B8  7902.13