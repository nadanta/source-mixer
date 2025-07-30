// File: src/audio/NoiseManager.js
import { ctx, masterGain } from './AudioBus';

class NoiseManager {
  constructor() {
    this.sources = {};
    this.gains = {};

    // Set up analyser
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);
    masterGain.connect(this.analyser);

    // Unlock AudioContext on user interaction
    const resume = () => {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      document.removeEventListener('click', resume);
      document.removeEventListener('touchstart', resume);
    };
    document.addEventListener('click', resume);
    document.addEventListener('touchstart', resume);
  }

  createBuffer(type) {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'white') {
        data[i] = white;
      } else if (type === 'pink') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        data[i] *= 0.11;
      } else if (type === 'brown') {
        let lastOut = 0;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      } else if (type === 'violet') {
        data[i] = white * (i / bufferSize);
      }
    }

    return buffer;
  }

  play(type) {
    this.stop(type);

    const source = ctx.createBufferSource();
    source.buffer = this.createBuffer(type);
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = 0.2;

    source.connect(gain).connect(masterGain);
    source.start();

    this.sources[type] = source;
    this.gains[type] = gain;
  }

  stop(type) {
    if (this.sources[type]) {
      this.sources[type].stop();
      delete this.sources[type];
      delete this.gains[type];
    }
  }

  setGain(type, value) {
    if (this.gains[type]) {
      this.gains[type].gain.value = value;
    }
  }

  getAnalyserData() {
    this.analyser.getByteFrequencyData(this.analyserData);
    return this.analyserData;
  }
}

const instance = new NoiseManager();
export default instance;
