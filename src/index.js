const fs = require('fs');
const snp500 = require('./company list/s&p500');
const {getStockDailyData} = require('./stockDataAPI');
const conclusion = require('../conclusion.json')

const getSymbolData = async (symbol)=>{
    try{
        const lastDate = "2020-05-14";
        const firstDate = "2019-12-31";
        let res = {};
        let data = await getStockDailyData(symbol);
        if(!data.success)
            return data;
        data = data["data"]["Time Series (Daily)"];
        res["symbol"] = symbol;
        res[firstDate] = data[firstDate]["4. close"];
        res[lastDate] = data[lastDate]["4. close"];
        res["distance"] = (Number(res[lastDate])-Number(res[firstDate])).toString();
        res["ratio"] = (Number(res[lastDate])/Number(res[firstDate])).toString();
        return {success: true, data: res};
    }
    catch(error)
    {
        return {success: false, error: true};
    }
}

const getCompeniesData = async () => {
    let i = 1;
    for(let company of snp500)
    {
        console.log(`get data of ${company.Symbol}...`);
        let data = await getStockDailyData(company.Symbol);
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

const waitMinute = ()=>{
    return new Promise((res, rej)=>{
        setTimeout(()=>res(), 1010*60);
    });
}

const theMostLowRatio = ()=>{
    let companies = Object.values(conclusion);
    companies.sort((a, b)=> Number(a.ratio)-Number(b.ratio));
    for(let company of companies)
        console.log({symbol: company.symbol, ratio: company.ratio})
}

getCompeniesData();
