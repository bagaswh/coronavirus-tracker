const EventEmitter = require('events');

const _ = require('lodash');
const notifier = require('node-notifier');
const { program } = require('commander');
const debug = require('debug')('app');
const path = require('path');
const moment = require('moment');

// const terminal = require('./view/terminal');
const db = require('../src/data/database');
const { fetchData } = require('../src/data/datafetcher');

program
  .option('-i, --interval <interval>', 'Fetch interval (ms)', 3 * 60 * 1000)
  .option('-c, --clear', 'Clear data before starting', false);
program.parse(process.argv);

const root = path.resolve(__dirname, '../');

function notify(title, message) {
  notifier.notify({
    title,
    message,
    icon: path.join(root, 'assets', 'Coronavirus.png'),
    sound: path.join(root, 'assets', 'Infect.mp3'),
    wait: false
  });
}

function compareData(prev, now) {
  if (_.isEmpty(prev)) {
    notify(`Current coronavirus cases`, `${now.mainCases} cases with ${now.deaths} deaths`);
    return;
  }

  let message = '';
  let title = '';
  const mainCasesDiff = now.mainCases - prev.mainCases;
  const deathsDiff = now.deaths - prev.deaths;
  if (!mainCasesDiff && !deathsDiff) {
    return;
  }
  if (mainCasesDiff) {
    title = 'New coronavirus cases';
    message = `${mainCasesDiff} new cases`;
  }
  if (deathsDiff) {
    title += ` ${deathsDiff ? 'and' : 'New coronavirus'} deaths`;
    message += ` ${deathsDiff ? 'and' : ''} ${deathsDiff} new deaths`;
  }
  message += ` since ${moment(prev.timestamp).from(now.timestamp)}`;
  notify(title, message);
}

class Tracker extends EventEmitter {
  constructor(logger) {
    super();

    this._interval = -1;
    this._logger = logger || debug;
  }

  init() {
    this.fetch();
    this._interval = this._startFetchingLoop();
  }

  log(msg) {
    this.emit('log', msg);
  }

  async fetch() {
    clearInterval(this._interval);

    if (program.clear) {
      db.clear();
    }

    this.log('Fetching data');
    const data = await fetchData(this);
    this.log('Done fetching data');

    this.log('Fetching previous data from database');
    const lastData = db.getLast('cases');
    compareData(lastData, data);

    this.log('Push new data into database');
    db.add('cases', data);
    this.log('Everything done');

    this._interval = this._startFetchingLoop();
  }

  _startFetchingLoop() {
    return setInterval(this.fetch.bind(this), program.interval);
  }
}

module.exports = Tracker;
