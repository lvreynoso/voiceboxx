"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _pitchy = require("pitchy");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function updatePitch(analyserNode, sampleRate) {
  let data = new Float32Array(analyserNode.fftSize);
  analyserNode.getFloatTimeDomainData(data);

  let _findPitch = (0, _pitchy.findPitch)(data, sampleRate),
      _findPitch2 = _slicedToArray(_findPitch, 2),
      pitch = _findPitch2[0],
      clarity = _findPitch2[1];

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
  navigator.mediaDevices.getUserMedia({
    audio: true
  }).then(stream => {
    let sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(analyserNode);
    updatePitch(analyserNode, audioContext.sampleRate);
  });
});
//# sourceMappingURL=test.js.map