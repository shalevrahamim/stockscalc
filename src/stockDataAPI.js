const axios = require('axios');

const BASE_URL = "https://www.alphavantage.co/";
const KEY = "83LDP1EI59OT016G";

const createQuery = (prop) => {
    prop['apikey'] = KEY;
    return `${BASE_URL}query?${Object.keys(prop).map(key => `${key}=${prop[key]}`).join('&')}`;
}

const getStockData = async (query) => {
    let data = await axios.get(query);
    data = data.data;
    if(data.Note)
        return {success: false, error: false};
    if(data["Error Message"])
        return {success: false, error: data["Error Message"]};
    return {success: true, data};
}

const getStockDailyData = async (symbol, outputsize) => {
    const prop = {
        'function':'TIME_SERIES_DAILY',
        symbol,
        outputsize
    }
    return await getStockData(createQuery(prop));
}

const getStockWeeklyData = async (symbol, outputsize) => {
    const prop = {
        'function': 'TIME_SERIES_WEEKLY',
        symbol,
        outputsize
    }
    return await getStockData(createQuery(prop));
}

const getStockMonthlyData = async (symbol, outputsize) => {
    const prop = {
        'function': 'TIME_SERIES_MONTHLY',
        symbol,
        outputsize
    }
    return await getStockData(createQuery(prop));
}

const getSMAData = async (symbol, interval, timePeriod) => {
    const prop = {
        'function': 'SMA',
        symbol,
        interval,
        'time_period': timePeriod,
        'series_type': 'open'
    }
    return await getStockData(createQuery(prop));
}

module.exports = {
    getStockDailyData,
    getStockWeeklyData,
    getStockMonthlyData,
    getSMAData
}