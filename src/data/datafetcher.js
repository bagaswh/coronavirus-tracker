const _ = require('lodash');

const scrapers = {
  // global cases, country specific cases (total cases, deaths, recovered, active cases, serious condition)
  worldometers: require('./scrapers/worldometers')

  // feel free to add more data source
};

const schema = {
  timestamp: 0,
  mainCases: 0,
  deaths: 0,
  recovered: 0,
  currentlyInfected: 0,
  currentlyInfectedMildCondition: 0,
  currentlyInfectedSeriousCondition: 0,
  byCountries: {
    /* {
      totalCases: 0,
      totalDeaths: 0,
      totalRecovered: 0,
      activeCases: 0,
      seriousCondition: 0
    } */
  }
};

async function fetchData(ctx) {
  const data = _.cloneDeep(schema);
  return await scrapers.worldometers(data, ctx);
}

module.exports = { fetchData };
