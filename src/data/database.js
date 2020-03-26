const fs = require('fs');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Memory = require('lowdb/adapters/Memory');
const { dataPath } = require('commander').program;

const dirname = path.dirname(dataPath);
if (!fs.existsSync(dirname)) {
  fs.mkdirSync(dirname);
}

if (!fs.existsSync(dataPath)) {
  fs.createWriteStream(dataPath);
}

const adapter = process.env.NODE_ENV == 'test' ? new Memory() : new FileSync(dataPath);
const db = low(adapter);
db.defaults({ cases: [] }).write();

function get(name) {
  return db.get(name).value();
}

function add(name, data) {
  return db
    .get(name)
    .push(data)
    .write();
}

function getLast(name) {
  return db
    .get(name)
    .sortBy('timestamp')
    .reverse()
    .take(1)
    .value()[0];
}

function clear() {
  db.set('cases', []).write();
}
module.exports = { db, get, clear, add, getLast };
