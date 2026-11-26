import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import EncodingLab from '@/components/EncodingLab';
import SkillGrowthSimulator from '@/components/SkillGrowthSimulator';
import PianoChordLab from '@/components/PianoChordLab';
import { blogPosts } from '@/content/modules';
import { interestPosts, interestSeries } from '@/content/interests';
import { articleHeadings, readingMinutes, remarkArticle } from '@/content/blog-utils';
import { MercuryShell } from './Mercury';
import '@/components/InterestCollection.css';

export default function MercuryArticle({ planetId = 'mercury' }: { planetId?: 'mercury' | 'jupiter' }) {
  const { slug } = useParams();
  const isJupiter = planetId === 'jupiter';
  const base = `/module/${planetId}`;
  const backLabel = isJupiter ? '返回兴趣宇宙' : '返回全部文章';
  const post = (isJupiter ? interestPosts : blogPosts).find((item) => item.slug === slug);
  const series = interestSeries.find(item => item.id === post?.series);
  const seriesPosts = interestPosts.filter(item => item.series === series?.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const headings = useMemo(() => articleHeadings(post?.body ?? ''), [post?.body]);
  const [reading, setReading] = useState({ progress: 0, active: '' });
  // Keep renderer identities stable: scroll progress updates must not remount
  // interactive Markdown blocks and reset their local state or keyboard focus.
  const markdownComponents = useMemo<Components>(() => ({
    table: ({ children }) => <div className="mercury-table-scroll" tabIndex={0} role="region" aria-label="文章表格，可横向滚动"><table>{children}</table></div>,
    img: ({ src, alt }) => isJupiter ? <a href={src} target="_blank" rel="noreferrer" aria-label={`${alt}，打开大图`}><img src={src} alt={alt} loading="lazy" decoding="async" /></a> : <img src={src} alt={alt} />,
    pre: ({ node, children }) => {
      const code = node?.children.find((child) => child.type === 'element' && child.tagName === 'code');
      const languages = code?.type === 'element' ? code.properties.className as string[] | undefined : undefined;
      if (languages?.includes('language-encoding-lab')) return <EncodingLab />;
      if (languages?.includes('language-bannerlord-growth')) return <SkillGrowthSimulator />;
      if (languages?.includes('language-piano-chord-lab')) return <PianoChordLab />;
      return <div className="mercury-code-block"><span className="mercury-code-language">{languages?.[0]?.replace('language-', '') ?? 'CODE'}</span><pre>{children}</pre></div>;
    },
    a: ({ href, children }) => <a href={href} target={href?.startsWith('https://') ? '_blank' : undefined} rel={href?.startsWith('https://') ? 'noreferrer' : undefined}>{children}</a>,
  }), [isJupiter]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const article = document.getElementById('mercury-article-body');
      if (!article) return;
      const bounds = article.getBoundingClientRect();
      const distance = bounds.height - window.innerHeight + 120;
      const progress = distance > 0 ? Math.max(0, Math.min(100, (120 - bounds.top) / distance * 100)) : bounds.top < window.innerHeight ? 100 : 0;
      const active = headings.filter((heading) => (document.getElementById(heading.id)?.getBoundingClientRect().top ?? Infinity) <= 180).at(-1)?.id ?? headings[0]?.id ?? '';
      setReading({ progress, active });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [headings]);

  if (!post) return <MercuryShell article planetId={planetId}><div className="mercury-not-found mercury-inner"><p className="mercury-eyebrow">SIGNAL NOT FOUND / 404</p><h1>这篇日志尚未抵达</h1><p>文章可能已移动，去归档里找找吧。</p><Link to={base}>{backLabel}</Link></div></MercuryShell>;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });

  return (
    <MercuryShell article planetId={planetId}>
      <div className="mercury-reading-bar" role="progressbar" aria-label="文章阅读进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(reading.progress)}><span style={{ width: `${reading.progress}%` }} /></div>
      <div className="mercury-inner">
        <header className="mercury-article-header"><Link className="mercury-back-to-list" to={base}>{backLabel}</Link><p className="mercury-eyebrow">{planetId.toUpperCase()} JOURNAL <span>/</span> {post.category}</p><h1>{post.title}</h1><p className="mercury-article-deck">{post.summary}</p><div className="mercury-post-meta"><time dateTime={post.date}>{post.date.replaceAll('-', ' / ')}</time><span>约 {readingMinutes(post.body)} 分钟阅读</span><span>ORBITLOG</span></div><div className="mercury-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></header>
        {series && <nav className="interest-series-navigation" aria-label="合集文章"><Link to={`${base}#${series.id}`}>{series.title}</Link><ol>{seriesPosts.map(item => <li key={item.slug}><Link to={`${base}/${item.slug}`} aria-current={item.slug === post.slug ? 'page' : undefined}>第 {item.order} 篇 · {item.title}</Link></li>)}</ol></nav>}
        {headings.length > 0 && <details className="mercury-toc-mobile"><summary>本文目录 · {headings.length} 个章节</summary><nav aria-label="手机文章目录">{headings.map((heading) => <button key={heading.id} onClick={() => scrollTo(heading.id)}>{heading.text}</button>)}</nav></details>}
        <div className="mercury-reading-layout">
          <article className="mercury-prose" id="mercury-article-body" aria-label={post.title}>
            <Markdown key={post.slug} remarkPlugins={[remarkGfm, remarkArticle]} components={markdownComponents}>{post.body}</Markdown>
            <div className="mercury-article-end"><span>END OF TRANSMISSION</span><p>思考抵达这里，探索仍在继续。</p><Link to={base}>{backLabel}</Link></div>
          </article>
          {headings.length > 0 && <aside className="mercury-toc" aria-label="文章目录"><div className="mercury-toc-title"><span>本文目录</span><span>{Math.round(reading.progress)}%</span></div><nav>{headings.map((heading, index) => <button key={heading.id} onClick={() => scrollTo(heading.id)} aria-current={reading.active === heading.id ? 'location' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{heading.text}</button>)}</nav><Link to={base}>{backLabel}</Link></aside>}
        </div>
      </div>
    </MercuryShell>
  );
}
