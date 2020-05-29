const fs = require('fs');
const snp500 = require('./company list/s&p500');
const DataCollector = require('./dataCollector');

const saveData = (path, data) => {
    return new Promise((res, rej) => {
        path = `./stock data/${path}`
        fs.writeFile(path , data, (err) => {
            if(err)
                rej(err)
            res(`${path} updated successfully`);
        }); 
    });
}

let symbols = snp500.map(company => company.Symbol);
let collector = new DataCollector(symbols);
collector.on('onGetSMA', (symbol, data) => saveData(`SMA/${symbol}.json`, data).then((msg) => console.log(msg)));
collector.getSMA();