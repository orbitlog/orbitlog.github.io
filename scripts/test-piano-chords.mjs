import assert from 'node:assert/strict';
import { buildChord, chordRoots, chordQualities, midiFrequency } from '../src/content/piano-chords.ts';

const labels = chord => chord.notes.map(note => `${note.name}${note.octave}`);
assert.deepEqual(labels(buildChord('C', 'major')), ['C4', 'E4', 'G4']);
assert.deepEqual(labels(buildChord('C', 'minor')), ['C4', 'E♭4', 'G4']);
assert.deepEqual(labels(buildChord('C', 'diminished')), ['C4', 'E♭4', 'G♭4']);
assert.deepEqual(labels(buildChord('C', 'major', 1)), ['E4', 'G4', 'C5']);
assert.deepEqual(labels(buildChord('C', 'major', 2)), ['G4', 'C5', 'E5']);
assert.equal(buildChord('C', 'major', 1).symbol, 'C/E');
assert.deepEqual(labels(buildChord('C', 'major7')), ['C4', 'E4', 'G4', 'B4']);
assert.deepEqual(labels(buildChord('C', 'dominant7')), ['C4', 'E4', 'G4', 'B♭4']);
assert.equal(buildChord('C', 'dominant7', 3).notes[0].name, 'B♭');
assert.deepEqual(labels(buildChord('D', 'major')), ['D4', 'F♯4', 'A4']);
assert.deepEqual(labels(buildChord('D♭', 'minor')), ['D♭4', 'F♭4', 'A♭4']);
assert.deepEqual(labels(buildChord('F♯', 'augmented')), ['F♯4', 'A♯4', 'C♯♯5']);
assert.ok(!buildChord('C', 'sus2').notes.some(note => note.name === 'E'));
assert.ok(buildChord('C', 'add9').notes.some(note => note.name === 'E'));
assert.ok(!buildChord('C', 'add9').notes.some(note => note.name.startsWith('B')));
assert.equal(midiFrequency(69), 440);
assert.equal(midiFrequency(81), 880);

const basePitchClass = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
for (const root of chordRoots) {
  for (const quality of chordQualities) {
    const base = buildChord(root.name, quality.id);
    for (let inversion = 0; inversion <= base.maxInversion; inversion++) {
      const current = buildChord(root.name, quality.id, inversion);
      assert.deepEqual(current.notes.map(note => note.midi % 12).sort((a,b) => a-b), base.notes.map(note => note.midi % 12).sort((a,b) => a-b));
      assert.ok(current.notes.every((note, i) => !i || note.midi > current.notes[i-1].midi));
      for (const note of current.notes) {
        const accidental = [...note.name].reduce((sum, symbol) => sum + (symbol === '♯' ? 1 : symbol === '♭' ? -1 : 0), 0);
        assert.equal(12 * (note.octave + 1) + basePitchClass[note.name[0]] + accidental, note.midi);
      }
    }
    assert.deepEqual(base.notes.map(note => note.midi - 60 - root.pc), quality.intervals);
  }
}
assert.throws(() => buildChord('C', 'major', 3), RangeError);
assert.throws(() => buildChord('C', 'sus2', 1), RangeError);
assert.throws(() => buildChord('C', 'minor7', -.5), RangeError);
assert.throws(() => buildChord('invalid', 'major'), RangeError);
console.log('Piano chords: examples, spellings, all 12 roots / 11 qualities / supported inversions, and audio frequencies passed.');
