const EventEmitter = require('events');

const _ = require('lodash');
const { program } = require('commander');
const debug = require('debug')('app');
const moment = require('moment');

const { notificationWrapper } = require('./notification');
const { fetchData } = require('./data/datafetcher');
const { getDuration, formatTime } = require('./util');
const db = require('./data/database');

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

    this._timeoutId = -1;
    this._logger = logger || debug;
  }

  init() {
    if (program.clear) {
      db.clear();
    }

    this.log(`Fetching data with ${getDuration(program.interval)} interval`);

    this.fetch();
    this._timeoutId = this._startFetchingLoop();
  }

  log(msg) {
    this.emit('log', msg);
  }

  async fetch() {
    clearTimeout(this._timeoutId);

    this.log('Fetching data');
    const data = await fetchData(this);
    this.log(`Done fetching data (last fetched: ${formatTime(moment())})`);

    this.log('Fetching previous data from database');
    const lastData = db.getLast('cases');

    notificationWrapper(lastData, data);

    const isDataChanged = compareData(lastData, data);
    if (isDataChanged) {
      this.log('Push new data into database');
      db.add('cases', data);
      this.log('Everything done');
    }

    this._timeoutId = this._startFetchingLoop();
  }

  _startFetchingLoop() {
    return setTimeout(this.fetch.bind(this), program.interval * 1000);
  }
}

module.exports = Tracker;
