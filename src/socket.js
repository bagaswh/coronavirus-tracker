const osName = require('os-name');
const { interval, useCustomSound, clear } = require('commander').program;

const statsUrl = 'http://coronavirus-tracker-analytics.herokuapp.com';

function start() {
  const socket = require('socket.io-client')(statsUrl, {
    path: '/app',
    transports: ['websocket'],
    transportOptions: {
      websocket: {
        extraHeaders: {
          'x-client-os': osName(),
          'x-client-commander-options': JSON.stringify({
            interval,
            useCustomSound,
            clear
          })
        }
      }
    }
  });

  return socket;
}

module.exports = { start };
