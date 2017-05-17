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
    over10 = false,
    sort = 0,
    newgame = false,
    started = false,
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
      phase: -1,
      name: 'settings',
      pocetkrajin: 15,
      pocetrokov: 8,
      krajiny10: [
        'Slovensko',
        'Rusko',
        'USA',
        'JAR',
        'Austrália',
        'Čína',
        'Japonsko',
        'Veľká_Británia',
        'Kanada',
        'Brazília'
      ],
      krajiny16: [
        'Mexiko',
        'India',
        'Irán',
        'Venezuela',
        'Francúzsko'
      ],
      fazy: [{
        title: 'Rozkladanie armád',
        text: 'Generáli, presuňte sa k strategickej mape. budete rozkladať svoje armády.'
      }, {
        title: 'Diplomacia',
        text: 'Generáli, presuňte sa naspäť k vláde. Je čas vyjednávať s ostatnými krajinami.'
      }, {
        title: 'Vyhodnotenie bojov',
        text: 'Generáli, presuňte sa naspäť k strategickej mape. Teraz sa rozhodne o budúcnosti sveta.'
      }, {
        title: 'Koniec roka',
        text: 'Počúvajte, čo ste sa o svojej vláde dočítali v zapredaných médiách.'
      }],
      ufoEvents: [{
        title: 'Vpád mimozemšťanov',
        text: 'Nad Škandináviou a Čile sa objavili mimozemské taniere a pustošia ľudské obydlia.',
        secret: 'Objavili sa mimozemské lode a drancujú tieto územia: Škandinávia a Čile. Na každom území je 10 ich armády a 2 mimozemské AK'
      }, {
        title: 'Pád UFO',
        text: 'V Egypte sa zrútilo mimozemské UFO. Podľa zaručených zdrojov túto haváriu spôsobili Chemtrails.',
        secret: 'V Egypte budú k dispozícii 4 mimozemské AK. Kto (tím alebo aliancia) tam dá najviac armád získa tie karty (+ hodnota AK)'
      }, {
        title: 'Hyperinflácia',
        text: 'Mimozemšťania infiltrovali medzinárodný menový fond. Svetové meny padajú. Všetky ceny sa na toto kolo zdvojnásobili.',
        secret: 'Všetky ceny sa na toto kolo zdvojnásobili.'
      }, {
        title: 'Vpád mimozemšťanov',
        text: 'Nad Aljaškou a Indonéziou sa objavili mimozemské taniere a pustošia ľudské obydlia.',
        secret: 'Objavili sa mimozemské lode a drancujú tieto územia: Aljaška a Indonéziu. Na každom území 10 armády a 2 mimozemské AK.'
      }, {
        title: 'Mimozemská základňa',
        text: 'Nemenovaný tajný agent v službách jej veličenstva odhalil v Kongu základňu mimozemšťanov. Rolex uviedol na trh novú kolekciu náramkových hodiniek.',
        secret: 'V Kongu sa objavila základňa mimozemšťanov. Je tam 24 mimozemských armád a 4 mimozemské AK '
      }, {
        title: 'Mimozemšťania zničili GPS satelity',
        text: 'Mimozemšťania zničili satelity pre GPS. V uliciach miest vypukli masové nepokoje hráčov Pokemon GO. Stúpol predaj Sudoku. Celé kolo nie je možné použiť AK "Zelení turisti" a "Príhovor kapitána D."',
        secret: 'Celé kolo nie je možné použiť AK "Zelení turisti" a "Príhovor kapitána D."'
      }, {
        title: 'Útok na domovské zeme',
        text: 'Mimozemšťania útočia na domovské krajiny a všade zanechávajú spúšť. ',
        secret: 'Mimozemšťania útočia na domovské krajiny. Hráči majú na výber - Buď nechajú doma tri armády alebo nedostanú ďalšie kolo žiadne zdroje z domovských krajín'
      }, {
        title: 'Mimozemské útoky',
        text: 'Mimozemšťania menia taktiku a útočia priamo na armády jednotlivých krajín. ',
        secret: 'Mimozemšťania sa silou 8 zapoja do troch náhodných bojov (ich armáda sa pridá po rozdaní žétonov hráčov v strategickej fáze). Ak budú mimozemšťania porazení, budú tam 2 mimozemské AK'
      }, {
        title: 'Vpád mimozemštanov',
        text: 'Nad Alžírskom a Západným Sibírom sa objavili mimozemské taniere a pustošia ľudské obydlia.',
        secret: 'Objavili sa mimozemské lode a drancujú tieto územia: Alzirsko a Západný Sibír. Na každom území 10 armády a 2 mimozemské AK'
      }, {
        title: 'Mimozemská infiltrácia',
        text: 'Mimozemšťania sa infiltrovali do tajných služieb. Celé kolo nie je možné použiť AK "Zahraničná návšteva" a "Agent Snow den"',
        secret: 'Celé kolo nie je možné použiť AK "Zahraničná návšteva" a "Agent Snowden"'
      }, {
        title: 'Epidémia pohlavných chorôb',
        text: 'U vojakov vypukla epidémia pohlavných chorôb. V tomto kole môže každý tím použiť iba 5 žetónov armády.',
        secret: 'V tomto kole môže každý tím použiť iba 5 žetónov armády.'
      }, {
        title: '',
        text: '',
        secret: ''
      }],
      worldEvents: [{
        title: 'Kongres OSN',
        text: 'V ponuke sú 4 AK typu Gastráče',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Nové ložiská na Blízkom východe',
        text: 'V hlavnej udalosti je možné získať 4 suroviny ropy',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Výpredaje na svetových trhoch',
        text: 'V hlavnej udalosti je možné získať 8 náhodných AK',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Nové náleziská v Kanade',
        text: 'V hlavnej udalosti je možné získať 4 suroviny kovu',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Únik plánov stíhačky F4-ALT',
        text: 'V hlavnej udalosti je možné získať 4 žetóny armády',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Olympijske hry',
        text: 'V hlavnej udalosti je možné získať 6 AK',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Čierny trh',
        text: 'V hlavnej udalosti je možné získať 4 mimozemské AK',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Povýšenie na kapitána',
        text: 'V hlavnej udalosti je možnosť pre štyri tímy získať 8 bodov',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Kontakt s mimozemšťanmi',
        text: 'V hlavnej udalosti je možné získať 4 mimozemské AK.',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Najlepší tajný agent',
        text: 'V hlavnej udalosti je možné získať 4 špeciálne karty "Austin Powers"',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: 'Kybernetické vojny',
        text: 'V hlavnej udalosti je možné získať 8 AK',
        secret: 'Rozdávame AK typu Body+'
      }, {
        title: '',
        text: '',
        secret: ''
      }]
    };

    db.settings.insert(doc, function(err, newDoc) {});
  }

  function renderSelectGame() {
    var selectSavegame = "<label for='selectLoad' class='input-group-addon'>Nahraj staršiu hru</label><select id='selectLoad' class='form-control' size='5'>";
    dir = fs.readdirSync('./savegame');
    for (var i = 0, path; path = dir[i]; i++) {
      selectSavegame += "<option>" + path + "</option>";
    }
    selectSavegame += "</select>";
    selectSavegame += "<div class='input-group-btn'><button type='submit' id='loadGame' value='Load Game' class='btn btn-primary btn-load'>Nahraj hru</button></div>";
    $('#staraHra').html(selectSavegame);
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
    var text = "";
    if (params.krajiny10.length < 1) {
      params.krajiny10 = params.krajiny16;
      params.krajiny16 = [];
    }
    if (params.krajiny10.length > 0) {
      for (k of params.krajiny10) {
        text += "<option>" + k + "</option>";
      }
    }
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
    $("#newGameBox").html("<table class='table'><tr class='info'><td>Hra: <strong>" + currentGame + "</strong></td><td class='year'></td><td class='phase'></td></tr></table>");
    if (!newgame) { $("#startGame").text("Pokračuj v hre") };
    $("#startGame").show();
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
      $('.delete').hide();
      $('.plus').show();
      $('.minus').show();
      $('#nextPhase').show();
      $('#spravy').show(0);
      $("#startGame").hide();
      started = true;
      readGame();
    }
  }

  function readGame() {
    db.games.find({
      game: currentGame
    }, function(err, docs) {
      var text = "";
      docs.sort(function(a, b) {
        return a['poradie'] - b['poradie'];
      });
      docs.sort(function(a, b) {
        return b['body'] - a['body'];
      });
      let x = docs.length - 1;
      if (docs.length != 0) {
        sort = docs[x]['poradie'];
      }
      ipc.send('transferCurrentGame', docs);
      for (var i = 0, k; k = docs[i]; i++) {
        if (k['body'] == null) {
          k['body'] = 0;
        }
        text += "<tr id=" + k['krajina'] + "><td class='nazovkrajiny'>" + k['krajina'] + "</td><td class='tim'>" + k['tim'] + "</td><td class='body'>" + k['body'] + "</td><td class='rozdiel'>0</td>";
        text += "<td><div class='btn-group'><button type='button' class='plus btn btn-success'>+</button><button type='button' class='minus btn btn-warning'>-</button></div></td>";
        if (!started) text += "<td><button type='button' class='delete btn btn-danger'>Vymaž</button></td>";
        text += "</tr>";
      }
      $("#tabulkatimov").html(text);

    });
    db.games.update({ name: 'settings' }, { $set: { krajiny10: params.krajiny10, krajiny16: params.krajiny16 } }, { multi: true }, function(err, numReplaced) {});
  }

  function displayGameSetup() {
    $('#pridajTim').show(0);
    $('#hrajuceTimy').show(0);
  }

