export interface PlanetInfo {
  name: string;
  nameCN: string;
  color: string;
  size: number;
  distance: number;
  period: number;
  description: string;
  module?: string;
  route?: string;
}

export const PLANET_DATA: Record<string, PlanetInfo> = {
  mercury: {
    name: 'Mercury',
    chineseName: '水星',
    diameter: '4,879 km',
    mass: '3.30 × 10²³ kg',
    distance: '5,790万 km',
    orbitalPeriod: '88天',
    rotationPeriod: '59天',
    temperature: '-173°C 至 427°C',
    moons: 0,
    description: '太阳系中最小的行星，也是距离太阳最近的行星。表面布满陨石坑，类似月球。',
  },
  venus: {
    name: 'Venus',
    chineseName: '金星',
    diameter: '12,104 km',
    mass: '4.87 × 10²⁴ kg',
    distance: '1.08亿 km',
    orbitalPeriod: '225天',
    rotationPeriod: '243天',
    temperature: '462°C',
    moons: 0,
    description: '太阳系中最热的行星，拥有浓厚的二氧化碳大气层。自转方向与其他行星相反。',
  },
  earth: {
    name: 'Earth',
    chineseName: '地球',
    diameter: '12,742 km',
    mass: '5.97 × 10²⁴ kg',
    distance: '1.50亿 km',
    orbitalPeriod: '365.25天',
    rotationPeriod: '24小时',
    temperature: '-88°C 至 58°C',
    moons: 1,
    description: '我们的家园，太阳系中唯一已知存在生命的行星。拥有液态水和适宜的大气层。',
  },
  mars: {
    name: 'Mars',
    chineseName: '火星',
    diameter: '6,779 km',
    mass: '6.42 × 10²³ kg',
    distance: '2.28亿 km',
    orbitalPeriod: '687天',
    rotationPeriod: '24.6小时',
    temperature: '-87°C 至 -5°C',
    moons: 2,
    description: '红色星球，因表面富含氧化铁而呈现红色。拥有太阳系最大的火山和峡谷。',
  },
  jupiter: {
    name: 'Jupiter',
    chineseName: '木星',
    diameter: '139,820 km',
    mass: '1.90 × 10²⁷ kg',
    distance: '7.78亿 km',
    orbitalPeriod: '11.9年',
    rotationPeriod: '9.9小时',
    temperature: '-108°C',
    moons: 95,
    description: '太阳系中最大的行星，是一颗气态巨行星。拥有著名的大红斑风暴和强大的磁场。',
  },
  saturn: {
    name: 'Saturn',
    chineseName: '土星',
    diameter: '116,460 km',
    mass: '5.68 × 10²⁶ kg',
    distance: '14.3亿 km',
    orbitalPeriod: '29.5年',
    rotationPeriod: '10.7小时',
    temperature: '-139°C',
    moons: 146,
    description: '以其壮观的行星环系统而闻名，环主要由冰粒和岩石碎片组成。',
  },
  uranus: {
    name: 'Uranus',
    chineseName: '天王星',
    diameter: '50,724 km',
    mass: '8.68 × 10²⁵ kg',
    distance: '28.7亿 km',
    orbitalPeriod: '84年',
    rotationPeriod: '17.2小时',
    temperature: '-197°C',
    moons: 27,
    description: '冰巨星，自转轴几乎平躺在轨道平面上。大气层含有甲烷，呈现蓝绿色。',
  },
  neptune: {
    name: 'Neptune',
    chineseName: '海王星',
    diameter: '49,244 km',
    mass: '1.02 × 10²⁶ kg',
    distance: '45.0亿 km',
    orbitalPeriod: '165年',
    rotationPeriod: '16.1小时',
    temperature: '-201°C',
    moons: 14,
    description: '太阳系最外层的行星，拥有太阳系中最强的风暴，风速可达2,100 km/h。',
  },
};
