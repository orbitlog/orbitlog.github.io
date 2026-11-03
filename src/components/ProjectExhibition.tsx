import type { CSSProperties, PointerEvent } from 'react';
import { projects } from '@/content/projects';
import './ProjectExhibition.css';

interface ExhibitionProps {
  active: number;
  onSelect: (index: number) => void;
  paused: boolean;
}

const relationNodes = [
  [260, 214, 26], [151, 125, 17], [379, 130, 20], [136, 288, 19],
  [391, 285, 16], [271, 337, 13], [78, 199, 10], [449, 210, 11],
];
const nodeTones = ['#b48b55', '#dbc8a1', '#b47845', '#d9c09b', '#a6a789', '#c1ae8e', '#c4b18d', '#b5a481'];

function RelationCover() {
  return <svg viewBox="0 0 520 720" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="card-relation-light"><stop stopColor="#dfceb0" /><stop offset="1" stopColor="#bfa77f" /></radialGradient>
      <radialGradient id="card-relation-planet" cx=".3" cy=".3"><stop stopColor="#eed8af" /><stop offset="1" stopColor="#a48256" /></radialGradient>
      {nodeTones.map((tone, index) => <radialGradient key={tone} id={`card-node-${index}`} cx=".3" cy=".25"><stop stopColor="#f7f4e7" /><stop offset=".45" stopColor={tone} /><stop offset="1" stopColor={tone} /></radialGradient>)}
    </defs>
    <path fill="url(#card-relation-light)" d="M0 0h520v720H0z" />
    <circle cx="517" cy="12" r="164" fill="url(#card-relation-planet)" opacity=".75" />
    <text x="28" y="44" fill="#4f5e4b" fontSize="28" fontFamily="Georgia, serif" letterSpacing="-1">relaverse.</text>
    <text x="28" y="65" fill="#89917b" fontSize="7" letterSpacing="2.4">A PERSONAL UNIVERSE</text>
    <g stroke="#9eab9438" strokeWidth=".8"><ellipse cx="260" cy="217" rx="204" ry="109" transform="rotate(-23 260 217)" /><ellipse cx="260" cy="217" rx="144" ry="160" transform="rotate(33 260 217)" /></g>
    {relationNodes.slice(1).map(([x, y], index) => <path key={index} d={`M260 214 Q${(260 + x) / 2 + 12} ${(214 + y) / 2 - 16} ${x} ${y}`} stroke="#8a9d84" strokeWidth="1.2" opacity=".65" />)}
    {relationNodes.map(([x, y, radius], index) => <g key={index}><circle cx={x} cy={y} r={radius + 7} fill={nodeTones[index]} opacity=".14" /><circle cx={x} cy={y} r={radius} fill={`url(#card-node-${index})`} stroke="#ffffff9c" strokeWidth="1.4" /></g>)}
    <text x="260" y="220" textAnchor="middle" fill="#4b6444" fontSize="17" fontFamily="serif">我</text>
    <g fill="#f6f5ec" stroke="#c5cbbb" strokeWidth=".6"><rect x="173" y="140" width="81" height="25" rx="12.5" /><rect x="293" y="272" width="92" height="25" rx="12.5" /></g>
    <g fill="#7f8e73" fontSize="10"><text x="213" y="157" textAnchor="middle">一次相遇</text><text x="339" y="289" textAnchor="middle">共同的记忆</text></g>
    <text x="28" y="393" fill="#829077" fontSize="7" letterSpacing="1.2">EVERY CONNECTION HAS A STORY.</text>
  </svg>;
}

function TerminalCover() {
  return <svg viewBox="0 0 520 720" aria-hidden="true">
    <defs><linearGradient id="card-terminal-light" x2="1" y2="1"><stop stopColor="#263c34" /><stop offset="1" stopColor="#142721" /></linearGradient></defs>
    <path fill="url(#card-terminal-light)" d="M0 0h520v720H0z" />
    <path d="M24 61h472" stroke="#8aa288" opacity=".16" />
    {['#b88c76', '#c1ad79', '#89a584'].map((color, index) => <circle key={color} cx={34 + index * 19} cy="33" r="4" fill={color} />)}
    <text x="489" y="36" textAnchor="end" fill="#8b9f8b" fontSize="9" fontFamily="monospace">node-memory / zsh</text>
    <g fontFamily="monospace" fontSize="16" fill="#d4ddc5">
      <text x="31" y="108"><tspan fill="#a1b58b">↳</tspan> cd ~/projects/orbitlog</text>
      <text x="31" y="143"><tspan fill="#a1b58b">↳</tspan> nvm use 22</text>
      <text x="49" y="173" fill="#839a7e" fontSize="13">Now using node v22.14.0</text>
      <text x="31" y="227"><tspan fill="#a1b58b">↳</tspan> cd ../another-universe</text>
      <text x="49" y="257" fill="#839a7e" fontSize="13">Now using node v18.20.8</text>
      <text x="31" y="309"><tspan fill="#a1b58b">↳</tspan> cd ../orbitlog</text>
      <text x="49" y="340" fill="#c0c39a" fontSize="13">✓ Restored v22.14.0</text>
      <text x="31" y="382" fill="#a1b58b">↳</text>
    </g>
    <path fill="#b2c2a2" d="M51 367h8v16h-8z" />
  </svg>;
}

