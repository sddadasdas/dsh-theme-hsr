// 图标层离线校验：把注册出去的 ThemeDefinition.icons 抓出来，
// 逐条比对宿主真实字形表（test/icon-glyphs.json，从 app.asar 里抽出），
// 并检查文档结构是否满足 ui-theme.register 的收编条件。
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const src = readFileSync(fileURLToPath(new URL('../client.js', import.meta.url)), 'utf8');
const glyphs = new Set(
  JSON.parse(readFileSync(fileURLToPath(new URL('./icon-glyphs.json', import.meta.url)), 'utf8')),
);

const store = new Map();
const dom = { dataset: {}, head: { appendChild() {} } };
globalThis.window = globalThis;
globalThis.document = {
  documentElement: dom,
  head: dom.head,
  createElement: () => ({ id: '', textContent: '', remove() {}, setAttribute() {} }),
  addEventListener() {},
  removeEventListener() {},
  hidden: false,
};
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
};

let mod;
globalThis.__ModuleLoader__ = { load: ({ factory }) => { mod = factory(() => ({})); } };
new Function(src)();

const registered = [];
const listeners = new Set();
const themes = [
  { id: 'light', colorScheme: 'light', tokens: {} },
  { id: 'dark', colorScheme: 'dark', tokens: {} },
];
let preference = 'dark';
let revision = 0;
const snapshot = () => ({ preference, themes, revision, fontSizes: {}, fontFamilies: {}, active: themes[1] });

const ctx = {
  theme: {
    getTheme: snapshot,
    register(def) {
      if (themes.some((t) => t.id === def.id)) throw new Error('already registered: ' + def.id);
      registered.push(def);
      themes.push(def);
      return () => {};
    },
    setTheme(id) { preference = id; revision += 1; },
  },
  on(_n, fn) { listeners.add(fn); return () => listeners.delete(fn); },
  effect(cb) { const d = cb(); return d; },
  effect0() {},
};

(mod.default || mod).apply(ctx);

const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);

check('主题注册成功', registered.length === 1, 'count=' + registered.length);

const problems = [];
let total = 0;
for (const def of registered) {
  const icons = def.icons || {};
  total += Object.keys(icons).length;
  for (const [key, doc] of Object.entries(icons)) {
    const m = /^dsw-icon-(.+)-\{0,1\}(regular|medium)$/.exec(key) || /^dsw-icon-(.+)-(regular|medium)$/.exec(key);
    if (!m) { problems.push(`${def.id}: 键名不合规 ${key}`); continue; }
    const glyph = m[1];
    if (!glyphs.has(glyph)) problems.push(`${def.id}: 未知字形 ${glyph}（register 会拒收）`);
    if (!doc.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"')) {
      problems.push(`${def.id}: 缺少 SVG 命名空间根或 viewBox：${key}`);
    }
    if (/<style|<script/i.test(doc)) problems.push(`${def.id}: 含 <style>/<script>：${key}`);
    if (/\sid="/.test(doc)) problems.push(`${def.id}: 含元素 id（须以 <symbol id>- 开头）：${key}`);
    if (!/<(path|circle|rect|line|polyline|polygon)[\s>]/.test(doc)) problems.push(`${def.id}: 没有图形元素：${key}`);
    if (/stroke="currentColor"/.test(doc) === false) problems.push(`${def.id}: 未继承 currentColor：${key}`);
  }
}

check('图标文档全部合规', problems.length === 0, problems.slice(0, 6).join(' | '));
check('注册的图标齐全', !!registered[0]?.icons && Object.keys(registered[0].icons).length === 54, 'icons=' + Object.keys(registered[0]?.icons || {}).length);
check('同时覆盖 regular 与 medium', total > 0 && total % 2 === 0, 'icons=' + total);

const keys = Object.keys(registered[0]?.icons || {});
check('每个字形都有 regular/medium 成对', keys.length > 0 && keys.every((k, i) =>
  i % 2 === 0 ? k.endsWith('-regular') : k.endsWith('-medium')), keys.slice(0, 4).join(','));

console.log(results.join('\n'));
process.exitCode = results.some((r) => r.startsWith('FAIL')) ? 1 : 0;