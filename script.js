const context = new (window.AudioContext || window.webkitAudioContext)();
function createOscillatorPanel(cfg) {
  const { id, min, max, label } = cfg;
  const panel = document.getElementById(id);
  let oscillator = null;
  let gainNode = null;
  let isOn = false;
  let isFocused = false;
  let currentWaveBtn = null;

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

   oscRef.current.disconnect();
      gainRef.current.disconnect();
      oscRef.current = null;
      gainRef.current = null;
      setOn(false);
    }
  };

  useEffect(() => {
    if (oscRef.current) oscRef.current.type = wave;
  }, [wave]);
  useEffect(() => {
    if (oscRef.current) oscRef.current.frequency.value = frequency;
  }, [frequency]);
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = gain;
  }, [gain]);

  const waveSymbols = {
    sine: '∿',
    square: '◻',
    sawtooth: 'w',
    triangle: '▵',
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setFocused(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className={`oscillator-panel${focused ? ' focused' : ''}`}> 
      <div className="panel-top">
        <button className={on ? 'power-on' : 'power-off'} onClick={togglePower}>●</button>
        <span className="osc-label">{label}</span>
        <button onClick={() => setFocused(!focused)} title="Focus">⧉</button>
      </div>
      <div className="waveform-buttons">
        {Object.keys(waveSymbols).map(w => (
          <button
            key={w}
            className={wave === w ? 'wave-active' : ''}
            onClick={() => setWave(w)}>
            {waveSymbols[w]}
          </button>
        ))}
      </div>
      <label>Frequency <span className="freq-display">{frequency}Hz</span></label>
      <input
        type="range"
        min={min}
        max={max}
        value={frequency}
        onChange={e => setFrequency(Number(e.target.value))}
      />
@@ -143,26 +151,28 @@ function App() {

  const configs = [
    { label: 'Full', min: 20, max: 20000 },
    { label: 'Low', min: 20, max: 200 },
    { label: 'Low-Mid', min: 100, max: 10000 },
    { label: 'Mid-High', min: 500, max: 15000 },
  ];

  return (
    <div id="plate">
      <div id="main-panel">
        {configs.map((cfg, i) => (
          <OscillatorPanel
            key={i}
            {...cfg}
            audioCtx={audioCtxRef.current}
            masterGain={masterGainRef.current}
          />
        ))}
      </div>
      {ready && <SoundMeter analyser={analyserRef.current} />}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
