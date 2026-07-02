import { usePlanet } from '@/contexts/PlanetContext';
import { useNavigate } from 'react-router-dom';
import './PlanetPanel.css';

export default function PlanetPanel() {
  const { selectedPlanet, setSelectedPlanet } = usePlanet();
  const navigate = useNavigate();

  if (!selectedPlanet) return null;

  const handleEnter = () => {
    if (selectedPlanet.route) {
      navigate(selectedPlanet.route);
    }
  };

  const handleExit = () => {
    setSelectedPlanet(null);
  };

  return (
    <div className="planet-panel">
      <div className="planet-content">
        <h2 style={{ color: selectedPlanet.color }}>
          {selectedPlanet.nameCN}
          <span className="planet-name-en">{selectedPlanet.name}</span>
        </h2>
        
        {selectedPlanet.module && (
          <div className="module-tag">模块：{selectedPlanet.module}</div>
        )}

        <div className="planet-stats">
          <div className="stat-item">
            <span className="stat-label">相对大小</span>
            <span className="stat-value">{selectedPlanet.size}x</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">距离(AU)</span>
            <span className="stat-value">{selectedPlanet.distance}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">公转周期</span>
            <span className="stat-value">{selectedPlanet.period}年</span>
          </div>
        </div>

        <p className="planet-description">{selectedPlanet.description}</p>

        <div className="button-group">
          {selectedPlanet.route && (
            <button className="enter-btn" onClick={handleEnter}>
              进入模块
            </button>
          )}
          <button className="exit-btn" onClick={handleExit}>
            退出
          </button>
        </div>
      </div>
    </div>
  );
}
