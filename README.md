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
- 兴趣文章 Markdown：`src/content/interests/YYYY-MM-DD-title.md`
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
- 水星文章列表与阅读页：`src/pages/Mercury.tsx`、`src/pages/MercuryArticle.tsx`、`src/pages/Mercury.css`
- UTF-8 字节实验：`src/components/EncodingLab.tsx`
- 太阳站点总览：`src/pages/Sun.tsx`、`src/pages/Sun.css`（最新文章、项目和八个星球入口）
- 页面主题样式：`src/pages/Page.css`
- 行星和太阳贴图：`public/textures/planets/`

## 加载性能

首页的导航和文字先显示，Three.js 场景单独加载；其他模块和文章页按路由加载。星空与各行星使用独立的 Suspense 边界，加载完成的星球即可显示和选择，无需等待整套星空。

星空六面图使用 1024 × 1024、quality 72 的 WebP；行星表面保留 2048 × 1024 分辨率，以 quality 82 转为 WebP，土星环保留 PNG。当前这些贴图合计约 3.04 MB（原 JPEG 约 12.15 MB），新增或替换素材时也应先压缩，并同步修改 TSX/CSS 中的引用。未使用的两份 `star.hdr` 已移除，不随站点发布。

## 纹理来源

太阳、行星和土星环贴图来自 Solar System Scope 的 Solar Textures，按 Creative Commons Attribution 4.0 International license 发布。

- 来源：https://www.solarsystemscope.com/textures/
- 许可：https://creativecommons.org/licenses/by/4.0/

## 新增一篇博客

1. 在 `src/content/blog/` 新建 Markdown 文件，例如 `2026-07-02-my-day.md`。
2. 文件顶部写 front matter：

```md
---
title: 标题
date: 2026-07-02
planet: mercury
category: 随笔
tags: life, note
summary: 一句话摘要
---

正文内容。
```

3. 运行项目，进入水星模块即可看到文章卡片，点击进入 `/module/mercury/文件名（不含 .md）` 阅读全文。支持标题、表格、代码块和文章目录，分类由 `category` 指定（默认“随笔”）。太阳页会自动显示最新文章，`pages:prepare` 会为每篇文章生成可直接访问的静态入口。

编码相关文章可用 `<!-- encoding-lab -->` 在 Markdown 中插入交互式 UTF-8 字节实验。

## 木星兴趣文章与合集

木星 `/module/jupiter` 保留兴趣宇宙的页面风格，在“兴趣轨道”中展示合集与文章。首个合集为「骑马与砍杀2 · 前期开荒指南」，第一篇是属性与专精点讲解，配图从原 ChatGPT 对话下载后保存在 `public/media/interests/bannerlord/attributes/`，来源记录在该目录的 README 中。

- 合集配置、封面和后续选题：`src/content/interests.ts`
- 正文：`src/content/interests/YYYY-MM-DD-title.md`
- Front matter 沿用博客字段，增加 `series: bannerlord-early-game`、`order: 1`
- 文章地址：`/module/jupiter/文件名（不含 .md）`
- 文章阅读页复用水星的目录、阅读进度和 Markdown 排版，采用木星配色；兴趣文章不混入水星归档
- `<!-- bannerlord-growth -->` 插入属性与专精点模拟器，使用参考阈值模型，不宣称实际倍率或本机版本已核实
- 计算模型验证：`node --experimental-strip-types scripts/test-bannerlord.mjs`

新增同合集文章会自动进入木星列表和阅读页的合集导航；`pages:prepare` 会生成相应的静态入口，以便 GitHub Pages 直接访问和刷新。

钢琴合集 `piano-basics` 的首篇是「钢琴初学者指南：从五线谱到第一次练习」。正文在 `src/content/interests/2026-11-26-piano-beginner-guide.md`，十张 SVG 配图在 `public/media/interests/piano/basics/`，覆盖键盘音名、高低音谱号、线与间、中央 C、音符、休止符、符杠、附点、延音线与原创练习谱。乐谱符号使用 Bravura 字体导出为路径，浏览时不需要下载字体；素材目录包含来源、许可和重新生成说明，生成脚本是 `scripts/generate-piano-diagrams.py`。所有时值图均注明“四分音符为一拍”。

第二篇「钢琴入门（二）：基础和弦、转位与移调」在 `src/content/interests/2026-11-26-piano-chords-inversions.md`，七张谱例在 `public/media/interests/piano/chords/`，用 `python3 scripts/generate-piano-chords.py` 重新生成。`<!-- piano-chord-lab -->` 插入和弦练习区：支持 12 个根音、11 种和弦、三和弦/七和弦转位、琴键高亮和用户点击后的短合成音试听。计算与音名拼写在 `src/content/piano-chords.ts`，验证命令为 `node --experimental-strip-types scripts/test-piano-chords.mjs`。第一篇与第二篇由 `series: piano-basics`、`order: 1/2` 自动连接。

## 开发命令

```bash
npm run dev
npm run build
npm run lint
```

## 火星项目画廊

`/module/mars` 是火星荒漠主题的滚动探索页面。向下探索到「作品档案」，可以查看 Relaverse、Node Memory、img2particles 和 PushSheet Studio 的项目卡片。背景视差、段落渐入和作品浮现由 GSAP ScrollTrigger 驱动，可暂停动态并尊重系统减少动态偏好。卡片支持鼠标倾斜、键盘选择和项目介绍，窄屏通过项目列表切换卡片。

- 项目名称、简介、技术标签和访问链接：`src/content/projects.ts`
- 火星场景、滚动叙事、导航和项目介绍：`src/pages/Projects.tsx`
- 卡片结构、项目封面与指针交互：`src/components/ProjectExhibition.tsx`
- 卡片透视、厚度与悬浮效果：`src/components/ProjectExhibition.css`
- 响应式布局与视觉样式：`src/pages/Projects.css`
- 荒漠与遗迹背景：`public/media/projects/mars/`（ImageGen 生成；素材说明与原始提示词见该目录的 `README.md`）
- Relaverse 的在线入口：`/relaverse/`
- PushSheet Studio 的在线入口：`/pushsheet-studio/`
- Node Memory 是命令行工具，img2particles 是组件库，分别链接到对应 GitHub 使用文档；封面是项目主题的艺术化呈现。

### 同域名部署应用

博客的 GitHub Actions 会拉取 `orbitlog/relaverse` 和 `orbitlog/pushsheet-studio` 的 `main` 分支，分别以 `/relaverse/` 和 `/pushsheet-studio/` 为 Vite base 构建。`pages:prepare` 把两份构建产物复制到 `dist/` 下的对应目录，随后与博客一起发布到 `gh-pages`。

`pages:prepare` 也会为现有博客路由生成静态入口，支持直接打开和刷新 `/module/mars/` 等页面。博客仓库的 Pages 发布源沿用 `gh-pages` 分支的根目录。

应用更新后，在博客仓库 Actions 中手动运行 **Deploy to GitHub Pages** 即可同步。推送博客的 `main` 分支也会触发部署。

本地验证完整站点（需要安装三个项目的依赖）：

```bash
# 在 Relaverse 仓库中
npm run build -- --base=/relaverse/

# 在 PushSheet Studio 仓库中
npm run build -- --base=/pushsheet-studio/

# 在 OrbitLog 仓库中，依次传入两个应用的构建产物目录
npm run build
npm run pages:prepare -- /absolute/path/to/relaverse/dist /absolute/path/to/pushsheet-studio/dist
npm run preview
```

`npm run dev` 用于开发博客与画廊。在完整站点的 preview 中可检查 `/relaverse/` 和 `/pushsheet-studio/`。
