// ============================================================
//  命理问答推理引擎 v2（大规模扩充版）
// ============================================================
function generateAnswer(question){
  const a = lastAnalysis;
  const q = question.toLowerCase();
  const wxDir={'木':'东方','火':'南方','土':'中央','金':'西方','水':'北方'};
  const wxClr={'木':'绿色','火':'红色','土':'黄色','金':'白色','水':'黑/蓝色'};
  const wxNum={'木':'3、8','火':'2、7','土':'5、0','金':'4、9','水':'1、6'};
  const wxInd={'木':'教育、出版、设计、环保、服装','火':'互联网、科技、餐饮、娱乐、传媒','土':'房地产、建筑、农业、咨询','金':'金融、法律、机械、IT硬件','水':'贸易、物流、旅游、传播、水利'};
  const wxFood={'木':'绿色蔬菜、酸味食物','火':'红色食物、苦味适量','土':'黄色食物、五谷杂粮','金':'白色食物、辛味适量','水':'黑色食物、咸味适量'};
  const healthM={'木':'肝胆、筋骨、眼睛（宜养肝护目）','火':'心脏、血液、小肠（宜养心清火）','土':'脾胃、肌肉、消化（宜健脾养胃）','金':'肺、大肠、呼吸系统（宜润肺清气）','水':'肾、膀胱、泌尿系统（宜补肾养精）'};
  const im=a.gender==='男';
  const gs=(a.ssCount['正官']||0)+(a.ssCount['七杀']||0);
  const ss=(a.ssCount['食神']||0)+(a.ssCount['伤官']||0);
  const ct=(a.ssCount['正财']||0)+(a.ssCount['偏财']||0);
  const yi=(a.ssCount['正印']||0)+(a.ssCount['偏印']||0);
  const bj=(a.ssCount['比肩']||0)+(a.ssCount['劫财']||0);
  const dz=a.bazi.day.zhi;
  const spWx=im?WX_KE[a.dayWx]:WX_BEIKE[a.dayWx];
  const spP=dz, spPWx=WU_XING_ZHI[DI_ZHI.indexOf(spP)];
  const thM={'子':'酉','丑':'午','寅':'卯','卯':'子','辰':'酉','巳':'午','午':'卯','未':'子','申':'酉','酉':'午','戌':'卯','亥':'子'};
  const thZ=thM[dz], thSX=thZ?SHENG_XIAO[DI_ZHI.indexOf(thZ)]:'';
  const tyM={'甲':['丑','未'],'戊':['丑','未'],'乙':['子','申'],'己':['子','申'],'丙':['酉','亥'],'丁':['酉','亥'],'庚':['丑','未'],'辛':['寅','午'],'壬':['卯','巳'],'癸':['卯','巳']};
  const ty=tyM[a.dayGan]||[];
  const chM={'子':'午','丑':'未','寅':'申','卯':'酉','辰':'戌','巳':'亥','午':'子','未':'丑','申':'寅','酉':'卯','戌':'辰','亥':'巳'};
  function fDY(wx){return a.dayunInfo.dayuns.filter(d=>{const g=WU_XING_GAN[TIAN_GAN.indexOf(d.gan)],z=WU_XING_ZHI[DI_ZHI.indexOf(d.zhi)];return g===wx||z===wx;});}
  function mk(d){return a.currentAge>=d.startAge&&a.currentAge<=d.endAge?' ← 当前':'';}

  // 1. 正缘/配偶/结婚/老公/老婆/另一半/伴侣/婚期
  if(q.includes('正缘')||q.includes('配偶')||q.includes('结婚')||q.includes('嫁')||q.includes('娶')||q.includes('老公')||q.includes('老婆')||q.includes('另一半')||q.includes('伴侣')||q.includes('婚期')||q.includes('适婚')||q.includes('什么时候能遇到')){
    let s=`**正缘与配偶分析**\n\n`;
    if(im){const zc=a.ssCount['正财']||0,pc=a.ssCount['偏财']||0;s+=`男命以 **正财** 看妻星。正财${zc}个，偏财${pc}个。\n\n`;if(zc>=2)s+=`正财多见，异性缘佳，但选择多时容易犹豫，认定一人后不要动摇。\n\n`;else if(zc===1)s+=`正财恰好一位，正缘纯正，"一生一人"的好格局。\n\n`;else s+=`正财不显，缘分不急。大运走财运时正缘到来。\n\n`;}else{const zg=a.ssCount['正官']||0,qs=a.ssCount['七杀']||0;s+=`女命以 **正官** 看夫星。正官${zg}个，七杀${qs}个。\n\n`;if(zg>=2)s+=`正官多见，身边优秀异性不少，但选择需果断。\n\n`;else if(zg===1)s+=`正官恰好一位，夫星正位，婚姻缘分纯正。\n\n`;else s+=`正官不显，正缘来得晚。大运走官星时期姻缘到来。\n\n`;}
    const pt={'子':'聪慧灵动、水灵秀气型','丑':'踏实内敛、持家型','寅':'有朝气有主见、进取型','卯':'温柔文艺、知性优雅型','辰':'包容有野心、事业型','巳':'精干聪明、能干利索型','午':'热情大方、阳光活力型','未':'温和有品味、居家型','申':'灵活善交际、精明能干型','酉':'精致注重仪表、外表出众型','戌':'忠诚有原则、靠谱忠厚型','亥':'智慧包容、内涵丰富型'};
    s+=`**配偶宫（日支）：${spP}（${spPWx}）**\n${pt[spP]||''}\n\n`;
    const st={'木':'身材修长、气质文雅、性格温和有主见','火':'热情开朗、红润匀称、直爽有活力','土':'敦厚踏实、体型丰满壮实、为人可靠','金':'棱角分明、肤白干练、果断利索','水':'圆润灵动、聪明善变、身材偏丰'};
    s+=`**正缘五行特征（${spWx}）：**\n• 外形气质：${st[spWx]||''}\n• 可能行业：${wxInd[spWx]}\n• 可能方位：${wxDir[spWx]}\n\n`;
    s+=`**正缘出现时机：**\n`;
    const sd=fDY(spWx);if(sd.length>0)sd.forEach(d=>{s+=`• ${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）${d.gan}${d.zhi}运${mk(d)}：${im?'财星':'官星'}当运\n`;});else s+=`• 大运中${im?'财星':'官星'}不突出，留意桃花流年\n`;
    if(thZ)s+=`\n**桃花星：${thZ}（属${thSX}）**——逢${thSX}年或遇属${thSX}的人，桃花运最旺。\n`;
    const cSP=chM[spP];s+=`\n**婚姻注意：**\n• 配偶星（${spWx}五行年）+ 桃花年 = 结婚高概率年\n`;
    if(cSP)s+=`• 流年地支${cSP}（属${SHENG_XIAO[DI_ZHI.indexOf(cSP)]}年）冲配偶宫，感情易波动`;
    return s;
  }

  // 2. 感情/桃花/恋爱/脱单/分手/复合/出轨/离婚
  if(q.includes('感情')||q.includes('婚姻')||q.includes('桃花')||q.includes('恋爱')||q.includes('对象')||q.includes('脱单')||q.includes('分手')||q.includes('复合')||q.includes('暧昧')||q.includes('烂桃花')||q.includes('出轨')||q.includes('离婚')){
    let s=`**感情运势分析**\n\n`;
    if(im){const zc=a.ssCount['正财']||0,pc=a.ssCount['偏财']||0;s+=`男命财星看感情。正财${zc}（正缘），偏财${pc}（异性缘）。\n\n`;if(zc>=2)s+=`正财多，异性缘佳，需专一。\n`;else if(zc===1&&pc<=1)s+=`正偏财适中，感情观正，婚姻运顺。\n`;else if(pc>=2)s+=`偏财旺，社交中易遇异性，要分清真情。\n`;else s+=`财星不显，感情慢但稳。走财运时桃花好转。\n`;}
    else{const zg=a.ssCount['正官']||0,qs=a.ssCount['七杀']||0;s+=`女命官杀看感情。正官${zg}（正缘），七杀${qs}（强势异性）。\n\n`;if(zg>=2)s+=`正官多，有吸引优秀男性的条件。\n`;else if(zg===1&&qs<=1)s+=`官杀适中，婚姻运正。\n`;else if(qs>=2)s+=`七杀旺，易遇强势对象，感情波折多，需印星化解。\n`;else s+=`官星不显，缘分晚至。走官运时好转。\n`;}
    if(q.includes('分手')||q.includes('复合')||q.includes('离婚')){s+=`\n**分手/复合/离婚：**\n`;const c=chM[spP];if(c)s+=`流年${c}（属${SHENG_XIAO[DI_ZHI.indexOf(c)]}年）冲配偶宫，感情易波动。\n`;s+=`配偶星在后续大运重新出现 = 有复合或新缘分机会。\n`;}
    if(q.includes('烂桃花')||q.includes('出轨')){s+=`\n**烂桃花风险：**\n`;if(im&&(a.ssCount['偏财']||0)>=2)s+=`偏财多，社交圈异性多，守住底线。\n`;else if(!im&&(a.ssCount['七杀']||0)>=2)s+=`七杀多，易遇纠缠型异性，学会拒绝。\n`;else s+=`此类风险不算高，流年桃花星时注意分寸。\n`;}
    if(q.includes('脱单')){s+=`\n**脱单时机：**\n`;const sd=fDY(spWx);if(sd.length>0){s+=`感情运上升期：\n`;sd.forEach(d=>{s+=`• ${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）\n`;});}if(thZ)s+=`逢${thSX}年桃花特别旺。`;}
    if(thZ)s+=`\n\n**桃花星：${thZ}（属${thSX}）**——方位：${wxDir[WU_XING_ZHI[DI_ZHI.indexOf(thZ)]]}`;
    return s;
  }

  // 3. 子女/孩子/生育/怀孕
  if(q.includes('子女')||q.includes('孩子')||q.includes('几个')||q.includes('生育')||q.includes('怀孕')||q.includes('娃')||q.includes('儿子')||q.includes('女儿')||q.includes('后代')||q.includes('宝宝')){
    let s=`**子女运分析**\n\n`;
    const s1=a.ssCount['食神']||0,g1=a.ssCount['伤官']||0,t=s1+g1;
    s+=`食神${s1}个，伤官${g1}个。\n\n`;
    if(t>=3)s+=`食伤旺，子女缘厚。食神多=乖巧 | 伤官多=个性强。\n\n`;
    else if(t===2)s+=`食伤适中，子女缘正常。\n\n`;
    else if(t===1)s+=`食伤偏少，子女数量少但质量高。\n\n`;
    else s+=`食伤不显，子女缘晚。走食伤运时增强。\n\n`;
    const cw=WX_SHENG[a.dayWx];
    const ct2={'木':'正直好学','火':'热情活泼','土':'踏实稳重','金':'聪明果断','水':'灵活聪慧'};
    s+=`**子女五行：${cw}**——${ct2[cw]||''}\n\n`;
    s+=`**有利生育时期：**\n`;fDY(cw).forEach(d=>{s+=`• ${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）${mk(d)}\n`;});
    const hs=SHI_SHEN_MAP[a.dayGan][a.bazi.hour.gan];
    s+=`\n**时柱看子女：**时干${a.bazi.hour.gan}为${hs}，`;
    if(['食神','正财','正官','正印'].includes(hs))s+=`吉星坐镇，子女关系融洽，晚年享福。`;
    else if(['伤官','七杀','劫财'].includes(hs))s+=`子女有个性，操心多但有闯劲。`;
    else s+=`子女关系平稳。`;
    return s;
  }

  // 4. 学业/考试/读书/考公
  if(q.includes('学业')||q.includes('考试')||q.includes('读书')||q.includes('考研')||q.includes('升学')||q.includes('学习')||q.includes('高考')||q.includes('考公')||q.includes('考证')){
    let s=`**学业运分析**\n\n`;
    s+=`正印${a.ssCount['正印']||0}个，偏印${a.ssCount['偏印']||0}个。\n\n`;
    if(yi>=3)s+=`印星旺，学习能力强。正印=正统学问 | 偏印=偏门技能\n\n`;
    else if(yi===2)s+=`印星适中，学习运不错。\n\n`;
    else if(yi===1)s+=`印星偏少，靠努力。\n\n`;
    else s+=`印星不显，实践力比书本学习强。\n\n`;
    if(ss>=2)s+=`食伤旺，理解力表达力强，考试善于发挥。\n\n`;
    const yw=WX_BESHENG[a.dayWx];
    s+=`**学业有利时期：**\n`;fDY(yw).forEach(d=>{s+=`• ${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）${mk(d)}\n`;});
    if(q.includes('考公')){s+=`\n**考公：**${gs>=2&&yi>=1?'官印相生，好格局。':gs>=2?'官杀旺，有竞争力但需多刷题。':'官星不算旺，选官运好的年份冲刺。'}`;}
    s+=`\n\n**适合方向：**${yw}——${wxInd[yw]}`;
    return s;
  }

  // 5. 今年/流年/明年/后年
  if(q.includes('今年')||q.includes('流年')||q.includes('2026')||q.includes('2027')||q.includes('本年')||q.includes('明年')||q.includes('后年')){
    let tY=new Date().getFullYear();
    if(q.includes('明年'))tY+=1;if(q.includes('后年'))tY+=2;
    const m2=q.match(/20(\d\d)/);if(m2)tY=parseInt('20'+m2[1]);
    const gi=(tY-4)%10,zi=(tY-4)%12;
    const lg=TIAN_GAN[(gi+10)%10],lz=DI_ZHI[(zi+12)%12];
    const lw=WU_XING_GAN[TIAN_GAN.indexOf(lg)],lzw=WU_XING_ZHI[DI_ZHI.indexOf(lz)];
    const gd=lw===a.xiyong.xi||lw===a.xiyong.yong||lzw===a.xiyong.xi||lzw===a.xiyong.yong;
    let s=`**${tY}年（${lg}${lz}年）运势**\n\n流年 ${lg}（${lw}）${lz}（${lzw}）\n\n`;
    if(gd){s+=`与喜用神合，**整体向好**。\n• 事业有机会 • 财运增长 • 感情有助力 • 健康平稳\n`;}
    else{s+=`与忌神有关，**需谨慎**。\n• 不宜冒进 • 控制支出 • 注意沟通 • 劳逸结合\n`;}
    if(lz===chM[spP])s+=`\n⚠️ 冲配偶宫，感情可能波动。`;
    if(a.currentDYObj){const dw=WU_XING_GAN[TIAN_GAN.indexOf(a.currentDYObj.gan)];s+=`\n\n当前大运：${a.currentDY}，${dw===a.xiyong.xi||dw===a.xiyong.yong?'双重加持':'更需稳健'}。`;}
    s+=`\n\n**增运：** ${wxClr[a.xiyong.xi]}/${wxClr[a.xiyong.yong]} | ${wxDir[a.xiyong.xi]}/${wxDir[a.xiyong.yong]} | ${wxNum[a.xiyong.xi]}/${wxNum[a.xiyong.yong]}`;
    return s;
  }

  // 6. 事业/工作/跳槽/创业/升职
  if(q.includes('事业')||q.includes('工作')||q.includes('跳槽')||q.includes('创业')||q.includes('行业')||q.includes('职业')||q.includes('升职')||q.includes('加薪')||q.includes('辞职')||q.includes('副业')||q.includes('转行')){
    let s=`**事业分析（${a.dayGan}${a.dayWx}·${a.strengthLabel}）**\n\n`;
    if(gs>=3)s+=`官杀旺，有管理才能。${(a.ssCount['正官']||0)>(a.ssCount['七杀']||0)?'适合体制/管理':'适合竞争性行业'}\n`;
    if(ss>=3)s+=`食伤旺，创造力表达欲强。适合创意、技术、教育。\n`;
    if(ct>=3&&a.strengthLabel==='身强')s+=`身强财旺，适合经商。\n`;
    if(yi>=3)s+=`印星旺，适合学术研究。\n`;
    s+=`\n**行业方向：**\n• ${a.xiyong.xi}：${wxInd[a.xiyong.xi]}\n• ${a.xiyong.yong}：${wxInd[a.xiyong.yong]}\n`;
    if(q.includes('跳槽')||q.includes('辞职')||q.includes('转行')){const g2=a.lyGanWx===a.xiyong.xi||a.lyGanWx===a.xiyong.yong;s+=`\n**跳槽/转行：**${g2?'今年流年合喜用神，有好机会可把握。':'今年流年走忌神，不建议变动。'}`;}
    if(q.includes('创业')||q.includes('副业')){s+=`\n**创业：**${a.strengthLabel==='身强'&&ct>=2?'身强担财，有基础。':'身弱宜合伙，不宜单干。'}`;}
    if(q.includes('升职')||q.includes('加薪')){s+=`\n**升职：**${gs>=2?'官杀旺，有晋升基础。':'官星偏弱，靠实力积累。'}`;}
    return s;
  }

  // 7. 财运
  if(q.includes('财运')||q.includes('钱')||q.includes('投资')||q.includes('理财')||q.includes('赚钱')||q.includes('发财')||q.includes('破财')||q.includes('偏财')||q.includes('横财')){
    let s=`**财运分析（${a.strengthLabel}）**\n\n`;
    if(a.strengthLabel==='身强'&&ct>=2)s+=`身强财旺，扛得住大财。\n`;
    else if(a.strengthLabel==='身弱'&&ct>=2)s+=`身弱财多，守不住。宜合作。\n`;
    else if(ct<=1)s+=`财星不旺，靠大运催动。\n`;
    else s+=`财星适中，平稳。\n`;
    if(q.includes('偏财')||q.includes('横财')){const pc=a.ssCount['偏财']||0;s+=`\n**偏财运：**${pc>=2?'有横财运，但来快去快。':pc===1?'偶尔小横财。':'以正财为主。'}\n`;}
    s+=`\n**财运旺期：**\n`;
    a.dayunInfo.dayuns.forEach(d=>{const gw=WU_XING_GAN[TIAN_GAN.indexOf(d.gan)],zw=WU_XING_ZHI[DI_ZHI.indexOf(d.zhi)];if(gw===WX_KE[a.dayWx]||zw===WX_KE[a.dayWx])s+=`• ${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）${mk(d)}\n`;});
    s+=`\n**求财方位：**${wxDir[a.xiyong.xi]}、${wxDir[a.xiyong.yong]} | **颜色：**${wxClr[a.xiyong.xi]}、${wxClr[a.xiyong.yong]}`;
    return s;
  }

  // 8. 健康
  if(q.includes('健康')||q.includes('身体')||q.includes('养生')||q.includes('疾病')||q.includes('寿命')||q.includes('吃什么')){
    let s=`**健康分析**\n\n`;
    if(a.missing!=='无'){s+=`五行缺${a.missing}：\n`;a.missing.split('、').forEach(w=>{if(healthM[w])s+=`• ${w}：${healthM[w]}\n`;});}
    if(a.dominant!=='无'){s+=`\n五行${a.dominant}过旺：\n`;a.dominant.split('、').forEach(w=>{if(healthM[w])s+=`• ${w}过旺：${healthM[w]}\n`;});}
    if(a.missing==='无'&&a.dominant==='无')s+=`五行较均衡，体质基础好。\n`;
    const dh={'木':'肝气郁结易怒，宜疏肝多运动','火':'心火旺易失眠，避免熬夜','土':'脾胃弱，宜规律饮食','金':'肺燥易咳，宜润肺','水':'肾气不足易疲劳，宜补肾'};
    s+=`\n**日主健康倾向（${a.dayWx}）：**${dh[a.dayWx]||''}\n`;
    s+=`\n**饮食：** ${a.xiyong.xi}：${wxFood[a.xiyong.xi]} | ${a.xiyong.yong}：${wxFood[a.xiyong.yong]}`;
    return s;
  }

  // 9. 转折/大运/关键年份
  if(q.includes('转折')||q.includes('大运')||q.includes('关键')||q.includes('哪些年')||q.includes('运势最好')||q.includes('运势最差')||q.includes('人生阶段')){
    let s=`**人生关键节点**\n\n${a.dayunInfo.forward?'顺排':'逆排'}，${a.dayunInfo.startAge}岁起运。\n\n`;
    a.dayunInfo.dayuns.forEach(d=>{
      const gw=WU_XING_GAN[TIAN_GAN.indexOf(d.gan)],zw=WU_XING_ZHI[DI_ZHI.indexOf(d.zhi)];
      const gd=gw===a.xiyong.xi||gw===a.xiyong.yong||zw===a.xiyong.xi||zw===a.xiyong.yong;
      const sg=SHI_SHEN_MAP[a.dayGan][d.gan];
      s+=`**${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）：${d.gan}${d.zhi}${mk(d)}**\n`;
      s+=`  ${sg}运，${gd?'✅ 喜用运，积极进取':'⚠️ 忌神运，宜守成'}。${d.nayin}\n\n`;
    });
    return s;
  }

  // 10. 贵人
  if(q.includes('贵人')||q.includes('谁能帮')||q.includes('助力')||q.includes('靠谁')){
    let s=`**贵人分析**\n\n**天乙贵人：${ty.join('、')}**\n属${ty.map(z=>SHENG_XIAO[DI_ZHI.indexOf(z)]).join('、')}的人或年份易遇贵人。\n\n`;
    const wxP={'木':'教育、文化、设计','火':'科技、传媒、餐饮','土':'地产、咨询','金':'金融、法律、技术','水':'贸易、物流、传播'};
    s+=`**喜用方向贵人：**\n• ${a.xiyong.xi}：${wxP[a.xiyong.xi]}从业者\n• ${a.xiyong.yong}：${wxP[a.xiyong.yong]}从业者\n\n`;
    const wcM={'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'};
    const wc=wcM[a.dayGan];if(wc)s+=`**文昌贵人：${wc}（属${SHENG_XIAO[DI_ZHI.indexOf(wc)]}）**——利学业考试。`;
    return s;
  }

  // 11. 五行/喜用神
  if(q.includes('五行')||q.includes('喜用')||q.includes('用神')||q.includes('忌神')||q.includes('缺什么')){
    let s=`**五行与喜用神**\n\n日主${a.dayGan}属${a.dayWx}，${a.strengthLabel}。\n\n**分布：**${a.wxCount}\n缺：${a.missing} | 弱：${a.weak} | 旺：${a.dominant}\n\n`;
    s+=`**喜用：** ${a.xiyong.xi}（喜）、${a.xiyong.yong}（用）\n**忌神：** ${a.xiyong.ji}、${a.xiyong.ji2}\n\n`;
    s+=`**方位：**${wxDir[a.xiyong.xi]}/${wxDir[a.xiyong.yong]} | **颜色：**${wxClr[a.xiyong.xi]}/${wxClr[a.xiyong.yong]} | **数字：**${wxNum[a.xiyong.xi]}/${wxNum[a.xiyong.yong]}`;
    return s;
  }

  // 12. 性格
  if(q.includes('性格')||q.includes('为人')||q.includes('我是什么样')){
    const pm={'甲':'如参天大树，正直坚韧有领导力，有时过于固执','乙':'如藤蔓花草，柔韧灵活善交际','丙':'如烈日当空，热情开朗慷慨大方','丁':'如烛火星光，细腻温和富于心计','戊':'如高山大地，厚重稳健诚实守信','己':'如田园沃土，温和谦逊细心周到','庚':'如精钢利刃，果断刚毅义薄云天','辛':'如珠宝美玉，敏锐精致有品味','壬':'如大江大河，智慧深邃足智多谋','癸':'如雨露泉水，聪慧内敛感知力强'};
    let s=`**性格分析（${a.dayGan}日主·${a.dayWx}）**\n\n${pm[a.dayGan]||''}`;
    const ts=Object.entries(a.ssCount).sort((x,y)=>y[1]-x[1])[0];
    if(ts){const sp={'比肩':'独立自主、竞争意识强','劫财':'社交活跃、敢冒险','食神':'享受生活、有才华','伤官':'创意丰富、追求自由','偏财':'人脉广、有投资眼光','正财':'务实节俭','七杀':'有魄力、抗压强','正官':'守规矩、有责任感','偏印':'爱研究、思维独特','正印':'爱学习、有贵人缘'};s+=`\n\n**十神补充：**${ts[0]}最旺——${sp[ts[0]]||''}`;}
    return s;
  }

  // 13. 命格/格局
  if(q.includes('命格')||q.includes('格局')){
    let s=`**命格：${a.mingge}**\n\n`;
    const gd={'正官格':'正直重规则，适合管理','七杀格':'有魄力，竞争性强','正财格':'务实理财','偏财格':'有横财运','正印格':'学业好有贵人','偏印格':'思维独特','食神格':'有口福才华','伤官格':'创造力强'};
    a.mingge.split('、').forEach(g=>{if(gd[g])s+=`**${g}**：${gd[g]}\n`;});
    s+=`\n${a.strengthLabel}，同类${a.sameType} vs 异类${a.diffType}，月令${a.monthSupport?'得令':'不得令'}。`;
    return s;
  }

  // 14. 风水/住宅/方位/搬家/买房/装修
  if(q.includes('风水')||q.includes('住宅')||q.includes('方位')||q.includes('搬家')||q.includes('买房')||q.includes('住哪')||q.includes('朝向')||q.includes('装修')){
    let s=`**风水方位建议**\n\n`;
    s+=`**有利方位：**${wxDir[a.xiyong.xi]}、${wxDir[a.xiyong.yong]}\n**有利朝向：**朝${wxDir[a.xiyong.xi]}或${wxDir[a.xiyong.yong]}\n**有利色调：**${wxClr[a.xiyong.xi]}、${wxClr[a.xiyong.yong]}\n\n`;
    s+=`**忌讳方位：**${wxDir[a.xiyong.ji]}、${wxDir[a.xiyong.ji2]}\n\n`;
    const wm={'木':'木质家具、绿植','火':'暖光、红色装饰','土':'陶瓷石材、黄色系','金':'金属饰品、白色系','水':'鱼缸水景、深色系'};
    s+=`**装饰元素：**\n• ${a.xiyong.xi}：${wm[a.xiyong.xi]}\n• ${a.xiyong.yong}：${wm[a.xiyong.yong]}\n\n`;
    if(q.includes('买房'))s+=`**买房：**选${wxDir[a.xiyong.xi]}/${wxDir[a.xiyong.yong]}方向，楼层尾数${wxNum[a.xiyong.xi]}或${wxNum[a.xiyong.yong]}更佳。`;
    return s;
  }

  // 15. 改名/取名/起名
  if(q.includes('改名')||q.includes('取名')||q.includes('名字')||q.includes('起名')){
    let s=`**姓名五行建议**\n\n喜用：${a.xiyong.xi}、${a.xiyong.yong}\n`;
    if(a.missing!=='无')s+=`五行缺：${a.missing}\n`;
    const wc={'木':'林、森、柏、芳、荣、杰、梓、栋、楠、彬','火':'炎、煜、烨、灿、旭、晨、明、曦、辉','土':'坤、培、城、圣、峰、岩、磊、宇','金':'鑫、铭、锐、锦、钰、锋、银','水':'淼、泽、涵、润、浩、源、溪、澜'};
    s+=`\n**${a.xiyong.xi}属性字：**${wc[a.xiyong.xi]}\n**${a.xiyong.yong}属性字：**${wc[a.xiyong.yong]}\n\n忌用：${a.xiyong.ji}、${a.xiyong.ji2}属性的字`;
    return s;
  }

  // 16. 合婚/配对/属相配
  if(q.includes('合婚')||q.includes('合不合')||q.includes('般配')||q.includes('配对')||q.includes('属相配')){
    let s=`**合婚建议**\n\n日主${a.dayGan}（${a.dayWx}），配偶星${spWx}。\n\n`;
    const sh={'子':['辰','申'],'丑':['巳','酉'],'寅':['午','戌'],'卯':['未','亥'],'辰':['子','申'],'巳':['丑','酉'],'午':['寅','戌'],'未':['卯','亥'],'申':['子','辰'],'酉':['丑','巳'],'戌':['寅','午'],'亥':['卯','未']};
    const lh={'子':'丑','丑':'子','寅':'亥','卯':'戌','辰':'酉','巳':'申','午':'未','未':'午','申':'巳','酉':'辰','戌':'卯','亥':'寅'};
    const s3=sh[dz]||[],l6=lh[dz];
    s+=`**最佳属相：**\n• 三合：属${s3.map(z=>SHENG_XIAO[DI_ZHI.indexOf(z)]).join('、')}\n`;
    if(l6)s+=`• 六合：属${SHENG_XIAO[DI_ZHI.indexOf(l6)]}\n`;
    const ch=chM[dz];if(ch)s+=`\n**注意属相（六冲）：**属${SHENG_XIAO[DI_ZHI.indexOf(ch)]}\n`;
    s+=`\n**核心原则：**对方八字有你的喜用神五行（${a.xiyong.xi}/${a.xiyong.yong}），互补最重要。\n*精确合婚请提供对方出生时间。*`;
    return s;
  }

  // 17. 颜色/穿搭/幸运色/佩戴
  if(q.includes('颜色')||q.includes('穿什么')||q.includes('穿搭')||q.includes('幸运色')||q.includes('戴什么')||q.includes('佩戴')||q.includes('水晶')||q.includes('饰品')){
    let s=`**幸运颜色与饰品**\n\n**旺运色：**${wxClr[a.xiyong.xi]}、${wxClr[a.xiyong.yong]}\n**忌色：**${wxClr[a.xiyong.ji]}、${wxClr[a.xiyong.ji2]}\n\n`;
    const wj={'木':'绿幽灵、翡翠、绿松石','火':'红玛瑙、石榴石、琥珀','土':'黄水晶、虎眼石、蜜蜡','金':'白水晶、银饰、钛晶','水':'黑曜石、海蓝宝、蓝宝石'};
    s+=`**适合饰品/水晶：**\n• ${a.xiyong.xi}：${wj[a.xiyong.xi]}\n• ${a.xiyong.yong}：${wj[a.xiyong.yong]}\n\n**幸运数字：**${wxNum[a.xiyong.xi]}、${wxNum[a.xiyong.yong]}`;
    return s;
  }

  // 18. 数字/手机号/车牌/楼层
  if(q.includes('数字')||q.includes('手机号')||q.includes('车牌')||q.includes('楼层')||q.includes('门牌')){
    let s=`**幸运数字**\n\n喜：${wxNum[a.xiyong.xi]}、${wxNum[a.xiyong.yong]}\n忌：${wxNum[a.xiyong.ji]}、${wxNum[a.xiyong.ji2]}\n\n`;
    s+=`手机号/车牌/楼层尾数优选：${wxNum[a.xiyong.xi]}或${wxNum[a.xiyong.yong]}`;
    return s;
  }

  // 19. 前世/命运/天命/使命/纳音
  if(q.includes('前世')||q.includes('天命')||q.includes('使命')||q.includes('命运')||q.includes('注定')||q.includes('纳音')||q.includes('什么命')){
    let s=`**命局天赋与使命**\n\n年纳音：**${a.yearNayin}** | 日纳音：${a.bazi.day.nayin} | 生肖：${a.shengxiao}\n\n`;
    const mm={'木':'成长、突破、引领','火':'照亮、温暖、传播','土':'承载、包容、建设','金':'锋利、精进、变革','水':'流动、智慧、连接'};
    s+=`**五行使命（${a.dayWx}）：**${mm[a.dayWx]||''}\n\n`;
    s+=`命理不是束缚——它告诉你天赋在哪、潜力多大。路怎么走，永远是你自己选。`;
    return s;
  }

  // 20. 流月/这个月/下个月
  if(q.includes('这个月')||q.includes('本月')||q.includes('下个月')||q.includes('流月')){
    const now=new Date();let tM=now.getMonth()+1,tY=now.getFullYear();
    if(q.includes('下个月')){tM++;if(tM>12){tM=1;tY++;}}
    const mZM=[null,12,2,3,4,5,6,7,8,9,10,11,0];
    const mZ=DI_ZHI[mZM[tM]||0],mW=WU_XING_ZHI[DI_ZHI.indexOf(mZ)];
    const mg=mW===a.xiyong.xi||mW===a.xiyong.yong;
    let s=`**${tY}年${tM}月运势**\n\n月支约 ${mZ}，五行 ${mW}。\n\n`;
    s+=mg?`与喜用神合，本月运势偏好。适合推进重要事务。\n`:`与忌神相关，本月宜低调。不宜重大决定。\n`;
    s+=`\n**增运：**穿${wxClr[a.xiyong.xi]}，多朝${wxDir[a.xiyong.xi]}活动。`;
    return s;
  }

  // 21. 人际/朋友/小人/合作
  if(q.includes('人际')||q.includes('朋友')||q.includes('小人')||q.includes('同事')||q.includes('合作')||q.includes('社交')){
    let s=`**人际关系分析**\n\n`;
    if(bj>=3)s+=`比劫旺，社交圈广、朋友多。但竞争者也多，分辨真友。\n\n`;
    else if(bj<=1)s+=`比劫少，社交圈窄但质量高，知心朋友少而精。\n\n`;
    else s+=`比劫适中，人际关系平衡。\n\n`;
    if(q.includes('小人')){s+=`**防小人：**\n`;const jc=a.ssCount['劫财']||0;if(jc>=2)s+=`劫财多见，身边有争夺利益的人，注意合作中的利益分配。\n`;const qs=a.ssCount['七杀']||0;if(qs>=2)s+=`七杀多，工作中可能遇到压制你的人，以柔克刚。\n`;s+=`• 流年忌神年份小人更活跃\n• 佩戴${wxClr[a.xiyong.xi]}色系有助化解\n`;}
    s+=`**合作对象建议：**找${a.xiyong.xi}/${a.xiyong.yong}五行属性的人合作最互补。`;
    return s;
  }

  // 22. 什么时候 (通用时间类问题)
  if(q.includes('什么时候')){
    let s=`根据你的命盘，关键时间节点：\n\n`;
    s+=`**感情旺期：**大运走${spWx}五行时\n`;fDY(spWx).forEach(d=>{s+=`  • ${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）${mk(d)}\n`;});
    s+=`\n**财运旺期：**大运走${WX_KE[a.dayWx]}五行时\n`;fDY(WX_KE[a.dayWx]).forEach(d=>{s+=`  • ${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）${mk(d)}\n`;});
    s+=`\n**学业/贵人旺期：**大运走${WX_BESHENG[a.dayWx]}五行时\n`;fDY(WX_BESHENG[a.dayWx]).forEach(d=>{s+=`  • ${d.startAge}-${d.endAge}岁（${d.startYear}-${d.endYear}）${mk(d)}\n`;});
    s+=`\n具体想问哪方面的时间？可以追问 **正缘、财运、事业、健康** 等。`;
    return s;
  }

  // 默认
  let s=`根据你的命盘：\n\n**${a.dayGan}日主，${a.dayWx}命，${a.strengthLabel}，${a.mingge}**\n\n`;
  s+=`关于「${question}」：\n\n`;
  if(a.strengthLabel==='身强')s+=`身强，自身力量足，适合主动出击。\n• 喜泄（食伤发挥才华）和耗（财运）\n• 关键：找输出口\n`;
  else s+=`身弱，需借助外力。\n• 喜生扶（印星学习、比劫合作）\n• 关键：先强身后求财\n`;
  s+=`\n可以问我关于 **正缘、配偶、子女、事业、财运、感情、健康、学业、风水、改名、合婚、流年、大运、贵人、颜色饰品、幸运数字** 等话题。`;
  return s;
}
