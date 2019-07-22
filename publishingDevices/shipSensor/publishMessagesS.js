
const fs = require('fs');
const path = require('path');
const config = require('./configS');
const flavourText = require('./flavourTextS');
var mysql = require('mysql');// time node js library

modules_path = config.path;


const Mam = require(path.join(modules_path,'mam','lib','mam.client.js'));
const {asciiToTrytes, trytesToAscii} = require(path.join(modules_path,'converter'));

// mam mode
const mode = config.mode;
// node that will perform pow
const provider = config.provider;
// using the same seed will not overwrite previously published messages
const seed = config.seed;
const channelKey = config.channelKey;



// mam explorer allows you to see all the messages in a mam chain from a given point
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${channelKey.padEnd(81, '9')}&root=`
previousMessagePublished = false;
currentMessage = "";
// to differentiate messages
messageCount = 0;
thisRoot =  config.root;
info = "";


// inititalize sate of mam
let mamState = Mam.init(provider,seed);

//change to restricted mode
mamState = Mam.changeMode(mamState, mode, channelKey);

// publishes message
const publish = async packet => {
    // convert message to trytes
    const trytes = asciiToTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);

    // need to save state so that next message will use the next root
    mamState = message.state;

    // attach the message to the tangle, 3 = tangle depth, 14 = minium weight, this is 9 for devnet ( dictates how long pow will take)
    messagePublished = false;
    while (messagePublished === false) {
        try {
            console.log("Publishing Message...");
            await Mam.attach(message.payload, message.address, 3, 14);
            messagePublished = true;
            console.log("Message Published!");
            

        } catch (error) {
            console.log(error);
            console.log("trying to publish again after 60 seconds");
            await sleep(config.retryInterval);

        }
    }

    let con = mysql.createConnection({
        host: 'remotemysql.com',
        user: 'cX2lcjOkuC',
        password: 'rS58Cs8XrH',
        database: 'cX2lcjOkuC',
        port: '3306'
    });

    try {
        con.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
            } else {
                console.log('connected as id ' + con.threadId);
                con.query("UPDATE recent_root SET root = ? WHERE stage_id = ?;", [message.root, config.stageId], function (error, results, fields) {
                    if (error) throw error;
                    console.log("RECENT_ROOTS UPDATED")

                });


                let timestamp = (new Date()).toISOString();
                timestamp = timestamp.substr(0, timestamp.lastIndexOf("T"));


                con.query('SELECT * from daily_roots WHERE stage_id = ? AND date = DATE(NOW());', [config.stageId, timestamp], function (error, results, fields) {
                    if (error) throw error;
                    console.log(results.length);
                    if (results.length === 0) {

                        con.query("INSERT INTO daily_roots (stage_id, root, date) VALUES (?, ?,?);", [config.stageId, message.root, timestamp], function (error, results, fields) {
                            if (error) throw error;
                            console.log("DAILY_ROOTS UPDATED");
                            con.end();

                        });

                    }

                    else {
                        con.end();
                    }
                });

            }

        });


    } catch (e) {
        console.log(e);
        console.log("UNABLE TO UPDATE ROOTS")

    }




    //console.log('Root: ', message.root);
    //console.log('Address: ', message.address);
    console.log('Published == >', packet);
    thisRoot = message.state.channel.next_root.toString();
    return message.root
};

const publishMessage = async () => {
    // increment counter
    messageCount += 1;
    currentMessage = "message " + messageCount;


    if (messageCount === 1) {
        info = flavourText.waiting
    }
    if (messageCount === 2){
        info = flavourText.waiting
    }
    if (messageCount === 3){
        info = flavourText.departure
    }
    if (messageCount > 3){
        info = flavourText.inRoute
    }
    if (messageCount === config.endMessage){
        info = flavourText.arrived
    }


    const root = await publish({
        // addressCounter can publish multiple messages here
        message: currentMessage,
        stageId: config.stageId,
        routeName: config.routeName,
        timestamp: (new Date()).toLocaleString(),
        temperature: (Math.random() * (15 - 13) + 13).toFixed(2),
        humidity: (Math.random() * (61 - 58) + 58).toFixed(2),
        information: info,
        departure: config.departureLocation,
        destination: config.destination,
        message_root: thisRoot
    });
    return root
};





function startPublishing(){
    publishMessage()
        .then(async root => {

            if (messageCount === config.endMessage){

                var con = mysql.createConnection({
                    host: 'remotemysql.com',
                    user: 'cX2lcjOkuC',
                    password: 'rS58Cs8XrH',
                    database: 'cX2lcjOkuC',
                    port: '3306'
                });


                con.connect(function(err) {
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return;
                    }

                    let timestamp = (new Date()).toISOString();
                    timestamp = timestamp.substr(0, timestamp.lastIndexOf("T"));


                con.query("UPDATE stage_shipments SET completed = ?, active = ?, date_completed = ? WHERE stage_id = ?;", ['Y', 'N',timestamp, config.stageId], function (error, results, fields) {
                    if (error) throw error;
                    console.log("Status UPDATED");
                    console.log("Exiting...");
                    process.exit(1)

                    });

            });

            }

            //output once fetch is completed
            // const result = await Mam.fetch(root, mode)
            // console.log("Next Root: " + result.nextRoot)
            // result.messages.forEach(message => console.log('Fetched and parsed ==>', JSON.parse(trytesToAscii(message))))

            if (mamState.channel.start === 1) {
                console.log(`Verify with explorer:\n${mamExplorerLink}${root}\n`);


                var con = mysql.createConnection({
                    host: 'remotemysql.com',
                    user: 'cX2lcjOkuC',
                    password: 'rS58Cs8XrH',
                    database: 'cX2lcjOkuC',
                    port: '3306'
                });


                con.connect(function(err) {
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return;
                    }

                    else {
                        console.log('connected as id ' + con.threadId);
                        con.query("INSERT INTO global_shipments (global_id, stage_id) VALUES (?, ?);",[config.globalId,config.stageId], function (error, results, fields) {
                            if (error) throw error;
                            console.log("GLOBAL_SHIPMENTS DETAILS UPDATED")
                        });

                        let sensor_id = config.sensor_id;
                        let route_name = config.routeName;
                        let channel_key =config.channelKey;
                        let channel_root = config.root;
                        let stage_id = config.stageId;
                        let timestamp = (new Date()).toISOString();
                        timestamp = timestamp.substr(0, timestamp.lastIndexOf("T"));


                        con.query("INSERT INTO stage_shipments (stage_id, route_name, channel_key, root, date, sensor_id, active, completed, transportation_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", [stage_id, route_name, channel_key, channel_root, timestamp , sensor_id,'Y','N',config.transportationType],function (error, results, fields) {
                            if (error) throw error;
                            console.log("STAGE_SHIPMENTS DETAILS UPDATED")
                        });

                        con.query("INSERT INTO recent_root (stage_id, root) VALUES (?, ?);",[config.stageId,config.root], function (error, results, fields) {
                            if (error) throw error;
                            console.log("INITIAL RECENT_ROOT SET");
                            con.end();

                        });

                    }


                });





            }
        })
}

function intervalForPublishing(){
    startPublishing();
    // X minuite interval to call the function recursively
    // 900000 - 15 minutes
    // 60000 - 1 minute
    setTimeout(intervalForPublishing, config.publishInterval);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

intervalForPublishing();









