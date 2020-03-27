const config = require('config');
const osName = require('os-name');
const { interval, useCustomSound, clear } = require('commander').program;

function start() {
  const socket = require('socket.io-client')(config.get('statsUrl'), {
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
