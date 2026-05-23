import { fieldsEqual, compareCron } from './compare.js';

describe('fieldsEqual', () => {
  test('identical strings are equal', () => {
    expect(fieldsEqual('5', '5')).toBe(true);
  });

  test('both wildcards are equal', () => {
    expect(fieldsEqual('*', '*')).toBe(true);
  });

  test('different values are not equal', () => {
    expect(fieldsEqual('5', '6')).toBe(false);
  });

  test('list vs range equivalent', () => {
    expect(fieldsEqual('1,2,3', '1-3')).toBe(true);
  });

  test('step notation equivalent to list', () => {
    expect(fieldsEqual('0/2', '0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58')).toBe(true);
  });

  test('different lengths not equal', () => {
    expect(fieldsEqual('1,2', '1,2,3')).toBe(false);
  });
});

describe('compareCron', () => {
  test('identical expressions are equal', () => {
    expect(compareCron('0 9 * * 1', '0 9 * * 1')).toBe('equal');
  });

  test('wildcard vs specific is superset', () => {
    expect(compareCron('0 9 * * *', '0 9 * * 1')).toBe('superset');
  });

  test('specific vs wildcard is subset', () => {
    expect(compareCron('0 9 * * 1', '0 9 * * *')).toBe('subset');
  });

  test('non-overlapping weekdays are disjoint', () => {
    expect(compareCron('0 9 * * 1', '0 9 * * 2')).toBe('disjoint');
  });

  test('overlapping hour lists', () => {
    expect(compareCron('0 9,10 * * *', '0 10,11 * * *')).toBe('overlap');
  });

  test('fully wildcard expressions are equal', () => {
    expect(compareCron('* * * * *', '* * * * *')).toBe('equal');
  });
});
