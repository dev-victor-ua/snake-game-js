import { checkCollision } from './utils';

describe('utils', () => {
  it.each([
    {
      desc: 'from: top to bottom; collision: false; x: -3; y: -8',
      s1: { pos: [88, 60], size: [4, 4] },
      s2: { pos: [91, 68], size: [4, 4] },
      expected: false,
    },
    {
      desc: 'from: bottom to top; collision: false; x: 0; y: 7',
      s1: { pos: [52, 32], size: [4, 4] },
      s2: { pos: [52, 25], size: [4, 4] },
      expected: false,
    },
    {
      desc: 'from: left to right; collision: false; x: -10; y: 2',
      s1: { pos: [32, 32], size: [4, 4] },
      s2: { pos: [42, 30], size: [4, 4] },
      expected: false,
    },
    {
      desc: 'from: right to left; collision: false; x: 6; y: -2',
      s1: { pos: [24, 8], size: [4, 4] },
      s2: { pos: [18, 10], size: [4, 4] },
      expected: false,
    },
    {
      desc: 'from: top to bottom; collision: true; x: 0; y: -1',
      s1: { pos: [36, 68], size: [4, 4] },
      s2: { pos: [36, 69], size: [4, 4] },
      expected: true,
    },
    {
      desc: 'from: bottom to top; collision: true; x: 4; y: -1',
      s1: { pos: [40, 8], size: [4, 4] },
      s2: { pos: [36, 7], size: [4, 4] },
      expected: true,
    },
    {
      desc: 'from: left to right; collision: true; x: -1; y: 0',
      s1: { pos: [80, 92], size: [4, 4] },
      s2: { pos: [81, 92], size: [4, 4] },
      expected: true,
    },
    {
      desc: 'from: right to left; collision: true; x: 3; y: -2',
      s1: { pos: [16, 88], size: [4, 4] },
      s2: { pos: [13, 90], size: [4, 4] },
      expected: true,
    },
  ])(
    'checkCollision: $desc',
    ({ s1, s2, expected }) => {
      expect(checkCollision(s1, s2)).toBe(expected);
    }
  );
});
