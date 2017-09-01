const electron = require('electron');
// Module to control application life.
const app = electron.app;
//const fs = electron.remote.require('fs')
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const { ipcMain } = require('electron');
const settings = require('electron-settings');

global.params = {};

var fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let gowWindows = {};

// main process

var windowState = {};
try {
  windowState = settings.get('windowstate', {
    "main": {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 800,
        "height": 600
      },
      "isMaximized": false
    },
    "projector": {
      "bounds": {
        "x": 100,
        "y": 100,
        "width": 800,
        "height": 600
      },
      "isMaximized": false
    }
  });
} catch (err) {
  // the file is there, but corrupt. Handle appropriately.
}

var storeWindowState = function() {
  windowState.main.isMaximized = gowWindows.main.isMaximized();
  windowState.projector.isMaximized = gowWindows.projector.isMaximized();
  if (!windowState.main.isMaximized) {
    // only update bounds if the window isn't currently maximized
    windowState.main.bounds = gowWindows.main.getBounds();
  }
  if (!windowState.projector.isMaximized) {
    // only update bounds if the window isn't currently maximized
    windowState.projector.bounds = gowWindows.projector.getBounds();
  }
  settings.set('windowstate', windowState);
};

function createWindow() {
  // Create the browser window.
  gowWindows.main = new BrowserWindow({
    x: windowState.main.bounds && windowState.main.bounds.x || undefined,
    y: windowState.main.bounds && windowState.main.bounds.y || undefined,
    width: windowState.main.bounds && windowState.main.bounds.width || 800,
    height: windowState.main.bounds && windowState.main.bounds.height || 600,
    icon: path.join(__dirname, 'img/icon.png'),
    title: 'GOW Admin',
    backgroundColor: '#13132A'
  });

  if (windowState.main.isMaximized) {
    gowWindows.main.maximize();
  }

  // and load the index.html of the app.
  gowWindows.main.loadURL(url.format({
    pathname: path.join(__dirname, 'console.html'),
    protocol: 'file:',
    slashes: true
  }));
  // Open the DevTools.
  //  gowWindows.main.webContents.openDevTools()

  gowWindows.main.on('close', event => {
    storeWindowState();
    event.preventDefault(); //this prevents it from closing. The `closed` event will not fire now
    gowWindows.main.webContents.send('quitModal');
    /* DEPRECATED BY USING XEL MODALS
    let child = new BrowserWindow({parent: gowWindows.main, modal: true, resizable: false, width: 440, height: 180, show: false})
    child.loadURL(url.format({
        pathname: path.join(__dirname, 'quit.html'),
        protocol: 'file:',
        slashes: true
    }))*/
    ipcMain.on('reallyQuit', (event) => {
      app.exit();
    });

    //app.exit();
  });
  gowWindows.main.on('resize move close', function() {
    storeWindowState();
  });
  // Emitted when the window is closed.
  gowWindows.main.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    gowWindows.main = null;
  });
  gowWindows.main.on('resize', function() {
    storeWindowState();
  });
  gowWindows.main.on('move', function() {
    storeWindowState();
  });
}



function createProjector() {
  // Create the browser window.
  gowWindows.projector = new BrowserWindow({
    x: windowState.projector.bounds && windowState.projector.bounds.x || undefined,
    y: windowState.projector.bounds && windowState.projector.bounds.y || undefined,
    width: windowState.projector.bounds && windowState.projector.bounds.width || 800,
    height: windowState.projector.bounds && windowState.projector.bounds.height || 600,
    icon: path.join(__dirname, 'img/icon.png'),
    title: 'GOW',
    backgroundColor: '#13132A',
    show: false
  });

  if (windowState.projector.isMaximized) {
    gowWindows.projector.maximize();
  }

  // and load the index.html of the app.
  gowWindows.projector.loadURL(url.format({
    pathname: path.join(__dirname, 'projector.html'),
    protocol: 'file:',
    slashes: true,
    fullscreenable: true
  }));

  // Open the DevTools.
  //    gowWindows.projector.webContents.openDevTools()

  // Emitted when the window is closed.
  gowWindows.projector.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    gowWindows.projector = null;
  });
  gowWindows.projector.on('close', event => {
    storeWindowState();
    event.preventDefault(); //this prevents it from closing. The `closed` event will not fire now
    gowWindows.main.webContents.send('buttonSwitch', "#projectorBtn", false);
    gowWindows.main.webContents.send('buttonSwitch', "#fullscreenBtn", false);
    gowWindows.projector.hide();
  });
  gowWindows.projector.on('leave-full-screen', () => {
    gowWindows.main.webContents.send('buttonSwitch', "#fullscreenBtn", false);
  });
  gowWindows.projector.on('enter-full-screen', () => {
    gowWindows.main.webContents.send('buttonSwitch', "#fullscreenBtn", true);
  });
  gowWindows.projector.webContents.on('did-finish-load', () => {

  });

  gowWindows.projector.on('resize', function() {
    storeWindowState();
  });
  gowWindows.projector.on('move', function() {
    storeWindowState();
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('ready', createProjector);
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (gowWindows.main === null) {
    createWindow();
  }
});

