var fs = require("fs");


let notFinished = true;
let fileNumber = 0;


while(notFinished) {

    let counter = 0;
    let total = 0;
    let minValue = 1000000;
    let maxValue = 0;
    let nodeName = "";

    try {
        fileNumber += 1;

        let fileString = 'publishingTest' + fileNumber;


        fs.readFileSync(fileString).toString().split('\n').forEach(function (line) {
            let lineArray = line.split(" ");


            if (counter === 0) {
                nodeName = lineArray[4];
            } else {
                let value = parseFloat(lineArray[4]);

                if (parseFloat(value)) {

                    if (value > maxValue) {
                        maxValue = value
                    }
                    if (value < minValue) {
                        minValue = value
                    }

                    total += value;

                }
            }

            counter += 1;


        });

        average = total / counter;
        console.log("Full Node Name: " + nodeName);
        console.log("Average: " + average);
        console.log("Spread: " + minValue + " --- " + maxValue);

    }
    catch(error){
        notFinished =false;

    }
}