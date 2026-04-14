// ============================================================
// 阵容分析引擎
// ============================================================
const Engine = {
  // 分析阵容综合评分
  analyze(starters, bench) {
    const all = [...starters, ...bench].filter(Boolean);
    if (all.length < 3) return null;

    const result = {
      overall: 0,
      offense: this.calcOffense(all),
      defense: this.calcDefense(all),
      stamina: this.calcStamina(all),
      tactical: this.calcTactical(all),
      warnings: this.checkWarnings(all, starters, bench),
      rotation: this.calcRotation(starters, bench),
      attacker: this.findAttacker(all),
      chemistry: this.calcChemistry(all),
    };

    result.overall = Math.round(
      result.offense.score * 0.3 +
      result.defense.score * 0.25 +
      result.stamina.score * 0.2 +
      result.tactical.score * 0.25
    );

    return result;
  },

  calcOffense(players) {
    const shooters = players.filter(p => p.roles.includes('射手') || p.roles.includes('攻坚手'));
    const maxThree = shooters.length ? Math.max(...shooters.map(p => p.stats.three)) : 40;
    const avgThree = shooters.length ? shooters.reduce((s,p) => s + p.stats.three, 0) / shooters.length : 40;
    const avgScrn3 = shooters.length ? shooters.reduce((s,p) => s + p.tend.scrn3, 0) / shooters.length : 30;
    const hasAttacker = players.some(p => p.tend.touch >= 85);

    const score = Math.min(100, Math.round(
      maxThree * 0.3 + avgThree * 0.2 + avgScrn3 * 0.15 +
      (shooters.length >= 2 ? 15 : 0) +
      (hasAttacker ? 12 : 0) +
      (maxThree >= 90 ? 8 : 0)
    ));

    return {
      score,
      detail: `最强三分${maxThree} | 射手均值${Math.round(avgThree)} | 挡拆后三分均值${Math.round(avgScrn3)}`,
      shooterCount: shooters.length
    };
  },

  calcDefense(players) {
    const avgDef = players.reduce((s,p) => s + p.stats.def, 0) / players.length;
    const avgSteal = players.reduce((s,p) => s + p.tend.steal, 0) / players.length;
    const avgContest = players.reduce((s,p) => s + p.tend.contest, 0) / players.length;
    const maxDef = Math.max(...players.map(p => p.stats.def));
    const avgModel = players.reduce((s,p) => s + p.stats.model, 0) / players.length;

    const score = Math.min(100, Math.round(
      avgDef * 0.35 + avgSteal * 0.15 + avgContest * 0.15 +
      (maxDef >= 90 ? 12 : 0) +
      (avgModel >= 200 ? 8 : 0) +
      (avgSteal >= 60 ? 8 : 0)
    ));

    return {
      score,
      detail: `均防${Math.round(avgDef)} | 均抢断${Math.round(avgSteal)} | 均干扰${Math.round(avgContest)} | 均模型${Math.round(avgModel)}`
    };
  },

  calcStamina(players) {
    const high = players.filter(p => p.stats.stam >= 119);
    const outerHigh = players.filter(p => p.stats.stam >= 119 && !p.roles.includes('内线'));
    const innerHigh = players.filter(p => p.stats.stam >= 119 && p.roles.includes('内线'));
    const allGood = players.every(p => p.stats.stam >= 114);

    const score = Math.min(100, Math.round(
      (Math.min(outerHigh.length, 2) / 2 * 30) +
      (Math.min(innerHigh.length, 2) / 2 * 30) +
      (allGood ? 25 : 10) +
      (players.length >= 8 ? 15 : players.length >= 6 ? 8 : 0)
    ));

    return {
      score,
      detail: `≥119体力：${outerHigh.length}外线+${innerHigh.length}内线 | 总人数${players.length}`,
      outerHigh: outerHigh.length,
      innerHigh: innerHigh.length
    };
  },

  calcTactical(players) {
    const has = r => players.some(p => p.roles.includes(r));
    const playmakers = players.filter(p => p.roles.includes('发牌员'));
    const shooters = players.filter(p => p.roles.includes('射手'));
    const bigs = players.filter(p => p.roles.includes('内线'));
    const hasEagle = players.some(p => p.tactics.includes('老鹰'));
    const hasNoScreen = players.some(p => p.tactics.includes('不挡拆'));

    const score = Math.min(100,
      (playmakers.length >= 2 ? 25 : playmakers.length >= 1 ? 15 : 0) +
      (shooters.length >= 2 ? 22 : shooters.length >= 1 ? 12 : 0) +
      (bigs.length >= 2 ? 20 : bigs.length >= 1 ? 10 : 0) +
      (has('攻坚手') ? 15 : 0) +
      (hasEagle ? 10 : 0) +
      (hasNoScreen ? 8 : 0)
    );

    return {
      score,
      detail: `发牌${playmakers.length} | 射手${shooters.length} | 内线${bigs.length}` +
        (hasEagle ? ' | 老鹰✓' : '') + (hasNoScreen ? ' | 不挡拆内线✓' : '')
    };
  },

  findAttacker(players) {
    const sorted = [...players].sort((a,b) => b.tend.touch - a.tend.touch);
    const top = sorted[0];
    if (!top) return null;
    return {
      player: top,
      touch: top.tend.touch,
      tactics: top.tactics,
      note: top.tend.touch >= 90 ? '稳定攻坚手' : top.tend.touch >= 70 ? '可作为攻坚手' : '攻坚能力偏弱'
    };
  },

  calcRotation(starters, bench) {
    // 简化的轮换建议（1-4节）
    const s = starters.filter(Boolean);
    const b = bench.filter(Boolean);
    if (s.length < 3) return null;

    const rows = [];
    [...s, ...b].forEach(p => {
      const hasHighStam = p.stats.stam >= 119;
      const isStarter = s.includes(p);
      let q = [false, false, false, false];

      if (hasHighStam && isStarter) {
        // High stamina starter: play Q1, Q2 or Q3, and Q4
        q = [true, true, false, true]; // or [true, false, true, true]
      } else if (isStarter) {
        q = [true, true, false, false]; // or [true, false, true, false]
      } else {
        // Bench: fill gaps
        q = [false, false, true, true];
      }

      rows.push({ player: p, quarters: q });
    });

    return rows;
  },

  calcChemistry(players) {
    const notes = [];
    // 水花组合
    if (players.some(p => p.id === 'curry14') && players.some(p => p.id === 'klay')) {
      notes.push({ type: 'good', msg: '🔥 水花兄弟组合！库里+克莱三分火力全开。' });
    }
    // 攻坚流
    if (players.some(p => p.id === 'curry14') && players.some(p => p.tactics.includes('不挡拆'))) {
      notes.push({ type: 'good', msg: '⚔️ 攻坚流配置！库里+不挡拆内线，攻坚概率可提升至100%。' });
    }
    // 老鹰体系
    const eagles = players.filter(p => p.tactics.includes('老鹰'));
    if (eagles.length >= 1) {
      notes.push({ type: 'info', msg: '🦅 老鹰战术体系：' + eagles.map(p => p.name).join('、') + ' 适配老鹰队战术板。' });
    }
    // 双高触球
    const highTouch = players.filter(p => p.tend.touch >= 90);
    if (highTouch.length >= 2) {
      notes.push({ type: 'warn', msg: '⚠️ 多个高触球球员（' + highTouch.map(p => p.name + p.tend.touch).join('、') + '），注意攻坚手位置控制。' });
    }
    // 模型警告
    const smallLineup = players.filter(p => p.stats.model < 195);
    if (smallLineup.length >= 3) {
      notes.push({ type: 'warn', msg: '⚠️ 阵容模型偏小（' + smallLineup.length + '人<195），篮板可能吃亏。' });
    }

    return notes;
  },

  checkWarnings(all, starters, bench) {
    const w = [];
    const pm = all.filter(p => p.roles.includes('发牌员'));
    const sh = all.filter(p => p.roles.includes('射手') || p.roles.includes('攻坚手'));
    const bg = all.filter(p => p.roles.includes('内线'));

    if (pm.length === 0) w.push({type:'error',msg:'❌ 缺少发牌员！战术无法有效执行。'});
    else if (pm.length < 2) w.push({type:'warn',msg:'⚠️ 仅1个发牌员，建议配置2个保证轮换。'});
    else w.push({type:'good',msg:'✅ 发牌员×' + pm.length + '，配置合理。'});

    if (sh.length === 0) w.push({type:'error',msg:'❌ 缺少射手！经理模式核心得分手段是三分。'});
    else if (sh.length >= 2) w.push({type:'good',msg:'✅ 射手/攻坚手×' + sh.length + '，火力充足。'});
    else w.push({type:'warn',msg:'⚠️ 仅1个射手，三分火力偏弱。'});

    if (bg.length < 2) w.push({type:'warn',msg:'⚠️ 内线×' + bg.length + '（建议≥3），篮板掩护可能不足。'});
    else if (bg.length >= 3) w.push({type:'good',msg:'✅ 内线×' + bg.length + '，篮板掩护有保障。'});

    // 体力
    const ouH = all.filter(p => p.stats.stam >= 119 && !p.roles.includes('内线')).length;
    const inH = all.filter(p => p.stats.stam >= 119 && p.roles.includes('内线')).length;
    if (ouH >= 2 && inH >= 2)
      w.push({type:'good',msg:'✅ 体力达标：' + ouH + '外线+' + inH + '内线 ≥119体力。'});
    else
      w.push({type:'warn',msg:'⚠️ 体力不足：需2外+2内≥119，当前' + ouH + '外+' + inH + '内。'});

    // 攻坚手
    const atk = all.filter(p => p.tend.touch >= 85);
    if (atk.length === 0)
      w.push({type:'warn',msg:'⚠️ 缺少高触球球员（≥85），第四节攻坚不稳定。'});
    else
      w.push({type:'good',msg:'✅ 攻坚手：' + atk.map(p => p.name + '(' + p.tend.touch + ')').join('、')});

    // 发牌员变向风险
    pm.forEach(p => {
      if (p.tend.chgDir >= 60)
        w.push({type:'warn',msg:'⚠️ ' + p.name + ' 变向切入倾向' + p.tend.chgDir + '偏高，运球容易丢球。'});
    });

    // 防守短板
    const weakDef = all.filter(p => p.stats.def < 70);
    if (weakDef.length >= 2)
      w.push({type:'warn',msg:'⚠️ ' + weakDef.map(p=>p.name).join('、') + ' 防守偏弱（<70），注意轮换保护。'});

    return w;
  }
};
