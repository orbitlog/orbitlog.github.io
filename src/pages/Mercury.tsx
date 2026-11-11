import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CloudCurtain from '@/components/CloudCurtain';
import { blogPosts } from '@/content/modules';
import { readingMinutes } from '@/content/blog-utils';
import './Mercury.css';

export function MercuryShell({ children, article = false }: { children: ReactNode; article?: boolean }) {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);
  const leaving = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const returnToSystem = () => {
    if (leaving.current) return;
    leaving.current = true;
    setIsLeaving(true);
    timer.current = window.setTimeout(() => navigate('/', { state: { returnFrom: 'mercury' } }), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1300);
  };
  return (
    <main className={`mercury-page${article ? ' mercury-page--reading' : ''}`}>
      {isLeaving && <CloudCurtain className="route-cloud route-cloud--closing" />}
      <header className="mercury-nav">
        <button className="mercury-wordmark" onClick={returnToSystem} disabled={isLeaving} aria-label="OrbitLog · 返回太阳系">ORBITLOG</button>
        <nav className="mercury-breadcrumb" aria-label="当前位置" inert={isLeaving}><Link to="/module/mercury">水星 · 博客文章</Link><span>/</span><span>{article ? '阅读日志' : '文字归档'}</span></nav>
        <button className="mercury-return" onClick={returnToSystem} disabled={isLeaving}><span aria-hidden="true">↶</span>{isLeaving ? '正在返航' : '返回太阳系'}</button>
      </header>
      <div inert={isLeaving}>{children}</div>
      <footer className="mercury-footer mercury-inner" inert={isLeaving}><div><span>ORBITLOG / MERCURY</span><p>让想法留下轨迹。</p></div><Link to={article ? '/module/mercury' : '/module/sun'}>{article ? '返回全部文章' : '前往太阳 · 站点核心'} <span aria-hidden="true">↗</span></Link></footer>
    </main>
  );
}

export default function Mercury() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部文章');
  const [selectedTag, setSelectedTag] = useState('');
  const latestPost = blogPosts[0];
  const categories = ['全部文章', ...new Set(blogPosts.map((post) => post.category))];
  const search = query.trim().toLocaleLowerCase();
  const posts = blogPosts.filter((post) => (category === '全部文章' || post.category === category) && (!selectedTag || post.tags.includes(selectedTag)) && `${post.title} ${post.summary} ${post.tags.join(' ')} ${post.body}`.toLocaleLowerCase().includes(search));
  return (
    <MercuryShell>
      <div className="mercury-inner">
        <section className="mercury-hero" aria-labelledby="mercury-title">
          <div><p className="mercury-eyebrow">01 / FIELD NOTES FROM MERCURY</p><h1 id="mercury-title">水星 <em>Mercury</em></h1><p className="mercury-hero-subtitle">把稍纵即逝的想法，写进轨道。</p><p className="mercury-hero-note">关于技术的追问，关于日常的观察。<br />在离灵感最近的地方，慢慢写下来。</p></div>
          <div className="mercury-observatory" aria-hidden="true"><div className="mercury-orbit" /><div className="mercury-globe" /><span>0.39 AU / THE FIRST ORBIT</span></div>
        </section>
        {latestPost && <Link className={`mercury-feature${latestPost.tags.includes('UTF-8') ? '' : ' mercury-feature--text'}`} to={`/module/mercury/${latestPost.slug}`}>
          <div className="mercury-feature-copy"><p className="mercury-eyebrow">LATEST ENTRY <span>/</span> {latestPost.category}</p><h2>{latestPost.title}</h2><p>{latestPost.summary}</p><div className="mercury-post-meta"><time dateTime={latestPost.date}>{latestPost.date.replaceAll('-', ' / ')}</time><span>约 {readingMinutes(latestPost.body)} 分钟</span><span className="mercury-read-link">阅读全文 ↗</span></div></div>
          {latestPost.tags.includes('UTF-8') && <div className="mercury-byte-cover" aria-hidden="true"><div className="mercury-cover-top">CHARACTER → CODE POINT → BYTES</div><div><span>A</span><span>U+0041</span><code>41</code></div><div><span>中</span><span>U+4E2D</span><code>E4 B8 AD</code></div><div><span>🚀</span><span>U+1F680</span><code>F0 9F 9A 80</code></div><p>UTF-8 <span>文字，在字节间抵达。</span></p></div>}
        </Link>}
        <section className="mercury-archive" aria-labelledby="archive-title">
          <div className="mercury-archive-heading"><div><p className="mercury-eyebrow">THE WRITING ARCHIVE</p><h2 id="archive-title">轨道日志 <span>{String(blogPosts.length).padStart(2, '0')}</span></h2></div><label className="mercury-search"><span className="mercury-sr-only">搜索文章</span><span aria-hidden="true">⌕</span><input type="search" placeholder="搜索标题、内容、标签" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
          <div className="mercury-filters" aria-label="文章分类">{categories.map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{item === '全部文章' ? blogPosts.length : blogPosts.filter((post) => post.category === item).length}</span></button>)}</div>
          {selectedTag && <button className="mercury-active-tag" onClick={() => setSelectedTag('')}>标签：{selectedTag} <span aria-hidden="true">×</span><span className="mercury-sr-only">清除标签筛选</span></button>}
          <p className="mercury-results" role="status">{search || category !== '全部文章' || selectedTag ? `找到 ${posts.length} 篇文章` : '文字是微小的坐标，连接每一次思考。'}</p>
          <div className="mercury-post-list">{posts.map((post) => <article className="mercury-post-row" key={post.slug}><time dateTime={post.date}>{post.date}</time><div><span className="mercury-row-category">{post.category} <i>/</i> 约 {readingMinutes(post.body)} 分钟</span><h3><Link to={`/module/mercury/${post.slug}`}>{post.title}<span aria-hidden="true">↗</span></Link></h3><p>{post.summary}</p><div className="mercury-tags">{post.tags.map((tag) => <button key={tag} aria-pressed={selectedTag === tag} aria-label={`按标签 ${tag} 筛选`} onClick={() => setSelectedTag((current) => current === tag ? '' : tag)}>{tag}</button>)}</div></div></article>)}</div>
          {!posts.length && <div className="mercury-empty"><h3>这条轨道暂时没有记录</h3><p>换个关键词，或回到全部文章。</p><button onClick={() => { setQuery(''); setCategory('全部文章'); setSelectedTag(''); }}>查看全部文章 <span aria-hidden="true">↗</span></button></div>}
        </section>
      </div>
    </MercuryShell>
  );
}
