const fetch = require('node-fetch');
const keys = require('./keys');

const BASE_URL = "https://www.alphavantage.co/";
const KEY = "2NH14RUKST7O1PX1";

const getStockDailyData = async (symbol) => {
    const getDataByKey = async (key) => {
        let result = await fetch(`${BASE_URL}query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${key}`);
        result = await result.json();
        return result;
    }
    let data = await getDataByKey(KEY);
    if(data.Note)
        return {success: false, error: false};
    if(data["Error Message"])
        return {success: false, error: true};
    return {success: true, data};
}

module.exports.getStockDailyData = getStockDailyData;