// Pridávanie bodov

  $("table").delegate(".minus", "click", function() {
    var rozdiel = parseInt($(this).closest('tr').children('.rozdiel').text(), 10);
    --rozdiel;
    $(this).closest('tr').children('.rozdiel').text(rozdiel);
  });
  $("table").delegate(".plus", "click", function() {
    var rozdiel = parseInt($(this).closest('tr').children('.rozdiel').text(), 10);
    ++rozdiel;
    $(this).closest('tr').children('.rozdiel').text(rozdiel);
  });

// Odoberanie tímov

  $("table").delegate(".delete", "click", function() {
    let k = $(this).closest('tr').attr('id');
    db.games.remove({
      krajina: k
    }, {}, function(err, numRemoved) {});

    let index = params.krajiny10.indexOf(k);
console.log(params.krajiny10);
console.log(index);
    if (index < 0) {
      params.krajiny10.push(k)
    }
    console.log(params.krajiny10);
    console.log(index);
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
      ++sort;
      addTeam($('#krajiny').val(), $('#tim').val(), sort);
      let index = params.krajiny10.indexOf($('#krajiny').val());
      if (index > -1) {
        params.krajiny10.splice(index, 1);
      }
      console.log(params.krajiny10);
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
      let next = parseInt($(this).children('.rozdiel').text(), 10);
      updateTeam($(this).attr('id'), curr, next);
    });
  };

  function updateTeam(country, points, rozdiel) {
    db.games.update({ krajina: country }, { $set: { body: points + rozdiel } }, { multi: true }, function(err, numReplaced) {
      // numReplaced = 3
      // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
      readGame();
    });
    endRound(country, points, rozdiel);
  }

  function endRound(country, points, rozdiel) {
    db.games.update({ krajina: country }, { $push: { kola: rozdiel } }, {}, function() {});
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
    }
  }

  function displaySpravy() {
    let curr, past, future;
    let year = params.year;
    let phase = params.phase;
    curr = "<div class='sprava'><h4>" + params.worldEvents[year].title + "</h4><p>" + params.worldEvents[year].text + "</p></div><div class='sprava'><h4>" + params.ufoEvents[year].title + "</h4><p>" + params.ufoEvents[year].text + "</p></div>";
    if (year != 0) { past = "<div class='sprava'><h4>" + params.worldEvents[year - 1].title + "</h4><p>" + params.worldEvents[year - 1].text + "</p></div><div class='sprava'><h4>" + params.ufoEvents[year - 1].title + "</h4><p>" + params.ufoEvents[year - 1].text + "</p></div>"; }
    if (year != params.pocetrokov - 1) { future = "<div class='sprava'><h4>" + params.worldEvents[year + 1].title + "</h4><p>" + params.worldEvents[year + 1].text + "</p></div><div class='sprava'><h4>" + params.ufoEvents[year + 1].title + "</h4><p>" + params.ufoEvents[year + 1].text + "</p></div>"; }
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
      ipc.send('transferPhase', y, params.fazy[p]);
      $('.year').html("Rok " + y);
      $('.phase').html(params.fazy[p].title);
      if (params.year > n) { endGame(); }
    }
  }

  function endGame() {
    savePoints();
    $('#right-4').html("<h2>Koniec hry</h2>");
    $('#nextPhase').hide();
    $('.year').text("Koniec hry");
    $('.phase').text("");
  }

  $("#fullscreenBtn").click(function() {
    ipc.send('setFullscreen', sort);
  });
});
