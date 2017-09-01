// Mixing jQuery and Node.js code in the same file? Yes please!

$(function() {
  var impPlayerProjector = (function() {
    var ipc = require('electron').ipcRenderer,
      params = {},
      current,
      timer;

    const path = require('path');
    const url = require('url');
    const ms = require('mustache');
    const settings = require('electron').remote.require('electron-settings');
    // renderer process

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
      $('.rules').toggle();
    });
    ipc.on('readPhase', (event, year, phase, pocetrokov) => {
      renderPhase(year, phase, pocetrokov);
    });

    function resetView() {
      $('body').removeClass("timeisup");
      $('.overlay').hide();
    }

    function renderNews(curr) {
      resetView();
      $('.currNews').html(curr);
    }

    function renderTable(docs) {
      resetView();
      var tplProjectionFourthWorld = `
    <div class='newsArticle'>
      <h4>Pomoc krajine štvrtého sveta</h4>
      <p>Dobročinné organizácie WHO, OSN, UNICEF a TV JOJ vyhlásili, že krajinou, ktorá si zaslúži pomoc je <strong>{{last}}</strong> a pomôže jej nádej našej civilizácie, <strong>{{first}}</strong>.</p>
    </div>
    `;
      var tplProjectionCountryTable = `
    {{#countries}}
      <tr id={{krajina}} class="{{striped}}">
        <td class='nazovkrajiny'>{{nicename}}</td>
        <td class='tim'>{{tim}}</td>
        <td class='body'>{{points}}</td>
      </tr>
    {{/countries}}
    `;
      var odd = true;
      text = ms.render(tplProjectionCountryTable, {
        "countries": docs,
        "points": function() { if (this.body != null) { return this.body; } else { return 0; } },
        //"quests": function() { if (this.ulohy != null) { return this.ulohy; } else { return 0; } },
        "nicename": function() { return params.countryCodes[this.krajina].country; },
        "striped": function() { if (odd) { odd = false; return "odd"; } else { odd = true; return "even"; } }
      });
      $("#tabulkatimov").html(text);
      let last = params.countryCodes[$("tbody tr:last-child").attr('id')].country;
      let first = params.countryCodes[$("tbody tr:first-child").attr('id')].country;
      let curr = ms.render(tplProjectionFourthWorld, { "first": first, "last": last });
      $('.endNews').html(curr);
    }

    function renderPhase(year, phase, pocetrokov) {
      resetView();

      if (year > pocetrokov) {
        $('#spravy').hide();
        $('#currPhase').html("<h3>Koniec sveta</h3>");
        $('#currPhaseText').html("");
        if (timer != undefined) timer.running = false;
        $('#timerdiv').hide();
      } else {
        $('#currPhase').html("<h2 class='phase'>" + phase.title + " </h2>");
        $('#currPhaseText').html("<span class='phasetext'>" + phase.text + "</span>");
        $('#infobox').show();

        switch (phase.title) {
          case "Pomoc štvrtému svetu":
            $('#timerdiv').hide();
            $('.endNews').show();
            if (timer != undefined) timer.running = false;
            break;
          case "Správy zo sveta":
            $('#spravy').show();
            $('.endNews').hide();
            $('.currNews').show();
            if (timer != undefined) timer.running = false;
            break;
          case "Čas na strategické rozhodnutia":
            $('#spravy').show();
            $('#timerdiv').show();
            displayCounter(params.shortPause * 60);
            break;
          case "Rozkladanie armád":
            $('#timerdiv').hide();
            if (timer != undefined) timer.running = false;
            break;
          case "Diplomacia":
            $('#spravy').show();
            $('#timerdiv').show();
            displayCounter(params.longPause * 60);
            break;
          case "Vyhodnotenie bojov":
            $('#timerdiv').hide();
            $('#spravy').show();
            if (timer != undefined) timer.running = false;
            break;
          case "Pauza":
            $('#timerdiv').show();
            $('.currNews').hide();
            displayCounter(params.longPause * 60);
            break;
        }
      }
      $('#infobox').show();
      $('#currYear').html("<h3 class='year'>" + year + ".&nbsp;rok&nbsp;" + (year + 2037) + "</h3>");
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
          var element = document.getElementsByTagName("body");
          element[0].classList.add("timeisup");
          //display.innerHTML = "Čas vypršal!";
          $('.overlay').show();
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
