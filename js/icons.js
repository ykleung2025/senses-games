(function () {
  function svg(body) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false">' +
      body +
      "</svg>"
    );
  }

  var icons = {
    eye: svg(
      '<path d="M10 32c6-10 14-16 22-16s16 6 22 16c-6 10-14 16-22 16s-16-6-22-16z" fill="#ffffff" stroke="#24312e" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<circle cx="32" cy="32" r="8" fill="#2f7de1" stroke="#24312e" stroke-width="2"/>' +
      '<circle cx="32" cy="32" r="4" fill="#24312e"/>' +
      '<circle cx="29" cy="29" r="2" fill="#ffffff"/>'
    ),
    ear: svg(
      '<ellipse cx="34" cy="33" rx="13" ry="17" fill="#f4c9a6" stroke="#24312e" stroke-width="2.5"/>' +
      '<path d="M34 20c7 3 9 11 6 18" fill="none" stroke="#c4846a" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M31 24c6 2 8 12 3 18" fill="none" stroke="#e7b08e" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="30" cy="44" r="3.2" fill="#f0b898" stroke="#c4846a" stroke-width="1.5"/>'
    ),
    nose: svg(
      '<path d="M32 14c7 8 12 16 12 24 0 5-3 9-7 9-2.5 0-3.5-2-5-2s-2.5 2-5 2c-4 0-7-4-7-9 0-8 5-16 12-24z" fill="#f4c9a6" stroke="#24312e" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<ellipse cx="27" cy="40" rx="3" ry="4" fill="#24312e"/>' +
      '<ellipse cx="37" cy="40" rx="3" ry="4" fill="#24312e"/>'
    ),
    tongue: svg(
      '<path d="M14 28c0-7 8-12 18-12s18 5 18 12v4c0 12-8 20-18 20S14 44 14 32z" fill="#fff7f4" stroke="#24312e" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<ellipse cx="32" cy="40" rx="10" ry="8" fill="#e25b4a"/>' +
      '<path d="M22 30c2 2 6 2 8 0M34 30c2 2 6 2 8 0" fill="none" stroke="#24312e" stroke-width="2" stroke-linecap="round"/>'
    ),
    skin: svg(
      '<rect x="6" y="40" width="50" height="16" rx="8" fill="#f4c9a6" stroke="#24312e" stroke-width="2.2"/>' +
      '<rect x="4" y="18" width="8" height="30" rx="4" fill="#f4c9a6" stroke="#24312e" stroke-width="2.2"/>' +
      '<rect x="18" y="8" width="8" height="40" rx="4" fill="#f4c9a6" stroke="#24312e" stroke-width="2.2"/>' +
      '<rect x="32" y="12" width="8" height="36" rx="4" fill="#f4c9a6" stroke="#24312e" stroke-width="2.2"/>' +
      '<rect x="46" y="20" width="8" height="28" rx="4" fill="#f4c9a6" stroke="#24312e" stroke-width="2.2"/>' +
      '<ellipse cx="12" cy="48" rx="9" ry="6" fill="#f4c9a6" stroke="#24312e" stroke-width="2.2"/>'
    ),
    tooth: svg(
      '<path d="M22 16h20c2 0 6 6 6 16 0 8-2 14-5 20-2-6-3.5-8-6-8s-4 2-6 8c-3-6-5-12-5-20 0-10 4-16 6-16z" fill="#ffffff" stroke="#24312e" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<circle cx="28" cy="28" r="2" fill="#24312e"/>' +
      '<circle cx="36" cy="28" r="2" fill="#24312e"/>' +
      '<path d="M28 35q4 4 8 0" fill="none" stroke="#24312e" stroke-width="2" stroke-linecap="round"/>'
    ),
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

  function icon(name) {
    return icons[name] || "";
  }

  globalThis.SenseIcons = { icon: icon };
})();
