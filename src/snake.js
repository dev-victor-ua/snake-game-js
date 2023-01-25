import config from './config';
import { Direction } from './enums';
import vector from './vector';

// Game state
const state = {
  canvas: null,
  ctx: null,
  snake: {
    size: config.snake.size,
    oldDirection: Direction.RIGHT,
    direction: Direction.RIGHT,
    segments: [],
  },
  score: 0,
};

// TODO: Remove.
window.vector = vector;
window.state = state;
window.growSnake = growSnake;

function _getSize(v) {
  return v.map((value) => {
    return (state.canvas.width / 100) * value;
  });
}

function isDirectionAllowed(newDirection) {
  const direction = state.snake.direction;

  return !(
    (direction === Direction.LEFT && newDirection === Direction.RIGHT) ||
    (direction === Direction.RIGHT && newDirection === Direction.LEFT) ||
    (direction === Direction.UP && newDirection === Direction.DOWN) ||
    (direction === Direction.DOWN && newDirection === Direction.UP)
  );
}

function _getAddendPos() {
  const snake = state.snake;
  let direction = state.snake.direction;

  if (direction === Direction.DOWN) {
    return [0, snake.size[0]];
  } else if (direction === Direction.UP) {
    return [0, -snake.size[0]];
  } else if (direction === Direction.RIGHT) {
    return [snake.size[0], 0];
  } else if (direction === Direction.LEFT) {
    return [-snake.size[0], 0];
  }

  return [0, 0];
}

/**
 * Increase score.
 */
function addScore(score) {}

/**
 * Add a new segment to the tail of a snake.
 */
function growSnake() {
  let lastSegment = {
    pos: [0, 0],
  };
  const segments = state.snake.segments;

  if (state.snake.segments.length > 0) {
    lastSegment = Object.assign({}, segments[segments.length - 1]);
  }

  segments.push(lastSegment);
}

/**
 * Snake movement.
 */
function moveSnake() {
  const segments = state.snake.segments;

  for (let i = 0, prevSegment = null; i < segments.length; i++) {
    const segmentCopy = Object.assign({}, segments[i]);
    if (i <= 0) {
      segments[i].pos = vector.add(segments[i].pos, _getAddendPos());
    } else {
      segments[i].pos = prevSegment.pos;
    }

    prevSegment = segmentCopy;
  }
}

function draw() {
  const snake = state.snake;
  const segments = snake.segments;

  state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

  for (let i = 0; i < segments.length; i++) {
    if (i > 0) {
      state.ctx.fillStyle = config.snake.color;
    } else {
      state.ctx.fillStyle = '#000';
    }
    const pos = _getSize(segments[i].pos);
    const size = _getSize(snake.size);
    state.ctx.fillRect(pos[0], pos[1], size[0], size[1]);
  }

  requestAnimationFrame(draw);
}

/**
 * Init HTML canvas.
 */
function initCanvas() {
  const mountPoint = document.querySelector(config.canvas.mountPoint);
  const newCanvas = document.createElement('canvas');

  newCanvas.width = config.canvas.size[0];
  newCanvas.height = config.canvas.size[1];

  mountPoint.appendChild(newCanvas);

  state.canvas = newCanvas;
  state.ctx = state.canvas.getContext('2d');
}

/**
 * Initialize snake game.
 */
function initSnake() {
  for (let i = 0; i < config.snake.minSegments; i++) {
    growSnake();
    if (i > 0) {
      moveSnake();
    }
  }

  requestAnimationFrame(draw);
}

function initGame() {
  initCanvas();
  initSnake();
}

window.addEventListener('keydown', (e) => {
  const keyMaps = config.keyMaps;
  if (e.key in keyMaps.movement) {
    const newDirection = keyMaps.movement[e.key];
    if (isDirectionAllowed(newDirection)) {
      state.snake.direction = newDirection;
      moveSnake();
    }
  }
});

export default initGame;
