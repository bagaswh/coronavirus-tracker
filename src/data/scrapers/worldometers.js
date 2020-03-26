const cheerio = require('cheerio');

const { getResource, extractText } = require('../../util');

function parse($, data) {
  data.timestamp = new Date().getTime();

  const mainCases = $('div#maincounter-wrap span');
  const [cases, deaths, recovered] = [
    $(mainCases.get(0)),
    $(mainCases.get(1)),
    $(mainCases.get(2))
  ];
  data.mainCases = extractText(cases, Number);
  data.deaths = extractText(deaths, Number);
  data.recovered = extractText(recovered, Number);

  const panels = $('div.panel.panel-default');
  const activeCases = $(panels.get(0));
  const numbers = $('.number-table', activeCases);
  const [mildCondition, seriousCondition] = [$(numbers.get(0)), $(numbers.get(1))];

  data.currentlyInfectedMildCondition = extractText(mildCondition, Number);
  data.currentlyInfectedSeriousCondition = extractText(seriousCondition, Number);
  data.currentlyInfected =
    data.currentlyInfectedMildCondition + data.currentlyInfectedSeriousCondition;

  const tableRows = $('#main_table_countries_today tbody:nth-child(2) tr');
  tableRows.each((index, el) => {
    const tableData = $('td', el);
    const firstTableData = $(tableData.get(0));

    const anchorFirstTableData = $('a', firstTableData);
    const country = extractText(
      anchorFirstTableData.length > 0 ? anchorFirstTableData : firstTableData
    );
    data.byCountries[country] = {};

    const [totalCases, totalDeaths, totalRecovered, activeCases, seriousCondition] = [
      $(tableData.get(1)),
      $(tableData.get(3)),
      $(tableData.get(5)),
      $(tableData.get(6)),
      $(tableData.get(7))
    ];

    data.byCountries[country].totalCases = extractText(totalCases, Number);
    data.byCountries[country].totalDeaths = extractText(totalDeaths, Number);
    data.byCountries[country].totalRecovered = extractText(totalRecovered, Number);
    data.byCountries[country].activeCases = extractText(activeCases, Number);
    data.byCountries[country].seriousCondition = extractText(seriousCondition, Number);
  });
  return data;
}

async function scrape(data, ctx) {
  const url = 'https://www.worldometers.info/coronavirus/';
  ctx.log('Fetching resources');
  const resource = await getResource(url, ctx.log.bind(ctx));

  ctx.log('Parsing');
  const $ = cheerio.load(resource);
  return parse($, data);
}

module.exports = scrape;
