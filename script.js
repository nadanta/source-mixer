
const context = new (window.AudioContext || window.webkitAudioContext)();

function createOscillatorPanel(id) {
  const panel = document.getElementById(id);
  let oscillator, gainNode;
  let isOn = false;
  let isFocused = false;

  const onOffButton = document.createElement('button');
  onOffButton.textContent = '●';
  onOffButton.title = 'Power';
  onOffButton.onclick = () => {
    if (!isOn) {
      oscillator = context.createOscillator();
      gainNode = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.5;
      oscillator.connect(gainNode).connect(context.destination);
      oscillator.start();
      isOn = true;
    } else {
      oscillator.stop();
      isOn = false;
    }
  };

  const focusButton = document.createElement('button');
  focusButton.textContent = '⧉';
  focusButton.title = 'Focus';
  focusButton.onclick = () => {
    isFocused = !isFocused;
    document.querySelectorAll('.oscillator-panel').forEach(p => p.classList.remove('focused'));
    if (isFocused) {
      panel.classList.add('focused');
    }
  };

  const waveformContainer = document.createElement('div');
  ['sine', 'square', 'sawtooth', 'triangle'].forEach(type => {
    const btn = document.createElement('button');
    btn.textContent = type.charAt(0).toUpperCase();
    btn.onclick = () => {
      if (oscillator) oscillator.type = type;
    };
    waveformContainer.appendChild(btn);
  });

  const freqLabel = document.createElement('label');
  freqLabel.textContent = 'Freq: 440Hz';
  const freqSlider = document.createElement('input');
  freqSlider.type = 'range';
  freqSlider.min = 100;
  freqSlider.max = 1000;
  freqSlider.value = 440;
  freqSlider.oninput = () => {
    freqLabel.textContent = 'Freq: ' + freqSlider.value + 'Hz';
    if (oscillator) oscillator.frequency.value = freqSlider.value;
  };

  const gainLabel = document.createElement('label');
  gainLabel.textContent = 'Gain: 0.5';
  const gainSlider = document.createElement('input');
  gainSlider.type = 'range';
  gainSlider.min = 0;
  gainSlider.max = 1;
  gainSlider.step = 0.01;
  gainSlider.value = 0.5;
  gainSlider.oninput = () => {
    gainLabel.textContent = 'Gain: ' + gainSlider.value;
    if (gainNode) gainNode.gain.value = gainSlider.value;
  };

  panel.appendChild(onOffButton);
  panel.appendChild(focusButton);
  panel.appendChild(waveformContainer);
  panel.appendChild(freqLabel);
  panel.appendChild(freqSlider);
  panel.appendChild(gainLabel);
  panel.appendChild(gainSlider);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.oscillator-panel').forEach(p => p.classList.remove('focused'));
    }
  });
}

['osc-panel-1', 'osc-panel-2', 'osc-panel-3', 'osc-panel-4'].forEach(createOscillatorPanel);
