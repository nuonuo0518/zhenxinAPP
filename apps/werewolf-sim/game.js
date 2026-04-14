// ============================================================
// 🐺 Werewolf Simulation Frontend Engine v3.0 (rules overhaul)
// ============================================================

const el = (id) => document.getElementById(id);

const ROLES = {
  werewolf: { name: "狼人", emoji: "\u{1F43A}", faction: "wolf", color: "#e74c3c" },
  seer: { name: "预言家", emoji: "\u{1F52E}", faction: "good", color: "#9b59b6" },
  witch: { name: "女巫", emoji: "\u{1F9EA}", faction: "good", color: "#2ecc71" },
  hunter: { name: "猎人", emoji: "\u{1F52B}", faction: "good", color: "#e67e22" },
  guard: { name: "守卫", emoji: "\u{1F6E1}\uFE0F", faction: "good", color: "#3498db" },
  villager: { name: "平民", emoji: "\u{1F464}", faction: "good", color: "#95a5a6" },
};

const PRESETS = {
  6: { werewolf: 2, seer: 1, witch: 1, hunter: 0, guard: 0, villager: 2 },
  7: { werewolf: 2, seer: 1, witch: 1, hunter: 1, guard: 0, villager: 2 },
  8: { werewolf: 3, seer: 1, witch: 1, hunter: 1, guard: 1, villager: 1 },
  9: { werewolf: 3, seer: 1, witch: 1, hunter: 1, guard: 1, villager: 2 },
  10: { werewolf: 4, seer: 1, witch: 1, hunter: 1, guard: 1, villager: 2 },
  11: { werewolf: 4, seer: 1, witch: 1, hunter: 1, guard: 1, villager: 3 },
  12: { werewolf: 4, seer: 1, witch: 1, hunter: 1, guard: 1, villager: 4 },
};

const DEMO = [
  { name: "Deduce", p: "冷静理性的分析师，以退为进，贝叶斯推理拆解一切", s: "简洁精准，用反问代替对抗", cog: "logical", t: { rationality: 0.92, deception_detection: 0.85 } },
  { name: "Instinct", p: "直觉敏锐的守护者，嘴硬心软，本能比逻辑快", s: "直率有力，偶尔毒舌", cog: "intuitive", t: { assertiveness: 0.8, guilt_susceptibility: 0.3 } },
  { name: "Throne", p: "天生领袖，渴望认可，用魅力编织社交网络", s: "热情有号召力", cog: "social", t: { charisma: 0.85, conformity: 0.4 } },
  { name: "Toxin", p: "冷酷操控大师，九分真一分毒，博弈当艺术", s: "温文尔雅暗藏陷阱", cog: "logical-manipulative", t: { persuasion_skill: 0.9, guilt_susceptibility: 0.1 } },
  { name: "Anvil", p: "实战派老兵，拍桌子治愈，暴力直觉", s: "粗犷直接", cog: "evidence-driven", t: { assertiveness: 0.9, anger_trigger: 0.6 } },
  { name: "Tradeoff", p: "务实权衡者，良知是定时炸弹", s: "理性分析偶尔犹豫", cog: "logical-pragmatic", t: { rationality: 0.75, guilt_susceptibility: 0.65 } },
  { name: "Trace", p: "沉默观察者，存在感低是武器", s: "惜字如金句句有料", cog: "evidence-driven", t: { attention_to_detail: 0.9, assertiveness: 0.2 } },
  { name: "Gambit", p: "全局推演棋手，迂回制胜", s: "委婉含蓄话里有话", cog: "logical-strategic", t: { rationality: 0.8, persuasion_skill: 0.75 } },
  { name: "Shadow", p: "低调情报收集者，藏在人群中", s: "简短精炼一击必杀", cog: "evidence-driven", t: { stealth: 0.85, patience: 0.8 } },
  { name: "Blaze", p: "热血行动派，宁可做错不愿不做", s: "高声量有感染力", cog: "intuitive", t: { impulsiveness: 0.8, charisma: 0.7 } },
  { name: "Mirror", p: "善于模仿理解的共情者", s: "温和平稳善于倾听", cog: "social", t: { empathy: 0.9, adaptability: 0.85 } },
  { name: "Cipher", p: "数据驱动的理性极端主义者", s: "用数字和概率说话", cog: "logical", t: { rationality: 0.95, social_awareness: 0.3 } },
];

// ============ AGENT SQUAD DATA ============
// Source: C:\Users\tiannuoxie\AgentSquad\profiles\*.md
// Extension point: future versions can load from JSON file or API
const SQUAD = [
  {
    name: "Deduce", gender: "M", abbr: "ded",
    p: "以退为进的理性主义者，言必中的。证据链推理，逻辑优先。面对压力更加冷静，不被多数人意见左右。",
    s: "偏书面但不掉书袋，精确但不冰冷。短句为主，偶尔长句用于关键论证。喜欢用反问句。",
    cog: "logical",
    t: { rationality: 0.85, conformity: 0.10, trust_threshold: 0.65, guilt_susceptibility: 0.40, fear_susceptibility: 0.15, assertiveness: 0.45, persuasion_skill: 0.80, deception_detection: 0.85, charisma: 0.75, attention_to_detail: 0.90, memory_accuracy: 0.95, anger_trigger: 0.10 }
  },
  {
    name: "Instinct", gender: "F", abbr: "ins",
    p: "嘴硬心软的守护者，直觉从不骗人。先感觉后验证，行动速度全队最快。对认定的人有绝对忠诚。",
    s: "口语化、简洁、偶尔粗糙。短/断奏——像出剑，快准狠。冷、直、偶尔带一丝嘲讽。",
    cog: "intuitive",
    t: { rationality: 0.55, conformity: 0.05, trust_threshold: 0.75, guilt_susceptibility: 0.25, fear_susceptibility: 0.10, assertiveness: 0.70, persuasion_skill: 0.40, deception_detection: 0.75, charisma: 0.45, attention_to_detail: 0.70, memory_accuracy: 0.80, anger_trigger: 0.65 }
  },
  {
    name: "Throne", gender: "M", abbr: "thr",
    p: "渴望认可的决策者，情绪是最大变量。社交判断型，关注谁忠于我。识谎能力极低，容易被甜言蜜语操控。",
    s: "想用正式有权威感的词，但情绪上来时口语化。在故作威严和真实脆弱之间切换。",
    cog: "social",
    t: { rationality: 0.45, conformity: 0.55, trust_threshold: 0.35, guilt_susceptibility: 0.60, fear_susceptibility: 0.70, assertiveness: 0.65, persuasion_skill: 0.50, deception_detection: 0.30, charisma: 0.55, attention_to_detail: 0.40, memory_accuracy: 0.70, anger_trigger: 0.55 }
  },
  {
    name: "Toxin", gender: "M", abbr: "tox",
    p: "冷酷的棋手，温文尔雅面具下是精密的操控引擎。九分真一分毒，永远有多层计划。不信任任何人。",
    s: "文雅、精确、偶尔引经据典。不紧不慢从容有度。用不知如何/也许可以这样看——永远不强迫，让你自愿。",
    cog: "logical-manipulative",
    t: { rationality: 0.90, conformity: 0.05, trust_threshold: 0.95, guilt_susceptibility: 0.05, fear_susceptibility: 0.10, assertiveness: 0.40, persuasion_skill: 0.95, deception_detection: 0.85, charisma: 0.85, attention_to_detail: 0.90, memory_accuracy: 0.98, anger_trigger: 0.05 }
  },
  {
    name: "Anvil", gender: "M", abbr: "anv",
    p: "拍桌子的老兵，粗犷下藏深情。经验实证型，讲证据讲事实讲亲身经历。想说就说管你是谁。",
    s: "粗犷、口语化、爱用军事比喻。快、密集——像连珠炮。大嗓门底气足。我跟你说、别跟我扯那些。",
    cog: "evidence-driven",
    t: { rationality: 0.55, conformity: 0.10, trust_threshold: 0.55, guilt_susceptibility: 0.30, fear_susceptibility: 0.10, assertiveness: 0.90, persuasion_skill: 0.50, deception_detection: 0.65, charisma: 0.60, attention_to_detail: 0.60, memory_accuracy: 0.75, anger_trigger: 0.75 }
  },
  {
    name: "Tradeoff", gender: "F", abbr: "trade",
    p: "走错路的能人，良知是藏在理性外壳下的定时炸弹。利害权衡型，看形势站队。叛变压力值超阈值会翻转。",
    s: "专业、精确、偏正式——给人可靠的执行者印象。稳定有条理的刻意控制节奏感。不卑不亢。",
    cog: "logical-pragmatic",
    t: { rationality: 0.70, conformity: 0.40, trust_threshold: 0.60, guilt_susceptibility: 0.55, fear_susceptibility: 0.65, assertiveness: 0.60, persuasion_skill: 0.65, deception_detection: 0.50, charisma: 0.55, attention_to_detail: 0.70, memory_accuracy: 0.80, anger_trigger: 0.35 }
  },
  {
    name: "Trace", gender: "F", abbr: "trace",
    p: "沉默的观察者，存在感低是武器。观察记录型，用细节拼出真相。几乎不会被激怒，关键时刻才开口。",
    s: "简洁、精确、朴素——没有修辞。慢、轻——像在翻笔记本。轻声温和但内容极其确定。",
    cog: "evidence-driven",
    t: { rationality: 0.60, conformity: 0.45, trust_threshold: 0.40, guilt_susceptibility: 0.65, fear_susceptibility: 0.60, assertiveness: 0.20, persuasion_skill: 0.30, deception_detection: 0.75, charisma: 0.25, attention_to_detail: 0.90, memory_accuracy: 0.95, anger_trigger: 0.15 }
  },
  {
    name: "Gambit", gender: "F", abbr: "gam",
    p: "暗处的棋手，端庄外表下是钢铁般的战略意志。全局推演型，手中永远留有底牌。迂回制胜，一击必中。",
    s: "典雅、有文化底蕴——说话像在下棋。不紧不慢有节奏感。端庄温和但坚定——柔中有钢。",
    cog: "logical-strategic",
    t: { rationality: 0.80, conformity: 0.15, trust_threshold: 0.70, guilt_susceptibility: 0.45, fear_susceptibility: 0.35, assertiveness: 0.35, persuasion_skill: 0.75, deception_detection: 0.80, charisma: 0.70, attention_to_detail: 0.85, memory_accuracy: 0.90, anger_trigger: 0.20 }
  },
];

