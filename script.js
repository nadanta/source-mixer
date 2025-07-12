const waveforms = ["sine", "square", "sawtooth", "triangle"];
const symbols = ["S", "■", "/", "▲"];
const oscillators = [];

document.querySelectorAll('.oscillator').forEach((container, index) => {
  let ctx = new AudioContext();
  let osc = ctx.createOscillator();
  let gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 440;
  gain.gain.value = 0.5;
  osc.connect(gain).connect(ctx.destination);
  osc.start();

  oscillators.push({ctx, osc, gain});

  // Power button
  const power = document.createElement("button");
  power.textContent = "●";
  power.onclick = () => {
    if (gain.gain.value > 0) {
      gain.gain.value = 0;
    } else {
      gain.gain.value = volume.value;
    }
  };
  container.appendChild(power);

  // Waveform buttons
  const waveformContainer = document.createElement("div");
  waveformContainer.className = "waveform-btns";
  waveforms.forEach((type, i) => {
    const btn = document.createElement("button");
    btn.textContent = symbols[i];
    btn.onclick = () => osc.type = type;
    waveformContainer.appendChild(btn);
  });
  container.appendChild(waveformContainer);

  // Frequency
  const freqLabel = document.createElement("div");
  freqLabel.className = "label";
  freqLabel.textContent = "Freq: 440Hz";
  const freq = document.createElement("input");
  freq.type = "range";
  freq.min = 50;
  freq.max = 1000;
  freq.value = 440;
  freq.oninput = () => {
    osc.frequency.value = freq.value;
    freqLabel.textContent = "Freq: " + freq.value + "Hz";
  };
  container.appendChild(freqLabel);
  container.appendChild(freq);

  // Gain
  const gainLabel = document.createElement("div");
  gainLabel.className = "label";
  gainLabel.textContent = "Gain: 0.5";
  const volume = document.createElement("input");
  volume.type = "range";
  volume.min = 0;
  volume.max = 1;
  volume.step = 0.01;
  volume.value = 0.5;
  volume.oninput = () => {
    gain.gain.value = volume.value;
    gainLabel.textContent = "Gain: " + volume.value;
  };
  container.appendChild(gainLabel);
  container.appendChild(volume);

  // Focus
  const focus = document.createElement("button");
  focus.textContent = "◉";
  focus.onclick = () => {
    document.querySelectorAll('.oscillator').forEach(o => o.classList.remove('focused'));
    container.classList.add('focused');
  };
  container.appendChild(focus);
});

// Exit focus on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll('.oscillator').forEach(o => o.classList.remove('focused'));
  }
});