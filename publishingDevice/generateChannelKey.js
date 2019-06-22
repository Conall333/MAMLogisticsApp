const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

if (process.platform === "linux") {
    modules_path = '/home/pi/node_modules/@iota'
}
else {
    modules_path = '@iota'
}

var prime_length = 512;
var diffHell = crypto.createDiffieHellman(prime_length);
const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));
diffHell.generateKeys('ascii');

key = asciiToTrytes(diffHell.getPublicKey('ascii'));


messagesPath = path.join(__dirname,'./channelInfo.json');
var info = require(messagesPath)
info.channelKey = key;

fs.writeFileSync(messagesPath, JSON.stringify(info,null, 2), function (err) {
    if (err) return console.log(err);
});


// TODO write a bash script to check if a channel key file exist already before calling this script