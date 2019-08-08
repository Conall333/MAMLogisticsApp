
const fs = require('fs');
const path = require('path');
const config = require('./configTest');
var mysql = require('mysql');// time node js library

modules_path = config.path;


const Mam = require(path.join(modules_path,'mam','lib','mam.client.js'));
const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));

// mam mode
const mode = config.mode;
// node that will perform pow
const provider = config.provider;
// using the same seed will not overwrite previously published messages
const seed = config.seed;
const channelKey = config.channelKey;



// mam explorer allows you to see all the messages in a mam chain from a given point
previousMessagePublished = false;
currentMessage = "";
// to differentiate messages
messageCount = 0;
thisRoot =  config.root;

const log4js = require('log4js');
x = Math.random();
info = "";

const filename ='publishingTest' + x;
log4js.configure({
    appenders: { cheese: { type: 'file', filename: filename } },
    categories: { default: { appenders: ['cheese'], level: 'info' } }
});

const logger = log4js.getLogger('time(ms)');
logger.warn(config.provider);



// inititalize sate of mam

mamState = Mam.init(provider, seed);




//change to restricted mode
mamState = Mam.changeMode(mamState, mode, channelKey);

// publishes message
const publish = async packet => {
    // convert message to trytes
    const trytes = asciiToTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);

    // need to save state so that next message will use the next root
    mamState = message.state;

    // attach the message to the tangle, 3 = tangle depth, 14 = minium weight, this is 9 for devnet ( dictates how long pow will take)
    messagePublished = false;
    while (messagePublished === false) {
        try {
            console.log("Publishing Message...");
            start_time = new Date().getTime();
            await Mam.attach(message.payload, message.address, 3, 14);
            messagePublished = true;
            console.log("Message Published!");


        } catch (error) {
            logger.error(error);
            console.log("trying to publish again after 60 seconds");
            await sleep(config.retryInterval);

        }
    }

    //console.log('Root: ', message.root);
    //console.log('Address: ', message.address);
    // console.log('Published == >', packet);
    published_time = new Date().getTime();
    console.log(published_time - start_time);
    logger.info(published_time - start_time);


    thisRoot = message.state.channel.next_root.toString();
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


    if(messageCount < 100) {
        setTimeout(intervalForPublishing, config.publishInterval);
    }
    else{
        process.exit(1);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

intervalForPublishing();









