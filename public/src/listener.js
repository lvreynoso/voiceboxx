// test.js
import { findPitch } from 'pitchy';

function updatePitch(analyserNode, sampleRate) {
  let data = new Float32Array(analyserNode.fftSize);
  analyserNode.getFloatTimeDomainData(data);
  let [pitch, clarity] = findPitch(data, sampleRate);

  if (clarity > 0.98) {
      document.getElementById('pitch').textContent = String(pitch);
      document.getElementById('clarity').textContent = String(clarity);
  }
  window.requestAnimationFrame(() => updatePitch(analyserNode, sampleRate));
}

document.addEventListener("DOMContentLoaded", () => {
  // For cross-browser compatibility.
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let analyserNode = audioContext.createAnalyser();

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    let sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(analyserNode);
    updatePitch(analyserNode, audioContext.sampleRate);
  });
});
