// Mixing jQuery and Node.js code in the same file? Yes please!

var gowProjector = (function() {
  const ipc = require('electron').ipcRenderer;
  const fs = require('fs');
  let params = {},
    current,
    started = false,
    styleChanged = false,
    timer;

  const path = require('path');
  const url = require('url');
  const ms = require('mustache');
  const settings = require('electron').remote.require('electron-settings');
  // renderer process

  ipc.on('startGame', (event) => {
    started = true;
    document.body.classList.add("started");
  });
  ipc.on('readCurrentGame', (event, arg1) => {
    renderTable(arg1);
  });
  ipc.on('readParams', (event, arg1) => {
    params = arg1;
    if (params.style != null && !styleChanged) {
      changeStyle();
      styleChanged = true;
    }
  });
  ipc.on('readNews', (event, arg) => {
    renderNews(arg);
  });
  ipc.on('transferRules', (event) => {
    document.getElementById('rules').classList.toggle("hidden");
  });
  ipc.on('readPhase', (event, year, phase, pocetrokov) => {
    renderPhase(year, phase, pocetrokov);
  });

  function changeStyle() {
    let css = fs.readFileSync(path.resolve(__dirname, 'scenarios', params.style), "utf8");
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) { // IE
      s.styleSheet.cssText = css;
    } else { // the world
      s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
  }

  function resetView() {
    document.body.classList.remove("timeisup");
    document.getElementById('overtime').classList.add("hidden");
    document.getElementById('rules').classList.add("hidden");
  }

  function renderNews(curr) {
    resetView();
    document.getElementById('currNews').innerHTML = curr;
  }

  function renderTable(docs) {
    let text;
    resetView();
    var tplProjectionFourthWorld = `
    <div class='newsArticle'>
      <h4>Pomoc štvrtému sektoru</h4>
      <p>Redakcia encyklopédie Meidaniky, Eliot T. Roszfasz a Márius Osvietený sa dohodli. Toto sú mestá, ktoré si zaslúžia pomoc: <strong>{{last}}</strong>. <br /><br /> Pomoc štvrtému sektoru poskytne nádej Severskej ríše: <strong>{{first}}</strong>.</p>
    </div>
    `;
    var tplProjectionCountryTable = `
    {{#countries}}
      <div class="{{striped}} tblCountryRow {{playing}}" id="{{krajina}}" >
        <!--<div class='tblCountryRank'></div>-->
        <div class='tblCountryTitle'><span class="tblCountryName">{{nicename}}</span><span class='tblCountryArea'> {{area}}</span></div>
        <div class='tblCountryDesc'>{{desc}}</div>
        <div class='tblCountryTeam'>{{tim}}</div>
        <div class='tblCountryPoints'>{{points}}</div>
      </div>
    {{/countries}}
    `;
    var odd = true;
    if (started) {
      text = ms.render(tplProjectionCountryTable, {
        "countries": docs,
        "points": function() {
          if (this.body != null) {
            return this.body;
          } else {
            return 0;
          }
        },
        "desc": "",
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
        },
        "playing": function() {
          if (params.countryCodes[this.krajina].playing) {
            return "playing"
          } else return ""
        }
      });
    } else {
      text = ms.render(tplProjectionCountryTable, {
        "countries": params.countryList,
        "points": function() {
          for (let k in docs) {
            if (docs[k].krajina == this) {
              if (docs[k].body != null) {
                return docs[k].body;
              } else {
                return 0;
              }
            }
          }
        },
        "krajina": function() {
          return this;
        },
        "tim": function() {
          for (let k in docs) {
            if (docs[k].krajina == this) return docs[k].tim;
          }
        },
        "nicename": function() {
          return params.countryCodes[this].country;
        },
        "area": function() {
          return params.countryCodes[this].area;
        },
        "desc": function() {
          return params.countryCodes[this].desc;
        },
        "striped": function() {
          if (odd) {
            odd = false;
            return "odd";
          } else {
            odd = true;
            return "even";
          }
        },
        "playing": function() {
          if (params.countryCodes[this].playing) {
            return "playing"
          } else {
            return ""
          }
        }
      });
    }
    let teamsTable = document.getElementById("teamsTable");
    teamsTable.innerHTML = text;
    if (started) {
      teamsTable.classList.remove("grid");
      teamsTable.classList.add("table");
    }

    /* Pomoc krajinám štvrtého sveta */
    if (started && params.year > 0 && params.phase == 0) {
      let last = [],
        first = [];
      for (i in docs) {
        if (docs[0].body == docs[i].body) {
          first.push(params.countryCodes[docs[i].krajina].country);
        }
        if (docs[docs.length - 1].body == docs[i].body) {
          last.push(params.countryCodes[docs[i].krajina].country);
        }
      }
      first = first.join(", ");
      last = last.join(", ");
      let countryInNeed = ms.render(tplProjectionFourthWorld, {
        "first": first,
        "last": last
      });
      document.getElementById('endNews').innerHTML = countryInNeed;
    }
  }

  function renderPhase(year, phase, pocetrokov) {
    document.body.classList.remove("pomoc", "spravy", "porada", "rozkladanie", "diplomacia", "vyhodnotenie", "pauza");
    resetView();

    if (year > pocetrokov && started) {
      document.body.classList.add('ended');
      document.getElementById("newsBox").classList.remove("hidden");
      if (timer != undefined) timer.running = false;
      document.getElementById('currPhase').innerHTML = "<h3>Koniec sveta</h3>";
      document.getElementById('currPhaseText').innerHTML = "";
      thankyou = "<img src='img/qrcode.png' /><br /> Ďakujeme za hru. Sledujte náš facebook a web http://gow.panakrala.sk";
      document.getElementById('newsBox').innerHTML = thankyou;
      document.getElementById('currYear').innerHTML = "<h3 class='year'></h3>";
      return;
    }

    document.body.classList.add(phase.slug);


    /* END OF THE WORLD */
    if (year > pocetrokov && started) {
      document.body.classList.add('ended');
      document.getElementById("newsBox").classList.remove("hidden");
      if (timer != undefined) timer.running = false;
      document.getElementById('currPhase').innerHTML = "<h3>Koniec sveta</h3>";
      document.getElementById('currPhaseText').innerHTML = "";
      document.getElementById('newsBox').innerHTML = "<img src='img/qrcode.png' />";
      document.getElementById('currYear').innerHTML = "<h3 class='year'>" + year + ".&nbsp;kolo</h3>";
    }

    /* GAME IS RUNNING */
    else if (started) {
      document.getElementById('currPhase').innerHTML = "<h2 class='phase'>" + phase.title + " </h2>";
      document.getElementById('currPhaseText').innerHTML = "<span class='phasetext'>" + phase.text + "</span>";
      if (timer != undefined) timer.running = false;

      switch (phase.title) {
        case "Pomoc štvrtému svetu":
          if (timer != undefined) timer.running = false;
          break;
        case "Správy zo sveta":
          document.getElementById("newsBox").classList.remove("hidden");
          if (timer != undefined) timer.running = false;
          break;
        case "Čas na strategické rozhodnutia":
          displayCounter(params.clock.brief * 60);
          break;
        case "Rozkladanie armád":
          if (timer != undefined) timer.running = false;
          break;
        case "Diplomacia":
          displayCounter(params.clock.diplomacy * 60);
          break;
        case "Vyhodnotenie bojov":
          if (timer != undefined) timer.running = false;
          break;
        case "Pauza":
          displayCounter(params.clock.pause * 60);
          break;
      }
      document.getElementById('currYear').innerHTML = "<h3 class='year'>" + year + ".&nbsp;kolo</h3>";
    } else {
      document.getElementById('currYear').innerHTML = "<h3 class='year'></h3>";
      document.getElementById('currPhase').innerHTML = "<h2 class='phase'>Game of Worlds</h2>";
      document.getElementById('currPhaseText').innerHTML = "<span class='phasetext'>Vitajte na hre Game of Worlds. Svoj tím môžete prihlásiť u organizátorov hry.</span>";
    }
  }



  // COUNTDOWN TIMER

  function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
  }

  CountDownTimer.prototype.start = function() {
    if (this.running) {
      return;
    }
    this.running = true;
    var start = Date.now(),
      that = this,
      diff, obj;

    (function timer() {
      diff = that.duration - (((Date.now() - start) / 1000) | 0);

      if (that.running) {
        if (diff > 0) {
          setTimeout(timer, that.granularity);
        } else {
          diff = 0;
          that.running = false;
        }

        obj = CountDownTimer.parse(diff);
        that.tickFtns.forEach(function(ftn) {
          ftn.call(this, obj.minutes, obj.seconds);
        }, that);
      }
    }());
  };

  CountDownTimer.prototype.onTick = function(ftn) {
    if (typeof ftn === 'function') {
      this.tickFtns.push(ftn);
    }
    return this;
  };

  CountDownTimer.prototype.expired = function() {
    return !this.running;
  };

  CountDownTimer.parse = function(seconds) {
    return {
      'minutes': (seconds / 60) | 0,
      'seconds': (seconds % 60) | 0
    };
  };

  function displayCounter(duration) {
    var display = document.querySelector('#timerdiv');
    timer = new CountDownTimer(duration);
    timer.onTick(format(display)).onTick(restart).start();



    function restart() {
      if (this.expired()) {
        //setTimeout(function () { timer.start(); }, 1000);
        var element = document.body;
        element[0].classList.add("timeisup");
        //display.innerHTML = "Čas vypršal!";
        document.getElementById('overtime').classList.remove("hidden");
      }
    }

    function format(display) {
      return function(minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ':' + seconds;
      };
    }
  }
})();
