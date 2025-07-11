let audioCtx;
let isPlaying = false;
let oscillators = [];

const toggleBtn = document.getElementById("toggle");

toggleBtn.addEventListener("click", () => {
  if (!isPlaying) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillators = [];

    document.querySelectorAll(".oscillator").forEach(panel => {
      const waveform = panel.querySelector(".waveform").value;
      const frequency = panel.querySelector(".frequency").value;
      const volume = panel.querySelector(".volume").value;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();

      oscillators.push({ osc, gain, panel });
    });

    isPlaying = true;
    toggleBtn.textContent = "Stop";
  } else {
    oscillators.forEach(({ osc }) => osc.stop());
    isPlaying = false;
    toggleBtn.textContent = "Play / Stop";
  }
});

document.querySelectorAll(".oscillator").forEach(panel => {
  const freqSlider = panel.querySelector(".frequency");
  const volSlider = panel.querySelector(".volume");
  const waveformSelect = panel.querySelector(".waveform");

  const freqValue = panel.querySelector(".freqValue");
  const volValue = panel.querySelector(".volValue");

  freqSlider.addEventListener("input", () => {
    freqValue.textContent = freqSlider.value;
    const o = oscillators.find(o => o.panel === panel);
    if (o && isPlaying) {
      o.osc.frequency.setValueAtTime(freqSlider.value, audioCtx.currentTime);
    }
  });

  volSlider.addEventListener("input", () => {
    volValue.textContent = volSlider.value;
    const o = oscillators.find(o => o.panel === panel);
    if (o && isPlaying) {
      o.gain.gain.setValueAtTime(volSlider.value, audioCtx.currentTime);
    }
  });

  waveformSelect.addEventListener("change", () => {
    const o = oscillators.find(o => o.panel === panel);
    if (o && isPlaying) {
      o.osc.type = waveformSelect.value;
    }
  });
});
