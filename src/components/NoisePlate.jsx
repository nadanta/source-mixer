// File: src/components/NoisePlate.jsx
import React, { useEffect, useRef, useState } from 'react';
import NoiseManager from '../audio/NoiseManager';
import '../styles/meter.css';

const NOISE_TYPES = ['white', 'pink', 'brown', 'violet'];

export default function NoisePlate() {
  const [states, setStates] = useState({
    white: { isOn: false, gain: 0.05 },
    pink: { isOn: false, gain: 0.05 },
    brown: { isOn: false, gain: 0.05 },
    violet: { isOn: false, gain: 0.05 },
  });

  const meterRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const analyserData = NoiseManager.getAnalyserData();
      const max = Math.max(...analyserData);
      if (meterRef.current) {
        meterRef.current.style.height = `${(max / 255) * 100}%`;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const toggleNoise = (type) => {
    const isOn = !states[type].isOn;
    NoiseManager.toggleNoise(type, isOn);
    setStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], isOn },
    }));
  };

  const setGain = (type, value) => {
    NoiseManager.setGain(type, value);
    setStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], gain: value },
    }));
  };

  return (
    <div className="plate">
      <h2>Noise Plate</h2>
      <div className="osc-panel">
        {NOISE_TYPES.map((type) => (
          <div key={type} className="osc-card">
            <p>{type.charAt(0).toUpperCase() + type.slice(1)} Noise</p>
            <button
              onClick={() => toggleNoise(type)}
              style={{
                backgroundColor: states[type].isOn ? 'green' : 'red',
                color: 'white',
              }}
            >
              {states[type].isOn ? '⏻' : '⭘'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={states[type].gain}
              onChange={(e) => setGain(type, parseFloat(e.target.value))}
            />
            <p>Gain: {states[type].gain.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="meter-wrapper">
        <div ref={meterRef} className="meter-bar"></div>
      </div>
    </div>
  );
}
