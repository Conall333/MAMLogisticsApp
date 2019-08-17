const path = require('path');
const config = require('./configTest');
const fs = require("fs");

modules_path = config.path;


const Iota = require('C:/Users/Conal/Documents/test/node_modules/@iota/core');

async function getProcessorCount() {


    let nodeNum =0;
    let fileString = 'nodeNames';

    let providerArray = [];

    fs.readFileSync(fileString).toString().split('\n').forEach(function (line) {
        providerArray.push(line.trim())


    });


        let iota = Iota.composeAPI({
            provider: providerArray[nodeNum]
        });
        await iota.getNodeInfo()
            .then(
                function(info) {
                    console.log(providerArray[nodeNum]);
                    console.log(info.jreAvailableProcessors);
                }
            )


            .catch(err => {
                // Catch errors
                console.log(err);
            });


}

getProcessorCount();