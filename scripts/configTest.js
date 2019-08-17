const path = require('path');
const fs = require('fs');

if (process.platform === "linux") {
    modules_path = '/home/pi/node_modules/@iota'
}
else {
    modules_path = '@iota'
}

const Mam = require(path.join(modules_path,'mam','lib','mam.client.js'));

config = {};

// config.seed = 'LDFBFLG9KXSDFEDDDJKOVVSDYZ9ZDDFXDDGXI9WTTZMNILIYQTFOOIOSK9WWJZXQGJJETPXYIXANOB9MH';
config.seed = createId(81);
config.sensor_id = 'TEST_SENSOR_1';
config.mode = 'restricted';

config.channelKey = createId(81);
config.path = modules_path;
config.publishInterval = 180000; // interval for publishing
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