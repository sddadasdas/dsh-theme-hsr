// 离线验证 v0.5.0 的"防打回"逻辑：模拟宿主的 adopt() 语义，
// 确认设置写入（换模型/开关插件）后主题仍被拉回。
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = readFileSync(fileURLToPath(new URL('../client.js', import.meta.url)), 'utf8');

const store = new Map();
const dom = {
  dataset: {},
  head: { appendChild() {} },
  createElement: () => ({ id: '', textContent: '', remove() {} }),
  addEventListener() {},
  removeEventListener() {},
  hidden: false,
};

let pending = [];
const realSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = (fn, ms) => {
  const id = realSetTimeout(fn, ms);
  pending.push(id);
  return id;
};
globalThis.clearTimeout = (id) => {
  pending = pending.filter((x) => x !== id);
};

globalThis.window = globalThis;
globalThis.document = { documentElement: dom, head: dom.head, createElement: dom.createElement, addEventListener: dom.addEventListener, removeEventListener: dom.removeEventListener, hidden: false };
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
};

let mod;
globalThis.__ModuleLoader__ = { load: ({ factory }) => { mod = factory(() => ({})); } };
new Function(src)();

// —— 宿主语义模拟：只有 system/light/dark 落盘；任何设置写入都会 adopt() ——
const listeners = new Set();
const effects = [];
const themes = [
  { id: 'light', colorScheme: 'light', tokens: {} },
  { id: 'dark', colorScheme: 'dark', tokens: {} },
];
let preference = 'dark';
let revision = 0;
const snapshot = () => ({ preference, themes, revision, fontSizes: {}, fontFamilies: {}, active: themes.find((t) => t.id === preference) || themes[1] });

const theme = {
  getTheme: snapshot,
  register(def) {
    if (themes.some((t) => t.id === def.id)) throw new Error('already registered: ' + def.id);
    themes.push(def);
    return () => {
      const i = themes.findIndex((t) => t.id === def.id);
      if (i >= 0) themes.splice(i, 1);
      if (preference === def.id) preference = 'dark';
    };
  },
  setTheme(id) {
    if (id !== 'system' && !themes.some((t) => t.id === id)) throw new Error('not registered: ' + id);
    if (preference === id) return;
    preference = id;
    revision += 1;
    // 只有内置偏好会写盘；第三方主题 id 不落盘
    for (const fn of [...listeners]) fn(snapshot());
  },
};

const ctx = {
  theme,
  on(_name, fn) { listeners.add(fn); return () => listeners.delete(fn); },
  effect(cb) { const d = cb(); if (typeof d === 'function') effects.push(d); return d; },
  effect0() {},
};

const app = mod.default || mod;
app.apply(ctx);

const flush = () => new Promise((r) => realSetTimeout(r, 120));
const adopt = () => { // 宿主 settings 写入 → adopt() → 偏好回到耐久值 dark
  for (const fn of [...listeners]) fn(snapshot());
};

const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);

await flush();
check('注册后偏好被拉回 astral-night', preference === 'astral-night', 'preference=' + preference);
check('dataset 已上色', dom.dataset.astral === 'astral-night', 'astral=' + dom.dataset.astral);

// 场景 1：换模型 → 设置写入 → adopt 把偏好打回 dark
theme.setTheme('dark');
adopt();
await flush();
check('换模型/写设置后自动夺回', preference === 'astral-night', 'preference=' + preference);
check('换模型后颜色仍在', dom.dataset.astral === 'astral-night', 'astral=' + dom.dataset.astral);

// 场景 2：连写三次设置，确认能持续夺回且不死循环
for (let i = 0; i < 3; i += 1) {
  theme.setTheme(i % 2 ? 'light' : 'dark');
  adopt();
  await flush();
}
check('连续多次设置写入后仍保持', preference === 'astral-night', 'preference=' + preference);

// 场景 3：用户主动切到内置浅色（同样是 setTheme(light)，但没有后续 adopt）
theme.setTheme('light');
await flush();
check('主题仍会夺回（策略：不做自动退出）', preference === 'astral-night', 'preference=' + preference);

// 场景 4：模式改成 off 后立即生效
store.set('dsh.astral.mode', 'off');
theme.setTheme('light');
await flush();
check('关闭后不再上色', !dom.dataset.astral, 'astral=' + dom.dataset.astral);

// 场景 5：关闭
store.set('dsh.astral.mode', 'off');
theme.setTheme('dark');
await flush();
check('关闭后不再上色', dom.dataset.astral === undefined, 'astral=' + dom.dataset.astral);
check('关闭后不再抢偏好', preference === 'dark', 'preference=' + preference);

// 场景 6：别的插件注册的主题不抢
store.delete('dsh.astral.mode');
theme.register({ id: 'other-theme', colorScheme: 'dark', tokens: {} });
theme.setTheme('other-theme');
await flush();
check('别的主题不抢', preference === 'other-theme', 'preference=' + preference);

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed === 0 ? '\nALL PASS' : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);