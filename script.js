let player;

const pitchToFrequency = {
  C: 16.35,
  "C#": 17.32,
  D: 18.35,
  "D#": 19.45,
  E: 20.6,
  F: 21.83,
  "F#": 23.12,
  G: 24.5,
  "G#": 25.96,
  A: 27.5,
  "A#": 29.14,
  B: 30.87,
};

function getFrequency(pitch, octave) {
  if (!pitchToFrequency[pitch] || octave < 3 || octave > 6) {
    return 440; // Default to A4 if invalid input
  }
  const baseFrequency = pitchToFrequency[pitch];
  return baseFrequency * Math.pow(2, octave - 1);
}

window.onload = function () {
  document.body.addEventListener("click", init, { once: true });
};

function init() {
  Tone.start().then(() => {
    const waveform = document.getElementById("waveform").value;
    const pitch = document.getElementById("pitch").value;
    const octave = parseInt(document.getElementById("octave").value, 10);
    const frequency = getFrequency(pitch, octave);

    player = new Tone.Oscillator({
      type: waveform,
      frequency: frequency,
    }).toDestination();

    Tone.Transport.bpm.value = 52;

    Tone.Transport.scheduleRepeat((time) => {
      player.start(time).stop(time + 0.1);
    }, "4n");
  });
}

function toggleTransport() {
  if (Tone.Transport.state !== "started") {
    Tone.Transport.start();
    startStopButton.innerHTML = "STOP";
  } else {
    Tone.Transport.stop();
    startStopButton.innerHTML = "START";
  }
}

const startStopButton = document.getElementById("startStop");
startStopButton.addEventListener("click", toggleTransport);

function syncNum() {
  const bpmSlider = document.getElementById("bpmSlider");
  const bpmNum = document.getElementById("bpmNum");
  const bpm = bpmSlider.value;
  bpmNum.value = bpm;
  Tone.Transport.bpm.value = bpm;
}

function syncSlide() {
  const bpmSlider = document.getElementById("bpmSlider");
  const bpmNum = document.getElementById("bpmNum");
  const bpm = bpmNum.value;
  bpmSlider.value = bpm;
  Tone.Transport.bpm.value = bpm;
}

document.getElementById("waveform").addEventListener("change", function () {
  if (player) {
    player.type = this.value;
  }
});

document.getElementById("pitch").addEventListener("change", updateFrequency);
document.getElementById("octave").addEventListener("change", updateFrequency);

function updateFrequency() {
  if (player) {
    const pitch = document.getElementById("pitch").value;
    const octave = parseInt(document.getElementById("octave").value, 10);
    const frequency = getFrequency(pitch, octave);
    player.frequency.setValueAtTime(frequency, Tone.now());
  }
}

function clearInput(input) {
  input.value = "";
}