var dir = './savegame';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// Game Worlds scripts

// Logs generating

function currentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function createLog(text) {
  var file = fs.openSync(app.gatPath('userData') + "log-" + currentDate() + ".log", 'a');
  fs.writeFile(file, text, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The log was saved!");
  });
}

function defaultSettings() {
  settings.setAll({
    year: 0,
    phase: 0,
    clock: {
      "pause": 7,
      "diplomacy": 4,
      "brief": 0.5
    },
    longPause: 7,
    shortPause: 0.5,
    name: 'gow-settings',
    countryCount: 15,
    yearCount: 5,
    countryCodes: {
      'SVK': { country: 'Slovensko', playing: 0 },
      'RUS': { country: 'Rusko', playing: 0 },
      'USA': { country: 'USA', playing: 0 },
      'JAR': { country: 'JAR', playing: 0 },
      'AUS': { country: 'Austrália', playing: 0 },
      'CHN': { country: 'Čína', playing: 0 },
      'JPN': { country: 'Japonsko', playing: 0 },
      'GBR': { country: 'Veľká Británia', playing: 0 },
      'CAN': { country: 'Kanada', playing: 0 },
      'BRA': { country: 'Brazília', playing: 0 },
      'MEX': { country: 'Mexiko', playing: 0 },
      'IND': { country: 'India', playing: 0 },
      'IRN': { country: 'Irán', playing: 0 },
      'VEN': { country: 'Venezuela', playing: 0 },
      'FRA': { country: 'Francúzsko', playing: 0 }
    },
    countryList: [
      'SVK',
      'RUS',
      'USA',
      'JAR',
      'AUS',
      'CHN',
      'JPN',
      'GBR',
      'CAN',
      'BRA',
      'MEX',
      'IND',
      'IRN',
      'VEN',
      'FRA'
    ],
    phases: [{
      title: 'Pomoc štvrtému svetu',
      text: 'Nastal čas splniť svoje sľuby a pomocť krajinám, ktoré vašu pomoc potrebujú.'
    }, {
      title: 'Správy zo sveta',
      text: 'Usaďte sa pri svojich domovských stoloch a vypočujte si, čo o vašich vládach hovoria zmanipulované médiá.'
    }, {
      title: 'Čas na strategické rozhodnutia',
      text: 'Teraz sa môžu generáli, diplomati a prezidenti dohodnúť na ďalšej stratégii. Využite tento čas dobre.'
    }, {
      title: 'Rozkladanie armád',
      text: 'Generáli, presuňte sa k strategickej mape, budete rozkladať svoje armády.'
    }, {
      title: 'Diplomacia',
      text: 'Je čas vyjednávať s ostatnými krajinami a ukladať na mapu akčné karty.'
    }, {
      title: 'Vyhodnotenie bojov',
      text: 'Generáli, presuňte sa naspäť k strategickej mape. Teraz sa rozhodne o budúcnosti sveta.'
    }, {
      title: 'Pauza',
      text: 'Vypočujte si, čo o svojej vláde píšu v zapredaných médiách, dohodnite sa na ďalšej stratégii a užite si pauzu.'
    }],
    ufoEvents: [{
      title: 'Vpád mimozemšťanov',
      text: 'Prileteli mimozemské lode a drancujú svet. Pri ich zničení sa dajú získať mimozemské technológie.',
      secret: 'Objavili sa mimozemské lode a drancujú tieto územia: Ekvádor / Poľsko / Mongolsko. Na každom území je 5 ich armády a 2 mimozemské AK'
    }, {
      title: 'Mimozemská základňa',
      text: 'Objavila sa základňa mimozemšťanov. Podľa získaných informácií sa v nej nachádza pokročilá technológia, ktorou dokáže vymazať celé územia z povrchu Zeme.',
      secret: 'V Kongu sa objavila základňa mimozemšťanov. Je tam (2x počet tímov) mimozemských armád a 6 mimozemských AK '
    }, {
      title: 'Pád UFO a Mimozemské útoky',
      text: 'V Kongu sa zrútilo UFO. Priekupníci z celého sveta si brúsia zuby na stroskotanú mimozemskú technológiu. Mimozemšťania po havárii menia taktiku. Útočia priamo na bojujúce armády.',
      secret: 'V Kongu budú k dispozícii 4 mimozemské AK. Kto (tím alebo aliancia) tam dá najviac armád získa tie karty (+ hodnota AK) Mimozemšťania sa silou 6-10 zapoja do troch náhodných bojov (ich armáda sa pridá po rozdaní žétonov hráčov v strategickej fáze). Ak budú mimozemšťania porazení, budú tam 2 mimozemské AK'
    }, {
      title: 'Vpád mimozemšťanov',
      text: 'Prileteli mimozemské lode a drancujú svet. Pri ich zničení sa dajú získať mimozemské technológie.',
      secret: 'Objavili sa mimozemské lode a drancujú tieto územia: Alžírsko, Západný Sibír, Čile. Na každom území je 10 armád a 2 mimozemské AK.'
    }, {
      title: 'Zem je plochá',
      text: 'Vďaka tajným technológiám mimozemšťanov sa podarilo zistiť, že Zem je vlastné plochá. Už sa necestuje po trojuholníkoch, cestuje sa zdarma.',
      secret: 'Cestovanie medzi kontinentmi je zdarma.'
    }, {
      title: '',
      text: '',
      secret: ''
    }],
    worldEvents: [{
      title: 'Nové ložiská za Uralom',
      text: 'Investori zháňajú peniaze na stavbu vrtných veží. V hlavnej udalosti je možné získať 6 surovín ropy.',
      secret: 'V ponuke je 6 surovín ropy.'
    }, {
      title: 'Kongres OSN',
      text: 'Na kongrese sú švédske stoly. V ponuke sú 4 AK typu Gastráče.',
      secret: 'V ponuke sú 4 AK typu Gastráče.'
    }, {
      title: 'Najlepší tajný agent',
      text: 'Útok mimozemšťanov odhalil štyroch kryogenicky zmrazených tajných agentov. V hlavnej udalosti je možné získať 4 špeciálne karty "Austin Powers".',
      secret: 'V ponuke sú 4 špeciálne karty "Austin Powers".'
    }, {
      title: 'Výpredaje na svetových trhoch',
      text: 'Svet stojí pred hypotekárnou krízou. Za lacno sa dá získať 8 náhodných AK.',
      secret: 'V ponuke je 8 náhodných AK.'
    }, {
      title: 'Olympijske hry',
      text: 'Chlieb a hry musia pokračovať aj pri mimozemskej invázii. Kto si kúpi možnosť organizovať OH, získa 6 AK.',
      secret: 'V ponuke sú 6 AK typu Plusové body.'
    }, {
      title: '',
      text: '',
      secret: ''
    }]
  });
}
ipcMain.on('startGame', (event) => {
  gowWindows.projector.webContents.send('startGame');
});
ipcMain.on('transferCurrentGame', (event, arg1) => {
  gowWindows.projector.webContents.send('readCurrentGame', arg1);
});
ipcMain.on('transferParams', (event, arg1) => {
  gowWindows.projector.webContents.send('readParams', arg1);
});
ipcMain.on('transferNews', (event, arg) => {
  gowWindows.projector.webContents.send('readNews', arg);
});
ipcMain.on('transferPhase', (event, arg1, arg2, arg3) => {
  gowWindows.projector.webContents.send('readPhase', arg1, arg2, arg3);
});
ipcMain.on('toggleRules', (event) => {
  gowWindows.projector.webContents.send('transferRules');
});
ipcMain.on('toggleFullscreen', (event) => {
  if (gowWindows.projector.isFullScreen()) {
    gowWindows.projector.setFullScreen(false);
  } else {
    gowWindows.projector.setFullScreen(true);
  }
});
ipcMain.on('toggleProjector', (event) => {
  if (gowWindows.projector.isVisible()) {
    gowWindows.projector.hide();
    gowWindows.main.webContents.send('buttonSwitch', "#projectorBtn", false);
    gowWindows.main.webContents.send('buttonSwitch', "#fullscreenBtn", false);
  } else {
    gowWindows.projector.show();
    gowWindows.main.webContents.send('buttonSwitch', "#projectorBtn", true);
  }
});
ipcMain.on('reloadWindows', (event) => {
  gowWindows.projector.webContents.reload();
  gowWindows.main.webContents.reload();
});
ipcMain.on('saveLogs', (event, text) => {
  //createLog(text);
});

//app.on('ready', defaultSettings);
ipcMain.on('saveDefaultSettings', (event) => {
  defaultSettings();
});
