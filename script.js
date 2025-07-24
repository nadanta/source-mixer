/* global React, ReactDOM */
// React-based sound mixer with 4 oscillators and a global meter
const { useState, useEffect, useRef } = React;

function OscillatorPanel({ label, min, max, audioCtx, masterGain }) {
  const [frequency, setFrequency] = useState((min + max) / 2);
  const [gain, setGain] = useState(0.5);
  const [wave, setWave] = useState('sine');
  const [on, setOn] = useState(false);
  const [focused, setFocused] = useState(false);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const togglePower = () => {
    const ctx = audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    if (!on) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = wave;
      osc.frequency.value = frequency;
      g.gain.value = gain;
      osc.connect(g).connect(masterGain);
      osc.start();
      oscRef.current = osc;
      gainRef.current = g;
      setOn(true);
    } else {
      oscRef.current.stop();
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
      <label>Gain: {gain.toFixed(2)}</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={gain}
        onChange={e => setGain(Number(e.target.value))}
      />
    </div>
  );
}

function SoundMeter({ analyser }) {
  const [level, setLevel] = useState(0);
  useEffect(() => {
    const data = new Uint8Array(analyser.fftSize);
    let frame;
    const update = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      setLevel(rms);
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [analyser]);

  return (
    <div className="sound-meter">
      <div className="sound-level" style={{ height: `${Math.min(level, 1) * 100}%` }} />
    </div>
  );
}

function App() {
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    master.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    masterGainRef.current = master;
    analyserRef.current = analyser;

    const resume = () => {
      if (ctx.state === 'suspended') ctx.resume();
      setReady(true);
    };
    window.addEventListener('touchstart', resume, { once: true });
    window.addEventListener('click', resume, { once: true });
  }, []);

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

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

