import { PLANET_DATA } from '@/types/planet';

const blogFiles = import.meta.glob('./blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  body: string;
}

export interface ModuleSection {
  title: string;
  text: string;
  items?: string[];
}

export interface ModulePageContent {
  planetId: string;
  headline: string;
  subhead: string;
  storage: string[];
  sections: ModuleSection[];
}

function readFrontMatter(markdown: string) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { meta: {}, body: markdown };
  }

  const meta = Object.fromEntries(
    match[1].split('\n').map((line) => {
      const [key, ...rest] = line.split(':');
      return [key.trim(), rest.join(':').trim()];
    }),
  );

  return { meta, body: match[2].trim() };
}

export const blogPosts: BlogPost[] = Object.entries(blogFiles)
  .map(([path, markdown]) => {
    const { meta, body } = readFrontMatter(markdown);
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path;

    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '',
      summary: meta.summary ?? body.split('\n')[0] ?? '',
      tags: meta.tags ? meta.tags.split(',').map((tag) => tag.trim()) : [],
      body,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export const MODULE_CONTENT: Record<string, ModulePageContent> = {
  sun: {
    planetId: 'sun',
    headline: '站点核心',
    subhead: '这里是 OrbitLog 的总控台，聚合最新内容、模块入口和更新节奏。',
    storage: [
      '全站配置：src/content/modules.ts',
      '首页与太阳系交互：src/pages/System.tsx',
      '星球资料：src/types/planet.ts',
    ],
    sections: [
      {
        title: '最新动态',
        text: '把最想让访客先看到的内容放在这里，比如最近一篇文章、最近一个项目、最近一组照片。',
        items: ['最新博客从水星同步', '个人简介在地球维护', '相册入口在土星维护'],
      },
    ],
  },
  mercury: {
    planetId: 'mercury',
    headline: '博客文章',
    subhead: '水星离太阳最近，也最适合承载快速、明亮、刚刚发生的文字。',
    storage: [
      '今天的博客 Markdown：src/content/blog/YYYY-MM-DD-title.md',
      '文章内引用图片：public/media/blog/YYYY-MM-DD-title/',
      '文章列表读取逻辑：src/content/modules.ts',
    ],
    sections: [
      {
        title: '写作栏目',
        text: '可以按标签区分技术、生活、读书、灵感。后续如果文章变多，再加归档页和全文 Markdown 渲染。',
        items: ['技术笔记', '日常随笔', '阅读摘录', '项目复盘'],
      },
    ],
  },
  venus: {
    planetId: 'venus',
    headline: '灵感与审美',
    subhead: '金星适合存放那些先被喜欢、再被整理的东西。',
    storage: [
      '灵感图片：public/media/inspiration/',
      '设计参考文字：src/content/inspiration/',
      '音乐、电影、句子清单：src/content/modules.ts',
    ],
    sections: [
      {
        title: '收藏方向',
        text: '这里可以做成灵感墙，用热雾、金色滤镜和半透明边框制造金星大气感。',
        items: ['视觉参考', '喜欢的句子', '音乐和电影', '颜色与材质'],
      },
    ],
  },
  earth: {
    planetId: 'earth',
    headline: '个人简介',
    subhead: '地球页面呈现最像“家”的信息：我是谁、正在做什么、能一起创造什么。',
    storage: [
      '个人资料文本：src/content/profile.ts',
      '头像和生活照片：public/media/profile/',
      '简历或附件：public/files/profile/',
    ],
    sections: [
      {
        title: '关于我',
        text: '这里可以放简介、技能栈、经历、现在关注的方向，以及你希望访客记住的三四件事。',
        items: ['个人简介', '技能树', '经历时间线', '联系方式'],
      },
    ],
  },
  mars: {
    planetId: 'mars',
    headline: '项目与实验',
    subhead: '火星页面适合放正在建造的项目、原型、失败实验和探索日志。',
    storage: [
      '项目数据：src/content/projects.ts',
      '项目截图：public/media/projects/project-name/',
      '可下载演示文件：public/files/projects/',
    ],
    sections: [
      {
        title: '项目陈列',
        text: '每个项目可以有截图、技术栈、状态、链接和复盘。视觉上使用红色岩层、山脉和基地舱的元素。',
        items: ['已完成作品', '进行中原型', '实验记录', '踩坑复盘'],
      },
    ],
  },
  jupiter: {
    planetId: 'jupiter',
    headline: '兴趣宇宙',
    subhead: '木星足够巨大，适合放那些长期环绕你的兴趣主题。',
    storage: [
      '兴趣清单：src/content/interests.ts',
      '兴趣相关图片：public/media/interests/',
      '收藏链接：src/content/modules.ts',
    ],
    sections: [
      {
        title: '兴趣条带',
        text: '用木星气态条纹的视觉把兴趣分成不同纬度，适合放电影、摄影、游戏、阅读、工具和研究主题。',
        items: ['摄影', '电影', '游戏', '阅读', '工具收藏'],
      },
    ],
  },
  saturn: {
    planetId: 'saturn',
    headline: '相册与生活',
    subhead: '土星的环像一卷胶片，这里收纳生活照片、旅行和猫咪相册。',
    storage: [
      '猫咪照片：public/media/cats/',
      '旅行照片：public/media/travel/place-name/',
      '生活碎片：public/media/life/YYYY/',
    ],
    sections: [
      {
        title: '相册分类',
        text: '后续可以把这里做成环形照片轨道，点击照片展开成带日期和地点的详情。',
        items: ['猫咪相册', '旅行记录', '日常照片', '重要时刻'],
      },
    ],
  },
  uranus: {
    planetId: 'uranus',
    headline: '知识库',
    subhead: '天王星冷静、倾斜、安静，适合结构化保存长期知识。',
    storage: [
      '学习笔记：src/content/notes/',
      '知识图谱数据：src/content/knowledge.ts',
      '资料附件：public/files/knowledge/',
    ],
    sections: [
      {
        title: '知识结构',
        text: '这里可以维护专题索引、概念卡片、工具清单和学习路线。视觉上走冰蓝、玻璃、网格线。',
        items: ['专题索引', '概念卡片', '工具清单', '学习路线'],
      },
    ],
  },
  neptune: {
    planetId: 'neptune',
    headline: '未来计划',
    subhead: '海王星遥远但有方向，存放愿望清单、路线图和还没抵达的事。',
    storage: [
      '路线图数据：src/content/roadmap.ts',
      '愿望清单：src/content/wishlist.ts',
      '计划相关图片：public/media/future/',
    ],
    sections: [
      {
        title: '远方清单',
        text: '可以记录年度目标、旅行愿望、想做的产品、想学的技能，以及完成后的归档。',
        items: ['年度目标', '旅行愿望', '产品路线', '学习计划'],
      },
    ],
  },
};

export function getModuleContent(planetId: string) {
  return MODULE_CONTENT[planetId] ?? MODULE_CONTENT.sun;
}

export function getPlanet(planetId: string) {
  return PLANET_DATA[planetId] ?? PLANET_DATA.sun;
}
