const path = require('path');
const fs = require('fs');



if (process.platform === "linux") {
    modules_path = '/home/pi/node_modules/@iota'
}
else {
    modules_path = '@iota'
}

const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));

config = {};

config.seed = 'ZZZBNX9PKXAATXXTT9KLLTZBPZ99DMMEUXGXI9WUPYVWIGIYQTF9JIRKFEIXRFWQGJJETPVYIXANAKPMH';
config.channelName = 'MAM_SENSOR_1';
config.mode = 'restricted';
config.provider = 'https://nodes.thetangle.org:443';// https://perma.iota.partners:443
config.altProvider = 'https://solidstatedomain.ie:14267';
config.publicKey ='PUBLIC_KEY_HERE';
config.clientIdentifier = 'Client XYZ';
config.fetchInterval = 60000;
config.path = modules_path;
config.addressOfPublishingNode = 'HGPRULP9S99WPAESZPBGECUSMTEFQBAUDGHTELIINGSYA9UKGZKRVOSLDJFRNTAFHVLISHPEKMUBBQMRX';

// receivingNode

module.exports = config;