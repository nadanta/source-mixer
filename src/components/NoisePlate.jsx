// File: src/components/NoisePlate.jsx
import React, { useEffect, useRef, useState } from 'react';
import NoiseManager from '../audio/NoiseManager';
import '../styles/meter.css';

const NOISE_TYPES = ['white', 'pink', 'brown', 'violet'];

export default function NoisePlate() {
  const [active, setActive] = useState({
    white: false,
    pink: false,
    brown: false,
    violet: false,
  });

  const [gains, setGains] = useState({
    white: 0.2,
    pink: 0.2,
    brown: 0.2,
    violet: 0.2,
  });

  const meterRef = useRef(null);

  useEffect(() => {
    const canvas = meterRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const data = NoiseManager.getAnalyserData();
      const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const height = (avg / 255) * canvas.height;
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(0, canvas.height - height, canvas.width, height);
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  const toggleNoise = (type) => {
    const isActive = active[type];
    const updated = { ...active, [type]: !isActive };
    setActive(updated);

    if (!isActive) {
      NoiseManager.play(type);
      NoiseManager.setGain(type, gains[type]);
    } else {
      NoiseManager.stop(type);
    }
  };

  const handleGainChange = (type, value) => {
    const newGains = { ...gains, [type]: value };
    setGains(newGains);
    if (active[type]) {
      NoiseManager.setGain(type, parseFloat(value));
    }
  };

  return (
    <div className="plate">
      <h2>Noise Plate</h2>
      <div className="osc-panel">
        {NOISE_TYPES.map((type) => (
          <div key={type} className="osc-card">
            <div className="row space-between">
              <span>{type.toUpperCase()} Noise</span>
              <button
                className={`onoff ${active[type] ? 'on' : 'off'}`}
                onClick={() => toggleNoise(type)}
              >
                ●
              </button>
            </div>
            <label>
              Gain ({gains[type]})
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={gains[type]}
                onChange={(e) => handleGainChange(type, e.target.value)}
              />
            </label>
          </div>
        ))}
        <canvas ref={meterRef} className="global-meter" width="10" height="160" />
      </div>
    </div>
  );
}