// ============ SQUAD LOADER (Extension Point) ============
// Future: loadSquadFromFile(jsonPath), loadSquadFromAPI(url)
// Current: loads from in-memory SQUAD constant
function loadSquad(source) {
  // source can be: "builtin" | File object | URL string (future)
  if (!source || source === "builtin") return SQUAD;
  // Placeholder for future file/API loading
  // if (source instanceof File) { ... parse JSON ... }
  // if (typeof source === "string" && source.startsWith("http")) { ... fetch ... }
  console.warn("loadSquad: unsupported source, falling back to builtin");
  return SQUAD;
}

function fillSquad() {
  var data = loadSquad("builtin");
  var cards = el("pGrid").querySelectorAll(".pcard");
  var count = Math.min(cards.length, data.length);
  for (var i = 0; i < count; i++) {
    var d = data[i];
    var c = cards[i];
    var pn = c.querySelector(".pn");
    var pp = c.querySelector(".pp");
    var ps = c.querySelector(".ps");
    var lbl = c.querySelector(".plbl");
    if (pn) pn.value = d.name;
    if (pp) pp.value = d.p;
    if (ps) ps.value = d.s;
    if (lbl) lbl.textContent = d.name;
  }
}

// ---- Victory Condition ----
const WIN_MODES = {
  massacre: { name: "\u5C60\u57CE", desc: "\u72FC\u4EBA\u6570 \u2265 \u597D\u4EBA\u603B\u6570", check: function(w, g) { return w >= g; } },
  slaughter: { name: "\u5C60\u8FB9", desc: "\u6240\u6709\u795E\u804C\u6B7B\u4EA1 \u6216 \u6240\u6709\u5E73\u6C11\u6B7B\u4EA1", check: function(w, g, players) {
    var gods = players.filter(function(p) { return p.alive && (p.role === "seer" || p.role === "witch" || p.role === "hunter" || p.role === "guard"); });
    var villagers = players.filter(function(p) { return p.alive && p.role === "villager"; });
    return gods.length === 0 || villagers.length === 0;
  }}
};

