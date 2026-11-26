"""Generate original, font-independent SVG lessons using Bravura music glyphs.
Usage: python3 scripts/generate-piano-diagrams.py /path/to/Bravura.otf
Requires fontTools. Font source and license: public/media/interests/piano/basics/README.md.
"""
from pathlib import Path
from html import escape
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

OUT = Path(__file__).resolve().parents[1] / 'public/media/interests/piano/basics'
FONT = TTFont(sys.argv[1])
GLYPHS = FONT.getGlyphSet()
INK, MUTED, ACCENT, PAPER = '#302820', '#685b4e', '#a34d2e', '#fbf5e9'
CODES = [0xE050, 0xE062, 0xE0A2, 0xE1D2, 0xE1D3, 0xE1D5, 0xE1D7, 0xE1D9,
         0xE4E3, 0xE4E4, 0xE4E5, 0xE4E6, 0xE4E7, 0xE262, 0xE260, 0xE261]
DEFS = []
for code in CODES:
    pen = SVGPathPen(GLYPHS)
    GLYPHS[FONT.getBestCmap()[code]].draw(pen)
    DEFS.append(f'<path id="g{code:x}" d="{pen.getCommands()}"/>')


def text(x, y, value, size=23, fill=INK, anchor='start'):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}">{escape(value)}</text>'


def line(x1, y1, x2, y2, color=INK, width=1.4):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"/>'


def glyph(code, x, y, scale=.072, fill=INK):
    return f'<use href="#g{code:x}" transform="translate({x} {y}) scale({scale} {-scale})" fill="{fill}"/>'


def staff(bottom, clef='treble', start=30, end=530, gap=18):
    parts = [line(start, bottom-i*gap, end, bottom-i*gap, '#a99a86', 1) for i in range(5)]
    parts.append(glyph(0xE050 if clef == 'treble' else 0xE062, start+8,
                       bottom-gap if clef == 'treble' else bottom-3*gap, gap/250))
    return ''.join(parts)


def head(x, y, fill=INK):
    return glyph(0xE0A2, x-15.2, y, fill=fill)


def save(name, height, title, body):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="560" height="{height}" viewBox="0 0 560 {height}" role="img" aria-labelledby="title">'
           f'<title id="title">{escape(title)}</title><defs>{"".join(DEFS)}</defs>'
           f'<rect width="560" height="{height}" rx="8" fill="{PAPER}"/>'
           '<g font-family="system-ui, -apple-system, PingFang SC, Microsoft YaHei, sans-serif">'
           f'{body}</g></svg>')
    (OUT / name).write_text(svg)


# Full octave with octave boundaries. Black-key groups remain visibly 2 + 3.
b = text(28, 40, '先找两枚黑键，再找 C', 28)
white = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
solfege = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si', 'do']
for i, label in enumerate(white):
    x = 28+i*63
    b += f'<rect x="{x}" y="76" width="63" height="170" fill="{"#f3d7b6" if i == 0 else "#fffdf8"}" stroke="{INK}"/>'
    b += text(x+31.5, 208, label, 21, anchor='middle') + text(x+31.5, 234, solfege[i], 19, MUTED, 'middle')
for i in [0, 1, 3, 4, 5]:
    b += f'<rect x="{28+(i+1)*63-19}" y="76" width="38" height="102" rx="2" fill="{INK}"/>'
b += text(28, 282, 'C4 = 中央 C；字母相同，数字不同，音区不同。', 21, MUTED)
save('keyboard.svg', 310, 'C4 到 C5 的键盘音名与唱名，中央 C 位于两枚黑键左侧', b)

