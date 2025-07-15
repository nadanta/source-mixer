diff --git a/script.js b/script.js
index 1d0471fb7b7c2b08f5947ddfb826e0c9c19539e3..d7b49ea7292ad55205795ea0f51de0f29c4ce05b 100644
--- a/script.js
+++ b/script.js
@@ -4,55 +4,55 @@ const oscConfigs = [
   { label: "Low", minFreq: 20, maxFreq: 200 },
   { label: "Low-Mid", minFreq: 100, maxFreq: 10000 },
   { label: "Mid-High", minFreq: 500, maxFreq: 15000 }
 ];
 
 const symbols = ["∿", "◻", "w", "▵"];
 const types = ["sine", "square", "sawtooth", "triangle"];
 
 const container = document.getElementById("osc-container");
 
 oscConfigs.forEach((cfg, i) => {
   const oscPanel = document.createElement("div");
   oscPanel.className = "oscillator";
 
   const ctx = new AudioContext();
   let osc = null;
   let gainNode = ctx.createGain();
   gainNode.connect(ctx.destination);
   gainNode.gain.value = 0.5;
   let currentType = "sine";
 
   const controls = document.createElement("div");
   controls.className = "controls";
 
   const powerBtn = document.createElement("button");
-  powerBtn.textContent = "Power";
+  powerBtn.textContent = "\u23FB"; // power symbol
   let isOn = false;
 
   const focusBtn = document.createElement("button");
-  focusBtn.textContent = "Focus";
+  focusBtn.textContent = "\ud83d\udd0d"; // magnifier for focus
 
   powerBtn.onclick = () => {
     isOn = !isOn;
     powerBtn.classList.toggle("active", isOn);
     if (isOn) {
       osc = ctx.createOscillator();
       osc.type = currentType;
       osc.frequency.setValueAtTime(freqSlider.value, ctx.currentTime);
       osc.connect(gainNode);
       osc.start();
       activateWaveform(0); // default to sine
     } else if (osc) {
       osc.stop();
       osc.disconnect();
     }
   };
 
   focusBtn.onclick = () => {
     document.querySelectorAll(".oscillator").forEach(p => {
       p.style.display = (p === oscPanel) ? "block" : "none";
       p.style.transform = (p === oscPanel) ? "scale(1.3)" : "scale(1)";
     });
     focusBtn.classList.toggle("focused");
     if (!focusBtn.classList.contains("focused")) {
       document.querySelectorAll(".oscillator").forEach(p => {
