import { useState } from 'react';
import { skillGrowth } from '@/content/bannerlord-growth';

export default function SkillGrowthSimulator() {
  const [attribute, setAttribute] = useState(5);
  const [focus, setFocus] = useState(5);
  const [skill, setSkill] = useState(150);
  const { softLimit, zeroThreshold, phase } = skillGrowth(attribute, focus, skill);
  const x = (value: number) => 36 + value / 330 * 588;
  const reset = () => { setAttribute(5); setFocus(5); setSkill(150); };

  return <section className="skill-simulator" aria-label="属性与专精点模拟器">
    <header><div><p>TRY YOUR BUILD</p><h3>给成长，留一点空间</h3></div><button onClick={reset}>重置</button></header>
    <p className="skill-simulator-note">参考模型 · 未验证当前游戏版本 · 不计算实际学习倍率</p>
    <div className="skill-simulator-controls">
      <label htmlFor="growth-attribute">基础属性 <output>{attribute} / 10</output><input id="growth-attribute" type="range" min="1" max="10" step="1" value={attribute} onChange={e => setAttribute(Number(e.target.value))} /></label>
      <label htmlFor="growth-focus">技能专精 <output>{focus} / 5</output><input id="growth-focus" type="range" min="0" max="5" step="1" value={focus} onChange={e => setFocus(Number(e.target.value))} /></label>
      <label htmlFor="growth-skill">当前技能等级 <output>{skill}</output><input id="growth-skill" type="range" min="0" max="330" step="1" value={skill} onChange={e => setSkill(Number(e.target.value))} /></label>
    </div>
    <div className="skill-simulator-results" aria-live="polite"><div><span>学习软上限 L</span><strong>{softLimit}</strong></div><div><span>零学习阈值 M</span><strong>{zeroThreshold}</strong></div><div><span>当前阶段</span><strong className="skill-simulator-phase">{phase}</strong></div></div>
    <p className="skill-simulator-chart-label">概念性趋势（非实际倍率）</p>
    <svg viewBox="0 35 660 150" role="img" aria-label={`概念性成长趋势，软上限 ${softLimit}，零学习阈值 ${zeroThreshold}，当前技能 ${skill}`}>
      <rect x="36" y="42" width={x(softLimit) - 36} height="132" fill="#7ab99c" opacity=".12" />
      <rect x={x(softLimit)} y="42" width={x(zeroThreshold) - x(softLimit)} height="132" fill="#dfb66b" opacity=".15" />
      <rect x={x(zeroThreshold)} y="42" width={624 - x(zeroThreshold)} height="132" fill="#d18a7c" opacity=".16" />
      <path d={`M36 66 H${x(softLimit)} L${x(zeroThreshold)} 174 H624`} fill="none" stroke="#e3b28d" strokeWidth="2" />
      <path d={`M${x(skill)} 40 V178`} stroke="#f9ebdb" strokeWidth="2" strokeDasharray="4 4" />
    </svg>
    <div className="skill-simulator-axis"><span>0</span><span>330 · 技能等级</span></div>
    <div className="skill-simulator-legend"><span>正常学习</span><span>学习减速</span><span>停止普通学习</span></div>
    <p className="skill-simulator-note">曲线只示意三个阶段，斜率与高度不代表游戏数值。阈值不是绝对等级封顶；一次经验结算可能越过阈值。</p>
  </section>;
}
