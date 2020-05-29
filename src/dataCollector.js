const EventEmitter = require('events');
const {getStockDailyData, getSMAData} = require('./stockDataAPI');

const getCompeniesData = async(stockDataFunct, cb) => {
    let i = 1;
    for(let symbol of compeniesSymbol)
    {
        console.log(`get data of ${symbol}...`);
        let data = await getStockDailyData(symbol);
        if(data.success)
        {
            console.log(`${i}) ${company.Symbol} got successful`);
            fs.writeFile(`./stock data/${company.Symbol}.json`, JSON.stringify(data.data), ()=>console.log("File updated"));
        }
        else
        {
            if(data.error)
                continue;
            await waitMinute();
            console.log(`get data of ${company.Symbol}...`);
            data = await getStockDailyData(company.Symbol);
            if(data.success)
            {
                console.log(`${i}) ${company.Symbol} got successful`);
                fs.writeFile(`./stock data/${company.Symbol}.json`, JSON.stringify(data.data), ()=>console.log("File updated"));    
            }
            else
            {
                if(data.error)
                    continue;
                console.log("Something wrong")
                break;
            }
        }
        i++;
    }
}    

class DataCollector extends EventEmitter
{
    constructor(compeniesSymbol)
    {
        this.compeniesSymbol = compeniesSymbol;
    }

}

module.exports = DataCollector;