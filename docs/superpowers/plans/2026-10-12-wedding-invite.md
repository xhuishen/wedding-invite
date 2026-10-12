# 婚礼邀请函 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 做一个手机全屏翻页的静态婚礼邀请函，十页各有不同转场，图片区可替换，最后一页打开导航。

**Architecture:** Vue 3 单页应用，不用路由。`invitation.ts` 保存全部文案与链接，`propsFor` 把当前页字段交给页面组件。`usePager` 管页码、方向和 700ms 锁定。`Pager` 用 `<Transition>` 按页 id 播转场，进入结束后才给内容加 `is-in`。

**Tech Stack:** Vue 3、Vite 6、TypeScript、Tailwind CSS 4（`@tailwindcss/vite`）、Vitest、`@vue/test-utils`、jsdom。

**Spec:** `docs/superpowers/specs/2026-10-12-wedding-invite-design.md`

## Global Constraints

- Vue 3、Vite、TypeScript、Tailwind CSS 4（`@tailwindcss/vite`）。单文件组件使用 `<script setup>`。
- 不引入 Vue Router、Element Plus、Headless UI，不加载 Google Fonts。
- 字体：`"Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", serif`。
- 色值：手机外背景 `#e7e1d6`，页面纸色 `#f6f1e8`，正文 `#2b2724`，辅助文字 `#7a7168`，金色 `#a68456`，分割线 `#d9cbb6`。
- 手机铺满视口，高度 `100dvh`。宽度大于 430px 时居中，最大宽度 430px。
- 图片槽无 `src` 或加载失败时，居中显示「图片展示区」和该槽说明。有图时 `object-fit: cover`。
- 新人：新娘林知夏，新郎陈予安。日期标签 `2026.10.18`。典礼 `2026-10-18T11:18:00+08:00`（Asia/Shanghai）。展示文案 `2026年10月18日 11:18`。
- 场地：上海外滩茂悦大酒店，浦江厅，上海市虹口区黄浦路199号。纬度 31.245426，经度 121.492944。
- 着装：浅色礼服即可，请避开全白。倒计时副文：愿你出席，见证这个日子。
- 页 id 顺序：`cover` `invite` `groom` `bride` `story` `schedule` `gallery` `info` `countdown` `map`。转场 `name` 等于页 id。
- 进入 640ms，离开 400ms，缓动 `cubic-bezier(0.22, 1, 0.36, 1)`。两页绝对定位交叉，不用 `mode="out-in"`。锁定 700ms，期间手势、滚轮、键盘、圆点都不改页码。
- 手指纵向位移超过 48px 且绝对值大于横向位移：上移下一页，下移上一页。滚轮 `deltaY > 40` 下一页，`deltaY < -40` 上一页。
- 键盘 `ArrowDown`、`PageDown`、`Space`（`event.key === ' '`）下一页；`ArrowUp`、`PageUp` 上一页，并 `preventDefault`。
- 高德：`https://uri.amap.com/marker?position=121.492944,31.245426&name=上海外滩茂悦大酒店`
- 苹果地图：`https://maps.apple.com/?ll=31.245426,121.492944&q=上海外滩茂悦大酒店`
- 其余设备：`geo:31.245426,121.492944?q=上海外滩茂悦大酒店`
- 缩放比例 `min(1, 视口高度 / 844)`，最低 0.82。布局按 390×844 一屏，无页内滚动。
- `prefers-reduced-motion: reduce` 时页面只做 180ms 淡入淡出，内容入场动画关闭。
- 不做背景音乐、电子请柬表单、宾客留言、地图瓦片、分享海报、后台。
- 提交信息使用 `<type>: <中文简述>`，`type` 只用 `feat`、`fix`、`refactor`、`docs`、`chore`、`test`。不推送远程。

## 文件职责

- `src/data/invitation.ts`：示例文案、图片槽、地图链接、`pageOrder`、`propsFor`、`systemMapUrl`。
- `src/composables/useCountdown.ts`：`getCountdown`。
- `src/composables/usePager.ts`：页码、方向、锁定、手势。
- `src/utils/frameScale.ts`：`frameScale`。
- `src/components/PhotoSlot.vue`：图片框。
- `src/components/PageDots.vue`：十个圆点。
- `src/components/Pager.vue`：转场与当前页。
- `src/components/pages/registry.ts`：页 id 到组件。
- `src/components/pages/Page*.vue`：单页展示。
- `src/styles/main.css`：Tailwind、字体、页面底色。
- `src/styles/motion.css`：十种转场与内容入场。
- `src/App.vue`：430px 外壳、缩放、把事件交给 `usePager`。

---

### Task 1: 工程与示例数据

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/vite-env.d.ts`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/styles/main.css`
- Create: `src/data/invitation.ts`
- Test: `src/data/invitation.spec.ts`

**Interfaces:**
- Consumes: 无。
- Produces:
  - `pageOrder`：只读元组，十个页 id，顺序见 Global Constraints。
  - `PageId`：`pageOrder` 的成员。
  - `PhotoSlotData`：`{ id: string; label: string; ratio: 'portrait' | 'landscape' | 'square'; src?: string }`
  - `invitation`：字段见本任务实现。
  - `propsFor(id: PageId): Record<string, unknown>`
  - `systemMapUrl(userAgent: string): string`

- [ ] **Step 1: 写入工程文件**

`package.json`

```json
{
  "name": "wedding-invite",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "test": "vitest run",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "@vitejs/plugin-vue": "^5.2.0",
    "@vue/test-utils": "^2.4.6",
    "jsdom": "^26.0.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.7.0",
    "vite": "^6.2.0",
    "vitest": "^3.0.0",
    "vue-tsc": "^2.2.0"
  }
}
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "src/**/*.d.ts"]
}
```

`vite.config.ts`

```ts
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
  },
})
```

`index.html`

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>林知夏 & 陈予安</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`.gitignore`

```gitignore
node_modules
dist
.DS_Store
```

`src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
```

`src/styles/main.css`

```css
@import "tailwindcss";
```

`src/App.vue`

```vue
<template>
  <div>请柬</div>
</template>
```

`src/main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'

createApp(App).mount('#app')
```

然后安装依赖：

```bash
npm install
```

- [ ] **Step 2: 写会失败的数据测试**

`src/data/invitation.spec.ts`

