import { Direction } from './enums';

const defaultConfig = {
  canvas: {
    // An element selector where the canvas should be mounted.
    mountPoint: '#game',
    // Canvas width, height.
    size: [400, 400],
  },
  // Snake properties.
  snake: {
    speed: 0.5,
    // A color of each segment.
    color: '#228b22',
    // Segment size.
    size: [4, 4],
    // A minimum number of segments. If set 1, the snake starts without a tail.
    minSegments: 3,
    startPos: [0, 0],
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
