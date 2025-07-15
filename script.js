
document.querySelectorAll('.osc-panel').forEach((panel, i) => {
  panel.innerHTML = `
    <h3>Oscillator ${i + 1}</h3>
    <button class="power">Power</button>
    <div>
      <label>Freq:</label>
      <input type="range" min="20" max="20000" value="440" class="freq">
      <input type="number" value="440" class="freq-input">
    </div>
    <div>
      <label>Gain:</label>
      <input type="range" min="0" max="1" step="0.01" value="0.2" class="gain">
    </div>
    <div>
      <button class="focus">Focus</button>
    </div>
  `;

  const freqSlider = panel.querySelector(".freq");
  const freqInput = panel.querySelector(".freq-input");

  freqSlider.addEventListener("input", () => {
    freqInput.value = freqSlider.value;
  });

  freqInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      freqSlider.value = freqInput.value;
    }
  });

  panel.querySelector(".focus").addEventListener("click", () => {
    panel.classList.toggle("focused");
  });
});
