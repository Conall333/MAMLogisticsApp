const path = require('path');
const fs = require('fs');

if (process.platform === "linux") {

    try {
        modules_path =  path.join(__dirname,'node_modules','@iota')
        const checkIfValidPath = require(path.join(modules_path, 'core'));
    }
    catch {
        console.log("attempting to use backup path");
        modules_path = '/home/pi/node_modules/@iota'
    }
}
else {

    try {
        const checkIfValidPath = require(path.join(modules_path, 'core'));
        modules_path =  path.join(__dirname, 'node_modules','@iota')
    }
    catch {
        console.log("attempting to use backup path");
        modules_path = '@iota'
    }
}

const Mam = require(path.join(modules_path,'mam','lib','mam.client.js'));

config = {};

// config.seed = 'LDFBFLG9KXSDFEDDDJKOVVSDYZ9ZDDFXDDGXI9WTTZMNILIYQTFOOIOSK9WWJZXQGJJETPXYIXANOB9MH';
config.seed = createId(81);
config.sensor_id = 'TEST_SENSOR_1';
config.mode = 'restricted';

config.channelKey = createId(81); //this method of generting a channel key is for testing purposes only
config.path = modules_path;
config.publishInterval = 60000; // interval for publishing
config.retryInterval = 180000; // interval to retry after failing to publish
const mamState = Mam.init(config.provider,config.seed);
mamDetails = Mam.create(mamState, 'GETROOT');
config.root = mamDetails.root;
config.mamState = mamState;


function createId(length) {
    var id           = '';
    var chars       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    var charsLen = chars.length;
    for ( var i = 0; i < length; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * charsLen));
    }
    return id;
}


module.exports = config;