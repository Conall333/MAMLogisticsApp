const path = require('path');
const config = require('./configTest');
const log4js = require('log4js');
const fs = require("fs");

modules_path = config.path;


const Iota = require('C:/Users/Conal/Documents/test/node_modules/@iota/core');

const filename ='I3ResultFormated';
log4js.configure({
    appenders: { nodeTest: { type: 'file', filename: filename } },
    categories: { default: { appenders: ['nodeTest'], level: 'info' } }
});

const logger = log4js.getLogger('time(ms)');



let notFinished = true;
let fileNumber = 0;
let totalAvg = 0;


while(notFinished) {

    let counter = 0;
    let total = 0.00;
    let minValue = 1000000.00;
    let maxValue = 0.00;
    let nodeName = "";
    let fails = 0;

    try {


        let fileString = '3MinutesIntervalTest/I3publishingTest' + fileNumber;
        fileNumber += 1;


        fs.readFileSync(fileString).toString().split('\n').forEach(function (line) {
            let lineArray = line.split(" ");


            if (counter === 0) {
                nodeName = lineArray[4];
            } else {
                let value = parseFloat(lineArray[4]);

                if (value) {

                    if (value > maxValue) {
                        maxValue = value
                    }
                    if (value < minValue) {
                        minValue = value
                    }

                    total += value;

                }
                else {
                    if (counter < 251) {
                        fails += 1;
                    }
                }

            }

            counter += 1;


        });

        let average = total / counter;


        let avg = (Number((average)) / 1000).toFixed(2);
        let min = (minValue / 1000).toFixed(2);
        let max = (maxValue / 1000).toFixed(2);
        let sucessRate = ((250-fails) /250) * 100;


        totalAvg = totalAvg + Number(avg)

        console.log("Full Node Name: " + nodeName);
        console.log("Average: " + avg);
        console.log("Spread: " + min+ " --- " + max);
        console.log("Fails: "+ fails);
        console.log("\n");

        logger.warn(nodeName.trim() + " & "+ "0"+" & "+avg+" & "+ min +" & "+ max +" & " +sucessRate+"\\%\\\\");


    }
    catch(error){
        notFinished =false;

    }
}


logger.warn("end of results average --> "+ totalAvg / 20);
logger.warn("end of results");










