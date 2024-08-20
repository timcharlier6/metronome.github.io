document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    incrementButton: document.getElementById("increment-button"),
    decrementButton: document.getElementById("decrement-button"),
    bpmInput: document.getElementById("bpmNum"),
    startStopButton: document.getElementById("startStop"),
    waveformSelect: document.getElementById("waveform"),
    pitchSelect: document.getElementById("pitch"),
    octaveSelect: document.getElementById("octave"),
  };

  const defaultBPM = 52;
  let bpm = defaultBPM;
  let minBPM = parseInt(elements.bpmInput.min, 10);
  let maxBPM = parseInt(elements.bpmInput.max, 10);

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

  const getFrequency = (pitch, octave) =>
    pitchToFrequency[pitch] * Math.pow(2, octave);

  const updateFrequency = () => {
    const pitch = elements.pitchSelect.value;
    const octave = parseInt(elements.octaveSelect.value, 10);
    if (player) {
      player.frequency.setValueAtTime(getFrequency(pitch, octave), Tone.now());
    }
  };

  const updateBPM = () => {
    bpm = parseInt(elements.bpmInput.value, 10);
    Tone.Transport.bpm.value = bpm;
  };

  const handleBPMInput = () => {
    let value = parseInt(elements.bpmInput.value.trim(), 10);
    if (isNaN(value) || value < minBPM || value > maxBPM) {
      elements.bpmInput.value = defaultBPM;
    } else {
      elements.bpmInput.value = value;
      updateBPM();
    }
  };

  const initializePlayer = () => {
    player = new Tone.Oscillator({
      type: elements.waveformSelect.value,
      frequency: getFrequency(
        elements.pitchSelect.value,
        parseInt(elements.octaveSelect.value, 10),
      ),
    }).toDestination();

    Tone.Transport.bpm.value = bpm;
    Tone.Transport.scheduleRepeat((time) => {
      player.start(time).stop(time + 0.1);
    }, "4n");
  };

  const toggleTransport = async () => {
    await Tone.start();
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
      elements.startStopButton.textContent = "STOP";
    } else {
      Tone.Transport.stop();
      elements.startStopButton.textContent = "START";
    }
  };

  elements.incrementButton.addEventListener("click", () => {
    let currentValue = parseInt(elements.bpmInput.value, 10);
    if (currentValue < maxBPM) {
      elements.bpmInput.value = currentValue + 1;
      updateBPM();
    }
  });

  elements.decrementButton.addEventListener("click", () => {
    let currentValue = parseInt(elements.bpmInput.value, 10);
    if (currentValue > minBPM) {
      elements.bpmInput.value = currentValue - 1;
      updateBPM();
    }
  });

  elements.bpmInput.addEventListener(
    "focus",
    () => (elements.bpmInput.value = ""),
  );
  elements.bpmInput.addEventListener("blur", handleBPMInput);
  elements.bpmInput.addEventListener("change", handleBPMInput);

  elements.waveformSelect.addEventListener("change", () => {
    if (player) {
      player.type = elements.waveformSelect.value;
    }
  });

  elements.pitchSelect.addEventListener("change", updateFrequency);
  elements.octaveSelect.addEventListener("change", updateFrequency);

  elements.startStopButton.addEventListener("click", toggleTransport);

  initializePlayer();
});
