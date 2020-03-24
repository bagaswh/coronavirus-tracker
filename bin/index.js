#!/usr/bin/env node

const { Worker } = require('worker_threads');
const Tracker = require('../src/tracker');
const Terminal = require('../src/view/terminal');

const terminal = new Terminal();
const tracker = new Tracker();

terminal.on('requestfetch', () => {
  tracker.fetch();
});

tracker.on('log', msg => {
  terminal.log(msg);
});

tracker.init();
terminal.init();
