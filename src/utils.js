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

export { checkCollision, random };
