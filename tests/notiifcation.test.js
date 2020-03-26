const { makeNotification } = require('../src/notification');

it('should display correct notification message', () => {
  const recoveredDiff = 10;
  const mainCasesDiff = 20;
  const deathsDiff = 30;
  const now = new Date().getTime();
  const prevTimestamp = now - 1000 * 60;

  expect(
    makeNotification(
      recoveredDiff,
      mainCasesDiff,
      deathsDiff,
      120000,
      300000,
      430000,
      15000,
      prevTimestamp,
      now
    )
  ).toEqual({
    title: 'New coronavirus recovered cases, cases, and deaths',
    message: `${recoveredDiff} new recovered, ${mainCasesDiff} new cases, and ${deathsDiff} new deaths since a minute ago (total 430000 cases with 120000 recovered, 300000 active cases, and 15000 deaths)`
  });
});
