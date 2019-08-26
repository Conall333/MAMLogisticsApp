
const path = require('path');
const config = require('./configTest');
const log4js = require('log4js');
const fs = require("fs");

modules_path = config.path;


const Mam = require(path.join(modules_path,'mam','lib','mam.client.js'));
const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));

// mam mode
mode = config.mode;
// node that will perform pow

nodeNum = 14;
trials = 250;

let fileString = 'nodeNames';

providerArray = [];

fs.readFileSync(fileString).toString().split('\n').forEach(function (line) {
    providerArray.push(line.trim())


});




// using the same seed will not overwrite previously published messages
const seed = config.seed;
sideKey = 'MPJBIDLNZFRAJSDWTKJMEEVFQKTK9CEMKXO9OLZJUYRKFUFCEABNNOJAFL9FJFBWTGSKRFCQXGQDVBSHA';
root = 'GZTKOSLOCMPZVFQYNGUOBOGA9LR9TE9UGMJDMNSKIUTHGJXMUAUDZX9UDHIACOWUAGZMMMYGRYFZZOYUO';


messageCount = 0;


// let filename ='testFetchAll';

let filename = "testOneByOne";
log4js.configure({
    appenders: { nodeTest: { type: 'file', filename: filename } },
    categories: { default: { appenders: ['nodeTest'], level: 'info' } }
});

const logger = log4js.getLogger('time(ms)');



    let provider = providerArray[nodeNum] ;




    Mam.init(provider, seed);


    //fetchAll(sideKey,root);
    console.log(provider);

fetchOneByOneTest();


async function fetchAll(key,received_root) {
    //output once fetch is completed
    try {
        console.log("Fetching...");
        let start_time = new Date().getTime();
        let results = await Mam.fetch(received_root, mode, key);
        let fetch_time = new Date().getTime();
        let timeTaken = ((fetch_time - start_time) / 1000);
        let perMessage = (timeTaken / results.messages.length).toFixed(2);
        console.log(results.messages.length);

        logger.warn(provider.trim() + " & "+ "0"+" & "+timeTaken+" & "+ perMessage +"\\%\\\\");



    } catch (e) {
        console.log(e)
        //setTimeout(intervalForListening,  config.fetchInterval);
    }

}


function fetchOneByOneTest() {
    console.log("Fetching...");
    starting_time = new Date().getTime();
    fetchOneByOne(root, sideKey)




}

async function fetchOneByOne(currentRoot,key) {
    try{
        const result = await Mam.fetchSingle(currentRoot, mode, key);
        messageCount += 1;
        let next_root = result.nextRoot;
        console.log(JSON.parse(trytesToAscii(result.payload)));
        fetchOneByOne(next_root,key);

    }
    catch(e){
        console.log(e);
        let fetching_time = new Date().getTime();
        let timeTaken = ((fetching_time - starting_time) / 1000).toFixed(2);
        let perMessage = timeTaken / 250;
        console.log(messageCount);
        logger.warn(provider.trim() + " & "+ "0"+" & "+timeTaken+" & "+ perMessage +"\\%\\\\");

    }

}
















