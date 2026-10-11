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

for (const item of lab.QUESTIONS) {
  const text = item.title + item.text + item.explain;
  assert(!/關掉|補救|失去感覺/.test(text), "no lost-sense prompt in q" + item.id);
  const picture = icons.scene(item.id);
  assert(picture.includes("<svg") && picture.includes("viewBox"), "scene " + item.id);
  assert(!/object-fit:\s*cover/.test(picture), "scene not cover " + item.id);
}

for (const name of ["eye", "ear", "nose", "tongue", "skin", "tooth", "shield", "bulb", "search", "star", "starOff"]) {
  const picture = icons.icon(name);
  assert(picture.includes("viewBox=\"0 0 64 64\""), "icon " + name);
}

const banned = ["感觉", "牙齿", "颜色", "软", "这", "听", "过", "学", "国", "书", "对", "问", "题", "选", "门", "东", "发", "从", "还", "进", "边", "气", "与", "会", "为", "广", "观", "识", "脚", "关", "开", "来", "时", "个", "后"];
const files = ["index.html", "match.html", "scenario.html", "README.md", "js/data.js", "js/match.js", "js/scenario.js", "js/scenes.js", "css/styles.css"];
for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const word of banned) {
    if (text.includes(word)) {
      assert(false, file + " contains simplified 「" + word + "」");
    }
  }
}

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("grade tests passed");
