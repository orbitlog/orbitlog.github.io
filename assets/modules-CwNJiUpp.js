const a=`---
title: 第一条轨道日志
date: 2026-07-02
planet: mercury
tags: orbitlog, blog
summary: 太阳系博客的第一篇示例文章，用来说明以后 Markdown 应该放在哪里。
---

今天先把博客变成一个太阳系。

以后新的博客文章可以继续放在 \`src/content/blog\` 目录里，文件名建议使用 \`YYYY-MM-DD-slug.md\`。页面会自动读取这些 Markdown，并在水星模块里展示。
`,S=`---
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

**字符**是文本的抽象单位；**码点**是 Unicode 编码空间中的编号，例如“中”的码点是 \`U+4E2D\`。\`U+\` 表示后面的数字使用十六进制。

**字符编码**规定如何用码元或字节表示这些编号。Unicode 定义字符与码点等内容；UTF-8、UTF-16、UTF-32 则是 Unicode 的不同编码形式。把 Unicode 简单理解成“每个字符占两个字节”，会从这里开始走偏。

还要注意：屏幕上看起来是“一个字”的内容，可能由多个码点组成。例如 \`e\` 加组合重音符号也可以显示成 é；一个家庭 emoji 往往包含多个 emoji 和连接符。显示单元、码点与存储单位不是同一件事。参见 [Unicode 的编码形式说明](https://www.unicode.org/faq/utf_bom.html#gen0)。

## 从 ASCII 到 Unicode

ASCII 使用 7 位，定义了 128 个值，包含英文字母、数字、标点和控制字符。日常存储时，一个 ASCII 字符通常占一个 8 位字节。

它不能表示中文。不同地区随后发展出不同的编码体系，例如 GB2312、GBK 和 Big5。**相同的字节在不同编码下，可能被解释成不同的文字。**

Unicode 为跨语言文本提供共同的编号体系。UTF-8 则给出一种可变长度的编码方式，并保留 ASCII 的单字节表示：\`A\` 在 ASCII 和 UTF-8 中都是十六进制字节 \`41\`。这一兼容性是 UTF-8 的重要特点。参见 [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629.html#section-1)。

## UTF-8：一个码点怎样拆成字节

UTF-8 用 1 至 4 个字节表示一个 Unicode 标量值。下表的字节均以十六进制表示，\`x\` 表示用于承载码点信息的二进制位。

| 码点范围 | 字节数 | 字节的二进制形状 | 例子 |
| --- | --- | --- | --- |
| U+0000–U+007F | 1 | \`0xxxxxxx\` | A → \`41\` |
| U+0080–U+07FF | 2 | \`110xxxxx 10xxxxxx\` | é → \`C3 A9\` |
| U+0800–U+FFFF，排除代理码点 | 3 | \`1110xxxx 10xxxxxx 10xxxxxx\` | 中 → \`E4 B8 AD\` |
| U+10000–U+10FFFF | 4 | \`11110xxx 10xxxxxx 10xxxxxx 10xxxxxx\` | 🚀 → \`F0 9F 9A 80\` |

以“中”为例，\`U+4E2D\` 的二进制是 \`0100 1110 0010 1101\`。按三字节模板需要的 \`4 + 6 + 6\` 位分组，再加上前缀：

\`\`\`text
码点位：  0100       111000       101101
加前缀：  1110 0100  10 111000    10 101101
十六进制：E4         B8           AD
\`\`\`

所以，“中文在 UTF-8 中都是三个字节”并不准确。许多常用汉字确实占三个字节，但补充平面中的部分汉字需要四个字节。代理码点 \`U+D800\`–\`U+DFFF\` 不能直接作为合法的 UTF-8 字符编码，超出 \`U+10FFFF\` 的值也不合法。编码器还必须使用最短合法序列。规则见 [RFC 3629 的语法](https://www.rfc-editor.org/rfc/rfc3629.html#section-3)。

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

JavaScript 字符串的 \`length\` 统计 **UTF-16 码元数**，不是 UTF-8 字节数，也不是肉眼看到的字符数。以单个火箭 emoji 为例：

\`\`\`javascript
const text = 'A中🚀';

text.length;                         // 4 个 UTF-16 码元
[...text].length;                     // 3 个码点
new TextEncoder().encode(text).length; // 8 个 UTF-8 字节：1 + 3 + 4
\`\`\`

展开运算符可以按码点遍历合法的代理对，但不能完整解决“可见字符”的计数。比如组合重音和由连接符组成的 emoji，可能需要按**字素簇**分段：

\`\`\`javascript
const segmenter = new Intl.Segmenter('zh', {
  granularity: 'grapheme',
});

const text = 'e\\u0301'; // e + 组合重音，看起来像 é
text.length;           // 2
[...text].length;      // 2
[...segmenter.segment(text)].length; // 1 个字素簇
\`\`\`

做输入字数限制前，先确认产品需要统计字节、码点，还是用户感知的字符。相关 API 可查 [String.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length) 与 [Intl.Segmenter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)。字素分段也不是排版宽度计算。

## 乱码：字节正确，解释规则错了

把 \`é\` 编码为 UTF-8，会得到 \`C3 A9\`。如果误用 Windows-1252 解码这两个字节，屏幕上就可能出现 \`Ã©\`：

\`\`\`javascript
const bytes = new TextEncoder().encode('é');

new TextDecoder('utf-8').decode(bytes);       // 'é'
new TextDecoder('windows-1252').decode(bytes); // 'Ã©'
\`\`\`

这时只是解码规则错了；如果原始字节还在，通常可以重新正确解码。但如果错误解码后又保存，尤其出现替代字符 \`�\` 或问号，原始信息可能已经丢失，不能指望“换个编码”就总能恢复。

\`TextDecoder\` 默认会把无效序列替换成 \`�\`。排查问题时，可以开启严格模式，让错误尽早暴露：

\`\`\`javascript
const decoder = new TextDecoder('utf-8', { fatal: true });
decoder.decode(new Uint8Array([0xFF])); // 抛出 TypeError
\`\`\`

另一个容易误会的地方：浏览器中的 \`TextEncoder\` **只编码 UTF-8**；不能通过传入 \`'gbk'\` 把它变成 GBK 编码器。\`TextDecoder\` 支持标准规定的多种编码标签。API 行为参见 [Encoding Standard 的 API 章节](https://encoding.spec.whatwg.org/#api)。

## BOM：开头的三个字节是什么

UTF-8 文件有时以 \`EF BB BF\` 开头，这是 \`U+FEFF\` 的 UTF-8 编码，用作编码签名。UTF-8 不需要 BOM 来区分字节序，是否带 BOM 应遵循具体格式或接收程序的要求。

不要把它无条件加进所有文件：有些消费端会把它当成额外内容。也不要直接删除文件中任意位置的 \`U+FEFF\`，应结合它的位置和协议语义处理。可查 [Unicode 对 BOM 的解释](https://www.unicode.org/faq/utf_bom.html#BOM)。

## 遇到乱码，按这条链路排查

1. **确认源文件的真实编码。** 编辑器显示的编码要和保存方式一致；“显示成 UTF-8”和“转换后保存为 UTF-8”可能是两种操作。
2. **检查响应的声明。** HTML 文档尽早声明 \`<meta charset="utf-8">\`；服务端的 \`Content-Type\`、文件内容与客户端读取方式应相互一致。不同媒体类型的默认规则并不相同。
3. **在边界看原始字节。** 文件读写、网络请求、数据库导入导出，都可能发生编码转换。不要只看已经解码后的字符串。
4. **避免重复转码。** 先弄清数据当前是字符串还是字节；Base64 是二进制到文本的表示方式，不能代替字符编码，也不是加密。
5. **用混合文本回归。** 同时测试 ASCII、汉字、补充平面字符和组合字符，例如 \`A中🚀é\`，不要只用英文验证。

编码问题的关键，是在每个读写边界明确规则。Unicode 给文字编号，UTF-8 把编号写成字节，而读取的一端必须用正确规则把字节解释回来。

## 延伸阅读

- [RFC 3629：UTF-8 的正式定义](https://www.rfc-editor.org/rfc/rfc3629.html)
- [Unicode：UTF-8、UTF-16、UTF-32 与 BOM 常见问题](https://www.unicode.org/faq/utf_bom.html)
- [WHATWG：浏览器编码与 TextEncoder / TextDecoder](https://encoding.spec.whatwg.org/)
- [MDN：String.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/length)
- [MDN：Intl.Segmenter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
`,h=`---
title: 从 AES 到后量子密码：读懂常见加密方式
date: 2026-11-19
planet: mercury
category: 技术笔记
tags: 密码学, 加密, AES, RSA, HTTPS
summary: AES、RSA、椭圆曲线各自解决什么问题？从对称加密、公钥密码到国密与后量子密码，理清哈希、签名、密码存储和 HTTPS，再用 Web Crypto 完成一次 AES-GCM 加解密。
---

上一篇聊字符编码时，我们提到：Base64 不是加密。把文字变成另一串看不懂的字符，并不代表它已经受到保护。

真正的加密，需要让持有正确密钥的人能够还原内容，同时让没有密钥的人难以做到。但一个完整系统还要回答其他问题：内容有没有被改过？对方是谁？第一次通信时，密钥从哪里来？

这篇文章按用途梳理常见密码技术，介绍截至 2026 年 11 月已经常见或完成标准化的代表方案。它们通常相互配合，而不是选一个名字就能解决所有问题。

## 先分清：编码、加密、哈希与签名

| 技术 | 主要解决什么 | 是否能还原原文 | 代表例子 |
| --- | --- | --- | --- |
| 编码 | 让数据适合存储、传输或表示 | 按公开规则解码 | UTF-8、Base64、十六进制 |
| 加密 | 让没有密钥的人难以读取内容 | 用正确密钥解密 | AES-GCM、ChaCha20-Poly1305、RSA-OAEP |
| 哈希 | 把输入映射成固定长度摘要 | 没有解密操作；弱输入仍可能被猜中 | SHA-256、SHA-3、SM3 |
| 消息认证码 | 用共享密钥验证消息完整性和真实性 | 不负责还原或隐藏消息 | HMAC-SHA-256 |
| 数字签名 | 用私钥签名、公钥验证 | 不负责隐藏消息 | RSA-PSS、ECDSA、Ed25519 |

Base64 的规则公开，拿到内容的人都能解码。它可以用来表示密文，但不会给原始数据增加保密性。普通哈希也不能单独证明消息来自谁：如果攻击者能同时替换文件和摘要，校验仍可能通过。Base64 的定义可见 [RFC 4648](https://www.rfc-editor.org/rfc/rfc4648.html)。

签名验证还依赖一个前提：**你拿到的公钥确实属于声称的那个人。** 证书、可信渠道和身份验证机制，就是为这层绑定服务的。

## 对称加密：用同一把密钥保护大量数据

对称加密使用同一个秘密密钥进行加解密。它效率高，适合文件、数据库字段、备份和网络连接中的大量业务数据；难点在于如何安全分发、保存和更新密钥。

**AES** 是常见的分组密码，支持 128、192、256 位密钥。\`AES-256\` 中的 256 指密钥长度；AES 的分组长度始终是 128 位。算法之外，还必须指定工作模式。

| 方案 | 提供的能力 | 使用时要注意 |
| --- | --- | --- |
| AES-GCM | 加密，同时验证密文及附加数据是否被篡改 | 同一密钥下绝不能重复使用 nonce；必须验证认证标签 |
| AES-CCM | 另一种带认证的加密方案 | 遵循协议规定的 nonce、标签和消息长度限制 |
| AES-CBC | 提供保密性，本身不提供消息认证 | 需要正确填充、不可预测的 IV，以及经过审查的认证组合 |
| AES-ECB | 每个分组独立加密，会暴露重复模式 | 不用于需要隐藏数据结构的一般业务内容 |

GCM、CCM 属于 **AEAD，带附加数据的认证加密**。除了隐藏正文，它们还能保护不加密但必须防篡改的元数据，例如协议版本或记录标识；这部分称为 AAD。

AES-GCM 常用 12 字节，也就是 96 位的 nonce / IV。它不需要保密，但在同一密钥下必须唯一。随机生成不等于数学上保证不重复，高调用量系统还要设计使用上限、计数策略和密钥轮换。选型原则见 [OWASP 加密存储指南](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)。

## ChaCha20-Poly1305：另一种常见的认证加密

ChaCha20 是流密码，Poly1305 用于消息认证。二者组合成 AEAD，让接收方既能解密，也能检测篡改。

它在缺少 AES 硬件加速的平台上往往有较好的软件性能，也是 TLS 1.3 支持的算法之一。不能笼统说它一定比 AES 更快，实际结果取决于硬件、实现和负载。

[RFC 8439](https://www.rfc-editor.org/rfc/rfc8439.html) 定义的 ChaCha20-Poly1305 使用 256 位密钥与 96 位 nonce，**同一密钥下同样不能重用 nonce**。只使用裸 ChaCha20 而不做认证，也不能阻止攻击者修改密文。

## 公钥密码：RSA 与椭圆曲线分别做什么

公钥密码使用公钥和私钥。公钥可以公开，私钥需要保密，但不是所有公钥算法都能直接加密数据。

**RSA** 可以构造加密方案和签名方案，二者需要不同的编码与填充：

- **RSA-OAEP**：公钥加密、私钥解密，适合保护短数据，例如随机生成的对称密钥。
- **RSA-PSS**：私钥签名、公钥验证，用于验证消息，不提供保密性。

不要使用没有安全填充的“裸 RSA”，也不要把签名理解为“私钥加密”。RSA-OAEP 还有明文长度限制，不能把大文件直接塞进去。需要兼容 RSA 时，OWASP 的基线是至少 2048 位密钥；具体参数仍应结合保密期限和系统要求确定。方案定义见 [RFC 8017](https://www.rfc-editor.org/rfc/rfc8017.html)。

**ECC，椭圆曲线密码学**，是一类技术。它在可比的经典安全强度下通常能使用比 RSA 更短的密钥，常见用途包括：

| 名称 | 用途 | 容易混淆的地方 |
| --- | --- | --- |
| ECDH / X25519 | 密钥协商，双方得到共享秘密 | 不直接加密业务正文，也不自动认证对方身份 |
| ECDSA | 数字签名 | 不用于加密文件 |
| Ed25519 | EdDSA 家族中的数字签名方案 | 与 X25519 的用途不同，不能互换 |

密钥协商得到的共享秘密通常还需要经过 HKDF 等密钥派生步骤，才能得到用于具体用途的密钥。X25519 和 Ed25519 的定义分别见 [RFC 7748](https://www.rfc-editor.org/rfc/rfc7748.html) 与 [RFC 8032](https://www.rfc-editor.org/rfc/rfc8032.html)。

## 混合加密：公钥技术与对称加密搭配

公钥方案解决初次通信中的密钥建立问题，对称算法负责高效加密正文。这种分工就是混合加密的核心。

以一种采用 RSA-OAEP 的文件加密方案为例：

\`\`\`text
发送方生成随机 AES 密钥
  → 用 AES-GCM 加密文件
  → 用接收方公钥，通过 RSA-OAEP 加密 AES 密钥
  → 发送被加密的密钥、nonce、密文和认证标签

接收方用私钥恢复 AES 密钥
  → 验证认证标签并解密文件
\`\`\`

这段流程描述了保密性，但没有自动证明发送者是谁：任何拿到接收方公钥的人都能加密消息。如果业务需要发送者身份验证，还要采用有认证的协议设计。

另一种标准化方案是 **HPKE**：组合密钥封装、密钥派生与 AEAD。实际开发应使用维护良好的协议实现，明确认证模式和重放处理，而不是自己拼装流程。见 [RFC 9180](https://www.rfc-editor.org/rfc/rfc9180.html)。

## HTTPS：一次连接里用到多种密码技术

HTTPS 是运行在 TLS 安全连接上的 HTTP。以常见的、使用证书和临时 ECDHE 的 TLS 1.3 完整握手为例：

1. 双方协商协议参数，并交换临时密钥份额。
2. 服务端提供证书和签名，客户端验证证书链、域名以及握手签名。
3. 双方从共享秘密和握手上下文派生流量密钥。
4. 后续业务数据通过 AES-GCM 或 ChaCha20-Poly1305 等 AEAD 保护。

TLS 1.3 不使用旧式的 RSA 密钥传输，但仍可使用 RSA 证书配合合适的 RSA 签名。它的密码套件名称也不再同时指定密钥交换和签名算法。细节见 [RFC 8446](https://www.rfc-editor.org/rfc/rfc8446.html)。

TLS 保护的是通信端点之间的传输。数据到达 TLS 终止点后，还需要应用自身的权限控制和存储保护；HTTPS 也不等于只有聊天参与者能解密的端到端加密。

## 国密：SM2、SM3、SM4 的分工

在一些国内系统的接口文档中，经常能看到 SM2、SM3、SM4。它们承担不同角色，不能都当成同一种加密算法：

| 名称 | 类型 | 常见用途 |
| --- | --- | --- |
| SM2 | 椭圆曲线公钥密码算法体系 | 数字签名、公钥加密、密钥交换，需区分具体方案 |
| SM3 | 密码哈希函数 | 计算摘要；本身不隐藏原文，也不直接认证来源 |
| SM4 | 128 位密钥、128 位分组的对称分组密码 | 加密数据，仍需选择合适模式和认证机制 |

[RFC 8998](https://www.rfc-editor.org/rfc/rfc8998.html) 描述了一种 TLS 1.3 的商密组合：使用 SM2 签名、SM3 哈希，以及 SM4-GCM 或 SM4-CCM 认证加密。

对接时不能只确认“支持 SM2”或“使用 SM4”。还要核对签名或加密格式、曲线和用户标识参数、工作模式、IV、标签长度，以及字节如何编码。算法名字一致，不代表两端已经能互通。

## 哈希与密码存储：为什么不能只做 SHA-256

SHA-256、SHA-3 等通用哈希适合计算摘要，但用户密码通常来自很小、很有规律的候选空间。攻击者拿到哈希后，可以不断猜密码并比较结果，这叫离线猜测，不需要“解密哈希”。

保存登录密码应使用专门的密码哈希方案：

- **Argon2id**：新系统的常用优先选择，通过内存和计算成本提高猜测代价。
- **scrypt**：另一种强调内存成本的方案。
- **bcrypt**：常见于既有系统，需要关注工作因子和常见的 72 字节输入限制。
- **PBKDF2**：在部分兼容性或特定标准要求下使用，需要合理设置迭代次数与哈希算法。

每个密码应有独立随机盐，盐可以与哈希结果、算法参数一起存储。盐不是密钥，它主要阻止不同账户共享相同哈希、复用预计算结果。成本参数应在目标设备上评估，并随时间升级。详见 [OWASP 密码存储指南](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)。

MD5、SHA-1 不应用于新的安全敏感摘要或签名设计；即便换成 SHA-256，直接做一次快速哈希也不适合保存登录密码。前端先哈希一次再提交，同样不能替代 HTTPS 和服务端的密码存储方案。

## 后量子密码：改变密钥建立与签名

量子计算的潜在威胁主要影响目前依赖整数分解、离散对数问题的公钥方案，包括 RSA 和常见椭圆曲线方案。对于需要长期保密的数据，还要考虑攻击者先保存密文，未来再尝试解密的风险。

NIST 在 2024 年发布了三项后量子密码标准，它们已经是正式标准，而不只是研究概念：

| 标准 | 算法 | 作用 |
| --- | --- | --- |
| FIPS 203 | ML-KEM | 密钥封装，建立用于后续派生密钥的共享秘密 |
| FIPS 204 | ML-DSA | 数字签名 |
| FIPS 205 | SLH-DSA | 基于哈希的无状态数字签名 |

ML-KEM 不替代 AES 去加密整份文件，ML-DSA 和 SLH-DSA 也不提供正文保密性。后量子系统仍然会使用对称加密、哈希和密钥派生。标准发布信息见 [NIST 公告](https://csrc.nist.gov/News/2024/postquantum-cryptography-fips-approved/)。

实际迁移要盘点证书、协议、依赖库与密钥生命周期，并评估更大的公钥、密文或签名带来的成本。不能仅凭换一个算法名称，就认定整个系统已经具备后量子安全性。

## 动手：用 Web Crypto 完成 AES-GCM 加解密

浏览器在 HTTPS 或 localhost 等安全上下文中提供 \`crypto.subtle\`。下面的例子生成一把不可导出的 AES-256 密钥，加密一条消息，再用相同密钥和 IV 解密：

\`\`\`javascript
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt', 'decrypt'],
);

// 此示例只加密一条消息；同一密钥下不能复用 IV。
const iv = crypto.getRandomValues(new Uint8Array(12));
const plaintext = new TextEncoder().encode('让秘密安全抵达水星。');
const params = { name: 'AES-GCM', iv, tagLength: 128 };

// Web Crypto 的结果包含密文及末尾的认证标签。
const encrypted = await crypto.subtle.encrypt(params, key, plaintext);
const decrypted = await crypto.subtle.decrypt(params, key, encrypted);

console.log(new TextDecoder().decode(decrypted));
// 让秘密安全抵达水星。
\`\`\`

改变密文、IV 或认证标签后，认证通常会失败，\`decrypt()\` 会拒绝解密；认证成功前不能使用任何解密结果。API 定义见 [W3C Web Crypto 的 AES-GCM 章节](https://www.w3.org/TR/webcrypto/#aes-gcm)。

这个例子只演示单条消息的 API 用法。\`key\` 只存在于当前运行环境，刷新后不会自动恢复；不可导出也不代表恶意脚本无法调用它。实际持久化方案还需要设计密钥保存、授权、恢复、轮换与 nonce 管理。

不要把长期秘密直接写进前端源码或打包环境变量里。用户能取得浏览器加载的代码，XSS 等问题也可能让攻击者接触明文或使用密钥。加密要与应用的信任边界一起设计。

## 选型时，从要保护的东西出发

| 实际需求 | 常见方向 |
| --- | --- |
| 浏览器和服务端安全通信 | 使用正确配置的 HTTPS / TLS，由成熟协议栈处理握手 |
| 文件、备份或敏感字段保密 | AES-GCM、ChaCha20-Poly1305 等 AEAD，配合密钥管理 |
| 给持有公钥的接收方发送加密内容 | 标准化混合加密方案，例如适合场景的 HPKE 实现 |
| 验证共享密钥双方的消息 | HMAC 或协议规定的认证机制，同时处理重放 |
| 让其他人能够用公钥验证发布者 | 数字签名，并建立可信的公钥分发机制 |
| 保存用户登录密码 | Argon2id 等密码哈希方案，使用独立盐和合理成本 |
| 只需要二进制转成文本 | Base64，明确它不提供保密性 |

理解加密方式的关键，是弄清每种技术承诺保护什么：对称加密隐藏内容，认证机制检测篡改，公钥技术帮助建立密钥或验证签名，密码哈希提高离线猜测的成本。把这些能力放进正确的协议和密钥生命周期里，秘密才能安全抵达另一端。

## 延伸阅读

- [OWASP：加密存储指南](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP：密码存储指南](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [RFC 8439：ChaCha20 与 Poly1305](https://www.rfc-editor.org/rfc/rfc8439.html)
- [RFC 8017：RSA 加密与签名方案](https://www.rfc-editor.org/rfc/rfc8017.html)
- [RFC 9180：混合公钥加密 HPKE](https://www.rfc-editor.org/rfc/rfc9180.html)
- [RFC 8446：TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)
- [RFC 8998：TLS 1.3 商密算法套件](https://www.rfc-editor.org/rfc/rfc8998.html)
- [NIST：首批三项后量子密码标准](https://csrc.nist.gov/News/2024/postquantum-cryptography-fips-approved/)
- [W3C：Web Crypto API](https://www.w3.org/TR/webcrypto/)
`,d=Object.assign({"./blog/2026-07-02-first-orbit.md":a,"./blog/2026-11-11-unicode-utf8-encoding.md":S,"./blog/2026-11-19-modern-cryptography.md":h});function i(e){const t=e.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);return t?{meta:Object.fromEntries(t[1].split(`
`).map(n=>{const[o,...c]=n.split(":");return[o.trim(),c.join(":").trim()]})),body:t[2].trim()}:{meta:{},body:e}}function p(e){return Object.entries(e).map(([t,r])=>{const{meta:n,body:o}=i(r),c=t.split("/").pop()?.replace(/\.md$/,"")??t;return{slug:c,title:n.title??c,date:n.date??"",summary:n.summary??o.split(`
`)[0]??"",tags:n.tags?n.tags.split(",").map(s=>s.trim()):[],body:o,category:n.category??"随笔",series:n.series,order:n.order?Number(n.order):void 0}}).sort((t,r)=>r.date.localeCompare(t.date))}const g=p(d);export{g as b,p as r};
