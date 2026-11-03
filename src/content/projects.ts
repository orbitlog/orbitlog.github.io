export type ProjectCategory = '应用' | '开发工具' | '视觉实验';

export interface Project {
  id: 'relaverse' | 'node-memory' | 'img2particles';
  name: string;
  subtitle: string;
  category: ProjectCategory;
  description: string;
  tags: string[];
  repository: string;
  href: string;
  action: string;
}

export const projects: Project[] = [
  {
    id: 'relaverse',
    name: 'Relaverse',
    subtitle: '关系宇宙',
    category: '应用',
    description: '让相遇有迹可循。在三维空间中连接重要的人，收藏一起走过的经历，构建属于自己的关系宇宙。',
    tags: ['React', 'Three.js', '本地存储'],
    repository: 'https://github.com/orbitlog/relaverse',
    href: '/relaverse/',
    action: '进入关系宇宙',
  },
  {
    id: 'node-memory',
    name: 'Node Memory',
    subtitle: '让终端记住你的选择',
    category: '开发工具',
    description: '为每个项目记住上一次使用的 Node.js 版本。进入目录，自动切换，让开发环境少一点重复操作。',
    tags: ['Node.js', 'zsh', 'nvm'],
    repository: 'https://github.com/orbitlog/node-memory',
    href: 'https://github.com/orbitlog/node-memory#readme',
    action: '查看使用文档',
  },
  {
    id: 'img2particles',
    name: 'img2particles',
    subtitle: '让像素自由呼吸',
    category: '视觉实验',
    description: '把静止的图片变成流动的粒子。鼠标靠近时散开，离开后回归，在一点点物理交互中赋予图像新的生命。',
    tags: ['TypeScript', 'Canvas', '粒子交互'],
    repository: 'https://github.com/orbitlog/img2particles',
    href: 'https://github.com/orbitlog/img2particles#readme',
    action: '探索组件',
  },
];
