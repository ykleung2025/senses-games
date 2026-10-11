(function () {
  var CACHE = "3";

  var photos = {
    eye: { src: "assets/organs/eye.png", alt: "眼睛" },
    ear: { src: "assets/organs/ear.png", alt: "耳朵" },
    nose: { src: "assets/organs/nose.png", alt: "鼻子" },
    tongue: { src: "assets/organs/tongue.png", alt: "舌頭" },
    skin: { src: "assets/organs/skin.png", alt: "皮膚" },
    tooth: { src: "assets/organs/tooth.png", alt: "牙齒" }
  };

  function svg(body) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false">' +
      body +
      "</svg>"
    );
  }

  var icons = {
    shield: svg(
      '<path d="M32 12l14 5v12c0 10-6 18-14 22-8-4-14-12-14-22V17z" fill="#e25b4a" stroke="#24312e" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M24 30l6 6 12-12" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    bulb: svg(
      '<circle cx="32" cy="26" r="12" fill="#f2b544" stroke="#24312e" stroke-width="2.5"/>' +
      '<rect x="26" y="36" width="12" height="8" rx="2" fill="#ffe08a" stroke="#24312e" stroke-width="2.5"/>' +
      '<path d="M28 48h8M29 52h6" fill="none" stroke="#24312e" stroke-width="2.5" stroke-linecap="round"/>'
    ),
    search: svg(
      '<circle cx="28" cy="28" r="12" fill="#d9f0ff" stroke="#24312e" stroke-width="2.5"/>' +
      '<path d="M37 37l12 12" fill="none" stroke="#24312e" stroke-width="4" stroke-linecap="round"/>'
    ),
    star: svg(
      '<path d="M32 12l5.5 16H54l-13.5 9.5 5 16.5L32 44l-13.5 10 5-16.5L10 28h16.5z" fill="#f2b544" stroke="#24312e" stroke-width="2" stroke-linejoin="round"/>'
    ),
    starOff: svg(
      '<path d="M32 12l5.5 16H54l-13.5 9.5 5 16.5L32 44l-13.5 10 5-16.5L10 28h16.5z" fill="#efe6d6" stroke="#b7aa96" stroke-width="2" stroke-linejoin="round"/>'
    )
  };

  function photo(name) {
    var item = photos[name];
    if (!item) return null;
    return { src: item.src + "?v=" + CACHE, alt: item.alt };
  }

  function icon(name) {
    var shot = photo(name);
    if (shot) {
      return (
        '<img src="' + shot.src + '" alt="" decoding="async" draggable="false">'
      );
    }
    return icons[name] || "";
  }

  globalThis.SenseIcons = { icon: icon, photo: photo };
})();
