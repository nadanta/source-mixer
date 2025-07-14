
const context = new (window.AudioContext || window.webkitAudioContext)();

function createOscillatorPanel(id) {
  const panel = document.getElementById(id);
  let oscillator = null, gainNode = null;
  let isOn = false;
  let isFocused = false;
  let currentWaveBtn = null;

  const topRow = document.createElement('div');
  topRow.className = 'panel-top';

  const onOffButton = document.createElement('button');
  onOffButton.textContent = '●';
  onOffButton.classList.add('power-off');
  onOffButton.title = 'Power';
  onOffButton.onclick = () => {
    if (!isOn) {
      oscillator = context.createOscillator();
      gainNode = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = freqSlider.value;
      gainNode.gain.value = gainSlider.value;
      oscillator.connect(gainNode).connect(context.destination);
      oscillator.start();
      isOn = true;
      onOffButton.classList.remove('power-off');
      onOffButton.classList.add('power-on');
    } else {
      if (oscillator) oscillator.stop();
      oscillator = null;
      isOn = false;
      onOffButton.classList.remove('power-on');
      onOffButton.classList.add('power-off');
      if (currentWaveBtn) currentWaveBtn.classList.remove('wave-active');
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

  topRow.appendChild(onOffButton);
  topRow.appendChild(focusButton);

  const waveformContainer = document.createElement('div');
  waveformContainer.className = 'waveform-buttons';

  const waveforms = [
    { type: 'sine', symbol: '∿' },
    { type: 'square', symbol: '◻' },
    { type: 'sawtooth', symbol: 'w' },
    { type: 'triangle', symbol: '▵' },
  ];

  waveforms.forEach(({ type, symbol }) => {
    const btn = document.createElement('button');
    btn.textContent = symbol;
    btn.onclick = () => {
      if (oscillator) oscillator.type = type;
      if (currentWaveBtn) currentWaveBtn.classList.remove('wave-active');
      btn.classList.add('wave-active');
      currentWaveBtn = btn;
    };
    waveformContainer.appendChild(btn);
  });

  const freqLabel = document.createElement('label');
  freqLabel.textContent = 'Freq: 440Hz';
  const freqSlider = document.createElement('input');
  freqSlider.type = 'range';
  freqSlider.min = 20;
  freqSlider.max = 20000;
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

  panel.appendChild(topRow);
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
