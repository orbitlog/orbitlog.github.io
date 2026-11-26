"""Original chord diagrams. Reuses the Bravura paths from the first piano lesson.
Run: python3 scripts/generate-piano-chords.py (Python standard library only).
"""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/media/interests/piano/chords'
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = (ROOT / 'public/media/interests/piano/basics/treble-notes.svg').read_text()
DEFS = re.search(r'<defs>.*?</defs>', SOURCE).group()
INK, MUTED, ACCENT = '#302820', '#685b4e', '#a34d2e'
LETTERS = 'CDEFGAB'


def text(x,y,value,size=23,fill=INK,anchor='start'):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}">{escape(value)}</text>'


def line(x1,y1,x2,y2,color=INK,width=1):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"/>'


def glyph(code,x,y,scale=.056,fill=INK):
    return f'<use href="#g{code:x}" transform="translate({x} {y}) scale({scale} {-scale})" fill="{fill}"/>'


def staff(x,bottom,width=240,gap=14,clef='treble'):
    b=''.join(line(x,bottom-i*gap,x+width,bottom-i*gap,'#ad9e89') for i in range(5))
    return b+glyph(0xE050 if clef=='treble' else 0xE062,x+7,bottom-gap if clef=='treble' else bottom-3*gap,gap/250)


def pitch_step(pitch):
    return int(pitch[-1])*7+LETTERS.index(pitch[0])


def chord(x,bottom,pitches,gap=14,clef='treble'):
    base = 4*7+2 if clef=='treble' else 2*7+4  # E4 or G2
    result=''
    previous=None
    displaced=False
    ledger_lines=set()
    accidental_count=0
    for pitch in pitches:
        step=pitch_step(pitch)-base
        y=bottom-step*gap/2
        displaced=not displaced if previous is not None and step-previous==1 else False
        nx=x+(gap*1.7 if displaced else 0)
        if step < 0:
            for ledger in range(-2,step-1,-2): ledger_lines.add((nx,bottom-ledger*gap/2))
        if step > 8:
            for ledger in range(10,step+1,2): ledger_lines.add((nx,bottom-ledger*gap/2))
        if '♭' in pitch or '♯' in pitch:
            result += glyph(0xE260 if '♭' in pitch else 0xE262,x-33-accidental_count*18,y,gap/250)
            accidental_count+=1
        result+=glyph(0xE0A2,nx-gap*.844,y,gap/250)
        previous=step
    return ''.join(line(nx-gap*1.4,y,nx+gap*1.4,y,INK,1.5) for nx,y in sorted(ledger_lines))+result


