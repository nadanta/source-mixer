// File: src/components/FourOscPlate.jsx
import React, { useState, useEffect, useRef } from 'react';
import OscillatorManager from '../audio/OscillatorManager.js';
import '../styles/meter.css';

const freqRanges = [
  { label: 'Full', min: 20, max: 20000 },
  { label: 'Low', min: 0, max: 200 },
  { label: 'Low-Mid', min: 100, max: 2000 },
  { label: 'Mid-High', min: 400, max: 18000 },
];

const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];

export default function FourOscPlate() {
  const [oscSettings, setOscSettings] = useState(
    Array(4).fill().map((_, i) => ({
      on: false,
      waveform: 'sine',
      frequency: OscillatorManager.getDefaultFrequency(i),
      gain: 0,
    }))
  );

  const meterRef = useRef(null);

useEffect(() => {
  const drawMeter = () => {
    const canvas = meterRef.current;
    if (!canvas) return; // ✅ Prevent draw errors when component is not visible
    const ctx = canvas.getContext('2d');

    // Swap these depending on file context
    const data =
      typeof OscillatorManager !== 'undefined'
        ? OscillatorManager.getAnalyserData()
        : NaturalSoundManager.getAnalyserData();

    const value = data.reduce((a, b) => a + b, 0) / data.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4caf50';
    const height = (value / 255) * canvas.height;
    ctx.fillRect(0, canvas.height - height, canvas.width, height);

    requestAnimationFrame(drawMeter);
  };

  drawMeter();
}, []);


  const updateOsc = (index, prop, value) => {
    const newSettings = [...oscSettings];
    newSettings[index][prop] = value;
    setOscSettings(newSettings);

    if (prop === 'on') {
      OscillatorManager.toggleOscillator(index, value);
    } else if (prop === 'waveform') {
      OscillatorManager.setWaveform(index, value);
    } else if (prop === 'frequency') {
      OscillatorManager.setFrequency(index, parseFloat(value));
    } else if (prop === 'gain') {
      OscillatorManager.setGain(index, parseFloat(value));
    }
  };

  return (
    <div className="plate">
      <h2>Four Oscillator Plate</h2>
      <div className="osc-panel">
        {oscSettings.map((osc, i) => (
          <div key={i} className="osc-card">
            <div className="row space-between">
              <span>OSC {i + 1} ({freqRanges[i].label})</span>
              <button
                className={`onoff ${osc.on ? 'on' : 'off'}`}
                onClick={() => updateOsc(i, 'on', !osc.on)}
              >
                ●
              </button>
            </div>
            <label>
              Wave:
              <select
                value={osc.waveform}
                onChange={(e) => updateOsc(i, 'waveform', e.target.value)}
              >
                {waveforms.map(wave => (
                  <option key={wave} value={wave}>{wave}</option>
                ))}
              </select>
            </label>
            <label>
              Frequency ({osc.frequency} Hz)
              <input
                type="range"
                min={freqRanges[i].min}
                max={freqRanges[i].max}
                step="1"
                value={osc.frequency}
                onChange={(e) => updateOsc(i, 'frequency', e.target.value)}
              />
            </label>
            <label>
              Gain ({osc.gain})
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={osc.gain}
                onChange={(e) => updateOsc(i, 'gain', e.target.value)}
              />
            </label>
          </div>
        ))}
        <canvas ref={meterRef} className="global-meter" width="10" height="160"></canvas>
      </div>
    </div>
  );
}
