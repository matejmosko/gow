// Mixing jQuery and Node.js code in the same file? Yes please!

$(function() {
  const path = require('path');
  const url = require('url');
  const fs = require('fs')
  var ipc = require('electron').ipcRenderer,
    currentGame,
    Datastore = require('nedb'),
    db = {},
    params = {},
    sort = 99,
    newgame = false,
    started = false,
    dialog = document.querySelector("x-dialog"),
    countrycodes = {};
  renderSelectGame();
  setupDB();
  saveSettings();
  initDefaultSettings();

  // renderer process

  countrycodes = {
    'Slovensko': 'SVK',
    'Rusko': 'RUS',
    'USA': 'USA',
    'JAR': 'JAR',
    'Austrália': 'AUS',
    'Čína': 'CHN',
    'Japonsko': 'JPN',
    'Veľká_Británia': 'GBR',
    'Kanada': 'CAN',
    'Brazília': 'BRA',
    'Mexiko': 'MEX',
    'India': 'IND',
    'Irán': 'IRN',
    'Venezuela': 'VEN',
    'Francúzsko': 'FRA'
  }

  function saveSettings() {
    var doc = {
      year: 0,
      phase: 0,
      name: 'settings',
      pocetkrajin: 15,
      pocetrokov: 5,
      zoznamKrajin: [
        'Slovensko',
        'Rusko',
        'USA',
        'JAR',
        'Austrália',
        'Čína',
        'Japonsko',
        'Veľká_Británia',
        'Kanada',
        'Brazília',
        'Mexiko',
        'India',
        'Irán',
        'Venezuela',
        'Francúzsko'
      ],
      fazy: [{
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
        text: 'Nad niektorými územiami sa objavili mimozemské taniere a pustošia ľudské obydlia.',
        secret: 'Objavili sa mimozemské lode a drancujú tieto územia: Ekvádor / Etiópia / Mongolsko. Na každom území je 5 ich armády a 2 mimozemské AK'
      }, {
        title: 'Mimozemská základňa',
        text: 'Tajný agent v službách jej veličenstva odhalil v Poľsku základňu mimozemšťanov. Rolex uviedol na trh novú kolekciu náramkových hodiniek.',
        secret: 'V Poľsku sa objavila základňa mimozemšťanov. Je tam 24 mimozemských armád a 6 mimozemských AK.'
      }, {
        title: 'Pád UFO a Mimozemské útoky',
        text: 'V Egypte sa zrútilo mimozemské UFO. Podľa zaručených zdrojov túto haváriu spôsobili Chemtrails. Mimozemšťania menia taktiku a útočia priamo na armády jednotlivých krajín.',
        secret: 'V Egypte budú k dispozícii 4 mimozemské AK. Kto (tím alebo aliancia) tam dá najviac armád získa tie karty (+ hodnota AK)'
      }, {
        title: 'Vpád mimozemšťanov',
        text: 'Nad niektorými trvalými územiami sa objavili mimozemské taniere a pustošia ľudské obydlia.',
        secret: 'Objavili sa mimozemské lode a drancujú tieto trvalé územia: Aljaška / Madagaskar / Pakistan. Na každom území je 10 ich armády a 2 mimozemské AK'
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
        title: 'Kongres OSN',
        text: 'V ponuke sú 3 AK typu Gastráče',
        secret: ''
      }, {
        title: 'Únik plánov stíhačky ALT-F4',
        text: 'V hlavnej udalosti je možné získať 4 žetóny armády',
        secret: ''
      }, {
        title: 'Nové ložiská za Uralom',
        text: 'V hlavnej udalosti je možné získať 8 ks kovu',
        secret: ''
      }, {
        title: 'Výpredaje na svetových trhoch',
        text: 'V hlavnej udalosti je možné získať 8 náhodných AK',
        secret: ''
      }, {
        title: 'Olympijske hry',
        text: 'V hlavnej udalosti je možné získať 6 AK',
        secret: ''
      }, {
        title: 'Kontakt s mimozemšťanmi',
        text: 'V hlavnej udalosti je možné získať 4 mimozemské AK',
        secret: ''
      }, {
        title: 'Olympijske hry',
        text: 'V hlavnej udalosti je možné získať 6 AK',
        secret: ''
      }, {
        title: '',
        text: '',
        secret: ''
      }]
    };

    db.settings.insert(doc, function(err, newDoc) {});
  }

  function renderSelectGame() {
    dir = fs.readdirSync('./savegame');
    var selectSavegame = "<x-select id='selectLoad'><x-menu>";
    for (var i = 0, path; path = dir[i]; i++) {
      if (path.match(".db")) {selectSavegame += "<x-menuitem name='loadGameSelect' value='"+path+"' selected='true'><x-label>"+path+"</x-label></x-menuitem>";}
    }
    selectSavegame += "</x-menu></x-select>";
    selectSavegame += "<x-button id='loadGame'><x-box><x-icon name='file-upload'></x-icon><x-label>Načítaj hru</x-label></x-box></div>";
    $('#oldGame').html(selectSavegame);
  }

  // Display Top Menu
  function createMenu() {
    var text = "";
    for (i = 1; i <= params.pocetrokov; i++) {
      text = "<li class='dropdown'>";
      text += "<a href='#' class='dropdown-toggle' data-toggle='dropdown'>Rok " + i + "<span class='caret'></span></a>";
      text += "<ul class='dropdown-menu'><li><a href='#'>Stratégia" + i + "</a></li><li><a href='#'>Diplomacia" + i + "</a></li><li><a href='#'>Boj" + i + "</a></li><li><a href='#'>Správy" + i + "</a></li></ul>";
      text += "</li>";
      $('.nav').append(text);
    }
  }
  // Setup Database
  function setupDB() {
    db.settings = new Datastore({
      //filename: path.join(__dirname, 'settings.db'),
      filename: './settings.db',
      autoload: true
    });
    db.settings.ensureIndex({
      fieldName: 'name',
      unique: true
    }, function(err) {});

  }

  function initDefaultSettings() {
    db.settings.findOne({
      name: 'settings'
    }, function(err, docs) {
      loadDefaultSettings(docs);
    });
  }

  function loadDefaultSettings(p) {
    params = p;
    checkEmptyCountries();
  }

  function initSettings() {
    db.games.findOne({
      name: 'settings'
    }, function(err, docs) {
      loadSettings(docs);
    });
  }

  function loadSettings(p) {
    params = p;
    checkEmptyCountries();
    displayPhase();
  }

  function checkEmptyCountries() {
    var text = "<x-menu>";
    if (params.zoznamKrajin.length > 0) {
      for (k of params.zoznamKrajin) {
        //text += "<option>" + k + "</option>";
        text += "<x-menuitem value=" + k +"  selected='true'><x-label>" + k + "</x-label></x-menuitem>";
      }
    }
    text += "</x-menu>";
    $('#krajiny').html(text);
  }
  // Nová hra

  function saveGameSettings() {
    db.games.insert(params, function(err, newDoc) {});
  }

  $("#submitGame").click(function() {
    $('.noGameName').hide();
    $('#novaHra').removeClass("has-error");
    if ($('#newgame').val() == "") {
      $('#novaHra').addClass("has-error");
      $('.noGameName').show();
    } else {
      newgame = true;
      currentGame = $("#newgame").val() + ".db";
      addGame();

    }
  });

  $("#loadGame").click(function() {
    if ($("#selectLoad").val() != null) {
      currentGame = $("#selectLoad").val();
      addGame();
    }
  });

  function addGame() {
    db.games = new Datastore({
      //filename: path.join(__dirname, "/savegame/" + currentGame),
      filename: "./savegame/" + currentGame,
      autoload: true
    });
    db.games.ensureIndex({
      fieldName: 'krajina',
      unique: true
    }, function(err) {});
    displayTeamSelect();
  }

  function displayTeamSelect() {
    //initSettings();
    $("#infobox").append("<div>Hra: <strong>" + currentGame + "</strong></div><div class='year'></div><div class='phase'></div>");
    //if (!newgame) { $("#startGame").text("Pokračuj v hre") };
    $("#gameControls").show();
    $("#newGameBox").hide();
    if (newgame) { saveGameSettings() } else { initSettings(); };
    //createMenu();
    //displayTeamSelect();
    displayGameSetup();
    readGame();
  };

  function startGame(country) {
    $('.noTeam').hide();
    if ($('#tabulkatimov').find("tr").length === 0) {
      $('.teamname').addClass("has-error");
      $('.noTeam').show();
    } else {
      $('#pridajTim').hide();
      $('.quest-box').show();
      $('.points-box').show();
      $('#admin-table').find('.tools').hide();
      $('.plus').show();
      $('.minus').show();
      $('#nextPhase').show();
      $('#newsBox').show(0);
      $("#startGame").hide();
      started = true;
      let d = document.body;
      d.className += " started";
      readGame();
      createLog("SYSTEM: The Game of Worlds has started" + "\r\n");
    }
  }

  function sortGame(docs) {
    docs.sort(function(b, a) {
      return a['body'] - b['body'] || a['poradie'] - b['poradie'];
    });
    /*    let x = docs.length - 1;
    if (docs.length != 0) {
      sort = docs[x]['poradie'];
    }*/
    return docs;
  }

  function readGame() {
    db.games.find({
      game: currentGame
    }, function(err, docs) {
      var text = "";

      docs = sortGame(docs);

      ipc.send('transferCurrentGame', docs);
      for (var i = 0, k; k = docs[i]; i++) {
        if (k['body'] == null) {
          k['body'] = 0;
        }
        if (k['ulohy'] == null) {
          k['ulohy'] = 0;
        }
        if (k['poradie'] == null) {
          k['poradie'] = 0;
        }
        text += "<tr id=" + k['krajina'] + "><td class='nazovkrajiny'>" + k['krajina'] + "</td><td class='tim'>" + k['tim'] + "</td><td class='body'>" + k['body'] + "</td><td class='ulohy'>" + k['ulohy'] + "</td>";
        if (started) {
          text += "<td class='points-box'><x-numberinput value='0' class='year-variable rozdiel'><x-stepper></x-stepper></x-numberinput></td>";
          //text += "<td class='points-box'><x-buttons tracking='-1'><x-button class='plus'><x-icon name='add-circle'></x-icon></x-button><span class='year-variable rozdiel'>0</span><x-button class='minus'><x-icon name='remove-circle'></x-icon></x-button></x-buttons></td>";
          //text += "<td class='quest-box'><x-buttons tracking='-1'><x-button class='quest-add'><x-icon name='add-circle-outline'></x-icon></x-button><span class='year-variable noveulohy'>0</span><x-button class='quest-remove'><x-icon name='remove-circle-outline'></x-icon></x-button></x-buttons></td>";
          text += "<td class='quest-box'><x-numberinput value='0' class='year-variable noveulohy'><x-stepper></x-stepper></x-numberinput></td>";
        } else {
          text += "<td class='tools delete'><x-button class='delete danger'><x-box><x-icon name='delete-forever'></x-icon><x-label>Vymaž</x-label></x-box></x-button></td>";
        }
        text += "<td class='tools sort'><x-numberinput class='sortinput' value='" + k['poradie'] + "'></x-numberinput></td>";
        text += "</tr>";
      }
      $("#tabulkatimov").html(text);

    });
    if (!started) {db.games.update({ name: 'settings' }, { $set: { zoznamKrajin: params.zoznamKrajin } }, { multi: true }, function(err, numReplaced) {});}
    displayStats();
  }

  function displayGameSetup() {
    $('#pridajTim').show(0);
    $('#gameTables').show(0);
  }

  // Pridávanie bodov
/* DEPRECATED AFTER MIGRATION TO XEL

  $("table").delegate(".minus", "click", function() {
    var rozdiel = parseInt($(this).closest('td').find('.rozdiel').text(), 10);
    --rozdiel;
    $(this).closest('td').find('.rozdiel').text(rozdiel);
  });
  $("table").delegate(".plus", "click", function() {
    var rozdiel = parseInt($(this).closest('td').find('.rozdiel').text(), 10);
    ++rozdiel;
    $(this).closest('td').find('.rozdiel').text(rozdiel);
  });

  // Pridávanie splnených úloh

  $("table").delegate(".quest-remove", "click", function() {
    var rozdiel = parseInt($(this).closest('td').find('.noveulohy').text(), 10);
    --rozdiel;
    $(this).closest('td').find('.noveulohy').text(rozdiel);
  });
  $("table").delegate(".quest-add", "click", function() {
    var rozdiel = parseInt($(this).closest('td').find('.noveulohy').text(), 10);
    ++rozdiel;
    $(this).closest('td').find('.noveulohy').text(rozdiel);
  });
*/
  // Odoberanie tímov

  $("table").delegate(".delete", "click", function() {
    let k = $(this).closest('tr').attr('id');
    db.games.remove({
      krajina: k
    }, {}, function(err, numRemoved) {});

    let index = params.zoznamKrajin.indexOf(k);
    if (index < 0) {
      params.zoznamKrajin.push(k)
    }
    checkEmptyCountries();
    readGame();
  });

  // Pridávanie tímov

  $("#submitTim").click(function() {
    if ($('#krajiny').val() != null) {
      submitAddTeam();
    }
  });

  function submitAddTeam() {
    $('.noTeamName').hide();
    $('.teamname').removeClass("has-error");
    if ($('#tim').val() == "") {
      $('.noTeamName').show();
      $('.teamname').addClass("has-error");
    } else {
      --sort;
      addTeam($('#krajiny').val(), $('#tim').val(), sort);
      let index = params.zoznamKrajin.indexOf($('#krajiny').val());
      if (index > -1) {
        params.zoznamKrajin.splice(index, 1);
      }
      checkEmptyCountries();
      readGame();
    }
  }



  function addTeam(country, team, rank) {
    var doc = {
      datum: new Date(),
      game: currentGame,
      krajina: country,
      tim: team,
      poradie: rank,
      body: 0,
      kola: []
    };
    db.games.insert(doc, function(err, newDocs) {});
  }

  // Posúvanie herných fáz

  $("#nextPhase").click(function() {
    changePhase();
  });
  $("#startGame").click(function() {
    startGame();
  });

  function savePoints() {
    $('#admin-table > tbody  > tr').each(function() {
      let curr = parseInt($(this).children('.body').text(), 10);
      let next = parseInt($(this).children('.points-box').find('.rozdiel').val(), 10);
      let ulohy = parseInt($(this).children('.ulohy').text(), 10);
      let noveulohy = parseInt($(this).children('.quest-box').find('.noveulohy').val(), 10);
      let varporadie = parseFloat($(this).find('.sortinput').val());
      updateTeam($(this).attr('id'), curr, next, ulohy, noveulohy, varporadie);
    });
  };

  function updateTeam(country, points, rozdiel, quests, noveulohy, varporadie) {
    //  if (params.year == 0) {x = rozdiel + (varporadie / 100); } else { x = rozdiel + (varporadie / 100); }

    x = rozdiel + (varporadie / 100);
    spolubody = points + rozdiel;
    spolumisie = quests + noveulohy;
    db.games.update({ krajina: country }, { $set: { body: spolubody, ulohy: spolumisie, poradie: x }, $push: { kola: rozdiel } }, { multi: true }, function(err, numReplaced) {

      createLog("POINTS CHANGED: Points " + points + " + "+ rozdiel + " = " + spolubody + " Missions " + quests + " + "+ noveulohy + " = " + spolumisie + " (" + country + ")\r\n");
      readGame();
    });
    //endRound(country, points, rozdiel);                                       // SLEDOVAŤ ČI TO NEPRINIESLO NEJAKÝ PROBLÉM
  }

  function endRound(country, points, rozdiel) {
    //db.games.update({ krajina: country }, { $push: { kola: rozdiel } }, {}, function() {});
  }

  function changePhase() {

    if (params.year > 8) { displayPhase() } else {
      let y = params.pocetrokov - 1;
      let n = params.fazy.length - 1;
      /*let year = params.year;
      let phase = params.phase;*/
      if (params.phase == n - 1) { savePoints(); }
      if (params.phase == n) {
        params.phase = 0;
        params.year += 1;

      } else { params.phase++; }
      db.games.update({ name: 'settings' }, { $set: { year: params.year, phase: params.phase } }, { multi: true }, function(err, numReplaced) {});
      displayPhase();
      displaySpravy();
      createLog("PHASE CHANGED: Year = " + params.year + ", Phase = " + params.phase + "\r\n");
    }
  }

  function displaySpravy() {
    let curr, past, future;
    let year = params.year;
    let phase = params.phase;
    curr = "<div class='newsArticle'><h4>" + params.worldEvents[year].title + "</h4><p>" + params.worldEvents[year].text + "</p></div><div class='newsArticle'><h4>" + params.ufoEvents[year].title + "</h4><p>" + params.ufoEvents[year].text + "</p></div>";
    if (year != 0) { past = "<div class='newsArticle'><h4>" + params.worldEvents[year - 1].title + "</h4><p>" + params.worldEvents[year - 1].text + "</p></div><div class='newsArticle'><h4>" + params.ufoEvents[year - 1].title + "</h4><p>" + params.ufoEvents[year - 1].text + "</p></div>"; }
    if (year < params.pocetrokov - 1) { future = "<div class='newsArticle'><h4>" + params.worldEvents[year + 1].title + "</h4><p>" + params.worldEvents[year + 1].text + "</p></div><div class='newsArticle'><h4>" + params.ufoEvents[year + 1].title + "</h4><p>" + params.ufoEvents[year + 1].text + "</p></div>"; }
    $('.currNews').html(curr);
    $('.pastNews').html(past);
    $('.futNews').html(future);
    ipc.send('transferNews', curr);
  }

  function displayPhase() {
    let n = params.pocetrokov - 1;
    let y = params.year + 1;
    let p = params.phase;
    if (p == -1) {} else {
      ipc.send('transferPhase', y, params.fazy[p], params.pocetrokov);
      $('.year').html("Rok " + y);
      $('.phase').html(params.fazy[p].title);
      if (params.year > n) { endGame(); }
    }
  }

  function displayStats() {
    db.games.find({
      game: currentGame
    }, function(err, docs) {
      var text = "";

      docs = sortGame(docs);
      for (var i = 0, k; k = docs[i]; i++) {
        if (k['body'] == null) {
          k['body'] = 0;
        }
        if (k['ulohy'] == null) {
          k['ulohy'] = 0;
        }
        if (k['poradie'] == null) {
          k['poradie'] = 0;
        }
        text += "<tr id=" + k['krajina'] + "><td class='nazovkrajiny'>" + k['krajina'] + "</td><td class='tim'>" + k['tim'] + "</td>"
        for (n = 0; n < params.pocetrokov; n++) {
          text += "<td class='" + n + "'>"
          if (k['kola'][n] != null) { text += k['kola'][n] };
          text += "</td>";
        }
        text += "<td class='body'>" + k['body'] + "</td><td class='ulohy'>" + k['ulohy'] + "</td>";
        text += "</tr>";
      }
      $("#statistikatimov").html(text);

    });
  }

  function endGame() {
    savePoints();
    $('#right-4').html("<h2>Koniec hry</h2>");
    $('#nextPhase').hide();
    $('.year').text("Koniec hry");
    $('.phase').text("");
  }

  /* Logovanie udalostí */

  function createLog(text){
    var file = fs.openSync("savegame/"+currentGame.slice(0, -3)+".log", 'a');
    fs.writeFile(file, text, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The log was saved!");
  });
  }

/* Krok späť */

  function stepBack(){
    if (params.year > params.pocetrokov) { displayPhase() } else {
      let y = params.pocetrokov - 1;
      let n = params.fazy.length - 1;
      /*let year = params.year;
      let phase = params.phase;*/
      if (params.phase == 3) { revertPoints(); } // Not working yet
      if (params.phase == 0) {
        params.phase = 3;
        params.year -= 1;

      } else { params.phase--; }
      db.games.update({ name: 'settings' }, { $set: { year: params.year, phase: params.phase } }, { multi: true }, function(err, numReplaced) {});
      displayPhase();
      displaySpravy();
      createLog("PHASE CHANGED: Year = " + params.year + ", Phase = " + params.phase + "\r\n");
  }
}
function revertPoints(){
    /* $('#stats-table > tbody  > tr').each(function() {
      let curr = parseInt($(this).children('.body').text(), 10);
      let next = parseInt($(this).children('.'+(params.year-1)).children('.rozdiel').text(), 10);
      updateTeam($(this).attr('id'), curr, (0-next), 0,0,0);
    }); */
}

  $("#statsTab").click(function() {
    displayStats();
    $('#admin-table').hide();
    $('#gow-options').hide();
    $('#stats-table').show();
  });
  $("#gameTab").click(function() {
    displayStats();
    $('#admin-table').show();
    $('#gow-options').hide();
    $('#stats-table').hide();
  });
  $("#optionsTab").click(function() {
    displayStats();
    $('#admin-table').hide();
    $('#gow-options').show();
    $('#stats-table').hide();
  });
  $("#stepBack").click(function() {
    stepBack();
  });

  $("#fullscreenBtn").click(function() {
    ipc.send('toggleFullscreen');
  });
  $("#rulesBtn").click(function() {
    ipc.send('toggleRules');
  });
  $("#projectorBtn").click(function() {
    ipc.send('toggleProjector');
  });
  ipc.on('quitModal', (event) => {
    //renderTable(arg);
    dialog.opened = true;
  });
  $("#reallyQuit").click(function() {
    ipc.send('reallyQuit');
  });
  $("#doNotQuit").click(function() {
    dialog.opened = false;
  });

  ipc.on('projectorSwitch', (event, x) => {
    //if (x) { $("#projectorBtn").text('Vypni projekciu') } else $("#projectorBtn").text('Spusti projekciu')
    // Opraviť Toggle pri manuálnom vypnutí projekcie
  });
});
