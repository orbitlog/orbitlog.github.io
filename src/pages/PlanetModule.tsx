import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import CloudCurtain from '@/components/CloudCurtain';
import { planetPageThemes } from '@/content/planet-pages';
import type { PlanetPageTheme } from '@/content/planet-pages';
import { PLANET_DATA } from '@/types/planet';
import type { PlanetInfo } from '@/types/planet';
import './PlanetModule.css';

const destinations = Object.values(PLANET_DATA).filter((planet) => planet.id !== 'sun');

function PlanetDestination({ planet, theme }: { planet: PlanetInfo; theme: PlanetPageTheme }) {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);
  const leaving = useRef(false);
  const returnTimer = useRef<number | undefined>(undefined);
  const index = destinations.findIndex((item) => item.id === planet.id);
  const previous = destinations[(index - 1 + destinations.length) % destinations.length];
  const next = destinations[(index + 1) % destinations.length];

  useEffect(() => () => window.clearTimeout(returnTimer.current), []);

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const returnToSystem = () => {
    if (leaving.current) return;
    leaving.current = true;
    setIsLeaving(true);
    returnTimer.current = window.setTimeout(() => {
      navigate('/', { state: { returnFrom: planet.id } });
    }, reducedMotion() ? 0 : 1300);
  };
  const explore = () => document.getElementById('planet-collection')?.scrollIntoView({
    behavior: reducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });

  return (
    <main className={`destination-page destination-page--${planet.id}`}>
      {isLeaving && <CloudCurtain className="route-cloud route-cloud--closing" />}
      <header className="destination-nav">
        <button className="destination-wordmark" onClick={returnToSystem} disabled={isLeaving} aria-label="OrbitLog · 返回太阳系">ORBITLOG</button>
        <nav className="destination-location" aria-label="当前位置">
          <span>{planet.nameCN}</span><span aria-hidden="true">/</span><span>{planet.module}</span>
        </nav>
        <button className="destination-return" onClick={returnToSystem} disabled={isLeaving}>{isLeaving ? '正在返航' : '返回太阳系'}</button>
      </header>

      <div inert={isLeaving}>
        <section className="destination-hero destination-inner" aria-labelledby="destination-title">
          <div className="destination-hero-copy">
            <p className="destination-eyebrow">{theme.eyebrow}</p>
            <h1 id="destination-title">{planet.nameCN}<em lang="en">{planet.name}</em></h1>
            <p className="destination-module">{planet.module}</p>
            <p className="destination-subtitle">{theme.subtitle}</p>
            <p className="destination-introduction">{theme.introduction}</p>
            <button className="destination-explore" onClick={explore}>走进{planet.nameCN}<span className="destination-explore-line" aria-hidden="true" /></button>
          </div>

          <div className="destination-observatory" aria-hidden="true">
            <div className="destination-orbit destination-orbit--outer" />
            <div className="destination-orbit destination-orbit--inner" />
            <div className="destination-orbit-axis" />
            <div className="destination-ring destination-ring--back" />
            <div className="destination-globe"><div className="destination-clouds" /></div>
            <div className="destination-ring destination-ring--front" />
            <span className="destination-art-name">{planet.name.toUpperCase()}</span>
            <span className="destination-art-coordinate">{planet.distance.toFixed(2)} AU / SOLAR DISTANCE</span>
          </div>

          <div className="destination-hero-footnote"><span>ORBITLOG / {planet.name.toUpperCase()}</span><p>{theme.observation}</p><span>{planet.module}</span></div>
        </section>

        <section className="destination-collection destination-inner" id="planet-collection" aria-labelledby="collection-title">
          <header className="destination-collection-heading">
            <div><p className="destination-eyebrow">{theme.collectionEnglish}</p><h2 id="collection-title">{theme.collection}</h2></div>
            <span className="destination-empty-label">尚未收录</span>
          </header>
          <div className="destination-empty">
            <div className="destination-empty-art" aria-hidden="true"><span /><span /><span /><span /></div>
            <div className="destination-empty-copy"><p className="destination-empty-caption">A LITTLE SPACE FOR WHAT COMES NEXT</p><h3>{theme.emptyTitle}</h3><p>{theme.emptyDescription}</p></div>
          </div>
        </section>

        <nav className="destination-neighbors destination-inner" aria-label="继续探索星球">
          <Link to={previous.route}><span>上一站 / {previous.name}</span><strong>{previous.nameCN}<small>{previous.module}</small></strong></Link>
          <Link to="/module/sun" className="destination-home"><span>回到光的中心</span><strong>太阳<small>站点核心</small></strong></Link>
          <Link to={next.route}><span>下一站 / {next.name}</span><strong>{next.nameCN}<small>{next.module}</small></strong></Link>
        </nav>

        <footer className="destination-footer destination-inner"><div><span>ORBITLOG / {planet.name.toUpperCase()}</span><p>{theme.footer}</p></div><button onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })}>回到顶部</button></footer>
      </div>
    </main>
  );
}

export default function PlanetModule() {
  const { planetId = 'sun' } = useParams();
  const planet = PLANET_DATA[planetId];
  const theme = planetPageThemes[planetId];
  if (!planet || !theme) return <Navigate to="/module/sun" replace />;
  return <PlanetDestination key={planet.id} planet={planet} theme={theme} />;
}
