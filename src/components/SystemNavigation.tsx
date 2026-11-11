import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { usePlanet } from '@/contexts/PlanetContext';
import { useCamera } from '@/contexts/CameraContext';
import { PLANET_DATA } from '@/types/planet';

const planets = Object.values(PLANET_DATA);

export default function SystemNavigation({ isReturning }: { isReturning: boolean }) {
  const { selectedPlanet, setSelectedPlanet, selectPlanet, readyPlanets, isNavigating } = usePlanet();
  const { resetView } = useCamera();
  const busy = isReturning || isNavigating;
  const ready = readyPlanets.length === planets.length;
  const selectedDestination = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedPlanet || !window.matchMedia('(max-width: 760px)').matches) return;
    selectedDestination.current?.scrollIntoView({
      block: 'nearest', inline: 'center',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [selectedPlanet]);

  const showOverview = useCallback(() => {
    if (busy || !ready) return;
    setSelectedPlanet(null);
    void resetView();
  }, [busy, ready, setSelectedPlanet, resetView]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedPlanet) showOverview();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPlanet, showOverview]);

  return (
    <div className={`system-interface${selectedPlanet ? ' has-selection' : ''}${isNavigating ? ' is-departing' : ''}`}>
      <header className="system-nav">
        <button className="system-wordmark" onClick={showOverview} disabled={busy || !ready} aria-label="OrbitLog · 返回太阳系总览">ORBITLOG<span>个人宇宙 · 持续记录</span></button>
        <nav className="system-breadcrumb" aria-label="当前位置">
          <button onClick={showOverview} disabled={busy || !ready} aria-current={selectedPlanet ? undefined : 'page'}>太阳系</button>
          <span>/</span><span>{selectedPlanet ? `${selectedPlanet.nameCN} · ${selectedPlanet.module}` : '探索总览'}</span>
        </nav>
        <button className="system-overview" onClick={showOverview} disabled={busy || !ready}>
          <span aria-hidden="true">{selectedPlanet ? '↶' : '⤢'}</span>{isReturning ? '正在返航' : selectedPlanet ? '返回太阳系总览' : '重置视角'}
        </button>
      </header>

      {!selectedPlanet && (
        <section className="system-intro" aria-labelledby="system-title">
          <p className="system-eyebrow">A PERSONAL UNIVERSE</p>
          <h1 id="system-title">循着星轨<br />发现我的宇宙<span>Every orbit tells a story.</span></h1>
          <p className="system-intro-note">文字、作品与生活，各有轨道。<br />选择一颗星球，开始一段探索。</p>
          <span className="system-intro-line" />
        </section>
      )}

      <nav className="system-directory" aria-label="星球与模块目录">
        <div className="system-directory-heading"><h2>探索目的地</h2><span>09 / DESTINATIONS</span></div>
        <div className="system-destinations">
          {planets.map((planet, index) => (
            <button
              key={planet.id}
              ref={selectedPlanet?.id === planet.id ? selectedDestination : undefined}
              className={`system-destination${selectedPlanet?.id === planet.id ? ' is-current' : ''}`}
              style={{ '--destination-color': planet.color } as CSSProperties}
              onClick={() => selectPlanet(planet.id)}
              disabled={busy || !readyPlanets.includes(planet.id)}
              aria-label={`${planet.nameCN} · ${planet.module}`}
              aria-pressed={selectedPlanet?.id === planet.id}
            >
              <span className="system-destination-number">{String(index).padStart(2, '0')}</span>
              <span className={`system-planet-thumb system-planet-thumb--${planet.id}`} style={{ backgroundImage: `url('/textures/planets/${planet.id}.jpg')` }} aria-hidden="true" />
              <span className="system-destination-copy"><strong>{planet.module}</strong><span>{planet.nameCN}<i>/</i><span>{planet.name}</span></span></span>
              <span className="system-destination-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <p className="system-directory-note">{isReturning ? '正在穿过云层，返回星球轨道' : !ready ? '正在载入星球…' : '选择目的地 · 聚焦后进入模块'}</p>
      </nav>

      <footer className="system-footer">
        <span className="system-live"><i />{selectedPlanet ? `正在环绕 ${selectedPlanet.nameCN}` : 'SOLAR SYSTEM / 太阳系'}</span>
        <p>{selectedPlanet ? <>拖动环绕 <span>·</span> 滚轮缩放 <span>·</span> <kbd>Esc</kbd> 返回总览</> : <>拖动旋转 <span>·</span> 滚轮缩放 <span>·</span> 选择目的地</>}</p>
        <span className="system-footer-coordinate">一颗恒星 · 八颗行星 · 无尽的故事</span>
      </footer>
    </div>
  );
}