```ts
import { describe, expect, it } from 'vitest'
import { invitation, pageOrder, propsFor, systemMapUrl } from './invitation'

describe('invitation data', () => {
  it('keeps ten page ids in order', () => {
    expect(pageOrder).toEqual([
      'cover',
      'invite',
      'groom',
      'bride',
      'story',
      'schedule',
      'gallery',
      'info',
      'countdown',
      'map',
    ])
  })

  it('uses the demo couple, venue, and map links', () => {
    expect(invitation.brideName).toBe('林知夏')
    expect(invitation.groomName).toBe('陈予安')
    expect(invitation.dateLabel).toBe('2026.10.18')
    expect(invitation.ceremonyIso).toBe('2026-10-18T11:18:00+08:00')
    expect(invitation.ceremonyDisplay).toBe('2026年10月18日 11:18')
    expect(invitation.venueName).toBe('上海外滩茂悦大酒店')
    expect(invitation.hallName).toBe('浦江厅')
    expect(invitation.address).toBe('上海市虹口区黄浦路199号')
    expect(invitation.latitude).toBe(31.245426)
    expect(invitation.longitude).toBe(121.492944)
    expect(invitation.amapUrl).toBe(
      'https://uri.amap.com/marker?position=121.492944,31.245426&name=上海外滩茂悦大酒店',
    )
    expect(invitation.appleMapUrl).toBe(
      'https://maps.apple.com/?ll=31.245426,121.492944&q=上海外滩茂悦大酒店',
    )
    expect(invitation.geoUrl).toBe('geo:31.245426,121.492944?q=上海外滩茂悦大酒店')
    expect(invitation.coverPhoto.src).toBeUndefined()
  })

  it('builds props for every page', () => {
    expect(propsFor('cover')).toMatchObject({
      brideName: '林知夏',
      groomName: '陈予安',
      dateLabel: '2026.10.18',
      photo: { id: 'cover', label: '封面照片', ratio: 'portrait' },
    })
    expect(propsFor('invite')).toMatchObject({
      lines: ['谨订于', '二〇二六年十月十八日', '恭备薄酌', '敬请光临'],
      photo: { id: 'invite', label: '邀请函配图', ratio: 'landscape' },
    })
    expect(propsFor('groom')).toMatchObject({
      role: '新郎',
      name: '陈予安',
      line: '把日子过成想一起走的路',
      side: 'left',
      photo: { label: '新郎肖像', ratio: 'portrait' },
    })
    expect(propsFor('bride')).toMatchObject({
      role: '新娘',
      name: '林知夏',
      line: '遇见你之后，寻常日子也发光',
      side: 'right',
      photo: { label: '新娘肖像', ratio: 'portrait' },
    })
    const story = propsFor('story') as { beats: { date: string; title: string; photo: { ratio: string; label: string } }[] }
    expect(story.beats.map((beat) => beat.date)).toEqual(['2020.05', '2022.09', '2026.10'])
    expect(story.beats.map((beat) => beat.title)).toEqual(['初见', '确定', '成礼'])
    expect(story.beats.every((beat) => beat.photo.ratio === 'square')).toBe(true)
    const schedule = propsFor('schedule') as { items: { time: string; title: string }[] }
    expect(schedule.items).toEqual([
      { time: '10:30', title: '迎宾' },
      { time: '11:18', title: '仪式' },
      { time: '12:00', title: '午宴' },
      { time: '14:00', title: '合影送客' },
    ])
    const gallery = propsFor('gallery') as { photos: { label: string; ratio: string }[] }
    expect(gallery.photos).toHaveLength(6)
    expect(gallery.photos[0]?.label).toBe('照片一')
    expect(gallery.photos[5]?.label).toBe('照片六')
    expect(gallery.photos.every((photo) => photo.ratio === 'portrait')).toBe(true)
    expect(propsFor('info')).toMatchObject({
      dressCode: '浅色礼服即可，请避开全白',
      address: '上海市虹口区黄浦路199号',
    })
    expect(propsFor('countdown')).toMatchObject({
      ceremonyIso: '2026-10-18T11:18:00+08:00',
      note: '愿你出席，见证这个日子',
      invalidLabel: '2026年10月18日 11:18',
    })
    expect(propsFor('map')).toMatchObject({
      venueName: '上海外滩茂悦大酒店',
      hallName: '浦江厅',
      amapUrl: invitation.amapUrl,
      appleMapUrl: invitation.appleMapUrl,
      geoUrl: invitation.geoUrl,
    })
  })

  it('picks apple maps only for iPhone and iPad', () => {
    expect(systemMapUrl('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe(invitation.appleMapUrl)
    expect(systemMapUrl('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)')).toBe(invitation.appleMapUrl)
    expect(systemMapUrl('Mozilla/5.0 (Linux; Android 14)')).toBe(invitation.geoUrl)
  })
})
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `npm test -- src/data/invitation.spec.ts`

Expected: FAIL，无法解析 `./invitation`。

- [ ] **Step 4: 写入数据模块**

`src/data/invitation.ts`

```ts
export const pageOrder = [
  'cover',
  'invite',
  'groom',
  'bride',
  'story',
  'schedule',
  'gallery',
  'info',
  'countdown',
  'map',
] as const

export type PageId = (typeof pageOrder)[number]
export type PhotoRatio = 'portrait' | 'landscape' | 'square'

export interface PhotoSlotData {
  id: string
  label: string
  ratio: PhotoRatio
  src?: string
}

export interface StoryBeat {
  date: string
  title: string
  text: string
  photo: PhotoSlotData
}

export interface ScheduleItem {
  time: string
  title: string
}

export interface Invitation {
  brideName: string
  groomName: string
  dateLabel: string
  ceremonyIso: string
  ceremonyDisplay: string
  venueName: string
  hallName: string
  address: string
  latitude: number
  longitude: number
  dressCode: string
  countdownNote: string
  amapUrl: string
  appleMapUrl: string
  geoUrl: string
  coverPhoto: PhotoSlotData
  inviteLines: string[]
  invitePhoto: PhotoSlotData
  groom: { role: string; name: string; line: string; photo: PhotoSlotData; side: 'left' }
  bride: { role: string; name: string; line: string; photo: PhotoSlotData; side: 'right' }
  story: StoryBeat[]
  schedule: ScheduleItem[]
  gallery: PhotoSlotData[]
}

export const invitation: Invitation = {
  brideName: '林知夏',
  groomName: '陈予安',
  dateLabel: '2026.10.18',
  ceremonyIso: '2026-10-18T11:18:00+08:00',
  ceremonyDisplay: '2026年10月18日 11:18',
  venueName: '上海外滩茂悦大酒店',
  hallName: '浦江厅',
  address: '上海市虹口区黄浦路199号',
  latitude: 31.245426,
  longitude: 121.492944,
  dressCode: '浅色礼服即可，请避开全白',
  countdownNote: '愿你出席，见证这个日子',
  amapUrl: 'https://uri.amap.com/marker?position=121.492944,31.245426&name=上海外滩茂悦大酒店',
  appleMapUrl: 'https://maps.apple.com/?ll=31.245426,121.492944&q=上海外滩茂悦大酒店',
  geoUrl: 'geo:31.245426,121.492944?q=上海外滩茂悦大酒店',
  coverPhoto: { id: 'cover', label: '封面照片', ratio: 'portrait' },
  inviteLines: ['谨订于', '二〇二六年十月十八日', '恭备薄酌', '敬请光临'],
  invitePhoto: { id: 'invite', label: '邀请函配图', ratio: 'landscape' },
  groom: {
    role: '新郎',
    name: '陈予安',
    line: '把日子过成想一起走的路',
    photo: { id: 'groom', label: '新郎肖像', ratio: 'portrait' },
    side: 'left',
  },
  bride: {
    role: '新娘',
    name: '林知夏',
    line: '遇见你之后，寻常日子也发光',
    photo: { id: 'bride', label: '新娘肖像', ratio: 'portrait' },
    side: 'right',
  },
  story: [
    { date: '2020.05', title: '初见', text: '一场朋友的晚饭', photo: { id: 'story-1', label: '初见', ratio: 'square' } },
    { date: '2022.09', title: '确定', text: '在江边说好以后', photo: { id: 'story-2', label: '确定', ratio: 'square' } },
    { date: '2026.10', title: '成礼', text: '请你来吃这顿饭', photo: { id: 'story-3', label: '成礼', ratio: 'square' } },
  ],
  schedule: [
    { time: '10:30', title: '迎宾' },
    { time: '11:18', title: '仪式' },
    { time: '12:00', title: '午宴' },
    { time: '14:00', title: '合影送客' },
  ],
  gallery: ['照片一', '照片二', '照片三', '照片四', '照片五', '照片六'].map((label, index) => ({
    id: `gallery-${index + 1}`,
    label,
    ratio: 'portrait' as const,
  })),
}

export function propsFor(id: PageId): Record<string, unknown> {
  switch (id) {
    case 'cover':
      return {
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        dateLabel: invitation.dateLabel,
        photo: invitation.coverPhoto,
      }
    case 'invite':
      return { lines: invitation.inviteLines, photo: invitation.invitePhoto }
    case 'groom':
      return invitation.groom
    case 'bride':
      return invitation.bride
    case 'story':
      return { beats: invitation.story }
    case 'schedule':
      return { items: invitation.schedule }
    case 'gallery':
      return { photos: invitation.gallery }
    case 'info':
      return {
        ceremonyDisplay: invitation.ceremonyDisplay,
        venueName: invitation.venueName,
        hallName: invitation.hallName,
        address: invitation.address,
        dressCode: invitation.dressCode,
      }
    case 'countdown':
      return {
        ceremonyIso: invitation.ceremonyIso,
        note: invitation.countdownNote,
        invalidLabel: invitation.ceremonyDisplay,
      }
    case 'map':
      return {
        venueName: invitation.venueName,
        hallName: invitation.hallName,
        address: invitation.address,
        amapUrl: invitation.amapUrl,
        appleMapUrl: invitation.appleMapUrl,
        geoUrl: invitation.geoUrl,
      }
  }
}

export function systemMapUrl(userAgent: string): string {
  if (/iPhone|iPad/.test(userAgent)) return invitation.appleMapUrl
  return invitation.geoUrl
}
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `npm test -- src/data/invitation.spec.ts`

Expected: PASS，4 tests。

- [ ] **Step 6: 提交**

