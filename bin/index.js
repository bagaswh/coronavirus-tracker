#!/usr/bin/env node
const path = require('path');
const { program } = require('commander');
const packageJson = require('../package.json');

const root = path.resolve(__dirname, '../');

program
  // .option('-d, --disable-terminal', 'Disable terminal', false)
  .version(packageJson.version)
  .option('-i, --interval <interval>', 'Data fetching interval (in seconds)', 10 * 60)
  .option(
    '-c, --custom-sound <customSound>',
    'Use custom sound for notification (leave to use provided sounds, false to use default system notification)',
    [
      path.join(root, 'assets', 'Infect.mp3'),
      path.join(root, 'assets', 'Ring_Around_the_Rosie.mp3')
    ]
  )
  .option(
    '-d, --data-path <dataPath>',
    'Path to store JSON data',
    path.join(root, 'data', 'data.json')
  )
  .option('-c, --clear', 'Clear local database before starting', false);
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