# Every ordinary line and space is annotated separately, bottom to top.
for clef, names, spaces in [
    ('treble', ['E4','G4','B4','D5','F5'], ['F4','A4','C5','E5']),
    ('bass', ['G2','B2','D3','F3','A3'], ['A2','C3','E3','G3'])
]:
    cn = '高音谱号' if clef == 'treble' else '低音谱号'
    b = text(28, 40, f'{cn}：五条线与四个间', 28)
    for bottom, labels, is_space, title in [(190,names,False,'五条线 · 从下往上数'), (450,spaces,True,'四个间 · 从下往上数')]:
        b += text(28, bottom-102, title, 23, MUTED) + staff(bottom, clef)
        for i, label in enumerate(labels):
            x = 140+i*(88 if not is_space else 110)
            y = bottom-(i*18+9 if is_space else i*18)
            color = ACCENT if label in ['G4','F3'] else INK
            b += head(x,y,color)
            b += text(x,bottom+46,f'第{i+1}{"间" if is_space else "线"}',21,MUTED,'middle')
            b += text(x,bottom+79,label,27,color,'middle')
    save(f'{clef}-notes.svg', 560, f'{cn}，线与间的所有基础自然音标注', b)

# Two staves, brace, and two different notations of the SAME middle C.
b = text(28, 40, '大谱表：两种谱号，同一个中央 C', 26)
b += staff(190, start=72) + staff(430,'bass',start=72)
b += line(65,118,65,430) + '<path d="M54 118 C25 118 49 252 29 274 C49 296 25 430 54 430" fill="none" stroke="#302820" stroke-width="3"/>'
b += text(112,90,'高音谱号 · 第二线是 G4',23)
b += text(112,318,'低音谱号 · 第四线是 F3',23)
for x,y,label,ledger in [(215,208,'C4',True),(410,172,'G4',False),(215,340,'C4',True),(410,376,'F3',False)]:
    if ledger: b += line(x-24,y,x+24,y,ACCENT,2)
    b += head(x,y,ACCENT) + text(x,245 if y < 250 else 485,label,25,ACCENT,'middle')
b += text(28,530,'C4 在高音谱表下加一线，低音谱表上加一线。',21,MUTED)
b += text(28,565,'上下两个 C4 是同一个琴键，不要同时重复弹奏。',21,MUTED)
save('grand-staff.svg',590,'高低音谱号和中央 C 的两种写法，高音第二线 G4，低音第四线 F3',b)

# Note anatomy uses standard eighth-note glyph, with leaders to its real parts.
b = text(28,40,'一个音符：符头、符干、符尾',28)
b += glyph(0xE1D7,195,250,.17)
b += line(230,250,110,285,ACCENT) + text(30,312,'符头：看音高',22)
b += line(249,161,350,130,ACCENT) + text(340,111,'符干',24)
b += line(280,142,370,215,ACCENT) + text(366,246,'一条符尾',23)
b += text(28,360,'符头在线或间的位置决定音高；形状决定时值。',21,MUTED)
save('note-anatomy.svg',392,'八分音符的符头、符干与一条符尾标注',b)

# Five individual note/rest symbols, with consistent physical beat unit.
labels = ['全音符','二分音符','四分音符','八分音符','十六分音符']
beats = ['4 拍','2 拍','1 拍','1/2 拍','1/4 拍']
notes = [0xE1D2,0xE1D3,0xE1D5,0xE1D7,0xE1D9]
rests = [0xE4E3,0xE4E4,0xE4E5,0xE4E6,0xE4E7]
for kind, codes in [('note',notes),('rest',rests)]:
    b = text(28,40,'音符时值' if kind=='note' else '休止符时值',28)
    b += text(28,76,'以下均以四分音符为一拍',22,MUTED)
    for i, (label,beat,code) in enumerate(zip(labels,beats,codes)):
        x=58+i*110
        if kind=='rest':
            b += ''.join(line(x-29,140+j*14,x+38,140+j*14,'#bcaf9b',1) for j in range(5))
            b += glyph(code,x-10,154 if i==0 else 168,.056)
        else: b += glyph(code,x-12,204,.072)
        b += text(x,249,label if kind=='note' else label.replace('音符',''),20,anchor='middle')
        if kind=='rest': b += text(x,276,'休止符',20,anchor='middle')
        b += text(x,288 if kind=='note' else 316,beat,26,ACCENT,'middle')
    save(f'{kind}-values.svg',320 if kind=='note' else 350,'全、二分、四分、八分、十六分'+('音符' if kind=='note' else '休止符')+'，四分音符为一拍',b)

