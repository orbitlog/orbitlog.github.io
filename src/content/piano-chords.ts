// Formulas use semitones from the root; degrees preserve theoretical spelling.
export const chordRoots = [
  { name: 'C', pc: 0, letter: 0 }, { name: 'D♭', pc: 1, letter: 1 },
  { name: 'D', pc: 2, letter: 1 }, { name: 'E♭', pc: 3, letter: 2 },
  { name: 'E', pc: 4, letter: 2 }, { name: 'F', pc: 5, letter: 3 },
  { name: 'F♯', pc: 6, letter: 3 }, { name: 'G', pc: 7, letter: 4 },
  { name: 'A♭', pc: 8, letter: 5 }, { name: 'A', pc: 9, letter: 5 },
  { name: 'B♭', pc: 10, letter: 6 }, { name: 'B', pc: 11, letter: 6 },
];

export const chordQualities = [
  { id: 'major', name: '大三和弦', suffix: '', intervals: [0, 4, 7], degrees: [0, 2, 4], formula: '1 · 3 · 5', invertible: true },
  { id: 'minor', name: '小三和弦', suffix: 'm', intervals: [0, 3, 7], degrees: [0, 2, 4], formula: '1 · ♭3 · 5', invertible: true },
  { id: 'diminished', name: '减三和弦', suffix: 'dim', intervals: [0, 3, 6], degrees: [0, 2, 4], formula: '1 · ♭3 · ♭5', invertible: true },
  { id: 'augmented', name: '增三和弦', suffix: 'aug', intervals: [0, 4, 8], degrees: [0, 2, 4], formula: '1 · 3 · ♯5', invertible: true },
  { id: 'sus2', name: '挂二和弦', suffix: 'sus2', intervals: [0, 2, 7], degrees: [0, 1, 4], formula: '1 · 2 · 5', invertible: false },
  { id: 'sus4', name: '挂四和弦', suffix: 'sus4', intervals: [0, 5, 7], degrees: [0, 3, 4], formula: '1 · 4 · 5', invertible: false },
  { id: 'sixth', name: '加六和弦', suffix: '6', intervals: [0, 4, 7, 9], degrees: [0, 2, 4, 5], formula: '1 · 3 · 5 · 6', invertible: false },
  { id: 'add9', name: '加九和弦', suffix: 'add9', intervals: [0, 4, 7, 14], degrees: [0, 2, 4, 8], formula: '1 · 3 · 5 · 9', invertible: false },
  { id: 'major7', name: '大七和弦', suffix: 'maj7', intervals: [0, 4, 7, 11], degrees: [0, 2, 4, 6], formula: '1 · 3 · 5 · 7', invertible: true },
  { id: 'dominant7', name: '属七结构', suffix: '7', intervals: [0, 4, 7, 10], degrees: [0, 2, 4, 6], formula: '1 · 3 · 5 · ♭7', invertible: true },
  { id: 'minor7', name: '小七和弦', suffix: 'm7', intervals: [0, 3, 7, 10], degrees: [0, 2, 4, 6], formula: '1 · ♭3 · 5 · ♭7', invertible: true },
];

const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const naturalPitchClasses = [0, 2, 4, 5, 7, 9, 11];
export const inversionNames = ['原位', '第一转位', '第二转位', '第三转位'];

export function buildChord(rootName: string, qualityId: string, inversion = 0) {
  const root = chordRoots.find(item => item.name === rootName);
  const quality = chordQualities.find(item => item.id === qualityId);
  if (!root || !quality) throw new RangeError('Unknown chord root or quality');
  const maxInversion = quality.invertible ? quality.intervals.length - 1 : 0;
  if (!Number.isInteger(inversion) || inversion < 0 || inversion > maxInversion) throw new RangeError('Invalid inversion');

  const notes = quality.intervals.map((interval, index) => {
    const degree = quality.degrees[index];
    const letterIndex = (root.letter + degree) % 7;
    const octave = 4 + Math.floor((root.letter + degree) / 7);
    const midi = 60 + root.pc + interval;
    const accidental = midi - (12 * (octave + 1) + naturalPitchClasses[letterIndex]);
    const name = letters[letterIndex] + (accidental > 0 ? '♯'.repeat(accidental) : '♭'.repeat(-accidental));
    return { midi, name, octave };
  });
  for (let i = 0; i < inversion; i++) {
    const lowest = notes.shift()!;
    notes.push({ ...lowest, midi: lowest.midi + 12, octave: lowest.octave + 1 });
    notes.sort((a, b) => a.midi - b.midi);
  }
  return {
    root, quality, notes, maxInversion,
    symbol: `${root.name}${quality.suffix}${inversion ? `/${notes[0].name}` : ''}`,
  };
}

export function midiFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}
