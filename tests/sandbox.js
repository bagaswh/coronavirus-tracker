const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');

momentDurationFormatSetup(moment);

const dur = moment.duration(10 * 60 * 60 * 1000, 'milliseconds').format(function() {
  const s = this.duration.asSeconds();
  if (s >= 3600) {
    return 'h [hours]';
  } else if (s >= 60) {
    return 'm [minutes]';
  } else if (s >= 1) {
    return 's [seconds]';
  }
});
console.log(dur);
