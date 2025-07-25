const context = new (window.AudioContext || window.webkitAudioContext)();
function createOscillatorPanel(cfg) {
  const { id, min, max, label } = cfg;
  const panel = document.getElementById(id);
  let oscillator = null;
  let gainNode = null;
  let isOn = false;
  let isFocused = false;
  let currentWaveBtn = null;

 const context = new (window.AudioContext || window.webkitAudioContext)();
 
-function createOscillatorPanel(id) {
+function createOscillatorPanel(cfg) {
+  const { id, min, max, label } = cfg;
   const panel = document.getElementById(id);
-  let oscillator = null, gainNode = null;
+  let oscillator = null;
+  let gainNode = null;
   let isOn = false;
   let isFocused = false;
   let currentWaveBtn = null;
 
   const topRow = document.createElement('div');
   topRow.className = 'panel-top';
 
-  const onOffButton = document.createElement('button');
-  onOffButton.textContent = '●';
-  onOffButton.classList.add('power-off');
-  onOffButton.title = 'Power';
-  onOffButton.onclick = () => {
-    if (!isOn && currentWaveBtn == null) {
-      const sineBtn = waveformContainer.querySelector('button');
-      sineBtn.classList.add('wave-active');
-      currentWaveBtn = sineBtn;
-    }
-    if (!isOn) {
-      oscillator = context.createOscillator();
-      gainNode = context.createGain();
-      oscillator.type = 'sine';
-      oscillator.frequency.value = freqSlider.value;
-      gainNode.gain.value = gainSlider.value;
-      oscillator.connect(gainNode).connect(context.destination);
-      oscillator.start();
-      isOn = true;
-      onOffButton.classList.remove('power-off');
-      onOffButton.classList.add('power-on');
-    } else {
-      if (oscillator) oscillator.stop();
-      oscillator = null;
-      isOn = false;
-      onOffButton.classList.remove('power-on');
-      onOffButton.classList.add('power-off');
-      if (currentWaveBtn) currentWaveBtn.classList.remove('wave-active');
-    }
-  };
+  const powerBtn = document.createElement('button');
+  powerBtn.textContent = '●';
+  powerBtn.className = 'power-off';
+  powerBtn.title = 'Power';
 
-  const focusButton = document.createElement('button');
-  focusButton.textContent = '⧉';
-  focusButton.title = 'Focus';
-  focusButton.onclick = () => {
-    isFocused = !isFocused;
-    document.querySelectorAll('.oscillator-panel').forEach(p => p.classList.remove('focused'));
-    if (isFocused) {
-      panel.classList.add('focused');
-    }
-  };
+  const oscLabel = document.createElement('span');
+  oscLabel.className = 'osc-label';
+  oscLabel.textContent = label;
+
+  const focusBtn = document.createElement('button');
+  focusBtn.textContent = '⧉';
+  focusBtn.title = 'Focus';
 
-  topRow.appendChild(onOffButton);
-  topRow.appendChild(focusButton);
+  topRow.appendChild(powerBtn);
+  topRow.appendChild(oscLabel);
+  topRow.appendChild(focusBtn);
 
   const waveformContainer = document.createElement('div');
   waveformContainer.className = 'waveform-buttons';
 
   const waveforms = [
     { type: 'sine', symbol: '∿' },
     { type: 'square', symbol: '◻' },
     { type: 'sawtooth', symbol: 'w' },
-    { type: 'triangle', symbol: '▵' },
+    { type: 'triangle', symbol: '▵' }
   ];
 
-  waveforms.forEach(({ type, symbol }) => {
+  waveforms.forEach(w => {
     const btn = document.createElement('button');
-    btn.textContent = symbol;
+    btn.textContent = w.symbol;
     btn.onclick = () => {
-      if (oscillator) oscillator.type = type;
+      if (oscillator) oscillator.type = w.type;
       if (currentWaveBtn) currentWaveBtn.classList.remove('wave-active');
       btn.classList.add('wave-active');
       currentWaveBtn = btn;
     };
     waveformContainer.appendChild(btn);
   });
 
   const freqLabel = document.createElement('label');
-  freqLabel.textContent = 'Freq: 440Hz';
+  freqLabel.textContent = `Frequency (${label})`;
+  const freqDisplay = document.createElement('span');
+  freqDisplay.className = 'freq-display';
+  const startFreq = (min + max) / 2;
+  freqDisplay.textContent = `${startFreq}Hz`;
+  freqLabel.appendChild(freqDisplay);
+
   const freqInput = document.createElement('input');
   freqInput.type = 'number';
-  freqInput.min = 20;
-  freqInput.max = 20000;
-  freqInput.value = 440;
-  freqInput.style.width = '80px';
-  freqInput.oninput = () => {
-    freqSlider.value = freqInput.value;
-    freqLabel.textContent = 'Freq: ' + freqInput.value + 'Hz';
-    if (oscillator) oscillator.frequency.value = freqInput.value;
-  };
+  freqInput.min = min;
+  freqInput.max = max;
+  freqInput.style.display = 'none';
+  freqLabel.appendChild(freqInput);
+
   const freqSlider = document.createElement('input');
   freqSlider.type = 'range';
-  freqSlider.min = 20;
-  freqSlider.max = 20000;
-  freqSlider.value = 440;
-  freqSlider.oninput = () => {
+  freqSlider.min = min;
+  freqSlider.max = max;
+  freqSlider.value = startFreq;
+
+  function setFrequency(val) {
+    val = Math.min(max, Math.max(min, Number(val)));
+    freqSlider.value = val;
+    freqDisplay.textContent = `${val}Hz`;
+    if (oscillator) oscillator.frequency.value = val;
+  }
+
+  freqSlider.oninput = () => setFrequency(freqSlider.value);
+
+  freqDisplay.ondblclick = () => {
     freqInput.value = freqSlider.value;
-    freqLabel.textContent = 'Freq: ' + freqSlider.value + 'Hz';
-    if (oscillator) oscillator.frequency.value = freqSlider.value;
+    freqDisplay.style.display = 'none';
+    freqInput.style.display = 'inline-block';
+    freqInput.focus();
+  };
+
+  freqInput.addEventListener('keydown', e => {
+    if (e.key === 'Enter') {
+      setFrequency(freqInput.value);
+      freqInput.style.display = 'none';
+      freqDisplay.style.display = 'inline';
+    }
+  });
+  freqInput.onblur = () => {
+    freqInput.style.display = 'none';
+    freqDisplay.style.display = 'inline';
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
-    gainLabel.textContent = 'Gain: ' + gainSlider.value;
+    gainLabel.textContent = `Gain: ${gainSlider.value}`;
     if (gainNode) gainNode.gain.value = gainSlider.value;
   };
 
+  powerBtn.onclick = () => {
+    if (!isOn) {
+      oscillator = context.createOscillator();
+      gainNode = context.createGain();
+      oscillator.type = 'sine';
+      oscillator.frequency.value = freqSlider.value;
+      gainNode.gain.value = gainSlider.value;
+      oscillator.connect(gainNode).connect(context.destination);
+      oscillator.start();
+      isOn = true;
+      powerBtn.classList.remove('power-off');
+      powerBtn.classList.add('power-on');
+      if (!currentWaveBtn) {
+        currentWaveBtn = waveformContainer.querySelector('button');
+        currentWaveBtn.classList.add('wave-active');
+      }
+    } else {
+      oscillator.stop();
+      oscillator.disconnect();
+      oscillator = null;
+      isOn = false;
+      powerBtn.classList.remove('power-on');
+      powerBtn.classList.add('power-off');
+    }
+  };
+
+  focusBtn.onclick = () => {
+    isFocused = !isFocused;
+    document.querySelectorAll('.oscillator-panel').forEach(p => p.classList.remove('focused'));
+    if (isFocused) {
+      panel.classList.add('focused');
+    }
+  };
+
   panel.appendChild(topRow);
   panel.appendChild(waveformContainer);
   panel.appendChild(freqLabel);
   panel.appendChild(freqSlider);
-  panel.appendChild(freqInput);
   panel.appendChild(gainLabel);
   panel.appendChild(gainSlider);
-
-  document.addEventListener('keydown', (e) => {
-    if (e.key === 'Escape') {
-      document.querySelectorAll('.oscillator-panel').forEach(p => p.classList.remove('focused'));
-    }
-  });
 }
 
-['osc-panel-1', 'osc-panel-2', 'osc-panel-3', 'osc-panel-4'].forEach(createOscillatorPanel);
+const configs = [
+  { id: 'osc1', min: 20, max: 20000, label: 'Full' },
+  { id: 'osc2', min: 20, max: 200, label: 'Low' },
+  { id: 'osc3', min: 100, max: 10000, label: 'Low-Mid' },
+  { id: 'osc4', min: 500, max: 15000, label: 'Mid-High' }
+];
+
+configs.forEach(createOscillatorPanel);
+
+// Escape key exits focus mode
+document.addEventListener('keydown', e => {
+  if (e.key === 'Escape') {
+    document.querySelectorAll('.oscillator-panel').forEach(p => p.classList.remove('focused'));
+  }
+});
  const topRow = document.createElement("div");
  topRow.className = "panel-top";

  const powerBtn = document.createElement("button");
  powerBtn.textContent = "●";
  powerBtn.className = "power-off";
  powerBtn.title = "Power";

  const oscLabel = document.createElement("span");
  oscLabel.className = "osc-label";
  oscLabel.textContent = label;

  const focusBtn = document.createElement("button");
  focusBtn.textContent = "⧉";
  focusBtn.title = "Focus";

  topRow.appendChild(powerBtn);
  topRow.appendChild(oscLabel);
  topRow.appendChild(focusBtn);

  const waveformContainer = document.createElement("div");
  waveformContainer.className = "waveform-buttons";

  const waveforms = [
    { type: "sine", symbol: "∿" },
    { type: "square", symbol: "◻" },
    { type: "sawtooth", symbol: "w" },
    { type: "triangle", symbol: "▵" },
  ];

  waveforms.forEach((w) => {
    const btn = document.createElement("button");
    btn.textContent = w.symbol;
    btn.onclick = () => {
      if (oscillator) oscillator.type = w.type;
      if (currentWaveBtn) currentWaveBtn.classList.remove("wave-active");
      btn.classList.add("wave-active");
      currentWaveBtn = btn;
    };
    waveformContainer.appendChild(btn);
  });

  const freqLabel = document.createElement("label");
  freqLabel.textContent = `Frequency (${label})`;
  const freqDisplay = document.createElement("span");
  freqDisplay.className = "freq-display";
  const startFreq = (min + max) / 2;
  freqDisplay.textContent = `${startFreq}Hz`;
  freqLabel.appendChild(freqDisplay);

  const freqInput = document.createElement("input");
  freqInput.type = "number";
  freqInput.min = min;
  freqInput.max = max;
  freqInput.style.display = "none";
  freqLabel.appendChild(freqInput);

  const freqSlider = document.createElement("input");
  freqSlider.type = "range";
  freqSlider.min = min;
  freqSlider.max = max;
  freqSlider.value = startFreq;

  function setFrequency(val) {
    val = Math.min(max, Math.max(min, Number(val)));
    freqSlider.value = val;
    freqDisplay.textContent = `${val}Hz`;
    if (oscillator) oscillator.frequency.value = val;
  }

  freqSlider.oninput = () => setFrequency(freqSlider.value);

  freqDisplay.ondblclick = () => {
    freqInput.value = freqSlider.value;
    freqDisplay.style.display = "none";
    freqInput.style.display = "inline-block";
    freqInput.focus();
  };

  freqInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      setFrequency(freqInput.value);
      freqInput.style.display = "none";
      freqDisplay.style.display = "inline";
    }
  });
  freqInput.onblur = () => {
    freqInput.style.display = "none";
    freqDisplay.style.display = "inline";
  };

  const gainLabel = document.createElement("label");
  gainLabel.textContent = "Gain: 0.5";
  const gainSlider = document.createElement("input");
  gainSlider.type = "range";
  gainSlider.min = 0;
  gainSlider.max = 1;
  gainSlider.step = 0.01;
  gainSlider.value = 0.5;
  gainSlider.oninput = () => {
    gainLabel.textContent = `Gain: ${gainSlider.value}`;
    if (gainNode) gainNode.gain.value = gainSlider.value;
  };

  powerBtn.onclick = () => {
    if (!isOn) {
      oscillator = context.createOscillator();
      gainNode = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = freqSlider.value;
      gainNode.gain.value = gainSlider.value;
      oscillator.connect(gainNode).connect(context.destination);
      oscillator.start();
      isOn = true;
      powerBtn.classList.remove("power-off");
      powerBtn.classList.add("power-on");
      if (!currentWaveBtn) {
        currentWaveBtn = waveformContainer.querySelector("button");
        currentWaveBtn.classList.add("wave-active");
      }
    } else {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
      isOn = false;
      powerBtn.classList.remove("power-on");
      powerBtn.classList.add("power-off");
    }
  };

  focusBtn.onclick = () => {
    isFocused = !isFocused;
    document
      .querySelectorAll(".oscillator-panel")
      .forEach((p) => p.classList.remove("focused"));
    if (isFocused) {
      panel.classList.add("focused");
    }
  };

  panel.appendChild(topRow);
  panel.appendChild(waveformContainer);
  panel.appendChild(freqLabel);
  panel.appendChild(freqSlider);
  panel.appendChild(gainLabel);
  panel.appendChild(gainSlider);
}

const configs = [
  { id: "osc1", min: 20, max: 20000, label: "Full" },
  { id: "osc2", min: 20, max: 200, label: "Low" },
  { id: "osc3", min: 100, max: 10000, label: "Low-Mid" },
  { id: "osc4", min: 500, max: 15000, label: "Mid-High" },
];

configs.forEach(createOscillatorPanel);

// Escape key exits focus mode
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document
      .querySelectorAll(".oscillator-panel")
      .forEach((p) => p.classList.remove("focused"));
  }
});
