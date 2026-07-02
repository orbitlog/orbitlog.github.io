import { usePlanet } from '@/contexts/PlanetContext';
import { useCamera } from '@/contexts/CameraContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import './PlanetPanel.css';

export default function PlanetPanel() {
  const { selectedPlanet, setSelectedPlanet } = usePlanet();
  const { resetView } = useCamera();
  const navigate = useNavigate();
  const [isLanding, setIsLanding] = useState(false);

  if (!selectedPlanet) return null;

  const handleEnter = () => {
    if (selectedPlanet.route) {
      setIsLanding(true);
      window.setTimeout(() => {
        navigate(selectedPlanet.route);
      }, 1350);
    }
  };

  const handleExit = () => {
    setIsLanding(false);
    setSelectedPlanet(null);
    resetView();
  };

  return (
    <>
      {isLanding && (
        <div className="landing-overlay" style={{ '--planet-color': selectedPlanet.color } as CSSProperties}>
          <div className="landing-haze" />
          <div className="landing-core" />
        </div>
      )}
      <aside className={`planet-panel ${isLanding ? 'planet-panel--landing' : ''}`}>
        <div className="planet-content">
          <p className="planet-kicker">当前聚焦</p>
          <h2 style={{ color: selectedPlanet.color }}>
            {selectedPlanet.nameCN}
            <span className="planet-name-en">{selectedPlanet.name}</span>
          </h2>

          <div className="module-tag">模块：{selectedPlanet.module}</div>
          <p className="module-summary">{selectedPlanet.summary}</p>

          <div className="planet-stats">
            <div className="stat-item">
              <span className="stat-label">相对大小</span>
              <span className="stat-value">{selectedPlanet.size}x</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">距离 AU</span>
              <span className="stat-value">{selectedPlanet.distance}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">周期</span>
              <span className="stat-value">{selectedPlanet.period || '核心'}{selectedPlanet.period ? ' 年' : ''}</span>
            </div>
          </div>

          <p className="planet-description">{selectedPlanet.description}</p>

          <div className="button-group">
            <button className="exit-btn" onClick={handleExit} disabled={isLanding}>
              退出
            </button>
            <button className="enter-btn" onClick={handleEnter} disabled={isLanding}>
              进入模块
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
