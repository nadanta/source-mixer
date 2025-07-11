let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscData = [];

document.querySelectorAll(".oscillator").forEach(panel => {
  const waveform = panel.querySelector(".waveform");
  const frequency = panel.querySelector(".frequency");
  const volume = panel.querySelector(".volume");
  const freqValue = panel.querySelector(".freqValue");
  const volValue = panel.querySelector(".volValue");
  const powerBtn = panel.querySelector(".power");

  let osc, gain;

  function updateSound() {
    freqValue.textContent = frequency.value;
    volValue.textContent = volume.value;
    if (osc) {
      osc.frequency.setValueAtTime(frequency.value, audioCtx.currentTime);
      osc.type = waveform.value;
      gain.gain.setValueAtTime(volume.value, audioCtx.currentTime);
    }
  }

  frequency.addEventListener("input", updateSound);
  volume.addEventListener("input", updateSound);
  waveform.addEventListener("change", updateSound);

  powerBtn.addEventListener("click", () => {
    if (!osc) {
      osc = audioCtx.createOscillator();
      gain = audioCtx.createGain();
      osc.type = waveform.value;
      osc.frequency.setValueAtTime(frequency.value, audioCtx.currentTime);
      gain.gain.setValueAtTime(volume.value, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      powerBtn.classList.add("on");
    } else {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
      osc = null;
      gain = null;
      powerBtn.classList.remove("on");
    }
  });
});
