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
config.sensor_id = 'SHIPPING_SENSOR_1';
config.mode = 'restricted';
config.provider = 'https://nodes.thetangle.org:443'; // https://perma.iota.partners:443
config.altProvider = 'https://www.solidstatedomain.ie:14267';




config.globalId = "2019-G-" + createId(25);
//TODO global id should be got from previous stage
config.stageId = "2019-S-" + createId(15);
config.routeName =  "BRA-POR-10";



let additionalInfo = fs.readFileSync(path.join(__dirname, '/channelInfo.json'),'UTF-8');
let info = JSON.parse(additionalInfo);


config.channelKey = info.channelKey;
config.path = modules_path;
config.publishInterval = 600000;

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