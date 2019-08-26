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
        modules_path =  path.join(__dirname, 'node_modules','@iota')
        const checkIfValidPath = require(path.join(modules_path, 'core'));
    }
    catch {
        console.log("attempting to use backup path");
        modules_path = '@iota'
    }
}

const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));

config = {};

config.seed = createSeed(81);
config.channelName = 'SHIPPING_SENSOR_1';
config.mode = 'restricted';
config.provider = 'https://nodes.thetangle.org:443';
config.altProviders = ['https://perma.iota.partners:443','https://node.vanityfive.de:443','https://nodes.iota.cafe:443','https://www.solidstatedomain.ie:14267'];
config.fetchInterval = 60000;
config.path = modules_path;
config.addressOfPublishingNode = 'HGPRULP9S99WPAESZPBGECUSMTEFQBAUDGHTELIINGSYA9UKGZKRVOSLDJFRNTAFHVLISHPEKMUBBQMRX';

module.exports = config;


function createSeed(length) {
    var id           = '';
    var chars       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    var charsLen = chars.length;
    for ( var i = 0; i < length; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * charsLen));
    }
    return id;
}