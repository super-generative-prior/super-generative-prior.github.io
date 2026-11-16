# Super Hyper Master — 项目主页

一个纯静态站点（无构建、无依赖），用一条从左往右的时间线串联六篇工作：
SUPIR · UniCon · HYPIR · HYPI2VR · HYPVR · MASTIR。

```
super-hyper-master/
├── index.html                 首页：时间线 + 论文摘要面板 + Related Work
├── papers/                    主线六个工作，每篇一个完整页面
│   ├── supir.html  unicon.html  hypir.html
│   └── hypi2vr.html  hypvr.html  mastir.html
├── serve.py                   本地预览用的小服务器
└── assets/
    ├── css/style.css          全部样式（所有页面共用）
    ├── js/papers.js           ← 所有文字内容都在这里
    ├── js/site.js             各页共用：页脚 / logo / 工具函数
    ├── js/main.js             首页：时间线 / 悬停气泡 / 摘要面板 / Related Work
    ├── js/paper.js            论文页模板（六个页面共用一份渲染逻辑）
    ├── js/covers.js           自动生成的示意图（卡片配图、论文图示）
    ├── anim/                  五个动画演示（你给的 HTML，已改成可嵌入版本）
    ├── figures/               teaser 图 + Related Work 缩略图
    └── logos/                 机构 logo
```

`papers/*.html` 是六个很薄的壳（只有各自的 `<title>` 和 og 标签），版面和内容全部由
`assets/js/paper.js` + `papers.js` 生成。要加一篇论文：在 `papers.js` 的数组里加一项，
再复制一个壳改 `data-paper` 就行。

## 本地预览

```bash
python3 super-hyper-master/serve.py
```

然后打开 http://localhost:4321 。直接双击 `index.html` 也能看，只是 `file://` 下浏览器
可能拦掉 Google Fonts，字体会退回系统字体。

## 改内容

只需要改 `assets/js/papers.js`，页面会自动跟着变（节点位置、阶段括号、页脚列表都是算出来的，
增删论文不用动别的文件）。每篇论文的字段含义写在文件顶部的注释里。

**待你补充的地方**（都在 `papers.js` 里）：

| 位置 | 需要做的事 |
| --- | --- |
| 4·HYPI2VR | **已中 NeurIPS 2026**，标题、作者、BibTeX 都已填好。只剩 `links` 还是 `'#'`（arXiv / 项目页 / 代码），填了才会变成可点按钮 |
| 5·HYPVR | 论文还没放出去，所以加了 `soon` 块，整页只显示「Not out yet」卡片。**facts / anim / method / highlights 全都原样留在数据里**，放出去那天把 `soon` 整段删掉就立刻全部回来 |
| 6·MASTIR | 走「敬请期待」状态：`soon` 字段渲染成一张卡片，代替方法 / 结果 / 动画版块。有内容了把 `soon` 删掉、按其他篇的格式填 `method` / `facts` / `anim` 即可 |
| 1·SUPIR / 2·UniCon / 3·HYPIR | 标题、会议、作者、链接、正文均按公开信息核对过（含 UniCon 的 −1/3 显存、2.3× 训练加速等具体数字），可直接用 |
| `links` 里 `href: '#'` | 只剩未发表那三篇，填了才会变成可点按钮（否则显示为 soon） |
| `window.RELATED` | 已填入 18 篇真实论文（取自 jasongt.com 与 xpixel.group 的公开列表，范围限定 IR / 人脸 / 可解释性与泛化 / IQA，不含 inpainting、editing）。所有链接都 HTTP 验证过。要增删直接改这个数组，网格会自动重排 |
| `window.LABS` | 页脚 Group 一列（现在是 XPixel Group、INSAIT） |
| `assets/figures/` | 论文 teaser 图（`figure` 字段）和 Related Work 缩略图（`thumb` 字段），例如 `figure: 'assets/figures/supir.jpg'`。Related Work 那 18 张卡片现在都是占位底纹，配了图会好看很多 |
| `assets/logos/` + `window.LOGOS` | 机构 logo（INSAIT 等），`src` 留空时显示同尺寸的虚线文字牌占位 |

## 语言

站点文案统一用英文（`<html lang="en">`）。代码注释和这份 README 保留中文，方便你维护。

未发表的工作在页面上只写 **Coming soon**，不写会议名，也不写 in submission ——
避免在双盲评审期间透露任何投稿信息。改这些的开关在 `main.js` / `paper.js` 的 `STATUS` 映射
和 `papers.js` 里各篇的 `venue`。

## 论文页（主线六个工作）

每篇一页，从数据里有什么就渲染什么，没有的版块直接不出现：

**页头** 阶段标签 / 会议 / 状态 → 缩写名大字 → 论文全名 → 作者 → 链接按钮
**主张** 一句话大字 + 摘要
**At a glance** 关键数字条（`facts`）
**How it works** 嵌入的动画演示 + 页面自己的标题和播放控制
**The method** 「四个关键思想」（`method`），比动画更适合略读
**Contributions** 贡献要点
**Results** 结论 + 证据（`results`）——每条都写明证据来源，UniCon 那页是论文里的实测数字
**Before / after** 拖动对比（`gallery`）——目前只有 SUPIR 有，图片直接引用你们自己的项目页
**Step in the evolution** 这一步在演化线上的位置 + 上一篇 / 下一篇
**Resources** 资源卡片 + BibTeX

