# 钢琴第二篇：和弦、转位与移调

2026-11-26 为 OrbitLog 编写的七张本地 SVG。每张标出和弦名与组成音，所有谱例使用中央 C = C4 的音区记法。

| 文件 | 内容 |
| --- | --- |
| triad-types.svg | C、Cm、Cdim、Caug；三音与五音的改变 |
| inversions.svg | C 大三和弦原位、第一转位、第二转位，标注低音 |
| voicings.svg | C4 E4 G4 与 C4 G4 E5：密集/开放排列都可保持原位 |
| seventh-types.svg | Cmaj7、C7、Cm7，比较三音和七音 |
| sus-add.svg | Csus2、Csus4、Cadd9、C6，区分替换与添加 |
| transposition.svg | C4 E4 G4 每音上移两半音成为 D4 F♯4 A4 |
| first-progression.svg | 原创四小节 C F G C；上谱右手和弦、下谱左手单音根音；4/4 拍每小节四拍 |

布局、标注、谱例由本站编写。音乐符号复用第一篇已经导出为路径的 Steinberg Bravura 字体字形，许可见 `../basics/Bravura-OFL.txt`，原始来源见 `../basics/README.md`。图像没有外部字体或网络依赖。

重新生成（Python 标准库，不需要下载字体）：

```sh
python3 scripts/generate-piano-chords.py
```

生成脚本读取 `../basics/treble-notes.svg` 中保留的符号路径。相邻二度的符头采用横向错位，避免 Csus2、Csus4、C6 的相邻音符重叠。升降号用标准字形放在对应音高左侧。
