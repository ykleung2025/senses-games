(function () {
  var CACHE = "4";

  var scenes = {
    1: {
      file: "scenario-1-hallway.jpg",
      alt: "學校走廊轉角，有彩色儲物櫃。穿黃衣的同學揮手，穿紅衣的同學行過。"
    },
    2: {
      file: "scenario-2-playground.jpg",
      alt: "操場上，老師吹哨，同學們行回集合。"
    },
    3: {
      file: "scenario-3-classroom-smell.jpg",
      alt: "班房裡冒出煙和焦味。女同學掩着鼻子，男同學露出驚訝的樣子。"
    },
    4: {
      file: "scenario-4-kettle.jpg",
      alt: "桌上的熱水壺冒出熱氣。女同學用手背靠近，沒有碰壺身。"
    },
    5: {
      file: "scenario-5-canteen.jpg",
      alt: "飯堂裡，同學看着號碼牌，又聽廣播才入座。"
    },
    6: {
      file: "scenario-6-library.jpg",
      alt: "圖書館裡，同學望着書架，尋找書脊上的號碼。"
    },
    7: {
      file: "scenario-7-stairs.jpg",
      alt: "下雨天的樓梯又濕又滑。同學扶着欄杆，慢慢行。"
    },
    8: {
      file: "scenario-8-art.jpg",
      alt: "美術課上，同學用手摸紙，分辨粗糙還是光滑。"
    },
    9: {
      file: "scenario-9-listen.jpg",
      alt: "同學閉上眼睛，雙手靠近耳朵，分辨拍手還是敲門。"
    },
    10: {
      file: "scenario-10-soap.jpg",
      alt: "桌上放着黃色肥皂和藍色濕毛巾。同學嗅一嗅，分辨哪一種是肥皂。"
    }
  };

  function scene(id) {
    var item = scenes[id];
    if (!item) {
      return '<img class="scene-photo" alt="情境" width="1280" height="720">';
    }
    return (
      '<img class="scene-photo" src="assets/scenes/' + item.file + "?v=" + CACHE + '" width="1280" height="720" alt="' + item.alt + '" decoding="async">'
    );
  }

  var api = globalThis.SenseIcons || {};
  api.scene = scene;
  globalThis.SenseIcons = api;
})();
