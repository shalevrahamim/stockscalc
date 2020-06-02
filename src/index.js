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
            res(`${path} updated successfully.`);
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
console.log("Start get weekly data from server...");
collector.getWeeklyData().then(()=>{
    console.log('Get all weekly data successfully.');
    console.log('Start analyzing data...');
    return dataAnalyzer(symbols);
}).then((res)=>{
    res = Object.values(res);
    res.sort((a, b) => a.points-b.points);
    fs.writeFile('./conclusion.json', JSON.stringify(res), ()=>{console.log("Analyzed data successfully.", "Result on conclusion.json")});
});