export interface PlanetPageTheme {
  eyebrow: string;
  subtitle: string;
  introduction: string;
  observation: string;
  collection: string;
  collectionEnglish: string;
  emptyTitle: string;
  emptyDescription: string;
  footer: string;
}

export const planetPageThemes: Record<string, PlanetPageTheme> = {
  venus: {
    eyebrow: 'A SOFT PLACE FOR INSPIRATION',
    subtitle: '让心动，先于解释。',
    introduction: '影像、色彩、声音与偶然遇见的美。\n让微小的灵感，在金色云层间停留。',
    observation: '云层之上，收藏微光。',
    collection: '灵感收藏',
    collectionEnglish: 'THE INSPIRATION COLLECTION',
    emptyTitle: '等待第一束灵感',
    emptyDescription: '这里还没有收藏。下一次心动，会在这里留下形状。',
    footer: '为喜欢的事物，留一片云。',
  },
  earth: {
    eyebrow: 'SOMEWHERE TO CALL HOME',
    subtitle: '浩瀚之中，有一个我。',
    introduction: '关于我，关于来时的路与此刻的生活。\n回到蓝色星球，慢慢认识彼此。',
    observation: '所有远行，都有来处。',
    collection: '关于我的坐标',
    collectionEnglish: 'A PERSONAL ATLAS',
    emptyTitle: '故事，从这里开始',
    emptyDescription: '个人简介尚未展开。关于我和正在发生的生活，留待慢慢写下。',
    footer: '在自己的轨道上，认真生活。',
  },
  jupiter: {
    eyebrow: 'A UNIVERSE OF CURIOSITY',
    subtitle: '让好奇，拥有足够大的引力。',
    introduction: '那些反复回到身边的热爱与问题。\n像层层云带，各自流动，也彼此环绕。',
    observation: '每一种热爱，都自成轨道。',
    collection: '兴趣轨道',
    collectionEnglish: 'ORBITS OF INTEREST',
    emptyTitle: '好奇，正在聚集',
    emptyDescription: '还没有收录兴趣主题。下一段长久的热爱，会在这里找到轨道。',
    footer: '保持好奇，让热爱不断生长。',
  },
  saturn: {
    eyebrow: 'LITTLE MOMENTS IN ORBIT',
    subtitle: '把日子，收进光环。',
    introduction: '生活的切片，旅途的光，还有平凡的瞬间。\n让时间像胶片，绕着记忆缓缓转动。',
    observation: '时间经过，光影留下。',
    collection: '光影相册',
    collectionEnglish: 'THE EVERYDAY ARCHIVE',
    emptyTitle: '第一帧，还在路上',
    emptyDescription: '相册暂时留白。等一张照片，把某个值得记住的瞬间带回来。',
    footer: '收藏日常，也收藏日常里的光。',
  },
  uranus: {
    eyebrow: 'A QUIET SPACE FOR KNOWLEDGE',
    subtitle: '让零散的理解，慢慢相连。',
    introduction: '沉淀概念，整理线索，连接每一次理解。\n在安静的冰蓝世界，为知识找到位置。',
    observation: '独立思考，彼此连接。',
    collection: '知识索引',
    collectionEnglish: 'THE KNOWLEDGE INDEX',
    emptyTitle: '等待第一个知识坐标',
    emptyDescription: '这里还没有笔记。让下一次理解，成为这张知识地图的起点。',
    footer: '把学过的事，变成自己的理解。',
  },
  neptune: {
    eyebrow: 'TOWARD THE UNWRITTEN',
    subtitle: '远方很远，也有方向。',
    introduction: '尚未抵达的地方，尚未实现的想法。\n在深蓝的边界，给未来留一点可能。',
    observation: '不急着抵达，先记住方向。',
    collection: '远方清单',
    collectionEnglish: 'THE HORIZON AHEAD',
    emptyTitle: '下一站，尚未命名',
    emptyDescription: '还没有写下计划。未来的愿望与目的地，会从这里慢慢启航。',
    footer: '循着自己的方向，慢慢靠近远方。',
  },
};
