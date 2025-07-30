// File: src/audio/OscillatorManager.js
import { ctx, masterGain } from './AudioBus';

class OscillatorManager {
  constructor() {
    this.oscillators = [];
    this.gains = [];

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

    masterGain.connect(this.analyser);

    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.type = 'sine';
      osc.frequency.value = this.getDefaultFrequency(i);
      osc.connect(gain).connect(masterGain);
      osc.start();

      this.oscillators.push(osc);
      this.gains.push(gain);
    }

    this.resumeContextOnInteraction();
  }

  resumeContextOnInteraction() {
    const resume = () => {
      if (ctx.state === 'suspended') ctx.resume();
      document.removeEventListener('click', resume);
      document.removeEventListener('touchstart', resume);
    };
    document.addEventListener('click', resume);
    document.addEventListener('touchstart', resume);
  }

  getDefaultFrequency(index) {
    return [440, 100, 440, 1000][index] || 440;
  }

  toggleOscillator(index, isOn) {
    if (this.gains[index]) {
      this.gains[index].gain.value = isOn ? 0.2 : 0;
    }
  }

  setFrequency(index, value) {
    if (this.oscillators[index]) {
      this.oscillators[index].frequency.value = value;
    }
  }

  setWaveform(index, type) {
    if (this.oscillators[index]) {
      this.oscillators[index].type = type;
    }
  }

  setGain(index, value) {
    if (this.gains[index]) {
      this.gains[index].gain.value = value;
    }
  }

  getAnalyserData() {
    this.analyser.getByteFrequencyData(this.analyserData);
    return this.analyserData;
  }
}

const instance = new OscillatorManager();
export default instance;
