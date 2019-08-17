
const path = require('path');
const config = require('./configTest');
const log4js = require('log4js');
const fs = require("fs");

modules_path = config.path;


const Mam = require(path.join(modules_path,'mam','lib','mam.client.js'));
const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));

// mam mode
const mode = config.mode;
// node that will perform pow

nodeNum = 19;
trials = 250;
let attempt = 1;

let fileString = 'nodeNames';

providerArray = [];

fs.readFileSync(fileString).toString().split('\n').forEach(function (line) {
    providerArray.push(line.trim())


});


// 7

const provider = providerArray[nodeNum] ;
// using the same seed will not overwrite previously published messages
const seed = config.seed;
const channelKey = config.channelKey;



// mam explorer allows you to see all the messages in a mam chain from a given point
previousMessagePublished = false;
currentMessage = "";
// to differentiate messages
messageCount = 0;
thisRoot =  config.root;





x = Math.floor(Math.random() * 100000);
info = "";

const filename ='I3publishingTest' + x;
log4js.configure({
    appenders: { nodeTest: { type: 'file', filename: filename } },
    categories: { default: { appenders: ['nodeTest'], level: 'info' } }
});

const logger = log4js.getLogger('time(ms)');
logger.warn(provider);



// inititalize sate of mam

let mamState = Mam.init(provider, seed);

//change to restricted mode
mamState = Mam.changeMode(mamState, mode, channelKey);

// publishes message
// uses  different timers, to make sure that if an attach takes a particularly long time, another timer is not reset
const publish = async packet => {
    // convert message to trytes
    const trytes = asciiToTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);

    // need to save state so that next message will use the next root
    mamState = message.state;

    // attach the message to the tangle, 3 = tangle depth, 14 = minium weight, this is 9 for devnet ( dictates how long pow will take)
        try {
            console.log("Publishing Message...");

            if (attempt === 1) {
                start_time = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                console.log("Message Published!");
                published_time = new Date().getTime();
                logger.info(published_time - start_time);


            }
            else if (attempt === 2) {
                start_time_2 = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                console.log("Message Published!");
                published_time_2 = new Date().getTime();
                logger.info(published_time_2 - start_time_2);

            }
            else if (attempt === 3) {
                start_time_3 = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                console.log("Message Published!");
                published_time_3 = new Date().getTime();
                logger.info(published_time_3 - start_time_3);

            }
            else if (attempt === 4) {
                start_time_4 = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                console.log("Message Published!");
                published_time_4 = new Date().getTime();
                logger.info(published_time_4 - start_time_4);

            }
            else if (attempt === 5) {
                start_time_5 = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                console.log("Message Published!");
                published_time_5 = new Date().getTime();
                logger.info(published_time_5 - start_time_5);

            }

            else if (attempt === 6) {
                start_time_6 = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                console.log("Message Published!");
                published_time_6 = new Date().getTime();
                logger.info(published_time_6 - start_time_6);

            }

            else if (attempt === 7) {
                start_time_7 = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                published_time_7 = new Date().getTime();
                console.log("Message Published!");
                logger.info(published_time_7 - start_time_7);

            }
            else if (attempt === 8) {
                start_time_8 = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                published_time_8 = new Date().getTime();
                console.log("Message Published!");
                logger.info(published_time_8 - start_time_8);

            }
            else if (attempt === 9) {
                start_time_9 = new Date().getTime();
                attempt += 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                published_time_9 = new Date().getTime();
                console.log("Message Published!");
                logger.info(published_time_9 - start_time_9);

            }
            else if (attempt === 10) {
                start_time_10 = new Date().getTime();
                attempt = 1;
                await Mam.attach(message.payload, message.address, 3, 14);
                published_time_10 = new Date().getTime();
                console.log("Message Published!");
                logger.info(published_time_10 - start_time_10);

            }


        } catch (error) {
            logger.error("AttachFailed");
            console.log("Attach Failed");
        }




    return message.root


};

const publishMessage = async () => {
    // increment counter
    messageCount += 1;
    currentMessage = "message " + messageCount;


    const root = await publish({
        // addressCounter can publish multiple messages here
        message: currentMessage,
        timestamp: (new Date()).toLocaleString()

    });
    return root
};





function startPublishing(){
    publishMessage()
        .then(async root => {
            // don't need to fetch here

        })
}

function intervalForPublishing(){
    startPublishing();


    if(messageCount < trials) {
        setTimeout(intervalForPublishing, config.publishInterval);
    }
    else{
        console.log("Final Trial Started");
        console.log("Wait at least 10 minutes, there may still be ongoing trials");
    }
}


intervalForPublishing();









