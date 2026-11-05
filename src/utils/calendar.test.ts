import { monthGrid } from './calendar';
import { toDateString } from './deadline';

describe('monthGrid', () => {
  it('November 2026 dimulai Senin 26 Okt dan berisi 42 sel', () => {
    const grid = monthGrid(2026, 10);
    expect(grid).toHaveLength(42);
    expect(toDateString(grid[0])).toBe('2026-10-26');
    expect(toDateString(grid[6])).toBe('2026-11-01');
    expect(toDateString(grid[41])).toBe('2026-12-06');
  });
});
