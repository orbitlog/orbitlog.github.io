import { readPosts } from './modules';

const files = import.meta.glob('./interests/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

export const interestPosts = readPosts(files);

export const interestSeries = [{
  id: 'bannerlord-early-game',
  title: '骑马与砍杀2 · 前期开荒指南',
  description: '从看懂人物面板开始，在卡拉迪亚一点点站稳脚跟。记录加点、武器选择与带兵的摸索。',
  category: '游戏 / 霸主',
  cover: '/media/interests/bannerlord/attributes/character-screen.webp',
  coverAlt: '骑砍2人物面板，标出属性、专精点与技能特长',
  coverWidth: 1585,
  coverHeight: 860,
  planned: ['骑战与长杆武器', '锻造材料与第一笔收入', '招兵、练兵与同伴分工'],
}, {
  id: 'piano-basics',
  title: '钢琴入门 · 从识谱到练习',
  description: '把谱面上的符号，变成手指下的声音。从认清中央 C 开始，慢慢练好每一个音与每一拍。',
  category: '音乐 / 钢琴',
  cover: '/media/interests/piano/basics/keyboard.svg',
  coverAlt: '钢琴键盘 C4 到 C5 的音名和唱名对照，标出中央 C',
  coverWidth: 560,
  coverHeight: 310,
  planned: ['节拍器与双手配合', 'C 大调音阶与指法', '第一首完整小曲'],
}];
