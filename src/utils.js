/**
 * Check if objects collide with each-other
 *
 * @param {*} s1
 * @param {*} s2
 * @returns
 */
function checkCollision(s1, s2) {
  return (
    s1.pos[0] + s1.size[0] >= s2.pos[0] &&
    s1.pos[0] <= s2.pos[0] + s2.size[0] &&
    s1.pos[1] + s1.size[1] >= s2.pos[1] &&
    s1.pos[1] <= s2.pos[1] + s2.size[1]
  );
}

/**
 * Mirrors the shape position if it crosses the canvas line.
 *
 * @param {object} shape
 * @returns
 */
function adjustPos(shape) {
  const pos = shape.pos;

  if (pos[0] >= 100) {
    shape.pos = [0, pos[1]];
  } else if (pos[0] < 0) {
    shape.pos = [100 - shape.size[0], pos[1]];
  } else if (pos[1] >= 100) {
    shape.pos = [pos[0], 0];
  } else if (pos[1] < 0) {
    shape.pos = [pos[0], 100 - shape.size[1]];
  }

  return pos;
}

/**
 * Generate random number (>= min and <= max).
 *
 * @param {Number} min Inclusive number
 * @param {Number} max Inclusive number
 * @returns
 */
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

export { checkCollision, random, adjustPos };
