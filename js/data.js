(function () {
  var PAIRS = [
    { id: "eye", name: "眼睛", fn: "看東西、辨顏色", praise: "答對了！眼睛用來看東西、辨顏色。" },
    { id: "ear", name: "耳朵", fn: "聽聲音、分辨聲音", praise: "答對了！耳朵用來聽聲音、分辨聲音。" },
    { id: "nose", name: "鼻子", fn: "嗅氣味、分辨氣味", praise: "答對了！鼻子用來嗅氣味、分辨氣味。" },
    { id: "tongue", name: "舌頭", fn: "嘗味道、分辨味道", praise: "答對了！舌頭用來嘗味道、分辨味道。" },
    { id: "skin", name: "皮膚", fn: "感覺冷熱、軟硬等", praise: "答對了！皮膚用來感覺冷熱、軟硬等。" }
  ];

  var TRAP = {
    id: "tooth",
    name: "牙齒",
    fn: "咀嚼食物",
    message: "牙齒很有用，但不是感覺器官哦！"
  };

  var SENSES = [
    { id: "eye", name: "眼睛" },
    { id: "ear", name: "耳朵" },
    { id: "nose", name: "鼻子" },
    { id: "tongue", name: "舌頭" },
    { id: "skin", name: "皮膚" }
  ];

  var PURPOSES = [
    { id: "safe", name: "保障安全", icon: "shield" },
    { id: "solve", name: "解決生活問題", icon: "bulb" },
    { id: "know", name: "認識事物的特性", icon: "search" }
  ];

  var HINT_SENSE = "再想想：你主要靠哪種感覺？";
  var HINT_PURPOSE = "再想想：這些感覺在這裡有什麼重要？";

  var QUESTIONS = [
    {
      id: 1,
      title: "走廊轉角",
      text: "你在走廊轉角聽見急促的腳步聲，於是停低，等人行過。",
      senses: { required: ["ear"], optional: ["eye"] },
      purposes: ["safe"],
      explain: "耳朵聽到急腳步聲，提醒你停低等人，保障安全。用眼睛看清楚也可以。"
    },
    {
      id: 2,
      title: "操場哨聲",
      text: "在操場遠處，老師吹哨，你立即走回集合。",
      senses: { required: ["ear"], optional: [] },
      purposes: ["solve", "safe"],
      explain: "耳朵聽到哨聲，你知道要走回集合。這是解決生活問題，也保障安全。"
    },
    {
      id: 3,
      title: "班房焦味",
      text: "在班房裡，你聞到一陣異常的焦味，於是告訴老師。",
      senses: { required: ["nose"], optional: [] },
      purposes: ["safe"],
      explain: "鼻子聞到異常焦味，提醒你告訴老師，保障安全。"
    },
    {
      id: 4,
      title: "熱水壺",
      text: "手背感到熱水壺的熱氣，你不碰壺身，並叫大人幫忙。",
      senses: { required: ["skin"], optional: [] },
      purposes: ["safe"],
      explain: "皮膚感到熱氣，叫你不要碰壺身，並找大人幫忙，保障安全。"
    },
    {
      id: 5,
      title: "飯堂入座",
      text: "在飯堂，你看着號碼牌，又聽廣播，才入座。",
      senses: { required: ["eye", "ear"], optional: [] },
      purposes: ["solve"],
      explain: "眼睛看號碼牌，耳朵聽廣播，幫你找到座位，解決生活問題。"
    },
    {
      id: 6,
      title: "圖書館找書",
      text: "在圖書館，你用眼睛找書脊上的號碼。",
      senses: { required: ["eye"], optional: [] },
      purposes: ["solve", "know"],
      explain: "眼睛看着書脊號碼，幫你找對書，也認識書的記號。"
    },
    {
      id: 7,
      title: "雨天樓梯",
      text: "下雨天走樓梯，腳底覺得滑，你扶着欄杆慢慢行。",
      senses: { required: ["skin"], optional: ["eye"] },
      purposes: ["safe"],
      explain: "腳底的皮膚感到地面滑，你扶着欄杆慢慢行，保障安全。用眼睛看路也可以。"
    },
    {
      id: 8,
      title: "美術課摸紙",
      text: "美術課上，你摸一摸紙面，分辨粗糙還是光滑，再畫畫。",
      senses: { required: ["skin"], optional: ["eye"] },
      purposes: ["know"],
      explain: "皮膚摸到紙面，幫你認識它是粗糙還是光滑。用眼睛看也可以。"
    },
    {
      id: 9,
      title: "閉眼聽聲",
      text: "你閉上眼睛聽聲音，猜一猜是拍手還是敲門。",
      senses: { required: ["ear"], optional: [] },
      purposes: ["know"],
      explain: "你閉上眼睛，靠耳朵分辨拍手和敲門，認識聲音的特性。"
    },
    {
      id: 10,
      title: "肥皂和毛巾",
      text: "你嗅一嗅肥皂和濕毛巾，分辨哪一種是肥皂。",
      senses: { required: ["nose"], optional: [] },
      purposes: ["know"],
      explain: "鼻子分辨肥皂和濕毛巾的氣味，認識事物的特性。"
    }
  ];

  function organById(id) {
    if (id === TRAP.id) return TRAP;
    for (var i = 0; i < PAIRS.length; i += 1) {
      if (PAIRS[i].id === id) return PAIRS[i];
    }
    return null;
  }

  function functionText(id) {
    if (id === "chew") return TRAP.fn;
    var organ = organById(id);
    return organ ? organ.fn : "";
  }

  var SENSE_CLUE = {
    eye: "想想：我們用眼睛看。",
    ear: "想想：我們用耳朵聽。",
    nose: "想想：我們用鼻子聞氣味。",
    tongue: "想想：我們用舌頭嘗一嘗。",
    skin: "想想：皮膚可以感到冷和熱。"
  };

  var FN_JOB = {
    eye: "看東西",
    ear: "聽聲音",
    nose: "聞氣味",
    tongue: "嘗味道",
    skin: "感到冷熱"
  };

  function judgeMatch(organId, targetId) {
    if (organId === TRAP.id) {
      return { type: "trap", message: TRAP.message };
    }
    var organ = organById(organId);
    var name = organ ? organ.name : "";
    if (targetId === "not-sense") {
      return {
        type: "retry",
        message: "再看看，" + name + "是感覺器官。請配對它的功能，不要放在「這不是感覺器官」。"
      };
    }
    if (targetId === "chew") {
      return {
        type: "retry",
        message: "你把" + name + "配了「咀嚼食物」。咀嚼食物不是感覺功能。再為" + name + "選一個感覺功能吧。"
      };
    }
    if (organId === targetId) {
      return { type: "correct", message: organ ? organ.praise : "答對了！" };
    }
    var fn = functionText(targetId);
    var job = FN_JOB[targetId] || "這項功能";
    var clue = SENSE_CLUE[organId] || "再找找這個感覺器官的功能。";
    return {
      type: "retry",
      message: "你把" + name + "配了「" + fn + "」。" + job + "不是" + name + "的工作。" + clue
    };
  }

  function gradeSenses(selected, question) {
    var sel = new Set(selected);
    if (sel.size === 0) return { ok: false, empty: true };
    var required = question.senses.required;
    var optional = question.senses.optional;
    var allowed = new Set(required.concat(optional));
    var i;
    for (i = 0; i < required.length; i += 1) {
      if (!sel.has(required[i])) return { ok: false, empty: false };
    }
    var picked = Array.from(sel);
    for (i = 0; i < picked.length; i += 1) {
      if (!allowed.has(picked[i])) return { ok: false, empty: false };
    }
    return { ok: true, empty: false };
  }

  function gradePurposes(selected, question) {
    var sel = new Set(selected);
    var need = new Set(question.purposes);
    if (sel.size === 0) return { ok: false, empty: true };
    if (sel.size !== need.size) return { ok: false, empty: false };
    var picked = Array.from(sel);
    for (var i = 0; i < picked.length; i += 1) {
      if (!need.has(picked[i])) return { ok: false, empty: false };
    }
    return { ok: true, empty: false };
  }

  globalThis.SenseLab = {
    PAIRS: PAIRS,
    TRAP: TRAP,
    SENSES: SENSES,
    PURPOSES: PURPOSES,
    QUESTIONS: QUESTIONS,
    HINT_SENSE: HINT_SENSE,
    HINT_PURPOSE: HINT_PURPOSE,
    organById: organById,
    functionText: functionText,
    judgeMatch: judgeMatch,
    gradeSenses: gradeSenses,
    gradePurposes: gradePurposes
  };
})();
