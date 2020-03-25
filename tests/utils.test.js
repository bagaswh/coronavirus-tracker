const { commafy, numeralify } = require('../src/util');

it('should join list by comma and putting "and" in the end', () => {
  const arr = ['apple', 'banana', 'pickle'];
  expect(commafy(arr)).toBe('apple, banana, and pickle');
  expect(commafy(arr.slice(0, 2))).toBe('apple and banana');
  expect(commafy(arr.slice(0, 1))).toBe('apple');
});

it('should find numbers in the text and numeralify it', () => {
  const str = 'Bonnie bought 10231 toilet papers amid coronavirus fears';
  expect(numeralify(str)).toBe('Bonnie bought 10,231 toilet papers amid coronavirus fears');
});
