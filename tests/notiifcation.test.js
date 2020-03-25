const { makeNotification } = require('../src/notification');

it('should display correct notification message', () => {
  const recoveredDiff = 10;
  const mainCasesDiff = 20;
  const deathsDiff = 30;
  const now = new Date().getTime();
  const prevTimestamp = now - 1000 * 60;
  expect(makeNotification(recoveredDiff, 0, 0, 120000, 400000, 15000, prevTimestamp, now)).toEqual({
    title: 'New coronavirus cases recovered',
    message: `${recoveredDiff} new cases recovered since a minute ago (total 120000 recovered cases, 400000 active cases, and 15000 deaths)`
  });

  expect(
    makeNotification(recoveredDiff, mainCasesDiff, 0, 120000, 400000, 15000, prevTimestamp, now)
  ).toEqual({
    title: 'New coronavirus cases recovered and cases',
    message: `${recoveredDiff} new cases recovered and ${mainCasesDiff} new cases since a minute ago (total 120000 recovered cases, 400000 active cases, and 15000 deaths)`
  });

  expect(
    makeNotification(
      recoveredDiff,
      mainCasesDiff,
      deathsDiff,
      120000,
      400000,
      15000,
      prevTimestamp,
      now
    )
  ).toEqual({
    title: 'New coronavirus cases recovered, cases, and deaths',
    message: `${recoveredDiff} new cases recovered, ${mainCasesDiff} new cases, and ${deathsDiff} new deaths since a minute ago (total 120000 recovered cases, 400000 active cases, and 15000 deaths)`
  });

  expect(
    makeNotification(recoveredDiff, 0, deathsDiff, 120000, 400000, 15000, prevTimestamp, now)
  ).toEqual({
    title: 'New coronavirus cases recovered and deaths',
    message: `${recoveredDiff} new cases recovered and ${deathsDiff} new deaths since a minute ago (total 120000 recovered cases, 400000 active cases, and 15000 deaths)`
  });
});
