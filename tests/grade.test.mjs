import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = {};
vm.createContext(sandbox);

function load(file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox, { filename: file });
}

load("js/data.js");
load("js/icons.js");
load("js/scenes.js");

const lab = sandbox.SenseLab;
const icons = sandbox.SenseIcons;
let failed = 0;

function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", message);
  }
}

assert(lab.TRAP.message === "牙齒很有用，但不是感覺器官哦！", "trap message");
assert(lab.HINT_SENSE === "再想想：你主要靠哪種感覺？", "sense hint");
assert(lab.QUESTIONS.length >= 8, "at least 8 questions");
assert(lab.QUESTIONS.length === 10, "10 questions");

assert(lab.judgeMatch("tooth", "eye").type === "trap", "tooth on eye");
assert(lab.judgeMatch("tooth", "chew").message === lab.TRAP.message, "tooth on chew");
assert(lab.judgeMatch("tooth", "not-sense").type === "trap", "tooth on zone");
assert(lab.judgeMatch("eye", "eye").type === "correct", "eye match");
assert(lab.judgeMatch("skin", "skin").type === "correct", "skin match");
assert(lab.judgeMatch("eye", "ear").type === "retry", "wrong pair");
assert(lab.judgeMatch("eye", "chew").type === "retry", "organ on chew");
assert(lab.judgeMatch("nose", "not-sense").type === "retry", "organ on zone");

const q = Object.fromEntries(lab.QUESTIONS.map((item) => [item.id, item]));

function senses(id, picked, ok) {
  assert(lab.gradeSenses(picked, q[id]).ok === ok, "senses q" + id + " " + picked.join("+"));
}

senses(1, ["ear"], true);
senses(1, ["ear", "eye"], true);
senses(1, ["eye"], false);
senses(1, ["ear", "nose"], false);
senses(1, [], false);
senses(2, ["ear"], true);
senses(2, ["ear", "eye"], false);
senses(5, ["eye", "ear"], true);
senses(5, ["eye"], false);
senses(5, ["eye", "ear", "nose"], false);
senses(9, ["ear"], true);
senses(9, ["ear", "eye"], false);
senses(7, ["skin"], true);
senses(7, ["skin", "eye"], true);
senses(8, ["skin", "eye"], true);
senses(10, ["nose"], true);
senses(4, ["skin"], true);
senses(3, ["nose"], true);

function purposes(id, picked, ok) {
  assert(lab.gradePurposes(picked, q[id]).ok === ok, "purposes q" + id + " " + picked.join("+"));
}

purposes(1, ["safe"], true);
purposes(1, ["safe", "solve"], false);
purposes(2, ["safe", "solve"], true);
purposes(2, ["safe"], false);
purposes(5, ["solve"], true);
purposes(6, ["solve", "know"], true);
purposes(6, ["know"], false);
purposes(8, ["know"], true);
purposes(9, ["know"], true);

const sceneFiles = {
  1: "scenario-1-hallway.jpg",
  2: "scenario-2-playground.jpg",
  3: "scenario-3-classroom-smell.jpg",
  4: "scenario-4-kettle.jpg",
  5: "scenario-5-canteen.jpg",
  6: "scenario-6-library.jpg",
  7: "scenario-7-stairs.jpg",
  8: "scenario-8-art.jpg",
  9: "scenario-9-listen.jpg",
  10: "scenario-10-soap.jpg"
};

for (const item of lab.QUESTIONS) {
  const text = item.title + item.text + item.explain;
  assert(!/關掉|補救|失去感覺/.test(text), "no lost-sense prompt in q" + item.id);
  const picture = icons.scene(item.id);
  const file = sceneFiles[item.id];
  assert(!/object-fit:\s*cover/.test(picture), "scene not cover " + item.id);
  assert(picture.includes("<img") && picture.includes("assets/scenes/" + file + "?v=3"), "scene " + item.id);
  assert(picture.includes('class="scene-photo"'), "scene photo class " + item.id);
  assert(fs.existsSync(path.join(root, "assets/scenes/" + file)), "scene file " + item.id);
}

for (const name of ["eye", "ear", "nose", "tongue", "skin", "tooth"]) {
  const picture = icons.icon(name);
  assert(picture.includes("<img") && picture.includes("assets/organs/" + name + ".png?v=3"), "emoji " + name);
  assert(!picture.includes("<svg"), "organ not svg " + name);
  assert(fs.existsSync(path.join(root, "assets/organs/" + name + ".png")), "file " + name);
  assert(!fs.existsSync(path.join(root, "assets/organs/" + name + ".webp")), "webp removed " + name);
}

