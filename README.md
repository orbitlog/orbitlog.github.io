# OrbitLog

OrbitLog 是一个太阳系形态的个人博客。首页是 3D 太阳系，点击天体会聚焦到该星球，左侧出现毛玻璃模块面板；点击“进入模块”后会播放降落转场，再进入对应页面。

## 模块规划

| 天体 | 模块 | 路由 | 适合放什么 |
| --- | --- | --- | --- |
| 太阳 | 站点核心 | `/module/sun` | 最新内容、总导航、状态 |
| 水星 | 博客文章 | `/module/mercury` | Markdown 博客、随笔、技术文章 |
| 金星 | 灵感与审美 | `/module/venus` | 设计参考、句子、音乐、影像 |
| 地球 | 个人简介 | `/module/earth` | 关于我、技能、经历、联系方式 |
| 火星 | 项目与实验 | `/module/mars` | 项目、原型、作品、复盘 |
| 木星 | 兴趣宇宙 | `/module/jupiter` | 摄影、电影、游戏、阅读等兴趣 |
| 土星 | 相册与生活 | `/module/saturn` | 生活照片、旅行、猫咪相册 |
| 天王星 | 知识库 | `/module/uranus` | 学习笔记、资料索引、工具清单 |
| 海王星 | 未来计划 | `/module/neptune` | 愿望清单、路线图、长期计划 |

## 内容放哪里

- 今天的博客 Markdown：`src/content/blog/YYYY-MM-DD-title.md`
- 博客文章里的图片：`public/media/blog/YYYY-MM-DD-title/`
- 猫咪照片：`public/media/cats/`
- 个人头像、简介图：`public/media/profile/`
- 项目截图：`public/media/projects/project-name/`
- 兴趣相关图片：`public/media/interests/`
- 旅行照片：`public/media/travel/place-name/`
- 生活碎片：`public/media/life/YYYY/`
- 未来计划图片：`public/media/future/`
- PDF、简历、项目附件：`public/files/`

静态资源在页面里从根路径引用，例如 `/media/cats/napping.jpg`。

## 主要代码位置

- 太阳系场景：`src/pages/System.tsx`
- 相机聚焦和拖拽：`src/components/CameraController.tsx`
- 左侧毛玻璃面板和降落转场：`src/components/PlanetPanel.tsx`
- 星球数据和模块路由：`src/types/planet.ts`
- 模块页面内容、博客读取：`src/content/modules.ts`
- 每个星球的页面模板：`src/pages/PlanetModule.tsx`
- 页面主题样式：`src/pages/Page.css`

## 新增一篇博客

1. 在 `src/content/blog/` 新建 Markdown 文件，例如 `2026-07-02-my-day.md`。
2. 文件顶部写 front matter：

```md
---
title: 标题
date: 2026-07-02
planet: mercury
tags: life, note
summary: 一句话摘要
---

正文内容。
```

3. 运行项目，进入水星模块即可看到文章卡片。

## 开发命令

```bash
npm run dev
npm run build
npm run lint
```
