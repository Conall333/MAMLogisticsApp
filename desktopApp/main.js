const electron = require("electron");
const url = require("url");
const path = require("path");
const mysql = require('mysql');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let requestWindow;
let mostRecentWindow;
let infoWindow;
channelKey = "";


// Listen for the app to be ready

app.on('ready', function(){
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 500,
        height: 600,
    })

    // load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: 'file:',
        slashes: true
    }));
    // quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    createInfoWindow();
    getShipmentIds();

    // build menu from template
    const MainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert the menu
    Menu.setApplicationMenu(MainMenu);
});

// Handle createRequestWindow

function createRequestWindow(){
    // create new window
    requestWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 400,
        x: 1010,
        y: 180,
        title: 'Enter Stage Id'

    });

    // load html into window
    requestWindow.loadURL(url.format({
        pathname: path.join(__dirname, "requestWindow.html"),
        protocol: 'file:',
        slashes: true
    }));

    // free memory
    requestWindow.on('close', function(){
        requestWindow = null;
    })

}


function createInfoWindow(){
    // create new window
    infoWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 490,
        height: 500,
        x: 10,
        y: 180,
        title: 'Info Window'

    })

    // load html into window
    infoWindow.loadURL(url.format({
        pathname: path.join(__dirname, "infoWindow.html"),
        protocol: 'file:',
        slashes: true
    }));

    // free memory
    infoWindow.on('close', function(){
        infoWindow = null;
    })

}

function createMostRecentWindow(){

    // create new window
    mostRecentWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 500,
        height: 350,
        title: 'MostRecent'

    })

    // load html into window
    mostRecentWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mostRecentWindow.html"),
        protocol: 'file:',
        slashes: true
    }));

    // free memory
    mostRecentWindow.on('close', function(){
        requestWindow = null;
    })

}


ipcMain.on('item:sendRequest', function(e, item){
    console.log(item);

    let id;
    let range;
    let date;

    try {

        id = item.id;
        range = item.range;
        date = item.date;
    }
    catch{
        console.log("ERROR with request information")

    }


    getRootAndKey(id,range,date);




    //todo create function to send request to db
    requestWindow.close();
});

ipcMain.on('send:stageId', function(e,item){
    console.log(item);

    createRequestWindow();
    requestWindow.webContents.once('dom-ready', () => {

        requestWindow.webContents.send('forward:stageId', item);
    });



});




function getRootAndKey(stage_id,range,date) {


    var con = mysql.createConnection({
        host: 'remotemysql.com',
        user: 'cX2lcjOkuC',
        password: 'rS58Cs8XrH',
        database: 'cX2lcjOkuC',
        port: '3306'
    });

    con.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else {
            console.log('connected as id ' + con.threadId);

        }


    });


    let received_root = "";
    let received_key = "";

    con.query('SELECT channel_key, root from stage_shipments WHERE stage_id = ?', [stage_id], function (error, results, fields) {
        if (error) throw error;
        console.log(results);

        try {
            received_key = results[0].channel_key;
            received_root = results[0].root;
        }
        catch{
            console.log("Unable to get channel key and root from the database, make sure valid id entered")
        }


        if (range === "all") {
            fetchAll(received_key, received_root);
            con.end()
        } else if (range === "day") {

            con.query('SELECT root from daily_roots WHERE stage_id = ? AND date = ?', [stage_id, date], function (error, results, fields) {
                if (error) throw error;
                console.log(results);

                try {

                    received_root = results[0].root;
                    fetchDay(received_key, received_root, 0);
                }catch {
                    console.log("Unable to fetch")
                }
                con.end()

            });


        } else if (range === "recent") {


            con.query('SELECT root from recent_root WHERE stage_id = ?', [stage_id], function (error, results, fields) {
                if (error) throw error;
                console.log(results);

                try{

                received_root = results[0].root;
                fetchAll(received_key, received_root);

                }catch {
                    console.log("Unable to fetch")
                }
                con.end()

            });

        }

    });

}



function getShipmentIds() {


    let con = mysql.createConnection({
        host: 'remotemysql.com',
        user: 'cX2lcjOkuC',
        password: 'rS58Cs8XrH',
        database: 'cX2lcjOkuC',
        port: '3306',
        timezone: 'Z'
    });

    con.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else {
            console.log('connected as id ' + con.threadId);

        }


    });
    con.query('SELECT Distinct global_id from global_shipments', function (error, results, fields) {
        if (error) throw error;

        let globalArray =[];
        for (let l = 0; l < results.length; l++) {

            globalArray.push(results[l].global_id)

        }


        infoWindow.webContents.on('did-finish-load', () => {

            for (let i = 0; i < globalArray.length; i++) {


                con.query('SELECT stage_id from global_shipments where global_id =?', [globalArray[i]], function (error, results, fields) {
                    if (error) throw error;

                    let values = {};
                    let elements =[];

                    values.global_id = globalArray[i];

                    results.forEach(function(element){

                        elements.push(element.stage_id);


                    });

                    values.stage_ids = elements;


                    con.query('SELECT date from stage_shipments where stage_id =?', [values.stage_ids[0]], function (error, results, fields) {
                        if (error) throw error;

                        let startDate = results[0].date;
                        let dateArray = startDate.toDateString().split(" ");
                        let dateString = dateArray[1] +'-'+dateArray[2]+'-'+dateArray[3];

                        values.date = dateString;
                        console.log(dateString);

                        infoWindow.webContents.send('item:shipments', values);


                    });

                });

            }
        });






        });




        //con.end()



}