const particleDots = Array.from({ length: 1680 }, (_, index) => {
  const t = Math.floor(index / 14) / 120 * Math.PI * 2;
  const ring = index % 14 / 14 * Math.PI * 2;
  const radius = 1 + .34 * Math.cos(t * 3);
  const z = .5 * Math.sin(t * 3) + .15 * Math.sin(ring);
  return {
    x: 260 + (radius * Math.cos(t * 2) + .13 * Math.cos(ring) + z * .25) * 111,
    y: 223 + (radius * Math.sin(t * 2) * .7 + .16 * Math.sin(ring) - z * .55) * 111,
    radius: 1.05 + (z + .65) * .55,
    opacity: .35 + (z + .65) * .42,
  };
});

function ParticleCover() {
  return <svg viewBox="0 0 520 720" aria-hidden="true">
    <defs><radialGradient id="card-particle-light"><stop stopColor="#97603f" /><stop offset="1" stopColor="#4b2b1e" /></radialGradient></defs>
    <path fill="url(#card-particle-light)" d="M0 0h520v720H0z" />
    <text x="28" y="38" fill="#986649" fontSize="8" letterSpacing="2">STILL IMAGES,</text>
    <text x="28" y="53" fill="#986649" fontSize="8" letterSpacing="2">LIVING PARTICLES.</text>
    <ellipse cx="260" cy="225" rx="175" ry="120" transform="rotate(-25 260 225)" fill="none" stroke="#b0826150" strokeWidth=".7" />
    <g fill="#e5bd83">{particleDots.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={point.radius} opacity={point.opacity} />)}</g>
    <text x="28" y="393" fill="#986649" fontSize="7" letterSpacing="1.6">IMAGE → PARTICLES</text>
    <path d="M470 374v16m-8-8h16" stroke="#986649" strokeWidth=".8" />
  </svg>;
}

function CardCover({ index }: { index: number }) {
  if (index === 0) return <RelationCover />;
  if (index === 1) return <TerminalCover />;
  return <ParticleCover />;
}

function resetTilt(event: PointerEvent<HTMLButtonElement>) {
  event.currentTarget.style.setProperty('--pointer-rx', '0deg');
  event.currentTarget.style.setProperty('--pointer-ry', '0deg');
  event.currentTarget.style.setProperty('--shine-x', '50%');
  event.currentTarget.style.setProperty('--shine-y', '25%');
}

export default function ProjectExhibition({ active, onSelect, paused }: ExhibitionProps) {
  function tiltCard(event: PointerEvent<HTMLButtonElement>) {
    if (paused || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    event.currentTarget.style.setProperty('--pointer-rx', `${(y - .5) * -9}deg`);
    event.currentTarget.style.setProperty('--pointer-ry', `${(x - .5) * 11}deg`);
    event.currentTarget.style.setProperty('--shine-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--shine-y', `${y * 100}%`);
  }

  return <div className={`spatial-card-gallery${paused ? ' is-paused' : ''}`} role="group" aria-label="立体项目卡片">
    {projects.map((project, index) => <div className={`spatial-card-position spatial-card-position--${index}${active === index ? ' is-selected' : ''}`} key={project.id} style={{ '--card-index': index } as CSSProperties}>
      <span className="spatial-card-shadow" aria-hidden="true" />
      <button className={`spatial-card spatial-card--${project.id}`} onClick={() => onSelect(index)} onPointerMove={tiltCard} onPointerLeave={resetTilt} onPointerCancel={resetTilt} aria-label={`选择项目 ${project.name}`} aria-pressed={active === index} aria-controls="exhibit-detail">
        <span className="spatial-card-back" aria-hidden="true" />
        <span className="spatial-card-side spatial-card-side--left" aria-hidden="true" />
        <span className="spatial-card-side spatial-card-side--right" aria-hidden="true" />
        <span className="spatial-card-side spatial-card-side--bottom" aria-hidden="true" />
        <span className="spatial-card-face">
          <span className="spatial-card-topline"><span>ORBITLOG — SELECTED WORK</span><span>{String(index + 1).padStart(2, '0')}</span></span>
          <span className="spatial-card-cover"><CardCover index={index} /></span>
          <span className="spatial-card-caption"><strong>{project.name}</strong><span>{project.subtitle}</span></span>
          <span className="spatial-card-bottomline"><span>{project.category}</span><span className="spatial-card-arrow" aria-hidden="true">↗</span></span>
          <span className="spatial-card-shine" aria-hidden="true" />
        </span>
      </button>
    </div>)}
  </div>;
}
