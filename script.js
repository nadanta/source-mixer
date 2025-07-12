
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.querySelectorAll(".oscillator").forEach(panel => {
  const freqSlider = panel.querySelector(".frequency");
  const volSlider = panel.querySelector(".volume");
  const freqValue = panel.querySelector(".freqValue");
  const volValue = panel.querySelector(".volValue");
  const waveformBtns = panel.querySelectorAll(".wave-btn");
  const powerBtn = panel.querySelector(".power");
  const focusBtn = panel.querySelector(".focus-btn");

  let osc = null;
  let gain = null;
  let waveform = "sine";

  waveformBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      waveformBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      waveform = btn.dataset.wave;
      if (osc) osc.type = waveform;
    });
  });

  const updateValues = () => {
    freqValue.textContent = freqSlider.value;
    volValue.textContent = volSlider.value;
    if (osc) {
      osc.frequency.setValueAtTime(freqSlider.value, audioCtx.currentTime);
      gain.gain.setValueAtTime(volSlider.value, audioCtx.currentTime);
    }
  };

  freqSlider.addEventListener("input", updateValues);
  volSlider.addEventListener("input", updateValues);

  powerBtn.addEventListener("click", () => {
    if (!osc) {
      osc = audioCtx.createOscillator();
      gain = audioCtx.createGain();
      osc.type = waveform;
      osc.frequency.setValueAtTime(freqSlider.value, audioCtx.currentTime);
      gain.gain.setValueAtTime(volSlider.value, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      powerBtn.classList.add("on");

      waveformBtns.forEach(b => {
        if (b.dataset.wave === "sine") {
          b.classList.add("active");
          waveform = "sine";
        } else {
          b.classList.remove("active");
        }
      });
    } else {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
      osc = null;
      gain = null;
      powerBtn.classList.remove("on");
    }
  });

  focusBtn.addEventListener("click", () => {
    document.querySelectorAll(".oscillator").forEach(o => o.classList.remove("focused"));
    panel.classList.add("focused");
    document.body.classList.add("focus-mode");
  });

  updateValues();
});

document.body.addEventListener("click", e => {
  if (e.target.classList.contains("focus-btn")) return;
  if (document.body.classList.contains("focus-mode")) {
    document.querySelectorAll(".oscillator").forEach(o => o.classList.remove("focused"));
    document.body.classList.remove("focus-mode");
  }
});
