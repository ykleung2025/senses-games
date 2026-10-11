(function () {
  var lab = globalThis.SenseLab;
  var icons = globalThis.SenseIcons;
  var board = document.getElementById("board");
  var feedback = document.getElementById("feedback");
  var lesson = document.getElementById("lesson");
  var coach = document.getElementById("coach");
  var paired = document.getElementById("paired");
  var score = document.getElementById("score");
  var dots = document.getElementById("dots");
  var showEnd = document.getElementById("show-end");
  var endDialog = document.getElementById("end-dialog");
  var endTimer = null;
  var drag = null;
  var ignoreClick = false;

  var state = {
    matched: new Set(),
    trapFound: false,
    selected: null,
    feedback: null,
    done: false,
    organs: [],
    functions: []
  };

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function setText(el, text) {
    if (el.textContent !== text) el.textContent = text;
  }

  function organLocked(id) {
    return state.matched.has(id) || (id === "tooth" && state.trapFound);
  }

  function fnLocked(id) {
    return state.matched.has(id) || (id === "chew" && state.trapFound);
  }

  function render() {
    var active = document.activeElement;
    var restore = null;
    if (active && active.dataset) {
      if (active.dataset.organ) restore = '[data-organ="' + active.dataset.organ + '"]';
      else if (active.dataset.fn) restore = '[data-fn="' + active.dataset.fn + '"]';
      else if (active.dataset.drop) restore = "[data-drop='not-sense']";
    }

    var hint = state.matched.size === 5 && !state.trapFound;
    var organHtml = state.organs.map(function (id) {
      var meta = lab.organById(id);
      var locked = organLocked(id);
      var selected = state.selected === id;
      var aria = meta.name;
      if (id !== "tooth" && locked) aria += "，已配對";
      if (id === "tooth" && state.trapFound) aria += "，不是感覺器官";
      var cls = "organ";
      if (selected) cls += " is-selected";
      if (locked) cls += " is-done";
      if (hint && id === "tooth") cls += " is-hint";
      var extra = "";
      if (id !== "tooth" && locked) extra = '<span class="done-mark">已配對</span>';
      if (id === "tooth" && state.trapFound) extra = '<span class="done-mark">不是感覺器官</span>';
      return (
        '<button type="button" class="' + cls + '" data-organ="' + id + '" data-locked="' + locked + '" aria-pressed="' + selected + '" aria-label="' + aria + '">' +
        '<span class="icon">' + icons.icon(id === "tooth" ? "tooth" : id) + "</span>" +
        '<span class="label">' + meta.name + "</span>" +
        extra +
        "</button>"
      );
    }).join("");

    var fnHtml = state.functions.map(function (id) {
      var locked = fnLocked(id);
      var text = lab.functionText(id);
      var owner = "";
      if (id !== "chew" && state.matched.has(id)) owner = '<span class="owner">' + lab.organById(id).name + "</span>";
      if (id === "chew" && state.trapFound) owner = '<span class="owner">不是感覺功能</span>';
      return (
        '<button type="button" class="fn' + (locked ? " is-done" : "") + '" data-fn="' + id + '" data-locked="' + locked + '">' +
        '<span class="label">' + text + "</span>" +
        owner +
        "</button>"
      );
    }).join("");

    board.innerHTML =
      '<section><h2>1. 選器官</h2><div class="organs">' + organHtml + "</div></section>" +
      '<section><h2>2. 選功能</h2><div class="fns">' + fnHtml + "</div></section>" +
      '<button type="button" class="not-sense' + (hint ? " is-hint" : "") + '" data-drop="not-sense">' +
      "<strong>這不是感覺器官</strong><span>點選後再按這裡，或拖過來</span></button>";

    score.textContent = "得分 " + state.matched.size + "／5";
    dots.replaceChildren();
    for (var i = 0; i < 5; i += 1) {
      var dot = document.createElement("span");
      dot.className = i < state.matched.size ? "dot on" : "dot";
      dots.appendChild(dot);
    }

    paired.replaceChildren();
    lab.PAIRS.forEach(function (pair) {
      if (!state.matched.has(pair.id)) return;
      var li = document.createElement("li");
      li.textContent = pair.name + " → " + pair.fn;
      paired.appendChild(li);
    });

    feedback.className = "feedback" + (state.feedback ? " is-" + state.feedback.kind : "");
    setText(feedback, state.feedback ? state.feedback.text : "");
    setText(lesson, state.trapFound ? lab.TRAP.message : "");
    setText(coach, hint ? "五種感覺器官都配對了！再點「牙齒」，然後按「這不是感覺器官」。" : "");

    if (restore) {
      var el = board.querySelector(restore);
      if (el) el.focus();
    }
  }

  function maybeComplete() {
    if (state.matched.size === 5 && state.trapFound && !state.done) {
      state.done = true;
      fillEnd();
      endTimer = window.setTimeout(openEnd, 700);
    }
  }

  function fillEnd() {
    document.getElementById("end-score").textContent = String(state.matched.size);
    var list = document.getElementById("end-list");
    list.replaceChildren();
    lab.PAIRS.forEach(function (pair) {
      var li = document.createElement("li");
      li.textContent = pair.name + "：" + pair.fn;
      list.appendChild(li);
    });
    document.getElementById("end-trap").textContent = lab.TRAP.message;
  }

  function openEnd() {
    if (!state.done) return;
    fillEnd();
    if (typeof endDialog.showModal === "function") {
      if (!endDialog.open) endDialog.showModal();
    } else {
      endDialog.setAttribute("open", "");
    }
    var replay = document.getElementById("replay");
    if (replay) replay.focus();
  }

  function tryPair(organId, targetId) {
    if (organLocked(organId)) return;
    if (targetId !== "not-sense" && fnLocked(targetId) && organId !== "tooth") {
      state.selected = organId;
      state.feedback = { kind: "bad", text: "這個已經配對了，選另一個功能。" };
      render();
      return;
    }
    var result = lab.judgeMatch(organId, targetId);
    if (result.type === "correct") {
      state.matched.add(organId);
      state.selected = null;
      state.feedback = { kind: "good", text: result.message };
    } else if (result.type === "trap") {
      state.trapFound = true;
      state.selected = null;
      state.feedback = null;
    } else {
      state.selected = organId;
      state.feedback = { kind: "bad", text: result.message };
    }
    render();
    maybeComplete();
  }

  function onOrganTap(id) {
    if (organLocked(id)) return;
    state.selected = state.selected === id ? null : id;
    if (state.selected) {
      state.feedback = { kind: "info", text: "已選" + lab.organById(id).name + "。再點功能。" };
    } else if (state.feedback && state.feedback.kind === "info" && state.feedback.text.indexOf("已選") === 0) {
      state.feedback = null;
    }
    render();
  }

  document.addEventListener("click", function (e) {
    if (!ignoreClick) return;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  board.addEventListener("click", function (e) {
    var organBtn = e.target.closest("[data-organ]");
    var fnBtn = e.target.closest("[data-fn]");
    var zone = e.target.closest("[data-drop='not-sense']");
    if (organBtn && board.contains(organBtn)) {
      onOrganTap(organBtn.dataset.organ);
      return;
    }
    if (fnBtn) {
      if (!state.selected) {
        state.feedback = { kind: "info", text: "請先點一個器官。" };
        render();
        return;
      }
      tryPair(state.selected, fnBtn.dataset.fn);
      return;
    }
    if (zone) {
      if (!state.selected) {
        state.feedback = { kind: "info", text: "請先點選「牙齒」。" };
        render();
        return;
      }
      tryPair(state.selected, "not-sense");
    }
  });

  function endDrag() {
    if (drag && drag.ghost) drag.ghost.remove();
    drag = null;
    document.body.classList.remove("is-dragging");
    document.querySelectorAll(".drop-hot").forEach(function (n) { n.classList.remove("drop-hot"); });
  }

  document.addEventListener("pointerdown", function (e) {
    if (drag || e.button !== 0) return;
    var organ = e.target.closest("[data-organ]");
    if (!organ || !board.contains(organ)) return;
    if (organ.dataset.locked === "true") return;
    drag = {
      id: organ.dataset.organ,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origin: organ,
      ghost: null,
      moved: false
    };
    try { organ.setPointerCapture(e.pointerId); } catch (err) { /* older browsers */ }
  });

  document.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    var dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
    if (dist < 12) return;
    drag.moved = true;
    document.body.classList.add("is-dragging");
    if (!drag.ghost) {
      drag.ghost = drag.origin.cloneNode(true);
      drag.ghost.classList.add("ghost");
      var rect = drag.origin.getBoundingClientRect();
      drag.ghost.style.width = rect.width + "px";
      drag.ghost.style.height = rect.height + "px";
      document.body.appendChild(drag.ghost);
    }
    drag.ghost.style.left = e.clientX + "px";
    drag.ghost.style.top = e.clientY + "px";
    var under = document.elementFromPoint(e.clientX, e.clientY);
    document.querySelectorAll(".drop-hot").forEach(function (n) { n.classList.remove("drop-hot"); });
    var target = under && under.closest("[data-fn], [data-drop='not-sense']");
    if (target) target.classList.add("drop-hot");
  });

  document.addEventListener("pointerup", function (e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    var info = drag;
    var under = document.elementFromPoint(e.clientX, e.clientY);
    var moved = info.moved;
    endDrag();
    if (!moved) return;
    var target = under && under.closest("[data-fn], [data-drop='not-sense']");
    ignoreClick = true;
    window.setTimeout(function () { ignoreClick = false; }, 0);
    if (!target) return;
    if (target.dataset.fn) tryPair(info.id, target.dataset.fn);
    else tryPair(info.id, "not-sense");
  });

  document.addEventListener("pointercancel", function (e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    endDrag();
  });

  function reset() {
    window.clearTimeout(endTimer);
    endTimer = null;
    state.done = false;
    state.matched = new Set();
    state.trapFound = false;
    state.selected = null;
    state.feedback = null;
    state.organs = shuffle(["eye", "ear", "nose", "tongue", "skin", "tooth"]);
    state.functions = shuffle(["eye", "ear", "nose", "tongue", "skin", "chew"]);
    showEnd.hidden = true;
    if (endDialog.open) endDialog.close();
    render();
  }

  endDialog.addEventListener("close", function () {
    showEnd.hidden = !state.done;
  });

  endDialog.addEventListener("cancel", function (e) {
    e.preventDefault();
    if (endDialog.open) endDialog.close();
  });

  function speechText() {
    if (endDialog.open) {
      var summary = ["做得好！得分 " + state.matched.size + "／5。"];
      lab.PAIRS.forEach(function (pair) {
        summary.push(pair.name + "：" + pair.fn + "。");
      });
      summary.push(lab.TRAP.message);
      return summary.join("");
    }
    var parts = [];
    if (state.feedback && state.feedback.text) parts.push(state.feedback.text);
    if (state.trapFound) parts.push(lab.TRAP.message);
    if (state.matched.size === 5 && !state.trapFound) {
      parts.push("五種感覺器官都配對了！再點「牙齒」，然後按「這不是感覺器官」。");
    }
    parts.push("器官：" + state.organs.map(function (id) {
      return lab.organById(id).name;
    }).join("、") + "。");
    parts.push("功能：" + state.functions.map(function (id) {
      return lab.functionText(id);
    }).join("、") + "。");
    return parts.join("");
  }

  var speaker = globalThis.SenseSpeech.bindButtons(speechText);

  function resetAndQuiet() {
    speaker.stop();
    reset();
  }

  document.getElementById("restart").addEventListener("click", resetAndQuiet);
  document.getElementById("replay").addEventListener("click", resetAndQuiet);
  showEnd.addEventListener("click", openEnd);

  reset();
})();
