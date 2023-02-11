import { Direction } from './enums';
import { random } from './utils';

const defaultConfig = {
  canvas: {
    // An element selector where the canvas should be mounted.
    mountPoint: '#game',
    // Canvas width, height.
    size: [400, 400],
  },
  // Snake properties.
  snake: {
    speed: 100,
    // A color of segments.
    color: '#228b22',
    headColor: '#000',
    // Segment size.
    size: [4, 4],
    // A minimum number of segments. If set 1, the snake starts without a tail.
    minSegments: 2,
    startPos: [0, 0],
  },
  food: {
    color: 'red',
    size: [4, 4],
  },
  keyMaps: {
    movement: {
      ArrowUp: Direction.UP,
      ArrowDown: Direction.DOWN,
      ArrowLeft: Direction.LEFT,
      ArrowRight: Direction.RIGHT,
    },
  },
  // The score that given for each food eaten.
  score: 5,
};

function getConfig() {
  return defaultConfig;
}

export default getConfig();
