// Reference model from the source conversation, cross-checked against:
// https://github.com/JohnnyBraver/Bannerlord-Perk-Analyzer/blob/main/Docs/reports/perk-limits.md
// No claim about the learning multiplier or a locally verified game version.
export function skillGrowth(attribute: number, focus: number, skill: number) {
  const softLimit = 10 * (attribute - 1) + 30 * focus;
  const zeroThreshold = 14 * (attribute - 1) + 40 * focus + 4;
  const phase = skill >= zeroThreshold ? '停止普通学习' : skill > softLimit ? '学习效率衰减' : '正常学习区间';
  return { softLimit, zeroThreshold, phase };
}
