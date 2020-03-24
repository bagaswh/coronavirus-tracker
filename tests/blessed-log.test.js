const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();
const logger = contrib.log({
  fg: 'green',
  selectedFg: 'green',
  label: 'App log'
});

screen.append(logger);

logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
logger.log('message');
