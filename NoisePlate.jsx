import React, { useEffect, useRef, useState } from 'react';
import NoisePanel from './NoisePanel';
import useNoiseGenerators from '../hooks/useNoiseGenerators';
import useMeter from '../hooks/useMeter';
import '../styles/plate.css';

export default function NoisePlate() {
  const {
    whiteNoise,
    pinkNoise,
    brownNoise,
    violetNoise,
  } = useNoiseGenerators();

  const meterRef = useRef(null);
  useMeter([whiteNoise, pinkNoise, brownNoise, violetNoise], meterRef);

  useEffect(() => {
    const resume = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (whiteNoise.context.state === 'suspended') {
        whiteNoise.context.resume();
      }
      window.removeEventListener('touchstart', resume);
      window.removeEventListener('click', resume);
    };
    window.addEventListener('touchstart', resume, { once: true });
    window.addEventListener('click', resume, { once: true });
  }, [whiteNoise]);

  return (
    <div className="plate">
      <div className="plate-nav-placeholder" />
      <div className="plate-panels">
        <NoisePanel title="White Noise" node={whiteNoise} />
        <NoisePanel title="Pink Noise" node={pinkNoise} />
        <NoisePanel title="Brown Noise" node={brownNoise} />
        <NoisePanel title="Violet Noise" node={violetNoise} />
      </div>
      <div className="plate-meter" ref={meterRef}></div>
    </div>
  );
}
