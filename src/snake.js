import config from './config';

let canvas = null;
let ctx = null;

function initCanvas() {
  const mountPoint = document.querySelector(config.mountPoint);
  const newCanvas = document.createElement('canvas');

  newCanvas.width = config.canvas.width;
  newCanvas.height = config.canvas.height;

  mountPoint.appendChild(newCanvas);

  canvas = newCanvas;
  ctx = canvas.getContext('2d');
}

function initGame() {
  initCanvas();
}

export default initGame;
