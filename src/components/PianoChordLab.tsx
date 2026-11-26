import { useEffect, useRef, useState } from 'react';
import { buildChord, chordQualities, chordRoots, inversionNames, midiFrequency } from '@/content/piano-chords';
import './PianoChordLab.css';

export default function PianoChordLab() {
  const [root, setRoot] = useState('C');
  const [quality, setQuality] = useState('major');
  const [inversion, setInversion] = useState(0);
  const [message, setMessage] = useState('点击试听后才会发声。');
  const audio = useRef<AudioContext | null>(null);
  const voices = useRef<OscillatorNode[]>([]);
  const playing = useRef(false);
  const request = useRef(0);
  const chord = buildChord(root, quality, inversion);
  const firstMidi = Math.floor(chord.notes[0].midi / 12) * 12;
  const lastMidi = Math.ceil((chord.notes.at(-1)!.midi + 1) / 12) * 12 - 1;
  const keys = Array.from({ length: lastMidi - firstMidi + 1 }, (_, index) => firstMidi + index);
  const blackPitchClasses = [1, 3, 6, 8, 10];
  const whiteKeys = keys.filter(midi => !blackPitchClasses.includes(midi % 12));
  const blackKeys = keys.filter(midi => blackPitchClasses.includes(midi % 12));
  const width = whiteKeys.length * 40;
  const keyboardNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const noteLabel = (midi: number) => `${keyboardNames[midi % 12]}${Math.floor(midi / 12) - 1}`;
  const highlighted = (midi: number) => chord.notes.some(note => note.midi === midi);
  const stopVoices = () => {
    request.current++;
    for (const voice of voices.current) { try { voice.stop(); } catch { /* Already ended. */ } }
    voices.current = [];
  };

  useEffect(() => () => {
    request.current++;
    for (const voice of voices.current) { try { voice.stop(); } catch { /* Already ended. */ } }
    const context = audio.current;
    audio.current = null;
    if (context && context.state !== 'closed') void context.close().catch(() => {});
  }, []);

  const play = async (arpeggio: boolean) => {
    if (playing.current) return;
    playing.current = true;
    try {
      stopVoices();
      const currentRequest = request.current;
      if (!audio.current) audio.current = new AudioContext();
      const context = audio.current;
      await context.resume();
      if (context !== audio.current || request.current !== currentRequest) return;
      const now = context.currentTime;
      chord.notes.forEach((note, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = now + (arpeggio ? index * .23 : 0);
        oscillator.type = 'triangle';
        oscillator.frequency.value = midiFrequency(note.midi);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(.12 / chord.notes.length, start + .02);
        gain.gain.exponentialRampToValueAtTime(.0001, start + 1.15);
        oscillator.connect(gain).connect(context.destination);
        oscillator.onended = () => {
          oscillator.disconnect(); gain.disconnect();
          voices.current = voices.current.filter(voice => voice !== oscillator);
        };
        voices.current.push(oscillator);
        oscillator.start(start); oscillator.stop(start + 1.2);
      });
      setMessage(`已播放 ${chord.symbol} 的${arpeggio ? '分解' : '柱式'}合成示范。`);
    } catch {
      setMessage('此浏览器暂时无法播放，请按图在钢琴上试弹。');
    } finally {
      playing.current = false;
    }
  };

  const reset = () => { stopVoices(); setRoot('C'); setQuality('major'); setInversion(0); setMessage('已重置为 C 大三和弦原位。'); };

  return <section className="piano-chord-lab" aria-label="和弦练习区">
    <header><div><p>CHORD EXPLORER</p><h3>把和弦放到琴键上</h3></div><button onClick={reset}>重置</button></header>
    <div className="piano-chord-controls">
      <label>根音<select value={root} onChange={e => { stopVoices(); setRoot(e.target.value); }}>
        {chordRoots.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
      </select></label>
      <label>和弦类型<select value={quality} onChange={e => { stopVoices(); setQuality(e.target.value); setInversion(0); }}>
        {chordQualities.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select></label>
      <label>转位<select value={inversion} disabled={!chord.maxInversion} onChange={e => { stopVoices(); setInversion(Number(e.target.value)); }}>
        {Array.from({ length: chord.maxInversion + 1 }, (_, i) => <option key={i} value={i}>{inversionNames[i]}</option>)}
      </select></label>
    </div>
    <div className="piano-chord-result" aria-live="polite"><strong>{chord.symbol}</strong><p>{inversionNames[inversion]} · 最低音 {chord.notes[0].name}{chord.notes[0].octave}</p><p>由低到高：{chord.notes.map(note => `${note.name}${note.octave}`).join(' · ')}</p><p>相对根音的构成：{chord.quality.formula}</p></div>
    <p className="piano-chord-hint">着色琴键为当前和弦音。窄屏可横向查看；黑键上的名称采用升号，同音异名以“由低到高”的和弦拼写为准。</p>
    <div className="piano-chord-keyboard" tabIndex={0} role="region" aria-label="和弦键盘，可横向滚动">
      <svg width={width} height="154" viewBox={`0 0 ${width} 154`} role="img" aria-label={`${chord.symbol}，${chord.notes.map(note => `${note.name}${note.octave}`).join('、')}`}>
        {whiteKeys.map((midi, index) => <g key={midi}><rect x={index * 40 + 1} y="1" width="38" height="148" rx="2" fill={highlighted(midi) ? '#e3b28d' : '#fbf5e9'} stroke="#302820" /><text x={index * 40 + 20} y="132" fill="#302820" textAnchor="middle" fontSize="13">{noteLabel(midi)}</text>{highlighted(midi) && <circle cx={index * 40 + 20} cy="108" r="4" fill="#783e26" />}</g>)}
        {blackKeys.map(midi => {
          const x = whiteKeys.filter(key => key < midi).length * 40 - 13;
          return <g key={midi}><rect x={x} y="1" width="26" height="88" rx="2" fill={highlighted(midi) ? '#b86b42' : '#302820'} stroke="#302820" /><text x={x + 13} y="71" textAnchor="middle" fill="#fff8ed" fontSize="12">{keyboardNames[midi % 12]}</text>{highlighted(midi) && <circle cx={x + 13} cy="45" r="4" fill="#fff8ed" />}</g>;
        })}
      </svg>
    </div>
    {!chord.quality.invertible && <p className="piano-chord-hint">挂留、加六与加九先展示根音在低部的示例，本练习区暂不扩展它们的转位命名。</p>}
    <div className="piano-chord-actions"><button onClick={() => void play(false)}>试听柱式和弦</button><button onClick={() => void play(true)}>试听分解和弦</button></div>
    <p className="piano-chord-hint" role="status">{message} 使用短促合成音，不模拟真实钢琴音色。</p>
  </section>;
}
