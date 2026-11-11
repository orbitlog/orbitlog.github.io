---
title: 从字符到字节：读懂 Unicode 与 UTF-8
date: 2026-11-11
planet: mercury
category: 技术笔记
tags: 字符编码, Unicode, UTF-8, JavaScript
summary: “中”为什么占三个字节？emoji 的 length 为什么是 2？从 ASCII、Unicode 到 UTF-8，一次理清编码、乱码与前端开发中的常见误区。
---

我们每天都在传递字符串，却很少追问：一个“中”字，究竟怎样穿过网络，抵达另一块屏幕？

这篇文章从一个字出发，走完“字符 → 码点 → 字节 → 字符”的旅程。你会看到，很多所谓的乱码问题，其实是读取字节时用错了规则。

## 先分清：字符、码点与编码

**字符**是文本的抽象单位；**码点**是 Unicode 编码空间中的编号，例如“中”的码点是 `U+4E2D`。`U+` 表示后面的数字使用十六进制。

**字符编码**规定如何用码元或字节表示这些编号。Unicode 定义字符与码点等内容；UTF-8、UTF-16、UTF-32 则是 Unicode 的不同编码形式。把 Unicode 简单理解成“每个字符占两个字节”，会从这里开始走偏。

还要注意：屏幕上看起来是“一个字”的内容，可能由多个码点组成。例如 `e` 加组合重音符号也可以显示成 é；一个家庭 emoji 往往包含多个 emoji 和连接符。显示单元、码点与存储单位不是同一件事。参见 [Unicode 的编码形式说明](https://www.unicode.org/faq/utf_bom.html#gen0)。

## 从 ASCII 到 Unicode

ASCII 使用 7 位，定义了 128 个值，包含英文字母、数字、标点和控制字符。日常存储时，一个 ASCII 字符通常占一个 8 位字节。

它不能表示中文。不同地区随后发展出不同的编码体系，例如 GB2312、GBK 和 Big5。**相同的字节在不同编码下，可能被解释成不同的文字。**

Unicode 为跨语言文本提供共同的编号体系。UTF-8 则给出一种可变长度的编码方式，并保留 ASCII 的单字节表示：`A` 在 ASCII 和 UTF-8 中都是十六进制字节 `41`。这一兼容性是 UTF-8 的重要特点。参见 [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629.html#section-1)。

## UTF-8：一个码点怎样拆成字节

UTF-8 用 1 至 4 个字节表示一个 Unicode 标量值。下表的字节均以十六进制表示，`x` 表示用于承载码点信息的二进制位。

| 码点范围 | 字节数 | 字节的二进制形状 | 例子 |
| --- | --- | --- | --- |
| U+0000–U+007F | 1 | `0xxxxxxx` | A → `41` |
| U+0080–U+07FF | 2 | `110xxxxx 10xxxxxx` | é → `C3 A9` |
| U+0800–U+FFFF，排除代理码点 | 3 | `1110xxxx 10xxxxxx 10xxxxxx` | 中 → `E4 B8 AD` |
| U+10000–U+10FFFF | 4 | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` | 🚀 → `F0 9F 9A 80` |

以“中”为例，`U+4E2D` 的二进制是 `0100 1110 0010 1101`。按三字节模板需要的 `4 + 6 + 6` 位分组，再加上前缀：

```text
码点位：  0100       111000       101101
加前缀：  1110 0100  10 111000    10 101101
十六进制：E4         B8           AD
```

所以，“中文在 UTF-8 中都是三个字节”并不准确。许多常用汉字确实占三个字节，但补充平面中的部分汉字需要四个字节。代理码点 `U+D800`–`U+DFFF` 不能直接作为合法的 UTF-8 字符编码，超出 `U+10FFFF` 的值也不合法。编码器还必须使用最短合法序列。规则见 [RFC 3629 的语法](https://www.rfc-editor.org/rfc/rfc3629.html#section-3)。

<!-- encoding-lab -->

## UTF-16、UTF-32 与 GBK 有什么区别

| 编码 | 核心表示方式 | 需要记住的区别 |
| --- | --- | --- |
| UTF-8 | 每个标量值 1–4 字节 | ASCII 占 1 字节；字节序固定 |
| UTF-16 | 每个标量值 1 或 2 个 16 位码元 | 常用 BMP 字符通常 2 字节，补充字符用代理对占 4 字节 |
| UTF-32 | 每个标量值 1 个 32 位码元 | 每个标量值 4 字节，仍不等于一个可见字符 |
| GBK | 传统中文编码，含单字节与双字节表示 | 覆盖范围和映射不同，不能当成 UTF-8 读取 |
| GB18030 | 使用 1、2 或 4 个字节的中文编码 | 覆盖更广的字符范围，但字节规则与 UTF-8 不同 |

UTF-16 和 UTF-32 序列化为字节时，还涉及大端、小端。UTF-8 的编码单元就是一个字节，因此没有 UTF-8LE、UTF-8BE 的字节序区分。关于 UTF 的关系，参见 [Unicode FAQ](https://www.unicode.org/faq/utf_bom.html)；浏览器处理传统编码的行为由 [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) 定义。

## JavaScript 的 length 究竟在数什么

JavaScript 字符串的 `length` 统计 **UTF-16 码元数**，不是 UTF-8 字节数，也不是肉眼看到的字符数。以单个火箭 emoji 为例：

```javascript
const text = 'A中🚀';

text.length;                         // 4 个 UTF-16 码元
[...text].length;                     // 3 个码点
new TextEncoder().encode(text).length; // 8 个 UTF-8 字节：1 + 3 + 4
```

展开运算符可以按码点遍历合法的代理对，但不能完整解决“可见字符”的计数。比如组合重音和由连接符组成的 emoji，可能需要按**字素簇**分段：

```javascript
const segmenter = new Intl.Segmenter('zh', {
  granularity: 'grapheme',
});

const text = 'e\u0301'; // e + 组合重音，看起来像 é
text.length;           // 2
[...text].length;      // 2
[...segmenter.segment(text)].length; // 1 个字素簇
```

做输入字数限制前，先确认产品需要统计字节、码点，还是用户感知的字符。相关 API 可查 [String.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length) 与 [Intl.Segmenter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)。字素分段也不是排版宽度计算。

## 乱码：字节正确，解释规则错了

把 `é` 编码为 UTF-8，会得到 `C3 A9`。如果误用 Windows-1252 解码这两个字节，屏幕上就可能出现 `Ã©`：

```javascript
const bytes = new TextEncoder().encode('é');

new TextDecoder('utf-8').decode(bytes);       // 'é'
new TextDecoder('windows-1252').decode(bytes); // 'Ã©'
```

这时只是解码规则错了；如果原始字节还在，通常可以重新正确解码。但如果错误解码后又保存，尤其出现替代字符 `�` 或问号，原始信息可能已经丢失，不能指望“换个编码”就总能恢复。

`TextDecoder` 默认会把无效序列替换成 `�`。排查问题时，可以开启严格模式，让错误尽早暴露：

```javascript
const decoder = new TextDecoder('utf-8', { fatal: true });
decoder.decode(new Uint8Array([0xFF])); // 抛出 TypeError
```

另一个容易误会的地方：浏览器中的 `TextEncoder` **只编码 UTF-8**；不能通过传入 `'gbk'` 把它变成 GBK 编码器。`TextDecoder` 支持标准规定的多种编码标签。API 行为参见 [Encoding Standard 的 API 章节](https://encoding.spec.whatwg.org/#api)。

## BOM：开头的三个字节是什么

UTF-8 文件有时以 `EF BB BF` 开头，这是 `U+FEFF` 的 UTF-8 编码，用作编码签名。UTF-8 不需要 BOM 来区分字节序，是否带 BOM 应遵循具体格式或接收程序的要求。

不要把它无条件加进所有文件：有些消费端会把它当成额外内容。也不要直接删除文件中任意位置的 `U+FEFF`，应结合它的位置和协议语义处理。可查 [Unicode 对 BOM 的解释](https://www.unicode.org/faq/utf_bom.html#BOM)。

## 遇到乱码，按这条链路排查

1. **确认源文件的真实编码。** 编辑器显示的编码要和保存方式一致；“显示成 UTF-8”和“转换后保存为 UTF-8”可能是两种操作。
2. **检查响应的声明。** HTML 文档尽早声明 `<meta charset="utf-8">`；服务端的 `Content-Type`、文件内容与客户端读取方式应相互一致。不同媒体类型的默认规则并不相同。
3. **在边界看原始字节。** 文件读写、网络请求、数据库导入导出，都可能发生编码转换。不要只看已经解码后的字符串。
4. **避免重复转码。** 先弄清数据当前是字符串还是字节；Base64 是二进制到文本的表示方式，不能代替字符编码，也不是加密。
5. **用混合文本回归。** 同时测试 ASCII、汉字、补充平面字符和组合字符，例如 `A中🚀é`，不要只用英文验证。

编码问题的关键，是在每个读写边界明确规则。Unicode 给文字编号，UTF-8 把编号写成字节，而读取的一端必须用正确规则把字节解释回来。

## 延伸阅读

- [RFC 3629：UTF-8 的正式定义](https://www.rfc-editor.org/rfc/rfc3629.html)
- [Unicode：UTF-8、UTF-16、UTF-32 与 BOM 常见问题](https://www.unicode.org/faq/utf_bom.html)
- [WHATWG：浏览器编码与 TextEncoder / TextDecoder](https://encoding.spec.whatwg.org/)
- [MDN：String.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length)
- [MDN：Intl.Segmenter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
