#!/usr/bin/env node

const _ = require('lodash');
const notifier = require('node-notifier');
const { program } = require('commander');
const debug = require('debug')('app:main');
const path = require('path');
const moment = require('moment');

const db = require('./data/database');
const { fetchData } = require('./data/datafetcher');

program
  .option('-i, --interval <interval>', 'Fetch interval (ms)', 15 * 60 * 1000)
  .option('-c, --clear', 'Clear data before starting', false);
program.parse(process.argv);

function notify(dataDiff, dataTotal, dataName, timestampNow, timestampPrev) {
  notifier.notify({
    title: `New coronavirus ${dataName}`,
    message: `${dataDiff} new ${dataName} since ${moment(timestampPrev).from(
      timestampNow
    )} (total ${dataTotal} ${dataName})`,
    icon: path.join('assets', 'Coronavirus.png'),
    sound: path.join('assets', 'Infect.mp3'),
    wait: false
  });
}

function compareData(prev, now) {
  if (_.isEmpty(prev)) {
    return;
  }
  const mainCasesDiff = now.mainCases - prev.mainCases;
  if (mainCasesDiff) {
    notify(mainCasesDiff, now.mainCases, 'cases', now.timestamp, prev.timestamp);
  }

  const deathsDiff = now.deaths - prev.deaths;
  if (deathsDiff) {
    notify(deathsDiff, now.deaths, 'deaths', now.timestamp, prev.timestamp);
  }
}

async function main() {
  if (program.clear) {
    db.clear();
  }

  debug('Fetching data');
  const data = await fetchData();
  debug('Done fetching data');

  debug('Fetching previous data from database');
  const lastData = db.getLast('cases');
  compareData(lastData, data);

  debug('Push new data into database');
  db.add('cases', data);
  debug('Everything done');
  console.log('\n');

  setInterval(main, program.interval);
}

main();
