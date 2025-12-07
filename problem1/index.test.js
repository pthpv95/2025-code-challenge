const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./index');

describe('sum_to_n_a (iterative approach)', () => {
  test('should return 0 for n = 0', () => {
    expect(sum_to_n_a(0)).toBe(0);
  });

  test('should return 1 for n = 1', () => {
    expect(sum_to_n_a(1)).toBe(1);
  });

  test('should return 15 for n = 5', () => {
    expect(sum_to_n_a(5)).toBe(15);
  });

  test('should return 55 for n = 10', () => {
    expect(sum_to_n_a(10)).toBe(55);
  });

  test('should return 5050 for n = 100', () => {
    expect(sum_to_n_a(100)).toBe(5050);
  });
});

describe('sum_to_n_b (mathematical formula)', () => {
  test('should return 0 for n = 0', () => {
    expect(sum_to_n_b(0)).toBe(0);
  });

  test('should return 1 for n = 1', () => {
    expect(sum_to_n_b(1)).toBe(1);
  });

  test('should return 15 for n = 5', () => {
    expect(sum_to_n_b(5)).toBe(15);
  });

  test('should return 55 for n = 10', () => {
    expect(sum_to_n_b(10)).toBe(55);
  });

  test('should return 5050 for n = 100', () => {
    expect(sum_to_n_b(100)).toBe(5050);
  });
});

describe('sum_to_n_c (recursive approach)', () => {
  test('should return 0 for n = 0', () => {
    expect(sum_to_n_c(0)).toBe(0);
  });

  test('should return 1 for n = 1', () => {
    expect(sum_to_n_c(1)).toBe(1);
  });

  test('should return 15 for n = 5', () => {
    expect(sum_to_n_c(5)).toBe(15);
  });

  test('should return 55 for n = 10', () => {
    expect(sum_to_n_c(10)).toBe(55);
  });

  test('should return 5050 for n = 100', () => {
    expect(sum_to_n_c(100)).toBe(5050);
  });
});

describe('All implementations should produce same results', () => {
  const testCases = [0, 1, 5, 10, 50, 100];

  testCases.forEach(n => {
    test(`all functions return same result for n = ${n}`, () => {
      const resultA = sum_to_n_a(n);
      const resultB = sum_to_n_b(n);
      const resultC = sum_to_n_c(n);

      expect(resultA).toBe(resultB);
      expect(resultB).toBe(resultC);
    });
  });
});
