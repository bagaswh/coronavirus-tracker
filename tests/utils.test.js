const moment = require('moment');
const { commafy, numeralify, formatTime, playSound } = require('../src/util');

it('should play sound', () => {
  playSound();
});

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

it('should display time if the same day as today, date and time if the other day', () => {
  const m = moment();
  expect(formatTime(m)).toBe(m.format('LT'));

  expect(formatTime(moment(m).subtract(1, 'hour'))).toBe(
    moment(m)
      .subtract(1, 'hour')
      .format('LT')
  );

  expect(formatTime(moment(m).subtract(24, 'hour'))).toBe(
    moment(m)
      .subtract(24, 'hour')
      .format('LLL')
  );

  expect(formatTime(moment(m).subtract(1, 'day'))).toBe(
    moment(m)
      .subtract(1, 'day')
      .format('LLL')
  );

  expect(formatTime(moment(m).subtract(15, 'day'))).toBe(
    moment(m)
      .subtract(15, 'day')
      .format('LLL')
  );

  expect(formatTime(moment(m).subtract(1, 'month'))).toBe(
    moment(m)
      .subtract(1, 'month')
      .format('LLL')
  );
});
