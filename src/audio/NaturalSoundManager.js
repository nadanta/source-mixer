// File: src/audio/NaturalSoundManager.js
import { ctx, masterGain } from './AudioBus';

class NaturalSoundManager {
  constructor() {
    this.buffers = {};
    this.gains = {};
    this.sources = {};
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

  async loadBuffer(category, variation) {
    const key = `${category}${variation}`;
    if (this.buffers[key]) return this.buffers[key];

    const response = await fetch(`/sounds/${category}${variation}.mp3`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await ctx.decodeAudioData(arrayBuffer);

    this.buffers[key] = buffer;
    return buffer;
  }

  async play(category, variation) {
    const key = `${category}${variation}`;
    const buffer = await this.loadBuffer(category, variation);

    this.stop(category); // Stop previous

    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.2;

    src.buffer = buffer;
    src.loop = true;
    src.connect(gain).connect(masterGain);
    src.start();

    this.sources[category] = src;
    this.gains[category] = gain;
  }

  stop(category) {
    if (this.sources[category]) {
      this.sources[category].stop();
      delete this.sources[category];
      delete this.gains[category];
    }
  }

  setGain(category, value) {
    if (this.gains[category]) {
      this.gains[category].gain.value = value;
    }
  }

  getAnalyserData() {
    this.analyser.getByteFrequencyData(this.analyserData);
    return this.analyserData;
  }
}

const instance = new NaturalSoundManager();
export default instance;
