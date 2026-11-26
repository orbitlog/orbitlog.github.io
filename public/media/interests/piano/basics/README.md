# 钢琴初学者指南配图

2026-11-26 为 OrbitLog「钢琴入门 · 从识谱到练习」编写的十张 SVG 示意图。全部文件为项目本地资源，没有图片外链或运行时字体依赖。

- keyboard.svg：C4 至 C5 的键盘与唱名，中央 C 标注。
- treble-notes.svg：高音谱表五线 E4 G4 B4 D5 F5；四间 F4 A4 C5 E5。
- bass-notes.svg：低音谱表五线 G2 B2 D3 F3 A3；四间 A2 C3 E3 G3。
- grand-staff.svg：大谱表、高低音谱号、G4/F3 定位音、C4 两种写法。
- note-anatomy.svg：符头、符干、符尾。
- note-values.svg：全、二分、四分、八分、十六分音符及条件拍数。
- rest-values.svg：对应五种休止符。
- rhythm-marks.svg：一条和两条符杠、附点四分音符、同音延音线。
- accidentals.svg：升、降、还原号。
- first-exercise.svg：本站原创两小节 4/4 练习，标注音名和右手指法。

音乐符号从 Steinberg 的 Bravura 字体提取为路径，其他线条、布局、标注及练习谱由本站编写。Bravura 采用 SIL Open Font License 1.1，字体作者为 Steinberg Media Technologies GmbH，许可全文见 Bravura-OFL.txt。字体许可不要求使用它制作的文档采用相同许可。没有分发字体文件，也没有安装系统字体。

字体来源：https://github.com/steinbergmedia/bravura/blob/master/redist/otf/Bravura.otf
许可来源：https://github.com/steinbergmedia/bravura/blob/master/LICENSE.txt

如需重新生成，下载官方 Bravura.otf，使用已安装 fontTools 的 Python 运行：

```sh
python3 scripts/generate-piano-diagrams.py /absolute/path/to/Bravura.otf
```

图中 C4 按科学音高记号表示中央 C；所有拍数按四分音符为一拍。高音谱号锚定第二线 G4，低音谱号锚定第四线 F3。符头位置按每条线间距的一半逐自然音移动。
