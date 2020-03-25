#!/usr/bin/env node

const { program } = require('commander');
program
  .option('-d, --disable-terminal', 'Disable terminal', false)
  .option('-i, --interval <interval>', 'Fetch interval (s)', 10 * 60)
  .option('-c, --clear', 'Clear data before starting', false);
program.parse(process.argv);

process.on('unhandledRejection', err => {
  throw err;
});

const Tracker = require('../src/tracker');
const Terminal = require('../src/view/terminal');

const tracker = new Tracker();
const terminal = new Terminal();

terminal.on('requestfetch', () => {
  tracker.fetch();
});

tracker.on('log', msg => {
  terminal.log(msg);
  terminal.clearScreen();
});

tracker.init();
terminal.init();
