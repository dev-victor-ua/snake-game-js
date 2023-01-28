import process from 'process';
import config from './config';
import { Direction } from './enums';
import vector from './vector';
import { random, checkCollision, adjustPos } from './utils';

const canvas = {
  elm: null,
  ctx: null,
};
// Game state
let state = {};

function _getSize(v) {
  return v.map((value) => {
    return (canvas.elm.width / 100) * value;
  });
}

function initState() {
  const newState = {
    snake: {
      size: config.snake.size,
      direction: Direction.RIGHT,
      segments: [],
      head: null,
    },
    food: {
      pos: [0, 0],
      size: config.food.size,
      color: config.food.color,
    },
    obstacles: [],
    score: 0,
  };

  // Clear the state and populate with properties from a new one.
  for (let key in state) {
    delete state[key];
  }

  Object.assign(state, newState);
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

function feedSnake() {
  if (!checkCollision(state.snake.head, state.food)) {
    return;
  }

  growSnake();
  changeFoodPos();

  addScore(config.score);
}

/**
 * Increase score.
 */
function addScore(score) {
  state.score += score;
}

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
function moveSnake(feed_snake = true) {
  const segments = state.snake.segments;

  for (let i = 0, prevSegment = null; i < segments.length; i++) {
    const segmentCopy = Object.assign({}, segments[i]);
    if (i <= 0) {
      segments[i].pos = vector.add(segments[i].pos, _getAddendPos());
      adjustPos(segments[i]);
    } else {
      segments[i].pos = prevSegment.pos;
    }

    prevSegment = segmentCopy;
  }

  state.snake.head = state.snake.segments[0];
  state.obstacles = state.snake.segments.slice(1);

  if (feed_snake) {
    feedSnake();
  }

  watchGameState();
}

function detectCollision(unit, checkUnits) {
  for (const checkUnit of checkUnits) {
    if (checkCollision(unit, checkUnit)) {
      return true;
    }
  }

  return false;
}

function changeFoodPos() {
  state.food.pos = [
    random(0, 100 - state.food.size[0]),
    random(0, 100 - state.food.size[1]),
  ];

  if (detectCollision(state.food, state.snake.segments)) {
    changeFoodPos();
  }
}

/**
 * Check whether the game is over or not.
 */
function watchGameState() {
  const head = state.snake.head;

  if (detectCollision(head, state.obstacles)) {
    initState();
    initSnake();
  }
}

function draw() {
  const snake = state.snake;
  const shapes = [state.food, ...snake.segments];

  canvas.ctx.clearRect(0, 0, canvas.elm.width, canvas.elm.height);

  for (let i = 0; i < shapes.length; i++) {
    const pos = _getSize(shapes[i].pos);
    const size = _getSize(shapes[i].size);

    canvas.ctx.fillStyle = shapes[i].color;
    canvas.ctx.fillRect(pos[0], pos[1], size[0], size[1]);
  }

  requestAnimationFrame(draw);
}

/**
 * Expose variables and functions for non-production environment.
 *
 * @returns
 */
function defineDev() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  window.vector = vector;
  window.state = state;
  window.growSnake = growSnake;
  window.detectCollision = detectCollision;
  window.checkCollision = checkCollision;
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

  canvas.elm = newCanvas;
  canvas.ctx = canvas.elm.getContext('2d');
}

/**
 * Initialize snake game.
 */
function initSnake() {
  for (let i = 0; i < config.snake.minSegments; i++) {
    growSnake();
    if (i > 0) {
      moveSnake(false);
    }
  }

  changeFoodPos();
}

function initDraw() {
  requestAnimationFrame(draw);
}

function initGame() {
  initState();
  initCanvas();
  initSnake();
  initDraw();

  defineDev();
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
