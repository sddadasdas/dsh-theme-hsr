// 热重载竞态：旧实例还占着 id 时，新实例必须在旧实例卸载后自己接手。
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = readFileSync(fileURLToPath(new URL('../client.js', import.meta.url)), 'utf8');
const store = new Map();
const dom = { dataset: {}, head: { appendChild() {} }, createElement: () => ({ remove() {} }), addEventListener() {}, removeEventListener() {}, hidden: false };

globalThis.window = globalThis;
globalThis.document = { documentElement: dom, head: dom.head, createElement: dom.createElement, addEventListener: dom.addEventListener, removeEventListener: dom.removeEventListener, hidden: false };
globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)) };

const listeners = new Set();
const effects = [];
const themes = [
  { id: 'light', colorScheme: 'light', tokens: {} },
  { id: 'dark', colorScheme: 'dark', tokens: {} },
  // 旧实例遗留的注册
  { id: 'astral-night', colorScheme: 'dark', tokens: {} },
  { id: 'astral-old-instance', colorScheme: 'light', tokens: {} },
];
let preference = 'dark';
const snapshot = () => ({ preference, themes, revision: 0, fontSizes: {}, fontFamilies: {}, active: themes.find((t) => t.id === preference) || themes[1] });
const theme = {
  getTheme: snapshot,
  register(def) {
    if (themes.some((t) => t.id === def.id)) throw new Error('already registered: ' + def.id);
    themes.push(def);
    return () => { const i = themes.findIndex((t) => t.id === def.id); if (i >= 0) themes.splice(i, 1); };
  },
  setTheme(id) { preference = id; },
};
const ctx = { theme, on: (_n, fn) => { listeners.add(fn); return () => listeners.delete(fn); }, effect: (cb) => { const d = cb(); if (typeof d === 'function') effects.push(d); return d; } };

let mod;
globalThis.__ModuleLoader__ = { load: ({ factory }) => { mod = factory(() => ({})); } };
new Function(src)();
mod.apply(ctx);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (n, ok, x = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${n}${x ? ' — ' + x : ''}`);

await sleep(100);
check('旧实例占用时仍按 mode 上色、不报错', dom.dataset.astral === 'astral-night', 'astral=' + dom.dataset.astral);

// 旧实例被宿主卸载
const i = themes.findIndex((t) => t.id === 'astral-night');
themes.splice(i, 1);

await sleep(800);
check('旧实例卸载后自动补注册', themes.some((t) => t.id === 'astral-night'), 'ids=' + themes.map((t) => t.id).join(','));
check('补注册后自动上色', dom.dataset.astral === 'astral-night', 'astral=' + dom.dataset.astral);
check('补注册后偏好同步', preference === 'astral-night', 'preference=' + preference);

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed === 0 ? '\nALL PASS' : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);