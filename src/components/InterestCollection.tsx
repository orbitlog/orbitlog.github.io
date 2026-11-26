import { Link } from 'react-router-dom';
import { interestPosts, interestSeries } from '@/content/interests';
import { readingMinutes } from '@/content/blog-utils';
import './InterestCollection.css';

export default function InterestCollection() {
  return <div className="interest-collection">{interestSeries.map(series => {
    const posts = interestPosts.filter(post => post.series === series.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return <article className="interest-series" key={series.id} id={series.id}>
      <div className="interest-series-intro"><p className="destination-eyebrow">{series.category} · 持续更新</p><h3>{series.title}</h3><p>{series.description}</p><span className="interest-count">已收录 {posts.length} 篇</span></div>
      <div className="interest-series-posts">{posts.map(post => <Link className="interest-post" key={post.slug} to={`/module/jupiter/${post.slug}`}>
        <img src={series.cover} alt={series.coverAlt} width={series.coverWidth} height={series.coverHeight} loading="lazy" />
        <div><p className="interest-post-meta">第 {post.order} 篇 · {post.date} · 约 {readingMinutes(post.body)} 分钟</p><h4>{post.title}</h4><p>{post.summary}</p><span className="interest-read">阅读这一篇</span></div>
      </Link>)}<details className="interest-planned"><summary>接下来想写</summary><ul>{series.planned.map(title => <li key={title}>{title}<span>待整理</span></li>)}</ul></details></div>
    </article>;
  })}</div>;
}
