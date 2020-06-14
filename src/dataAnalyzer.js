const fs = require("fs");

const getFileData = (func, symbol) => {
  return new Promise((res, rej) => {
    fs.readFile(`./stocks data/${func}/${symbol}.json`, (err, data) => {
      if (err) rej(err);
      else res(JSON.parse(data));
    });
  });
};

const calculateWeeksData = (numOfWeeks, data) => {
  const ret = {};
  let i = 0;
  let highest = data[0].high;
  let lowest = data[0].low;
  let sumOfClose = 0;
  for (const weekData of data) {
    if (i === numOfWeeks) break;
    sumOfClose += weekData.close;
    if (weekData.high > highest) highest = weekData.high;
    if (weekData.low < lowest) lowest = weekData.low;
    i++;
  }
  ret["weeks"] = i;
  ret["high"] = highest;
  ret["low"] = lowest;
  ret["avg"] = sumOfClose / i;
  return ret;
};

const analyzeSymbol = async (symbol) => {
  const WEEKS_ANALYZE_NUMBERS = [4, 12, 24, 48, 240, "max"];
  const ret = { symbol };
  let weeksData = await getFileData("weekly", symbol);
  weeksData = Object.values(weeksData["Weekly Time Series"]).map((value) => {
    return {
      open: Number(value["1. open"]),
      high: Number(value["2. high"]),
      low: Number(value["3. low"]),
      close: Number(value["4. close"]),
    };
  });
  let points = 0;
  ret["currentPosition"] = weeksData[0].close;
  for (let numOfWeeks of WEEKS_ANALYZE_NUMBERS) {
    let calculationWeeks = calculateWeeksData(numOfWeeks, weeksData);
    calculationWeeks["ratio"] =
      ret["currentPosition"] / calculationWeeks["avg"];
    calculationWeeks["points"] =
      (1 - calculationWeeks["ratio"]) * calculationWeeks["weeks"];
    points += calculationWeeks["points"];
    if (calculationWeeks["weeks"] !== numOfWeeks) {
      ret["max"] = calculationWeeks;
      break;
    }
    delete calculationWeeks["weeks"];
    ret[`${numOfWeeks} Weeks`] = calculationWeeks;
  }
  ret["points"] = points;
  return ret;
};

const analyzeData = async (companiesSymbol) => {
  const ret = {};
  for (const symbol of companiesSymbol) {
    try {
      const symbolData = await analyzeSymbol(symbol);
      ret[symbol] = symbolData;
    } catch (err) {}
  }
  return ret;
};

module.exports = analyzeData;
