import assert from 'node:assert/strict';
import { skillGrowth } from '../src/content/bannerlord-growth.ts';

assert.deepEqual(skillGrowth(5, 5, 150), { softLimit: 190, zeroThreshold: 260, phase: '正常学习区间' });
assert.equal(skillGrowth(5, 5, 190).phase, '正常学习区间');
assert.equal(skillGrowth(5, 5, 191).phase, '学习效率衰减');
assert.equal(skillGrowth(5, 5, 259).phase, '学习效率衰减');
assert.equal(skillGrowth(5, 5, 260).phase, '停止普通学习');
assert.equal(skillGrowth(5, 5, 261).phase, '停止普通学习');
assert.deepEqual(skillGrowth(1, 0, 0), { softLimit: 0, zeroThreshold: 4, phase: '正常学习区间' });
assert.equal(skillGrowth(10, 5, 330).zeroThreshold, 330);
assert.equal(skillGrowth(10, 5, 330).phase, '停止普通学习');
assert.equal(skillGrowth(7, 5, 275).phase, '学习效率衰减');
assert.equal(skillGrowth(6, 5, 275).phase, '停止普通学习');
for (let a = 1; a <= 10; a++) {
  for (let f = 0; f <= 5; f++) {
    const result = skillGrowth(a, f, 0);
    assert.ok(result.softLimit < result.zeroThreshold);
    if (a < 10) assert.equal(skillGrowth(a + 1, f, 0).zeroThreshold - result.zeroThreshold, 14);
    if (f < 5) assert.equal(skillGrowth(a, f + 1, 0).zeroThreshold - result.zeroThreshold, 40);
  }
}
console.log('Bannerlord reference model: examples, phase boundaries, and all 60 allocations passed.');
