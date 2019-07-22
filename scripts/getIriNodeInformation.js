const Iota = require('C:/Users/Conal/Documents/test/node_modules/@iota/core');
const Converter = require('C:/Users/Conal/Documents/test/node_modules/@iota/converter');

const iota = Iota.composeAPI({
    provider: 'https://nodes.iota.cafe:443'
});
// Call the `getNodeInfo()` method for information about the IRI node
iota.getNodeInfo()
// convert returned object to json
    .then(info => console.log(JSON.stringify(info,null,2)))
    .catch(err => {
        // Catch any errors
        console.log(err);
    });

const address = 'UUKKJFHIKKLCKBPJJ9CJIREHEVLRQYPYEZANDNEMVQCBLROEEUGUVFDQLYRSCSCQZCWCBPGYTUAAEYUUYFGHOHDLBM';
const seed = 'IYFBNX9PKXAAUERY99KLLTZBPZ99DMMEUXGXI9WJKXVWIGIYQTF9JIODFEWWRFSQGJJETPVYIXANAKPMH';
const message = Converter.asciiToTrytes('Hello World!');

console.log("------------------");
console.log(Iota.generateAddress(seed, 1, 2, false));
console.log("------------------");
const transfers = [
    {
        value: 0,
        address: address,
        message: message
    }
];

iota.prepareTransfers(seed, transfers)
    .then(trytes => {
        return iota.sendTrytes(trytes, 3, 14)
    })
    .then(bundle => {
        console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
        var JSONBundle = JSON.stringify(bundle,null,1);
        console.log(`Bundle: ${JSONBundle}`)
    })
    .catch(err => {
        // Catch any errors
        console.log(err);
    });