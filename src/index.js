const mkdirp = require("mkdirp");
const fs = require("fs");
const util = require('util')
const Promise = require("bluebird");
const snp500 = require("./company list/s&p500");
const DataCollector = require("./dataCollector");
const dataAnalyzer = require("./dataAnalyzer");
const coronaAnalyzer = require("./coronaAnalyzer");
const STORE_PATH = "./stocks data/";

const save = async (path, data) => {
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(path, JSON.stringify(data));
};

const init = async () => {
  const metrics = ["SMA"];
  const intervals = ["daily", "weekly", "monthly"];
  const KPIs = [...metrics, ...intervals];
  Promise.each(KPIs, async (target) => {
    await mkdirp(STORE_PATH + target);
  });
};

init().then(async () => {
  const symbols = snp500.map((company) => company.Symbol);
  const collector = new DataCollector(symbols);
  collector.on("weeklyStock", async (symbol, data) => {
    await save(`stocks data/weekly/${symbol}.json`, data);
  });
 // const weekly = await collector.fetchWeeklyData();
  await coronaAnalyzer(symbols);
  // const holdings = Object.values(weekly);
  // holdings.sort((a, b) => a.points - b.points);
  // fs.writeFile("./conclusions.json", JSON.stringify(holdings));
});
