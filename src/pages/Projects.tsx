import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CloudCurtain from '@/components/CloudCurtain';
import ProjectExhibition from '@/components/ProjectExhibition';
import { projects } from '@/content/projects';
import './Page.css';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { id: 'mars-landing', label: '登陆', name: 'LANDING' },
  { id: 'mars-traces', label: '发现', name: 'DISCOVERY' },
  { id: 'mars-artifacts', label: '作品', name: 'CREATION' },
];

function Arrow({ back = false }: { back?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={back ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Projects() {
  const navigate = useNavigate();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const project = projects[active];
  const external = project.href.startsWith('https://');

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handlePreference = () => setPaused(preference.matches);
    preference.addEventListener('change', handlePreference);
    return () => preference.removeEventListener('change', handlePreference);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setChapter(chapters.findIndex((item) => item.id === entry.target.id));
      }
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
    root.current?.querySelectorAll<HTMLElement>('[data-mars-chapter]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !root.current) return;
    const context = gsap.context(() => {
      gsap.fromTo('.mars-hero-title', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.5, ease: 'power2.out' });

      gsap.utils.toArray<HTMLElement>('.mars-landscape').forEach((image) => {
        gsap.fromTo(image, { yPercent: -3 }, {
          yPercent: 3, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('.mars-reveal').forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 34 }, {
          autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });

      gsap.fromTo('.mars-artifacts-stage', { autoAlpha: 0, y: 110 }, {
        autoAlpha: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '#mars-artifacts', start: 'top 76%', end: 'top 15%', scrub: 1 },
      });
    }, root);
    return () => context.revert();
  }, [paused]);

  const handleBack = () => {
    if (paused) {
      navigate('/', { state: { returnFrom: 'mars' } });
      return;
    }
    setIsLeaving(true);
    window.setTimeout(() => navigate('/', { state: { returnFrom: 'mars' } }), 1300);
  };

  const explore = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: paused ? 'auto' : 'smooth' });

  return (
    <main className={`mars-page${paused ? ' is-paused' : ''}`} ref={root}>
      {isLeaving && <CloudCurtain className="route-cloud route-cloud--closing" panelClassName="route-cloud__panel" />}

      <nav className="mars-nav" aria-label="火星页面导航">
        <Link to="/" className="mars-wordmark" aria-label="OrbitLog 首页">ORBITLOG</Link>
        <span className="mars-nav-location">火星 <span>/</span> 项目与实验</span>
        <button className="mars-back" onClick={handleBack} disabled={isLeaving}>返回太阳系 <span aria-hidden="true">↗</span></button>
      </nav>

      <nav className="mars-chapter-nav" aria-label="探索进度">
        {chapters.map((item, index) => <button key={item.id} onClick={() => explore(item.id)} className={chapter === index ? 'is-current' : ''} aria-label={`前往${item.label}`} aria-current={chapter === index ? 'step' : undefined}><span>{item.label}</span><i /></button>)}
      </nav>

      <section className="mars-scene mars-landing" id="mars-landing" data-mars-chapter aria-labelledby="mars-title">
        <img className="mars-landscape mars-landing-image" src="/media/projects/mars/landing.jpg" width="1672" height="941" alt="绵延的火星红色沙丘、岩石与远处的峡谷" fetchPriority="high" />
        <div className="mars-landing-shade" aria-hidden="true" />
        <header className="mars-hero-title mars-section-inner">
          <p className="mars-eyebrow">04 <span>/</span> THE RED PLANET</p>
          <h1 id="mars-title">火星 <em>Mars</em></h1>
          <p className="mars-hero-subtitle">项目与实验</p>
        </header>
        <div className="mars-landing-footer mars-section-inner"><span className="mars-coordinate">1.52 AU FROM HOME</span><button className="mars-explore" onClick={() => explore('mars-traces')}>向下探索<span className="mars-down-arrow" aria-hidden="true" /></button><span className="mars-coordinate">A JOURNEY INTO CREATION</span></div>
      </section>

      <section className="mars-scene mars-traces" id="mars-traces" data-mars-chapter aria-labelledby="traces-title">
        <img className="mars-landscape mars-traces-image" src="/media/projects/mars/traces.jpg" width="1672" height="941" loading="lazy" decoding="async" alt="火星荒漠中，微光沿沙地延伸，通向嵌入山体的石门与遗迹" />
        <div className="mars-traces-shade" aria-hidden="true" />
        <header className="mars-traces-title mars-section-inner mars-reveal">
          <p className="mars-eyebrow">02 <span>/</span> DISCOVERY</p>
          <h2 id="traces-title">文明的痕迹</h2>
          <p className="mars-section-english">TRACES OF CIVILIZATION</p>
        </header>
        <div className="mars-discovery-note mars-section-inner mars-reveal"><span className="mars-signal-dot" aria-hidden="true" /><p>在寂静的荒原上，<br />一些想法，开始留下自己的坐标。</p><button onClick={() => explore('mars-artifacts')}>循着微光，继续探索 <Arrow /></button></div>
      </section>

      <section className="mars-scene mars-artifacts" id="mars-artifacts" data-mars-chapter aria-labelledby="artifacts-title">
        <img className="mars-landscape mars-artifacts-image" src="/media/projects/mars/landing.jpg" width="1672" height="941" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <div className="mars-artifacts-shade" aria-hidden="true" />
        <div className="mars-section-inner mars-artifacts-inner">
          <header className="mars-artifacts-header mars-reveal"><div><p className="mars-eyebrow">03 <span>/</span> CREATION</p><h2 id="artifacts-title">作品档案</h2><p className="mars-section-english">SELECTED PROJECTS / 01—03</p></div><button className="mars-motion" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? '播放场景动态' : '暂停场景动态'}><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>{paused ? '播放动态' : '暂停动态'}</button></header>

          <div className="mars-artifacts-stage"><div className="mars-platform" aria-hidden="true"><span /></div><ProjectExhibition active={active} onSelect={setActive} paused={paused} /></div>

          <nav className="mars-project-index" aria-label="选择项目"><span className="mars-index-label">发现的作品</span>{projects.map((item, index) => <button key={item.id} aria-pressed={active === index} aria-controls="exhibit-detail" onClick={() => setActive(index)} className={active === index ? 'is-selected' : ''}><span>{String(index + 1).padStart(2, '0')}</span>{item.name}<i /></button>)}</nav>

          <article className="mars-project-detail" id="exhibit-detail" aria-live="polite" aria-atomic="true">
            <div className="mars-project-identity"><span>{String(active + 1).padStart(2, '0')} <span>/</span> {project.category}</span><h3>{project.name}</h3><p>{project.subtitle}</p></div>
            <div className="mars-project-story"><p>{project.description}</p><ul aria-label="技术与特性">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
            <div className="mars-project-links"><a className="mars-project-enter" href={project.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{project.action}<Arrow /></a><a className="mars-project-source" href={project.repository} target="_blank" rel="noreferrer" aria-label={`${project.name} 的 GitHub 源码（新窗口）`}>查看源代码 <span aria-hidden="true">↗</span></a></div>
          </article>

          <footer className="mars-footer"><Link to="/" className="mars-footer-wordmark">ORBITLOG</Link><p>保持好奇，持续建造。</p><div><button onClick={() => explore('mars-landing')}>返回地表 <span aria-hidden="true">↑</span></button><a href="https://github.com/orbitlog" target="_blank" rel="noreferrer">GITHUB ↗</a></div></footer>
        </div>
      </section>
    </main>
  );
}
