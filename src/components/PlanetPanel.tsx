import { usePlanet } from '@/contexts/PlanetContext';
import { useCamera } from '@/contexts/CameraContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import CloudCurtain from './CloudCurtain';
import './PlanetPanel.css';

export default function PlanetPanel() {
  const { selectedPlanet, setSelectedPlanet, isNavigating, setIsNavigating } = usePlanet();
  const { landOnFocused, resetView } = useCamera();
  const navigate = useNavigate();
  const [landingPhase, setLandingPhase] = useState<'idle' | 'approach' | 'cloud'>('idle');
  const navigationTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(navigationTimer.current), []);

  if (!selectedPlanet) return null;

  const handleEnter = async () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setLandingPhase('approach');
    await landOnFocused();
    setLandingPhase('cloud');
    navigationTimer.current = window.setTimeout(() => {
      navigate(selectedPlanet.route, { state: { fromAtmosphere: true } });
    }, 180);
  };

  const handleExit = () => {
    if (isNavigating) return;
    setSelectedPlanet(null);
    void resetView();
  };

  return (
    <>
      {landingPhase !== 'idle' && <CloudCurtain className={`landing-overlay landing-overlay--${landingPhase}`} />}
      <aside className={`planet-panel ${isNavigating ? 'planet-panel--landing' : ''}`} style={{ '--selected-color': selectedPlanet.color } as CSSProperties} aria-labelledby="planet-module-title">
        <div className="planet-panel-heading"><p className="planet-kicker"><i />目的地已锁定</p><button className="planet-panel-close" onClick={handleExit} disabled={isNavigating} aria-label="关闭星球详情，返回太阳系总览">×</button></div>
        <p className="planet-name">{selectedPlanet.nameCN}<span>/ {selectedPlanet.name}</span></p>
        <h2 id="planet-module-title">{selectedPlanet.module}</h2>
        <p className="module-summary">{selectedPlanet.summary}</p>
        <p className="planet-description">{selectedPlanet.description}</p>
        <div className="planet-coordinates"><span>距太阳 <strong>{selectedPlanet.distance} AU</strong></span><span>{selectedPlanet.period ? `公转周期 ${selectedPlanet.period} 年` : '太阳系的中心'}</span></div>
        <button className="enter-btn" onClick={handleEnter} disabled={isNavigating}>进入{selectedPlanet.module}<span aria-hidden="true">↗</span></button>
        <button className="exit-btn" onClick={handleExit} disabled={isNavigating}><span aria-hidden="true">←</span> 返回太阳系总览 <kbd>Esc</kbd></button>
      </aside>
    </>
  );
}
