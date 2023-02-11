import process from 'process';
import config from './config';
import { Direction } from './enums';
import vector from './vector';
import { random, checkCollision, adjustPos } from './utils';
import { getShape } from './resources';
import { getMap } from './maps';

// Game info
const game = {
  canvas: null,
  ctx: null,
  score: {
    results: [],
    elm: null,
    tableElm: null,
  },
};
// Game state
let state = {};

function _getSize(v) {
  return v.map((value) => {
    return (game.canvas.width / 100) * value;
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
    shapes: [],
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
 * Reset game score.
 *
 * @param {Boolean} save Save to game score list.
 */
function resetScore(save = true) {
  if (save) {
    saveScore();
  }

  addScore(state.score * -1);
}

/**
 * Save score to game info.
 */
function saveScore() {
  game.score.results.push(state.score);

  if (!game.score.tableElm) {
    game.score.tableElm = document.querySelector('#score-table');
  }

  const p = document.createElement('p');
  p.dataset.score = state.score;
  p.textContent = state.score;

  game.score.tableElm.appendChild(p);
}

/**
 * Increase score.
 */
function addScore(score) {
  state.score += score;

  if (!game.score.elm) {
    game.score.elm = document.querySelector('#score > span');
  }

  game.score.elm.textContent = state.score;
}

/**
 * Add a new segment to the tail of a snake.
 */
function growSnake() {
  let lastSegment = getShape();
  const segments = state.snake.segments;
  const segmentLength = segments.length;

  if (segmentLength > 0) {
    lastSegment = Object.assign({}, segments[segmentLength - 1]);
    lastSegment.color = config.snake.color;
  } else {
    lastSegment.color = config.snake.headColor;
  }

  segments.push(lastSegment);
}

/**
 * Snake movement.
 */
function moveSnake() {
  const prevHead = state.snake.segments[0];
  const newHead = Object.assign(getShape(), prevHead);

  newHead.pos = vector.add(prevHead.pos, _getAddendPos());
  adjustPos(newHead);

  state.snake.segments[0].color = config.snake.color;
  state.snake.segments = [newHead].concat(state.snake.segments);

  state.snake.segments.pop();

  state.snake.head = newHead;

  updateObstacles();
}

function updateObstacles() {
  state.obstacles = [...state.snake.segments.slice(1), ...state.shapes];
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

  if (
    checkCollision(state.food, state.snake.head) ||
    detectCollision(state.food, state.obstacles)
  ) {
    changeFoodPos();
  }
}

/**
 * Check whether the game is over or not.
 */
function watchGameState() {
  const head = state.snake.head;

  if (detectCollision(head, state.obstacles)) {
    resetScore();
    initState();
    initSnake();
  }
}

function draw() {
  const snake = state.snake;
  const shapes = [state.food, ...snake.segments, ...state.shapes];

  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

  for (let i = 0; i < shapes.length; i++) {
    const pos = _getSize(shapes[i].pos);
    const size = _getSize(shapes[i].size);

    game.ctx.fillStyle = shapes[i].color;
    game.ctx.fillRect(pos[0], pos[1], size[0], size[1]);
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

  window.game = game;
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
  const box = document
    .querySelector(config.canvas.mountPoint)
    .querySelector('#box');
  const newCanvas = document.createElement('canvas');

  newCanvas.width = config.canvas.size[0];
  newCanvas.height = config.canvas.size[1];

  box.appendChild(newCanvas);

  game.canvas = newCanvas;
  game.ctx = game.canvas.getContext('2d');
}

/**
 * Initialize snake game.
 */
async function initSnake() {
  await initMap();

  for (let i = 0; i < config.snake.minSegments; i++) {
    growSnake();
    moveSnake();
  }

  changeFoodPos();
}

function initDraw() {
  requestAnimationFrame(draw);
}

function initControls() {
  let newDirection = Direction.NONE;

  window.addEventListener('keydown', (e) => {
    const keyMaps = config.keyMaps;
    if (e.key in keyMaps.movement) {
      const d = keyMaps.movement[e.key];
      if (isDirectionAllowed(d) && newDirection === Direction.NONE) {
        newDirection = d;
      }
    }
  });

  setInterval(() => {
    if (newDirection !== Direction.NONE) {
      state.snake.direction = newDirection;
      newDirection = Direction.NONE;
    }

    moveSnake();
    feedSnake();
    watchGameState();
  }, config.snake.speed);
}

async function initMap() {
  state.shapes = await getMap('map01');
}

async function initGame() {
  initState();
  initCanvas();
  await initSnake();
  initControls();
  initDraw();

  defineDev();
}

export { detectCollision, initGame };
