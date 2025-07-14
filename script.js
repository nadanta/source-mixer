
const oscConfigs = [
  { label: "Full", minFreq: 20, maxFreq: 20000 },
  { label: "Low", minFreq: 20, maxFreq: 200 },
  { label: "Low-Mid", minFreq: 100, maxFreq: 10000 },
  { label: "Mid-High", minFreq: 500, maxFreq: 15000 }
];

const symbols = ["∿", "◻", "w", "▵"];
const types = ["sine", "square", "sawtooth", "triangle"];

const container = document.getElementById("osc-container");

oscConfigs.forEach((cfg, i) => {
  const oscPanel = document.createElement("div");
  oscPanel.className = "oscillator";

  const ctx = new AudioContext();
  let osc = null;
  let gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);
  gainNode.gain.value = 0.5;
  let currentType = "sine";

  const controls = document.createElement("div");
  controls.className = "controls";

  const powerBtn = document.createElement("button");
  powerBtn.textContent = "Power";
  let isOn = false;

  const focusBtn = document.createElement("button");
  focusBtn.textContent = "Focus";

  powerBtn.onclick = () => {
    isOn = !isOn;
    powerBtn.classList.toggle("active", isOn);
    if (isOn) {
      osc = ctx.createOscillator();
      osc.type = currentType;
      osc.frequency.setValueAtTime(freqSlider.value, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      activateWaveform(0); // default to sine
    } else if (osc) {
      osc.stop();
      osc.disconnect();
    }
  };

  focusBtn.onclick = () => {
    document.querySelectorAll(".oscillator").forEach(p => {
      p.style.display = (p === oscPanel) ? "block" : "none";
      p.style.transform = (p === oscPanel) ? "scale(1.3)" : "scale(1)";
    });
    focusBtn.classList.toggle("focused");
    if (!focusBtn.classList.contains("focused")) {
      document.querySelectorAll(".oscillator").forEach(p => {
        p.style.display = "block";
        p.style.transform = "scale(1)";
      });
    }
  };

  controls.appendChild(powerBtn);
  controls.appendChild(focusBtn);

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = cfg.label;

  const waveBtns = document.createElement("div");
  waveBtns.className = "waveform-btns";
  const waveformButtons = [];

  const activateWaveform = (index) => {
    waveformButtons.forEach((btn, i) => {
      btn.classList.toggle("wave-active", i === index);
    });
    currentType = types[index];
    if (osc) osc.type = currentType;
  };

  symbols.forEach((sym, index) => {
    const btn = document.createElement("button");
    btn.textContent = sym;
    btn.onclick = () => activateWaveform(index);
    waveformButtons.push(btn);
    waveBtns.appendChild(btn);
  });

  const freqLabel = document.createElement("label");
  freqLabel.textContent = "Freq:";
  const freqSlider = document.createElement("input");
  freqSlider.type = "range";
  freqSlider.min = cfg.minFreq;
  freqSlider.max = cfg.maxFreq;
  freqSlider.value = 440;

  const freqInput = document.createElement("input");
  freqInput.type = "number";
  freqInput.value = 440;
  freqInput.className = "freq-input";

  freqSlider.oninput = () => {
    freqInput.value = freqSlider.value;
    if (osc) osc.frequency.setValueAtTime(freqSlider.value, ctx.currentTime);
  };

  freqInput.onkeydown = (e) => {
    if (e.key === "Enter") {
      let val = parseFloat(freqInput.value);
      if (!isNaN(val)) {
        val = Math.max(cfg.minFreq, Math.min(cfg.maxFreq, val));
        freqSlider.value = val;
        if (osc) osc.frequency.setValueAtTime(val, ctx.currentTime);
      }
    }
  };

  const freqGroup = document.createElement("div");
  freqGroup.className = "freq-group";
  freqGroup.appendChild(freqLabel);
  freqGroup.appendChild(freqSlider);
  freqGroup.appendChild(freqInput);

  const gainLabel = document.createElement("label");
  gainLabel.textContent = "Gain:";
  const gainSlider = document.createElement("input");
  gainSlider.type = "range";
  gainSlider.min = 0;
  gainSlider.max = 1;
  gainSlider.step = 0.01;
  gainSlider.value = 0.5;

  gainSlider.oninput = () => {
    gainNode.gain.setValueAtTime(gainSlider.value, ctx.currentTime);
  };

  oscPanel.appendChild(controls);
  oscPanel.appendChild(label);
  oscPanel.appendChild(waveBtns);
  oscPanel.appendChild(freqGroup);
  oscPanel.appendChild(gainLabel);
  oscPanel.appendChild(gainSlider);
  container.appendChild(oscPanel);
});
