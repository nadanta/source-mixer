// File: src/components/GlobalVisualizer.jsx
import React, { useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import "../styles/audiomotion.css"; // ✅ Local copy of analyzer CSS
import "../styles/visualizer.css";  // Optional custom styles
import { ctx, masterGain } from "../audio/AudioBus";

export default function GlobalVisualizer() {
  const containerRef = useRef(null);
  const analyzerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container && !analyzerRef.current) {
      analyzerRef.current = new AudioMotionAnalyzer(container, {
        source: masterGain,
        audioCtx: ctx,
        mode: 10,
        height: 120,
        gradient: 'rainbow',
        showScaleX: false,
        showScaleY: false,
        useCanvas: true,
        overlay: true,
        alphaBars: true,
        barSpace: 0.8,
      });
    }

    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.destroy();
        analyzerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="visualizer-container">
      <div ref={containerRef} className="visualizer-inner"></div>
    </div>
  );
}

