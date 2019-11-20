// Mixing jQuery and Node.js code in the same file? Yes please!
  var gowConsole = (function() {
    const importLazy = require('import-lazy')(require);
    const path = importLazy('path');
    const url = importLazy('url');
    const fs = importLazy('fs');
    const ms = importLazy('mustache');
    const mousetrap = importLazy('mousetrap');
    const settings = require('electron').remote.require('electron-settings');
    var ipc = require('electron').ipcRenderer,
      currentGame,
      scenario,
      Datastore = require('nedb'),
      db = {},
      params = {},
      sort = 99,
      newgame = false,
      started = false,
      dialog = document.getElementsByTagName("dialog")[0];

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
    var tplSelectScenario = `
  <x-menu>
  {{#paths}}
    <x-menuitem name = 'scenarioItems'  value = '{{.}}'  selected = 'true' >
      <x-label>{{.}}</x-label>
    </x-menuitem>
    {{/paths}}
    </x-menu>
`;
    var tplCountryDropdown = `
    <x-menu>
    {{#countries}}
      <x-menuitem value='{{code}}' {{disabled}} selected='{{selected}}' class='{{code}}'>
        <x-label>{{country}}</x-label>
      </x-menuitem>
      {{/countries}}
    </x-menu>
  `;
    var tplCountryTable = `
  {{#countries}}
    <tr id='{{krajina}}' class="countryLine {{striped}}">
      <td class='nazovkrajiny center'> {{nicename}} </td>
      <td class='tim center'> {{tim}} </td>
      <td class='body center'> {{points}} </td>
      <td class='ulohy center'> {{quests}} </td>
      <td class='points-box afterstart center'><x-numberinput value='0' class='year-variable rozdiel'><x-stepper></x-stepper></x-numberinput></td>
      <td class='quest-box afterstart center'><x-numberinput value='0' class='year-variable noveulohy'><x-stepper></x-stepper></x-numberinput></td>
      <td class='tools delete center beforestart'><x-button class='delete danger'><x-box><x-icon name='delete-forever'></x-icon><x-label>Vymaž</x-label></x-box></x-button></td>
      <td class='tools sort center beforestart'><x-numberinput class='sortinput' value=' {{poradie}}'></x-numberinput></td>
    </tr>
    {{/countries}}
  `;
    var tplNews = `
    {{#worldEvent}}
      <div class='newsArticle' title='{{secret}}'>
        <h4>{{title}}</h4>
        <p>{{text}}</p>
      </div>
    {{/worldEvent}}
    {{#ufoEvent}}
      <div class='newsArticle' title='{{secret}}'>
        <h4>{{title}}</h4>
        <p>{{text}}</p>
      </div>
    {{/ufoEvent}}
  `;
    var tplCountryStats = `
  {{#countries}}
    <tr id='{{krajina}}' class="{{striped}}">
      <td class='nazovkrajiny center'> {{nicename}} </td>
      <td class='tim center'> {{tim}} </td>
      {{#rounds}}
          <td class='ulohy center'> {{.}} </td>
      {{/rounds}}
      <td class='body center'> {{points}} </td>
      <td class='body center'> {{quests}} </td>
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
      <x-box class="fullwidth">
      {{#clock}}
      <x-box>
        <x-label>Krátka porada (min)</x-label>
        <x-numberinput id='pauseClockOpt' skin='flat' min='0' step='0.50' value='{{pause}}'>
        <x-stepper></x-stepper>
        </x-numberinput>
      </x-box>
      <x-box>
        <x-label>Diplomacia (min)</x-label>
        <x-numberinput id='diplomacyClockOpt' skin='flat' min='0' step='0.50' value='{{diplomacy}}'>
        <x-label>Dlhé časovače</x-label>
        <x-stepper></x-stepper>
        </x-numberinput>
      </x-box>
      <x-box>
        <x-label>Pauza (min)</x-label>
        <x-numberinput id='briefClockOpt' skin='flat' min='0' step='0.50' value='{{brief}}'>
        <x-label>Dlhé časovače</x-label>
        <x-stepper></x-stepper>
        </x-numberinput>
      </x-box>
      {{/clock}}
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
    <x-box id='ufoEvent-{{! i}}' class='optHorizontalBox ufoEventsLine'>
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
    <x-box id='worldEvent-{{! i}}' class='optHorizontalBox worldEventsLine'>
      <x-label>{{! i}}</x-label>
      <x-textarea name='worldEventsOpt' id='worldTitle-{{! i}}' class='title tableInput' value='{{title}}'></x-textarea>
      <x-textarea name='worldEventsOpt' id='worldText-{{! i}}' class='text tableInput' value='{{text}}'></x-textarea>
      <x-textarea name='worldEventsOpt' id='worldSecret-{{! i}}' class='secret tableInput' value='{{secret}}'></x-textarea>
    </x-box>
    {{/worldEvents}}
  </x-box>

  <!-- countries Settings -->
  <h3>Krajiny</h3>
  <x-box vertical id='countriesOpt'>
    <x-box class='optHorizontalBox tableHeader'>
      <x-label name='countriesOpt' class='title'>Krajina</x-label>
      <x-label name='countriesOpt' class='text'>Kód krajiny</x-label>
      <x-label name='countriesOpt' class='secret'>Špeciálna schopnosť</x-label>
    </x-box>
    {{#countries}}
    <x-box id='country-{{code}}' class='optHorizontalBox countryLine'>
      <x-label>{{code}}</x-label>
      <x-label>{{country}}</x-label>
      <x-textarea name='countriesOpt' id='countriesDesc-{{code}}' class='secret tableInput' value='{{desc}}'></x-textarea>
    </x-box>
    {{/countries}}
  </x-box>

  <!-- Phases Settings -->
  <h3>Fázy kola</h3>
  <x-box vertical id='phasesOpt'>
    <x-box class='optHorizontalBox tableHeader'>
      <x-label name='ufoEventsOpt' class='title'>Názov</x-label>
      <x-label name='ufoEventsOpt' class='text'>Text na projekciu</x-label>
    </x-box>
    {{#phases}}
    <x-box id='phase-{{ n }}' class='optHorizontalBox phasesLine'>
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
      let dir = fs.readdirSync(path.resolve(__dirname, 'savegame'));
      for (let i in dir) {
        if (path.extname(dir[i]) != ".db") {
          dir.splice(i, 1);
        }
      }
      let selectSavegame = ms.render(tplSelectGame, {
        "paths": dir
      });
      document.getElementById("oldGame").innerHTML = selectSavegame;

      let dirScenario = fs.readdirSync(path.resolve(__dirname, 'scenarios'));
      let scenarios = [];
      for (let i = 0; i < dirScenario.length; i++) {
        if (path.extname(dirScenario[i]) == ".json") {
          //dirScenario.splice(i, 1);
          scenarios.push(dirScenario[i]);
        }
      }
      selectSavegame = ms.render(tplSelectScenario, {
        "paths": scenarios
      });
      document.getElementById("selectScenario").innerHTML = selectSavegame;
    }


    // Setup Database
    function setupSettings() {
      if (!settings.has("name")) {
        ipc.send('saveDefaultSettings');
      }
      loadSettings(settings.getAll());
    }

    function saveGameSettings() {
      db.games.insert(params, function(err, newDoc) {
        loadGameSettings();
      });
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

    function getCountryObject(code) {
      console.log("Text " + code)
      for (k in params.countryCodes) {
        //console.log(params.countryCodes[k]);
        if (params.countryCodes[k].code == code) {
          console.log("Fine");
          return params.countryCodes[k];
        } else {
          console.log("Not Finene");
          return null;
        }
      }
    }

    //console.log(this); console.log(params.countryCodes[this].country);

    function checkEmptyCountries() {
      var first = true;
      var text = ms.render(tplCountryDropdown, {
        "countries": params.countryList,
        "code": function() {
          return this;
        },
        "country": function() {
          return params.countryCodes[this].country
        },
        "disabled": function() {
          if (params.countryCodes[this].playing) {
            return "disabled";
          } else return "";
        },
        "selected": function() {
          if (!params.countryCodes[this].playing && first) {
            let first = false;
            return "true";
          } else {
            return "false";
          }
        }
      });
      document.getElementById("krajiny").innerHTML = text;
    }
    // Nová hra

    document.getElementById("submitGame").addEventListener("click", (e) => {
      document.getElementById('novaHra').classList.remove("has-error");
      if (document.getElementById('newgame').value == "") {
        document.getElementById('novaHra').addClass("has-error");
      } else {
        newgame = true; // TODO Dorobiť overovanie, či hra s takýmto názvom už neexistuje
        currentGame = document.getElementById("newgame").value + ".db";
        if (scenario != "") {
          scenario = document.getElementById("selectScenario").value;
        }
        addGame();
      }
    });

    document.getElementById("loadGame").addEventListener("click", (e) => {
      if (document.getElementById("selectLoad").value != null) {
        currentGame = document.getElementById("selectLoad").value;
        addGame();
      }
    });

    function addGame() {
      db.games = new Datastore({
        filename: path.resolve(__dirname, 'savegame', currentGame),
        autoload: true
      });
      db.games.ensureIndex({
        fieldName: 'krajina',
        unique: true
      }, function(err) {
        if (newgame) {
          if (scenario != "") {
            let file = fs.readFileSync(path.resolve(__dirname, 'scenarios', scenario), 'utf8');
            params = JSON.parse(file);
          }
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
        document.getElementById('pridajTim').classList.remove("hidden");
        document.getElementById('gameTables').classList.remove("hidden");
        document.getElementById("gameControls").classList.remove("hidden");
        document.getElementById("newGameBox").classList.add("hidden");
        document.getElementById('topPanelGameName').innerHTML = "Hra: <strong>" + currentGame + "</strong>";

        if (!newgame) {
          document.getElementById("startGame").getElementsByTagName("x-label")[0].textContent = "Pokračuj v hre";
        }
        readGame();
      }
    }

    function startGame(country) {
      if (document.getElementById('tabulkatimov').getElementsByTagName("TR").length === 0) {
        // TODO Show Error
      } else {
        afterStartScripts();
        mousetrap.bind(['space'], function() {
          changePhase();
        });
        mousetrap.bind(['ctrl+backspace'], function() {
          stepBack();
        });
        ipc.send('startGame');
        started = true;
        let d = document.body;
        d.classList.add("started");
        readGame();
        saveLogs("SYSTEM: The Game of Worlds has started" + "\r\n");

        let adminTable = document.getElementById("admin-table");
        adminTable.addEventListener("incrementstart", function() {
          let node = event.target.parentNode;
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
          "points": function() {
            if (this.body != null) {
              return this.body;
            } else {
              return 0;
            }
          },
          "quests": function() {
            if (this.ulohy != null) {
              return this.ulohy;
            } else {
              return 0;
            }
          },
          "nicename": function() {
            return params.countryCodes[this.krajina].country;
          },
          "striped": function() {
            if (odd) {
              odd = false;
              return "odd";
            } else {
              odd = true;
              return "even";
            }
          }
        });
        document.getElementById("tabulkatimov").innerHTML = text;
        if (started) {
          afterStartScripts();
        }
      });
      if (!started) {
        db.games.update({
          name: 'gow-settings'
        }, {
          $set: {
            countryList: params.countryList
          }
        }, {
          multi: true
        }, function(err, numReplaced) {});
      }
      displayStats();

    }

    // Odoberanie tímov
    document.getElementById("admin-table").addEventListener("click", function(e) {
      for (var target = e.target; target && target != this; target = target.parentNode) {
        // loop parent nodes from the target to the delegation node
        if (target.matches(".delete")) {
          let k = findUpTag(target, "TR").id;
          db.games.remove({
            krajina: k
          }, {}, function(err, numRemoved) {});

          let index = params.countryList.indexOf(k);
          if (index > -1) {
            params.countryCodes[k].playing = false;
            db.games.update({
              name: 'gow-settings'
            }, {
              $set: {
                countryCodes: params.countryCodes
              }
            }, {
              multi: true
            }, function(err, numReplaced) {});
          }
          checkEmptyCountries();
          readGame();
          break;
        }
      }
    }, false);

    // Pridávanie tímov

    document.getElementById("submitTim").addEventListener("click", (e) => {
      if (document.getElementById('krajiny').value != null && document.getElementById('krajiny').value != "") {
        submitAddTeam();
      }
    });

    function afterStartScripts() {
      let afterstartClass = document.getElementsByClassName("afterstart");
      for (var i = 0; i < afterstartClass.length; i++) {
        //    afterstartClass[i].classList.remove("afterstart"); // Show elements ought to be shown after start
      }
    }

    function submitAddTeam() {
      if (document.getElementById('tim').value == "") {} else {
        --sort;
        let addedCountry = document.getElementById('krajiny').value;
        addTeam(addedCountry, document.getElementById('tim').value, sort);

        let index = params.countryList.indexOf(addedCountry);
        if (index > -1) {
          params.countryCodes[addedCountry].playing = true;
          db.games.update({
            name: 'gow-settings'
          }, {
            $set: {
              countryCodes: params.countryCodes
            }
          }, {
            multi: true
          }, function(err, numReplaced) {});
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

    document.getElementById("nextPhase").addEventListener("click", (e) => {
      changePhase();
    });
    document.getElementById("startGame").addEventListener("click", (e) => {
      startGame();
    });

    function savePoints() {

      let lines = document.getElementsByClassName('countryLine');
      for (var i = 0; i < lines.length; i++) {
        let curr = parseInt(lines[i].getElementsByClassName('body')[0].textContent, 10);
        let next = parseInt(lines[i].getElementsByClassName('rozdiel')[0].value, 10);
        let ulohy = parseInt(lines[i].getElementsByClassName('ulohy')[0].textContent, 10);
        let noveulohy = parseInt(lines[i].getElementsByClassName('noveulohy')[0].value, 10);
        let varporadie = parseFloat(lines[i].getElementsByClassName('sortinput').value);
        updateTeam(lines[i].id, curr, next, ulohy, noveulohy, varporadie);
      };
    }

    function updateTeam(country, points, rozdiel, quests, noveulohy, varporadie) {
      //  if (params.year == 0) {x = rozdiel + (varporadie / 100); } else { x = rozdiel + (varporadie / 100); }

      let x = rozdiel + (varporadie / 100),
        spolubody = points + rozdiel,
        spolumisie = quests + noveulohy;
      db.games.update({
        krajina: country
      }, {
        $set: {
          body: spolubody,
          ulohy: spolumisie,
          poradie: x
        },
        $push: {
          kola: rozdiel
        }
      }, {
        multi: true
      }, function(err, numReplaced) {

        saveLogs("POINTS CHANGED: Points " + points + " + " + rozdiel + " = " + spolubody + " Missions " + quests + " + " + noveulohy + " = " + spolumisie + " (" + country + ")\r\n");
        readGame();
      });
      //endRound(country, points, rozdiel);                                       // SLEDOVAŤ ČI TO NEPRINIESLO NEJAKÝ PROBLÉM
    }

    function endRound(country, points, rozdiel) {
      //db.games.update({ krajina: country }, { $push: { kola: rozdiel } }, {}, function() {});
    }

    function changePhase() {

      if (params.year > 8) {
        displayPhase();
      } else {
        let y = params.yearCount - 1;
        let n = params.phases.length - 1;
        /*let year = params.year;
        let phase = params.phase;*/
        if (params.phase == n) {
          savePoints();
        } // Tu je definované, kedy sa pripočítavajú body.
        if (params.phase == n) {
          params.phase = 0;
          params.year += 1;

        } else {
          params.phase++;
        }
        db.games.update({
          name: 'gow-settings'
        }, {
          $set: {
            year: params.year,
            phase: params.phase
          }
        }, {
          multi: true
        }, function(err, numReplaced) {});
        displayPhase();
        displaySpravy();
        saveLogs("PHASE CHANGED: Year = " + params.year + ", Phase = " + params.phase + "\r\n");
      }
    }

    function displaySpravy() {
      let curr = "",
        past = "",
        future = "";
      let year = params.year;
      let phase = params.phase;

      curr = ms.render(tplNews, {
        "worldEvent": params.worldEvents[year],
        "ufoEvent": params.ufoEvents[year]
      });
      if (year != 0) {
        past = ms.render(tplNews, {
          "worldEvent": params.worldEvents[year - 1],
          "ufoEvent": params.ufoEvents[year - 1]
        });
      }
      if (year < params.yearCount - 1) {
        future = ms.render(tplNews, {
          "worldEvent": params.worldEvents[year + 1],
          "ufoEvent": params.ufoEvents[year + 1]
        });
      }
      document.getElementById("currNews").innerHTML = curr;
      document.getElementById("pastNews").innerHTML = past;
      document.getElementById("futNews").innerHTML = future;
      ipc.send('transferNews', curr);
    }

    function displayPhase() {
      let n = params.yearCount - 1;
      let y = params.year + 1;
      let p = params.phase;
      if (p == -1) {} else {
        ipc.send('transferPhase', y, params.phases[p], params.yearCount);
        document.getElementById('topPanelYear').textContent = "Rok " + y;
        document.getElementById('topPanelPhase').textContent = params.phases[p].title;
        if (params.year > n) {
          endGame();
        }
      }
    }

    function displayStats() {
      db.games.find({
        game: currentGame
      }, function(err, docs) {
        var text = "";
        var odd = true;
        docs = sortGame(docs);
        text = ms.render(tplCountryStats, {
          "countries": docs,
          "rounds": function() {
            var rounds = [];
            for (let n = 0; n < params.yearCount; n++) {
              if (this.kola[n] != null) {
                rounds.push(this.kola[n]);
              } else {
                rounds.push("");
              }
            }
            return rounds;
          },
          "points": function() {
            if (this.body != null) {
              return this.body;
            } else {
              return 0;
            }
          },
          "nicename": function() {
            return params.countryCodes[this.krajina].country;
          },
          "quests": function() {
            if (this.ulohy != null) {
              return this.ulohy;
            } else {
              return 0;
            }
          },
          "striped": function() {
            if (odd) {
              odd = false;
              return "odd";
            } else {
              odd = true;
              return "even";
            }
          }
        });
        document.getElementById("statistikatimov").innerHTML = text;
      });
    }

    function endGame() {
      savePoints();
      document.getElementById('currNews').innerHTML = "<h2>Koniec hry</h2>";
      document.getElementById('nextPhase').style.display = "none";
      document.getElementById('topPanelYear').textContent = "Koniec hry";
      document.getElementById('topPanelPhase').textContent = "";
      saveLogs("SYSTEM: Hra skončila");
    }

    /* Krok späť */

    function stepBack() {
      document.getElementById('nextPhase').style.display = "block";
      if (params.year > params.yearCount) {
        displayPhase();
      } else {
        let y = params.yearCount - 1;
        let n = params.phases.length - 1;
        /*let year = params.year;
        let phase = params.phase;*/
        if (params.phase == 3) {
          revertPoints();
        } // Not working yet TODO Much better would be to use snapshots, than this. It would render game reviewing much better
        if (params.phase == 0) {
          params.phase = 3;
          params.year -= 1;

        } else {
          params.phase--;
        }
        db.games.update({
          name: 'gow-settings'
        }, {
          $set: {
            year: params.year,
            phase: params.phase
          }
        }, {
          multi: true
        }, function(err, numReplaced) {});
        displayPhase();
        displaySpravy();
        saveLogs("(BACK) PHASE CHANGED: Year = " + params.year + ", Phase = " + params.phase + "\r\n");
      }
    }

    function revertPoints() {}

    document.getElementById("statsTab").addEventListener("click", (e) => {
      displayStats();
      document.getElementById('admin-table').style.display = "none";
      document.getElementById('gow-options').style.display = "none";
      document.getElementById('stats-table').style.display = "block";
    });
    document.getElementById("gameTab").addEventListener("click", (e) => {
      displayStats();
      document.getElementById('admin-table').style.display = "block";
      document.getElementById('gow-options').style.display = "none";
      document.getElementById('stats-table').style.display = "none";
    });
    document.getElementById("optionsTab").addEventListener("click", (e) => {
      displayStats();
      document.getElementById('admin-table').style.display = "none";
      document.getElementById('gow-options').style.display = "block";
      document.getElementById('stats-table').style.display = "none";
    });
    document.getElementById("stepBack").addEventListener("click", (e) => {
      stepBack();
    });

    document.getElementById("fullscreenBtn").addEventListener("click", (e) => {
      ipc.send('toggleFullscreen');
    });
    document.getElementById("reloadBtn").addEventListener("click", (e) => {
      ipc.send('reloadWindows');
    });
    document.getElementById("rulesBtn").addEventListener("click", (e) => {
      ipc.send('toggleRules');
    });
    document.getElementById("projectorBtn").addEventListener("click", (e) => {
      ipc.send('toggleProjector');
    });
    ipc.on('quitModal', (event) => {
      //renderTable(arg);
      dialog.showModal();
    });
    document.getElementById("reallyQuit").addEventListener("click", (e) => {
      ipc.send('reallyQuit');
    });
    document.getElementById("doNotQuit").addEventListener("click", (e) => {
      dialog.close();
    });

    ipc.on('buttonSwitch', (event, btn, x) => { // Toggle "toggled" state of top buttons when non-click event change status
    /*  if (x) {
        document.getElementById(btn).toggled = true;
      } else document.getElementById(btn).toggled = false;*/
    });

    // Options Module
    function renderOptions() {
      //console.log(params.countryCodes);
      var text = ms.render(tplOptions, {
        "yearCount": params.yearCount,
        "clock": params.clock,
        "ufoEvents": params.ufoEvents,
        "worldEvents": params.worldEvents,
        "countries": params.countryCodes,
        "phases": params.phases,
      });
      document.getElementById("tableOpt").innerHTML = text;
    }

    // TODO - ukladanie nastavení - aj Predvolených (checkbox)
    function saveOptions() {
      params.yearCount = document.getElementById("yearCountOpt").value;
      params.clock.pause = document.getElementById("pauseClockOpt").value;
      params.clock.diplomacy = document.getElementById("diplomacyClockOpt").value;
      params.clock.brief = document.getElementById("briefClockOpt").value;

      let ufoEventsTemp = document.getElementsByClassName("ufoEventsLine").childNodes;
      for (let i in ufoEventsTemp) {
        params.ufoEvents[i].title = ufoEventsTemp[i].getElementsByClassName("title")[0].value;
        console.log(params.ufoEvents[i].title);
        params.ufoEvents[i].text = ufoEventsTemp[i].getElementsByClassName("text")[0].value;
        params.ufoEvents[i].secret = ufoEventsTemp[i].getElementsByClassName("secret")[0].value;
      }

      let worldEventsTemp = document.getElementsByClassName("worldEventsLine").childNodes;
      for (let i in worldEventsTemp) {
        params.worldEvents[i].title = worldEventsTemp[i].getElementsByClassName("title")[0].value;
        params.worldEvents[i].text = worldEventsTemp[i].getElementsByClassName("text")[0].value;
        params.worldEvents[i].secret = worldEventsTemp[i].getElementsByClassName("secret")[0].value;
      }

      let phasesTemp = document.getElementsByClassName("phasesLine").childNodes;
      for (let i in worldEventsTemp) {
        params.phases[i].text = phasesTemp[i].getElementsByClassName("text")[0].value;
      }

      db.games.remove({
        name: 'gow-settings'
      }, {}, function(err, numRemoved) {});
      db.games.insert(params, function(err, newDoc) {
        loadGameSettings();
      });

      if (document.getElementById("saveDefaultCheck").checked == true) {
        settings.setAll(params);
      }
    }

    document.getElementById("saveOpts").addEventListener("click", (e) => {
      saveOptions();
    });
    document.getElementById("reloadOpts").addEventListener("click", (e) => {
      renderOptions();
    });
    document.getElementById("setDefaultOpts").addEventListener("click", (e) => {
      loadSettings(settings.getAll());
    });


    /* Logovanie udalostí */

    function saveLocalLogs(text) {
      var file = fs.openSync(path.resolve(__dirname, 'savegame', currentGame.slice(0, -3) + ".log"), 'a');
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

    window.addEventListener('keydown', function(e) {
      if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
      }
    });


    function findUpTag(el, tag) {
      while (el.parentNode) {
        el = el.parentNode;
        if (el.tagName === tag)
          return el;
      }
      return null;
    }

  })();
