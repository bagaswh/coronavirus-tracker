const EventEmitter = require('events');

const _ = require('lodash');
const { program } = require('commander');
const debug = require('debug')('app');

const { notificationWrapper } = require('./notification');
const db = require('./data/database');
const { fetchData } = require('./data/datafetcher');
const { getDuration } = require('./util');

function compareData(prev, now) {
  if (_.isEmpty(prev) && !_.isEmpty(now)) {
    return true;
  }

  const recoveredDiff = now.recovered - prev.recovered;
  const mainCasesDiff = now.mainCases - prev.mainCases;
  const deathsDiff = now.deaths - prev.deaths;
  if (!mainCasesDiff && !deathsDiff && !recoveredDiff) {
    return false;
  }

  return true;
}

class Tracker extends EventEmitter {
  constructor(logger) {
    super();

    this._interval = -1;
    this._logger = logger || debug;
  }

  init() {
    if (program.clear) {
      db.clear();
    }

    this.fetch();
    this.log(`Fetching data with ${getDuration(program.interval)} interval`);
    this._interval = this._startFetchingLoop();
  }

  log(msg) {
    this.emit('log', msg);
  }

  async fetch() {
    clearInterval(this._interval);

    this.log('Fetching data');
    const data = await fetchData(this);
    this.log('Done fetching data');

    this.log('Fetching previous data from database');
    const lastData = db.getLast('cases');

    notificationWrapper(lastData, data);

    const isDataChanged = compareData(lastData, data);
    if (isDataChanged) {
      this.log('Push new data into database');
      db.add('cases', data);
      this.log('Everything done');
    }

    this._interval = this._startFetchingLoop();
  }

  _startFetchingLoop() {
    return setInterval(this.fetch.bind(this), program.interval * 1000);
  }
}

module.exports = Tracker;