`soon` 字段是一个**开关**：有它的时候，整页只渲染页头 + 主张 + 「Not out yet」卡片 +
上下篇导航，facts / 对比图 / 动画 / 方法 / 要点 / 结果 / 资源全部不显示——但数据一个字都不删。
首页面板同步：不列要点，右侧的图也不再写「Animated walkthrough」。
**删掉 `soon` 整段 = 完整页面立刻回来**，不需要改任何别的地方。
`title` 留空则只显示缩写名，不会在页面上露出占位文字。

顶部有一条常驻的六点导航条，对应时间线上的六个工作，当前这篇高亮；已发表是实心点，
未发表是空心点。键盘 `←` `→` 直接翻到相邻论文，`Esc` 回时间线对应位置。

## 内容来源与核实

前三篇的页面内容是这么来的：并行抓了项目页、GitHub README、arXiv 摘要页和论文 HTML 正文，
再逐条核对。**UniCon 那页的实验数字（Canny SSIM 0.4748 → 0.5458、4× 超分 PSNR 34.82 → 37.34、
消融 0.5053 → 0.5458、连接器对比等）我又去 arXiv HTML 正文原文对过一遍**，逐个数字一致。
有两条 agent 给的数字在正文里没找到原文，已经换成能确认的那几个。

`results` 里每条都是「结论 + 证据」两行，证据写清楚出处，避免把论文的主张说成既成事实
（例如 HYPIR 那条写的是「论文报告 HYPIR 优于此前 SOTA」，而不是直接断言）。

站点里**没有**放的东西，都是有意为之：GitHub star 数（会过期）、Replicate 的
「约 4 分钟」（那是含排队的托管服务耗时，不是模型延迟）、以及 www.hypir.org
（HYPIR 的 README 明确说那不是作者运营的站点）。

HYPIR 的 before/after 我没有加：项目页上那些对比图多是电影截帧（Avatar / Matrix / LOTR），
版权上不适合搬到这个站点。换成你们有权使用的素材就可以照 SUPIR 的 `gallery` 格式加上。

## 配图（自动生成的示意图）

手上没有现成的图，所以每张卡片自己画一张。`assets/js/covers.js` 里是四种母题，
每组用一种，同组内按序号变化，所以没有两张长得一样：

- **Generative restoration** —— 左边一片噪声、右边收敛成整齐的条带
- **Restoration models** —— 串起来的模块堆叠，其中一个高亮
- **Interpretability** —— 单元格网格 + 一团归因热区（位置逐篇变化）
- **Agents and IQA** —— 一个决策图接到一根打分刻度上

六篇主线论文另外单独画了示意图（不是生成的），出现在首页详情面板右侧那个框里：
SUPIR 是大先验 + 适配器 + 文本提示，UniCon 是两列之间的单向箭头，HYPIR 是一条直通的
单次前向，HYPI2VR 是三帧共享一条噪声曲线，HYPVR 是一个生成器 + 两条监督分支，
MASTIR 是多种退化汇聚到一个模型。

都是内联 SVG，用卡片自己的 `--c` 配色，不额外请求任何文件。
想换成真图：在 `RELATED` 的条目里填 `thumb`，或在论文里填 `figure`，就会覆盖掉自动生成的。

## 动画演示

`assets/anim/` 里是你给的五个动画，我做了四处改动（都是为了嵌进页面，原文件没动）：

1. `<html data-theme="light">` —— 锁定亮色，否则跟随系统深色模式，跟站点的亮色底冲突
2. 背景透明、去掉外层 padding —— 让它跟页面融为一体
3. **隐藏动画自带的标题栏** —— 否则和页面的版块标题重复。播放/暂停改由页面提供，
   通过 `postMessage` 控制，按钮状态双向同步
4. 单步命令 —— 页面的 ‹ › 按钮和 `←` `→` 通过 postMessage 让动画前后走一步
5. 整体提速约 32% —— 每步停留、元素逐个浮现的错峰、淡入时长、循环间隔都按同一比例缩短，
   所以作者设计的节奏感保留了，只是更紧凑（一轮 ~40s → ~27s）。想再调：
   改 `assets/anim/*.html` 里 STEPS 的 `ms`（每步停留毫秒）
6. 高度自报 + 窄屏自适应 —— iframe 高度由动画自己算好回传（只增不减，避免字幕换行时页面抖动）；
   1000px 以下整张图缩放进视口，而不是强制横向滚动

页面滚出视口时会自动暂停动画，滚回来再继续。

要换动画：替换 `assets/anim/<id>.html`，或改 `papers.js` 里该篇的 `anim.src`。
MASTIR 还没有动画，所以它的页面不显示这个版块。

## 代码审查修掉的问题