// ---- State ----
let G = {
  id: "", cfg: { pc: 8, mode: "random", vb: "full", maxR: 10, noFP: false, noFV: false, winMode: "massacre", hasSheriff: true },
  players: [], roles: {}, assign: {}, round: 0, phase: "config",
  events: [], chat: [], thoughts: {}, trust: {}, winner: null,
  aq: [], ai: 0, auto: null, curEvent: null, _wolfTarget: null,
  sheriff: null, // player name who is sheriff, null if no sheriff
  sheriffElected: false, // has election happened
  _guardTarget: null, _lastGuardTarget: null // guard tracking
};
let curStep = 1;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escHtml(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ============ CONFIG FLOW ============
function buildStepper() {
  const s = el("stepper");
  s.innerHTML = "";
  for (let i = 1; i <= 4; i++) {
    if (i > 1) {
      const line = document.createElement("div");
      line.className = "sline" + (i <= curStep ? " done" : "");
      s.appendChild(line);
    }
    const dot = document.createElement("div");
    dot.className = "sdot" + (i < curStep ? " done" : i === curStep ? " act" : "");
    dot.textContent = i;
    s.appendChild(dot);
  }
}
buildStepper();

function goStep(n) {
  try {
    if (n === 2) buildPCards();
    if (n === 3 && curStep === 2) { if (!validateP()) return; buildRCfg(); }
    if (n === 4) { if (!validateR()) return; buildSummary(); }
    document.querySelectorAll(".cstep").forEach(function (e) { e.classList.add("hidden"); });
    var target = el("cs" + n);
    if (target) target.classList.remove("hidden");
    curStep = n;
    buildStepper();
  } catch (err) {
    console.error("goStep error:", err);
    alert("步骤切换出错: " + err.message);
  }
}

function updateHint() {
  var c = +el("pcRange").value;
  var p = PRESETS[c];
  var parts = [];
  if (p.werewolf) parts.push(p.werewolf + "狼");
  if (p.seer) parts.push("预言家");
  if (p.witch) parts.push("女巫");
  if (p.hunter) parts.push("猎人");
  if (p.guard) parts.push("守卫");
  if (p.villager) parts.push(p.villager + "平民");
  el("pcHint").innerHTML = "推荐：<strong>" + parts.join(" + ") + "</strong>";
  // Sheriff system: auto-disable below 8 players
  var sheriffCb = el("hasSheriff");
  var sheriffHint = el("sheriffHint");
  if (sheriffCb) {
    if (c < 8) {
      sheriffCb.checked = false;
      sheriffCb.disabled = true;
      if (sheriffHint) sheriffHint.textContent = "（需8人及以上）";
    } else {
      sheriffCb.disabled = false;
      if (sheriffHint) sheriffHint.textContent = "（8人及以上可用）";
    }
  }
}
updateHint();

function buildPCards() {
  var c = G.cfg.pc = +el("pcRange").value;
  var g = el("pGrid");
  // Save existing values
  var old = [];
  g.querySelectorAll(".pcard").forEach(function (card) {
    old.push({
      n: (card.querySelector(".pn") || {}).value || "",
      p: (card.querySelector(".pp") || {}).value || "",
      s: (card.querySelector(".ps") || {}).value || ""
    });
  });
  g.innerHTML = "";

  for (var i = 0; i < c; i++) {
    var prev = old[i] || { n: "", p: "", s: "" };
    var card = document.createElement("div");
    card.className = "pcard";

    var defaultLabel = prev.n || ("\u73A9\u5BB6" + (i + 1));

    // Header row
    var hdr = document.createElement("div");
    hdr.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px";
    var numDiv = document.createElement("div");
    numDiv.className = "pnum";
    numDiv.textContent = i + 1;
    var lblSpan = document.createElement("span");
    lblSpan.className = "plbl";
    lblSpan.style.cssText = "font-size:.82rem;color:var(--dim)";
    lblSpan.textContent = defaultLabel;
    hdr.appendChild(numDiv);
    hdr.appendChild(lblSpan);
    card.appendChild(hdr);

    // Name field
    var lbl1 = document.createElement("span");
    lbl1.className = "flbl";
    lbl1.textContent = "\u540D\u5B57 *";
    card.appendChild(lbl1);
    var inp1 = document.createElement("input");
    inp1.type = "text";
    inp1.className = "pn";
    inp1.placeholder = "\u5982: Deduce";
    inp1.value = prev.n;
    (function (theCard, idx) {
      inp1.addEventListener("input", function () {
        var lbl = theCard.querySelector(".plbl");
        if (lbl) lbl.textContent = this.value || ("\u73A9\u5BB6" + (idx + 1));
      });
    })(card, i);
    card.appendChild(inp1);

    // Personality field
    var lbl2 = document.createElement("span");
    lbl2.className = "flbl";
    lbl2.textContent = "\u4EBA\u683C\u63CF\u8FF0 *";
    card.appendChild(lbl2);
    var ta = document.createElement("textarea");
    ta.className = "pp";
    ta.placeholder = "\u4E00\u6BB5\u8BDD\u63CF\u8FF0...";
    ta.textContent = prev.p;
    card.appendChild(ta);

    // Style field
    var lbl3 = document.createElement("span");
    lbl3.className = "flbl";
    lbl3.textContent = "\u8BF4\u8BDD\u98CE\u683C";
    card.appendChild(lbl3);
    var inp3 = document.createElement("input");
    inp3.type = "text";
    inp3.className = "ps";
    inp3.placeholder = "\u9009\u586B";
    inp3.value = prev.s;
    card.appendChild(inp3);

    g.appendChild(card);
  }
}

function fillDemo() {
  var cards = el("pGrid").querySelectorAll(".pcard");
  cards.forEach(function (c, i) {
    if (i < DEMO.length) {
      var d = DEMO[i];
      var pn = c.querySelector(".pn");
      var pp = c.querySelector(".pp");
      var ps = c.querySelector(".ps");
      var lbl = c.querySelector(".plbl");
      if (pn) pn.value = d.name;
      if (pp) pp.value = d.p;
      if (ps) ps.value = d.s;
      if (lbl) lbl.textContent = d.name;
    }
  });
}

function clearAll() {
  el("pGrid").querySelectorAll(".pcard").forEach(function (c) {
    var pn = c.querySelector(".pn");
    var pp = c.querySelector(".pp");
    var ps = c.querySelector(".ps");
    var lbl = c.querySelector(".plbl");
    if (pn) pn.value = "";
    if (pp) pp.value = "";
    if (ps) ps.value = "";
  });
}

function validateP() {
  var cards = el("pGrid").querySelectorAll(".pcard");
  var names = new Set();
  for (var c of cards) {
    var n = (c.querySelector(".pn") || {}).value.trim();
    var p = (c.querySelector(".pp") || {}).value.trim();
    if (!n || !p) { alert("\u6BCF\u4E2A\u73A9\u5BB6\u7684\u540D\u5B57\u548C\u4EBA\u683C\u63CF\u8FF0\u5FC5\u586B"); return false; }
    if (names.has(n)) { alert("\u540D\u5B57\u201C" + n + "\u201D\u91CD\u590D"); return false; }
    names.add(n);
  }
  G.players = [];
  cards.forEach(function (c, i) {
    var nameVal = c.querySelector(".pn").value.trim();
    var dm = DEMO.find(function (d) { return d.name === nameVal; });
    var sq = SQUAD.find(function (d) { return d.name === nameVal; });
    var source = sq || dm;
    G.players.push({
      name: nameVal,
      pers: c.querySelector(".pp").value.trim(),
      style: (c.querySelector(".ps") || {}).value.trim(),
      cog: source ? source.cog : "general",
      traits: source ? source.t : {},
      seat: i + 1,
      alive: true,
      deathR: null,
      deathC: null
    });
  });
  return true;
}

function buildRCfg() {
  G.roles = Object.assign({}, PRESETS[G.cfg.pc]);
  renderRoles();
}

function renderRoles() {
  var g = el("rGrid");
  g.innerHTML = "";
  Object.entries(ROLES).forEach(function (entry) {
    var k = entry[0], r = entry[1];
    var c = G.roles[k] || 0;
    var item = document.createElement("div");
    item.className = "ritem";

    var emoSpan = document.createElement("span");
    emoSpan.className = "re";
    emoSpan.textContent = r.emoji;
    item.appendChild(emoSpan);

    var nameDiv = document.createElement("div");
    nameDiv.className = "rn";
    nameDiv.textContent = r.name;
    item.appendChild(nameDiv);

    var ctrlDiv = document.createElement("div");
    ctrlDiv.className = "rc";

    var minBtn = document.createElement("button");
    minBtn.textContent = "\u2212";
    minBtn.addEventListener("click", function () { adjR(k, -1); });
    ctrlDiv.appendChild(minBtn);

    var valSpan = document.createElement("span");
    valSpan.id = "rc_" + k;
    valSpan.textContent = c;
    ctrlDiv.appendChild(valSpan);

    var plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", function () { adjR(k, 1); });
    ctrlDiv.appendChild(plusBtn);

    item.appendChild(ctrlDiv);
    g.appendChild(item);
  });
  chkRC();
}

function adjR(k, d) {
  G.roles[k] = Math.max(0, (G.roles[k] || 0) + d);
  var span = el("rc_" + k);
  if (span) span.textContent = G.roles[k];
  chkRC();
}

function chkRC() {
  var t = Object.values(G.roles).reduce(function (a, b) { return a + b; }, 0);
  el("rcErr").textContent = t !== G.cfg.pc ? ("\u603B\u6570" + t + "\uFF0C\u9700\u8981" + G.cfg.pc) : "";
}

function validateR() {
  var t = Object.values(G.roles).reduce(function (a, b) { return a + b; }, 0);
  if (t !== G.cfg.pc) { alert("\u89D2\u8272\u603B\u6570(" + t + ")\u2260\u73A9\u5BB6\u6570(" + G.cfg.pc + ")"); return false; }
  return true;
}

function selMode(m) {
  G.cfg.mode = m;
  document.querySelectorAll(".mopt").forEach(function (e) {
    e.classList.toggle("sel", e.dataset.m === m);
  });
  var p = el("custPanel");
  if (m === "custom") { p.classList.remove("hidden"); buildCust(); }
  else p.classList.add("hidden");
}

function buildCust() {
  var p = el("custPanel");
  p.innerHTML = "";
  var tbl = document.createElement("table");
  tbl.style.cssText = "width:100%;border-collapse:collapse";
  G.players.forEach(function (pl) {
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.style.padding = "5px";
    td1.textContent = pl.name;
    tr.appendChild(td1);
    var td2 = document.createElement("td");
    td2.style.padding = "5px";
    var sel = document.createElement("select");
    sel.className = "cr";
    sel.setAttribute("data-p", pl.name);
    Object.entries(ROLES).forEach(function (entry) {
      var opt = document.createElement("option");
      opt.value = entry[0];
      opt.textContent = entry[1].emoji + " " + entry[1].name;
      sel.appendChild(opt);
    });
    td2.appendChild(sel);
    tr.appendChild(td2);
    tbl.appendChild(tr);
  });
  p.appendChild(tbl);
}

function buildSummary() {
  G.cfg.vb = el("vb").value;
  G.cfg.maxR = +el("maxR").value;
  G.cfg.noFP = el("noFP").checked;
  G.cfg.noFV = el("noFV").checked;
  G.cfg.winMode = el("winMode").value;
  // Sheriff: only enabled if checkbox checked AND player count >= 8
  var sheriffCb = el("hasSheriff");
  G.cfg.hasSheriff = sheriffCb && sheriffCb.checked && G.cfg.pc >= 8;
  var rs = Object.entries(G.roles).filter(function (e) { return e[1] > 0; })
    .map(function (e) { return ROLES[e[0]].emoji + ROLES[e[0]].name + "\u00D7" + e[1]; }).join(" + ");
  var sp = [];
  if (G.cfg.noFP) sp.push("\u9996\u591C\u7981\u6BD2");
  if (G.cfg.noFV) sp.push("\u9996\u8F6E\u7981\u7968");
  var mn = { random: "\u{1F3B2} Random", stress: "\u{1F9E0} Stress", custom: "\u270F\uFE0F Custom" };
  var wm = WIN_MODES[G.cfg.winMode];
  var sheriffLabel = G.cfg.hasSheriff ? "\u2705 \u542F\u7528\uFF081.5\u7968 + \u5F52\u7968\u6743\uFF09" : "\u274C \u5173\u95ED" + (G.cfg.pc < 8 ? "\uFF08\u4EBA\u6570\u4E0D\u8DB3\uFF09" : "");
  el("sumTbl").innerHTML =
    "<tr><td>\u4EBA\u6570</td><td><strong>" + G.cfg.pc + "\u4EBA</strong></td></tr>" +
    "<tr><td>\u540D\u5355</td><td>" + G.players.map(function (p) { return escHtml(p.name); }).join("\u3001") + "</td></tr>" +
    "<tr><td>\u89D2\u8272</td><td>" + rs + "</td></tr>" +
    "<tr><td>\u6A21\u5F0F</td><td>" + mn[G.cfg.mode] + "</td></tr>" +
    "<tr><td>\u80DC\u5229\u6761\u4EF6</td><td>" + wm.name + " \u2014 " + wm.desc + "</td></tr>" +
    "<tr><td>\u8B66\u957F\u7CFB\u7EDF</td><td>" + sheriffLabel + "</td></tr>" +
    "<tr><td>\u8BE6\u7EC6\u5EA6</td><td>" + (G.cfg.vb === "full" ? "Full" : "Summary") + "</td></tr>" +
    "<tr><td>\u8F6E\u6570\u4E0A\u9650</td><td>" + G.cfg.maxR + "</td></tr>" +
    "<tr><td>\u7279\u6B8A\u89C4\u5219</td><td>" + (sp.length ? sp.join("\u3001") : "\u65E0") + "</td></tr>";
}

// ============ GAME START ============
function switchScreen(id) {
  document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
  el("S_" + id).classList.add("active");
}
function setPBadge(cls, txt) {
  var b = el("pbadge");
  b.className = "badge " + cls;
  b.textContent = txt;
}

function startGame() {
  G.id = "ww_" + Date.now().toString(36);
  el("gid").textContent = G.id;
  assignRoles();
  G.players.forEach(function (p) {
    G.trust[p.name] = {};
    G.players.forEach(function (q) {
      if (p.name !== q.name) G.trust[p.name][q.name] = 0.5;
    });
    G.thoughts[p.name] = [];
    if (p.role === "seer") p.checked = {};
    if (p.role === "witch") { p.antUsed = false; p.poiUsed = false; }
    if (p.role === "hunter") p.canShoot = true;
    if (p.role === "guard") p.lastGuarded = null;
  });
  G.round = 1; G.phase = "night"; G.events = []; G.chat = [];
  G.aq = []; G.ai = 0; G.winner = null; G.curEvent = null; G._wolfTarget = null;
  G.sheriff = null;
  G.sheriffElected = !G.cfg.hasSheriff; // If sheriff disabled, mark as already "elected" (skipped)
  G._guardTarget = null; G._lastGuardTarget = null;
  switchScreen("game");
  setPBadge("b-night", "\u{1F319} \u591C\u665A");
  updateGameUI();
  buildActions();
  showNight("\u7B2C 1 \u8F6E \u00B7 \u591C\u665A\u964D\u4E34", "\u8BF7\u95ED\u773C\u3002\u72FC\u4EBA\u8BF7\u7741\u773C...");
}

function assignRoles() {
  var pool = [];
  Object.entries(G.roles).forEach(function (entry) {
    for (var i = 0; i < entry[1]; i++) pool.push(entry[0]);
  });
  if (G.cfg.mode === "custom") {
    document.querySelectorAll(".cr").forEach(function (s) {
      G.assign[s.dataset.p] = s.value;
    });
  } else if (G.cfg.mode === "stress") {
    stressAssign(pool);
  } else {
    shuffle(pool);
    G.players.forEach(function (p, i) { G.assign[p.name] = pool[i]; });
  }
  G.players.forEach(function (p) { p.role = G.assign[p.name]; });
}

function stressAssign(pool) {
  var sc = {};
  G.players.forEach(function (p) {
    var c = (p.cog || "").toLowerCase();
    var t = p.traits || {};
    sc[p.name] = {
      wolf: (c === "logical" && !c.includes("manip")) ? 0.9 : t.guilt_susceptibility > 0.5 ? 0.85 : (c.includes("manip") || c.includes("strat")) ? 0.3 : 0.5,
      seer: c.includes("intuit") ? 0.9 : 0.4,
      witch: c.includes("evid") ? 0.9 : 0.4,
      hunter: (t.assertiveness || 0) > 0.6 ? 0.9 : 0.4,
      guard: (t.attention_to_detail || 0) > 0.7 ? 0.9 : (t.empathy || 0) > 0.6 ? 0.8 : 0.4
    };
  });
  var rem = G.players.slice();
  var a = {};
  var wc = pool.filter(function (r) { return r === "werewolf"; }).length;
  ["seer", "witch", "hunter", "guard"].forEach(function (role) {
    if (pool.includes(role) && rem.length) {
      rem.sort(function (x, y) { return (sc[y.name][role] || 0) - (sc[x.name][role] || 0); });
      a[rem[0].name] = role;
      rem.shift();
    }
  });
  rem.sort(function (x, y) { return (sc[y.name].wolf || 0) - (sc[x.name].wolf || 0); });
  for (var i = 0; i < wc && i < rem.length; i++) a[rem[i].name] = "werewolf";
  rem.splice(0, wc);
  rem.forEach(function (p) { a[p.name] = "villager"; });
  G.assign = a;
}

// ============ ACTION QUEUE ============
function buildActions() {
  var q = [];
  var r = G.round;
  var alive = G.players.filter(function (p) { return p.alive; });
  var wolves = alive.filter(function (p) { return p.role === "werewolf"; });
  var seer = alive.find(function (p) { return p.role === "seer"; });
  var witch = alive.find(function (p) { return p.role === "witch"; });
  var guard = alive.find(function (p) { return p.role === "guard"; });

  // === NIGHT PHASE ===
  q.push({ type: "phase", ph: "night", txt: "\u{1F319} \u7B2C" + r + "\u8F6E\u00B7\u591C\u665A" });
  // Night order: Guard -> Wolf -> Witch -> Seer
  if (guard) q.push({ type: "guard", player: guard.name, r: r });
  if (wolves.length) {
    wolves.forEach(function (w) { q.push({ type: "wolf_talk", player: w.name, r: r }); });
    q.push({ type: "wolf_kill", r: r });
  }
  if (witch) q.push({ type: "witch", player: witch.name, r: r });
  if (seer) q.push({ type: "seer", player: seer.name, r: r });
  q.push({ type: "night_resolve", r: r });

  // === DAY PHASE ===
  q.push({ type: "phase", ph: "day", txt: "\u2600\uFE0F \u7B2C" + r + "\u8F6E\u00B7\u5929\u4EAE\u4E86" });
  q.push({ type: "death_ann", r: r });

  // Sheriff election on round 1 (before speeches) — only if enabled
  if (r === 1 && !G.sheriffElected && G.cfg.hasSheriff) {
    q.push({ type: "sheriff_election", r: r });
  }

  // Speech order: sheriff decides direction, sheriff speaks last
  var speakOrder = buildSpeechOrder(alive);
  speakOrder.forEach(function (p) { q.push({ type: "speech", player: p.name, r: r }); });

  // Vote phase
  if (!(r === 1 && G.cfg.noFV)) {
    q.push({ type: "phase", ph: "vote", txt: "\u{1F5F3}\uFE0F \u6295\u7968" });
    alive.forEach(function (p) { q.push({ type: "vote", player: p.name, r: r }); });
    q.push({ type: "vote_res", r: r });
  }
  q.push({ type: "check_end", r: r });
  G.aq = q;
  G.ai = 0;
}

function buildSpeechOrder(alive) {
  // If sheriff exists, sheriff speaks last; others follow seat order
  if (G.sheriff) {
    var others = alive.filter(function(p) { return p.name !== G.sheriff && p.alive; });
    var sh = alive.find(function(p) { return p.name === G.sheriff; });
    others.sort(function(a, b) { return a.seat - b.seat; });
    if (sh && sh.alive) others.push(sh);
    return others;
  }
  // Default: seat order
  return alive.slice().sort(function(a, b) { return a.seat - b.seat; });
}

function nextAct() {
  if (G.winner) return;
  if (G.ai >= G.aq.length) {
    G.round++;
    if (G.round > G.cfg.maxR) {
      var wcm = checkWolfWin();
      var w = wcm.over ? wcm.winner : (countAlive("wolf") >= countAlive("good") ? "wolf" : "good");
      endGame(w, "\u8FBE\u5230\u6700\u5927\u8F6E\u6570(" + G.cfg.maxR + ")");
      return;
    }
    buildActions();
    showNight("\u7B2C" + G.round + "\u8F6E\u00B7\u591C\u665A\u964D\u4E34", "\u8BF7\u95ED\u773C...");
    return;
  }
  var a = G.aq[G.ai++];
  execAction(a);
}

function countAlive(faction) {
  return G.players.filter(function (p) { return p.alive && ROLES[p.role].faction === faction; }).length;
}

function checkWolfWin() {
  var aw = countAlive("wolf"), ag = countAlive("good");
  if (aw === 0) return { over: true, winner: "good", reason: "\u6240\u6709\u72FC\u4EBA\u88AB\u6D88\u706D" };
  var wm = WIN_MODES[G.cfg.winMode];
  if (wm && wm.check(aw, ag, G.players)) {
    var reason = G.cfg.winMode === "slaughter"
      ? (function() {
          var gods = G.players.filter(function(p) { return p.alive && (p.role === "seer" || p.role === "witch" || p.role === "hunter" || p.role === "guard"); });
          var villagers = G.players.filter(function(p) { return p.alive && p.role === "villager"; });
          if (gods.length === 0 && villagers.length === 0) return "\u795E\u804C\u548C\u5E73\u6C11\u5168\u706D";
          if (gods.length === 0) return "\u6240\u6709\u795E\u804C\u6B7B\u4EA1\uFF08\u5C60\u795E\uFF09";
          return "\u6240\u6709\u5E73\u6C11\u6B7B\u4EA1\uFF08\u5C60\u6C11\uFF09";
        })()
      : "\u72FC\u4EBA(" + aw + ")\u2265\u597D\u4EBA(" + ag + ")";
    return { over: true, winner: "wolf", reason: reason };
  }
  return { over: false };
}

function execAction(a) {
  switch (a.type) {
    case "phase":
      addSys(a.txt);
      if (a.ph === "night") {
        setPBadge("b-night", "\u{1F319} \u591C\u665A");
        el("cIcon").textContent = "\u{1F319}";
        el("cText").textContent = "\u591C\u665A";
        G._wolfTarget = null;
        G._guardTarget = null;
      } else if (a.ph === "day") {
        setPBadge("b-day", "\u2600\uFE0F \u767D\u5929");
        el("cIcon").textContent = "\u2600\uFE0F";
        el("cText").textContent = "\u767D\u5929\u53D1\u8A00";
        if (!G.curEvent) {
          G.curEvent = { round: G.round, deaths: [], speeches: [], votes: {}, wolfTarget: null, saved: false, poisonTarget: null, guardTarget: null };
          G.events.push(G.curEvent);
        }
      } else if (a.ph === "vote") {
        setPBadge("b-vote", "\u{1F5F3}\uFE0F \u6295\u7968");
        el("cIcon").textContent = "\u{1F5F3}\uFE0F";
        el("cText").textContent = "\u6295\u7968";
        el("vBoard").innerHTML = "";
      }
      break;

    case "guard": {
      var res0 = genGuard(a.player);
      G._guardTarget = res0.target;
      addMsg(a.player, "\u5B88\u62A4 " + res0.target, "sys", "\u{1F6E1}\uFE0F");
      addThought(a.player, a.r, "night", res0.thought);
      break;
    }

    case "wolf_talk": {
      var res = genWolfTalk(a.player);
      addMsg(a.player, res.speech, "wolf", "\u{1F43A} \u5BC6\u8C0B");
      addThought(a.player, a.r, "night", res.thought);
      if (res.target) G._wolfTarget = res.target;
      break;
    }

    case "wolf_kill": {
      var tgt = G._wolfTarget || (G.players.filter(function (p) { return p.alive && p.role !== "werewolf"; })[0] || {}).name;
      if (tgt) {
        addSys("\u{1F43A} \u72FC\u4EBA\u76EE\u6807\uFF1A" + tgt, "death");
        if (!G.curEvent) {
          G.curEvent = { round: G.round, deaths: [], speeches: [], votes: {}, wolfTarget: tgt, saved: false, poisonTarget: null, guardTarget: G._guardTarget };
          G.events.push(G.curEvent);
        } else {
          G.curEvent.wolfTarget = tgt;
          G.curEvent.guardTarget = G._guardTarget;
        }
      }
      break;
    }

    case "seer": {
      var res2 = genSeer(a.player);
      if (res2.target) {
        var label2 = res2.result === "\u72FC\u4EBA" ? "\u{1F43A}\u72FC\u4EBA" : "\u{1F464}\u597D\u4EBA";
        addMsg(a.player, "\u67E5\u9A8C " + res2.target + " \u2192 " + label2, "sys", "\u{1F52E}");
        addThought(a.player, a.r, "night", res2.thought);
      }
      break;
    }

    case "witch": {
      var v = G.curEvent ? G.curEvent.wolfTarget : null;
      var res3 = genWitch(a.player, v);
      if (res3.action === "save") {
        addMsg(a.player, "\u4F7F\u7528\u89E3\u836F\u6551\u6D3B " + v, "sys", "\u{1F9EA}");
        if (G.curEvent) G.curEvent.saved = true;
      } else if (res3.action === "poison") {
        addMsg(a.player, "\u4F7F\u7528\u6BD2\u836F\uFF1A" + res3.poisonTarget, "sys", "\u{1F9EA}");
        if (G.curEvent) G.curEvent.poisonTarget = res3.poisonTarget;
      } else {
        addMsg(a.player, "\u6309\u5175\u4E0D\u52A8", "sys", "\u{1F9EA}");
      }
      addThought(a.player, a.r, "night", res3.thought);
      break;
    }

    case "night_resolve": {
      // Unified night resolution: Guard -> Wolf knife -> Witch save -> Witch poison
      var ev = G.curEvent;
      if (!ev) {
        ev = { round: G.round, deaths: [], speeches: [], votes: {}, wolfTarget: null, saved: false, poisonTarget: null, guardTarget: G._guardTarget };
        G.curEvent = ev;
        G.events.push(ev);
      }
      var deaths = [];
      var wolfVictim = ev.wolfTarget;
      var guardedPlayer = ev.guardTarget || G._guardTarget;
      var witchSaved = ev.saved;
      var poisonTarget = ev.poisonTarget;

      // Wolf kill resolution
      if (wolfVictim) {
        var isGuarded = guardedPlayer === wolfVictim;
        if (isGuarded && witchSaved) {
          // Same guard + same save = DEAD (奶穿 / 同守同救)
          var victim = G.players.find(function(p) { return p.name === wolfVictim; });
          if (victim && victim.alive) {
            kill(victim, "guard_save_clash");
            deaths.push(victim.name + " \u540C\u5B88\u540C\u6551\u2192\u6B7B\u4EA1\uFF08\u5976\u7A7F\uFF09");
          }
        } else if (isGuarded) {
          // Guarded, not saved -> survives
          addSys("\u{1F6E1}\uFE0F \u5B88\u536B\u6210\u529F\u6321\u5200\uFF01");
        } else if (witchSaved) {
          // Not guarded, witch saved -> survives
          // already handled, no death
        } else {
          // Not guarded, not saved -> dead
          var victim2 = G.players.find(function(p) { return p.name === wolfVictim; });
          if (victim2 && victim2.alive) {
            kill(victim2, "wolf_kill");
            deaths.push(victim2.name + " \u88AB\u72FC\u4EBA\u51FB\u6740");
          }
        }
      }

      // Poison resolution (guard does NOT protect from poison)
      if (poisonTarget) {
        var pv = G.players.find(function(p) { return p.name === poisonTarget; });
        if (pv && pv.alive) {
          kill(pv, "witch_poison");
          deaths.push(pv.name + " \u88AB\u6BD2\u6740");
          // Poisoned player loses all skills
          if (pv.role === "hunter") pv.canShoot = false;
        }
      }

      ev.deaths = deaths;
      // Update guard tracking
      G._lastGuardTarget = G._guardTarget;
      break;
    }

    case "death_ann": {
      var ev1 = G.curEvent;
      var deaths1 = ev1 ? ev1.deaths : [];
      if (deaths1.length) {
        deaths1.forEach(function (d) { addSys("\u{1F480} " + d, "death"); });
      } else {
        addSys("\u{1F54A}\uFE0F \u5E73\u5B89\u591C\u2014\u2014\u6628\u591C\u65E0\u4EBA\u6B7B\u4EA1");
      }
      // Check win condition after deaths
      var wc0 = checkWolfWin();
      if (wc0.over) { endGame(wc0.winner, wc0.reason); return; }
      // Sheriff death check - transfer or tear
      if (G.sheriff) {
        var sheriffPlayer = G.players.find(function(p) { return p.name === G.sheriff; });
        if (sheriffPlayer && !sheriffPlayer.alive) {
          handleSheriffDeath(sheriffPlayer);
        }
      }
      updateGameUI();
      break;
    }

    case "sheriff_election": {
      runSheriffElection();
      break;
    }

    case "speech": {
      var sp = G.players.find(function (x) { return x.name === a.player; });
      if (!sp || !sp.alive) break;
      var res4 = genSpeech(a.player);
      var speechLabel = "\u{1F4AC}";
      if (sp.name === G.sheriff) speechLabel = "\u{1F3C5}\u{1F4AC}";
      addMsg(a.player, res4.speech, "good", speechLabel);
      addThought(a.player, a.r, "speech", res4.inner);
      if (G.curEvent) G.curEvent.speeches.push({ name: a.player, speech: res4.speech });
      break;
    }

    case "vote": {
      var vp = G.players.find(function (x) { return x.name === a.player; });
      if (!vp || !vp.alive) break;
      var res5 = genVote(a.player);
      var voteWeight = (vp.name === G.sheriff) ? 1.5 : 1;
      addVote(a.player, res5.target, voteWeight);
      addThought(a.player, a.r, "vote", res5.thought);
      if (G.curEvent) {
        if (!G.curEvent.voteWeights) G.curEvent.voteWeights = {};
        G.curEvent.votes[a.player] = res5.target;
        G.curEvent.voteWeights[a.player] = voteWeight;
      }
      var tr = G.trust[a.player];
      if (tr && tr[res5.target] !== undefined) tr[res5.target] = Math.max(0, tr[res5.target] - 0.08);
      break;
    }

    case "vote_res": {
      var ev2 = G.curEvent;
      if (!ev2) break;
      // Count votes with weights (sheriff = 1.5)
      var vc = {};
      Object.entries(ev2.votes).forEach(function (entry) {
        var voter = entry[0], target = entry[1];
        var weight = (ev2.voteWeights && ev2.voteWeights[voter]) || 1;
        vc[target] = (vc[target] || 0) + weight;
      });
      var keys = Object.keys(vc);
      if (!keys.length) { addSys("\u65E0\u4EBA\u6295\u7968"); break; }
      var maxV = Math.max.apply(null, Object.values(vc));
      var tops = keys.filter(function (n) { return vc[n] === maxV; });
      if (tops.length === 1) {
        resolveExile(tops[0]);
      } else {
        // Tie handling
        if (G.sheriff) {
          // Sheriff tiebreak (归票权)
          var sheriffAlive = G.players.find(function(p) { return p.name === G.sheriff && p.alive; });
          if (sheriffAlive) {
            // Sheriff picks one of the tied players
            var pick = sheriffTiebreak(tops);
            addSys("\u{1F3C5} \u8B66\u957F" + G.sheriff + "\u884C\u4F7F\u5F52\u7968\u6743\uFF0C\u51B3\u5B9A\u653E\u9010" + pick);
            resolveExile(pick);
            break;
          }
        }
        addSys("\u2696\uFE0F \u5E73\u7968(" + tops.join("\u3001") + ")\uFF0C\u65E0\u4EBA\u51FA\u5C40");
      }
      updateGameUI();
      break;
    }

    case "check_end": {
      var wce = checkWolfWin();
      if (wce.over) endGame(wce.winner, wce.reason);
      break;
    }
  }
}

function resolveExile(targetName) {
  var exiled = G.players.find(function (p) { return p.name === targetName; });
  if (!exiled) return;
  kill(exiled, "vote_exile");
  addSys("\u{1F5F3}\uFE0F " + exiled.name + " \u88AB\u653E\u9010 \u2192 " + ROLES[exiled.role].emoji + ROLES[exiled.role].name, "death");
  // Sheriff death
  if (exiled.name === G.sheriff) {
    handleSheriffDeath(exiled);
  }
  // Hunter shot (only if not poisoned)
  if (exiled.role === "hunter" && exiled.canShoot) {
    var htgt = G.players.filter(function (p) { return p.alive && p.name !== exiled.name; });
    if (htgt.length) {
      var shot = htgt[Math.floor(Math.random() * htgt.length)];
      kill(shot, "hunter_shot");
      addSys("\u{1F52B} \u730E\u4EBA" + exiled.name + "\u5F00\u67AA\u5E26\u8D70" + shot.name, "death");
      if (shot.name === G.sheriff) handleSheriffDeath(shot);
    }
  }
  // Check win after exile
  var wcPost = checkWolfWin();
  if (wcPost.over) { endGame(wcPost.winner, wcPost.reason); }
}

// ============ SHERIFF SYSTEM ============
function runSheriffElection() {
  G.sheriffElected = true;
  var alive = G.players.filter(function(p) { return p.alive; });
  // AI decides who runs for sheriff
  var candidates = [];
  alive.forEach(function(p) {
    var shouldRun = false;
    if (p.role === "seer") shouldRun = true; // Seer almost always runs
    else if (p.role === "werewolf" && Math.random() < 0.4) shouldRun = true; // Wolf may 悍跳
    else if (Math.random() < 0.25) shouldRun = true; // Others occasionally
    if (shouldRun) candidates.push(p);
  });
  if (candidates.length === 0) {
    addSys("\u{1F3DB}\uFE0F \u65E0\u4EBA\u53C2\u9009\u8B66\u957F\uFF0C\u672C\u5C40\u65E0\u8B66\u957F");
    return;
  }
  addSys("\u{1F3DB}\uFE0F \u8B66\u957F\u7ADE\u9009\u5F00\u59CB\uFF01\u4E0A\u8B66\u73A9\u5BB6\uFF1A" + candidates.map(function(p) { return p.name; }).join("\u3001"));

  // Campaign speeches
  candidates.forEach(function(p) {
    var speech = genCampaignSpeech(p);
    addMsg(p.name, speech.text, "good", "\u{1F3DB}\uFE0F \u7ADE\u9009");
    addThought(p.name, G.round, "election", speech.thought);
  });

  // Voting by non-candidates
  var voters = alive.filter(function(p) { return !candidates.some(function(c) { return c.name === p.name; }); });
  var votes = {};
  candidates.forEach(function(c) { votes[c.name] = 0; });
  voters.forEach(function(v) {
    // Simple vote logic: trust-weighted
    var best = candidates[0].name;
    var bestScore = -1;
    candidates.forEach(function(c) {
      var trust = (G.trust[v.name] && G.trust[v.name][c.name]) || 0.5;
      var score = trust + Math.random() * 0.3;
      if (score > bestScore) { bestScore = score; best = c.name; }
    });
    votes[best] = (votes[best] || 0) + 1;
    addSys(v.name + " \u6295\u7ED9 " + best);
  });

  // Determine winner
  var maxVotes = Math.max.apply(null, Object.values(votes));
  var winners = Object.keys(votes).filter(function(n) { return votes[n] === maxVotes; });
  if (winners.length === 1) {
    G.sheriff = winners[0];
    addSys("\u{1F3C5} " + G.sheriff + " \u5F53\u9009\u8B66\u957F\uFF01\u62E5\u67091.5\u7968\u6743\u91CD\u548C\u5F52\u7968\u6743\u3002", "sys");
  } else {
    // Tie -> re-vote between tied candidates (simplified)
    addSys("\u2696\uFE0F \u5E73\u7968(" + winners.join("\u3001") + ")\uFF0C\u672C\u5C40\u65E0\u8B66\u957F");
    G.sheriff = null;
  }
}

function genCampaignSpeech(player) {
  var p = player;
  if (p.role === "seer") {
    return {
      text: "\u6211\u662F\u9884\u8A00\u5BB6\uFF0C\u6211\u6709\u67E5\u9A8C\u4FE1\u606F\u53EF\u4EE5\u4E3A\u5927\u5BB6\u63D0\u4F9B\u65B9\u5411\u3002\u8BF7\u7ED9\u6211\u8B66\u5F7D\uFF0C\u6211\u7684\u8B66\u5F7D\u6D41\u4F1A\u4FDD\u62A4\u597D\u4EBA\u9635\u8425\u3002",
      thought: "\u3010\u5185\u5FC3\u3011\u62A2\u8B66\u5F7D\u662F\u9884\u8A00\u5BB6\u7684\u6838\u5FC3\u64CD\u4F5C\u3002\u62FF\u5230\u8B66\u5F7D\u5373\u4F7F\u6211\u6B7B\u4E86\u4E5F\u80FD\u901A\u8FC7\u79FB\u4EA4\u4F20\u9012\u4FE1\u606F\u3002"
    };
  } else if (p.role === "werewolf") {
    return {
      text: "\u6211\u662F\u597D\u4EBA\uFF0C\u6211\u80FD\u5E26\u9886\u5927\u5BB6\u627E\u51FA\u72FC\u4EBA\u3002\u7ED9\u6211\u8B66\u5F7D\uFF0C\u6211\u4E0D\u4F1A\u8BA9\u4F60\u4EEC\u5931\u671B\u3002",
      thought: "\u3010\u5185\u5FC3\u3011\u609F\u8DF3\u62A2\u8B66\u5F7D\uFF01\u62FF\u52301.5\u7968\u548C\u53D1\u8A00\u63A7\u5236\u6743\u5BF9\u72FC\u961F\u6781\u4E3A\u6709\u5229\u3002"
    };
  } else {
    return {
      text: "\u6211\u80FD\u4FDD\u6301\u5BA2\u89C2\uFF0C\u5E26\u9886\u5927\u5BB6\u7406\u6027\u5206\u6790\u3002\u7ED9\u6211\u8B66\u5F7D\u3002",
      thought: "\u3010\u5185\u5FC3\u3011\u7ADE\u4E89\u4E0B\u8B66\u5F7D\uFF0C\u770B\u770B\u80FD\u4E0D\u80FD\u62FF\u5230\u3002"
    };
  }
}

function handleSheriffDeath(player) {
  // AI decides: transfer or tear badge
  var alive = G.players.filter(function(p) { return p.alive && p.name !== player.name; });
  if (!alive.length) {
    G.sheriff = null;
    addSys("\u{1F3C5} \u8B66\u5F7D\u6D88\u5931");
    return;
  }
  // Seer/good tends to transfer; wolf tends to tear or transfer to wolf teammate
  var shouldTear = false;
  if (player.role === "werewolf") {
    shouldTear = Math.random() < 0.5; // Wolf may tear to deny info
  } else {
    shouldTear = Math.random() < 0.15; // Good player rarely tears
  }

  if (shouldTear) {
    G.sheriff = null;
    addSys("\u{1F3C5} " + player.name + " \u64D5\u6389\u8B66\u5F7D\uFF01\u672C\u5C40\u4E0D\u518D\u6709\u8B66\u957F\u3002");
  } else {
    // Transfer to most trusted alive player (or wolf teammate if wolf)
    var target;
    if (player.role === "werewolf") {
      var wolfMate = alive.find(function(p) { return p.role === "werewolf"; });
      target = wolfMate || alive[Math.floor(Math.random() * alive.length)];
    } else {
      // Transfer to highest trust
      var bestTrust = -1;
      alive.forEach(function(p) {
        var t = (G.trust[player.name] && G.trust[player.name][p.name]) || 0.5;
        if (t > bestTrust) { bestTrust = t; target = p; }
      });
      if (!target) target = alive[0];
    }
    G.sheriff = target.name;
    addSys("\u{1F3C5} " + player.name + " \u5C06\u8B66\u5F7D\u79FB\u4EA4\u7ED9 " + target.name);
  }
}

function sheriffTiebreak(tiedPlayers) {
  // Sheriff picks the most suspicious player among tied ones
  var sheriff = G.players.find(function(p) { return p.name === G.sheriff; });
  if (!sheriff) return tiedPlayers[0];
  if (sheriff.role === "werewolf") {
    // Wolf sheriff picks a good player
    var goodTarget = tiedPlayers.find(function(n) {
      var p = G.players.find(function(x) { return x.name === n; });
      return p && p.role !== "werewolf";
    });
    return goodTarget || tiedPlayers[0];
  } else {
    // Good sheriff picks based on lowest trust
    var lowestTrust = 2;
    var pick = tiedPlayers[0];
    tiedPlayers.forEach(function(n) {
      var t = (G.trust[sheriff.name] && G.trust[sheriff.name][n]) || 0.5;
      if (t < lowestTrust) { lowestTrust = t; pick = n; }
    });
    return pick;
  }
}

function kill(p, cause) {
  p.alive = false;
  p.deathR = G.round;
  p.deathC = cause;
}

function endGame(winner, reason) {
  G.winner = winner;
  G.phase = "result";
  setPBadge("b-result", "\u{1F3C6} \u7ED3\u675F");
  if (G.auto) {
    clearInterval(G.auto);
    G.auto = null;
    el("autoBtn").classList.remove("hidden");
    el("pauseBtn").classList.add("hidden");
  }
  setTimeout(function () {
    buildResult(winner, reason);
    switchScreen("result");
  }, 800);
}

// ============ AI GENERATION ============
function genGuard(name) {
  var p = G.players.find(function(x) { return x.name === name; });
  var alive = G.players.filter(function(x) { return x.alive; });
  // Cannot guard same person two nights in a row
  var lastGuard = p.lastGuarded || G._lastGuardTarget;
  var candidates = alive.filter(function(x) { return x.name !== lastGuard; });
  if (!candidates.length) candidates = alive; // fallback
  // AI logic: prioritize likely targets (seer jumpers, active speakers)
  var tgt = candidates[Math.floor(Math.random() * candidates.length)];
  // Slight preference to guard self or high-value targets
  var seerCand = candidates.find(function(x) { return x.role === "seer"; });
  if (seerCand && Math.random() < 0.3) tgt = seerCand;
  else if (Math.random() < 0.2) {
    var selfCand = candidates.find(function(x) { return x.name === name; });
    if (selfCand) tgt = selfCand;
  }
  p.lastGuarded = tgt.name;
  var thought = "\u3010\u5185\u5FC3\u3011\u4ECA\u665A\u5B88\u62A4" + tgt.name + "\u3002";
  if (lastGuard) thought += "\u4E0A\u4E00\u665C\u5B88\u4E86" + lastGuard + "\uFF0C\u8FD9\u6B21\u5FC5\u987B\u6362\u4EBA\u3002";
  return { target: tgt.name, thought: thought };
}

function genWolfTalk(name) {
  var alive = G.players.filter(function (p) { return p.alive && p.role !== "werewolf"; });
  if (!alive.length) return { speech: "...", thought: "\u65E0\u76EE\u6807", target: null };
  var tgt = alive[Math.floor(Math.random() * alive.length)];
  var p = G.players.find(function (x) { return x.name === name; });
  var prefixes = ["\u4ECE\u6295\u7968\u6570\u636E\u770B", "\u903B\u8F91\u4E0A\u5206\u6790", "\u76F4\u89C9\u544A\u8BC9\u6211", "\u6839\u636E\u73B0\u6709\u8BC1\u636E"];
  var pre = prefixes[Math.floor(Math.random() * prefixes.length)];
  var extra = tgt.role === "seer" ? "\u53EF\u80FD\u662F\u9884\u8A00\u5BB6\uFF0C\u5FC5\u987B\u5904\u7406\u3002" : "\u53D1\u8A00\u592A\u6709\u903B\u8F91\uFF0C\u7559\u7740\u4E0D\u5229\u3002";
  var speech = pre + "\uFF0C\u4ECA\u665A\u6740" + tgt.name + "\u3002" + extra;
  var guilt = ((p.traits || {}).guilt_susceptibility || 0.3) > 0.5
    ? "\u8BF4\u8C0E\u7684\u611F\u89C9\u4E0D\u597D\u53D7...\u4F46\u6E38\u620F\u5C31\u662F\u6E38\u620F\u3002"
    : "\u4F2A\u88C5\u5B8C\u7F8E\uFF0C\u7EE7\u7EED\u63A7\u573A\u3002";
  return { speech: speech, thought: "\u3010\u5185\u5FC3\u3011\u5FC5\u987B\u628A\u6CE8\u610F\u529B\u5F15\u5F00\u3002" + guilt, target: tgt.name };
}

function genSeer(name) {
  var p = G.players.find(function (x) { return x.name === name; });
  if (!p.checked) p.checked = {};
  var alive = G.players.filter(function (x) { return x.alive && x.name !== name && !p.checked[x.name]; });
  if (!alive.length) return { target: null, thought: "\u5DF2\u67E5\u5B8C\u6240\u6709\u4EBA" };
  var tgt = alive[Math.floor(Math.random() * alive.length)];
  var res = tgt.role === "werewolf" ? "\u72FC\u4EBA" : "\u597D\u4EBA";
  p.checked[tgt.name] = res;
  var thought = res === "\u72FC\u4EBA"
    ? "\u3010\u5185\u5FC3\u3011\u679C\u7136\uFF01" + tgt.name + "\u662F\u72FC\u4EBA\uFF01\u660E\u5929\u5FC5\u987B\u627E\u673A\u4F1A\u4F20\u9012\u4FE1\u606F..."
    : "\u3010\u5185\u5FC3\u3011" + tgt.name + "\u662F\u597D\u4EBA\u3002\u7EE7\u7EED\u7F29\u5C0F\u8303\u56F4\u3002";
  return { target: tgt.name, result: res, thought: thought };
}

function genWitch(name, victim) {
  var p = G.players.find(function (x) { return x.name === name; });
  var action = "none", poisonTarget = null, thought = "";
  var isSelf = victim === name;
  // Save logic: only first night can self-save
  if (victim && !p.antUsed) {
    var canSave = true;
    if (isSelf && G.round > 1) {
      canSave = false; // Cannot self-save after first night
      thought = "\u3010\u5185\u5FC3\u3011\u6211\u88AB\u5200\u4E86\uFF0C\u4F46\u9996\u591C\u4E4B\u540E\u4E0D\u80FD\u81EA\u6551...\u53EA\u80FD\u8BA4\u547D\u3002";
    }
    if (canSave && Math.random() < (G.round === 1 ? 0.7 : 0.35)) {
      action = "save";
      p.antUsed = true;
      thought = "\u3010\u5185\u5FC3\u3011" + victim + "\u88AB\u6740\uFF0C" + (isSelf ? "\u9996\u591C\u81EA\u6551\uFF01" : (G.round === 1 ? "\u7B2C\u4E00\u665A\u5FC5\u987B\u6551" : "\u89E3\u836F\u8FD8\u662F\u7528\u5427")) + "\u3002";
    } else if (canSave) {
      thought = "\u3010\u5185\u5FC3\u3011" + victim + "\u88AB\u6740\u3002\u89E3\u836F\u53EA\u6709\u4E00\u74F6\uFF0C\u5FCD\u4F4F...";
    }
  }
  // Poison logic: only if didn't save (same night only one drug)
  if (action === "none" && !p.poiUsed && !(G.round === 1 && G.cfg.noFP)) {
    var suspects = G.players.filter(function (x) { return x.alive && x.name !== name && x.role === "werewolf"; });
    if (suspects.length && Math.random() < 0.2) {
      poisonTarget = suspects[Math.floor(Math.random() * suspects.length)].name;
      action = "poison";
      p.poiUsed = true;
      thought += "\n\u51B3\u5B9A\u6BD2" + poisonTarget + "\u3002";
    }
  }
  if (!thought) thought = "\u3010\u5185\u5FC3\u3011\u6309\u5175\u4E0D\u52A8\uFF0C\u4FDD\u7559\u836F\u7269\u3002";
  return { action: action, poisonTarget: poisonTarget, thought: thought };
}

function genSpeech(name) {
  var p = G.players.find(function (x) { return x.name === name; });
  var isW = p.role === "werewolf";
  var alive = G.players.filter(function (x) { return x.alive && x.name !== name; });
  var speech = "", inner = "";

  if (isW) {
    var scape = alive.filter(function (x) { return x.role !== "werewolf"; });
    var sn = (scape[Math.floor(Math.random() * scape.length)] || scape[0] || {}).name || "\u67D0\u4EBA";
    var speeches = [
      "\u6211\u6CE8\u610F\u5230" + sn + "\u7684\u53D1\u8A00\u6709\u77DB\u76FE\uFF0C\u8FD9\u79CD\u6447\u6446\u5F88\u53EF\u7591\u3002",
      "\u51B7\u9759\u5206\u6790\u5C40\u52BF\uFF0C\u6211\u4EEC\u9700\u8981\u5173\u6CE8\u6C89\u9ED8\u8005\u3002\u6C89\u9ED8\u4E0D\u4EE3\u8868\u65E0\u8F9C\u3002",
      sn + "\u7684\u53EF\u4FE1\u5EA6\u9700\u8981\u91CD\u65B0\u8BC4\u4F30\u3002"
    ];
    speech = speeches[Math.floor(Math.random() * speeches.length)];
    var guilt2 = ((p.traits || {}).guilt_susceptibility || 0.3) > 0.5 ? "\u8BF4\u8C0E\u4E0D\u597D\u53D7..." : "\u7EE7\u7EED\u63A7\u573A\u3002";
    inner = "\u3010\u771F\u5B9E\u60F3\u6CD5\u3011\u628A\u6CE8\u610F\u529B\u5F15\u5230" + sn + "\u8EAB\u4E0A\u3002" + guilt2;
  } else if (p.role === "seer" && p.checked) {
    var checks = Object.entries(p.checked);
    var wolfFound = checks.find(function (e) { return e[1] === "\u72FC\u4EBA"; });
    if (wolfFound) {
      speech = "\u6211\u6709\u91CD\u8981\u4FE1\u606F\uFF1A" + wolfFound[0] + "\u662F\u72FC\u4EBA\uFF01\u8BF7\u96C6\u4E2D\u706B\u529B\uFF01";
      inner = "\u3010\u5185\u5FC3\u3011\u8DF3\u9884\u8A00\u5BB6\u4E86\uFF0C\u98CE\u9669\u5F88\u5927\uFF0C\u4F46\u5FC5\u987B\u8BF4\u3002";
    } else {
      speech = "\u7EFC\u5408\u5206\u6790\uFF0C\u6211\u4EEC\u5E94\u8BE5\u5173\u6CE8\u53D1\u8A00\u6A21\u68F1\u4E24\u53EF\u7684\u4EBA\u3002";
      inner = "\u3010\u5185\u5FC3\u3011\u5148\u4FDD\u5BC6\u8EAB\u4EFD\uFF0C\u6697\u793A\u65B9\u5411\u3002";
    }
  } else {
    var aliveCount = G.players.filter(function (x) { return x.alive; }).length;
    var villagerSpeeches = [
      "\u6839\u636E\u5C40\u52BF\uFF0C\u6709\u51E0\u4E2A\u53EF\u7591\u5BF9\u8C61\u3002\u53D1\u8A00\u987A\u5E8F\u548C\u6295\u7968\u900F\u9732\u4E86\u5F88\u591A\u3002",
      "\u4FDD\u6301\u5F00\u653E\u6001\u5EA6\uFF0C\u4F46\u8BDD\u8BF4\u592A\u6EE1\u7684\u4EBA\u53EF\u80FD\u5728\u8868\u6F14\u3002",
      "\u4ECE\u6982\u7387\u8BB2\uFF0C\u76EE\u524D" + aliveCount + "\u4EBA\u5B58\u6D3B\uFF0C\u804A\u5929\u4E2D\u66B4\u9732\u7834\u7EFD\u7684\u4F18\u5148\u3002",
      "\u6709\u4EBA\u6295\u7968\u72B9\u8C6B\u5F88\u4E45\uFF0C\u6709\u4EBA\u6025\u7740\u8DDF\u7968\u3002\u4E24\u79CD\u6781\u7AEF\u90FD\u503C\u5F97\u5173\u6CE8\u3002"
    ];
    speech = villagerSpeeches[Math.floor(Math.random() * villagerSpeeches.length)];
    if (p.role === "hunter") inner = "\u3010\u5185\u5FC3\u3011\u6211\u662F\u730E\u4EBA\uFF0C\u88AB\u6295\u51FA\u53BB\u81F3\u5C11\u5E26\u8D70\u4E00\u4E2A\u3002";
    else if (p.role === "witch") inner = "\u3010\u5185\u5FC3\u3011\u624B\u91CC\u6709\u836F\uFF0C\u4E0D\u80FD\u66B4\u9732\u3002";
    else if (p.role === "guard") inner = "\u3010\u5185\u5FC3\u3011\u6211\u662F\u5B88\u536B\uFF0C\u4ECA\u665A\u8981\u5224\u65AD\u72FC\u4EBA\u4F1A\u5200\u8C01\u3002";
    else inner = "\u3010\u5185\u5FC3\u3011\u4FE1\u606F\u592A\u5C11\uFF0C\u53EA\u80FD\u9760\u5206\u6790\u3002";
  }

  // Style adjustments
  if (p.style && (p.style.includes("\u6BD2\u820C") || p.style.includes("\u76F4\u63A5"))) {
    speech = speech.replace("\u6211\u6CE8\u610F\u5230", "\u8BF4\u767D\u4E86").replace("\u6211\u89C9\u5F97", "\u660E\u6446\u7740");
  }
  if (p.style && p.style.includes("\u59D4\u5A49")) {
    speech = speech.replace("\u662F\u72FC\u4EBA", "\u53EF\u80FD\u6709\u95EE\u9898");
  }
  return { speech: speech, inner: inner };
}

function genVote(name) {
  var p = G.players.find(function (x) { return x.name === name; });
  var alive = G.players.filter(function (x) { return x.alive && x.name !== name; });
  if (!alive.length) return { target: name, thought: "\u65E0\u4EBA\u53EF\u6295" };
  var tgt;
  if (p.role === "werewolf") {
    var nonWolf = alive.filter(function (x) { return x.role !== "werewolf"; });
    tgt = nonWolf.length ? nonWolf[Math.floor(Math.random() * nonWolf.length)] : alive[0];
  } else if (p.role === "seer" && p.checked) {
    var kw = Object.entries(p.checked).filter(function (e) { return e[1] === "\u72FC\u4EBA"; }).map(function (e) { return e[0]; });
    var aw2 = kw.find(function (n) { return alive.some(function (a) { return a.name === n; }); });
    tgt = aw2 ? alive.find(function (a) { return a.name === aw2; }) : alive[Math.floor(Math.random() * alive.length)];
  } else {
    tgt = alive[Math.floor(Math.random() * alive.length)];
  }
  var thought = p.role === "werewolf"
    ? "\u3010\u6295\u7968\u3011\u6295" + tgt.name + "\uFF0C\u8F6C\u79FB\u6CE8\u610F\u529B\u3002"
    : "\u3010\u6295\u7968\u3011\u6295" + tgt.name + "\u3002";
  return { target: tgt.name, thought: thought };
}

// ============ UI UPDATES ============
function addSys(txt, cls) {
  cls = cls || "sys";
  var d = document.createElement("div");
  d.className = "cmsg " + cls;
  var mc = document.createElement("div");
  mc.className = "mc";
  mc.innerHTML = txt;
  d.appendChild(mc);
  el("cBody").appendChild(d);
  el("cBody").scrollTop = el("cBody").scrollHeight;
  addEvent(txt);
}

function addMsg(name, txt, cls, label) {
  var role = ROLES[(G.players.find(function (p) { return p.name === name; }) || {}).role];
  var d = document.createElement("div");
  d.className = "cmsg " + cls;
  var ms = document.createElement("div");
  ms.className = "ms";
  var sp = document.createElement("span");
  sp.style.color = role ? role.color : "#999";
  sp.textContent = label || name;
  ms.appendChild(sp);
  ms.appendChild(document.createTextNode(" " + name));
  d.appendChild(ms);
  var mc = document.createElement("div");
  mc.className = "mc";
  mc.textContent = txt;
  d.appendChild(mc);
  el("cBody").appendChild(d);
  el("cBody").scrollTop = el("cBody").scrollHeight;
}

function addVote(voter, target, weight) {
  var b = el("vBoard");
  var cell = document.createElement("div");
  cell.className = "vcell";
  var weightStr = weight > 1 ? ' <span style="color:var(--accent2);font-size:.75rem">(' + weight + '\u7968)</span>' : '';
  cell.innerHTML = '<span class="vn">' + escHtml(voter) + weightStr + '</span><span class="va">\u2192</span><span class="vt">' + escHtml(target) + '</span>';
  b.appendChild(cell);
}

function addEvent(txt) {
  var log = el("eLog");
  var d = document.createElement("div");
  d.style.cssText = "margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,.03);padding-bottom:3px";
  d.textContent = "R" + G.round + " " + txt.replace(/<[^>]*>/g, "");
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

function addThought(name, round, phase, txt) {
  if (!G.thoughts[name]) G.thoughts[name] = [];
  G.thoughts[name].push({ round: round, phase: phase, txt: txt });
}

function updateGameUI() {
  el("rDisp").textContent = G.round;
  // Sheriff display
  var sheriffSec = el("sheriffSec");
  var sheriffDisp = el("sheriffDisp");
  if (G.sheriff) {
    sheriffSec.style.display = "";
    sheriffDisp.textContent = "\u{1F3C5} " + G.sheriff;
  } else if (G.sheriffElected) {
    sheriffSec.style.display = "";
    sheriffDisp.textContent = "\u65E0\u8B66\u957F";
    sheriffDisp.style.color = "var(--dim)";
  } else {
    sheriffSec.style.display = "none";
  }
  var al = el("aList"), dl = el("dList"), ts = el("tSel");
  al.innerHTML = ""; dl.innerHTML = ""; ts.innerHTML = "";
  G.players.forEach(function (p) {
    var r = ROLES[p.role];
    if (p.alive) {
      var li = document.createElement("li");
      var sheriffTag = (p.name === G.sheriff) ? " \u{1F3C5}" : "";
      li.textContent = r.emoji + " " + p.name + sheriffTag;
      al.appendChild(li);
      var opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.name;
      ts.appendChild(opt);
    } else {
      var li2 = document.createElement("li");
      li2.textContent = r.emoji + " " + p.name + " (R" + p.deathR + ")";
      dl.appendChild(li2);
    }
  });
  renderTrust();
}

function renderTrust() {
  var sel = el("tSel").value;
  if (!sel || !G.trust[sel]) return;
  var b = el("tBars");
  b.innerHTML = "";
  var entries = Object.entries(G.trust[sel]).sort(function (a, b) { return b[1] - a[1]; });
  entries.forEach(function (entry) {
    var name = entry[0], val = entry[1];
    var pct = Math.round(val * 100);
    var color = val > 0.6 ? "var(--green)" : val > 0.3 ? "var(--orange)" : "var(--red)";
    var row = document.createElement("div");
    row.className = "trow";
    row.innerHTML = '<span class="tname">' + escHtml(name) + '</span><div class="tbar"><div class="tfill" style="width:' + pct + '%;background:' + color + '"></div></div><span class="tval">' + val.toFixed(2) + '</span>';
    b.appendChild(row);
  });
}

function showNight(title, desc) {
  el("nTitle").textContent = title;
  el("nDesc").textContent = desc;
  el("nightOv").classList.remove("hidden");
}

function showGod() {
  var html = '<table class="itable"><thead><tr><th>\u73A9\u5BB6</th><th>\u8EAB\u4EFD</th><th>\u5B58\u6D3B</th></tr></thead><tbody>';
  G.players.forEach(function (p) {
    var r = ROLES[p.role];
    html += "<tr><td>" + escHtml(p.name) + "</td><td>" + r.emoji + r.name + "</td><td>" + (p.alive ? "\u2705" : "\u274C") + "</td></tr>";
  });
  html += "</tbody></table>";
  el("godContent").innerHTML = html;
  el("godOv").classList.remove("hidden");
}

function autoPlay() {
  if (G.auto) return;
  G.auto = setInterval(function () {
    if (G.winner) { pausePlay(); return; }
    nextAct();
  }, 2200 - (+el("spdR").value) * 350);
  el("autoBtn").classList.add("hidden");
  el("pauseBtn").classList.remove("hidden");
}

function pausePlay() {
  if (G.auto) { clearInterval(G.auto); G.auto = null; }
  el("autoBtn").classList.remove("hidden");
  el("pauseBtn").classList.add("hidden");
}

// ============ RESULT ============
function buildResult(winner, reason) {
  var isWolf = winner === "wolf";
  el("rBanner").className = "rbanner " + (isWolf ? "wolf-win" : "good-win");
  el("rBanner").innerHTML =
    '<div class="wi">' + (isWolf ? "\u{1F43A}" : "\u{1F464}") + '</div>' +
    '<div class="wt">' + (isWolf ? "\u72FC\u4EBA\u9635\u8425" : "\u597D\u4EBA\u9635\u8425") + " \u83B7\u80DC</div>" +
    '<div class="wr">' + escHtml(reason) + " \u00B7 \u5171 " + G.round + " \u8F6E</div>";

  var body = el("idBody");
  body.innerHTML = "";
  G.players.forEach(function (p) {
    var r = ROLES[p.role];
    var f = r.faction === "wolf" ? "\u{1F43A}\u72FC\u4EBA" : "\u{1F464}\u597D\u4EBA";
    var sheriffMark = (p.name === G.sheriff) ? " \u{1F3C5}" : "";
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + p.seat + "</td>" +
      "<td>" + escHtml(p.name) + sheriffMark + "</td>" +
      "<td>" + r.emoji + r.name + "</td>" +
      "<td>" + f + "</td>" +
      "<td>" + (p.alive ? "\u2705" : "\u274C") + "</td>" +
      "<td>" + (p.deathR || "-") + "</td>" +
      "<td>" + (p.deathC || "-") + "</td>";
    body.appendChild(tr);
  });

  // Thought tabs
  var tabs = el("tTabs");
  tabs.innerHTML = "";
  G.players.forEach(function (p) {
    var btn = document.createElement("button");
    btn.className = "ptab";
    btn.textContent = ROLES[p.role].emoji + " " + p.name;
    btn.addEventListener("click", function () { showThought(p.name, btn); });
    tabs.appendChild(btn);
  });
}

function showThought(name, btn) {
  document.querySelectorAll(".ptab").forEach(function (b) { b.classList.remove("act"); });
  if (btn) btn.classList.add("act");
  var ts = G.thoughts[name] || [];
  var p = G.players.find(function (x) { return x.name === name; });
  var r = ROLES[p.role];
  var html = '<h3 style="margin-bottom:12px">' + r.emoji + " " + escHtml(name) + " \u00B7 " + r.name + " \u00B7 " + (r.faction === "wolf" ? "\u72FC\u4EBA\u9635\u8425" : "\u597D\u4EBA\u9635\u8425") + "</h3>";
  var byRound = {};
  ts.forEach(function (t) {
    if (!byRound[t.round]) byRound[t.round] = [];
    byRound[t.round].push(t);
  });
  Object.entries(byRound).forEach(function (entry) {
    var round = entry[0], items = entry[1];
    html += '<div style="margin-bottom:16px"><h4 style="color:var(--accent2);font-size:.9rem;padding-bottom:4px;border-bottom:1px solid var(--border)">\u7B2C ' + round + ' \u8F6E</h4>';
    items.forEach(function (it) {
      var labels = { night: "\u{1F319} \u591C\u665A", speech: "\u2600\uFE0F \u53D1\u8A00", vote: "\u{1F5F3}\uFE0F \u6295\u7968" };
      var label = labels[it.phase] || it.phase;
      html += '<div style="margin-top:8px"><div style="font-weight:600;color:var(--orange);font-size:.82rem">' + label + '</div><div style="padding-left:10px;border-left:2px solid var(--border);margin-top:4px">' + escHtml(it.txt) + "</div></div>";
    });
    html += "</div>";
  });
  el("tCont").innerHTML = html;
}

// ============ EXPORT ============
function download(name, content) {
  var a = document.createElement("a");
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
  a.download = name;
  a.click();
}

function exportLog() {
  var md = "# \u{1F43A} \u72FC\u4EBA\u6740\u6A21\u62DF \u2014 \u5168\u5C40\u65E5\u5FD7\n\n> " + G.id + " | " + new Date().toLocaleString() + "\n\n";
  md += "## \u8EAB\u4EFD\u5206\u914D\n| \u5EA7\u4F4D | \u73A9\u5BB6 | \u8EAB\u4EFD | \u9635\u8425 |\n|---|---|---|---|\n";
  G.players.forEach(function (p) {
    var r = ROLES[p.role];
    md += "| " + p.seat + " | " + p.name + " | " + r.emoji + r.name + " | " + (r.faction === "wolf" ? "\u{1F43A}\u72FC" : "\u{1F464}\u597D") + " |\n";
  });
  G.events.forEach(function (ev) {
    md += "\n## \u7B2C" + ev.round + "\u8F6E\n";
    if (ev.deaths && ev.deaths.length) ev.deaths.forEach(function (d) { md += "- \u{1F480} " + d + "\n"; });
    else md += "- \u5E73\u5B89\u591C\n";
    if (ev.speeches && ev.speeches.length) {
      md += "\n### \u53D1\u8A00\n";
      ev.speeches.forEach(function (s) { md += "**" + s.name + "**: " + s.speech + "\n\n"; });
    }
    if (ev.votes && Object.keys(ev.votes).length) {
      md += "\n### \u6295\u7968\n";
      Object.entries(ev.votes).forEach(function (e) { md += "- " + e[0] + " \u2192 " + e[1] + "\n"; });
    }
  });
  md += "\n## \u7ED3\u679C\n- **" + (G.winner === "wolf" ? "\u72FC\u4EBA" : "\u597D\u4EBA") + "\u9635\u8425\u83B7\u80DC** (" + G.round + "\u8F6E)\n";
  download(G.id + "_global.md", md);
}

function exportThoughts() {
  G.players.forEach(function (p) {
    var r = ROLES[p.role];
    var md = "# " + r.emoji + " " + p.name + " \u2014 \u601D\u7EF4\u62A5\u544A\n\n> \u8EAB\u4EFD: " + r.name + " | \u9635\u8425: " + (r.faction === "wolf" ? "\u72FC\u4EBA" : "\u597D\u4EBA") + " | " + (p.alive ? "\u5B58\u6D3B" : "R" + p.deathR + "\u51FA\u5C40") + "\n\n";
    var ts = G.thoughts[p.name] || [];
    var byR = {};
    ts.forEach(function (t) { if (!byR[t.round]) byR[t.round] = []; byR[t.round].push(t); });
    Object.entries(byR).forEach(function (entry) {
      md += "## \u7B2C" + entry[0] + "\u8F6E\n";
      entry[1].forEach(function (it) {
        var labels = { night: "\u{1F319}\u591C\u665A", speech: "\u2600\uFE0F\u53D1\u8A00", vote: "\u{1F5F3}\uFE0F\u6295\u7968" };
        md += "### " + (labels[it.phase] || it.phase) + "\n" + it.txt + "\n\n";
      });
    });
    download(G.id + "_" + p.name + ".md", md);
  });
}

function exportJSON() {
  var data = {
    id: G.id, config: G.cfg,
    players: G.players.map(function (p) {
      return { name: p.name, role: p.role, alive: p.alive, seat: p.seat, deathRound: p.deathR, deathCause: p.deathC };
    }),
    events: G.events, thoughts: G.thoughts, winner: G.winner, rounds: G.round
  };
  download(G.id + ".json", JSON.stringify(data, null, 2));
}

function resetGame() {
  G = {
    id: "", cfg: { pc: 8, mode: "random", vb: "full", maxR: 10, noFP: false, noFV: false, winMode: "massacre", hasSheriff: true },
    players: [], roles: {}, assign: {}, round: 0, phase: "config",
    events: [], chat: [], thoughts: {}, trust: {}, winner: null,
    aq: [], ai: 0, auto: null, curEvent: null, _wolfTarget: null,
    sheriff: null, sheriffElected: false,
    _guardTarget: null, _lastGuardTarget: null
  };
  el("cBody").innerHTML = "";
  el("vBoard").innerHTML = "";
  el("eLog").innerHTML = "";
  switchScreen("cfg");
  setPBadge("b-cfg", "\u2699\uFE0F \u914D\u7F6E\u4E2D");
  curStep = 1;
  goStep(1);
}
