
const panel = document.getElementById('oscillator-panel');
let activeFocus = null;

function createOscillator(id) {
  const container = document.createElement('div');
  container.className = 'oscillator';
  container.id = 'osc-' + id;

  const power = document.createElement('button');
  power.textContent = '●';
  power.title = 'Power';
  let ctx = null, osc = null, gainNode = null;

  power.onclick = () => {
    if (!ctx) {
      ctx = new AudioContext();
      osc = ctx.createOscillator();
      gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 440;
      gainNode.gain.value = 0.5;
      osc.connect(gainNode).connect(ctx.destination);
      osc.start();
      power.style.color = '#0f0';
    } else {
      osc.stop();
      ctx.close();
      ctx = null;
      power.style.color = '';
    }
  };

  const waveContainer = document.createElement('div');
  ['sine','square','sawtooth','triangle'].forEach(type => {
    const btn = document.createElement('button');
    btn.textContent = type[0].toUpperCase();
    btn.className = 'wave-btn';
    btn.onclick = () => {
      if (osc) osc.type = type;
    };
    waveContainer.appendChild(btn);
  });

  const freqLabel = document.createElement('div');
  freqLabel.className = 'label';
  freqLabel.textContent = 'Freq: 440Hz';
  const freqSlider = document.createElement('input');
  freqSlider.type = 'range';
  freqSlider.min = 40;
  freqSlider.max = 2000;
  freqSlider.value = 440;
  freqSlider.className = 'slider';
  freqSlider.oninput = () => {
    freqLabel.textContent = 'Freq: ' + freqSlider.value + 'Hz';
    if (osc) osc.frequency.value = freqSlider.value;
  };

  const gainLabel = document.createElement('div');
  gainLabel.className = 'label';
  gainLabel.textContent = 'Gain: 0.5';
  const gainSlider = document.createElement('input');
  gainSlider.type = 'range';
  gainSlider.min = 0;
  gainSlider.max = 1;
  gainSlider.step = 0.01;
  gainSlider.value = 0.5;
  gainSlider.className = 'slider';
  gainSlider.oninput = () => {
    gainLabel.textContent = 'Gain: ' + gainSlider.value;
    if (gainNode) gainNode.gain.value = gainSlider.value;
  };

  const focus = document.createElement('button');
  focus.textContent = '🔍';
  focus.title = 'Focus';
  focus.onclick = () => {
    document.querySelectorAll('.oscillator').forEach(el => el.classList.remove('focused'));
    if (activeFocus !== container) {
      container.classList.add('focused');
      activeFocus = container;
    } else {
      activeFocus = null;
    }
  };

  container.appendChild(power);
  container.appendChild(focus);
  container.appendChild(waveContainer);
  container.appendChild(freqLabel);
  container.appendChild(freqSlider);
  container.appendChild(gainLabel);
  container.appendChild(gainSlider);
  panel.appendChild(container);
}

for (let i = 0; i < 4; i++) {
  createOscillator(i);
}
