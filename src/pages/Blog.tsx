import { useNavigate } from 'react-router-dom';
import './Page.css';

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← 返回太阳系
      </button>
      <div className="page-content">
        <h1 className="page-title">🌍 地球 - 前端博客</h1>
        <div className="content-section">
          <h2>技术文章</h2>
          <p>这里可以展示前端技术博客文章列表。</p>
          <ul>
            <li>React 最佳实践</li>
            <li>Three.js 3D 开发指南</li>
            <li>TypeScript 进阶技巧</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
