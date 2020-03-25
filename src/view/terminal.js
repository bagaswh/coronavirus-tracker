const EventEmitter = require('events');
const blessed = require('blessed');
const contrib = require('blessed-contrib');

class Terminal extends EventEmitter {
  constructor() {
    super();

    this._screen = blessed.screen();
    this._log = contrib.log({
      fg: 'green',
      selectedFg: 'green',
      label: 'App log'
    });
    this._screen.append(this._log);
  }

  init() {
    this._screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0);
    });

    this._screen.key('enter', () => {
      this.emit('requestfetch');
    });

    this._screen.render();
  }

  log(msg) {
    this._log.log(msg);
  }

  clearScreen() {
    this._screen.clearRegion();
    // console.log(this._screen);
  }
}

module.exports = Terminal;
