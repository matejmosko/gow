// Mixing jQuery and Node.js code in the same file? Yes please!

$(function() {
  var ipc = require('electron').ipcRenderer;

  const path = require('path');
  const url = require('url');
  var current, timer;
  // renderer process

  ipc.on('readCurrentGame', (event, arg) => {
    renderTable(arg);
  });
  ipc.on('readNews', (event, arg) => {
    renderNews(arg);

  });
  ipc.on('readPhase', (event, year, phase) => {
    renderPhase(year, phase);
  });

  function resetView() {
    $('body').removeClass("timeisup");
    $('.overlay').hide();
  }

  function renderNews(curr) {
    resetView()
    $('.currNews').html(curr);
  }

  function renderTable(docs) {
    resetView();
    var text = "";
    for (var i = 0, k; k = docs[i]; i++) {
      if (k['body'] == null) {
        k['body'] = 0;
      }
      text += "<tr id=" + k['krajina'] + "><td class='nazovkrajiny'>" + k['krajina'] + "</td><td class='tim'>" + k['tim'] + "</td><td class='body'>" + k['body'] + "</td>";
      text += "</tr>";
    }
    $("#tabulkatimov").html(text);
    let last = $( "tbody tr:last-child" ).attr('id');
    let first = $( "tbody tr:first-child" ).attr('id');

    let curr = "<div class='sprava'><h4>Pomoc krajine štvrtého sveta</h4><p>Dobročinné organizácie WHO, OSN, UNICEF a TV JOJ vyhlásili, že krajinou, ktorá si zaslúži pomoc je <strong>" + last + "</strong> a pomôže jej nádej našej civilizácie, <strong>" + first + "</strong>.</p></div><div class='sprava'><h4>Plány krajín sa podarilo prekročiť o " + Math.floor((Math.random() * 100) + 101) + " %</h4><p>Zástupcovia jednotlivých krajín si teraz vyberú plody práce svojho pracovitého ľudu. <br /> Inými slovami: Choďte za organizátorom po zdroje.</p></div>";

    $('.endNews').html(curr);
  }

  function renderPhase(year, phase) {
    resetView()
    if (year > 6) {
      $('#spravy').hide();
      $('#currYear').html("<h2 class='year'>Rok " + (year+2035) + "</h2>");
      $('#currPhase').html("<h3>Koniec sveta</h3>");
      $('#currPhaseText').html("");
      $('.infobox').show();
    } else {
    year = year + 2034;
    $('#currYear').html("<h2 class='year'>Rok " + year + "</h2>");
    $('#currPhase').html("<h2 class='phase'>" + phase.title + " </h2>");
    $('#currPhaseText').html("<span class='phasetext'>" + phase.text + "</span>");
    $('.infobox').show();


      switch (phase.title) {
        case "Rozkladanie armád":
          $('#desatminut').hide();
          $('#spravy').show();
          $('.currNews').show();
          $('.endNews').hide();
          if (timer!= undefined) timer.running = false;
          break;
        case "Diplomacia":
          $('#spravy').show();
          $('#desatminut').show();
          displayCounter(10*60);
          break;
        case "Vyhodnotenie bojov":
          $('#desatminut').hide();
          $('#spravy').show();
          if (timer!= undefined) timer.running = false;
          break;
        case "Pauza":
          $('#desatminut').show();
          $('.currNews').hide();
          $('.endNews').show();
          if (year % 2 == 0) { displayCounter(5*60); } else { displayCounter(15*60);}
          break;
      }
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
    var display = document.querySelector('#desatminut');
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
});
