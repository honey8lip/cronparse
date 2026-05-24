import { shiftToken, shiftField, shiftCron, addMinutes } from './cronMath.js';

describe('shiftToken', () => {
  test('shifts a plain number within bounds', () => {
    expect(shiftToken('5', 3, 0, 59)).toBe('8');
  });

  test('wraps around max boundary', () => {
    expect(shiftToken('58', 3, 0, 59)).toBe('1');
  });

  test('returns wildcard unchanged', () => {
    expect(shiftToken('*', 5, 0, 59)).toBe('*');
  });

  test('shifts step token base', () => {
    expect(shiftToken('10/5', 2, 0, 59)).toBe('12/5');
  });

  test('preserves wildcard base in step token', () => {
    expect(shiftToken('*/5', 2, 0, 59)).toBe('*/5');
  });

  test('shifts range token', () => {
    expect(shiftToken('1-5', 2, 0, 59)).toBe('3-7');
  });
});

describe('shiftField', () => {
  test('shifts comma-separated values', () => {
    expect(shiftField('0,15,30', 'minute', 5)).toBe('5,20,35');
  });

  test('wraps values in hour field', () => {
    expect(shiftField('22,23', 'hour', 3)).toBe('1,2');
  });

  test('handles single wildcard', () => {
    expect(shiftField('*', 'minute', 10)).toBe('*');
  });
});

describe('shiftCron', () => {
  test('shifts minute field only', () => {
    const result = shiftCron('0 9 * * *', { minute: 30 });
    expect(result).toBe('30 9 * * *');
  });

  test('shifts hour field only', () => {
    const result = shiftCron('0 9 * * *', { hour: 2 });
    expect(result).toBe('0 11 * * *');
  });

  test('shifts multiple fields', () => {
    const result = shiftCron('0 9 1 * *', { hour: 1, dom: 2 });
    expect(result).toBe('0 10 3 * *');
  });

  test('returns unchanged expression with no offsets', () => {
    const result = shiftCron('30 8 * * 1', {});
    expect(result).toBe('30 8 * * 1');
  });
});

describe('addMinutes', () => {
  test('adds minutes within same hour', () => {
    expect(addMinutes('0 9 * * *', 30)).toBe('30 9 * * *');
  });

  test('rolls over to next hour', () => {
    expect(addMinutes('45 9 * * *', 30)).toBe('15 10 * * *');
  });

  test('rolls over midnight', () => {
    expect(addMinutes('30 23 * * *', 60)).toBe('30 0 * * *');
  });

  test('returns original expression if minute is wildcard', () => {
    expect(addMinutes('* 9 * * *', 30)).toBe('* 9 * * *');
  });
});
