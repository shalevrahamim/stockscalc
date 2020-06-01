const EventEmitter = require('events');
const fs = require('fs');

const {getStockDailyData, getSMAData, getStockWeeklyData} = require('./stockDataAPI');

const waitMinute = ()=>{
    return new Promise((res, rej)=>{
        console.log("wait a minute...");
        setTimeout(()=>res(), 1024*60);
    });
}
const lala = (symbol)=>{
    return new Promise((res, rej)=>{
        fs.readFile(`./stocks data/weekly/${symbol}.json`, (err, data)=>{
            res(err);
        })
    })
}
const getCompeniesData = async(compeniesSymbol, stockDataFunction, cb) => {
    for(let symbol of compeniesSymbol)
    {
        const err = await lala(symbol);
        if(!err)
            continue;
        console.log(`get data of ${symbol}`);
        let data = await stockDataFunction(symbol);
        if(data.success)
            cb(symbol, data.data);
        else
        {
            if(data.error)
                continue;
            await waitMinute();
            data = await stockDataFunction(symbol);
            if(data.success)
                cb(symbol, data.data);    
            else
            {
                if(data.error)
                    continue;
                console.log("Something wrong")
                break;
            }
        }
    }
}    
class DataCollector extends EventEmitter
{
    constructor(compeniesSymbol) {
        super();
        this.compeniesSymbol = compeniesSymbol;
        this.interval = 'weekly';
        this.timePeriod = 10;
        this.seriesType = 'open'
        this.outputsize = 'full';
    }

    getDailyData() {
        const getDataFuncion = (symbol) => getStockDailyData(symbol, this.outputsize);
        getCompeniesData(this.compeniesSymbol, getDataFuncion, (symbol, data)=>{this.emit('onGetDailyStock', symbol, data)});
    }

    getWeeklyData() {
        const getDataFuncion = (symbol) => getStockWeeklyData(symbol, this.outputsize);
        getCompeniesData(this.compeniesSymbol, getDataFuncion, (symbol, data)=>{this.emit('onGetWeeklyStock', symbol, data)});
    }

    getSMA() {
        const getDataFuncion = (symbol) => getSMAData(symbol, this.interval, this.timePeriod);
        getCompeniesData(this.compeniesSymbol, getDataFuncion, (symbol, data)=>{this.emit('onGetSMA', symbol, data)});
    }
}

module.exports = DataCollector;