// File: src/audio/AudioBus.js
const ctx = new (window.AudioContext || window.webkitAudioContext)();

const masterGain = ctx.createGain();
const analyser = ctx.createAnalyser();

masterGain.connect(analyser);
analyser.connect(ctx.destination);

export { ctx, masterGain, analyser };
