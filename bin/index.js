#!/usr/bin/env node
const path = require('path');
const { program } = require('commander');
const packageJson = require('../package.json');

const root = path.resolve(__dirname, '../');

program
  .version(packageJson.version)
  .option(
    '-w, --watch-countries <countries>',
    'Watch countries (use country ISO code or its name in English, eg: "IDN, England, Italy")',
    10 * 60
  )
  .option('-i, --interval <interval>', 'Data fetching interval (in seconds)', 10 * 60)
  .option('-u, --use-custom-sound', 'Use custom sound for notification')
  .option(
    '-c, --custom-sound-paths <customSoundPaths>',
    'Use custom sound for notification',
    `
    ${path.join(root, 'assets', 'Infect.mp3')},
    ${path.join(root, 'assets', 'Ring_Around_the_Rosie.mp3')},
    ${path.join(root, 'assets', 'Cough.ogg')}
  `
  )
  .option(
    '-d, --data-path <dataPath>',
    'Path to store JSON data',
    path.join(root, 'data', 'data.json')
  )
  .option('-c, --clear', 'Clear local database before starting', false);
program.parse(process.argv);

// program.watchCountries = program.watchCountries.split(',').map(country => country.trim());
program.customSoundPaths = program.customSoundPaths.split(',').map(soundPath => soundPath.trim());

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