# Two original, playable 4/4 measures. Both end on a barline.
b = text(28,40,'第一段练习 · 右手五指位置',27)
for bottom, pitches, beats_label in [(190,[0,1,2,3],'每个音 1 拍：C4  D4  E4  F4'),(440,[4,2,0],'1 拍 ＋ 1 拍 ＋ 2 拍')]:
    b += staff(bottom)
    b += text(91,bottom-42,'4',27) + text(91,bottom-15,'4',27)
    xs = [160,260,360,460] if len(pitches)==4 else [170,295,440]
    for i,(x,pitch) in enumerate(zip(xs,pitches)):
        y=bottom+18-pitch*9
        if pitch==0: b += line(x-20,y,x+25,y)
        code=0xE1D3 if len(pitches)==3 and i==2 else 0xE1D5
        b += glyph(code,x,y)
        name=['C4','D4','E4','F4','G4'][pitch]
        b += text(x+10,bottom+66,name,25,anchor='middle')
        b += text(x+10,bottom-90,str(pitch+1),23,ACCENT,'middle')
    b += line(530,bottom-72,530,bottom,INK,2)
    b += text(28,bottom+110,beats_label,23,MUTED)
b += text(28,590,'上方数字是指法；下方字母是音名。',22,MUTED)
save('first-exercise.svg',620,'原创四四拍练习：C4 D4 E4 F4，G4 E4 C4，其中最后的 C4 为二分音符',b)

# Sharp, flat, natural; all signs precede their notehead.
b = text(28,40,'升、降、还原：先看音符左边',27)
for i,(code,label,sub) in enumerate(zip([0xE262,0xE260,0xE261],['升号','降号','还原号'],['升高半音','降低半音','取消升降变化'])):
    x=100+i*180
    b += glyph(code,x-15,140,.09) + text(x,215,label,26,anchor='middle') + text(x,254,sub,21,MUTED,'middle')
save('accidentals.svg',290,'升号升高半音，降号降低半音，还原号取消升降变化',b)

# Beaming and rhythmic modifications shown with standard glyphs and geometry.
b = text(28,40,'符杠、附点与延音线',28)
for row,y in enumerate([146,285]):
    count=2 if row==0 else 4
    xs=[80+i*50 for i in range(count)]
    for x in xs: b += glyph(0xE1D5,x,y)
    # Bravura quarter-note stem is at x ≈ 296/1000 em, top y=875.
    for beam in range(row+1):
        b += line(xs[0]+23.2,y-63+beam*10,xs[-1]+23.2,y-63+beam*10,INK,5)
    b += text(320,y-25,'一条符杠' if row==0 else '两条符杠',24)
    b += text(320,y+14,'每音 1/2 拍' if row==0 else '每音 1/4 拍',22,MUTED)
b += glyph(0xE1D5,82,416) + '<circle cx="123" cy="409" r="4.5" fill="#302820"/>'
b += text(245,390,'附点四分音符',24) + text(245,425,'1 ＋ 1/2 = 1.5 拍',22,MUTED)
b += glyph(0xE1D5,70,548) + glyph(0xE1D5,170,548)
b += '<path d="M88 566 Q134 592 188 566" fill="none" stroke="#302820" stroke-width="2.5"/>'
b += text(275,514,'同音延音线',24) + text(275,550,'1 ＋ 1 = 2 拍',22,MUTED)
b += text(28,627,'延音线连同音，只弹第一次，持续到总时值结束。',21,MUTED)
save('rhythm-marks.svg',655,'八分音符一条符杠、十六分音符两条符杠、附点四分音符和同音延音线',b)

print(f'Generated {len(list(OUT.glob("*.svg")))} piano diagrams in {OUT}')
