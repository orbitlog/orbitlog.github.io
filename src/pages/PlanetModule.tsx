import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogPosts, getModuleContent, getPlanet } from '@/content/modules';
import './Page.css';

const themeClassByPlanet: Record<string, string> = {
  sun: 'module-page--sun',
  mercury: 'module-page--mercury',
  venus: 'module-page--venus',
  earth: 'module-page--earth',
  mars: 'module-page--mars',
  jupiter: 'module-page--jupiter',
  saturn: 'module-page--saturn',
  uranus: 'module-page--uranus',
  neptune: 'module-page--neptune',
};

export default function PlanetModule() {
  const navigate = useNavigate();
  const { planetId = 'sun' } = useParams();
  const planet = getPlanet(planetId);
  const content = getModuleContent(planet.id);
  const themeClass = themeClassByPlanet[planet.id] ?? themeClassByPlanet.sun;

  const visiblePosts = useMemo(() => blogPosts.slice(0, 4), []);

  return (
    <main className={`module-page ${themeClass}`}>
      <button className="back-btn" onClick={() => navigate('/')}>
        返回太阳系
      </button>

      <section className="module-hero">
        <p className="module-orbit-label">{planet.nameCN} / {planet.name}</p>
        <h1>{content.headline}</h1>
        <p>{content.subhead}</p>
      </section>

      <section className="module-layout">
        <div className="module-main">
          {content.sections.map((section) => (
            <article className="module-block" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              {section.items && (
                <div className="module-chip-grid">
                  {section.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
            </article>
          ))}

          {planet.id === 'mercury' && (
            <article className="module-block">
              <h2>最新文章</h2>
              <div className="post-list">
                {visiblePosts.map((post) => (
                  <a href={`/module/mercury#${post.slug}`} className="post-item" key={post.slug}>
                    <span>{post.date}</span>
                    <strong>{post.title}</strong>
                    <p>{post.summary}</p>
                  </a>
                ))}
              </div>
            </article>
          )}
        </div>

        <aside className="module-side">
          <h2>文件放置</h2>
          <ul>
            {content.storage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