// create menu template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
                {
                    label: 'Clear Main Window',
                    click(){
                        mainWindow.webContents.send('item:clear');
                    }
                },
                
                {
                    label: 'Open Most Recent Window',
                    click(){
                        createMostRecentWindow();
                    }
                },
            {
                label: 'Open Request Window',
                    click(){
                    createRequestWindow();
                }
            },
                {
                    label: 'Clear Incomming Window',
                    click(){
                        mostRecentWindow.webContents.send('item:clear');
                        fetch();
                    }
                },

                {
                    label: 'Quit',
                    accelerator: process.platform === 'darwin' ? 'Commmand+Q' : 'Ctrl+Q',
                    click(){
                        app.quit();
                    }
                }
    ]
    }
];

// if mac, add empty object to menu
if(process.platform === 'darwin'){
    // unshift adds to beginig of array
    mainMenuTemplate.unshift({});
}

// Add develpoer ttols item if not in production

if(process.env.Node_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Commmand+I' : 'Ctrl+I',  
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}





const fs = require('fs');
const config = require('./configR');
// import modules
const Iota = require(path.join(config.path,'core'));
const Converter = require(path.join(config.path,'converter'));
const {asciiToTrytes, trytesToAscii} = require(path.join(config.path,'converter'));
const extractJSON =  require(path.join(config.path,'extract-json'));
const Mam = require(path.join(config.path,'mam','lib','mam.client.js'));
const mode = config.mode;

// node that messages will be fetched from
const provider = config.provider;
// using the same seed will not overwrite previously published messages
const seed =config.seed;
// root Address (channel id)
messageCount = 0;

// inititalize state of mam
try {
    Mam.init(provider, seed);
}
catch (e) {
    console.log(e);

    for (let i=0;i<config.altProviders.length;i++){

        try {
            Mam.init(config.altProviders[i], seed);
            break;
        }
        catch (e) {
            console.log(e)

        }

    }
}

const iota = Iota.composeAPI({
    provider: config.provider
});




async function fetchAll(key,received_root) {
    //output once fetch is completed
    try{
    console.log("Fetching...")
    const result = await Mam.fetchSingle(received_root, mode, key);
    messageCount += 1;
    let next_root = result.nextRoot;
    console.log('Fetched and parsed ==>', JSON.parse(trytesToAscii(result.payload)));
    item = JSON.parse(trytesToAscii(result.payload));
    mainWindow.webContents.send('item:add', item);
    fetchAll(key,next_root);
    
    }
    catch(e){
        console.log("no new message to fetch");
        console.log(e)
        //setTimeout(intervalForListening,  config.fetchInterval);
    }
}
async function fetchDay(key,received_root,count) {
    //output once fetch is completed
    try{
        console.log("Fetching...")
        const result = await Mam.fetchSingle(received_root, mode, key);
        messageCount += 1;
        let next_root = result.nextRoot;
        console.log('Fetched and parsed ==>', JSON.parse(trytesToAscii(result.payload)));
        item = JSON.parse(trytesToAscii(result.payload));
        mainWindow.webContents.send('item:add', item);
        count += 1;
        if (count !== 97) {
            fetchDay(key, next_root, count);
        }
        else {
            console.log("fetchedAllMessagesFrom given day");
        }

    }
    catch(e){
        console.log("no new message to fetch");
        console.log(e)
        //setTimeout(intervalForListening,  config.fetchInterval);
    }
}



async function fetchNext() {

    try {
        console.log("fetching message with address: " + rootOfPublishingDevice);
        const result = await Mam.fetchSingle(rootOfPublishingDevice, mode, channelKey);
        console.log('*Fetched and parsed ==>', JSON.parse(trytesToAscii(result.payload)));
        rootOfPublishingDevice = result.nextRoot;
        item = JSON.parse(trytesToAscii(result.payload))
        mostRecentWindow.webContents.send('item:recent', item);
        setTimeout(intervalForListening, config.fetchInterval);
    }

    catch{
        console.log("*no new messages to fetch");
        setTimeout(intervalForListening, config.fetchInterval / 2);
    }
    
}

function intervalForListening(){
    console.log("interval called");
    fetchNext()
}


function fetch(){
    messageCount = 0;
    manageResponse();
}

















 



















