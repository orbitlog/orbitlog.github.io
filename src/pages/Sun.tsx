import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CloudCurtain from '@/components/CloudCurtain';
import { blogPosts } from '@/content/modules';
import { projects } from '@/content/projects';
import { PLANET_DATA } from '@/types/planet';
import './Sun.css';

const destinations = Object.values(PLANET_DATA).filter((planet) => planet.id !== 'sun');

export default function Sun() {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);
  const leaving = useRef(false);
  const returnTimer = useRef<number | undefined>(undefined);
  const latestPost = blogPosts[0];
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => () => window.clearTimeout(returnTimer.current), []);

  const handleBack = () => {
    if (leaving.current) return;
    leaving.current = true;
    setIsLeaving(true);
    returnTimer.current = window.setTimeout(() => {
      navigate('/', { state: { returnFrom: 'sun' } });
    }, reducedMotion() ? 0 : 1300);
  };

  const explore = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });

  return (
    <main className="sun-page">
      {isLeaving && <CloudCurtain className="route-cloud route-cloud--closing" />}
      <header className="sun-nav">
        <button className="sun-wordmark" onClick={handleBack} disabled={isLeaving} aria-label="OrbitLog · 返回太阳系">ORBITLOG</button>
        <nav className="sun-location" aria-label="太阳页面导航">
          <span>太阳 <i>/</i> 站点核心</span>
          <button onClick={() => explore('sun-signals')} disabled={isLeaving}>最近的信号</button>
          <button onClick={() => explore('sun-destinations')} disabled={isLeaving}>探索目的地</button>
        </nav>
        <button className="sun-back" onClick={handleBack} disabled={isLeaving}><span aria-hidden="true">↶</span>{isLeaving ? '正在返航' : '返回太阳系'}</button>
      </header>

      <div className="sun-content" inert={isLeaving}>
        <section className="sun-hero sun-inner" aria-labelledby="sun-title">
          <div className="sun-hero-copy">
            <p className="sun-eyebrow">00 <span>/</span> THE HEART OF ORBITLOG</p>
            <h1 id="sun-title">太阳 <em>Sun</em></h1>
            <p className="sun-hero-subtitle">光的中心，故事的起点。</p>
            <p className="sun-hero-note">每一颗星球，都收藏着生活的一面。<br />在这里，接收新的信号，找到下一段旅程。</p>
            <button className="sun-text-action" onClick={() => explore('sun-signals')}>接收最近的信号 <span aria-hidden="true">↓</span></button>
          </div>
          <div className="sun-observatory" aria-hidden="true">
            <div className="sun-corona" />
            <div className="sun-orbit sun-orbit--outer"><i /></div>
            <div className="sun-orbit sun-orbit--inner" />
            <div className="sun-sphere" />
            <span className="sun-art-label sun-art-label--top">SOLAR OBSERVATORY <i /> 00</span>
            <span className="sun-art-label sun-art-label--bottom">一切环绕，皆有引力。</span>
            <span className="sun-art-cross sun-art-cross--one">+</span><span className="sun-art-cross sun-art-cross--two">+</span>
          </div>
          <div className="sun-hero-footer"><span><i /> 站点核心 / 持续记录</span><span>文字 · 作品 · 生活</span><button onClick={() => explore('sun-destinations')}>八颗行星，八个目的地 <span aria-hidden="true">↗</span></button></div>
        </section>

        <section className="sun-signals sun-inner" id="sun-signals" aria-labelledby="sun-signals-title">
          <div className="sun-section-heading"><div><p className="sun-eyebrow">01 / INCOMING SIGNALS</p><h2 id="sun-signals-title">最近的信号</h2></div><p>记录所想，建造所爱。</p></div>
          <div className="sun-signal-grid">
            <article className="sun-journal">
              <div className="sun-card-label"><span><i /> 来自水星 · 博客文章</span><span>JOURNAL</span></div>
              {latestPost ? <>
                <time className="sun-post-date" dateTime={latestPost.date}>{latestPost.date.replaceAll('-', ' / ')}</time>
                <h3><Link to={`/module/mercury/${latestPost.slug}`}>{latestPost.title}<span aria-hidden="true">↗</span></Link></h3>
                <p className="sun-post-summary">{latestPost.summary}</p>
                <div className="sun-post-tags">{latestPost.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </> : <><h3>等待下一段记录</h3><p className="sun-post-summary">新的文字，会从这里抵达。</p></>}
              <Link className="sun-section-link" to="/module/mercury">前往文章归档 <span aria-hidden="true">→</span></Link>
            </article>
            <div className="sun-projects">
              <div className="sun-card-label"><span><i /> 来自火星 · 项目与实验</span><span>CREATIONS</span></div>
              {projects.map((project, index) => <Link className="sun-project" key={project.id} to="/module/mars" aria-label={`${project.name} · ${project.subtitle}，前往火星项目画廊`}>
                <span className="sun-project-number">0{index + 1}</span>
                <div><span className="sun-project-category">{project.category}</span><h3>{project.name}</h3><p>{project.subtitle}</p></div>
                <span className="sun-project-arrow" aria-hidden="true">↗</span>
              </Link>)}
              <Link className="sun-section-link" to="/module/mars">探索项目画廊 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="sun-destinations sun-inner" id="sun-destinations" aria-labelledby="sun-destinations-title">
          <div className="sun-section-heading"><div><p className="sun-eyebrow">02 / FIND YOUR ORBIT</p><h2 id="sun-destinations-title">下一站，去哪里</h2></div><p>循着好奇，选择你的轨道。</p></div>
          <nav className="sun-destination-grid" aria-label="八个星球模块">
            {destinations.map((planet, index) => <Link className="sun-destination" to={planet.route} key={planet.id}>
              <div className="sun-destination-top"><span>0{index + 1} <i>/</i> {planet.name}</span><span className={`sun-destination-planet sun-destination-planet--${planet.id}`} style={{ backgroundImage: `url('/textures/planets/${planet.id}.jpg')` }} aria-hidden="true" /></div>
              <p className="sun-destination-name">{planet.nameCN}</p>
              <h3>{planet.module}<span aria-hidden="true">↗</span></h3>
              <p className="sun-destination-summary">{planet.summary}</p>
            </Link>)}
          </nav>
        </section>

        <footer className="sun-footer sun-inner"><div><span className="sun-footer-wordmark">ORBITLOG</span><p>让好奇有处停留，让记录自成宇宙。</p></div><button className="sun-back" onClick={handleBack} disabled={isLeaving}>返回太阳系 <span aria-hidden="true">↗</span></button><button className="sun-to-top" onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })}>回到顶部 <span aria-hidden="true">↑</span></button></footer>
      </div>
    </main>
  );
}
