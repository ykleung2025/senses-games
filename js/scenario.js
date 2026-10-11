(function () {
  var lab = globalThis.SenseLab;
  var icons = globalThis.SenseIcons;
  var questions = lab.QUESTIONS;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var progress = document.getElementById("progress");
  var starText = document.getElementById("star-text");
  var starRow = document.getElementById("star-row");
  var barFill = document.getElementById("bar-fill");
  var sceneCard = document.getElementById("scene-card");
  var qTitle = document.getElementById("q-title");
  var scene = document.getElementById("scene");
  var qText = document.getElementById("q-text");
  var stepTitle = document.getElementById("step-title");
  var stepNote = document.getElementById("step-note");
  var choices = document.getElementById("choices");
  var explain = document.getElementById("explain");
  var feedback = document.getElementById("feedback");
  var backBtn = document.getElementById("back-step");
  var submit = document.getElementById("submit");
  var endDialog = document.getElementById("end-dialog");
  var endStar = document.getElementById("end-star");

  var state = {
    index: 0,
    step: 1,
    selected: new Set(),
    sensePick: new Set(),
    stars: 0,
    firstTry: 0,
    clean: true,
    done: false
  };

  function current() {
    return questions[state.index];
  }

  function orderedNames(ids, list) {
    return list.filter(function (item) { return ids.has(item.id); }).map(function (item) { return item.name; });
  }

  function renderStars() {
    starRow.replaceChildren();
    for (var i = 0; i < questions.length; i += 1) {
      var span = document.createElement("span");
      span.className = "star";
      span.innerHTML = icons.icon(i < state.stars ? "star" : "starOff");
      starRow.appendChild(span);
    }
    starText.textContent = "星星 " + state.stars + "／" + questions.length;
    barFill.style.width = (state.stars / questions.length) * 100 + "%";
  }

  function renderChoices() {
    var items = state.step === 1 ? lab.SENSES : lab.PURPOSES;
    choices.replaceChildren();
    items.forEach(function (item) {
      var pressed = state.selected.has(item.id);
      var row = document.createElement("div");
      row.className = "option-row";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.dataset.choice = item.id;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
      var box = document.createElement("span");
      box.className = "box";
      box.setAttribute("aria-hidden", "true");
      box.textContent = "✓";
      var icon = document.createElement("span");
      icon.className = "icon";
      icon.innerHTML = icons.icon(item.icon || item.id);
      var name = document.createElement("span");
      name.className = "name";
      name.textContent = item.name;
      btn.append(box, icon, name);
      var speak = document.createElement("button");
      speak.type = "button";
      speak.className = "speak-btn speak-mini js-option-speak";
      speak.setAttribute("data-speak", item.name);
      speak.setAttribute("aria-label", "朗讀：" + item.name);
      speak.textContent = "朗讀";
      row.append(btn, speak);
      choices.appendChild(row);
    });
    if (globalThis.SenseSpeech) globalThis.SenseSpeech.syncOptionButtons();
  }

  function renderExplain() {
    if (state.step !== 3) {
      explain.hidden = true;
      explain.replaceChildren();
      return;
    }
    var q = current();
    explain.hidden = false;
    explain.replaceChildren();
    var star = document.createElement("span");
    star.className = "icon";
    star.innerHTML = icons.icon("star");
    var wrap = document.createElement("div");
    var picked = document.createElement("p");
    picked.textContent = "你選了：" + orderedNames(state.sensePick, lab.SENSES).join("、");
    var body = document.createElement("p");
    body.textContent = q.explain;
    wrap.append(picked, body);
    explain.append(star, wrap);
  }

  function render() {
    var q = current();
    progress.textContent = "第 " + (state.index + 1) + "／" + questions.length + " 題";
    sceneCard.dataset.question = String(q.id);
    sceneCard.dataset.step = String(state.step);
    qTitle.textContent = q.title;
    qText.textContent = q.text;
    var scenarioSpeak = document.getElementById("speak-scenario");
    if (scenarioSpeak) scenarioSpeak.setAttribute("data-speak", q.title + "。" + q.text);
    scene.innerHTML = icons.scene(q.id);
    renderStars();
    if (state.step === 1) {
      stepTitle.textContent = "用了哪些感覺器官？";
      stepNote.textContent = "可以選多個。";
    } else {
      stepTitle.textContent = "這些感覺主要有什麼作用？";
      stepNote.textContent = "可以選多個。";
    }
    renderChoices();
    renderExplain();
    backBtn.hidden = state.step !== 2;
    if (state.step === 3) {
      submit.textContent = state.index + 1 >= questions.length ? "查看成績" : "下一題";
    } else {
      submit.textContent = "選好了";
    }
  }

  function shake() {
    choices.classList.remove("shake");
    void choices.offsetWidth;
    choices.classList.add("shake");
  }

  function showFeedback(kind, text) {
    feedback.className = "feedback is-" + kind;
    feedback.textContent = text;
  }

  function clearFeedback() {
    feedback.className = "feedback";
    feedback.textContent = "";
  }

  function submitAnswer() {
    speaker.stop();
    var q = current();
    if (state.step === 3) {
      goNext();
      return;
    }
    var picked = Array.from(state.selected);
    if (state.step === 1) {
      var senseResult = lab.gradeSenses(picked, q);
      if (!senseResult.ok) {
        if (!senseResult.empty) state.clean = false;
        showFeedback("bad", senseResult.empty ? "請選一選用了哪些感覺器官。" : lab.HINT_SENSE);
        shake();
        return;
      }
      state.sensePick = new Set(state.selected);
      state.selected = new Set();
      state.step = 2;
      showFeedback("good", "感官選對了！再選主要作用。");
      render();
      return;
    }
    var purposeResult = lab.gradePurposes(picked, q);
    if (!purposeResult.ok) {
      if (!purposeResult.empty) state.clean = false;
      showFeedback("bad", purposeResult.empty ? "請選一選主要作用。" : lab.HINT_PURPOSE);
      shake();
      return;
    }
    state.stars += 1;
    if (state.clean) state.firstTry += 1;
    state.step = 3;
    showFeedback("good", "全對！");
    render();
  }

  var speaker = globalThis.SenseSpeech.bindOptionSpeakers();

  function goNext() {
    speaker.stop();
    if (state.index + 1 >= questions.length) {
      state.done = true;
      fillEnd();
      if (typeof endDialog.showModal === "function") {
        if (!endDialog.open) endDialog.showModal();
      } else {
        endDialog.setAttribute("open", "");
      }
      document.getElementById("replay").focus();
      return;
    }
    state.index += 1;
    state.step = 1;
    state.selected = new Set();
    state.sensePick = new Set();
    state.clean = true;
    clearFeedback();
    render();
    sceneCard.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function goBack() {
    if (state.step !== 2) return;
    state.step = 1;
    state.selected = new Set(state.sensePick);
    clearFeedback();
    speaker.stop();
    render();
  }

  function fillEnd() {
    document.getElementById("end-stars").textContent = String(state.stars);
    document.getElementById("end-first").textContent = String(state.firstTry);
    endStar.innerHTML = icons.icon("star");
  }

  function replay() {
    state.index = 0;
    state.step = 1;
    state.selected = new Set();
    state.sensePick = new Set();
    state.stars = 0;
    state.firstTry = 0;
    state.clean = true;
    state.done = false;
    clearFeedback();
    speaker.stop();
    if (endDialog.open) endDialog.close();
    render();
    window.scrollTo(0, 0);
  }

  choices.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-choice]");
    if (!btn || state.step === 3) return;
    var id = btn.dataset.choice;
    if (state.selected.has(id)) state.selected.delete(id);
    else state.selected.add(id);
    btn.setAttribute("aria-pressed", state.selected.has(id) ? "true" : "false");
  });

  submit.addEventListener("click", submitAnswer);
  backBtn.addEventListener("click", goBack);
  document.getElementById("replay").addEventListener("click", replay);
  document.getElementById("restart").addEventListener("click", replay);

  endDialog.addEventListener("cancel", function (e) {
    e.preventDefault();
    if (endDialog.open) endDialog.close();
  });

  render();
})();
