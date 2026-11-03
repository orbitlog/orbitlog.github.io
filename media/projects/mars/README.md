# 火星场景素材

由内置 ImageGen 生成，参考用户确认的火星荒漠设计稿。图片是艺术化场景，不是 NASA 实拍。

- `landing.jpg`：荒漠首屏，1672 × 941。
- `traces.jpg`：遗迹、发光路径与前景石台，1672 × 941。
- 生产文件只转换为 JPEG 以控制加载体积，没有把文字或项目卡片烘焙进图片。
- 网页中的导航、标题、滚动动画、项目卡片和访问链接均由前端实现。

## 荒漠生成提示词

```text
Use case: photorealistic-natural. Asset type: production website full-bleed landscape background. The supplied tall image is a STYLE AND SCENERY REFERENCE, not the desired output layout. Generate a NEW wide 16:9 landscape, 2560x1440 if possible, matching ONLY the barren Mars terrain in the top third of the reference. Immense photorealistic rusty orange Mars desert, wind-carved red dunes in the foreground and middle distance, rough dark basalt foreground rocks, enormous distant eroded canyon ridges, dusty muted copper sky, soft late-afternoon sidelight, cinematic atmospheric depth, fine natural geological textures, refined realistic photography. Low horizon roughly 40 percent from the top leaves quiet dust-colored sky for a future website heading. The scene is empty, peaceful and vast. Match the reference's burnt sienna and sandstone palette and lighting, no white or cream studio background. Strictly CLEAN BACKGROUND ONLY: absolutely no text, letters, numbers, logos, title, navigation, arrows, UI, screens, cards, buildings, portals, roads, people, spacecraft or objects. Fill the entire wide image with this one continuous desert landscape. No montage, no border, no panels.
```

## 遗迹生成提示词

```text
Use case: photorealistic-natural with subtle architectural compositing. Asset type: production website full-bleed landscape background. The supplied tall image is a STYLE AND SCENERY REFERENCE. Generate a NEW wide 16:9 landscape, 2560x1440 if possible, matching the Martian environment of its middle third. Exactly the same realistic burnt-sienna desert geology, dusty copper sky and warm soft low sidelight as the reference. An immense empty red valley with dunes, dusty rock formations and eroded canyon walls. On the RIGHT, a single monumental minimal rectangular sandstone doorway embedded in a rock outcrop, its interior emits restrained warm amber light. A very fine warm light trace curves from the lower center through the dunes toward the doorway. On the LEFT middle distance a few partly buried geometric stone slabs hint at a lost or emerging civilization, spaced far apart. Leave broad quiet sky and dark-toned landscape at the upper LEFT for later overlay text. The foreground at the bottom has natural rocks and a broad, low, empty weathered sandstone architectural platform, subtle and believable, with nothing on top of it. Premium photographic realism, coherent atmospheric perspective, geological textures, quiet exploration mood. CLEAN ENVIRONMENT IMAGE ONLY: no words, typography, numbers, navigation, UI, project cards, posters, monitors, framed artwork, people, spacecraft or fantasy city. One continuous horizontal landscape, no montage, no border.
```
