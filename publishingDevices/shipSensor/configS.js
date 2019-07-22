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
config.provider = 'https://nodes.thetangle.org:443';
config.altProviders = ['https://perma.iota.partners:443','https://node.vanityfive.de:443','https://nodes.iota.cafe:443','https://www.solidstatedomain.ie:14267'];
config.transportationType ='Shipping Container';
config.departureLocation = 'Porto de Santos(Brazil)';
config.destination = "Port of Sines(Portugal)";
config.itemDescription = "Banana Crate";


let idPath = fs.readFileSync(path.join(__dirname, '/../truckSensor/channelInfoT.json'),'UTF-8');
let id = JSON.parse(idPath);

config.globalId = id.globalId;
//TODO global id should be got from previous stage
config.stageId = "2019-S-" + createId(15);
config.routeName =  "BRA-POR-10";



let additionalInfo = fs.readFileSync(path.join(__dirname, '/channelInfoS.json'),'UTF-8');
let info = JSON.parse(additionalInfo);


config.channelKey = info.channelKey;
config.path = modules_path;
config.publishInterval = 900000; // 15 minutes, change for how often you want to publish
config.retryInterval =60000; // interval to retry after failing to publish
const mamState = Mam.init(config.provider,config.seed);
mamDetails = Mam.create(mamState, 'GETROOT');
config.root = mamDetails.root;
config.mamState = mamState;
config.endMessage = 228;


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