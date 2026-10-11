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
  var swallowClick = null;

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
        '<div class="option-row">' +
        '<button type="button" class="' + cls + '" data-organ="' + id + '" data-locked="' + locked + '" aria-pressed="' + selected + '" aria-label="' + aria + '">' +
        '<span class="icon">' + icons.icon(id) + "</span>" +
        '<span class="label">' + meta.name + "</span>" +
        extra +
        "</button>" +
        speakButton(meta.name) +
        "</div>"
      );
    }).join("");

    var fnHtml = state.functions.map(function (id) {
      var locked = fnLocked(id);
      var text = lab.functionText(id);
      var owner = "";
      if (id !== "chew" && state.matched.has(id)) owner = '<span class="owner">' + lab.organById(id).name + "</span>";
      if (id === "chew" && state.trapFound) owner = '<span class="owner">不是感覺功能</span>';
      return (
        '<div class="option-row">' +
        '<button type="button" class="fn' + (locked ? " is-done" : "") + '" data-fn="' + id + '" data-locked="' + locked + '">' +
        '<span class="label">' + text + "</span>" +
        owner +
        "</button>" +
        speakButton(text) +
        "</div>"
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
    if (globalThis.SenseSpeech) globalThis.SenseSpeech.syncOptionButtons();
  }

  function speakButton(text) {
    var safe = String(text)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return '<button type="button" class="speak-btn speak-mini js-option-speak" data-speak="' + safe + '" aria-label="朗讀：' + safe + '">朗讀</button>';
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

  function armIgnoreClick(x, y, organId) {
    swallowClick = { x: x, y: y, organId: organId, until: Date.now() + 700 };
  }

  document.addEventListener("click", function (e) {
    if (!swallowClick) return;
    if (Date.now() > swallowClick.until) {
      swallowClick = null;
      return;
    }
    var near = Math.hypot(e.clientX - swallowClick.x, e.clientY - swallowClick.y) < 64;
    var organ = e.target && e.target.closest ? e.target.closest("[data-organ]") : null;
    var sameOrgan = organ && organ.dataset.organ === swallowClick.organId;
    if (!near && !sameOrgan) return;
    swallowClick = null;
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
    if (drag && drag.origin) drag.origin.classList.remove("is-source");
    drag = null;
    document.body.classList.remove("is-dragging");
    document.querySelectorAll(".drop-hot").forEach(function (n) { n.classList.remove("drop-hot"); });
  }

  function hitTarget(x, y) {
    var stack = [];
    if (typeof document.elementsFromPoint === "function") {
      stack = document.elementsFromPoint(x, y) || [];
    } else {
      var one = document.elementFromPoint(x, y);
      if (one) stack = [one];
    }
    var i;
    var node;
    var zone;
    for (i = 0; i < stack.length; i += 1) {
      node = stack[i];
      if (!node || !node.closest) continue;
      if (node.closest(".ghost")) continue;
      if (drag && drag.origin && (node === drag.origin || node.closest("[data-organ]") === drag.origin)) continue;
      zone = node.closest("[data-fn], [data-drop='not-sense']");
      if (zone && board.contains(zone)) return zone;
    }
    return null;
  }

  function dropTarget(x, y) {
    var direct = hitTarget(x, y);
    if (direct) return direct;
    var nodes = board.querySelectorAll("[data-fn], [data-drop='not-sense']");
    var best = null;
    var bestDist = 36;
    Array.prototype.forEach.call(nodes, function (el) {
      var rect = el.getBoundingClientRect();
      var cx = Math.max(rect.left, Math.min(x, rect.right));
      var cy = Math.max(rect.top, Math.min(y, rect.bottom));
      var dist = Math.hypot(x - cx, y - cy);
      if (dist < bestDist) {
        bestDist = dist;
        best = el;
      }
    });
    return best;
  }

  function paintHot(target) {
    document.querySelectorAll(".drop-hot").forEach(function (n) { n.classList.remove("drop-hot"); });
    if (target) target.classList.add("drop-hot");
  }

  function updateDrag(x, y) {
    if (!drag) return;
    drag.lastX = x;
    drag.lastY = y;
    var dist = Math.hypot(x - drag.startX, y - drag.startY);
    var slop = drag.pointerType === "touch" ? 18 : 10;
    if (!drag.moved) {
      if (dist < slop) return;
      drag.moved = true;
      document.body.classList.add("is-dragging");
      drag.origin.classList.add("is-source");
    }
    if (!drag.ghost) {
      drag.ghost = drag.origin.cloneNode(true);
      drag.ghost.classList.add("ghost");
      drag.ghost.classList.remove("is-source");
      drag.ghost.style.pointerEvents = "none";
      drag.ghost.setAttribute("aria-hidden", "true");
      drag.ghost.tabIndex = -1;
      var rect = drag.origin.getBoundingClientRect();
      drag.ghost.style.width = rect.width + "px";
      drag.ghost.style.height = rect.height + "px";
      document.body.appendChild(drag.ghost);
    }
    drag.ghost.style.left = x + "px";
    drag.ghost.style.top = y + "px";
    var target = dropTarget(x, y);
    drag.hot = target;
    paintHot(target);
  }

  function startDrag(organ, x, y, extra) {
    drag = {
      id: organ.dataset.organ,
      origin: organ,
      startX: x,
      startY: y,
      lastX: x,
      lastY: y,
      ghost: null,
      moved: false,
      hot: null,
      pointerId: extra.pointerId != null ? extra.pointerId : null,
      touchId: extra.touchId != null ? extra.touchId : null,
      pointerType: extra.pointerType || "mouse",
      pointerGone: false
    };
  }

  function organFromEvent(e) {
    if (e.target && e.target.closest && e.target.closest(".js-option-speak")) return null;
    var node = e.target && e.target.closest ? e.target.closest("[data-organ]") : null;
    if (node && board.contains(node)) return node;
    return null;
  }

  function finishDrag(x, y) {
    if (!drag) return;
    var info = drag;
    if (x == null || y == null) {
      x = info.lastX;
      y = info.lastY;
    }
    var moved = info.moved;
    var target = moved ? (dropTarget(x, y) || info.hot) : null;
    endDrag();
    if (!moved) return;
    armIgnoreClick(x, y, info.id);
    if (!target) return;
    if (target.dataset.fn) tryPair(info.id, target.dataset.fn);
    else tryPair(info.id, "not-sense");
  }

  function cancelDrag() {
    if (!drag) return;
    var moved = drag.moved;
    var x = drag.lastX;
    var y = drag.lastY;
    var id = drag.id;
    endDrag();
    if (moved) armIgnoreClick(x, y, id);
  }

  document.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    var organ = organFromEvent(e);
    if (!organ || organ.dataset.locked === "true") return;
    if (drag && drag.origin === organ && !drag.pointerGone) {
      drag.pointerId = e.pointerId;
      return;
    }
    if (drag && !drag.pointerGone) return;
    if (drag) endDrag();
    startDrag(organ, e.clientX, e.clientY, {
      pointerId: e.pointerId,
      pointerType: e.pointerType || "mouse"
    });
    if (e.pointerType !== "touch") {
      try { organ.setPointerCapture(e.pointerId); } catch (err) { /* mouse only */ }
    }
  });

  document.addEventListener("pointermove", function (e) {
    if (!drag) return;
    if (drag.pointerId != null && e.pointerId !== drag.pointerId) return;
    if (e.cancelable) e.preventDefault();
    updateDrag(e.clientX, e.clientY);
  }, { passive: false });

  document.addEventListener("pointerup", function (e) {
    if (!drag) return;
    if (drag.pointerId != null && e.pointerId !== drag.pointerId) return;
    if (drag.moved && e.cancelable) e.preventDefault();
    finishDrag(e.clientX, e.clientY);
  });

  document.addEventListener("pointercancel", function (e) {
    if (!drag) return;
    if (drag.pointerId != null && e.pointerId !== drag.pointerId) return;
    if (drag.pointerType === "touch" || drag.touchId != null) {
      drag.pointerGone = true;
      return;
    }
    cancelDrag();
  });

  document.addEventListener("touchstart", function (e) {
    var touch = e.changedTouches && e.changedTouches[0];
    if (!touch) return;
    var organ = organFromEvent(e);
    if (drag) {
      if (organ && organ === drag.origin && drag.touchId == null) drag.touchId = touch.identifier;
      return;
    }
    if (!organ || organ.dataset.locked === "true") return;
    startDrag(organ, touch.clientX, touch.clientY, {
      touchId: touch.identifier,
      pointerType: "touch"
    });
  }, { passive: true });

  function trackedTouch(e) {
    var list = e.touches && e.touches.length ? e.touches : e.changedTouches;
    if (!list || !list.length) return null;
    if (!drag || drag.touchId == null) return list[0];
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i].identifier === drag.touchId) return list[i];
    }
    return null;
  }

  document.addEventListener("touchmove", function (e) {
    if (!drag) return;
    var touch = trackedTouch(e);
    if (!touch) return;
    if (e.cancelable) e.preventDefault();
    updateDrag(touch.clientX, touch.clientY);
  }, { passive: false });

  document.addEventListener("touchend", function (e) {
    if (!drag) return;
    var touch = trackedTouch(e);
    if (!touch && drag.touchId != null) return;
    if (drag.moved && e.cancelable) e.preventDefault();
    var point = touch || { clientX: drag.lastX, clientY: drag.lastY };
    finishDrag(point.clientX, point.clientY);
  });

  document.addEventListener("touchcancel", function (e) {
    if (!drag) return;
    var touch = trackedTouch(e);
    if (!touch && drag.touchId != null) return;
    cancelDrag();
  });

  function reset() {
    endDrag();
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

  var speaker = globalThis.SenseSpeech.bindOptionSpeakers();

  function resetAndQuiet() {
    speaker.stop();
    reset();
  }

  document.getElementById("restart").addEventListener("click", resetAndQuiet);
  document.getElementById("replay").addEventListener("click", resetAndQuiet);
  showEnd.addEventListener("click", openEnd);

  reset();
})();
