const mkdirp = require('mkdirp')
const fs = require('fs');
const snp500 = require('./company list/s&p500');
const DataCollector = require('./dataCollector');
const dataAnalyzer = require('./dataAnalyzer');
const STORE_PATH = './stocks data/'

const saveData = (path, data) => {
    return new Promise((res, rej) => {
        path = STORE_PATH + path;
        fs.writeFile(path , JSON.stringify(data), (err) => {
            if(err)
                rej(err)
            res(`${path} updated successfully`);
        }); 
    });
}

(async () => {
    let folders = ['daily', 'weekly', 'mounthly', 'SMA'];
    for (const folder of folders)
        await mkdirp(STORE_PATH + folder);
})();

let symbols = snp500.map(company => company.Symbol);
let collector = new DataCollector(symbols);
collector.on('onGetWeeklyStock', (symbol, data) => saveData(`weekly/${symbol}.json`, data).then((msg) => console.log(msg)));
//collector.getWeeklyData();
dataAnalyzer(symbols).then((res)=>{
    console.log(res);
})