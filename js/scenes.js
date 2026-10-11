(function () {
  function stage(label, inner) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="360" height="200" role="img" aria-label="' +
      label +
      '" preserveAspectRatio="xMidYMid meet">' +
      '<rect x="2" y="2" width="356" height="196" rx="22" fill="#fff8ee" stroke="#eadfcd" stroke-width="2"/>' +
      inner +
      "</svg>"
    );
  }

  function kid(x, y, shirt, eyes) {
    var eyeSvg =
      eyes === "closed"
        ? '<path d="M' + (x - 9) + " " + y + " q4.5 4 9 0 M" + (x + 1) + " " + y + ' q4.5 4 9 0" fill="none" stroke="#24312e" stroke-width="2.2" stroke-linecap="round"/>'
        : '<circle cx="' + (x - 5.5) + '" cy="' + (y - 1) + '" r="1.7" fill="#24312e"/>' +
          '<circle cx="' + (x + 5.5) + '" cy="' + (y - 1) + '" r="1.7" fill="#24312e"/>';
    return (
      '<ellipse cx="' + x + '" cy="' + (y + 48) + '" rx="16" ry="4.5" fill="#e4d7c4"/>' +
      '<path d="M' + (x - 13) + " " + (y + 16) + " h26 v16 a11 11 0 0 1 -11 11 h-4 a11 11 0 0 1 -11 -11 z\" fill=\"" +
      shirt +
      '" stroke="#24312e" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M' + (x - 14) + " " + (y - 2) + " Q" + x + " " + (y - 36) + " " + (x + 14) + " " + (y - 2) + '" fill="#3d2b22"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="15" fill="#f4c9a6" stroke="#24312e" stroke-width="2.5"/>' +
      eyeSvg +
      '<path d="M' + (x - 5) + " " + (y + 7) + ' q5 5 10 0" fill="none" stroke="#24312e" stroke-width="2" stroke-linecap="round"/>'
    );
  }

  function ground(y, color) {
    return '<rect x="18" y="' + y + '" width="324" height="' + (184 - y) + '" rx="10" fill="' + color + '"/>';
  }

  function label(x, y, value, size) {
    return (
      '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + (size || 16) + '" font-weight="700" fill="#24312e">' +
      value +
      "</text>"
    );
  }

  function placed(name, x, y, size) {
    var shot = globalThis.SenseIcons.photo(name);
    if (shot) {
      return (
        '<image href="' + shot.src + '" x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" preserveAspectRatio="xMidYMid meet"/>'
      );
    }
    var raw = globalThis.SenseIcons.icon(name).trim();
    var inner = raw.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
    return '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet">' + inner + "</svg>";
  }

  function waves(x, y, color) {
    return (
      '<path d="M' + x + " " + y + " c6-5 6-13 0-18\" fill=\"none\" stroke=\"" + color + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M' + (x + 8) + " " + (y + 3) + " c10-8 10-20 0-28\" fill=\"none\" stroke=\"" + color + '" stroke-width="3" stroke-linecap="round"/>'
    );
  }

  var drawers = {
    1: function () {
      return (
        '<img class="scene-photo" src="assets/scenes/scenario-1-hallway.jpg?v=2" width="1280" height="720" alt="樂樂和天天在學校走廊。樂樂揮手，天天行過彩色儲物櫃。" decoding="async">'
      );
    },
    2: function () {
      return stage(
        "操場遠處，老師吹哨",
        '<rect x="18" y="16" width="324" height="100" rx="12" fill="#d9f0ff"/>' +
          ground(112, "#b7e2c5") +
          '<circle cx="64" cy="42" r="14" fill="#ffe08a" stroke="#24312e" stroke-width="2"/>' +
          kid(78, 108, "#2f7de1") +
          '<circle cx="168" cy="124" r="10" fill="#f4c9a6" stroke="#24312e" stroke-width="2"/>' +
          '<circle cx="196" cy="124" r="10" fill="#f4c9a6" stroke="#24312e" stroke-width="2"/>' +
          '<rect x="156" y="136" width="52" height="16" rx="8" fill="#7a5cdb" stroke="#24312e" stroke-width="2"/>' +
          kid(286, 104, "#1f9d6a") +
          '<ellipse cx="312" cy="96" rx="14" ry="8" fill="#f2b544" stroke="#24312e" stroke-width="2.5"/>' +
          '<rect x="322" y="92" width="14" height="8" rx="2" fill="#f2b544" stroke="#24312e" stroke-width="2"/>' +
          waves(118, 100, "#7a5cdb")
      );
    },
    3: function () {
      return stage(
        "班房裡聞到異常焦味",
        '<rect x="18" y="20" width="324" height="88" fill="#f7f1e6"/>' +
          ground(128, "#f3e6cf") +
          '<rect x="230" y="32" width="78" height="52" rx="6" fill="#d9f0ff" stroke="#24312e" stroke-width="2.5"/>' +
          '<path d="M269 32v52M230 58h78" fill="none" stroke="#24312e" stroke-width="2"/>' +
          '<rect x="150" y="118" width="92" height="16" rx="4" fill="#e7c89a" stroke="#24312e" stroke-width="2.5"/>' +
          '<rect x="176" y="100" width="36" height="20" rx="4" fill="#d9dde3" stroke="#24312e" stroke-width="2.5"/>' +
          '<path d="M184 96c8-14 16-14 22 0" fill="none" stroke="#f0a050" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M178 90c10-16 22-16 32 0" fill="none" stroke="#f0a050" stroke-width="3" stroke-linecap="round"/>' +
          kid(78, 112, "#2f7de1") +
          kid(300, 108, "#1f9d6a")
      );
    },
    4: function () {
      return stage(
        "手背感到熱水壺的熱氣",
        ground(140, "#f3e6cf") +
          '<rect x="40" y="132" width="280" height="16" rx="6" fill="#e7c89a" stroke="#24312e" stroke-width="2.5"/>' +
          '<rect x="168" y="86" width="72" height="48" rx="18" fill="#d9dde3" stroke="#24312e" stroke-width="2.5"/>' +
          '<path d="M240 100h14a12 12 0 0 1 0 24h-14" fill="none" stroke="#24312e" stroke-width="2.5"/>' +
          '<rect x="190" y="76" width="28" height="12" rx="4" fill="#bfc6ce" stroke="#24312e" stroke-width="2.5"/>' +
          '<path d="M228 92c14 2 22 6 30 4" fill="none" stroke="#24312e" stroke-width="2.5" stroke-linecap="round"/>' +
          '<path d="M214 70c6-8 10-8 16 0M206 62c8-10 16-10 24 0M222 56c6-8 10-8 16 0" fill="none" stroke="#f0a050" stroke-width="3" stroke-linecap="round"/>' +
          placed("skin", 70, 72, 58) +
          '<path d="M132 100h28" fill="none" stroke="#c47a3a" stroke-width="3" stroke-dasharray="3 5" stroke-linecap="round"/>' +
          kid(300, 96, "#7a5cdb")
      );
    },
    5: function () {
      return stage(
        "飯堂看號碼牌又聽廣播",
        ground(136, "#f3e6cf") +
          '<rect x="188" y="36" width="92" height="70" rx="12" fill="#ffffff" stroke="#24312e" stroke-width="2.5"/>' +
          '<text x="234" y="84" text-anchor="middle" font-size="36" font-weight="700" fill="#24312e">12</text>' +
          '<rect x="48" y="40" width="36" height="28" rx="8" fill="#d9dde3" stroke="#24312e" stroke-width="2.5"/>' +
          '<circle cx="66" cy="78" r="10" fill="#bfc6ce" stroke="#24312e" stroke-width="2.5"/>' +
          waves(96, 78, "#7a5cdb") +
          kid(150, 112, "#2f7de1") +
          '<rect x="230" y="128" width="80" height="14" rx="6" fill="#e7c89a" stroke="#24312e" stroke-width="2"/>'
      );
    },
    6: function () {
      return stage(
        "圖書館用眼睛找書脊號碼",
        '<rect x="150" y="36" width="180" height="120" rx="8" fill="#efe2cc" stroke="#24312e" stroke-width="2.5"/>' +
          '<rect x="162" y="48" width="22" height="96" rx="3" fill="#e25b4a" stroke="#24312e" stroke-width="2"/>' +
          '<rect x="188" y="56" width="22" height="88" rx="3" fill="#1f9d6a" stroke="#24312e" stroke-width="2"/>' +
          '<rect x="214" y="46" width="54" height="98" rx="4" fill="#ffffff" stroke="#24312e" stroke-width="2.5"/>' +
          '<text x="241" y="104" text-anchor="middle" font-size="20" font-weight="700" fill="#24312e">328</text>' +
          '<rect x="272" y="52" width="22" height="92" rx="3" fill="#2f7de1" stroke="#24312e" stroke-width="2"/>' +
          '<rect x="298" y="60" width="20" height="84" rx="3" fill="#f2b544" stroke="#24312e" stroke-width="2"/>' +
          kid(78, 112, "#7a5cdb") +
          '<path d="M104 124h36" fill="none" stroke="#24312e" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M132 118l10 6-10 6" fill="none" stroke="#24312e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
      );
    },
    7: function () {
      return stage(
        "雨天樓梯，腳底覺得滑",
        '<rect x="18" y="16" width="324" height="168" rx="12" fill="#e7f3fb"/>' +
          '<path d="M36 24l-8 16M76 20l-8 16M116 26l-8 16M156 18l-8 16M196 24l-8 16M236 20l-8 16M276 26l-8 16M316 18l-8 16" fill="none" stroke="#5eb0e0" stroke-width="3" stroke-linecap="round"/>' +
          '<rect x="150" y="150" width="170" height="22" rx="4" fill="#f0e2c8" stroke="#24312e" stroke-width="2"/>' +
          '<rect x="176" y="124" width="144" height="22" rx="4" fill="#f7ebda" stroke="#24312e" stroke-width="2"/>' +
          '<rect x="202" y="98" width="118" height="22" rx="4" fill="#fff8ee" stroke="#24312e" stroke-width="2"/>' +
          '<path d="M188 78l-70 92" fill="none" stroke="#c47a3a" stroke-width="6" stroke-linecap="round"/>' +
          '<circle cx="150" cy="108" r="8" fill="#f4c9a6" stroke="#24312e" stroke-width="2"/>' +
          '<ellipse cx="168" cy="166" rx="12" ry="6" fill="#2f7de1" stroke="#24312e" stroke-width="2"/>' +
          '<path d="M186 160l10 8M196 158l8 10" fill="none" stroke="#5c6a64" stroke-width="2" stroke-linecap="round"/>' +
          kid(70, 112, "#2f7de1")
      );
    },
    8: function () {
      return stage(
        "美術課摸紙，分辨粗糙還是光滑",
        ground(146, "#f3e6cf") +
          '<rect x="36" y="132" width="250" height="16" rx="6" fill="#e7c89a" stroke="#24312e" stroke-width="2.5"/>' +
          '<rect x="48" y="78" width="92" height="62" rx="6" fill="#fffdf8" stroke="#24312e" stroke-width="2.5"/>' +
          '<circle cx="68" cy="98" r="2" fill="#c47a3a"/><circle cx="84" cy="108" r="2" fill="#c47a3a"/>' +
          '<circle cx="100" cy="96" r="2" fill="#c47a3a"/><circle cx="112" cy="116" r="2" fill="#c47a3a"/>' +
          '<circle cx="76" cy="120" r="2" fill="#c47a3a"/><circle cx="96" cy="124" r="2" fill="#c47a3a"/>' +
          '<rect x="168" y="78" width="92" height="62" rx="6" fill="#fffdf8" stroke="#24312e" stroke-width="2.5"/>' +
          '<path d="M184 96h60" fill="none" stroke="#d9ecf8" stroke-width="4" stroke-linecap="round"/>' +
          label(94, 176, "粗糙", 16) +
          label(214, 176, "光滑", 16) +
          placed("skin", 86, 28, 52) +
          '<rect x="292" y="108" width="16" height="40" rx="4" fill="#e25b4a" stroke="#24312e" stroke-width="2"/>' +
          '<path d="M292 108l8-12 8 12" fill="#f4c9a6" stroke="#24312e" stroke-width="2" stroke-linejoin="round"/>'
      );
    },
    9: function () {
      return stage(
        "閉上眼睛，聽拍手還是敲門",
        '<path d="M136 96Q180 8 224 96" fill="#3d2b22"/>' +
          '<circle cx="180" cy="104" r="42" fill="#f4c9a6" stroke="#24312e" stroke-width="3"/>' +
          '<path d="M156 100q10 8 20 0M188 100q10 8 20 0" fill="none" stroke="#24312e" stroke-width="2.5" stroke-linecap="round"/>' +
          '<path d="M164 122q16 12 32 0" fill="none" stroke="#24312e" stroke-width="2.5" stroke-linecap="round"/>' +
          '<path d="M214 96c10 2 16 12 14 22-2 8-10 12-16 8" fill="#f4c9a6" stroke="#7a5cdb" stroke-width="3" stroke-linejoin="round"/>' +
          '<rect x="36" y="86" width="26" height="34" rx="10" fill="#f4c9a6" stroke="#24312e" stroke-width="2.5"/>' +
          '<rect x="66" y="86" width="26" height="34" rx="10" fill="#f4c9a6" stroke="#24312e" stroke-width="2.5"/>' +
          label(64, 146, "拍手", 16) +
          '<rect x="262" y="64" width="58" height="86" rx="4" fill="#e7c89a" stroke="#24312e" stroke-width="2.5"/>' +
          '<circle cx="306" cy="108" r="4" fill="#24312e"/>' +
          waves(248, 96, "#7a5cdb") +
          label(290, 172, "敲門", 16)
      );
    },
    10: function () {
      return stage(
        "嗅肥皂和濕毛巾",
        ground(150, "#f6f1e6") +
          '<rect x="36" y="78" width="78" height="46" rx="12" fill="#f7e27a" stroke="#24312e" stroke-width="2.5"/>' +
          '<circle cx="62" cy="66" r="8" fill="#ffffff" stroke="#7ec8e3" stroke-width="2"/>' +
          '<circle cx="80" cy="58" r="6" fill="#ffffff" stroke="#7ec8e3" stroke-width="2"/>' +
          '<path d="M70 70c8-12 16-12 24 0" fill="none" stroke="#1f9d6a" stroke-width="3" stroke-linecap="round"/>' +
          label(75, 176, "肥皂", 16) +
          '<rect x="236" y="72" width="86" height="56" rx="8" fill="#9fd0f0" stroke="#24312e" stroke-width="2.5"/>' +
          '<path d="M250 90h58M250 104h58M250 118h40" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M300 60c2 8 2 10 0 16" fill="none" stroke="#2f7de1" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M248 68c8-12 18-12 26 0" fill="none" stroke="#2f7de1" stroke-width="3" stroke-linecap="round"/>' +
          label(279, 176, "濕毛巾", 16) +
          placed("nose", 150, 58, 60)
      );
    }
  };

  function scene(id) {
    var draw = drawers[id];
    if (!draw) {
      return stage("情境", label(180, 108, "情境", 18));
    }
    return draw();
  }

  var api = globalThis.SenseIcons || {};
  api.scene = scene;
  globalThis.SenseIcons = api;
})();
