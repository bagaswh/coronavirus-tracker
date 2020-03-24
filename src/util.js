const fs = require('fs');
const fetch = require('node-fetch');
const delay = require('delay');

async function writeFile(data, name) {
  const file = fs.createWriteStream(name);
  file.write(data);
}

async function getResource(url, debug) {
  return new Promise(async (resolve, reject) => {
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
    .replace(/\,/g, '');
  if (typeof fn == 'function') {
    return fn(output);
  }
  return output;
}

module.exports = { writeFile, getResource, extractText };
