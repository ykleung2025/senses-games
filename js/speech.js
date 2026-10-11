(function () {
  var root = typeof globalThis !== "undefined" ? globalThis : this;

  function supported() {
    return typeof root.speechSynthesis !== "undefined" && typeof root.SpeechSynthesisUtterance === "function";
  }

  function scoreVoice(voice) {
    if (!voice) return 0;
    var lang = String(voice.lang || "").toLowerCase().replace(/_/g, "-");
    var name = String(voice.name || "").toLowerCase();
    var score = 0;
    if (lang === "zh-hk" || lang.indexOf("zh-hk-") === 0) score += 100;
    if (lang === "zh-yue" || lang.indexOf("zh-yue-") === 0) score += 100;
    if (lang === "yue" || lang.indexOf("yue-") === 0) score += 100;
    if (/cantonese|hong kong|香港|粵|\u7ca4|yue/.test(name)) score += 40;
    if (score < 100 && lang.indexOf("zh") === 0) score += 10;
    return score;
  }

  function pickVoice(voices) {
    var best = null;
    var bestScore = 0;
    var list = voices || [];
    var i;
    for (i = 0; i < list.length; i += 1) {
      var score = scoreVoice(list[i]);
      if (score > bestScore) {
        bestScore = score;
        best = list[i];
      }
    }
    return bestScore >= 10 ? best : null;
  }

  var statusEl = null;
  var token = 0;

  function bindStatus(el) {
    statusEl = el || null;
  }

  function setStatus(text) {
    var value = text || "";
    if (typeof document !== "undefined") {
      var nodes = document.querySelectorAll(".speak-status");
      if (nodes.length) {
        Array.prototype.forEach.call(nodes, function (el) {
          el.textContent = value;
        });
        return;
      }
    }
    if (statusEl) statusEl.textContent = value;
  }

  function stop() {
    token += 1;
    if (!supported()) return;
    try {
      root.speechSynthesis.cancel();
    } catch (err) {
      /* ignore */
    }
  }

  function speak(text, hooks) {
    var plain = String(text || "").replace(/\s+/g, " ").trim();
    hooks = hooks || {};
    token += 1;
    var mine = token;
    if (!plain) return;
    if (!supported()) {
      setStatus("這部裝置未能朗讀，請讀畫面上的字。");
      if (hooks.onend) hooks.onend();
      return;
    }
    setStatus("");
    var synth = root.speechSynthesis;

    function start() {
      if (mine !== token) return;
      var utter;
      try {
        utter = new root.SpeechSynthesisUtterance(plain);
      } catch (err) {
        setStatus("暫時未能朗讀，請讀畫面上的字。");
        if (hooks.onend) hooks.onend();
        return;
      }
      utter.lang = "zh-HK";
      utter.rate = 0.9;
      var voice = pickVoice(synth.getVoices());
      if (voice) {
        utter.voice = voice;
        if (voice.lang) utter.lang = voice.lang;
      }
      utter.onstart = function () {
        if (mine === token && hooks.onstart) hooks.onstart();
      };
      utter.onend = function () {
        if (mine === token && hooks.onend) hooks.onend();
      };
      utter.onerror = function (ev) {
        var code = ev && ev.error;
        if (code === "canceled" || code === "interrupted") {
          if (mine === token && hooks.onend) hooks.onend();
          return;
        }
        if (mine !== token) return;
        setStatus("暫時未能朗讀，請讀畫面上的字。");
        if (hooks.onend) hooks.onend();
      };
      try {
        synth.resume();
        synth.speak(utter);
      } catch (err) {
        setStatus("暫時未能朗讀，請讀畫面上的字。");
        if (hooks.onend) hooks.onend();
      }
    }

    function begin() {
      if (mine !== token) return;
      try {
        if (synth.speaking || synth.pending) {
          synth.cancel();
          root.setTimeout(start, 80);
        } else {
          start();
        }
      } catch (err) {
        setStatus("暫時未能朗讀，請讀畫面上的字。");
        if (hooks.onend) hooks.onend();
      }
    }

    var voices = [];
    try {
      voices = synth.getVoices() || [];
    } catch (err) {
      voices = [];
    }
    if (voices.length) {
      begin();
      return;
    }
    var started = false;
    function kick() {
      if (started || mine !== token) return;
      var ready = [];
      try { ready = synth.getVoices() || []; } catch (err) { ready = []; }
      if (!ready.length) return;
      started = true;
      try { synth.removeEventListener("voiceschanged", kick); } catch (err) { /* ignore */ }
      begin();
    }
    try { synth.addEventListener("voiceschanged", kick); } catch (err) { /* ignore */ }
    root.setTimeout(function () {
      kick();
      if (!started && mine === token) begin();
    }, 250);
  }

  var speakingKey = "";

  function syncOptionButtons() {
    if (typeof document === "undefined") return;
    var nodes = document.querySelectorAll(".js-option-speak");
    Array.prototype.forEach.call(nodes, function (btn) {
      var on = !!speakingKey && btn.getAttribute("data-speak") === speakingKey;
      btn.textContent = on ? "停止" : (btn.getAttribute("data-idle-label") || "朗讀");
      btn.classList.toggle("is-speaking", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function quiet() {
    speakingKey = "";
    stop();
    syncOptionButtons();
  }

  function bindOptionSpeakers() {
    if (typeof document === "undefined") return { stop: function () {} };
    bindStatus(document.getElementById("speak-status"));
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".js-option-speak");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      if (btn.classList.contains("is-speaking")) {
        quiet();
        return;
      }
      var text = btn.getAttribute("data-speak") || "";
      speakingKey = text;
      syncOptionButtons();
      speak(text, {
        onstart: function () { syncOptionButtons(); },
        onend: function () {
          if (speakingKey === text) speakingKey = "";
          syncOptionButtons();
        }
      });
    }, true);

    if (typeof root.addEventListener === "function") {
      root.addEventListener("pagehide", quiet);
    }

    return { stop: quiet, sync: syncOptionButtons };
  }

  if (supported()) {
    try {
      root.speechSynthesis.getVoices();
      root.speechSynthesis.addEventListener("voiceschanged", function () {});
    } catch (err) { /* ignore */ }
  }

  root.SenseSpeech = {
    supported: supported,
    speak: speak,
    stop: stop,
    pickVoice: pickVoice,
    scoreVoice: scoreVoice,
    bindOptionSpeakers: bindOptionSpeakers,
    syncOptionButtons: syncOptionButtons,
    bindStatus: bindStatus
  };
})();
