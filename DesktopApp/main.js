const electron = require("electron/electron");
const url = require("url");
const path = require("path");


const {app, BrowserWindow, Menu, ipcMain} = electron;


let mainWindow;
let addWindow;
let mostRecentWindow;

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

    // build menu from template
    const MainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // insert the menu
    Menu.setApplicationMenu(MainMenu);
});

// Handle createAddWindow

function createAddWindow(){
    // create new window
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 400,
        title: 'AdditionalWindow'

    })

    // load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: 'file:',
        slashes: true
    }));

    // free memory
    addWindow.on('close', function(){
        addWindow = null;
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
        addWindow = null;
    })

}


// catch item:add
ipcMain.on('item:sendRequest', function(e, item){
    console.log(item);
    let request = "root_" + item.amount + "_" + item.format;
    console.log(request);
    sendRequest(request);
    manageResponse();
    addWindow.close();
});



// create menu template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
                {
                    label: 'Clear',
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
                    createAddWindow();
                }
            },
                {
                    label: 'Fetch Last 10 Messages',
                    click(){
                        mainWindow.webContents.send('item:clear');
                        fetchLast10();   
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
                    accelerator: process.platform == 'darwin' ? 'Commmand+Q' : 'Ctrl+Q',
                    click(){
                        app.quit();
                    }
                }
    ]
    }
];

// if mac, add empty object to menu
if(process.platform == 'darwin'){
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
const PubResponse = require('./PubResponse.js');
const extractJSON =  require(path.join(config.path,'extract-json'));
const Mam = require(path.join(config.path,'mam','lib','mam.client.js'));
const mode = config.mode;

// node that messages will be fetched from
const provider = config.provider;
// using the same seed will not overwrite previously published messages
const seed =config.seed;
// root Address (channel id)
rootOfPublishingDevice = "";
channelKey = "";
messageCount = 0;

// inititalize state of mam
let mamState = Mam.init(provider,seed);

const iota = Iota.composeAPI({
    provider: config.provider
});







function manageResponse() {

            //TODO send request to db with global id or stage id

            //TODO use values in response to start fetching messages

            // TODO  rootOfPublishingDevice  && channelKey

            rootOfPublishingDevice = fs.readFileSync(path.join(__dirname, '/received_root.txt'), 'UTF-8');
            channelKey = fs.readFileSync(path.join(__dirname, '/received_key.txt'), 'UTF-8');
            console.log("Started Fetching Messages... \n");
            fetchAll();



}





async function fetchAll() {
    //output once fetch is completed
    try{
    
    const result = await Mam.fetchSingle(rootOfPublishingDevice, mode, channelKey);
    messageCount += 1;
    rootOfPublishingDevice = result.nextRoot;
    console.log('Fetched and parsed ==>', JSON.parse(trytesToAscii(result.payload)));
    item = JSON.parse(trytesToAscii(result.payload));
    mainWindow.webContents.send('item:add', item);
    fetchAll();
    
    }
    catch{
        console.log("no new message to fetch");
        setTimeout(intervalForListening,  config.fetchInterval);
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























 



















