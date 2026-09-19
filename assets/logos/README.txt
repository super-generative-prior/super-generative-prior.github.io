机构 logo。页面用的就是这三个文件：

  insait.png   400x135   显示高度 29px   （宽标准字，调矮一点视觉才平衡）
  xpixel.png   560x400   显示高度 58px   （整图偏方，要高一点才看得清）
  siat.png     260x260   显示高度 46px   （圆形徽章，按直径给高度）

都是从你 Downloads 里的原图压过来的（XPixel 原图 4000x2860 / 3MB → 560px / 195KB）。
换图就直接覆盖同名文件；尺寸微调改 assets/js/papers.js 里 window.LOGOS 每项的 h。

这三个标志是彩色显示的（静止 92% 不透明度，悬停 100% 并微微上浮）。
之所以没做统一灰度：XPixel 那只凤凰转灰就糊成一团了，改用高度来平衡视觉重量。
想改回灰度版本，改 assets/css/style.css 里 `.logo-link img` 那条即可。

文件缺失或路径写错不会破版，会退回同尺寸的虚线文字牌。
