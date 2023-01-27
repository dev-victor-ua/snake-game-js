import config from './config';
import { Direction } from './enums';
import vector from './vector';
import { random, checkCollision } from './utils';

// Game state
const state = {
  canvas: null,
  ctx: null,
  snake: {
    size: config.snake.size,
    direction: Direction.RIGHT,
    segments: [],
  },
  food: {
    pos: [0, 0],
    size: config.food.size,
    color: config.food.color,
  },
  score: 0,
};

// TODO: Remove.
window.vector = vector;
window.state = state;
window.growSnake = growSnake;
window.detectCollision = detectCollision;

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

function feedSnake() {}

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
    color: '#000',
    size: config.snake.size,
  };
  const segments = state.snake.segments;
  const segmentLength = segments.length;

  if (segmentLength > 0) {
    lastSegment = Object.assign({}, segments[segmentLength - 1]);
  }

  lastSegment.color = config.snake.color(segmentLength);

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

function detectCollision(unit, checkUnits) {
  for (const checkUnit of checkUnits) {
    if (checkUnit.pos) {
      // Test
    }
  }

  return false;
}

function changeFoodPos() {
  const newPos = [
    random(0, 100 - state.food.size[0]),
    random(0, 100 - state.food.size[1]),
  ];

  state.food.pos = newPos;
}

function draw() {
  const snake = state.snake;
  const shapes = [state.food, ...snake.segments];

  state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

  for (let i = 0; i < shapes.length; i++) {
    const pos = _getSize(shapes[i].pos);
    const size = _getSize(shapes[i].size);

    state.ctx.fillStyle = shapes[i].color;
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

  changeFoodPos();

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

export { detectCollision, initGame };
