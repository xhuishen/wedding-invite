# 移动端婚礼邀请函设计说明

日期：2026-10-12

静态站点，用手机全屏翻页浏览。视觉参照婚礼纪常见的简约模板：米白纸感、浅金细线、大留白图片区。示例文案可整体替换。最后一页是酒店定位，不嵌入地图瓦片。

## 已确认决策

- 视觉：简约婚礼纪风。
- 内容：示例数据，图片槽默认无图。
- 地图：静态示意地图加外链导航，不申请地图 Key。
- 结构：单页全屏翻页器，不使用 Vue Router。
- 十页顺序、每页转场、技术栈见下文。

## 技术栈

- Vue 3、Vite、TypeScript、Tailwind CSS 4（`@tailwindcss/vite`）。
- 单文件组件使用 `<script setup>`。
- 不引入 Vue Router、Element Plus、Headless UI。
- 字体使用系统宋体栈：`"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", serif`。不加载 Google Fonts。

## 视觉

| 用途 | 色值 |
| --- | --- |
| 手机外背景 | `#e7e1d6` |
| 页面纸色 | `#f6f1e8` |
| 正文 | `#2b2724` |
| 辅助文字 | `#7a7168` |
| 金色 | `#a68456` |
| 分割线 | `#d9cbb6` |

手机宽度铺满视口，高度 `100dvh`，禁止页面自身滚动。宽度大于 430px 时，邀请函居中，最大宽度 430px，外侧为更暖的底色。

图片槽是细金线框。无 `src` 或图片加载失败时，框内居中显示「图片展示区」和该槽的说明文字。有 `src` 时图片 `object-fit: cover` 铺满线框。

## 示例内容

新人：新娘林知夏，新郎陈予安。

典礼时间：2026-10-18 11:18，时区 Asia/Shanghai。

场地：上海外滩茂悦大酒店，浦江厅。地址：上海市虹口区黄浦路199号。坐标：纬度 31.245426，经度 121.492944。

着装：浅色礼服即可，请避开全白。

## 十页

页码从 0 到 9。底部圆点始终可见，当前页为金色。

1. **封面** `cover`。姓名「林知夏 & 陈予安」、日期「2026.10.18」、提示「向上滑动，开启邀请函」。一张竖图槽，比例 3:4，说明「封面照片」。
2. **邀请语** `invite`。正文四行：谨订于 / 二〇二六年十月十八日 / 恭备薄酌 / 敬请光临。一张横图槽，比例 4:3，说明「邀请函配图」。
3. **新郎** `groom`。角色「新郎」，姓名陈予安，一句「把日子过成想一起走的路」。一张竖图槽，说明「新郎肖像」。版式：图在左、文字在右。
4. **新娘** `bride`。角色「新娘」，姓名林知夏，一句「遇见你之后，寻常日子也发光」。一张竖图槽，说明「新娘肖像」。版式与新郎页镜像：图在右、文字在左。
5. **我们的故事** `story`。三个节点，每个节点一张方图槽：
   - 2020.05 初见：一场朋友的晚饭。图说明「初见」。
   - 2022.09 确定：在江边说好以后。图说明「确定」。
   - 2026.10 成礼：请你来吃这顿饭。图说明「成礼」。
6. **婚礼流程** `schedule`。四行：10:30 迎宾，11:18 仪式，12:00 午宴，14:00 合影送客。本页无图片槽。
7. **相册** `gallery`。两列三行，共六张竖图槽，说明依次为「照片一」到「照片六」。
8. **婚礼信息** `info`。三行：时间、地点、着装，文案见「示例内容」。本页无图片槽。
9. **倒计时** `countdown`。主数字为距离 2026-10-18 的日历天数（Asia/Shanghai，按日期差，不按小时）。副文「愿你出席，见证这个日子」。若目标日就是今天，数字改为「就是今天」。若目标日已过，数字改为「婚礼已经开始」。本页无图片槽。
10. **地图** `map`。手绘示意地图（SVG，一个定位针，不是瓦片地图）。展示酒店名、厅名、完整地址。两个链接：「高德导航」「系统地图」。

## 动效

进入哪一页，就播放该页的进入转场。两页都绝对定位铺满翻页器，交叉进行，不用 `mode="out-in"`。离开页统一淡出。进入时长 640ms，离开时长 400ms，缓动 `cubic-bezier(0.22, 1, 0.36, 1)`。进入完成后，再播放该页自己的内容入场。翻页锁定 700ms，锁定期间手势、滚轮、键盘和圆点都不改变页码。

