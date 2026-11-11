import { useState } from 'react';

const encoder = new TextEncoder();

export default function EncodingLab() {
  const [text, setText] = useState('A中🚀');
  const characters = Array.from(text);
  const bytes = encoder.encode(text);
  return (
    <section className="encoding-lab" aria-labelledby="encoding-lab-title">
      <div className="encoding-lab-heading"><span>BYTE LAB / 交互实验</span><span>UTF-8</span></div>
      <h3 id="encoding-lab-title">亲手拆开一段文字</h3>
      <p>改改下面的文字，看看码点如何变成字节。</p>
      <label htmlFor="encoding-input">输入文字 <span>最多 32 个 UTF-16 码元</span></label>
      <input id="encoding-input" value={text} maxLength={32} onChange={(event) => setText(event.target.value)} autoComplete="off" spellCheck={false} />
      <div className="encoding-presets" aria-label="编码示例">{['A中🚀', 'é', 'e\u0301', '你好'].map((example) => <button key={example} onClick={() => setText(example)} aria-label={`查看 ${example} 的编码`}>{example === 'e\u0301' ? 'e + 重音' : example}</button>)}</div>
      <div className="encoding-characters" aria-live="polite" aria-atomic="true">
        {characters.length ? characters.map((character, index) => <div className="encoding-character" key={`${index}-${character}`}>
          <span className="encoding-glyph">{character === ' ' ? '␠' : character}</span>
          <span className="encoding-codepoint">U+{character.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}</span>
          <span className="encoding-byte-group">{Array.from(encoder.encode(character)).map((byte, byteIndex) => <code key={byteIndex}>{byte.toString(16).toUpperCase().padStart(2, '0')}</code>)}</span>
        </div>) : <p className="encoding-empty">输入一个字符，观察它的字节。</p>}
      </div>
      <div className="encoding-totals"><span><strong>{text.length}</strong> UTF-16 码元</span><span><strong>{characters.length}</strong> 码点</span><span><strong>{bytes.length}</strong> UTF-8 字节</span></div>
      <p className="encoding-lab-note">字节以十六进制显示；码点数不等于可见字符数。孤立代理码元会由 TextEncoder 替换为 U+FFFD 后编码。</p>
    </section>
  );
}