```bash
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then git init; fi
current=$(git branch --show-current || true)
if [ -z "$current" ] || [ "$current" = "master" ] || [ "$current" = "main" ]; then
  git checkout -b feature_wedding_invite
fi
git add package.json package-lock.json tsconfig.json vite.config.ts index.html .gitignore src/vite-env.d.ts src/main.ts src/App.vue src/styles/main.css src/data/invitation.ts src/data/invitation.spec.ts
git commit -m "$(cat <<'EOF'
feat: 建立请柬工程与示例数据

EOF
)"
```

---

### Task 2: 倒计时

**Files:**
- Create: `src/composables/useCountdown.ts`
- Test: `src/composables/useCountdown.spec.ts`

**Interfaces:**
- Consumes: 无。调用方稍后传入 `ceremonyIso` 与 `invalidLabel`。
- Produces: `getCountdown(ceremonyIso: string, now: Date, invalidLabel: string): { kind: 'days' | 'today' | 'past' | 'invalid'; label: string }`
  - 按 Asia/Shanghai 的日历日相减，不按小时。
  - `days` 的 `label` 是天数字符串，不含「天」。
  - 同一天：`kind: 'today'`，`label: '就是今天'`。
  - 已过：`kind: 'past'`，`label: '婚礼已经开始'`。
  - 无法解析：`kind: 'invalid'`，`label` 等于传入的 `invalidLabel`。

- [ ] **Step 1: 写会失败的测试**

`src/composables/useCountdown.spec.ts`

```ts
import { describe, expect, it } from 'vitest'
import { getCountdown } from './useCountdown'

const iso = '2026-10-18T11:18:00+08:00'
const invalidLabel = '2026年10月18日 11:18'

describe('getCountdown', () => {
  it('counts calendar days in Asia/Shanghai', () => {
    const result = getCountdown(iso, new Date('2026-10-12T16:00:00+08:00'), invalidLabel)
    expect(result).toEqual({ kind: 'days', label: '6' })
  })

  it('treats the ceremony date as today even before 11:18', () => {
    const result = getCountdown(iso, new Date('2026-10-18T00:30:00+08:00'), invalidLabel)
    expect(result).toEqual({ kind: 'today', label: '就是今天' })
  })

  it('marks the next Shanghai date as past', () => {
    const result = getCountdown(iso, new Date('2026-10-19T00:10:00+08:00'), invalidLabel)
    expect(result).toEqual({ kind: 'past', label: '婚礼已经开始' })
  })

  it('returns the invalid label when the iso cannot be parsed', () => {
    const result = getCountdown('not-a-date', new Date('2026-10-12T16:00:00+08:00'), invalidLabel)
    expect(result).toEqual({ kind: 'invalid', label: invalidLabel })
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test -- src/composables/useCountdown.spec.ts`

Expected: FAIL，无法解析 `./useCountdown`。

- [ ] **Step 3: 实现 getCountdown**

`src/composables/useCountdown.ts`

```ts
export interface CountdownState {
  kind: 'days' | 'today' | 'past' | 'invalid'
  label: string
}

function shanghaiDayNumber(date: Date): number | null {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const year = Number(parts.find((part) => part.type === 'year')?.value)
  const month = Number(parts.find((part) => part.type === 'month')?.value)
  const day = Number(parts.find((part) => part.type === 'day')?.value)
  if (!year || !month || !day) return null
  return Math.round(Date.UTC(year, month - 1, day) / 86400000)
}

export function getCountdown(ceremonyIso: string, now: Date, invalidLabel: string): CountdownState {
  const ceremony = new Date(ceremonyIso)
  if (Number.isNaN(ceremony.getTime())) return { kind: 'invalid', label: invalidLabel }
  const today = shanghaiDayNumber(now)
  const target = shanghaiDayNumber(ceremony)
  if (today === null || target === null) return { kind: 'invalid', label: invalidLabel }
  const days = target - today
  if (days > 0) return { kind: 'days', label: String(days) }
  if (days === 0) return { kind: 'today', label: '就是今天' }
  return { kind: 'past', label: '婚礼已经开始' }
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test -- src/composables/useCountdown.spec.ts`

Expected: PASS，4 tests。

- [ ] **Step 5: 提交**

```bash
git add src/composables/useCountdown.ts src/composables/useCountdown.spec.ts
git commit -m "$(cat <<'EOF'
feat: 按上海日历计算典礼倒计时

EOF
)"
```

---

### Task 3: 翻页器逻辑

**Files:**
- Create: `src/test/withSetup.ts`
- Create: `src/composables/usePager.ts`
- Test: `src/composables/usePager.spec.ts`

**Interfaces:**
- Consumes: 无。
- Produces: `usePager(pageCount?: number, lockMs?: number)`，默认 `pageCount = 10`，`lockMs = 700`。返回：
  - `index: Ref<number>` 从 0 开始
  - `direction: Ref<'forward' | 'back'>`
  - `isLocked: Ref<boolean>`
  - `next(): void`
  - `prev(): void`
  - `go(target: number): void`
  - `lock(): void`
  - `onTouchStart(x: number, y: number): void`
  - `onTouchEnd(x: number, y: number): void`
  - `onWheel(deltaY: number): void`
  - `onKeyDown(key: string, preventDefault: () => void): void`

- [ ] **Step 1: 写辅助函数和会失败的测试**

`src/test/withSetup.ts`

```ts
import { createApp, defineComponent, h, type App } from 'vue'

export function withSetup<T>(composable: () => T): { result: T; app: App } {
  let result!: T
  const app = createApp(defineComponent({
    setup() {
      result = composable()
      return () => h('div')
    },
  }))
  app.mount(document.createElement('div'))
  return { result, app }
}
```

`src/composables/usePager.spec.ts`

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { withSetup } from '@/test/withSetup'
import { usePager } from './usePager'

