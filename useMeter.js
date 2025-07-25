
import { useEffect } from 'react';

export default function useMeter(nodes, meterRef) {
  useEffect(() => {
    if (!nodes || nodes.length === 0 || !meterRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = nodes[0]?.context || new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const merger = context.createChannelMerger(nodes.length);
    nodes.forEach(n => n.gain.connect(merger));
    merger.connect(analyser);

    const canvas = meterRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 10;
    canvas.height = 100;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b) / bufferLength;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barHeight = (avg / 255) * canvas.height;
      ctx.fillStyle = '#0f0';
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
    };

    draw();

    return () => {
      merger.disconnect();
      analyser.disconnect();
    };
  }, [nodes, meterRef]);
}
