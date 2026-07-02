import { useNavigate } from 'react-router-dom';
import './Page.css';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← 返回太阳系
      </button>
      <div className="page-content">
        <h1 className="page-title">☀️ 太阳 - 关于我</h1>
        <div className="content-section">
          <p>这里是自我介绍模块，可以放置个人简介、技能、经历等内容。</p>
          <p>太阳是太阳系的中心，为整个系统提供光和热。</p>
        </div>
      </div>
    </div>
  );
}
