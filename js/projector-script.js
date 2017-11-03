// Mixing jQuery and Node.js code in the same file? Yes please!

$(function() {
 var gowProjector = (function() {
  const ipc = require('electron').ipcRenderer;
  let params = {},
   current,
   started = false,
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

  function resetView() {
   $('body').removeClass("timeisup");
   document.getElementById('overtime').classList.add("hidden");
   document.getElementById('rules').classList.add("hidden");
  }

  function renderNews(curr) {
   resetView();
   $('.currNews').html(curr);
  }

  function renderTable(docs) {
   resetView();
   var tplProjectionFourthWorld = `
    <div class='newsArticle'>
      <h4>Pomoc krajinám štvrtého sveta</h4>
      <p>Dobročinné organizácie WHO, OSN, UNICEF a TV JOJ rozhodli. Toto sú krajiny, ktoré si zaslúžia pomoc: <strong>{{last}}</strong>. <br /><br /> Pomoc štvrtému svetu poskytne nádej našej civilizácie: <strong>{{first}}</strong>.</p>
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
      }
      else {
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
      }
      else {
       odd = true;
       return "even";
      }
     },
     "playing": function() {
      if (params.countryCodes[this.krajina].playing) {
       return "playing"
      }
      else return ""
     }
    });
   }
   else {
    text = ms.render(tplProjectionCountryTable, {
     "countries": params.countryList,
     "points": function() {
      for (k in docs) {
       if (docs[k].krajina == this) {
        if (docs[k].body != null) {
         return docs[k].body;
        }
        else {
         return 0;
        }
       }
      }
     },
     "krajina": function() {
      return this;
     },
     "tim": function() {
      for (k in docs) {
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
      }
      else {
       odd = true;
       return "even";
      }
     },
     "playing": function() {
      if (params.countryCodes[this].playing) {
       return "playing"
      }
      else {
       return ""
      }
     }
    });
   }
   teamsTable = document.getElementById("teamsTable");
   teamsTable.innerHTML = text;
   if (started) {
    teamsTable.classList.remove("grid");
    teamsTable.classList.add("table");
   }

   /* Pomoc krajinám štvrtého sveta */
   if (started && params.phase > 0) {
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
    $('.endNews').html(countryInNeed);
   }
  }

  function renderPhase(year, phase, pocetrokov) {
   document.body.classList.remove("pomoc", "spravy", "porada", "rozkladanie", "diplomacia", "vyhodnotenie", "pauza");
   document.body.classList.add(phase.slug);
   resetView();
   if (year > pocetrokov && started) {
    $('#currPhase').html("<h3>Koniec sveta</h3>");
    $('#currPhaseText').html("");
    if (timer != undefined) timer.running = false;
    $('#currYear').html("<h3 class='year'>" + year + ".&nbsp;rok&nbsp;" + (year + 2037) + "</h3>");
   }
   else if (started) {
    $('#currPhase').html("<h2 class='phase'>" + phase.title + " </h2>");
    $('#currPhaseText').html("<span class='phasetext'>" + phase.text + "</span>");

    switch (phase.title) {
     case "Pomoc štvrtému svetu":
      if (timer != undefined) timer.running = false;
      break;
     case "Správy zo sveta":
      document.getElementById("spravy").classList.remove("hidden");
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
    $('#currYear').html("<h3 class='year'>" + year + ".&nbsp;rok&nbsp;" + (year + 2037) + "</h3>");
   }
   else {
    $('#currYear').html("<h3 class='year'></h3>");
    $('#currPhase').html("<h2 class='phase'>Game of Worlds</h2>");
    $('#currPhaseText').html("<span class='phasetext'>Vitajte na hre Game of Worlds. Svoj tím môžete prihlásiť u organizátorov hry.</span>");
   }
   //  $('#infobox').show();
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
     }
     else {
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
     var element = document.getElementsByTagName("body");
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
});
