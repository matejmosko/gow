const electron = require('electron')
// Module to control application life.
const app = electron.app
//const fs = electron.remote.require('fs')
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const {ipcMain} = require('electron')

var fs = require('fs');

ipcMain.on('transferCurrentGame', (event, arg) => {
  projektorWindow.webContents.send('readCurrentGame', arg);
})
ipcMain.on('transferNews', (event, arg) => {
  projektorWindow.webContents.send('readNews', arg);
})
ipcMain.on('transferPhase', (event, arg1, arg2, arg3) => {
  projektorWindow.webContents.send('readPhase', arg1, arg2, arg3);
})
ipcMain.on('setFullscreen', (event, sort) => {
  if (projektorWindow.isFullScreen()) {projektorWindow.setFullScreen(false)} else projektorWindow.setFullScreen(true);
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let projektorWindow

// main process

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
  //  mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}



function createProjektor() {
    // Create the browser window.
    projektorWindow = new BrowserWindow({ width: 640, height: 480 })

    // and load the index.html of the app.
    projektorWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'thegame.html'),
        protocol: 'file:',
        slashes: true,
        fullscreenable: true
    }))

    // Open the DevTools.
//    projektorWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    projektorWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        projektorWindow = null
    })
    projektorWindow.webContents.on('did-finish-load', () => {

    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
app.on('ready', createProjektor)
// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

var dir = './savegame';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// Game Worlds scripts