| 页 | 进入转场 | 内容入场 |
| --- | --- | --- |
| 封面 | 自 1.04 倍缩放到 1，并淡入 | 姓名、日期依次上浮 |
| 邀请语 | 自下向上 24px 滑入 | 正文逐行淡入 |
| 新郎 | 自左滑入 | 肖像框稍后淡入 |
| 新娘 | 自右滑入 | 肖像框稍后淡入 |
| 故事 | 中心向外展开 | 三个节点依次出现 |
| 流程 | 模糊从 8px 收到 0，并淡入 | 四条流程自上而下排开 |
| 相册 | 自 0.92 倍放大到 1，并淡入 | 六张图依次弹入 |
| 信息 | 自上而下拭开 | 三行信息依次浮出 |
| 倒计时 | 绕 Y 轴轻翻，角度不超过 12 度 | 数字滚入 |
| 地图 | 自底部如抽屉上升 | 地址卡片随后浮出 |

`<Transition>` 的 `name` 等于页 id。进入类是 `{id}-enter-from`、`{id}-enter-active`、`{id}-enter-to`。十页的 `{id}-leave-active` 都是 400ms 淡出，`{id}-leave-to` 为 `opacity: 0`。

`prefers-reduced-motion: reduce` 时：页面切换只有 180ms 透明度变化；内容入场动画关闭，内容直接显示。

## 文件与职责

```
index.html
package.json
vite.config.ts
tsconfig.json
src/main.ts
src/App.vue                      外壳：外侧背景、430px 手机框、挂载翻页器
src/styles/main.css              Tailwind 与颜色、字体
src/styles/motion.css            十种进入转场与内容入场
src/data/invitation.ts           全部示例文案、图片槽、地图链接
src/composables/usePager.ts      页码、方向、锁定、手势与键盘
src/composables/useCountdown.ts  按 Asia/Shanghai 计算天数或两句替代文案
src/components/Pager.vue         Transition、当前页、圆点
src/components/PageDots.vue      十个圆点
src/components/PhotoSlot.vue     线框、占位文案、可选图片
src/components/pages/PageCover.vue
src/components/pages/PageInvite.vue
src/components/pages/PagePerson.vue    新郎与新娘共用，side 为 left 或 right
src/components/pages/PageStory.vue
src/components/pages/PageSchedule.vue
src/components/pages/PageGallery.vue
src/components/pages/PageInfo.vue
src/components/pages/PageCountdown.vue
src/components/pages/PageMap.vue
```

`invitation.ts` 导出一份只读数据。页面组件只接收自己那一页的字段，不互相引用。替换姓名、日期、酒店时只改这一份数据和倒计时的目标时间。

图片放在 `public/photos/`，在数据里写 `src: "/photos/cover.webp"`。未填写 `src` 的槽保持占位。

## 翻页行为

`usePager` 暴露当前页码、方向（`forward` | `back`）、是否锁定，以及 `next`、`prev`、`go(index)`。

- 手指：纵向位移超过 48px，且绝对值大于横向位移。手指上移为下一页，下移为上一页。
- 滚轮：`deltaY` 大于 40 为下一页，小于 -40 为上一页，并进入同一段 700ms 锁定。
- 键盘：`ArrowDown`、`PageDown`、`Space` 为下一页；`ArrowUp`、`PageUp` 为上一页。这些键在翻页器获得焦点或事件发生在页面内时执行 `preventDefault`，避免浏览器跟着滚动。
- 圆点：点击目标页。目标页码更大为 `forward`，更小为 `back`。进入转场仍由目标页决定。
- 第一页不能再上一页，最后一页不能再下一页。页码夹在 0 到 9。

## 地图链接

高德使用经度在前：

`https://uri.amap.com/marker?position=121.492944,31.245426&name=上海外滩茂悦大酒店`

系统地图按设备选择地址。iPhone 或 iPad 使用：

`https://maps.apple.com/?ll=31.245426,121.492944&q=上海外滩茂悦大酒店`

其余设备使用：

`geo:31.245426,121.492944?q=上海外滩茂悦大酒店`

两个链接都是 `<a target="_blank" rel="noopener noreferrer">`。示意地图不请求网络瓦片。

## 边界

- 图片 `error` 时去掉 `src` 的展示，回到「图片展示区」。
- 倒计时的时间字符串无法解析时，不显示数字，改为展示「2026年10月18日 11:18」。
- 动画锁定期间，手势、滚轮、键盘、圆点都不改变页码。
- 布局按 390×844 一屏排定，不出现页内滚动条。缩放比例为 `min(1, 视口高度 / 844)`，最低 0.82。

## 验收

- `npm run build` 成功，产物为可静态部署的 `dist/`。
- 390px 宽度下从封面滑到地图，十页都能到达。
- 十页进入转场彼此不同；打开系统「减少动效」后只剩短淡入淡出。
- 未配置图片时，每个图片槽都显示线框和「图片展示区」。
- 地图页两个链接的地址与上文一致，点击会离开站点去导航。

## 不做

背景音乐、电子请柬表单、宾客留言提交、真实地图瓦片、分享海报、后台管理。
