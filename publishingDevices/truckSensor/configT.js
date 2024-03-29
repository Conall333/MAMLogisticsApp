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
config.sensor_id = 'TRUCK_SENSOR_1';
config.mode = 'restricted';
config.provider = 'https://nodes.thetangle.org:443';
config.altProviders = ['https://perma.iota.partners:443','https://node.vanityfive.de:443','https://nodes.iota.cafe:443','https://www.solidstatedomain.ie:14267'];
config.transportationType ='Delivery Truck';
config.departureLocation = 'Florianopolis(Brazil)';
config.destination = "Porto de Santos(Brazil)";
config.itemDescription = "Banana Crate";




config.globalId =  "2019-G-" + createId(25);
config.stageId = "2019-S-" + createId(15);
config.routeName =  "Flor-Santos-16";



infoPath = path.join(__dirname,'./channelInfoT.json');
let channelInfo = require(infoPath);
channelInfo.globalId = config.globalId;

fs.writeFileSync(infoPath, JSON.stringify(channelInfo,null, 2), function (err) {
    if (err) return console.log(err);
});




let additionalInfo = fs.readFileSync(path.join(__dirname, '/channelInfoT.json'),'UTF-8');
let info = JSON.parse(additionalInfo);


config.channelKey = info.channelKey;
config.path = modules_path;
config.publishInterval = 900000; // 15 minutes, change for how often you want to publish
config.retryInterval = 60000; // interval to retry after failing to publish
const mamState = Mam.init(config.provider,config.seed);
mamDetails = Mam.create(mamState, 'GETROOT');
config.root = mamDetails.root;
config.mamState = mamState;
config.endMessage = 36; //36


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