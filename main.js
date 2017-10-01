const electron = require('electron');
// Module to control application life.
const app = electron.app;
//const fs = electron.remote.require('fs')
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const {
  ipcMain
} = require('electron');
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
      'SVK': {
        code: 'SVK',
        country: 'Slovensko',
        area: "EuroAfrika",
        playing: false,
        desc: "Môže mať až 9 žetónov armády, pretože má vždy o jedného kapitána viac ako ostatní."
      },
      'RUS': {
        code: 'RUS',
        country: 'Rusko',
        area: "EuroAfrika",
        playing: false,
        desc: "Ak v aktuálnom kole získalo Rusko aspoň jednu ropu, získa po boji ďalšiu ropu."
      },
      'GBR': {
        code: 'GBR',
        country: 'Veľká Británia',
        area: "EuroAfrika",
        playing: false,
        desc: "Neplatí za presun na iný kontinent."
      },
      'FRA': {
        code: 'FRA',
        country: 'Francúzsko',
        area: "EuroAfrika",
        playing: false,
        desc: "Vždy keď prehrá boj, vezme si jednu z použitých akčných kariet."
      },
      'JAR': {
        code: 'JAR',
        country: 'JAR',
        area: "EuroAfrika",
        playing: false,
        desc: "Vždy keď je po boji na víťaznej strane, získa 1 zlato."
      },
      'USA': {
        code: 'USA',
        country: 'USA',
        area: "DvojAmerika",
        playing: false,
        desc: "Začína s 5 žetónmi armády."
      },
      'CAN': {
        code: 'CAN',
        country: 'Kanada',
        area: "DvojAmerika",
        playing: false,
        desc: "Kov nakupuje z banky za 2 zdroje zlata"
      },
      'MEX': {
        code: 'MEX',
        country: 'Mexiko',
        area: "DvojAmerika",
        playing: false,
        desc: "Raz za kolo si môže za 1 kov kúpiť jednu mimozemskú akčnú kartu."
      },
      'BRA': {
        code: 'BRA',
        country: 'Brazília',
        area: "DvojAmerika",
        playing: false,
        desc: "Ropu a kov kupuje za 3 zdroje zlata."
      },
      'VEN': {
        code: 'VEN',
        country: 'Venezuela',
        area: "DvojAmerika",
        playing: false,
        desc: "V boji proti mimozemšťanom má bonus +1."
      },
      'CHN': {
        code: 'CHN',
        country: 'Čína',
        area: "AustraloÁzia",
        playing: false,
        desc: "Keď prispeje do hlavnej udalosti môže sa rátať príspevok ako o 2 zdroje zlata väčší."
      },
      'IND': {
        code: 'IND',
        country: 'India',
        area: "AustraloÁzia",
        playing: false,
        desc: "Ktorúkoľvek svoju AK môže použiť ako AK 'Francúzsky útok'. Rozhodnúť sa môže aj počas boja po odhalení AK."
      },
      'IRN': {
        code: 'IRN',
        country: 'Irán',
        area: "AustraloÁzia",
        playing: false,
        desc: "AK 'Zelení turisti' poskytuje bonus +4."
      },
      'JPN': {
        code: 'JPN',
        country: 'Japonsko',
        area: "AustraloÁzia",
        playing: false,
        desc: "V každom boji môžu použiť 2 AK namiesto jednej."
      },
      'AUS': {
        code: 'AUS',
        country: 'Austrália',
        area: "AustraloÁzia",
        playing: false,
        desc: "Vždy keď bojuje mimo svojho kontinentu, má silu +1."
      }
    },
    countryList: [
      'VEN',
      'FRA',
      'SVK',
      'GBR',
      'RUS',
      'USA',
      'JAR',
      'AUS',
      'CHN',
      'JPN',
      'CAN',
      'BRA',
      'MEX',
      'IND',
      'IRN'
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
      secret: 'Objavili sa mimozemské lode a drancujú 3 územia. Na každom území je 5 ich armády a 2 mimozemské AK.'
    }, {
      title: 'Mimozemská základňa',
      text: 'Objavila sa základňa mimozemšťanov. Podľa získaných informácií sa v nej nachádza pokročilá technológia, ktorou dokáže vymazať niektoré územia z povrchu Zeme.',
      secret: 'Objavila sa základňa mimozemšťanov. Je tam (2x počet tímov) mimozemských armád a 6 mimozemských AK '
    }, {
      title: 'Mimozemská tajná služba',
      text: 'Mimozemšťania sa infiltrovali do tajných služieb. Celé kolo nie je možné použiť AK "Zahraničná návšteva" a "Agent Snow den"',
      secret: 'Celé kolo nie je možné použiť AK "Zahraničná návšteva" a "Agent Snow den"'
    }, {
      title: 'Pád UFO a Mimozemské útoky',
      text: 'Zrútilo sa UFO. Správa sa rozniesla ako blesk. Priekupníci z celého sveta si brúsia zuby na mimozemskú technológiu. Mimozemšťania po havárii menia taktiku. Útočia priamo na bojujúce armády.',
      secret: 'Na území budú k dispozícii 4 mimozemské AK. Kto (tím alebo aliancia) tam dá najviac armád získa tie karty (+ hodnota AK) Mimozemšťania sa silou 6-10 zapoja do troch náhodných bojov (ich armáda sa pridá po rozdaní žétonov hráčov v strategickej fáze). Ak budú mimozemšťania porazení, budú tam 2 mimozemské AK.'
    }, {
      title: 'Pád GPS',
      text: 'Mimozemšťania zničili satelity pre GPS. V uliciach miest vypukli masové nepokoje hráčov Pokemon GO. Stúpol predaj Sudoku. Celé kolo nie je možné použiť AK "Neuralizér" a "Príhovor kapitána D."',
      secret: 'Celé kolo nie je možné použiť AK "Neuralizér" a "Príhovor kapitána D."'
    }, {
      title: '',
      text: '',
      secret: ''
    }],
    worldEvents: [{
      title: 'Otvorenie čierneho trhu',
      text: 'Na slávnostnom otvorení čierneho trhu sú pre najväčšieho investora pripravené 4 mimozemské akčné karty.',
      secret: 'V ponuke sú 4 mimozemské AK.'
    }, {
      title: 'Kde domov ich?',
      text: 'Domobrana bývalej Českej republiky ponúka svoje sily. Dražia sa 4 žetóny armád.',
      secret: 'V ponuke sú 4 žetóny armády.'
    }, {
      title: 'Hybernatus',
      text: 'Útok mimozemšťanov odhalil štyroch kryogenicky zmrazených tajných agentov. V hlavnej udalosti je možné získať 4 špeciálne karty "Austin Powers".',
      secret: 'V ponuke sú 4 špeciálne karty "Austin Powers".'
    }, {
      title: 'Dobytie severného pólu',
      text: 'Expedícia Karla Němca na severný pól odhalila obrovské náleziská kovov. Najväčší investor získa 6 kusov kovu.',
      secret: 'V hlavnej udalosti je možné získať 6 surovín kovu'
    }, {
      title: 'Voľba sekretára',
      text: 'Rada OSN zasadla, aby transparentne zvolila sekretára pre generálneho sekretára OSN. Krajina, ktorá presadí svojho nominanta, získa bonusové body.',
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