新写的论文页代码过了一轮对抗式审查（渲染器 / 路径 / 可访问性 / CSS 四个维度并行找，
每条再让另一个 agent 试图反驳），确认并修掉 18 条，其中几条是真的坏的：

- **顶部导航条根本没 sticky** —— 首页的 `body > *:not(.glow){position:relative}` 优先级
  更高，把 `position:sticky` 压掉了。现在用 `.page-paper .paperbar` 提权。
- **暂停图标画成了「N」** —— 单个 `polygon()` 做不出中间的空隙，改用渐变。
- **资源卡片网格错位** —— 箭头抢占了第一列，把说明挤到第三行。
- **动画的暂停会被滚动撤销** —— 滚出视口再滚回来会强行重播，连开了「减弱动效」的用户
  也会被强行播放一次。现在会跟踪动画自己上报的状态，只恢复「我们暂停的」那一种。
- **方向键会从按钮上被抢走** —— 页面提示「用 ← → 走图」，但焦点在暂停按钮上时按方向键
  会直接跳到下一篇论文。现在焦点在任何控件上时都不接管方向键。
- **页脚 Papers 链接点了像没反应** —— 它确实切换了论文，但面板在三屏之外，视口没动。
- **占位链接（`href="#"`）会关掉已展开的论文** —— 现在渲染成不可点的 `<span>`。
- **对比滑块的焦点框不可见** —— 画在了 `opacity:0` 的元素上。
- **文字灰度不达标** —— `--ink-3` 只有 3.0:1、`--ink-4` 只有 1.87:1。现在三级文字灰
  分别是 7.67 / 5.32 / 4.52，全部过 WCAG AA，装饰性的点和大标题灰字移到了新的 `--dot`。
  HYPER 的橙色（3.56:1）做文字和实心标签也不够，加了 `--accent-ink`（5.35:1），
  橙色本身只留给线条和光晕。

## 设计与交互

- **配色随阶段走**：SUPER 蓝 / HYPER 橙 / MASTER 紫。选中某篇论文后，整页的强调色
  （时间线进度、标签、要点圆点、按钮、背景光晕、大标题里对应的那个词）一起切换。
- **时间线**：横向一条线，六个节点。已发表是实心点，未发表是虚线空心点并标注
  `To appear` / `In submission`。上方的括号标出三个阶段。
- **悬停**：节点下方浮出预览气泡（标题 + 一句话），位置自动贴齐节点并在边缘处收边。
- **点击**：下方展开详情面板；论文之间切换是淡出淡入，要点逐条浮现。
- **键盘**：首页 `←` `→` 切换论文、`Esc` 回总览；**论文页里 `←` `→` 只走动画，不翻页**
  （翻页用顶部的点或底部的上一篇/下一篇），焦点在对比滑块或输入框里时方向键归它们。
- **URL**：每篇论文有自己的 hash（如 `#hypir`），可直接分享定位；浏览器前进/后退可用。
  `#related` 跳到 Related Work 版块（不会收起已展开的论文）。
- **Related Work**：首页底部，分四组，每组一个标题 + 一句说明 + 篇数，组内 3 列卡片
  （配图 + 会议 + 方向标签 + 标题 + 作者）。分组定义在 `papers.js` 的
  `window.RELATED_GROUPS`，每篇用 `group` 字段归属：
  Generative restoration / Restoration models and benchmarks /
  Interpretability and generalisation / Agents and image quality。
  **组内按年份自动从新到旧排**（年份从 `venue` 字符串里取），所以新条目往数组里一丢就行，
  不用管放的位置。主线时间线仍然是年代正序——它是从左到右的演化叙事，
  SUPER→HYPER→MASTER 三个阶段靠的就是这个顺序。
  `href` 还是 `'#'` 的卡片不可点，填了链接才会有悬停效果。
- **页脚**：各页共用，四栏 —— 站点名、Papers（六篇，直达 hash）、Site（Timeline /
  Related Work）、Group（XPixel Group、SIAT、INSAIT）。
- **机构 logo**：两页页头都有一条 logo 带（在细分隔线下方）。所有 logo 统一转成灰度、
  透明度 62%，这样不同配色、不同形状的标志放在一起视觉重量才一致；鼠标悬停时恢复彩色
  并微微上浮。想换到页脚就把 `papers.js` 里的 `window.LOGO_PLACEMENT` 改成 `'footer'`，
  两处都要就写 `'both'`。每个 logo 可以单独调高度（`h` 字段）；文件缺失或路径写错会自动
  退回文字牌，不会破版。
- **窄屏**：时间线保持横向、可左右滑动（右侧有渐隐提示），选中项自动滚入视野；触屏不显示
  悬停气泡，点击直接展开。
- 遵循 `prefers-reduced-motion`，开了减弱动效的用户不会看到动画。

## 部署

纯静态，任何静态托管都行。GitHub Pages：把 `super-hyper-master/` 的内容推到仓库
（或 `docs/` 目录）后在 Settings → Pages 里指过去即可。上线前记得改
`index.html` 里的 `og:*` 标签和 `<title>`，并按需加一张 `og:image`。
