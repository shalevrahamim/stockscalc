const EventEmitter = require("events");

const {
  getStockDailyData,
  getSMAData,
  getStockWeeklyData,
} = require("./stockDataAPI");

const waitMinute = () => {
  return new Promise((res, rej) => {
    console.log("wait a minute...");
    setTimeout(() => res(), 1024 * 60);
  });
};

const getCompeniesData = async (compeniesSymbol, stockDataFunction, cb) => {
  for (let symbol of compeniesSymbol) {
    console.log(`get ${symbol} data...`);
    let data = await stockDataFunction(symbol);
    if (data.success) cb(symbol, data.data);
    else {
      if (data.error) continue;
      await waitMinute();
      data = await stockDataFunction(symbol);
      if (data.success) cb(symbol, data.data);
      else {
        if (data.error) continue;
        console.log("Something wrong");
        break;
      }
    }
  }
};
class DataCollector extends EventEmitter {
  constructor(compeniesSymbol) {
    super();
    this.compeniesSymbol = compeniesSymbol;
    this.interval = "weekly";
    this.timePeriod = 10;
    this.seriesType = "open";
    this.outputsize = "full";
  }

  async getDailyData() {
    const getDataFuncion = (symbol) =>
      getStockDailyData(symbol, this.outputsize);
    await getCompeniesData(
      this.compeniesSymbol,
      getDataFuncion,
      (symbol, data) => {
        this.emit("onGetDailyStock", symbol, data);
      }
    );
  }

  async fetchWeeklyData() {
    const data = (symbol) => {
      return getStockWeeklyData(symbol, this.outputsize);
    };
    await getCompeniesData(this.compeniesSymbol, data, (symbol, data) => {
      this.emit("weeklyStock", symbol, data);
    });
  }

  async getSMA() {
    const getDataFuncion = (symbol) =>
      getSMAData(symbol, this.interval, this.timePeriod);
    await getCompeniesData(
      this.compeniesSymbol,
      getDataFuncion,
      (symbol, data) => {
        this.emit("onGetSMA", symbol, data);
      }
    );
  }
}

module.exports = DataCollector;