def save(name,height,title,body):
    (OUT/name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="560" height="{height}" viewBox="0 0 560 {height}" role="img" aria-labelledby="title"><title id="title">{escape(title)}</title>{DEFS}<rect width="560" height="{height}" rx="8" fill="#fbf5e9"/><g font-family="system-ui,-apple-system,PingFang SC,Microsoft YaHei,sans-serif">{body}</g></svg>')


def grid(name,title,items):
    b=text(28,40,title,27)
    for i,(symbol,label,pitches,formula) in enumerate(items):
        x=22+(i%2)*280
        y=85+(i//2)*245
        b+=text(x,y,symbol,30,ACCENT)+text(x+115,y,label,21)
        b+=staff(x,y+112,236)+chord(x+150,y+112,pitches)
        b+=text(x,y+164,' · '.join(pitches),23)
        b+=text(x,y+199,formula,21,MUTED)
    save(name,565,title,b)


grid('triad-types.svg','四种三和弦：只改三音或五音',[
    ('C','大三',['C4','E4','G4'],'根音起：0 · 4 · 7 半音'),
    ('Cm','小三',['C4','E♭4','G4'],'根音起：0 · 3 · 7 半音'),
    ('Cdim','减三',['C4','E♭4','G♭4'],'根音起：0 · 3 · 6 半音'),
    ('Caug','增三',['C4','E4','G♯4'],'根音起：0 · 4 · 8 半音'),
])

grid('sus-add.svg','替换三音，与保留三音再加音',[
    ('Csus2','挂二',['C4','D4','G4'],'用 D 替换 E'),
    ('Csus4','挂四',['C4','F4','G4'],'用 F 替换 E'),
    ('Cadd9','加九',['C4','E4','G4','D5'],'保留 E，加入 D'),
    ('C6','加六',['C4','E4','G4','A4'],'保留 E，加入 A'),
])

b=text(28,40,'C 和弦转位：根音不变，最低音改变',26)
for i,(symbol,label,pitches) in enumerate([
    ('C','原位',['C4','E4','G4']),('C/E','第一转位',['E4','G4','C5']),('C/G','第二转位',['G4','C5','E5'])
]):
    x=20+i*182
    b+=text(x+80,91,symbol,29,ACCENT,'middle')+text(x+80,125,label,23,anchor='middle')
    b+=staff(x,245,158)+chord(x+108,245,pitches)
    b+=text(x+80,305,' · '.join(pitches),20,anchor='middle')
    b+=text(x+80,345,'低音 '+pitches[0],22,MUTED,'middle')
b+=text(28,404,'C、E、G 始终保留；不是把每个音一起升高。',21,MUTED)
save('inversions.svg',435,'C 大三和弦原位 C4 E4 G4、第一转位 E4 G4 C5、第二转位 G4 C5 E5',b)

b=text(28,40,'大七、属七、小七：看清三音和七音',25)
for i,(symbol,pitches,label) in enumerate([
    ('Cmaj7',['C4','E4','G4','B4'],'大三 ＋ 大七'),
    ('C7',['C4','E4','G4','B♭4'],'大三 ＋ 小七'),
    ('Cm7',['C4','E♭4','G4','B♭4'],'小三 ＋ 小七')
]):
    x=20+i*182
    b+=text(x+80,100,symbol,28,ACCENT,'middle')+staff(x,245,158)+chord(x+108,245,pitches)
    b+=text(x+80,307,' · '.join(p[:-1] for p in pitches),21,anchor='middle')
    b+=text(x+80,350,label,21,MUTED,'middle')
b+=text(28,405,'C7 的 B♭ 与 Cmaj7 的 B，只差一个半音。',22,MUTED)
save('seventh-types.svg',435,'Cmaj7 为 C E G B，C7 为 C E G B降，Cm7 为 C E降 G B降',b)

b=text(28,40,'移调：所有音都上移同样的距离',27)
for x,symbol,pitches in [(22,'C',['C4','E4','G4']),(302,'D',['D4','F♯4','A4'])]:
    b+=text(x+110,98,symbol,32,ACCENT,'middle')+staff(x,220,236)+chord(x+150,220,pitches)
    b+=text(x+110,283,' · '.join(pitches),23,anchor='middle')
b+=text(28,340,'C → D，E → F♯，G → A：每个音升高 2 半音。',21,MUTED)
b+=text(28,380,'大三和弦结构保留，根音从 C 变成 D。',22,MUTED)
save('transposition.svg',410,'C 大三和弦 C4 E4 G4 上移大二度，变为 D4 F升4 A4 的 D 大三和弦',b)

b=text(28,40,'密集与开放排列：先看最低音是谁',26)
for x,label,pitches in [(22,'密集排列',['C4','E4','G4']),(302,'开放排列',['C4','G4','E5'])]:
    b+=text(x+110,100,label,26,ACCENT,'middle')+staff(x,220,236)+chord(x+150,220,pitches)
    b+=text(x+110,283,' · '.join(pitches),23,anchor='middle')
b+=text(28,340,'两边最低音都是 C：都属于 C 大三和弦原位。',21,MUTED)
b+=text(28,380,'把内声部移高八度，不一定会产生转位。',22,MUTED)
save('voicings.svg',410,'C4 E4 G4 密集排列与 C4 G4 E5 开放排列，二者最低音均为根音 C，都是原位',b)

# Four original 4/4 measures. Both staves form one grand staff.
b=text(28,40,'四小节练习：C · F · G · C',28)
b+=staff(72,205,458,18)+staff(72,435,458,18,'bass')
b+=line(65,133,65,435)+ '<path d="M54 133 C30 133 48 262 29 284 C48 306 30 435 54 435" fill="none" stroke="#302820" stroke-width="3"/>'
b+=text(130,164,'4',23)+text(130,192,'4',23)+text(130,394,'4',23)+text(130,422,'4',23)
for i,(name,rh,lh) in enumerate([
    ('C',['E4','G4','C5'],'C3'),('F',['F4','A4','C5'],'F2'),
    ('G',['D4','G4','B4'],'G2'),('C',['E4','G4','C5'],'C3')
]):
    x=165+i*108
    b+=text(x,100,name,27,ACCENT,'middle')+chord(x,205,rh,18)+chord(x,435,[lh],18,'bass')
    b+=text(x,262,' '.join(rh),18,anchor='middle')+text(x,478,lh,23,anchor='middle')
    right=min(x+54,530)
    b+=line(right,133,right,435,INK,1.3)
b+=text(28,530,'上谱右手，下谱左手；每个和弦持续 4 拍。',21,MUTED)
save('first-progression.svg',565,'原创 C F G C 四小节大谱表：右手 E4 G4 C5、F4 A4 C5、D4 G4 B4、E4 G4 C5；左手 C3 F2 G2 C3，每小节四拍',b)
print(f'Generated {len(list(OUT.glob("*.svg")))} chord diagrams in {OUT}')
