const fs = require('fs');
const fetch = require('node-fetch');
const delay = require('delay');
const numeral = require('numeral');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');

async function writeFile(data, name) {
  const file = fs.createWriteStream(name);
  file.write(data);
}

async function getResource(url, debug) {
  return new Promise(async resolve => {
    let fails = true;

    let res;
    while (fails) {
      try {
        res = await fetch(url);
        fails = false;
      } catch (e) {
        fails = true;
        debug('Error fetching resource. Retrying in 30 seconds');
        await delay(30 * 1000);
      }
    }
    return resolve(res.text());
  });
}

// cheerio element extract text
function extractText(el, fn) {
  let output = el
    .text()
    .trim()
    .replace(/,/g, '');
  if (typeof fn == 'function') {
    return fn(output);
  }
  return output;
}

function numeralify(text) {
  const regex = /\d+/g;
  let match;
  let lastIndex = regex.lastIndex;
  while ((match = regex.exec(text)) != null) {
    text =
      text.slice(0, lastIndex) +
      text.slice(lastIndex).replace(/\d+/, numeral(match[0]).format('0,0'));
    lastIndex = regex.lastIndex;
  }
  return text;
}

function commafy(arr) {
  if (arr.length == 1) {
    return arr[0];
  }

  if (arr.length == 2) {
    return arr[0] + ' and ' + arr[1];
  }

  return arr
    .slice(0, -1)
    .concat('and ' + arr[arr.length - 1])
    .join(', ');
}

momentDurationFormatSetup(moment);

function getDuration(seconds) {
  return moment.duration(seconds, 'seconds').format(function() {
    const s = this.duration.asSeconds();
    if (s >= 3600) {
      return 'h [hours]';
    } else if (s >= 60) {
      return 'm [minutes]';
    } else if (s >= 1) {
      return 's [seconds]';
    }

    return '';
  });
}

module.exports = { writeFile, getResource, extractText, commafy, numeralify, getDuration };
