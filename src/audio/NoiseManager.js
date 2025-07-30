// File: src/audio/NoiseManager.js
import { ctx, masterGain } from './AudioBus';

class NoiseManager {
  constructor() {
    this.sources = {};
    this.gains = {};
    this.buffers = {};
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);

    masterGain.connect(this.analyser);

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

  createNoiseBuffer(type) {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    let b = new Array(7).fill(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      switch (type) {
        case 'white':
          data[i] = white;
          break;
        case 'pink':
          b[0] = 0.99886 * b[0] + white * 0.0555179;
          b[1] = 0.99332 * b[1] + white * 0.0750759;
          b[2] = 0.96900 * b[2] + white * 0.1538520;
          b[3] = 0.86650 * b[3] + white * 0.3104856;
          b[4] = 0.55000 * b[4] + white * 0.5329522;
          b[5] = -0.7616 * b[5] - white * 0.0168980;
          b[6] = white * 0.115926;
          data[i] = b.slice(0, 6).reduce((a, c) => a + c, 0) + b[6];
          data[i] *= 0.11;
          break;
        case 'brown':
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
          break;
        case 'violet':
          data[i] = white * i / bufferSize;
          break;
      }
    }
    return buffer;
  }

  play(type) {
    if (this.sources[type]) return;

    if (!this.buffers[type]) {
      this.buffers[type] = this.createNoiseBuffer(type);
    }

    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.05;

    src.buffer = this.buffers[type];
    src.loop = true;

    src.connect(gain).connect(masterGain);
    src.start();

    this.sources[type] = src;
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
