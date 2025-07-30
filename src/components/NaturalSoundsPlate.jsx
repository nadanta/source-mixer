// File: src/components/NaturalSoundsPlate.jsx
import React, { useState, useEffect, useRef } from 'react';
import NaturalSoundManager from '../audio/NaturalSoundManager.js';
import '../styles/meter.css';

const soundCategories = ['forest', 'birdsong', 'rain', 'fire'];
const variations = [1, 2, 3, 4];

export default function NaturalSoundsPlate() {
  const [settings, setSettings] = useState(
    soundCategories.reduce((acc, category) => {
      acc[category] = {
        on: false,
        variation: 1,
        gain: 0
      };
      return acc;
    }, {})
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

  const updateSetting = (category, prop, value) => {
    setSettings(prev => {
      const updated = { ...prev };
      updated[category][prop] = value;

      if (prop === 'on') {
        if (value) {
          NaturalSoundManager.play(category, updated[category].variation).catch(console.error);
        } else {
          NaturalSoundManager.stop(category);
        }
      } else if (prop === 'variation') {
        if (updated[category].on) {
          NaturalSoundManager.play(category, value).catch(console.error);
        }
      } else if (prop === 'gain') {
        NaturalSoundManager.setGain(category, parseFloat(value));
      }

      return updated;
    });
  };

  return (
    <div className="plate">
      <h2>Natural Sound Plate</h2>
      <div className="osc-panel">
        {soundCategories.map((category) => (
          <div key={category} className="osc-card">
            <div className="row space-between">
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              <button
                className={`onoff ${settings[category].on ? 'on' : 'off'}`}
                onClick={() => updateSetting(category, 'on', !settings[category].on)}
              >
                ●
              </button>
            </div>
            <label>
              Variation:
              <select
                value={settings[category].variation}
                onChange={(e) => updateSetting(category, 'variation', parseInt(e.target.value))}
              >
                {variations.map(v => (
                  <option key={v} value={v}>Option {v}</option>
                ))}
              </select>
            </label>
            <label>
              Gain ({settings[category].gain})
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings[category].gain}
                onChange={(e) => updateSetting(category, 'gain', e.target.value)}
              />
            </label>
          </div>
        ))}
        <canvas ref={meterRef} className="global-meter" width="10" height="160"></canvas>
      </div>
    </div>
  );
}
