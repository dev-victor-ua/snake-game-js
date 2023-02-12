import config from './config';

/**
 * @returns {Shape}
 */
function getShape() {
  return {
    pos: [0, 0],
    color: config.snake.color,
    size: config.snake.size,
  };
}

export { getShape };
