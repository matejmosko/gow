const {
  app,
  ipcMain,
  BrowserWindow,
  Menu
} = require('electron');

//import 'font-awesome-webpack';

require('v8-compile-cache');

const path = require('path');
const url = require('url');
const settings = require('electron-settings');
const fs = require('fs');

const common = path.resolve(app.getAppPath(),'src/common');

var dirSaveGame = path.resolve(common,'savegame');
var dirScenarios = path.resolve(common,'scenarios');

global.params = {};


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let gowWindows = {};

// main process

let windowState = {};
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

let storeWindowState = function() {
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
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'GOW Admin',
    backgroundColor: 'rgb(236, 236, 236)',
    webPreferences: {
      preload: GOW_CONSOLE_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true
    }
  });

  let menuTemplate = [{
      label: 'Game',
      submenu: [{
          label: 'New Game',
          click() {
            gowWindows.projector.webContents.reload();
            gowWindows.main.webContents.reload();
          }
        },
        {
          label: 'Load Game',
          click() {
            gowWindows.projector.webContents.reload();
            gowWindows.main.webContents.reload();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'System',
      submenu: [{
          label: 'Restart Application',
          click() {
            reloadApp();
          }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'F12',
          click() {
            gowWindows.main.toggleDevTools();
            gowWindows.projector.toggleDevTools();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Help',
          accelerator: 'F1',
          click() {
            showHelp();
          }
        }
      ]
    }
  ];
  gowWindows.main.webContents.openDevTools()

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  //gowWindows.main.setMenu(menu);

  if (windowState.main.isMaximized) {
    gowWindows.main.maximize();
  }

//gowWindows.main.loadUrl(GOW_CONSOLE_WEBPACK_ENTRY);
  // and load the index.html of the app.
  gowWindows.main.loadURL(url.format({
    pathname: GOW_CONSOLE_WEBPACK_ENTRY
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
    backgroundColor: 'rgb(236, 236, 236)',
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (windowState.projector.isMaximized) {
    gowWindows.projector.maximize();
  }

  // and load the index.html of the app.
  gowWindows.projector.loadURL(url.format({
    pathname: GOW_PROJECTOR_WEBPACK_ENTRY,
    fullscreenable: true
  }));

  // Open the DevTools.
  //      gowWindows.projector.webContents.openDevTools()

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

if (!fs.existsSync(dirSaveGame)) {
  fs.mkdirSync(dirSaveGame);
}

if (!fs.existsSync(dirScenarios)) {
  fs.mkdirSync(dirScenarios);
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

function saveDefaultScenario(scenario) {
  scenarioPath = dirScenarios + '/default.json';
  if (!fs.existsSync(scenarioPath)) {
    var file = fs.openSync(scenarioPath, 'a');
    fs.writeFile(file, JSON.stringify(scenario), function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Default Scenario was saved.");
    });
  }
}

function defaultSettings() {
  let scenario = {
    scenario: 'default',
    year: 0,
    phase: 0,
    clock: {
      "pause": 7,
      "diplomacy": 4,
      "brief": 0.5
    },
    longPause: 7,
    realyear: 2037,
    shortPause: 0.5,
    name: 'gow-settings',
    countryCount: 18,
    yearCount: 5,
    countryCodes: {
      'SVK': {
        code: 'SVK',
        country: 'Slovensko',
        area: "EuroAfrika",
        playing: false,
        desc: "Môže kúpiť dve armády za tri ropy"
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
        desc: "Kov nakupuje z banky za 2 zdroje zlata."
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
        desc: "AK 'Príhovor kapitána D.' ruší všetky AK v aktuálnom boji."
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
      },

      'GER': {
        code: 'GER',
        country: 'Nemecko',
        area: "EuroAfrika",
        playing: false,
        desc: "Keď je v hlavnej udalosti súčasťou víťaznej aliancie, získava naviac 3 body."
      },

      'CUB': {
        code: 'CUB',
        country: 'Kuba',
        area: "DvojAmerika",
        playing: false,
        desc: "Keď je v boji, ktorý skončí remízou, berie si suroviny, ale nie body."
      },

      'KOR': {
        code: 'KOR',
        country: 'Kórea',
        area: "AustraloÁzia",
        playing: false,
        desc: "Keď má na území armádu iba Kórea, dostane +1 zlato."
      }
    },
    countryList: [
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
      'VEN',
      'IND',
      'IRN',
      'GER',
      'CUB',
      'KOR'
    ],
    phases: [{
      title: 'Pomoc štvrtému svetu',
      slug: 'pomoc',
      text: 'Nastal čas splniť svoje sľuby a pomocť krajinám, ktoré vašu pomoc potrebujú.'
    }, {
      title: 'Správy zo sveta',
      slug: 'spravy',
      text: 'Usaďte sa pri svojich domovských stoloch a vypočujte si, čo o vašich vládach hovoria zmanipulované médiá.'
    }, {
      title: 'Čas na strategické rozhodnutia',
      slug: 'porada',
      text: 'Teraz sa môžu generáli, diplomati a prezidenti dohodnúť na ďalšej stratégii. Využite tento čas dobre.'
    }, {
      title: 'Rozkladanie armád',
      slug: 'rozkladanie',
      text: 'Generáli, presuňte sa k strategickej mape, budete rozkladať svoje armády.'
    }, {
      title: 'Diplomacia',
      slug: 'diplomacia',
      text: 'Je čas vyjednávať s ostatnými krajinami a ukladať na mapu akčné karty.'
    }, {
      title: 'Vyhodnotenie bojov',
      slug: 'vyhodnotenie',
      text: 'Generáli, presuňte sa naspäť k strategickej mape. Teraz sa rozhodne o budúcnosti sveta.'
    }, {
      title: 'Pauza',
      slug: 'pauza',
      text: 'Dohodnite sa na ďalšej stratégii a užite si pauzu.'
    }],

    /* UFO EVENTS */
    ufoEvents: [{
      title: 'Láska hory prenáša',
      text: 'Spoločná láska slniečkárov na mítingu v Banskej štiavnici preniesla Ural na iné vybrané územie. Kov získa víťaz boja.',
      secret: 'Padne 6x kov.'
    }, {
      title: 'Mimozemská základňa',
      text: 'Objavila sa základňa mimozemšťanov. Podľa získaných informácií sa v nej nachádza pokročilá technológia, ktorou dokáže vymazať niektoré územia z povrchu Zeme.',
      secret: 'Objavila sa základňa mimozemšťanov. Je tam (2x počet tímov) mimozemských armád a 6 mimozemských AK '
    }, {
      title: 'Tomtom huge človek človeku',
      text: 'Donald Trump bol na návšteve Andreja Danka v Pezinku. Ich spoločný príhovor vyvolal vlnu megalománie a nepochopenia. Každé víťazstvo prináša viac bodov.',
      secret: 'Body za boje sa zdvojnásobujú.'
    }, {
      title: 'Pád UFO',
      text: 'Zrútilo sa UFO. Priekupníci z celého sveta si brúsia zuby na mimozemskú technológiu. Mimozemšťania útočia priamo na bojujúce armády.',
      secret: 'Padne 6x ropa.'
    }, {
      title: 'Zem je plochá',
      text: 'Vďaka tajným technológiám mimozemšťanov sa zistilo, že Zem je plochá. Už sa necestuje po trojuholníkoch, cestuje sa zdarma.',
      secret: 'Cestuje sa zadarmo.'
    }, {
      title: '',
      text: '',
      secret: ''
    }],

    /* WORLD EVENTS */
    worldEvents: [{
      title: 'Tender v SIS',
      text: 'Slovenská informačná služba vyhlásila tender na splnenie svojich tajných úloh. Najvyššia ponuka vyhráva 4 tajné misie.',
      secret: '4x TM'
    }, {
      title: 'Hlbšie vrty',
      text: 'Investori zháňajú peniaze na stavbu vrtných veží. V hlavnej udalosti je možné získať 6 surovín ropy.',
      secret: '6x Ropa'
    }, {
      title: 'Otvorenie čierneho trhu',
      text: 'Na slávnostnom otvorení čierneho trhu sú pre najväčšieho investora pripravené 4 MK.',
      secret: '4x MK'
    }, {
      title: 'Zľavy až 110%',
      text: 'Svet stojí pred hypotekárnou krízou. Za lacno sa dá získať 8 náhodných AK.',
      secret: '8 AK'
    }, {
      title: 'Olympiáda',
      text: 'Chlieb a hry musia pokračovať. Kto si kúpi možnosť organizovať OH, získa 4 AK typu "Bonusové body"',
      secret: '4x Body'
    }, {
      title: '',
      text: '',
      secret: ''
    }]
  }
  settings.setAll(scenario);
  saveDefaultScenario(scenario);
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