describe('usePager', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function setup() {
    return withSetup(() => usePager()).result
  }

  it('moves forward and back inside 0..9', () => {
    const pager = setup()
    pager.next()
    expect(pager.index.value).toBe(1)
    expect(pager.direction.value).toBe('forward')
    vi.advanceTimersByTime(700)
    pager.prev()
    expect(pager.index.value).toBe(0)
    expect(pager.direction.value).toBe('back')
  })

  it('does not move past either end', () => {
    const pager = setup()
    pager.prev()
    expect(pager.index.value).toBe(0)
    pager.go(9)
    vi.advanceTimersByTime(700)
    pager.next()
    expect(pager.index.value).toBe(9)
  })

  it('ignores input while locked', () => {
    const pager = setup()
    pager.next()
    pager.go(5)
    expect(pager.index.value).toBe(1)
    vi.advanceTimersByTime(700)
    pager.go(5)
    expect(pager.index.value).toBe(5)
    expect(pager.direction.value).toBe('forward')
  })

  it('swipes to the next page only for a clear upward move', () => {
    const pager = setup()
    pager.onTouchStart(0, 100)
    pager.onTouchEnd(0, 52)
    expect(pager.index.value).toBe(0)
    pager.onTouchStart(0, 100)
    pager.onTouchEnd(80, 40)
    expect(pager.index.value).toBe(0)
    pager.onTouchStart(0, 100)
    pager.onTouchEnd(0, 40)
    expect(pager.index.value).toBe(1)
  })

  it('swipes down to the previous page', () => {
    const pager = setup()
    pager.next()
    vi.advanceTimersByTime(700)
    pager.onTouchStart(0, 0)
    pager.onTouchEnd(0, 60)
    expect(pager.index.value).toBe(0)
    expect(pager.direction.value).toBe('back')
  })

  it('uses wheel delta past 40', () => {
    const pager = setup()
    pager.onWheel(40)
    expect(pager.index.value).toBe(0)
    pager.onWheel(41)
    expect(pager.index.value).toBe(1)
  })

  it('prevents default for paging keys and ignores other keys', () => {
    const pager = setup()
    const preventDefault = vi.fn()
    pager.onKeyDown('a', preventDefault)
    expect(preventDefault).not.toHaveBeenCalled()
    pager.onKeyDown(' ', preventDefault)
    expect(preventDefault).toHaveBeenCalledOnce()
    expect(pager.index.value).toBe(1)
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test -- src/composables/usePager.spec.ts`

Expected: FAIL，无法解析 `./usePager`。

- [ ] **Step 3: 实现 usePager**

`src/composables/usePager.ts`

```ts
import { ref } from 'vue'

export function usePager(pageCount = 10, lockMs = 700) {
  const index = ref(0)
  const direction = ref<'forward' | 'back'>('forward')
  const isLocked = ref(false)
  let lockTimer: ReturnType<typeof setTimeout> | null = null
  let startX = 0
  let startY = 0

  function lock() {
    isLocked.value = true
    if (lockTimer) clearTimeout(lockTimer)
    lockTimer = setTimeout(() => {
      isLocked.value = false
    }, lockMs)
  }

  function go(target: number) {
    if (isLocked.value) return
    const nextIndex = Math.min(pageCount - 1, Math.max(0, target))
    if (nextIndex === index.value) return
    direction.value = nextIndex > index.value ? 'forward' : 'back'
    index.value = nextIndex
    lock()
  }

  function next() {
    go(index.value + 1)
  }

  function prev() {
    go(index.value - 1)
  }

  function onTouchStart(x: number, y: number) {
    startX = x
    startY = y
  }

  function onTouchEnd(x: number, y: number) {
    const dx = x - startX
    const dy = y - startY
    if (Math.abs(dy) <= 48 || Math.abs(dy) <= Math.abs(dx)) return
    if (dy < 0) next()
    else prev()
  }

  function onWheel(deltaY: number) {
    if (deltaY > 40) next()
    else if (deltaY < -40) prev()
  }

  function onKeyDown(key: string, preventDefault: () => void) {
    const forward = key === 'ArrowDown' || key === 'PageDown' || key === ' '
    const backward = key === 'ArrowUp' || key === 'PageUp'
    if (!forward && !backward) return
    preventDefault()
    if (forward) next()
    else prev()
  }

  return { index, direction, isLocked, next, prev, go, lock, onTouchStart, onTouchEnd, onWheel, onKeyDown }
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test -- src/composables/usePager.spec.ts`

Expected: PASS，7 tests。

- [ ] **Step 5: 提交**

```bash
git add src/test/withSetup.ts src/composables/usePager.ts src/composables/usePager.spec.ts
git commit -m "$(cat <<'EOF'
feat: 实现翻页手势与动画锁定

EOF
)"
```

---

### Task 4: 图片槽

**Files:**
- Modify: `src/styles/main.css`
- Create: `src/components/PhotoSlot.vue`
- Test: `src/components/PhotoSlot.spec.ts`

**Interfaces:**
- Consumes: `PhotoSlotData` from `src/data/invitation.ts`。
- Produces: `PhotoSlot`，prop `photo: PhotoSlotData`。竖图 `aspect-[3/4]`，横图 `aspect-[4/3]`，方图 `aspect-square`。

- [ ] **Step 1: 写会失败的测试**

`src/components/PhotoSlot.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PhotoSlot from './PhotoSlot.vue'

describe('PhotoSlot', () => {
  it('shows the placeholder label when there is no src', () => {
    const wrapper = mount(PhotoSlot, {
      props: { photo: { id: 'cover', label: '封面照片', ratio: 'portrait' } },
    })
    expect(wrapper.text()).toContain('图片展示区')
    expect(wrapper.text()).toContain('封面照片')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.classes().join(' ')).toContain('aspect-[3/4]')
  })

  it('falls back to the placeholder when the image errors', async () => {
    const wrapper = mount(PhotoSlot, {
      props: { photo: { id: 'cover', label: '封面照片', ratio: 'portrait', src: '/photos/cover.webp' } },
    })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('图片展示区')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test -- src/components/PhotoSlot.spec.ts`

Expected: FAIL，无法解析 `./PhotoSlot.vue`。

- [ ] **Step 3: 实现图片槽并写上字体**

把 `src/styles/main.css` 替换为：

```css
@import "tailwindcss";

html,
body,
#app {
  height: 100%;
  margin: 0;
  background: #e7e1d6;
  color: #2b2724;
  font-family: "Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", serif;
}

body {
  overflow: hidden;
  overscroll-behavior: none;
}
```

`src/components/PhotoSlot.vue`

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PhotoSlotData } from '@/data/invitation'

const props = defineProps<{ photo: PhotoSlotData }>()
const failed = ref(false)

watch(() => props.photo.src, () => {
  failed.value = false
})

const showImage = computed(() => Boolean(props.photo.src) && !failed.value)
const ratioClass = computed(() => {
  if (props.photo.ratio === 'landscape') return 'aspect-[4/3]'
  if (props.photo.ratio === 'square') return 'aspect-square'
  return 'aspect-[3/4]'
})
</script>

<template>
  <div
    class="relative overflow-hidden border border-[#d9cbb6] bg-[#efe6d8]"
    :class="ratioClass"
  >
    <img
      v-if="showImage"
      :src="photo.src"
      :alt="photo.label"
      class="h-full w-full object-cover"
      @error="failed = true"
    />
    <div
      v-else
      class="flex h-full flex-col items-center justify-center gap-1 px-2 text-center text-sm text-[#7a7168]"
    >
      <span>图片展示区</span>
      <span class="text-xs">{{ photo.label }}</span>
    </div>
  </div>
</template>
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test -- src/components/PhotoSlot.spec.ts`

Expected: PASS，2 tests。

- [ ] **Step 5: 提交**

```bash
git add src/styles/main.css src/components/PhotoSlot.vue src/components/PhotoSlot.spec.ts
git commit -m "$(cat <<'EOF'
feat: 增加可回退的图片展示框

EOF
)"
```

---

### Task 5: 外壳、圆点与转场

**Files:**
- Create: `src/utils/frameScale.ts`
- Create: `src/styles/motion.css`
- Create: `src/components/PageDots.vue`
- Create: `src/components/pages/registry.ts`
- Create: `src/components/Pager.vue`
- Modify: `src/App.vue`
- Modify: `src/main.ts`
- Test: `src/utils/frameScale.spec.ts`
- Test: `src/components/PageDots.spec.ts`
- Test: `src/components/Pager.spec.ts`

**Interfaces:**
- Consumes: `usePager`、`pageOrder`、`propsFor`。
- Produces:
  - `frameScale(viewportHeight: number): number`
  - `PageDots` props：`count: number`、`current: number`；emit `select` 参数为页码。
  - `pageViews: Record<PageId, Component>`。此任务全部是占位组件，根节点 `data-page` 为页 id，文本为页 id。
  - `Pager` 无 props。当前页 `<Transition :name="pageId" appear>`。`@after-enter` 后把 `entered` 设为 true；页码变化时先设回 false。触摸、滚轮、键盘绑在 `Pager` 根节点。挂载时调用 `lock()` 并聚焦该根节点。
  - `App` 只负责 430px 外壳和 `frameScale`，不暴露翻页实例。

- [ ] **Step 1: 写会失败的测试**

`src/utils/frameScale.spec.ts`

```ts
import { describe, expect, it } from 'vitest'
import { frameScale } from './frameScale'

describe('frameScale', () => {
  it('caps the scale between 0.82 and 1', () => {
    expect(frameScale(844)).toBe(1)
    expect(frameScale(900)).toBe(1)
    expect(frameScale(760)).toBeCloseTo(760 / 844)
    expect(frameScale(400)).toBe(0.82)
  })
})
```

`src/components/PageDots.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageDots from './PageDots.vue'

describe('PageDots', () => {
  it('marks the current page and emits the clicked index', async () => {
    const wrapper = mount(PageDots, { props: { count: 10, current: 2 } })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(10)
    expect(buttons[2]?.attributes('aria-current')).toBe('true')
    await buttons[4]?.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([4])
  })
})
```

`src/components/Pager.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pager from './Pager.vue'

describe('Pager', () => {
  it('renders the cover stub and ten dots', () => {
    const wrapper = mount(Pager)
    expect(wrapper.find('[data-page="cover"]').exists()).toBe(true)
    expect(wrapper.findAll('button')).toHaveLength(10)
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test -- src/utils/frameScale.spec.ts src/components/PageDots.spec.ts src/components/Pager.spec.ts`

Expected: FAIL，三个模块都不存在。

- [ ] **Step 3: 实现外壳与转场**

`src/utils/frameScale.ts`

```ts
export function frameScale(viewportHeight: number): number {
  return Math.max(0.82, Math.min(1, viewportHeight / 844))
}
```

`src/styles/motion.css`

```css
.cover-enter-from,
.invite-enter-from,
.groom-enter-from,
.bride-enter-from,
.story-enter-from,
.schedule-enter-from,
.gallery-enter-from,
.info-enter-from,
.countdown-enter-from,
.map-enter-from {
  opacity: 0;
}

.cover-enter-from { transform: scale(1.04); }
.invite-enter-from { transform: translateY(24px); }
.groom-enter-from { transform: translateX(-32px); }
.bride-enter-from { transform: translateX(32px); }
.story-enter-from { clip-path: inset(50% 50% 50% 50%); }
.schedule-enter-from { filter: blur(8px); }
.gallery-enter-from { transform: scale(0.92); }
.info-enter-from { clip-path: inset(0 0 100% 0); }
.countdown-enter-from { transform: perspective(800px) rotateY(12deg); }
.map-enter-from { transform: translateY(100%); }

.cover-enter-active,
.invite-enter-active,
.groom-enter-active,
.bride-enter-active,
.story-enter-active,
.schedule-enter-active,
.gallery-enter-active,
.info-enter-active,
.countdown-enter-active,
.map-enter-active {
  transition:
    opacity 640ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 640ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 640ms cubic-bezier(0.22, 1, 0.36, 1),
    clip-path 640ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cover-enter-to,
.invite-enter-to,
.groom-enter-to,
.bride-enter-to,
.story-enter-to,
.schedule-enter-to,
.gallery-enter-to,
.info-enter-to,
.countdown-enter-to,
.map-enter-to {
  opacity: 1;
  transform: none;
  filter: none;
  clip-path: none;
}

.cover-leave-active,
.invite-leave-active,
.groom-leave-active,
.bride-leave-active,
.story-leave-active,
.schedule-leave-active,
.gallery-leave-active,
.info-leave-active,
.countdown-leave-active,
.map-leave-active {
  transition: opacity 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cover-leave-to,
.invite-leave-to,
.groom-leave-to,
.bride-leave-to,
.story-leave-to,
.schedule-leave-to,
.gallery-leave-to,
.info-leave-to,
.countdown-leave-to,
.map-leave-to {
  opacity: 0;
}

.rise,
.pop,
.fade-late {
  opacity: 0;
}

.is-in .rise {
  animation: rise-in 640ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.is-in .pop {
  animation: pop-in 640ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.is-in .fade-late {
  animation: fade-in 640ms cubic-bezier(0.22, 1, 0.36, 1) 180ms forwards;
}

.is-in .d1 { animation-delay: 0ms; }
.is-in .d2 { animation-delay: 80ms; }
.is-in .d3 { animation-delay: 160ms; }
.is-in .d4 { animation-delay: 240ms; }
.is-in .d5 { animation-delay: 320ms; }
.is-in .d6 { animation-delay: 400ms; }

@keyframes rise-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: none; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .cover-enter-active,
  .invite-enter-active,
  .groom-enter-active,
  .bride-enter-active,
  .story-enter-active,
  .schedule-enter-active,
  .gallery-enter-active,
  .info-enter-active,
  .countdown-enter-active,
  .map-enter-active,
  .cover-leave-active,
  .invite-leave-active,
  .groom-leave-active,
  .bride-leave-active,
  .story-leave-active,
  .schedule-leave-active,
  .gallery-leave-active,
  .info-leave-active,
  .countdown-leave-active,
  .map-leave-active {
    transition: opacity 180ms linear;
  }

  .cover-enter-from,
  .invite-enter-from,
  .groom-enter-from,
  .bride-enter-from,
  .story-enter-from,
  .schedule-enter-from,
  .gallery-enter-from,
  .info-enter-from,
  .countdown-enter-from,
  .map-enter-from {
    opacity: 0;
    transform: none;
    filter: none;
    clip-path: none;
  }

  .rise,
  .pop,
  .fade-late {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

`src/components/pages/registry.ts`

```ts
import { defineComponent, h, type Component } from 'vue'
import type { PageId } from '@/data/invitation'

function stub(pageId: PageId): Component {
  return defineComponent({
    name: `Stub${pageId}`,
    inheritAttrs: false,
    props: { entered: { type: Boolean, default: false } },
    setup() {
      return () => h('section', { 'data-page': pageId, class: 'absolute inset-0' }, pageId)
    },
  })
}

export const pageViews: Record<PageId, Component> = {
  cover: stub('cover'),
  invite: stub('invite'),
  groom: stub('groom'),
  bride: stub('bride'),
  story: stub('story'),
  schedule: stub('schedule'),
  gallery: stub('gallery'),
  info: stub('info'),
  countdown: stub('countdown'),
  map: stub('map'),
}
```

`src/components/PageDots.vue`

```vue
<script setup lang="ts">
defineProps<{ count: number; current: number }>()
const emit = defineEmits<{ select: [index: number] }>()
</script>

<template>
  <div class="flex justify-center gap-2">
    <button
      v-for="dot in count"
      :key="dot"
      type="button"
      class="h-1.5 w-1.5 rounded-full"
      :class="dot - 1 === current ? 'bg-[#a68456]' : 'bg-[#d9cbb6]'"
      :aria-label="`第 ${dot} 页`"
      :aria-current="dot - 1 === current ? 'true' : undefined"
      @click="emit('select', dot - 1)"
    />
  </div>
</template>
```

`src/components/Pager.vue`

```vue
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { pageOrder, propsFor } from '@/data/invitation'
import { usePager } from '@/composables/usePager'
import PageDots from './PageDots.vue'
import { pageViews } from './pages/registry'

const pager = usePager(pageOrder.length)
const contentReady = ref(false)
const pageId = () => pageOrder[pager.index.value] ?? 'cover'

watch(pager.index, () => {
  contentReady.value = false
})

function markEntered() {
  contentReady.value = true
}

const root = ref<HTMLElement | null>(null)

function onTouchStart(event: TouchEvent) {
  const touch = event.changedTouches[0]
  if (!touch) return
  pager.onTouchStart(touch.clientX, touch.clientY)
}

function onTouchEnd(event: TouchEvent) {
  const touch = event.changedTouches[0]
  if (!touch) return
  pager.onTouchEnd(touch.clientX, touch.clientY)
}

function onWheel(event: WheelEvent) {
  pager.onWheel(event.deltaY)
}

function onKeyDown(event: KeyboardEvent) {
  pager.onKeyDown(event.key, () => event.preventDefault())
}

onMounted(() => {
  pager.lock()
  root.value?.focus()
})
</script>

<template>
  <div
    ref="root"
    tabindex="0"
    class="relative h-full w-full overflow-hidden bg-[#f6f1e8] outline-none"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @wheel.prevent="onWheel"
    @keydown="onKeyDown"
  >
    <Transition :name="pageId()" appear @after-enter="markEntered">
      <component
        :is="pageViews[pageId()]"
        :key="pageId()"
        class="absolute inset-0"
        :entered="contentReady"
        v-bind="propsFor(pageId())"
      />
    </Transition>
    <PageDots
      class="absolute bottom-5 left-0 right-0 z-10"
      :count="pageOrder.length"
      :current="pager.index.value"
      @select="pager.go"
    />
  </div>
</template>
```

`src/App.vue`

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Pager from '@/components/Pager.vue'
import { frameScale } from '@/utils/frameScale'

const viewportHeight = ref(844)
const scale = computed(() => frameScale(viewportHeight.value))

function readHeight() {
  viewportHeight.value = window.innerHeight
}

onMounted(() => {
  readHeight()
  window.addEventListener('resize', readHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', readHeight)
})
</script>

<template>
  <div class="flex h-dvh items-start justify-center bg-[#e7e1d6]">
    <div
      class="h-dvh w-full max-w-[430px] overflow-hidden"
      :style="{ transform: `scale(${scale})`, transformOrigin: 'top center' }"
    >
      <Pager />
    </div>
  </div>
</template>
```

`src/main.ts` 在样式导入后加上动效样式：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'
import './styles/motion.css'

createApp(App).mount('#app')
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test -- src/utils/frameScale.spec.ts src/components/PageDots.spec.ts src/components/Pager.spec.ts`

Expected: PASS。`Pager` 能看到 `data-page="cover"` 和 10 个按钮。

- [ ] **Step 5: 提交**

```bash
git add src/utils/frameScale.ts src/utils/frameScale.spec.ts src/styles/motion.css src/components/PageDots.vue src/components/PageDots.spec.ts src/components/pages/registry.ts src/components/Pager.vue src/components/Pager.spec.ts src/App.vue src/main.ts
git commit -m "$(cat <<'EOF'
feat: 搭好全屏翻页壳与十种转场

EOF
)"
```

---

### Task 6: 封面、邀请语、新人

**Files:**
- Create: `src/components/pages/PageCover.vue`
- Create: `src/components/pages/PageInvite.vue`
- Create: `src/components/pages/PagePerson.vue`
- Modify: `src/components/pages/registry.ts`
- Test: `src/components/pages/PageCover.spec.ts`
- Test: `src/components/pages/PageInvite.spec.ts`
- Test: `src/components/pages/PagePerson.spec.ts`

**Interfaces:**
- Consumes: `propsFor('cover' | 'invite' | 'groom' | 'bride')` 的字段，外加 `entered: boolean`。`PhotoSlot`。
- Produces: 三个页面组件。`PagePerson` 在 `side === 'left'` 时图在左，否则图在右。父级 `class` 含 `is-in` 时才播放 `rise` / `fade-late`。

- [ ] **Step 1: 写会失败的测试**

`src/components/pages/PageCover.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageCover from './PageCover.vue'

describe('PageCover', () => {
  it('shows the names, date, hint, and photo placeholder', () => {
    const wrapper = mount(PageCover, {
      props: { ...propsFor('cover'), entered: true },
    })
    expect(wrapper.text()).toContain('林知夏')
    expect(wrapper.text()).toContain('陈予安')
    expect(wrapper.text()).toContain('2026.10.18')
    expect(wrapper.text()).toContain('向上滑动，开启邀请函')
    expect(wrapper.text()).toContain('封面照片')
    expect(wrapper.text()).toContain('图片展示区')
  })
})
```

`src/components/pages/PageInvite.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageInvite from './PageInvite.vue'

describe('PageInvite', () => {
  it('shows the four invitation lines and the landscape slot', () => {
    const wrapper = mount(PageInvite, {
      props: { ...propsFor('invite'), entered: true },
    })
    expect(wrapper.text()).toContain('谨订于')
    expect(wrapper.text()).toContain('恭备薄酌')
    expect(wrapper.text()).toContain('邀请函配图')
  })
})
```

`src/components/pages/PagePerson.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PagePerson from './PagePerson.vue'

describe('PagePerson', () => {
  it('places the groom photo before the copy', () => {
    const wrapper = mount(PagePerson, {
      props: { ...propsFor('groom'), entered: true },
    })
    expect(wrapper.text()).toContain('新郎')
    expect(wrapper.text()).toContain('把日子过成想一起走的路')
    expect(wrapper.classes()).toContain('flex-row')
  })

  it('mirrors the bride layout', () => {
    const wrapper = mount(PagePerson, {
      props: { ...propsFor('bride'), entered: true },
    })
    expect(wrapper.text()).toContain('新娘')
    expect(wrapper.classes()).toContain('flex-row-reverse')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test -- src/components/pages/PageCover.spec.ts src/components/pages/PageInvite.spec.ts src/components/pages/PagePerson.spec.ts`

Expected: FAIL，三个组件都不存在。

- [ ] **Step 3: 实现三页并替换占位**

`src/components/pages/PageCover.vue`

```vue
<script setup lang="ts">
import PhotoSlot from '@/components/PhotoSlot.vue'
import type { PhotoSlotData } from '@/data/invitation'

defineProps<{
  entered: boolean
  brideName: string
  groomName: string
  dateLabel: string
  photo: PhotoSlotData
}>()
</script>

<template>
  <section
    class="flex h-full flex-col items-center justify-between px-8 py-14 text-center"
    :class="{ 'is-in': entered }"
  >
    <p class="text-xs tracking-[0.45em] text-[#a68456]">WEDDING</p>
    <div>
      <h1 class="text-4xl leading-tight">
        <span class="rise d1 block">{{ brideName }}</span>
        <span class="rise d2 my-2 block text-2xl text-[#a68456]">&</span>
        <span class="rise d3 block">{{ groomName }}</span>
      </h1>
      <p class="rise d4 mt-5 tracking-[0.28em] text-[#7a7168]">{{ dateLabel }}</p>
    </div>
    <PhotoSlot class="fade-late w-44" :photo="photo" />
    <p class="text-sm text-[#7a7168]">向上滑动，开启邀请函</p>
  </section>
</template>
```

`src/components/pages/PageInvite.vue`

```vue
<script setup lang="ts">
import PhotoSlot from '@/components/PhotoSlot.vue'
import type { PhotoSlotData } from '@/data/invitation'

defineProps<{
  entered: boolean
  lines: string[]
  photo: PhotoSlotData
}>()
</script>

<template>
  <section
    class="flex h-full flex-col justify-center gap-8 px-8"
    :class="{ 'is-in': entered }"
  >
    <PhotoSlot class="fade-late" :photo="photo" />
    <div class="text-center text-xl leading-10">
      <p v-for="(line, index) in lines" :key="line" class="rise" :class="`d${index + 1}`">
        {{ line }}
      </p>
    </div>
  </section>
</template>
```

`src/components/pages/PagePerson.vue`

```vue
<script setup lang="ts">
import PhotoSlot from '@/components/PhotoSlot.vue'
import type { PhotoSlotData } from '@/data/invitation'

defineProps<{
  entered: boolean
  role: string
  name: string
  line: string
  photo: PhotoSlotData
  side: 'left' | 'right'
}>()
</script>

<template>
  <section
    class="flex h-full items-center gap-6 px-8"
    :class="[side === 'left' ? 'flex-row' : 'flex-row-reverse', { 'is-in': entered }]"
  >
    <PhotoSlot class="fade-late w-40 shrink-0" :photo="photo" />
    <div>
      <p class="rise d1 text-sm tracking-[0.3em] text-[#a68456]">{{ role }}</p>
      <h2 class="rise d2 mt-3 text-3xl">{{ name }}</h2>
      <p class="rise d3 mt-4 text-sm leading-6 text-[#7a7168]">{{ line }}</p>
    </div>
  </section>
</template>
```

把 `src/components/pages/registry.ts` 替换为：

```ts
import { defineComponent, h, type Component } from 'vue'
import type { PageId } from '@/data/invitation'
import PageCover from './PageCover.vue'
import PageInvite from './PageInvite.vue'
import PagePerson from './PagePerson.vue'

function stub(pageId: PageId): Component {
  return defineComponent({
    name: `Stub${pageId}`,
    inheritAttrs: false,
    props: { entered: { type: Boolean, default: false } },
    setup() {
      return () => h('section', { 'data-page': pageId, class: 'absolute inset-0' }, pageId)
    },
  })
}

export const pageViews: Record<PageId, Component> = {
  cover: PageCover,
  invite: PageInvite,
  groom: PagePerson,
  bride: PagePerson,
  story: stub('story'),
  schedule: stub('schedule'),
  gallery: stub('gallery'),
  info: stub('info'),
  countdown: stub('countdown'),
  map: stub('map'),
}
```

- [ ] **Step 4: 运行测试，确认通过**

把 `src/components/Pager.spec.ts` 的断言改为真实封面文案：

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pager from './Pager.vue'

describe('Pager', () => {
  it('renders the cover and ten dots', () => {
    const wrapper = mount(Pager)
    expect(wrapper.text()).toContain('林知夏')
    expect(wrapper.text()).toContain('向上滑动，开启邀请函')
    expect(wrapper.findAll('button')).toHaveLength(10)
  })
})
```

Run: `npm test -- src/components/pages/PageCover.spec.ts src/components/pages/PageInvite.spec.ts src/components/pages/PagePerson.spec.ts src/components/Pager.spec.ts`

Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/pages/PageCover.vue src/components/pages/PageCover.spec.ts src/components/pages/PageInvite.vue src/components/pages/PageInvite.spec.ts src/components/pages/PagePerson.vue src/components/pages/PagePerson.spec.ts src/components/pages/registry.ts src/components/Pager.spec.ts
git commit -m "$(cat <<'EOF'
feat: 完成封面、邀请语与新人页

EOF
)"
```

---

### Task 7: 故事、流程、相册

**Files:**
- Create: `src/components/pages/PageStory.vue`
- Create: `src/components/pages/PageSchedule.vue`
- Create: `src/components/pages/PageGallery.vue`
- Modify: `src/components/pages/registry.ts`
- Test: `src/components/pages/PageStory.spec.ts`
- Test: `src/components/pages/PageSchedule.spec.ts`
- Test: `src/components/pages/PageGallery.spec.ts`

**Interfaces:**
- Consumes: `propsFor('story' | 'schedule' | 'gallery')` 与 `entered: boolean`。
- Produces: 三页。故事三个方图，流程四行且无图片槽，相册六张竖图使用 `pop`。

- [ ] **Step 1: 写会失败的测试**

`src/components/pages/PageStory.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageStory from './PageStory.vue'

describe('PageStory', () => {
  it('shows three beats and their photo labels', () => {
    const wrapper = mount(PageStory, { props: { ...propsFor('story'), entered: true } })
    expect(wrapper.text()).toContain('一场朋友的晚饭')
    expect(wrapper.text()).toContain('在江边说好以后')
    expect(wrapper.text()).toContain('请你来吃这顿饭')
    expect(wrapper.text()).toContain('初见')
    expect(wrapper.findAll('.aspect-square')).toHaveLength(3)
  })
})
```

`src/components/pages/PageSchedule.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageSchedule from './PageSchedule.vue'

describe('PageSchedule', () => {
  it('lists four events and no photo slot', () => {
    const wrapper = mount(PageSchedule, { props: { ...propsFor('schedule'), entered: true } })
    expect(wrapper.text()).toContain('10:30')
    expect(wrapper.text()).toContain('合影送客')
    expect(wrapper.text()).not.toContain('图片展示区')
  })
})
```

`src/components/pages/PageGallery.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageGallery from './PageGallery.vue'

describe('PageGallery', () => {
  it('renders six portrait placeholders', () => {
    const wrapper = mount(PageGallery, { props: { ...propsFor('gallery'), entered: true } })
    expect(wrapper.text()).toContain('照片一')
    expect(wrapper.text()).toContain('照片六')
    expect(wrapper.findAll('.aspect-\\[3\\/4\\]')).toHaveLength(6)
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test -- src/components/pages/PageStory.spec.ts src/components/pages/PageSchedule.spec.ts src/components/pages/PageGallery.spec.ts`

Expected: FAIL，三个组件都不存在。

- [ ] **Step 3: 实现三页并替换占位**

`src/components/pages/PageStory.vue`

```vue
<script setup lang="ts">
import PhotoSlot from '@/components/PhotoSlot.vue'
import type { StoryBeat } from '@/data/invitation'

defineProps<{ entered: boolean; beats: StoryBeat[] }>()
</script>

<template>
  <section class="flex h-full flex-col justify-center gap-5 px-8" :class="{ 'is-in': entered }">
    <h2 class="text-center text-sm tracking-[0.4em] text-[#a68456]">我们的故事</h2>
    <article v-for="(beat, index) in beats" :key="beat.date" class="rise flex items-center gap-4" :class="`d${index + 1}`">
      <PhotoSlot class="w-16 shrink-0" :photo="beat.photo" />
      <div>
        <p class="text-xs tracking-[0.2em] text-[#a68456]">{{ beat.date }} {{ beat.title }}</p>
        <p class="mt-1 text-sm text-[#7a7168]">{{ beat.text }}</p>
      </div>
    </article>
  </section>
</template>
```

`src/components/pages/PageSchedule.vue`

```vue
<script setup lang="ts">
import type { ScheduleItem } from '@/data/invitation'

defineProps<{ entered: boolean; items: ScheduleItem[] }>()
</script>

<template>
  <section class="flex h-full flex-col justify-center px-10" :class="{ 'is-in': entered }">
    <h2 class="text-center text-sm tracking-[0.4em] text-[#a68456]">婚礼流程</h2>
    <ol class="mt-8">
      <li
        v-for="(item, index) in items"
        :key="item.time"
        class="rise flex items-baseline gap-6 border-b border-[#d9cbb6] py-4"
        :class="`d${index + 1}`"
      >
        <span class="w-16 text-[#a68456]">{{ item.time }}</span>
        <span class="text-xl">{{ item.title }}</span>
      </li>
    </ol>
  </section>
</template>
```

`src/components/pages/PageGallery.vue`

```vue
<script setup lang="ts">
import PhotoSlot from '@/components/PhotoSlot.vue'
import type { PhotoSlotData } from '@/data/invitation'

defineProps<{ entered: boolean; photos: PhotoSlotData[] }>()
</script>

<template>
  <section class="flex h-full flex-col justify-center px-6" :class="{ 'is-in': entered }">
    <h2 class="mb-4 text-center text-sm tracking-[0.4em] text-[#a68456]">相册</h2>
    <div class="grid grid-cols-2 gap-3">
      <PhotoSlot
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="pop"
        :class="`d${index + 1}`"
        :photo="photo"
      />
    </div>
  </section>
</template>
```

把 `src/components/pages/registry.ts` 替换为：

```ts
import { defineComponent, h, type Component } from 'vue'
import type { PageId } from '@/data/invitation'
import PageCover from './PageCover.vue'
import PageGallery from './PageGallery.vue'
import PageInvite from './PageInvite.vue'
import PagePerson from './PagePerson.vue'
import PageSchedule from './PageSchedule.vue'
import PageStory from './PageStory.vue'

function stub(pageId: PageId): Component {
  return defineComponent({
    name: `Stub${pageId}`,
    inheritAttrs: false,
    props: { entered: { type: Boolean, default: false } },
    setup() {
      return () => h('section', { 'data-page': pageId, class: 'absolute inset-0' }, pageId)
    },
  })
}

export const pageViews: Record<PageId, Component> = {
  cover: PageCover,
  invite: PageInvite,
  groom: PagePerson,
  bride: PagePerson,
  story: PageStory,
  schedule: PageSchedule,
  gallery: PageGallery,
  info: stub('info'),
  countdown: stub('countdown'),
  map: stub('map'),
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test -- src/components/pages/PageStory.spec.ts src/components/pages/PageSchedule.spec.ts src/components/pages/PageGallery.spec.ts`

Expected: PASS，3 tests。

- [ ] **Step 5: 提交**

```bash
git add src/components/pages/PageStory.vue src/components/pages/PageStory.spec.ts src/components/pages/PageSchedule.vue src/components/pages/PageSchedule.spec.ts src/components/pages/PageGallery.vue src/components/pages/PageGallery.spec.ts src/components/pages/registry.ts
git commit -m "$(cat <<'EOF'
feat: 完成故事、流程与相册页

EOF
)"
```

---

### Task 8: 信息、倒计时、地图

**Files:**
- Create: `src/components/pages/PageInfo.vue`
- Create: `src/components/pages/PageCountdown.vue`
- Create: `src/components/pages/PageMap.vue`
- Modify: `src/components/pages/registry.ts`
- Test: `src/components/pages/PageInfo.spec.ts`
- Test: `src/components/pages/PageCountdown.spec.ts`
- Test: `src/components/pages/PageMap.spec.ts`

**Interfaces:**
- Consumes: `getCountdown`、`systemMapUrl`、`propsFor('info' | 'countdown' | 'map')`。
- Produces:
  - `PageInfo` 展示时间、地点、着装，无图片槽。
  - `PageCountdown` 额外可选 prop `now?: Date`，默认 `new Date()`。`kind === 'days'` 时大号数字旁有小号「天」；今天、已过、无效三种不显示「天」。
  - `PageMap` 可选 prop `userAgent?: string`，默认 `navigator.userAgent`。高德链接固定 `amapUrl`。系统地图链接用 `systemMapUrl`。两个链接都是 `target="_blank"`、`rel="noopener noreferrer"`。页内有一个 SVG 定位针，不请求瓦片。

- [ ] **Step 1: 写会失败的测试**

`src/components/pages/PageInfo.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageInfo from './PageInfo.vue'

describe('PageInfo', () => {
  it('shows time, place, and dress code without a photo slot', () => {
    const wrapper = mount(PageInfo, { props: { ...propsFor('info'), entered: true } })
    expect(wrapper.text()).toContain('2026年10月18日 11:18')
    expect(wrapper.text()).toContain('上海外滩茂悦大酒店')
    expect(wrapper.text()).toContain('浦江厅')
    expect(wrapper.text()).toContain('浅色礼服即可，请避开全白')
    expect(wrapper.text()).not.toContain('图片展示区')
  })
})
```

`src/components/pages/PageCountdown.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { propsFor } from '@/data/invitation'
import PageCountdown from './PageCountdown.vue'

describe('PageCountdown', () => {
  it('shows the day count and the note', () => {
    const wrapper = mount(PageCountdown, {
      props: {
        ...propsFor('countdown'),
        entered: true,
        now: new Date('2026-10-12T16:00:00+08:00'),
      },
    })
    expect(wrapper.text()).toContain('6')
    expect(wrapper.text()).toContain('天')
    expect(wrapper.text()).toContain('愿你出席，见证这个日子')
  })

  it('shows the invalid label without a day unit', () => {
    const wrapper = mount(PageCountdown, {
      props: {
        ...propsFor('countdown'),
        ceremonyIso: 'not-a-date',
        entered: true,
        now: new Date('2026-10-12T16:00:00+08:00'),
      },
    })
    expect(wrapper.text()).toContain('2026年10月18日 11:18')
    expect(wrapper.text()).not.toContain('天')
  })
})
```

`src/components/pages/PageMap.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { invitation, propsFor } from '@/data/invitation'
import PageMap from './PageMap.vue'

describe('PageMap', () => {
  it('links to amap and the system map for the current device', () => {
    const wrapper = mount(PageMap, {
      props: {
        ...propsFor('map'),
        entered: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 14)',
      },
    })
    const links = wrapper.findAll('a')
    expect(links[0]?.attributes('href')).toBe(invitation.amapUrl)
    expect(links[1]?.attributes('href')).toBe(invitation.geoUrl)
    expect(links[0]?.attributes('target')).toBe('_blank')
    expect(links[0]?.attributes('rel')).toBe('noopener noreferrer')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toContain('上海市虹口区黄浦路199号')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `npm test -- src/components/pages/PageInfo.spec.ts src/components/pages/PageCountdown.spec.ts src/components/pages/PageMap.spec.ts`

Expected: FAIL，三个组件都不存在。

- [ ] **Step 3: 实现最后三页**

`src/components/pages/PageInfo.vue`

```vue
<script setup lang="ts">
defineProps<{
  entered: boolean
  ceremonyDisplay: string
  venueName: string
  hallName: string
  address: string
  dressCode: string
}>()
</script>

<template>
  <section class="flex h-full flex-col justify-center gap-6 px-10" :class="{ 'is-in': entered }">
    <h2 class="text-center text-sm tracking-[0.4em] text-[#a68456]">婚礼信息</h2>
    <p class="rise d1"><span class="mr-4 text-[#a68456]">时间</span>{{ ceremonyDisplay }}</p>
    <p class="rise d2"><span class="mr-4 text-[#a68456]">地点</span>{{ venueName }} · {{ hallName }}</p>
    <p class="rise d3 text-sm text-[#7a7168]">{{ address }}</p>
    <p class="rise d4"><span class="mr-4 text-[#a68456]">着装</span>{{ dressCode }}</p>
  </section>
</template>
```

`src/components/pages/PageCountdown.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { getCountdown } from '@/composables/useCountdown'

const props = defineProps<{
  entered: boolean
  ceremonyIso: string
  note: string
  invalidLabel: string
  now?: Date
}>()

const state = computed(() => getCountdown(props.ceremonyIso, props.now ?? new Date(), props.invalidLabel))
</script>

<template>
  <section class="flex h-full flex-col items-center justify-center px-8 text-center" :class="{ 'is-in': entered }">
    <p class="rise d1 text-sm tracking-[0.4em] text-[#a68456]">倒计时</p>
    <p class="rise d2 mt-6 text-5xl">
      {{ state.label }}
      <span v-if="state.kind === 'days'" class="ml-2 text-base text-[#7a7168]">天</span>
    </p>
    <p class="rise d3 mt-6 text-sm text-[#7a7168]">{{ note }}</p>
  </section>
</template>
```

`src/components/pages/PageMap.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { systemMapUrl } from '@/data/invitation'

const props = defineProps<{
  entered: boolean
  venueName: string
  hallName: string
  address: string
  amapUrl: string
  appleMapUrl: string
  geoUrl: string
  userAgent?: string
}>()

const systemHref = computed(() => systemMapUrl(props.userAgent ?? navigator.userAgent))
</script>

<template>
  <section class="flex h-full flex-col justify-end px-6 pb-16" :class="{ 'is-in': entered }">
    <svg viewBox="0 0 320 180" class="h-40 w-full text-[#d9cbb6]" aria-hidden="true">
      <rect x="8" y="8" width="304" height="164" fill="#efe6d8" stroke="currentColor" />
      <path d="M20 130 C80 90 120 150 180 100 S260 70 300 90" fill="none" stroke="currentColor" />
      <circle cx="168" cy="78" r="8" fill="#a68456" />
    </svg>
    <div class="rise d2 mt-6 border border-[#d9cbb6] bg-[#f6f1e8] p-5">
      <h2 class="text-xl">{{ venueName }}</h2>
      <p class="mt-2 text-sm text-[#7a7168]">{{ hallName }}</p>
      <p class="mt-1 text-sm text-[#7a7168]">{{ address }}</p>
      <div class="mt-4 flex gap-3 text-sm">
        <a class="border border-[#a68456] px-3 py-2 text-[#a68456]" :href="amapUrl" target="_blank" rel="noopener noreferrer">高德导航</a>
        <a class="border border-[#a68456] px-3 py-2 text-[#a68456]" :href="systemHref" target="_blank" rel="noopener noreferrer">系统地图</a>
      </div>
    </div>
  </section>
</template>
```

`appleMapUrl` 与 `geoUrl` 必须留在 props 中，这样 `propsFor('map')` 可以原样绑定；链接选择只走 `systemMapUrl`。

把 `registry.ts` 替换为完整接线，删除 `stub`：

```ts
import type { Component } from 'vue'
import type { PageId } from '@/data/invitation'
import PageCover from './PageCover.vue'
import PageCountdown from './PageCountdown.vue'
import PageGallery from './PageGallery.vue'
import PageInfo from './PageInfo.vue'
import PageInvite from './PageInvite.vue'
import PageMap from './PageMap.vue'
import PagePerson from './PagePerson.vue'
import PageSchedule from './PageSchedule.vue'
import PageStory from './PageStory.vue'

export const pageViews: Record<PageId, Component> = {
  cover: PageCover,
  invite: PageInvite,
  groom: PagePerson,
  bride: PagePerson,
  story: PageStory,
  schedule: PageSchedule,
  gallery: PageGallery,
  info: PageInfo,
  countdown: PageCountdown,
  map: PageMap,
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npm test`

Expected: PASS，此前所有测试加上本任务 4 个测试。

- [ ] **Step 5: 提交**

```bash
git add src/components/pages/PageInfo.vue src/components/pages/PageInfo.spec.ts src/components/pages/PageCountdown.vue src/components/pages/PageCountdown.spec.ts src/components/pages/PageMap.vue src/components/pages/PageMap.spec.ts src/components/pages/registry.ts
git commit -m "$(cat <<'EOF'
feat: 完成信息、倒计时与地图页

EOF
)"
```

---

### Task 9: 整站验收

**Files:**
- Test: `src/App.spec.ts`

**Interfaces:**
- Consumes: 已完成的 `App`、`Pager`、`usePager`。
- Produces: 无新的生产接口。本任务确认十页文案可到达，并且 `npm run build` 成功。

- [ ] **Step 1: 写整站测试**

`src/App.spec.ts`

```ts
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.vue'
import { invitation } from './data/invitation'

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens on the cover and reaches the map from the last dot', async () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('林知夏')
    expect(wrapper.text()).toContain('向上滑动，开启邀请函')
    vi.advanceTimersByTime(700)
    const dots = wrapper.findAll('button')
    expect(dots).toHaveLength(10)
    await dots[9]?.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('上海外滩茂悦大酒店')
    expect(wrapper.find('a').attributes('href')).toBe(invitation.amapUrl)
  })
})
```

- [ ] **Step 2: 运行测试**

Run: `npm test -- src/App.spec.ts`

Expected: PASS。点击最后一个圆点前，700ms 锁定已经用 `advanceTimersByTime(700)` 放开。

- [ ] **Step 3: 构建**

Run: `npm run build`

Expected: 命令退出码 0，生成 `dist/`。

- [ ] **Step 4: 浏览器验收**

Run: `npm run dev`，用 390px 宽打开本地地址。

确认：

- 封面到地图可以上滑、下滑，底部圆点可跳页。
- 十页进入效果依次为：缩放淡入、上滑、左滑、右滑、中心展开、模糊散去、放大、自上拭开、轻翻、底部上升。
- 未放图片时，封面、邀请函、新人、故事、相册都显示「图片展示区」。
- 流程页和信息页没有图片槽。
- 地图页有示意地图。「高德导航」指向 Global Constraints 里的高德地址。
- 宽度大于 430px 时邀请函居中，外侧为 `#e7e1d6`。
- 系统开启「减少动效」后，切页只剩短淡入淡出，姓名和流程不再依次飞入。

浏览器验收和设计说明不一致时，先改代码再提交。

- [ ] **Step 5: 提交**

```bash
git add src/App.spec.ts
git commit -m "$(cat <<'EOF'
test: 覆盖从封面进入地图页

EOF
)"
```

