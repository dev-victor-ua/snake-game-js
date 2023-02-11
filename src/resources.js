import config from './config';

/**
 * @returns {Segment}
 */
function snakeSegment() {
  return {
    pos: [0, 0],
    color: config.snake.color,
    size: config.snake.size,
  };
}

export { snakeSegment };