for (const name of ["shield", "bulb", "search", "star", "starOff"]) {
  const picture = icons.icon(name);
  assert(picture.includes("viewBox=\"0 0 64 64\""), "icon " + name);
}

assert(fs.existsSync(path.join(root, "assets/scenes/scenario-1-hallway.jpg")), "hallway art");

load("js/speech.js");
const speech = sandbox.SenseSpeech;
const yue = { lang: "zh-HK", name: "Google Cantonese" };
const mandarin = { lang: "zh-TW", name: "Google Mandarin" };
const yueLang = { lang: "yue-HK", name: "Cantonese" };
assert(speech.scoreVoice(yue) > speech.scoreVoice(mandarin), "prefer zh-HK");
assert(speech.pickVoice([mandarin, yue]).lang === "zh-HK", "pick zh-HK");
assert(speech.pickVoice([yueLang]).lang === "yue-HK", "pick yue");
assert(speech.pickVoice([{ lang: "en-US", name: "English" }]) === null, "ignore english");
assert(speech.scoreVoice({ lang: "zh-yue", name: "Hong Kong" }) >= 100, "zh-yue");

const banned = ["感觉", "牙齿", "颜色", "软", "这", "听", "过", "学", "国", "书", "对", "问", "题", "选", "门", "东", "发", "从", "还", "进", "边", "气", "与", "会", "为", "广", "观", "识", "脚", "关", "开", "来", "时", "个", "后"];
const files = ["index.html", "match.html", "scenario.html", "README.md", "js/data.js", "js/match.js", "js/scenario.js", "js/scenes.js", "js/icons.js", "js/speech.js", "css/styles.css", "assets/organs/ATTRIBUTION.txt"];
for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const word of banned) {
    if (text.includes(word)) {
      assert(false, file + " contains simplified 「" + word + "」");
    }
  }
}

const css = fs.readFileSync(path.join(root, "css/styles.css"), "utf8");
assert(!/object-fit:\s*cover/.test(css), "css does not cover-crop");
assert(css.includes("object-fit: contain"), "css contains photos");
assert(!css.includes(".teacher"), "teacher css removed");
assert(css.includes(".scene-photo"), "scene photo style");

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(!indexHtml.includes("teacher"), "teacher block removed");
assert(!indexHtml.includes("三分鐘"), "teacher demo removed");
assert(indexHtml.includes("css/styles.css?v=3"), "index css cache");
assert(indexHtml.includes("js/icons.js?v=3"), "index js cache");
assert(!indexHtml.includes("?v=2"), "index cache bumped");

for (const file of ["match.html", "scenario.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert(!html.includes("js-speak"), file + " has no page speak button");
  assert(html.includes("js/speech.js?v=3"), file + " speech script");
  assert(html.includes("css/styles.css?v=3"), file + " css cache");
  assert(!html.includes("?v=2"), file + " cache bumped");
}

const matchJs = fs.readFileSync(path.join(root, "js/match.js"), "utf8");
const scenarioJs = fs.readFileSync(path.join(root, "js/scenario.js"), "utf8");
assert(matchJs.includes("js-option-speak"), "match option speak");
assert(matchJs.includes("朗讀"), "match speak label");
assert(matchJs.includes('icons.icon(id)'), "match uses organ emoji including tooth");
assert(scenarioJs.includes("js-option-speak"), "scenario option speak");
assert(scenarioJs.includes("朗讀"), "scenario speak label");
assert(!matchJs.includes("bindButtons"), "match does not read the whole page");
assert(!scenarioJs.includes("bindButtons"), "scenario does not read the whole page");

const speechJs = fs.readFileSync(path.join(root, "js/speech.js"), "utf8");
assert(speechJs.includes("synth.cancel"), "stop before new speech");
assert(speechJs.includes("bindOptionSpeakers"), "per option speakers");
assert(speechJs.includes('lang === "zh-hk"'), "prefer zh-HK");
assert(speechJs.includes('lang === "zh-yue"'), "prefer zh-yue");
assert(speechJs.includes('lang === "yue"'), "prefer yue");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("grade tests passed");
