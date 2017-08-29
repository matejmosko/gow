// Mixing jQuery and Node.js code in the same file? Yes please!

$(function() {
  const path = require('path');
  const url = require('url');
  const fs = require('fs');
  const ms = require('mustache');
  const settings = require('electron').remote.require('electron-settings');
  var ipc = require('electron').ipcRenderer,
    currentGame,
    Datastore = require('nedb'),
    db = {},
    params = {},
    sort = 99,
    newgame = false,
    started = false,
    dialog = document.querySelector("x-dialog");

  //templates
  var tplSelectGame = `
    <x-select id='selectLoad'><x-menu>
    {{#paths}}
      <x-menuitem name = 'loadGameSelect'  value = '{{.}}'  selected = 'true' >
        <x-label>{{.}}</x-label>
      </x-menuitem>
      {{/paths}}
    </x-menu></x-select>
    <x-button id='loadGame'><x-box><x-icon name='file-upload'></x-icon><x-label>Načítaj hru</x-label></x-box></div>
  `;
  var tplCountryDropdown = `
    <x-menu>
    {{#countries}}
      <x-menuitem value='{{.}}' {{disabled}} selected='{{selected}}' class='{{.}}'>
        <x-label>{{nicename}}</x-label>
      </x-menuitem>
      {{/countries}}
    </x-menu>
  `;
  var tplCountryTable = `
  {{#countries}}
    <tr id='{{krajina}}' class="{{striped}}">
      <td class='nazovkrajiny center'> {{nicename}} </td>
      <td class='tim center'> {{tim}} </td>
      <td class='body center'> {{points}} </td>
      <td class='ulohy center'> {{quests}} </td>
      <td class='points-box afterstart center'><x-numberinput value='0' class='year-variable rozdiel'><x-stepper></x-stepper></x-numberinput></td>
      <td class='quest-box afterstart center'><x-numberinput value='0' class='year-variable noveulohy'><x-stepper></x-stepper></x-numberinput></td>
      <td class='tools delete center'><x-button class='delete danger'><x-box><x-icon name='delete-forever'></x-icon><x-label>Vymaž</x-label></x-box></x-button></td>
      <td class='tools sort center'><x-numberinput class='sortinput' value=' {{poradie}}'></x-numberinput></td>
    </tr>
    {{/countries}}
  `;
  var tplOptions = `
  <!-- Generat Settings -->
  <h2>Herné nastavenia</h2>
    <x-box vertical>
      <x-box>
        <x-label>Počet herných rokov</x-label>
        <x-numberinput id='yearCountOpt' skin='flat' min='1' value='{{yearCount}}'>
        <x-label>Počet rokov</x-label>
        <x-stepper></x-stepper>
        </x-numberinput>
      </x-box>
      <x-box>
        <x-label>Krátke časovače (min)</x-label>
        <x-numberinput id='shortPauseOpt' skin='flat' min='0' step='0.50' value='{{shortPause}}'>
        <x-stepper></x-stepper>
        </x-numberinput>
      </x-box>
      <x-box>
        <x-label>Dlhé časovače (min)</x-label>
        <x-numberinput id='longPauseOpt' skin='flat' min='0' step='0.50' value='{{longPause}}'>
        <x-label>Dlhé časovače</x-label>
        <x-stepper></x-stepper>
        </x-numberinput>
      </x-box>
  </x-box>

  <!-- ufoEvents Settings -->
  <h3>Mimozemské udalosti</h3>
  <x-box vertical id='ufoEventsOpt'>
    <x-box class='optHorizontalBox tableHeader'>
      <x-label name='ufoEventsOpt' class='title'>Názov</x-label>
      <x-label name='ufoEventsOpt' class='text'>Text na projekciu</x-label>
      <x-label name='ufoEventsOpt' class='secret'>Text pre nás</x-label>
    </x-box>
    {{#ufoEvents}}
    <x-box id='ufoEvent-{{! i}}' class='optHorizontalBox'>
      <x-textarea name='ufoEventsOpt' id='ufoTitle-{{! i}}' class='title tableInput' value='{{title}}'></x-textarea>
      <x-textarea name='ufoEventsOpt' id='ufoText-{{! i}}' class='text tableInput' value='{{text}}'></x-textarea>
      <x-textarea name='ufoEventsOpt' id='ufoSecret-{{! i}}' class='secret tableInput' value='{{secret}}'></x-textarea>
    </x-box>
    {{/ufoEvents}}
  </x-box>

  <!-- worldEvents Settings -->
  <h3>Hlavné udalosti</h3>
  <x-box vertical id='worldEventsOpt'>
    <x-box class='optHorizontalBox tableHeader'>
      <x-label name='worldEventsOpt' class='title'>Názov</x-label>
      <x-label name='worldEventsOpt' class='text'>Text na projekciu</x-label>
      <x-label name='worldEventsOpt' class='secret'>Text pre nás</x-label>
    </x-box>
    {{#worldEvents}}
    <x-box id='worldEvent-{{! i}}' class='optHorizontalBox'>
      <x-label>{{! i}}</x-label>
      <x-textarea name='worldEventsOpt' id='worldTitle-{{! i}}' class='title tableInput' value='{{title}}'></x-textarea>
      <x-textarea name='worldEventsOpt' id='worldText-{{! i}}' class='text tableInput' value='{{text}}'></x-textarea>
      <x-textarea name='worldEventsOpt' id='worldSecret-{{! i}}' class='secret tableInput' value='{{secret}}'></x-textarea>
    </x-box>
    {{/worldEvents}}
  </x-box>

  <!-- Phases Settings -->
  <h3>Fázy kola</h3>
  <x-box vertical id='phasesOpt'>
    <x-box class='optHorizontalBox tableHeader'>
      <x-label name='ufoEventsOpt' class='title'>Názov</x-label>
      <x-label name='ufoEventsOpt' class='text'>Text na projekciu</x-label>
    </x-box>
    {{#phases}}
    <x-box id='phase-{{ n }}' class='optHorizontalBox'>
      <x-label class='title tableLabel'>{{title}}</x-label>
      <x-textarea name='phaseOpt' id='phaseText-{{! n }}' class='text tableInput' value='{{text}}'></x-textarea>
    </x-box>
    {{/phases}}
  </x-box>
`;

  // renderer process

  renderSelectGame();
  setupSettings();

  function renderSelectGame() {
    dir = fs.readdirSync('./savegame');
    selectSavegame = ms.render(tplSelectGame, { "paths": dir });
    document.getElementById("oldGame").innerHTML = selectSavegame;
  }


  // Setup Database
  function setupSettings() {
    if (!settings.has("name")) {
      ipc.send('saveDefaultSettings');
    }
    loadSettings(settings.getAll());
  }

  function saveGameSettings() {
    db.games.insert(params, function(err, newDoc) { loadGameSettings(); });
  }

  function loadGameSettings() {
    db.games.findOne({
      name: 'gow-settings'
    }, function(err, docs) {
      loadSettings(docs);
    });
  }

  function loadSettings(p) {
    params = p;
    ipc.send('transferParams', params);
    renderOptions();
    displayPhase();
    checkEmptyCountries();
  }



  function checkEmptyCountries() {
    var first = true;
    var text = ms.render(tplCountryDropdown, {
      "countries": params.countryList,
      "nicename": function() { return params.countryCodes[this].country; },
      "disabled": function() { if (params.countryCodes[this].playing) { return "disabled"; } else return ""; },
      "selected": function() { if (!params.countryCodes[this].playing && first) { let first = false; return "true"; } else { return "false"; } }
    });
    document.getElementById("krajiny").innerHTML = text;
  }
  // Nová hra

  $("#submitGame").click(function() {
    $('.noGameName').hide();
    $('#novaHra').removeClass("has-error");
    if ($('#newgame').val() == "") {
      $('#novaHra').addClass("has-error");
      $('.noGameName').show();
    } else {
      newgame = true; // TODO Dorobiť overovanie, či hra s takýmto názvom už neexstuje
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
    }, function(err) {
      if (newgame) {
        saveGameSettings();
        displayTeamSelect();
      } else {
        loadGameSettings();
        displayTeamSelect();
      }
    });

  }

  function displayTeamSelect() {
    if (!started) {
      checkEmptyCountries();
      $('#pridajTim').show(0);
      $('#gameTables').show(0);
      $("#infobox").append("<div>Hra: <strong>" + currentGame + "</strong></div><div class='year'></div><div class='phase'></div>");
      if (!newgame) { $("#startGame").find("x-label").text("Pokračuj v hre"); }
      $("#gameControls").show();
      $("#newGameBox").hide();
      readGame();
    }
  }

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
      $(".afterstart").show();
      started = true;
      let d = document.body;
      d.className += " started";
      readGame();
      saveLogs("SYSTEM: The Game of Worlds has started" + "\r\n");

      adminTable = document.getElementById("admin-table");
      adminTable.addEventListener("incrementstart", function() {
        node = event.target.parentNode;
        if (node.value > 0) {
          event.target.parentNode.classList.add("positive");
          event.target.parentNode.classList.remove("negative");
        }
        if (node.value < 0) {
          event.target.parentNode.classList.add("negative");
          event.target.parentNode.classList.remove("positive");
        }
        if (node.value == 0) {
          event.target.parentNode.classList.remove("negative");
          event.target.parentNode.classList.remove("positive");
        }
      });
      adminTable.addEventListener("decrementstart", function() {
        node = event.target.parentNode;
        if (node.value > 0) {
          event.target.parentNode.classList.add("positive");
          event.target.parentNode.classList.remove("negative");
        }
        if (node.value < 0) {
          event.target.parentNode.classList.add("negative");
          event.target.parentNode.classList.remove("positive");
        }
        if (node.value == 0) {
          event.target.parentNode.classList.remove("negative");
          event.target.parentNode.classList.remove("positive");
        }
      });
    }
  }

  function sortGame(docs) {
    docs.sort(function(b, a) {
      return a.body - b.body || a.poradie - b.poradie;
    });
    /*    let x = docs.length - 1;
    if (docs.length != 0) {
      sort = docs[x].poradie;
    }*/
    return docs;
  }

  function readGame() {
    db.games.find({
      game: currentGame
    }, function(err, docs) {
      var text = "";

      docs = sortGame(docs);
      ipc.send('transferParams', params);
      ipc.send('transferCurrentGame', docs);
      var odd = true;
      text = ms.render(tplCountryTable, {
        "countries": docs,
        "points": function() { if (this.body != null) { return this.body; } else { return 0; } },
        "quests": function() { if (this.ulohy != null) { return this.ulohy; } else { return 0; } },
        "nicename": function() { return params.countryCodes[this.krajina].country; },
        "striped": function() { if (odd) { odd = false; return "odd"; } else { odd = true; return "even"; } }
      });
      document.getElementById("tabulkatimov").innerHTML = text;
      if (!started) { $(".afterstart").hide(); }
    });
    if (!started) { db.games.update({ name: 'gow-settings' }, { $set: { countryList: params.countryList } }, { multi: true }, function(err, numReplaced) {}); }
    displayStats();

  }

  // Odoberanie tímov

  $("table").delegate(".delete", "click", function() {
    let k = $(this).closest('tr').attr('id');
    db.games.remove({
      krajina: k
    }, {}, function(err, numRemoved) {});

    let index = params.countryList.indexOf(k);
    if (index > -1) {
      params.countryCodes[k].playing = 0;
    }
    checkEmptyCountries();
    readGame();
  });

  // Pridávanie tímov

  $("#submitTim").click(function() {
    if ($('#krajiny').val() != null && $('#krajiny').val() != "") {
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

      let index = params.countryList.indexOf($('#krajiny').val());
      if (index > -1) {
        params.countryCodes[$('#krajiny').val()].playing = 1;
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
  }

  function updateTeam(country, points, rozdiel, quests, noveulohy, varporadie) {
    //  if (params.year == 0) {x = rozdiel + (varporadie / 100); } else { x = rozdiel + (varporadie / 100); }

    x = rozdiel + (varporadie / 100);
    spolubody = points + rozdiel;
    spolumisie = quests + noveulohy;
    db.games.update({ krajina: country }, { $set: { body: spolubody, ulohy: spolumisie, poradie: x }, $push: { kola: rozdiel } }, { multi: true }, function(err, numReplaced) {

      saveLogs("POINTS CHANGED: Points " + points + " + " + rozdiel + " = " + spolubody + " Missions " + quests + " + " + noveulohy + " = " + spolumisie + " (" + country + ")\r\n");
      readGame();
    });
    //endRound(country, points, rozdiel);                                       // SLEDOVAŤ ČI TO NEPRINIESLO NEJAKÝ PROBLÉM
  }

  function endRound(country, points, rozdiel) {
    //db.games.update({ krajina: country }, { $push: { kola: rozdiel } }, {}, function() {});
  }

  function changePhase() {

    if (params.year > 8) { displayPhase(); } else {
      let y = params.yearCount - 1;
      let n = params.phases.length - 1;
      /*let year = params.year;
      let phase = params.phase;*/
      if (params.phase == n - 1) { savePoints(); }
      if (params.phase == n) {
        params.phase = 0;
        params.year += 1;

      } else { params.phase++; }
      db.games.update({ name: 'gow-settings' }, { $set: { year: params.year, phase: params.phase } }, { multi: true }, function(err, numReplaced) {});
      displayPhase();
      displaySpravy();
      saveLogs("PHASE CHANGED: Year = " + params.year + ", Phase = " + params.phase + "\r\n");
    }
  }

  function displaySpravy() {
    let curr, past, future;
    let year = params.year;
    let phase = params.phase; // TODO Prerobiť na mustache. Tu to naozaj veľmi pomôže.
    curr = "<div class='newsArticle' title='" + params.worldEvents[year].secret + "'><h4>" + params.worldEvents[year].title + "</h4><p>" + params.worldEvents[year].text + "</p></div><div class='newsArticle' title='" + params.ufoEvents[year].secret + "'><h4>" + params.ufoEvents[year].title + "</h4><p>" + params.ufoEvents[year].text + "</p></div>";
    if (year != 0) { past = "<div class='newsArticle' title='" + params.worldEvents[year - 1].secret + "'><h4>" + params.worldEvents[year - 1].title + "</h4><p>" + params.worldEvents[year - 1].text + "</p></div><div class='newsArticle' title='" + params.ufoEvents[year - 1].secret + "'><h4>" + params.ufoEvents[year - 1].title + "</h4><p>" + params.ufoEvents[year - 1].text + "</p></div>"; }
    if (year < params.yearCount - 1) { future = "<div class='newsArticle' title='" + params.worldEvents[year + 1].secret + "'><h4>" + params.worldEvents[year + 1].title + "</h4><p>" + params.worldEvents[year + 1].text + "</p></div><div class='newsArticle' title='" + params.ufoEvents[year + 1].secret + "'><h4>" + params.ufoEvents[year + 1].title + "</h4><p>" + params.ufoEvents[year + 1].text + "</p></div>"; }
    $('.currNews').html(curr);
    $('.pastNews').html(past);
    $('.futNews').html(future);
    ipc.send('transferNews', curr);
  }

  function displayPhase() {
    let n = params.yearCount - 1;
    let y = params.year + 1;
    let p = params.phase;
    if (p == -1) {} else {
      ipc.send('transferPhase', y, params.phases[p], params.yearCount);
      $('.year').html("Rok " + y);
      $('.phase').html(params.phases[p].title);
      if (params.year > n) { endGame(); }
    }
  }

  function displayStats() {
    db.games.find({
      game: currentGame
    }, function(err, docs) {
      var text = "";

      docs = sortGame(docs);
      for (var i = 0, k; !!(k = docs[i]); i++) {
        if (k.body == null) {
          k.body = 0;
        }
        if (k.ulohy == null) {
          k.ulohy = 0;
        }
        if (k.poradie == null) {
          k.poradie = 0; // TODO COnvert to mustache.
        }
        text += "<tr id=" + k.krajina + "><td class='nazovkrajiny'>" + k.krajina + "</td><td class='tim'>" + k.tim + "</td>";
        for (n = 0; n < params.yearCount; n++) {
          text += "<td class='" + n + "'>";
          if (k.kola[n] != null) { text += k.kola[n]; }
          text += "</td>";
        }
        text += "<td class='body'>" + k.body + "</td><td class='ulohy'>" + k.ulohy + "</td>";
        text += "</tr>";
      }
      $("#statistikatimov").html(text);

    });
  }

  function endGame() {
    savePoints();
    $('.currNews').html("<h2>Koniec hry</h2>");
    $('#nextPhase').hide();
    $('.year').text("Koniec hry");
    $('.phase').text("");
    saveLogs("SYSTEM: Hra skončila");
  }

  /* Krok späť */

  function stepBack() {
    $('#nextPhase').show();
    if (params.year > params.yearCount) { displayPhase(); } else {
      let y = params.yearCount - 1;
      let n = params.phases.length - 1;
      /*let year = params.year;
      let phase = params.phase;*/
      if (params.phase == 3) { revertPoints(); } // Not working yet TODO Much better would be to use snapshots, than this. It would render game reviewing much better
      if (params.phase == 0) {
        params.phase = 3;
        params.year -= 1;

      } else { params.phase--; }
      db.games.update({ name: 'gow-settings' }, { $set: { year: params.year, phase: params.phase } }, { multi: true }, function(err, numReplaced) {});
      displayPhase();
      displaySpravy();
      saveLogs("(BACK) PHASE CHANGED: Year = " + params.year + ", Phase = " + params.phase + "\r\n");
    }
  }

  function revertPoints() {}

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

  ipc.on('buttonSwitch', (event, btn, x) => { // Toggle "toggled" state of top buttons when non-click event change status
    if (x) {
      $(btn).prop("toggled", true);
    } else $(btn).prop("toggled", false);
  });

  // Options Module
  function renderOptions() {
    var text = ms.render(tplOptions, {
      "yearCount": params.yearCount,
      "shortPause": params.shortPause,
      "longPause": params.longPause,
      "ufoEvents": params.ufoEvents,
      "worldEvents": params.worldEvents,
      "phases": params.phases,
    });
    document.getElementById("tableOpt").innerHTML = text;
  }

  // TODO - ukladanie nastavení - aj Predvolených (checkbox)
  function saveOptions() {
    params.yearCount = $("#yearCountOpt").val();
    params.shortPause = $("#shortPauseOpt").val();
    params.longPause = $("#longPauseOpt").val();
    $("#ufoEventsOpt").find("x-box[id^='ufoEvent']").each(function(index) {
      params.ufoEvents[index].title = $(this).children("[id^='ufoTitle']").val();
      params.ufoEvents[index].text = $(this).children("[id^='ufoText']").val();
      params.ufoEvents[index].secret = $(this).children("[id^='ufoSecret']").val();
    });
    $("#worldEventsOpt").find("x-box[id^='worldEvent']").each(function(index) {
      params.worldEvents[index].title = $(this).children("[id^='worldTitle']").val();
      params.worldEvents[index].text = $(this).children("[id^='worldText']").val();
      params.worldEvents[index].secret = $(this).children("[id^='worldSecret']").val();
    });
    $("#phasesOpt").find("x-box[id^='phase']").each(function(index) {
      params.phases[index].text = $(this).children("[id^='phaseText']").val();
      /*  params.worldEvents[index].title = $(this).children("[id^='worldTitle']").val();
        params.worldEvents[index].text = $(this).children("[id^='worldText']").val();
        params.worldEvents[index].secret = $(this).children("[id^='worldSecret']").val();*/
    });
    db.games.remove({ name: 'gow-settings' }, {}, function(err, numRemoved) {});
    db.games.insert(params, function(err, newDoc) { loadGameSettings(); });

    if ($("#saveDefaultCheck").is(':checked')) {
      settings.setAll(params);
    }
  }

  $("#saveOpts").click(function() {
    saveOptions();
  });
  $("#reloadOpts").click(function() {
    renderOptions();
  });
  $("#setDefaultOpts").click(function() {
    loadSettings(settings.getAll());
  });


  /* Logovanie udalostí */

  function saveLocalLogs(text) {
    var file = fs.openSync("savegame/" + currentGame.slice(0, -3) + ".log", 'a');
    fs.writeFile(file, text, function(err) {
      if (err) {
        return console.log(err);
      }
    });
  }

  function saveLogs(text) {
    text = currentDate(true) + " " + text;
    console.log(text);
    saveLocalLogs(text);
    ipc.send('saveLogs', text);
  }

  /* Get Current Date for logging purposes */

  function currentDate(type = false) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    if (type) {
      today += " " + hh + ":" + min + ":" + sec;
    }
    return today;
  }

  // Display Top Menu
  /*function createMenu() {
    var text = "";
    for (i = 1; i <= params.yearCount; i++) {
      text = "<li class='dropdown'>";
      text += "<a href='#' class='dropdown-toggle' data-toggle='dropdown'>Rok " + i + "<span class='caret'></span></a>";
      text += "<ul class='dropdown-menu'><li><a href='#'>Stratégia" + i + "</a></li><li><a href='#'>Diplomacia" + i + "</a></li><li><a href='#'>Boj" + i + "</a></li><li><a href='#'>Správy" + i + "</a></li></ul>";
      text += "</li>";
      $('.nav').append(text);
    }
  }*/
});
