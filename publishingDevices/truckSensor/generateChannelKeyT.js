const crypto = require('crypto');
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

const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));


/*
//option 1 for key generation
let prime_length = 512;
let diffHell = crypto.createDiffieHellman(prime_length);
diffHell.generateKeys('ascii');

key = asciiToTrytes(diffHell.getPublicKey('ascii'));


messagesPath = path.join(__dirname,'./channelInfoT.json');
let info = require(messagesPath);
info.channelKey = key;

fs.writeFileSync(messagesPath, JSON.stringify(info,null, 2), function (err) {
    if (err) return console.log(err);
});

*/

// option 2 for key generation

crypto.randomBytes(64, function(err, buffer) {
    let keyInAscii = buffer.toString('ascii');

    let key =  asciiToTrytes(keyInAscii);


    let messagesPath = path.join(__dirname,'./channelInfoT.json');
    let info = require(messagesPath);
    info.channelKey = key;

    fs.writeFileSync(messagesPath, JSON.stringify(info,null, 2), function (err) {
        if (err) return console.log(err);
    });
});



