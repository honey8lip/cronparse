import {
  matchesToken,
  matchesFieldValue,
  matchingValues,
  fieldsMatch,
  isSubsetOf,
  fieldOverlap
} from './matchers.js';

describe('matchesToken', () => {
  test('wildcard matches any value', () => {
    expect(matchesToken(5, '*')).toBe(true);
    expect(matchesToken(0, '*')).toBe(true);
  });

  test('exact value matches', () => {
    expect(matchesToken(5, '5')).toBe(true);
    expect(matchesToken(4, '5')).toBe(false);
  });

  test('range token matches values in range', () => {
    expect(matchesToken(3, '1-5')).toBe(true);
    expect(matchesToken(6, '1-5')).toBe(false);
  });

  test('step token matches correct values', () => {
    expect(matchesToken(0, '*/2')).toBe(true);
    expect(matchesToken(2, '*/2')).toBe(true);
    expect(matchesToken(1, '*/2')).toBe(false);
  });
});

describe('matchesFieldValue', () => {
  test('wildcard always matches', () => {
    expect(matchesFieldValue(10, '*')).toBe(true);
  });

  test('comma-separated values', () => {
    expect(matchesFieldValue(3, '1,3,5')).toBe(true);
    expect(matchesFieldValue(4, '1,3,5')).toBe(false);
  });

  test('mixed tokens', () => {
    expect(matchesFieldValue(6, '1-5,6')).toBe(true);
    expect(matchesFieldValue(7, '1-5,6')).toBe(false);
  });
});

describe('matchingValues', () => {
  test('returns all matching values in range', () => {
    expect(matchingValues('*/15', 0, 59)).toEqual([0, 15, 30, 45]);
  });

  test('wildcard returns all values', () => {
    expect(matchingValues('*', 0, 4)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('fieldsMatch', () => {
  test('identical fields match', () => {
    expect(fieldsMatch('1-5', '1-5', 0, 59)).toBe(true);
  });

  test('equivalent expressions match', () => {
    expect(fieldsMatch('1,2,3', '1-3', 0, 59)).toBe(true);
  });

  test('different fields do not match', () => {
    expect(fieldsMatch('1-5', '1-6', 0, 59)).toBe(false);
  });
});

describe('isSubsetOf', () => {
  test('subset returns true', () => {
    expect(isSubsetOf('1,3', '1-5', 0, 59)).toBe(true);
  });

  test('superset returns false', () => {
    expect(isSubsetOf('1-5', '1,3', 0, 59)).toBe(false);
  });
});

describe('fieldOverlap', () => {
  test('returns intersection of two fields', () => {
    expect(fieldOverlap('1-5', '3-7', 0, 59)).toEqual([3, 4, 5]);
  });

  test('no overlap returns empty array', () => {
    expect(fieldOverlap('1-3', '5-7', 0, 59)).toEqual([]);
  });
});
