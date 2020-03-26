const path = require('path');
const notifier = require('node-notifier');
const _ = require('lodash');
const { commafy, numeralify, playSound, stripNonExistingDirs } = require('./util');
const moment = require('moment');
const { useCustomSound, customSoundPaths } = require('commander').program;

const root = path.resolve(__dirname, '../');

async function notify(title, message) {
  await stripNonExistingDirs(customSoundPaths);

  message = numeralify(message);

  if (useCustomSound && customSoundPaths.length) {
    playSound();
  }

  notifier.notify({
    title,
    message,
    icon: path.join(root, 'assets', 'Coronavirus.png'),
    sound: !useCustomSound || !customSoundPaths.length,
    wait: false
  });
}

function makeNotification(
  recoveredDiff,
  mainCasesDiff,
  deathsDiff,

  recovered,
  activeCases,
  mainCases,
  deaths,

  prevTimestamp,
  nowTimestamp
) {
  let title = 'New coronavirus';
  const nouns = [];
  const message = [];

  if (recoveredDiff > 0) {
    nouns.push('recovered cases');
    message.push(`${recoveredDiff} new recovered`);
  }
  if (mainCasesDiff > 0) {
    nouns.push('cases');
    message.push(`${mainCasesDiff} new cases`);
  }
  if (deathsDiff > 0) {
    nouns.push('deaths');
    message.push(`${deathsDiff} new deaths`);
  }
  return {
    title: title + ' ' + commafy(nouns),
    message:
      commafy(message) +
      ` since ${moment(prevTimestamp).from(
        nowTimestamp
      )} (total ${mainCases} cases with ${recovered} recovered, ${activeCases} active cases, and ${deaths} deaths)`
  };
}

function notificationWrapper(prev, now) {
  if (_.isEmpty(prev) && !_.isEmpty(now)) {
    notify(
      `Current coronavirus cases`,
      `Total ${now.mainCases} cases with ${now.currentlyInfected} active cases, ${now.recovered} recovered, and ${now.deaths} deaths`
    );
    return;
  }

  const recoveredDiff = now.recovered - prev.recovered;
  const mainCasesDiff = now.mainCases - prev.mainCases;
  const deathsDiff = now.deaths - prev.deaths;
  if (!recoveredDiff && !mainCasesDiff && !deathsDiff) {
    return;
  }

  const { title, message } = makeNotification(
    recoveredDiff,
    mainCasesDiff,
    deathsDiff,
    now.recovered,
    now.currentlyInfected,
    now.mainCases,
    now.deaths,
    prev.timestamp,
    now.timestamp
  );
  notify(title, message);
}

module.exports = { notify, makeNotification, notificationWrapper };
