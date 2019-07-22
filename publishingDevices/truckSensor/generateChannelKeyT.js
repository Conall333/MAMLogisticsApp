const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

if (process.platform === "linux") {
    modules_path = '/home/pi/node_modules/@iota'
}
else {
    modules_path = '@iota'
}

let prime_length = 512;
let diffHell = crypto.createDiffieHellman(prime_length);
const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));
diffHell.generateKeys('ascii');

key = asciiToTrytes(diffHell.getPublicKey('ascii'));


messagesPath = path.join(__dirname,'./channelInfoT.json');
let info = require(messagesPath);
info.channelKey = key;

fs.writeFileSync(messagesPath, JSON.stringify(info,null, 2), function (err) {
    if (err) return console.log(err);
});

