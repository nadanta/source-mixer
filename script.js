let audioCtx;
let oscillator;
let gainNode;
let isPlaying = false;

const toggleBtn = document.getElementById("toggle");
const waveformSelect = document.getElementById("waveform");
const frequencySlider = document.getElementById("frequency");
const volumeSlider = document.getElementById("volume");
const freqValue = document.getElementById("freqValue");
const volValue = document.getElementById("volValue");

toggleBtn.addEventListener("click", () => {
  if (!isPlaying) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = waveformSelect.value;
    oscillator.frequency.setValueAtTime(frequencySlider.value, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(volumeSlider.value, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();

    toggleBtn.textContent = "Stop";
    isPlaying = true;
  } else {
    oscillator.stop();
    toggleBtn.textContent = "Play";
    isPlaying = false;
  }
});

waveformSelect.addEventListener("change", () => {
  if (oscillator && isPlaying) {
    oscillator.type = waveformSelect.value;
  }
});

frequencySlider.addEventListener("input", () => {
  freqValue.textContent = frequencySlider.value;
  if (oscillator && isPlaying) {
    oscillator.frequency.setValueAtTime(frequencySlider.value, audioCtx.currentTime);
  }
});

volumeSlider.addEventListener("input", () => {
  volValue.textContent = volumeSlider.value;
  if (gainNode && isPlaying) {
    gainNode.gain.setValueAtTime(volumeSlider.value, audioCtx.currentTime);
  }
});
