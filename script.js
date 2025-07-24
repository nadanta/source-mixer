/* global React, ReactDOM */
// React-based sound mixer with 4 oscillators, noise plate, and a global meter
const { useState, useEffect, useRef } = React;

function createNoiseBuffer(ctx, type) {
  const size = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let lastOut = 0, lastWhite = 0;
  for (let i = 0; i < size; i++) {
    const white = Math.random() * 2 - 1;
    switch (type) {
      case 'white':
        data[i] = white * 0.5;
        break;
      case 'pink':
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
        break;
      case 'brown':
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
        break;
      case 'violet':
        data[i] = (white - lastWhite) * 0.5;
        lastWhite = white;
        break;
      default:
        data[i] = white;
    }
  }
  return buffer;
}

function createNoiseSource(ctx, type) {
  const src = ctx.createBufferSource();
  if (type === 'violet') {
    src.buffer = createNoiseBuffer(ctx, 'white');
  } else {
    src.buffer = createNoiseBuffer(ctx, type);
  }
  src.loop = true;
  let node = src;
  if (type === 'violet') {
    const shelf = ctx.createBiquadFilter();
    shelf.type = 'highshelf';
    shelf.frequency.value = 1000;
    shelf.gain.value = 15;
    src.connect(shelf);
    node = shelf;
  }
  return { src, node };
}

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
    if (!ctx) return;
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
@@ -149,50 +150,51 @@ function OscillatorPanel({ label, min, max, audioCtx, masterGain }) {
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

function NoisePanel({ type, label, audioCtx, masterGain }) {
  const [gain, setGain] = useState(0.5);
  const [on, setOn] = useState(false);
  const srcRef = useRef(null);
  const nodeRef = useRef(null);
  const gainRef = useRef(null);

  const togglePower = () => {
    const ctx = audioCtx;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (!on) {
      const { src, node } = createNoiseSource(ctx, type);
      const g = ctx.createGain();
      g.gain.value = gain;
      node.connect(g).connect(masterGain);
      src.start();
      srcRef.current = src;
      nodeRef.current = node;
      gainRef.current = g;
      setOn(true);
    } else {
      srcRef.current.stop();
      srcRef.current.disconnect();
      if (nodeRef.current) nodeRef.current.disconnect();
      gainRef.current.disconnect();
      srcRef.current = null;
      nodeRef.current = null;
      gainRef.current = null;
      setOn(false);
    }
  };

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = gain;
@@ -236,143 +238,145 @@ function SoundMeter({ analyser }) {
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

function FourOscPlate({ audioCtx, ready }) {
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!audioCtx) return;
    const master = audioCtx.createGain();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    master.connect(analyser).connect(audioCtx.destination);
    masterGainRef.current = master;
    analyserRef.current = analyser;
    return () => {
      master.disconnect();
      analyser.disconnect();
    };
  }, [audioCtx]);

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
            audioCtx={audioCtx}
            masterGain={masterGainRef.current}
          />
        ))}
      </div>
      {ready && <SoundMeter analyser={analyserRef.current} />}
    </div>
  );
}

function NoisePlate({ audioCtx, ready }) {
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!audioCtx) return;
    const master = audioCtx.createGain();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    master.connect(analyser).connect(audioCtx.destination);
    masterGainRef.current = master;
    analyserRef.current = analyser;
    return () => {
      master.disconnect();
      analyser.disconnect();
    };
  }, [audioCtx]);

  const configs = [
    { type: 'white', label: 'White Noise' },
    { type: 'pink', label: 'Pink Noise' },
    { type: 'brown', label: 'Brown Noise' },
    { type: 'violet', label: 'Violet Noise' },
  ];

  return (
    <div id="plate">
      <div id="main-panel">
        {configs.map((cfg, i) => (
          <NoisePanel
            key={i}
            {...cfg}
            audioCtx={audioCtx}
            masterGain={masterGainRef.current}
          />
        ))}
      </div>
      {ready && <SoundMeter analyser={analyserRef.current} />}
    </div>
  );
}

function Menu({ plate, setPlate }) {
  return (
    <div id="menu">
      <button onClick={() => setPlate('osc')} className={plate === 'osc' ? 'active' : ''}>4osc</button>
      <button onClick={() => setPlate('noise')} className={plate === 'noise' ? 'active' : ''}>Noise</button>
    </div>
  );
}

function App() {
  const audioCtxRef = useRef(null);
  const [audioCtx, setAudioCtx] = useState(null);
  const [ready, setReady] = useState(false);
  const [plate, setPlate] = useState('osc');

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    setAudioCtx(ctx);
    const resume = () => {
      if (ctx.state === 'suspended') ctx.resume();
      setReady(true);
    };
    window.addEventListener('touchstart', resume, { once: true });
    window.addEventListener('click', resume, { once: true });
  }, []);

  return (
    <div id="app">
      <Menu plate={plate} setPlate={setPlate} />
      {plate === 'osc' && (
        <FourOscPlate audioCtx={audioCtxRef.current} ready={ready} />
      {audioCtx && plate === 'osc' && (
        <FourOscPlate audioCtx={audioCtx} ready={ready} />
      )}
      {plate === 'noise' && (
        <NoisePlate audioCtx={audioCtxRef.current} ready={ready} />
      {audioCtx && plate === 'noise' && (
        <NoisePlate audioCtx={audioCtx} ready={ready} />
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
