window.__ModuleLoader__.load({
  id: '@local/dsh-theme-astral',
  factory(require) {
    const NIGHT_ID = 'astral-night';
    const STYLE_ID = 'dsh-theme-astral-tokens';
    /**
     * 视觉模式：'night' | 'off'。
     * 放在 localStorage 而不是主题偏好里，是因为宿主只持久化 system/light/dark
     * （ThemeRuntime.setTheme 里只有内置偏好才写进 settings scope），
     * 而且任何一次设置写入都会触发 adopt() 把 preference 拉回耐久的那个内置值。
     * 把"长什么样"和"宿主偏好是什么"解耦，插件开关、换模型才打不掉。
     */
    const MODE_KEY = 'dsh.astral.mode';
    /** 旧开关，只读兼容：写成 'off' 仍等于关闭。 */
    const AUTO_KEY = 'dsh.astral.auto';

    /**
     * 星穹·夜航：深空靛蓝底 + 黄铜金。
     * 除了 theme.register 覆盖的十几个别名，这里把整套中性灰表面（悬浮层、气泡、
     * 输入框、菜单、滚动条、按钮填充）都映射进同一条靛蓝色阶，
     * 否则界面会一半冷蓝一半暖灰。
     */
    const NIGHT = {
      // 表面
      '--dsw-alias-bg-base': '#0A0E1A',
      '--dsw-alias-bg-document-preview': '#0F1524',
      '--dsw-alias-bg-layer-1': '#0F1524',
      '--dsw-alias-bg-layer-2': '#141B2B',
      '--dsw-alias-bg-layer-3': '#1A2334',
      '--dsw-alias-bg-overlay': '#1E2840',
      '--dsw-alias-bg-module-platform': '#1A2334',
      '--dsw-alias-bg-multi-select': '#111827',
      '--dsw-alias-bg-skeleton': '#9AA6C41A',
      // 描边
      '--dsw-alias-border-l1': '#262B3A',
      '--dsw-alias-border-l2': '#3A3F52',
      '--dsw-alias-border-l3': '#474C62',
      '--dsw-alias-border-l4': '#2E3346',
      '--dsw-alias-border-inverted': '#C9D2E80F',
      '--dsw-alias-border-inverted2': '#C9D2E814',
      // 品牌 / 链接
      '--dsw-alias-brand-primary': '#E3C27E',
      '--dsw-alias-brand-primary-invert': '#E3C27E',
      '--dsw-alias-brand-primary-new-colorprimary-new-color': '#E3C27E',
      '--dsw-alias-brand-text': '#F0D69B',
      '--dsw-alias-link': '#ECD49B',
      // 文字
      '--dsw-alias-label-primary': '#E9ECF5',
      '--dsw-alias-label-primary-bluish': '#E9ECF5',
      '--dsw-alias-label-primary-dimmed': '#D6DCEC',
      '--dsw-alias-label-primary-foreground': '#0A0E1A',
      '--dsw-alias-label-primary-inverted': '#151D2E',
      '--dsw-alias-label-secondary': '#98A2BE',
      '--dsw-alias-label-tertiary': '#7C87A3',
      '--dsw-alias-label-dimmed': '#5A6480',
      '--dsw-alias-label-caption': '#6E7A96',
      '--dsw-alias-label-document-preview': '#C9D2E8',
      // 状态
      '--dsw-alias-state-error-primary': '#E0736F',
      '--dsw-alias-state-error-secondary': '#E88C88',
      '--dsw-alias-state-error-tertiary': '#3A2026',
      '--dsw-alias-state-success-primary': '#6ED0AC',
      '--dsw-alias-state-success-secondary': '#8FE0C1',
      '--dsw-alias-state-success-tertiary': '#17352C',
      '--dsw-alias-state-warn-primary': '#E6B45F',
      '--dsw-alias-state-warn-secondary': '#F0C87F',
      '--dsw-alias-state-warn-tertiary': '#3A2E18',
      '--dsw-alias-state-warn-label': '#E6B45F',
      '--dsw-alias-state-idle-primary': '#5A6480',
      '--dsw-alias-state-business-primary': '#7FA6E0',
      '--dsw-alias-state-business-tertiary': '#1E2C45',
      '--dsw-alias-state-done-primary': '#A79BE0',
      // 按钮
      '--dsw-alias-button-primary-fill': '#E3C27E',
      '--dsw-alias-button-primary-hover': '#F0D69B',
      '--dsw-alias-button-primary-dimmed': '#3B3427',
      '--dsw-alias-button-contrast-fill': '#E9ECF5',
      '--dsw-alias-button-elevated-fill': '#1B2436',
      '--dsw-alias-button-floating-fill': '#141B2B',
      '--dsw-alias-button-floating-hover': '#1A2334',
      '--dsw-alias-button-ghost-active-fill': '#1B2436',
      '--dsw-alias-button-ghost-active-hover': '#26314A',
      '--dsw-alias-button-ghost-active-border': '#5A6480',
      '--dsw-alias-button-tool-bar-fill': '#2A355099',
      '--dsw-alias-button-tool-bar-hover': '#37425F99',
      '--dsw-alias-button-tool-bar-fill-invisible': '#10172896',
      '--dsw-alias-button-info-fill': '#8FB0E6',
      '--dsw-alias-button-info-hover': '#7FA6E0',
      // 交互态
      '--dsw-alias-interactive-bg-hover': '#9AA6C414',
      '--dsw-alias-interactive-bg-active': '#9AA6C424',
      '--dsw-alias-interactive-bg-hover-solid': '#1A2334',
      '--dsw-alias-interactive-bg-hover-accent': '#E3C27E33',
      '--dsw-alias-interactive-bg-hover-danger': '#E0736F26',
      '--dsw-alias-turn-trigger-bg': '#9AA6C414',
      '--dsw-alias-turn-trigger-bg-hover': '#9AA6C424',
      // Markdown
      '--dsw-alias-markdown-code-block': '#0B0F1B',
      '--dsw-alias-markdown-code-block-banner': '#111827',
      '--dsw-alias-markdown-inline-code': '#16203A',
      '--dsw-alias-markdown-tag': '#16203A',
      '--dsw-alias-markdown-citation': '#1A2334',
      '--dsw-alias-markdown-placeholder': '#141B2B',
      '--dsw-alias-markdown-code-segment-selected': '#1A2334',
      '--dsw-alias-markdown-code-segment-unselected': '#0B0F1B',
      // 组件专名
      '--dsw-specific-bubble': '#141B2B',
      '--dsw-specific-bubble-highlight': '#1B2436',
      '--dsw-specific-input-major': '#111827',
      '--dsw-specific-login-input': '#0B0F1B',
      '--dsw-specific-menu': '#1A2334D9',
      '--dsw-specific-selector': '#1A2334',
      '--dsw-specific-sidebar-fill': '#080C16',
      '--dsw-specific-sidebar-nav-item-active': '#1B2436',
      '--dsw-specific-sidebar-nav-item-active-accent': '#151D2E',
      '--dsw-menu-surface-fill': '#1A2334D9',
      '--dsw-alias-menu-group-header-fill': '#1A2334F0',
      '--dsw-alias-menu-icon': '#D6DCEC',
      // 滚动条 / 浮层
      '--dsw-alias-scrollbar-bg-l1': '#2A3550',
      '--dsw-alias-scrollbar-bg-l2': '#37425F',
      '--dsw-alias-scrollbar-hover-l1': '#37425F',
      '--dsw-alias-scrollbar-hover-l2': '#41506F',
      '--dsw-alias-toast-bg': '#1B2436',
      '--dsw-alias-toast-label': '#E9ECF5',
      '--dsw-alias-tooltip-bg': '#1B2436',
      '--dsw-alias-switch-thumb': '#C8D0E4',
      '--dsw-alias-settings-card-fill': '#141B2B',
      '--dsw-alias-settings-card-stroke': '#2A3550',
    };



    // ---- 图标层 ----
    // 契约（宿主文档原文，来自 app.asar 里的 ui-theme 说明）：
    //   ThemeDefinition.icons 把 ui-primitives 的 ICON_SYMBOLS id 映射到「完整的 SVG 文档」，
    //   宿主在 body 开头维护一个隐藏 sprite，用 <symbol> 跟随当前主题的替换、缺省回落到内置。
    //   register 会拒收：未知 id、没有 SVG 命名空间 <svg> 根和 viewBox 的文档、
    //   带 <style>/<script> 的文档、以及不以「<symbol id>-」开头的元素 id。
    //   根上的 width/height/class/aria-hidden 被忽略（尺寸由使用点决定）。
    // 所以这里只用 <path>/<circle>/<rect>，不定义任何 id（自然没有前缀问题），
    // 颜色一律 currentColor，金色点缀用主题自己的 --dsw-alias-brand-primary，
    // 这样图标会跟着配色一起变，不用为两套色板各画一份。
    const SVG_WRAP = (body, width) =>
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" ' +
      'stroke-width="' + width + '" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';

    // 本体按「星穹的语汇」重画：四芒星、星轨环、切角方框，线条比原生细一档。
    const ICON_BODY = {
      // 新会话：一枚四芒星 + 右上角金点（"开拓"的记号）。
      'new-chat-outline':
        '<path d="M7.2 2.6 8.3 7 12.7 8.1 8.3 9.2 7.2 13.6 6.1 9.2 1.7 8.1 6.1 7Z"/>' +
        '<circle cx="13" cy="3.1" r="0.95" fill="var(--dsw-alias-brand-primary)" stroke="none"/>',
      // 搜索：镜片 + 直线柄，不带任何圆角收尾。
      'search-outline': '<circle cx="7" cy="7" r="4.4"/><path d="M10.35 10.35 13.7 13.7"/>',
      // 设置：同心环 + 十字刻度，像一颗被固定在星轨上的星。
      'settings-outline':
        '<circle cx="8" cy="8" r="4.5"/><circle cx="8" cy="8" r="1.6"/>' +
        '<path d="M8 1.5v1.9M8 12.6v1.9M1.5 8h1.9M12.6 8h1.9"/>',
      // 侧栏开关：切角方框，中缝是金色——一眼能看出"这一侧可收"。
      'panel-left-outline':
        '<rect x="1.9" y="2.7" width="12.2" height="10.6" rx="2.3"/>' +
        '<path d="M6.4 2.7v10.6" stroke="var(--dsw-alias-brand-primary)" stroke-opacity="0.75"/>',
      'plus-outline': '<path d="M8 3.3v9.4M3.3 8h9.4"/>',
      // 更多：三点改成三颗小星（实心，16px 下比描边点更清楚）。
      'ellipsis-outline':
        '<circle cx="3.7" cy="8" r="1.15" fill="currentColor" stroke="none"/>' +
        '<circle cx="8" cy="8" r="1.15" fill="currentColor" stroke="none"/>' +
        '<circle cx="12.3" cy="8" r="1.15" fill="currentColor" stroke="none"/>',
      'check-outline': '<path d="M2.7 8.5 6.2 12 13.3 4.2"/>',
      // 分支：三个节点 + 一条上扬的弧，比原生的直线折角更软。
      'branch-outline':
        '<circle cx="4.4" cy="3.9" r="1.7"/><circle cx="4.4" cy="12.1" r="1.7"/>' +
        '<circle cx="11.6" cy="6.1" r="1.7"/>' +
        '<path d="M4.4 5.6v4.8"/><path d="M6.1 4.1c3.2 0 5.5.5 5.5 2"/>',
      // 用户：头肩轮廓。
      'user-outline':
        '<circle cx="8" cy="5.5" r="2.7"/>' +
        '<path d="M2.9 13.7c0-2.7 2.3-4.5 5.1-4.5s5.1 1.8 5.1 4.5"/>',
      // 插件：淡星轨环 + 正中一枚金色菱形（"一个挂在轨道上的模块"）。
      'plugin-pinwheel-outline':
        '<circle cx="8" cy="8" r="5.8" stroke-opacity="0.45"/>' +
        '<path d="M10.6 5.4 9 9 5.4 10.6 7 7Z" fill="var(--dsw-alias-brand-primary)" stroke="none"/>',
      // 自动化任务：钟面 + 双耳。
      'alarm-clock-outline':
        '<circle cx="8" cy="8.6" r="4.6"/><path d="M8 6.2v2.6l1.8 1.1"/>' +
        '<path d="M3.9 2.9 2.4 4.4M12.1 2.9l1.5 1.5"/>',
      // 插件市场：四宫格 + 加号。
      'apps-add-outline':
        '<rect x="2.3" y="2.3" width="4.2" height="4.2" rx="1"/>' +
        '<rect x="2.3" y="9.5" width="4.2" height="4.2" rx="1"/>' +
        '<rect x="9.5" y="9.5" width="4.2" height="4.2" rx="1"/>' +
        '<path d="M11.6 1.9v5M9.1 4.4h5"/>',
      // 双滑杆（设置里的个性化/紧凑度一类）。
      'sliders-two-outline':
        '<path d="M2.2 5.2h5.6M12 5.2h1.8"/><circle cx="9.9" cy="5.2" r="1.5"/>' +
        '<path d="M2.2 10.8h1.8M8.4 10.8h5.4"/><circle cx="6.3" cy="10.8" r="1.5"/>',
      // ---- 第二批：日常操作图标 ----
      // 发送：一道斜上的轨迹 + 金色起点，像"离站"的矢量，而不是普通箭头。
      'right-up-outline':
        '<path d="M3.3 12.7 12.3 3.7"/><path d="M7 3.7h5.3v5.3"/>' +
        '<circle cx="3.3" cy="12.7" r="1.05" fill="var(--dsw-alias-brand-primary)" stroke="none"/>',
      // 附件：回形针，折角收尾干净。
      'paperclip-outline':
        '<path d="M10.9 5.2 6 10.1a1.9 1.9 0 0 0 2.7 2.7l5.2-5.2a3.3 3.3 0 0 0-4.7-4.7' +
        'L3.9 8.2"/>',
      'close-outline': '<path d="M3.4 3.4 12.6 12.6M12.6 3.4 3.4 12.6"/>',
      // 复制：两个切角方框，后面的那个只画两条边——星穹的"叠层"画法。
      'copy-outline':
        '<rect x="5.4" y="5.4" width="8.2" height="8.2" rx="1.7"/>' +
        '<path d="M10.6 3.4H3.6a1 1 0 0 0-1 1v7"/>',
      // 刷新：一段星轨弧 + 箭头，弧不满圆，留一个缺口。
      'refresh-outline':
        '<path d="M13 8a5 5 0 1 1-1.8-3.85"/><path d="M13.3 2.7v3.2h-3.2"/>',
      // 思考：四芒星 + 外侧虚线星轨，表示"还在算"。
      'think-outline':
        '<path d="M8 2.9 8.9 6.6 12.6 7.5 8.9 8.4 8 12.1 7.1 8.4 3.4 7.5 7.1 6.6Z"/>' +
        '<path d="M2.5 11.7a6.2 6.2 0 0 0 3.2 2.5" stroke-opacity="0.55" stroke-dasharray="1 1.6"/>',
      // 删除：桶身 + 顶盖，桶身用两条斜线收窄。
      'trash-outline':
        '<path d="M2.9 4.6h10.2"/><path d="M6.3 4.6V3.2h3.4v1.4"/>' +
        '<path d="M4.5 4.6l.7 8.2a1 1 0 0 0 1 .9h3.6a1 1 0 0 0 1-.9l.7-8.2"/>',
      // 打开文件夹：前板斜切，是"被抽出来的抽屉"。
      'folder-open-outline':
        '<path d="M2.3 12.3V4.2a1 1 0 0 1 1-1h2.9l1.4 1.7h5a1 1 0 0 1 1 1v1.2"/>' +
        '<path d="M2.3 12.3 4 7.6h10.1l-1.7 4.7Z"/>',
      // 目标：同心环 + 四向刻度。
      'goal-outline':
        '<circle cx="8" cy="8" r="5.4"/><circle cx="8" cy="8" r="2.1"/>' +
        '<path d="M8 1.3v1.5M8 13.2v1.5M1.3 8h1.5M13.2 8h1.5"/>',
      // 技能：六边形外壳 + 内部四芒星。
      'skill-outline':
        '<path d="M8 2.2 13 5.1v5.8L8 13.8 3 10.9V5.1Z"/>' +
        '<path d="M8 6.1 8.55 7.45 9.9 8 8.55 8.55 8 9.9 7.45 8.55 6.1 8 7.45 7.45Z" ' +
        'fill="var(--dsw-alias-brand-primary)" stroke="none"/>',
      // 浅色/深色/跟随系统：太阳、月牙、半明半暗。
      'light-outline':
        '<circle cx="8" cy="8" r="3.1"/>' +
        '<path d="M8 1.6v1.5M8 12.9v1.5M1.6 8h1.5M12.9 8h1.5' +
        'M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M12.4 3.6l-1.05 1.05M4.65 11.35 3.6 12.4"/>',
      'dark-outline':
        '<path d="M12.7 9.7A5.5 5.5 0 0 1 6.3 3.3a5.6 5.6 0 1 0 6.4 6.4Z"/>',
      'chevrons-up-down-outline':
        '<path d="M4.7 6.3 8 3l3.3 3.3"/><path d="M4.7 9.7 8 13l3.3-3.3"/>',
      // 固定：图钉，针脚是金色。
      'pin-outline':
        '<path d="M6.1 2.7h3.8l-.55 3.3 1.95 2.15H4.7l1.95-2.15Z"/>' +
        '<path d="M8 8.15v5.1" stroke="var(--dsw-alias-brand-primary)"/>',
    };

    /** 每个字形都出 regular / medium 两档，避免切换字重时图标"跳"回原生。 */
    const buildIcons = () => {
      const icons = {};
      for (const [glyph, body] of Object.entries(ICON_BODY)) {
        icons['dsw-icon-' + glyph + '-regular'] = SVG_WRAP(body, 1.2);
        icons['dsw-icon-' + glyph + '-medium'] = SVG_WRAP(body, 1.35);
      }
      return icons;
    };

    const ICONS = buildIcons();
    const VERSION = '1.1.0';

// ---- 二相乐园的"物件" ----
// 面具那一版被否掉了（用户：抓不住重点），相关 SVG 与伪元素一并撤除，
// 这里只留一条注释，免得以后又有人想把它加回来。

    /**
     * 只有一个模式：night。
     * 曾经有 night / off 两个状态，off 会把 dataset.astral 摘掉、整套装饰消失，
     * 而用户往往不知道自己按了什么。现在干脆取消"关闭"：主题要么被插件管理器
     * 停用，要么就是开着的。历史遗留的 off 标记在这里顺手清掉。
     */
    const readMode = () => {
      try {
        if (localStorage.getItem(AUTO_KEY) === 'off') localStorage.removeItem(AUTO_KEY);
        if (localStorage.getItem(MODE_KEY) === 'off') localStorage.setItem(MODE_KEY, 'night');
      } catch (err) { /* 隐私模式/被禁用，无所谓 */ }
      return 'night';
    };

    /**
     * 星空瓦片：480×480 的 SVG，随机撒点。用 JS 生成而不是手写，是因为
     * 手写的几十个坐标改一次就得重排一次，而且看不出密度对不对。
     * 线性同余的种子是固定的，所以每次构建出来的星图完全一样——
     * 星点是背景，不该每次刷新都换一个星座。
     */
    const buildStarfield = (fill, alpha) => {
      let seed = 20261109;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      let svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">';
      for (let i = 0; i < 120; i += 1) {
        const cx = (rand() * 480).toFixed(1);
        const cy = (rand() * 480).toFixed(1);
        const r = (0.35 + rand() * 0.85).toFixed(2);
        const o = (alpha + rand() * 0.45).toFixed(2);
        svg +=
          '<circle cx="' +
          cx +
          '" cy="' +
          cy +
          '" r="' +
          r +
          '" fill="' +
          fill +
          '" opacity="' +
          o +
          '"/>';
      }
      // 三颗四芒星：只有星点在均匀分布时会显得像噪点，几颗大的才让它像"星图"。
      const sp = [
        [96, 132, 7],
        [318, 74, 9],
        [402, 366, 6],
      ];
      for (const [x, y, s] of sp) {
        svg +=
          '<path d="M' + x + ' ' + (y - s) + 'L' + (x + s * 0.22) + ' ' + (y - s * 0.22) +
          'L' + (x + s) + ' ' + y + 'L' + (x + s * 0.22) + ' ' + (y + s * 0.22) +
          'L' + x + ' ' + (y + s) + 'L' + (x - s * 0.22) + ' ' + (y + s * 0.22) +
          'L' + (x - s) + ' ' + y + 'L' + (x - s * 0.22) + ' ' + (y - s * 0.22) +
          'Z" fill="' + fill + '" opacity="' + (alpha + 0.3).toFixed(2) + '"/>';
      }
      svg += '</svg>';
      return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
    };

    const STARFIELD_NIGHT = buildStarfield('#FFFFFF', 0.22);

    /**
     * 星盘：同心圆 + 72 格刻度 + 四方位四芒星。
     * 这是整套主题里唯一一件"画出来的东西"，也是最能一眼认出星穹的元素——
     * 星穹的界面里到处都是这种带刻度的圆盘（列车时刻盘、星图、干员面板）。
     * 刻度用 for 循环生成，改密度只要改一个数字。
     */
    const buildCompass = () => {
      const gold = '#E3C27E';
      const parts = [
        '<circle cx="300" cy="300" r="286" stroke="' + gold + '" stroke-opacity="0.55"/>',
        '<circle cx="300" cy="300" r="252" stroke="' + gold +
          '" stroke-opacity="0.35" stroke-dasharray="2 7"/>',
        '<circle cx="300" cy="300" r="196" stroke="' + gold + '" stroke-opacity="0.22"/>',
      ];
      for (let i = 0; i < 72; i += 1) {
        const angle = (i * 5 * Math.PI) / 180;
        const inner = i % 6 === 0 ? 264 : 274;
        const x1 = (300 + Math.cos(angle) * inner).toFixed(1);
        const y1 = (300 + Math.sin(angle) * inner).toFixed(1);
        const x2 = (300 + Math.cos(angle) * 286).toFixed(1);
        const y2 = (300 + Math.sin(angle) * 286).toFixed(1);
        parts.push(
          '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + gold +
            '" stroke-opacity="' + (i % 6 === 0 ? 0.5 : 0.3) + '"/>',
        );
      }
      for (let i = 0; i < 12; i += 1) {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = (300 + Math.cos(angle) * 200).toFixed(1);
        const y1 = (300 + Math.sin(angle) * 200).toFixed(1);
        const x2 = (300 + Math.cos(angle) * 248).toFixed(1);
        const y2 = (300 + Math.sin(angle) * 248).toFixed(1);
        parts.push(
          '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + gold +
            '" stroke-opacity="0.16"/>',
        );
      }
      // 四方位的大四芒星：盘面上真正"读得出来"的记号。
      for (let i = 0; i < 4; i += 1) {
        const angle = (i * 90 * Math.PI) / 180;
        const cx = 300 + Math.cos(angle) * 222;
        const cy = 300 + Math.sin(angle) * 222;
        const s = i % 2 === 0 ? 16 : 11;
        parts.push(
          '<path d="M' + cx + ' ' + (cy - s) + 'L' + (cx + s * 0.2) + ' ' + (cy - s * 0.2) +
            'L' + (cx + s) + ' ' + cy + 'L' + (cx + s * 0.2) + ' ' + (cy + s * 0.2) +
            'L' + cx + ' ' + (cy + s) + 'L' + (cx - s * 0.2) + ' ' + (cy + s * 0.2) +
            'L' + (cx - s) + ' ' + cy + 'L' + (cx - s * 0.2) + ' ' + (cy - s * 0.2) +
            'Z" fill="' + gold + '" fill-opacity="0.6"/>',
        );
      }
      parts.push(
        '<circle cx="300" cy="300" r="7" stroke="' + gold + '" stroke-opacity="0.5"/>',
        '<path d="M300 282L304 296L318 300L304 304L300 318L296 304L282 300L296 296Z" fill="' +
          gold + '" fill-opacity="0.5"/>',
      );
      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" ' +
        'fill="none">' + parts.join('') + '</svg>';
      return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
    };

    const COMPASS = buildCompass();

    const writeMode = (mode) => {
      try {
        localStorage.setItem(MODE_KEY, mode);
        // 显式切换等于重新表态：清掉 AUTO_KEY 的 'off'，否则 readMode 永远返回 off。
        localStorage.setItem(AUTO_KEY, 'on');
      } catch (err) {
        console.warn('[astral] 模式未写入：', err);
      }
    };

    const cssBlock = (selector, tokens) =>
      selector +
      '{' +
      Object.entries(tokens)
        .map(([name, value]) => name + ':' + value + ';')
        .join('') +
      '}';

    return {
      inject: ['theme'],
      apply(ctx) {
        const disposers = [];
        const root = document.documentElement;

        // 这里原有一版"版本变了就 location.reload() 自愈"，已删除：
      // 一旦 localStorage 不可用或刷新过程中又读到旧版本，就会变成刷新循环，
      // 表现为应用反复重启甚至起不来。宁可让图标晚一轮回来，也不冒这个险。

        const state = { night: false };

        // 实例身份：热重载会同时存在新旧两个实例，必须知道谁是"当前那个"。
        const OWNER = 'astral-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        try { window.__dshAstralOwner = OWNER; } catch (err) { /* 忽略 */ }
        const stillOwner = () => {
          try { return window.__dshAstralOwner === OWNER; } catch (err) { return true; }
        };
        let retries = 0;
        let slowRetries = 0;
        let retryTimer = 0;

        /**
         * 注册一个主题条目。同 id 已被占用（热重载时旧实例还没卸载）不抛异常，
         * 交给 ensureRegistered 重试，否则一次让位就再也回不来。
         */
        const take = (definition) => {
          const themes = (ctx.theme.getTheme() && ctx.theme.getTheme().themes) || [];
          if (themes.some((theme) => theme && theme.id === definition.id)) return false;
          try {
            disposers.push(ctx.theme.register(definition));
            return true;
          } catch (err) {
            console.warn('[astral] 注册失败，稍后重试：' + definition.id, err);
            return false;
          }
        };

        const withIcons = (definition) => Object.assign({ icons: ICONS }, definition);

        /** 当前模式需要的那一套是否已经在自己手里。 */
        const owned = (id) => id === NIGHT_ID && state.night;

        // 宿主会把 icons 当成**一整包**来校验：表里只要有一个未知字形，整套被拒。
        // 所以先试全量，被拒就退到"v0.9.0 那 13 个已经跑通过的"，再被拒才放弃图标。
        const CORE_GLYPHS = [
          'new-chat', 'settings', 'panel-left', 'plugin-pinwheel', 'search', 'plus',
          'ellipsis', 'check', 'branch', 'user', 'alarm-clock', 'apps-add', 'sliders-two',
        ];
        const CORE_ICONS = Object.keys(ICONS).reduce((acc, key) => {
          const glyph = key.replace(/^dsw-icon-/, '').replace(/-(regular|medium)$/, '');
          if (CORE_GLYPHS.indexOf(glyph) >= 0) acc[key] = ICONS[key];
          return acc;
        }, {});
        const registerWith = (id, colorScheme, tokens) =>
          take({ id, colorScheme, tokens, icons: ICONS }) ||
          take({ id, colorScheme, tokens, icons: CORE_ICONS }) ||
          take({ id, colorScheme, tokens });

        /** 有限次重试（300ms × 12 ≈ 3.6 秒），盖住旧实例的卸载窗口。 */
        const ensureRegistered = () => {
          // 带图标注册被拒（比如宿主升级后某个字形被删）时退回纯配色注册，
          // 宁可掉图标也不能整块主题消失——色板才是主体。
          if (!state.night) {
            state.night = registerWith(NIGHT_ID, 'dark', NIGHT);
          }
          // 只要"当前模式需要的那一套"到手就落地上色，不等两个都注册完。
          if (owned(desiredId())) {
            paint();
            reassert();
            return true;
          }
          if (retries < 12) {
            retries += 1;
            retryTimer = setTimeout(ensureRegistered, 300);
            return false;
          }
          // 3.6 秒还没轮到我们，说明旧实例一直没卸载（保存即热重载的常态）。
          // 再按 3 秒一次慢慢试，直到页面刷新——图标只能靠注册，拿不到就是没有。
          if (slowRetries < 40) {
            slowRetries += 1;
            retryTimer = setTimeout(ensureRegistered, 3000);
          }
          return false;
        };

        // ---- 图像层：自绘徽记 ----
        // 前面十几版改的都是宿主的线、色、圆角，再怎么调也还是"网页换皮"。
        // 这一层换成真图：一枚星穹铁道式的四芒星徽记（轨道环 + 内层白色星心），
        // 直接盖在宿主的位图 logo 上，并把品牌字换成"星穹列车"。
        const svgUri = svg => 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';

      // 侧栏"线路图"：一条竖轨 + 每隔 96px 一个站点环。
      // 它是背景层的一部分，不占布局、不会被内容压住，所以不会跟文字打架。
      const routeSvg = color =>
        svgUri('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="96" viewBox="0 0 40 96">' +
          '<path d="M20 0V96" stroke="' + color + '" stroke-width="1"/>' +
          '<circle cx="20" cy="48" r="4.6" fill="none" stroke="' + color + '" stroke-width="1"/>' +
          '<circle cx="20" cy="48" r="1.2" fill="' + color + '"/>' +
          '</svg>');
      const ROUTE_GOLD = routeSvg('rgba(227,194,126,0.22)');
      const ROUTE_NEON = routeSvg('rgba(255,45,126,0.26)');

        const EMBLEM_SVG =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
          '<circle cx="24" cy="24" r="21" fill="none" stroke="#E3C27E" stroke-opacity="0.55" stroke-width="1"/>' +
          '<circle cx="24" cy="24" r="16.2" fill="none" stroke="#E3C27E" stroke-opacity="0.26" ' +
          'stroke-width="0.8" stroke-dasharray="1.6 4.2"/>' +
          '<path d="M24 5.5 26.7 21.3 42.5 24 26.7 26.7 24 42.5 21.3 26.7 5.5 24 21.3 21.3Z" fill="#E3C27E"/>' +
          '<path d="M24 14.6 25.3 22.7 33.4 24 25.3 25.3 24 33.4 22.7 25.3 14.6 24 22.7 22.7Z" fill="#FFF4D8"/>' +
          '</svg>';

        const EMBLEM = svgUri(EMBLEM_SVG);

        // ---- 星云底图 ----
        // 真正的"画面"：四团斜向交叠的气体云，蓝、紫、青、暖金各一团，
        // 用径向渐变边缘化开，接缝处互相叠色，所以看着是连续的雾而不是四个圆。
        // 它铺在对话列最底层（背景层列表的最后一个），上面还有星点、轨道弧和辉光。
        const buildNebula = (a, b, c, d, floor) =>
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" ' +
          'preserveAspectRatio="xMidYMid slice">' +
          '<rect width="1600" height="1000" fill="' + floor + '"/>' +
          '<defs>' +
          '<radialGradient id="n1"><stop offset="0" stop-color="' + a + '" stop-opacity="0.85"/>' +
          '<stop offset="0.45" stop-color="' + a + '" stop-opacity="0.34"/>' +
          '<stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="n2"><stop offset="0" stop-color="' + b + '" stop-opacity="0.78"/>' +
          '<stop offset="0.5" stop-color="' + b + '" stop-opacity="0.28"/>' +
          '<stop offset="1" stop-color="' + b + '" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="n3"><stop offset="0" stop-color="' + c + '" stop-opacity="0.62"/>' +
          '<stop offset="0.5" stop-color="' + c + '" stop-opacity="0.22"/>' +
          '<stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="n4"><stop offset="0" stop-color="' + d + '" stop-opacity="0.55"/>' +
          '<stop offset="0.55" stop-color="' + d + '" stop-opacity="0.16"/>' +
          '<stop offset="1" stop-color="' + d + '" stop-opacity="0"/></radialGradient>' +
          '</defs>' +
          '<ellipse cx="1130" cy="150" rx="760" ry="540" fill="url(#n1)" ' +
          'transform="rotate(-18 1130 150)"/>' +
          '<ellipse cx="330" cy="880" rx="680" ry="470" fill="url(#n2)" ' +
          'transform="rotate(12 330 880)"/>' +
          '<ellipse cx="960" cy="720" rx="560" ry="360" fill="url(#n3)" ' +
          'transform="rotate(-8 960 720)"/>' +
          '<ellipse cx="1440" cy="560" rx="330" ry="240" fill="url(#n4)" ' +
          'transform="rotate(20 1440 560)"/>' +
          '</svg>';

        const NEBULA_NIGHT = svgUri(buildNebula('#2C4FA8', '#5C2F96', '#0F5F70', '#9A7430', '#070A13'));

        // 对话区底图：从用户截下来的星穹聊天界面里取色、按同样的星点密度重建的一张 1600x900 星云图。
        // 以 base64 内联——客户端插件的 CSS 里写相对路径是相对文档解析的，拿不到包内文件。
        const BG_NIGHT = 'url("data:image/jpeg;base64,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")';

        // 晨昏底图：夜航那张星云反相、压成米白纸纹，再回叠一点暖金。
        // 和夜航同一套结构，所以两套切换时画面的构图是连续的。
        // 做法是高通滤波（局部背景 - 原图）取线条，阈值做成 alpha，再染成金色；
        // 原图里徽记下缘本来就被面板切掉了，所以这里也保持被裁的样子。
        const EMBLEM_WM = 'url("data:image/png;base64,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")';

        // 同一个色板再走一遍 CSS：宿主只保证别名层落地，组件专名（气泡、输入框、
        // 菜单、滚动条）不一定被应用，这里用同一份数据兜底，值完全一致不会打架。
        const css = [
          'html[data-astral="' + NIGHT_ID + '"]{color-scheme:dark;' +
            '--astral-select:rgba(227,194,126,0.30);' +
            '--astral-msg-bg:#141E33;' +
            '--astral-msg-border:rgba(227,194,126,0.30);' +
            '--astral-msg-accent:rgba(227,194,126,0.62);' +
            '--astral-composer-edge:rgba(227,194,126,0.32);' +
            '--astral-glass:#0B1220;' +
            '--astral-bg-photo:' + BG_NIGHT + ';' +
            '--astral-frame:#1A2337;' +
            '--astral-frame-line:rgba(227,194,126,0.22);' +
            '--astral-composer-sheen:rgba(227,194,126,0.055);' +
            '--astral-rivet:rgba(227,194,126,0.72);' +
            '--astral-divider:rgba(227,194,126,0.16);' +
            '--astral-divider-strong:rgba(227,194,126,0.42);' +
            '--astral-msg-sheen:rgba(227,194,126,0.055);' +
            '--astral-dust:rgba(255,255,255,0.055);' +
            '--astral-glow-a:rgba(227,194,126,0.055);' +
            '--astral-glow-b:rgba(122,155,240,0.05);' +
            '--astral-sidebar-wash:rgba(227,194,126,0.045);' +
            '--astral-hover:rgba(227,194,126,0.075);' +
            '--astral-active:rgba(227,194,126,0.10);' +
            '--astral-focus:rgba(227,194,126,0.55);' +
            '--astral-focus-glow:rgba(227,194,126,0.45);' +
            '--astral-brand-glow:rgba(227,194,126,0.32);' +
            '--astral-user-bg:#1B2130;--astral-user-border:rgba(227,194,126,0.28);' +
            '--astral-user-sheen:rgba(227,194,126,0.06);' +
            '--astral-user-topline:rgba(227,194,126,0.16);' +
            '--astral-quote:rgba(227,194,126,0.05);--astral-code-bg:#0D1220;' +
            '--astral-code-border:rgba(227,194,126,0.20);--astral-code-fg:#E8C98F;' +
            '--astral-th-bg:rgba(227,194,126,0.06);' +
            '--astral-ring:rgba(227,194,126,0.12);--astral-scroll:rgba(227,194,126,0.16);' +
            '--astral-scroll-hover:rgba(227,194,126,0.30);' +
            '--astral-inner-rule:rgba(227,194,126,0.10);' +
            '--astral-orbit:rgba(227,194,126,0);' +
            '--astral-scrim-top:rgba(10,14,26,0.52);' +
            '--astral-scrim-bot:rgba(8,11,20,0.74);' +
            '--astral-hud-line:rgba(227,194,126,0.58);' +
            '--astral-wash-a:rgba(96,74,168,0.30);' +
            '--astral-wash-b:rgba(200,160,80,0.26);' +
            '--astral-nebula-a:rgba(58,92,178,0.22);' +
            '--astral-nebula-b:rgba(122,84,190,0.16)}',
          cssBlock('html[data-astral="' + NIGHT_ID + '"] body', NIGHT),
          // 正文承载面：助手消息不再直接压在页底上，避免和背景糊成一片。
          // 底色比 bg-base 高出一整级（#141E33 vs #0A0E1A），否则只差 5 个值，屏幕上根本看不出来。
          // 金边一律用 1px：0.5px 在 DPR 1.25/1.5 的屏幕上会被抗锯齿摊成 ~0.4 个物理像素，
          // 再叠 20% 透明度就等于不可见——之前"没有金边"就是这么来的。
          // 卡片上缘一道极淡的金色高光：纯色块太"塑"，加一层几乎看不见的渐变就有"材质"感。
          'html[data-astral] [data-chat-flow-kind^="assistant"]{' +
            'background-color:var(--astral-msg-bg);' +
            'background-image:linear-gradient(180deg,var(--astral-msg-sheen),transparent 46%);' +
            'color:var(--astral-msg-text,var(--dsw-alias-label-primary));' +
            'border:1px solid var(--astral-msg-border);' +
            'border-left:2px solid var(--astral-msg-accent);' +
            'border-radius:14px;' +
            'padding:14px 18px;' +
            'box-shadow:0 18px 40px -32px rgba(0,0,0,0.9);' +
            '}',
          // 输入框卡片：一圈实心金边，和页底拉开一道明确的边界。
          // .GRgSLq_card 取自宿主样式表（输入框卡片），类名带哈希，找不到时只是不生效。
          'html[data-astral] .GRgSLq_card{' +
            'box-shadow:0 0 0 1px var(--astral-composer-edge),0 12px 32px -24px rgba(0,0,0,0.85);' +
            '}',
          // ---- 用户气泡 ----
          // 助手卡片是"左侧竖金条 + 冷调深底"，用户气泡就镜像成"右侧竖金条 + 暖调底"，
          // 同一套语言、方向相反，一眼能分出谁在说话，又不需要头像。
          'html[data-astral] [data-message-bubble],' +
            'html[data-astral] .rhSLKq_bubble{' +
            'background:linear-gradient(180deg,var(--astral-user-sheen),transparent 62%),' +
            'var(--astral-user-bg);' +
            'border:1px solid var(--astral-user-border);' +
            'box-shadow:inset -2px 0 0 var(--astral-msg-accent),' +
            'inset 0 1px 0 var(--astral-user-topline),0 14px 30px -26px rgba(0,0,0,0.85);' +
            'border-radius:14px 14px 4px 14px;' +
            '}',
          // 横向分隔线（会话与输入框之间那条）：用金，而不是默认的冷灰。
          'html[data-astral] hr{' +
            'border:0;border-top:1px solid var(--astral-divider);' +
            '}',
          'html[data-astral] ::selection{background:var(--astral-select);color:inherit}',
          'html[data-astral] :focus-visible{outline-color:var(--dsw-alias-brand-primary)}',
          // ---- 侧栏分区 ----
          // 侧栏外框模块（mP3x-q_*）与内容根（wtg9ga_*）的类名带构建哈希，跨版本会变，
          // 所以这里一律用「类名后缀」属性选择器（[class*="_xxx"]），改版后最多是不生效，
          // 不会把别的元素误伤成一片金框。
          // 分区线用 border-image 做成两端渐隐：同样 1px，但不再是"一刀切"的硬线。
          // 硬线 + 满格透明度就是"生硬"的来源，头部 0 尾部 0 的渐变能让线自己收进背景里。
          'html[data-astral] [class*="_sidebarCol"]{' +
            'border-right:1px solid transparent;' +
            'border-image:linear-gradient(180deg,transparent 0,rgba(227,194,126,0.46) 14%,' +
            'rgba(227,194,126,0.46) 86%,transparent) 1;' +
            '}',
          // 工作区区块（sidebar.workspaces 槽）：上缘一道金线，和上方导航区分开。
          'html[data-astral] [class*="_regionArea"]{' +
            'border-top:1px solid transparent;' +
            'border-image:linear-gradient(90deg,transparent,rgba(227,194,126,0.30) 16%,' +
            'rgba(227,194,126,0.30) 84%,transparent) 1;' +
            '}',
          // 左下角底部区（sidebar.footer.action + sidebar.settings 槽，头像/账号就落在这里）：
          // 用更亮一档的金线，让这块"底盘"独立成一个区域。
          'html[data-astral] [class*="_footArea"]{' +
            'border-top:1px solid transparent;' +
            'border-image:linear-gradient(90deg,transparent,rgba(227,194,126,0.46) 16%,' +
            'rgba(227,194,126,0.46) 84%,transparent) 1;' +
            '}',
          // ---- 材质层 ----
          // 星尘 + 两团极淡的辉光。点阵用 72px 的平铺小圆点，全屏不动，
          // 远看是"深空有颗粒"，近看才认得出是点——直接画星星会像贴纸。
          // 三块都要写：宿主给 centerCol / sidebarCol 各刷了一层不透明底色，只改 body 会被盖住。
          'html[data-astral] body,html[data-astral] [class*="_centerCol"],' +
            'html[data-astral] [class*="_sidebarCol"]{' +
            'background-image:' +
            'radial-gradient(circle at 50% 50%,var(--astral-dust) 0.6px,transparent 1.1px),' +
            'radial-gradient(1100px 560px at 72% -8%,var(--astral-glow-a),transparent 62%),' +
            'radial-gradient(820px 480px at 6% 106%,var(--astral-glow-b),transparent 66%);' +
            'background-size:72px 72px,100% 100%,100% 100%;' +
            '}',
          // 侧栏顶部再压一道向下的金色雾——星穹的侧栏都是"上亮下沉"的。
          'html[data-astral] [class*="_sidebarCol"]{' +
            'background-image:var(--astral-mark,none),var(--astral-route),' +
            'linear-gradient(180deg,var(--astral-sidebar-wash),transparent 240px),' +
            'radial-gradient(circle at 50% 50%,var(--astral-dust) 0.6px,transparent 1.1px),' +
            'radial-gradient(1100px 560px at 72% -8%,var(--astral-glow-a),transparent 62%);' +
            'background-size:132px 132px,40px 96px,100% 100%,72px 72px,100% 100%;' +
            'background-repeat:no-repeat,repeat-y,no-repeat,repeat,no-repeat;' +
            'background-position:center calc(100% - 96px),9px 0,0 0,0 0,0 0;' +
            'opacity:1;' +
            '}',
          // ---- 状态层 ----
          // 星穹的侧栏选中不是"整块高亮"，而是一条金条 + 一层向右淡出的雾。
          // 这里用 inset 阴影立左条，比 border-left 稳：不改变布局宽度，选中时文字不会横跳。
          'html[data-astral] [class*="_panelRow"],html[data-astral] [class*="_sessionRow"]{' +
            'border-radius:8px;transition:background-color .16s ease,box-shadow .16s ease;' +
            '}',
          'html[data-astral] [class*="_panelRow"]:hover,' +
            'html[data-astral] [class*="_sessionRow"]:hover{' +
            'background-image:linear-gradient(90deg,var(--astral-hover),transparent 94%);' +
            '}',
          'html[data-astral] [class*="_panelActive"]{' +
            'background-image:linear-gradient(90deg,var(--astral-active),transparent 94%);' +
            'box-shadow:inset 2px 0 0 var(--astral-divider-strong);' +
            '}',
          // 输入框聚焦：金边亮一档 + 一圈很散的外发光，像"星核启动"。
          // 用 :focus-within 是因为真正的焦点在里面的 textarea 上，卡片本身不聚焦。
          'html[data-astral] .GRgSLq_card:focus-within{' +
            'box-shadow:0 0 0 1px var(--astral-focus),0 0 24px -10px var(--astral-focus-glow),' +
            '0 12px 32px -24px rgba(0,0,0,0.85);' +
            '}',
          // 主按钮（金色底、深色字）：hover 提亮、按下压暗，别让它看起来是张静态图。
          'html[data-astral] .jrmgQW_primaryButton{transition:filter .14s ease}',
          'html[data-astral] .jrmgQW_primaryButton:hover{filter:brightness(1.06)}',
          'html[data-astral] .jrmgQW_primaryButton:active{filter:brightness(0.95)}',
          // 表格/列表里的当前行也给一点点金，不然在深空底上几乎看不出选没选。
          'html[data-astral] [aria-selected="true"]{' +
            'box-shadow:inset 2px 0 0 var(--astral-divider-strong);' +
            '}',
          // ---- 品牌区 ----
          // 侧栏顶部那块是唯一还完全原生的地方。三道：一条金线把"品牌"和"导航"切开，
          // HARNESS 小牌从白底硬块改成描边牌，logo 后面加一层极淡的金色晕。
          'html[data-astral] [class*="_logoRow"]{' +
            'border-bottom:1px solid transparent;' +
            'border-image:linear-gradient(90deg,transparent 0,rgba(227,194,126,0.26) 12%,' +
            'rgba(227,194,126,0.26) 88%,transparent) 1;' +
            '}',
          // 原生是"白底 + 深字"的实心块，在深空底上像贴了张纸。改成描边牌：只留一圈细金边。
          'html[data-astral] [class*="_buildVersion"]{' +
            'background:transparent;color:var(--dsw-alias-brand-primary);' +
            'box-shadow:inset 0 0 0 1px var(--astral-msg-border);' +
            'border-radius:3px;letter-spacing:0.14em;padding:0 4px;font-size:9px;line-height:14px;' +
            '}',
          // logo 本身是位图/svg 混合，改不了它的内容——但可以把它盖掉：
          // 容器开 relative，::after 铺满整格，放我们自己的徽记。
          // 尺寸跟着容器走（contain），宿主换成多大都不变形。
          'html[data-astral] [class*="_brandMark"]{' +
            'position:relative;' +
            'filter:drop-shadow(0 0 8px var(--astral-brand-glow));' +
            '}',
          'html[data-astral] [class*="_brandMark"]::after{' +
            'content:"";position:absolute;inset:0;' +
            'background:' + EMBLEM + ' center/contain no-repeat;' +
            'pointer-events:none;' +
            '}',
          // 品牌字不再改动：用户要求删掉"星穹列车"，恢复宿主原本的 deepseek HARNESS。
          // （原先用 font-size:0 + ::after content 覆写，现整段移除。）
          // ---- 会话头部 ----
          // 标题栏下缘的 0.5px 灰线换成一整条渐隐金线；选中的 tab 从蓝改成金，
          // 让整个界面只剩"金 + 深空"两个色，不再有第二种强调色抢戏。
          // 一次性收口：所有"页头 / tab 条 / 页脚条"共用同一条渐隐金线，
          // 不再每个模块写一份。角色选择器按语义抓，不按哈希抓。
          'html[data-astral] [class*="_header"],' +
          'html[data-astral] [class*="_detailTabsBar"],' +
          'html[data-astral] [class*="_detailsHeader"]{' +
            'border-bottom:1px solid transparent;' +
            'border-image:linear-gradient(90deg,transparent 0,rgba(227,194,126,0.30) 8%,' +
            'rgba(227,194,126,0.30) 92%,transparent) 1;' +
            '}',
          'html[data-astral] [class*="_footerBar"],' +
          'html[data-astral] [class*="_saveFooter"]{' +
            'border-top:1px solid transparent;' +
            'border-image:linear-gradient(90deg,transparent 0,rgba(227,194,126,0.26) 8%,' +
            'rgba(227,194,126,0.26) 92%,transparent) 1;' +
            '}',
          // 左右分栏的竖线（详情面板、表格列）同样收口到一处。
          'html[data-astral] [class*="_detail"],' +
          'html[data-astral] [class*="_column"]+[class*="_column"],' +
          'html[data-astral] [class*="_cell"]+[class*="_cell"]{' +
            'border-left:1px solid transparent;' +
            'border-image:linear-gradient(180deg,transparent 0,rgba(227,194,126,0.22) 6%,' +
            'rgba(227,194,126,0.22) 94%,transparent) 1;' +
            '}',
          'html[data-astral] [class*="_detailTab"][aria-selected="true"]{' +
            'color:var(--dsw-alias-brand-primary);' +
            '}',
          // 原生是 2px 纯色方块下划线，两端硬切。改成中间亮、两端散开的细光带。
          'html[data-astral] [class*="_detailTab"][aria-selected="true"]:after{' +
            'background:linear-gradient(90deg,transparent,var(--astral-divider-strong) 22%,' +
            'var(--astral-divider-strong) 78%,transparent);' +
            'box-shadow:0 0 9px -2px var(--astral-focus-glow);' +
            '}',
          // 大标题（会话名 / 页面 h1）给一点点字距，20px 的字在深空底上会显得挤。
          'html[data-astral] [class*="_pageHeading"] h1{letter-spacing:0.01em}',
          // ---- 内容层：Markdown ----
          // 正文是这套主题里面积最大的东西，之前只有正文卡片有底色，卡片里的
          // 标题/引用/代码/表格还是宿主默认的冷灰，整块内容看着"没上色"。
          'html[data-astral] h1,html[data-astral] h2,html[data-astral] h3{' +
            'letter-spacing:0.01em;' +
            '}',
          // h2 下面补一道向右淡出的金线，替代宿主的整条灰线——标题"漂"在段落上方时最需要它。
          'html[data-astral] h2{' +
            'border-bottom:1px solid transparent;' +
            'border-image:linear-gradient(90deg,rgba(227,194,126,0.24) 0,' +
            'rgba(227,194,126,0.24) 30%,transparent 100%) 1;' +
            'padding-bottom:6px;' +
            '}',
          'html[data-astral] blockquote{' +
            'border-left:2px solid var(--astral-msg-accent);' +
            'background:linear-gradient(90deg,var(--astral-quote),transparent 72%);' +
            'color:var(--dsw-alias-label-secondary);' +
            'border-radius:0 8px 8px 0;margin:12px 0;padding:8px 14px;' +
            '}',
          'html[data-astral] pre{' +
            'background:var(--dsw-alias-markdown-code-block);' +
            'border:1px solid var(--dsw-alias-border-l2);border-radius:10px;' +
            '}',
          // 行内代码：宿主在深底上给的是纯灰块，几乎看不出是"代码"。给一点暖底 + 金调字。
          'html[data-astral] :not(pre)>code{' +
            'background:var(--astral-code-bg);border:1px solid var(--astral-code-border);' +
            'color:var(--astral-code-fg);border-radius:5px;padding:1px 5px;' +
            '}',
          'html[data-astral] a{color:var(--dsw-alias-brand-primary);text-underline-offset:3px}',
          'html[data-astral] table{' +
            'border-collapse:separate;border-spacing:0;overflow:hidden;' +
            'border:1px solid var(--dsw-alias-border-l2);border-radius:10px;' +
            '}',
          'html[data-astral] th{' +
            'background:var(--astral-th-bg);color:var(--dsw-alias-label-primary);font-weight:600;' +
            '}',
          'html[data-astral] th,html[data-astral] td{border-color:var(--dsw-alias-border-l2)}',
          'html[data-astral] li::marker{color:var(--dsw-alias-brand-primary)}',
          // ---- 浮层：弹窗 / 菜单 / 提示 ----
          // 宿主的浮层只有一层阴影，在深空底上边界会糊掉。补一圈极淡金边把它"托"起来。
          'html[data-astral] [role="dialog"],' +
          'html[data-astral] [role="menu"],' +
          'html[data-astral] [role="listbox"]{' +
            'border:1px solid var(--astral-msg-border);' +
            'box-shadow:0 24px 60px -40px rgba(0,0,0,0.95),0 0 0 1px var(--astral-msg-edge);' +
            '}',
          'html[data-astral] [role="tooltip"]{' +
            'background:var(--dsw-alias-bg-layer-2);border:1px solid var(--astral-divider);' +
            'color:var(--dsw-alias-label-primary);' +
            '}',
          // ---- 收尾：还缺边的容器一次补齐 ----
          // 一律用 box-shadow 画边、不改 border。border 会改变盒模型（卡片凭空宽 2px、
          // 栅格错位），box-shadow 不占布局，任何元素上都能安全套一圈。
          'html[data-astral] [class*="_card"]:not(.GRgSLq_card){' +
            'box-shadow:0 0 0 1px var(--astral-ring),0 10px 26px -24px rgba(0,0,0,0.9);' +
            '}',
          'html[data-astral] [class*="_thumbnail"]{' +
            'box-shadow:0 0 0 1px var(--astral-divider);' +
            '}',
          'html[data-astral] [class*="_divider"],' +
          'html[data-astral] [class*="_separator"]{' +
            'background-color:var(--astral-divider);' +
            '}',
          // 表单控件是浏览器原生的，accent-color 是唯一能一次改全的开关。
          'html[data-astral] input[type="checkbox"],' +
          'html[data-astral] input[type="radio"],' +
          'html[data-astral] input[type="range"],' +
          'html[data-astral] progress{' +
            'accent-color:var(--dsw-alias-brand-primary);' +
            '}',
          'html[data-astral] [role="switch"][aria-checked="true"]{' +
            'background-color:var(--dsw-alias-brand-primary);' +
            '}',
          'html[data-astral] input:focus-visible,' +
          'html[data-astral] textarea:focus-visible,' +
          'html[data-astral] select:focus-visible{' +
            'outline:1px solid var(--astral-focus);outline-offset:1px;' +
            '}',
          // 滚动条只改颜色、不动宽度：宿主在若干容器里用 --dsh-scrollbar-width 精确控制过，
          // 改宽度会把这些容器的布局挤歪。
          'html[data-astral] ::-webkit-scrollbar-thumb{' +
            'background-color:var(--astral-scroll);border-radius:8px;' +
            '}',
          'html[data-astral] ::-webkit-scrollbar-thumb:hover{' +
            'background-color:var(--astral-scroll-hover);' +
            '}',
          'html[data-astral] ::-webkit-scrollbar-track{background:transparent}',
          // 空状态 hero：一团从顶部压下来的金雾，只有新会话空白页能看到。
          'html[data-astral] [class*="_hero"]{' +
            'background-image:radial-gradient(760px 320px at 50% -6%,var(--astral-glow-a),transparent 72%);' +
            '}',
          // ---- 代码高亮 ----
          // 宿主用的是 shiki 的 css-variables 模式（ui-theme/src/styles/shiki.css）：
          // :root 与 body[data-ds-dark-theme] 各定义一套 --shiki-token-*。
          // 所以不用碰任何一个 span，改这 10 个变量就等于换掉全站的语法配色。
          // 选择器写成 html[data-astral] body（0,1,2），压过 body[data-ds-dark-theme]（0,1,1）。
          'html[data-astral="' + NIGHT_ID + '"] body{' +
            '--shiki-foreground:#E9ECF5;--shiki-background:#0B0F1B;' +
            '--shiki-token-constant:#E3C27E;' +   // 数字/布尔 —— 金
            '--shiki-token-string:#6FD3AE;' +     // 字符串 —— 青绿
            '--shiki-token-comment:#5A6480;' +    // 注释 —— 压到最暗
            '--shiki-token-keyword:#C792EA;' +    // 关键字 —— 紫
            '--shiki-token-parameter:#E6A15F;' +  // 参数 —— 橙
            '--shiki-token-function:#7FA6E0;' +   // 函数 —— 蓝
            '--shiki-token-string-expression:#8FCFB0;' +
            '--shiki-token-punctuation:#8B93A8;' +
            '--shiki-token-link:#ECD49B;' +
            '}',
          // ---- 双线框 ----
          // 星穹的面板几乎都是"外框 + 内缩 4px 的第二道细线"。这道线不显眼，
          // 但它是整套 UI 里最能把"通用深色皮肤"和"星穹"分开的东西：
          // 通用皮肤只画一道边，星穹画两道，而且第二道永远更细、更暗、离得更近。
          'html[data-astral] [data-chat-flow-kind^="assistant"]{position:relative}',
          'html[data-astral] [data-chat-flow-kind^="assistant"]::after{' +
            'content:"";position:absolute;inset:4px;pointer-events:none;' +
            'border:1px solid var(--astral-inner-rule);border-radius:10px;' +
            '}',
          // ---- 切角 ----
          // 圆角 14px 是 iOS 的语言，星穹没有圆角：它的面板、按钮、名牌都是 45° 斜切。
          // 用 clip-path 切掉对角两个角（左上 / 右下），保留"斜切板"的倾斜指向。
          // 代价：clip-path 会连带裁掉外阴影，所以这几处的投影一并放弃，改由内光承担层次。
          'html[data-astral] [data-chat-flow-kind^="assistant"]{' +
            'clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),' +
            'calc(100% - 16px) 100%,0 100%,0 16px);' +
            'border-radius:0;' +
            '}',
          // 内框跟着切成小一号的斜切，否则它的直角会在切角处露到外面。
          'html[data-astral] [data-chat-flow-kind^="assistant"]::after{' +
            'border-radius:0;' +
            'clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),' +
            'calc(100% - 12px) 100%,0 100%,0 12px);' +
            '}',
          // 用户气泡切得更狠一点：右下角 22px，正好落在原来那个 4px 小圆角的位置，
          // "收尾"的方向感从圆角改成了斜切。
          'html[data-astral] [data-message-bubble],' +
            'html[data-astral] .rhSLKq_bubble{' +
            'border-radius:0;' +
            'clip-path:polygon(12px 0,100% 0,100% calc(100% - 22px),' +
            'calc(100% - 22px) 100%,0 100%,0 12px);' +
            '}',
          // 输入框区：整块做成"星穹列车车厢窗框"。
          // 切角 16px + 外圈金线（box-shadow 在别处）+ 内圈缩进 5px 的第二道线（outline，
          // 会被 clip-path 一起切掉，所以内框自动跟着切角，不用另算多边形）+
          // 四颗铆钉（四条渐变小圆点，钉在上下边框 18%/82% 处，正好避开切角）+
          // 上亮下暗的金属渐变。跑马灯那种会动的效果不做，滚动时重绘太贵。
          'html[data-astral] .GRgSLq_card{' +
            'background-color:var(--astral-glass);' +
            'background-image:' +
            'radial-gradient(circle at 18% 7px,var(--astral-rivet) 0 1.6px,transparent 2.2px),' +
            'radial-gradient(circle at 82% 7px,var(--astral-rivet) 0 1.6px,transparent 2.2px),' +
            'radial-gradient(circle at 18% calc(100% - 7px),var(--astral-rivet) 0 1.6px,transparent 2.2px),' +
            'radial-gradient(circle at 82% calc(100% - 7px),var(--astral-rivet) 0 1.6px,transparent 2.2px),' +
            'linear-gradient(180deg,var(--astral-composer-sheen),transparent 36%),' +
            'linear-gradient(180deg,transparent 72%,rgba(0,0,0,0.16));' +
            'background-repeat:no-repeat;' +
            'border-radius:0;' +
            'clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),' +
            'calc(100% - 18px) 100%,0 100%,0 18px);' +
            'box-shadow:' +
            'inset 0 0 0 9px var(--astral-frame),' +
            'inset 0 0 0 10px var(--astral-frame-line),' +
            'inset 0 1px 0 rgba(255,255,255,0.05),' +
            '0 0 0 1px var(--astral-composer-edge),' +
            '0 16px 36px -26px rgba(0,0,0,0.9);' +
            '}',
          // 助手卡片右上角的斜向细纹：星穹的金属面板上都有这种 45° 拉丝。
          // 只铺 132×132 的一小块（不重复、定位在右上），不然整张卡会花。
          'html[data-astral] [data-chat-flow-kind^="assistant"]{' +
            'background-image:' +
            'repeating-linear-gradient(45deg,transparent 0 8px,rgba(227,194,126,0.045) 8px 9px),' +
            'linear-gradient(180deg,var(--astral-msg-sheen),transparent 46%);' +
            'background-size:132px 132px,100% 100%;' +
            'background-position:top right,0 0;' +
            'background-repeat:no-repeat,no-repeat;' +
            '}',
          // Markdown 二级标题前面加一颗金菱形——星穹的分区标题都带这个符号。
          'html[data-astral] h2::before{' +
            'content:"◆";color:var(--dsw-alias-brand-primary);' +
            'font-size:0.6em;margin-right:8px;vertical-align:0.22em;' +
            '}',
          // 对话里的 h2 再加个两位序号（01 ◆ 标题）：星穹的任务简报就是这样分节的。
          // 每张助手卡片自己重置计数，所以是"这一条回答内的第几节"，不是全页累计。
          'html[data-astral] [data-chat-flow-kind^="assistant"]{counter-reset:astral-sec}',
          'html[data-astral] [data-chat-flow-kind^="assistant"] h2::before{' +
            'content:counter(astral-sec,decimal-leading-zero) "\\2003◆";' +
            'counter-increment:astral-sec;' +
            'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;' +
            'font-size:0.55em;letter-spacing:0.08em;opacity:0.85;' +
            '}',
          // 列表符号改成菱形，和游戏里的条目语法一致。
          'html[data-astral] li::marker{content:"◆  ";font-size:0.72em}',
          // ---- 星轨 ----
          // 两道极细的大圆弧压在背景上，像行星轨道的切线。星穹的星图界面就这么画：
          // 不是星空照片，是"轨道示意"。半径大到出画，所以只看到几段弧。
          'html[data-astral] body,' +
          'html[data-astral] [class*="_centerCol"],' +
          'html[data-astral] [class*="_sidebarCol"]{' +
            'background-image:' +
            STARFIELD_NIGHT + ',' +
            'radial-gradient(1000px 720px at 80% 4%,var(--astral-nebula-a),transparent 62%),' +
            'radial-gradient(880px 620px at 8% 98%,var(--astral-nebula-b),transparent 64%),' +
            'radial-gradient(1200px 1200px at 84% -22%,transparent 0 58.4%,' +
            'var(--astral-orbit) 58.55% 58.72%,transparent 58.9%),' +
            'radial-gradient(900px 900px at 12% 118%,transparent 0 63.4%,' +
            'var(--astral-orbit) 63.55% 63.72%,transparent 63.9%),' +
            'radial-gradient(1100px 560px at 72% -8%,var(--astral-glow-a),transparent 62%),' +
            'radial-gradient(820px 480px at 6% 106%,var(--astral-glow-b),transparent 66%);' +
            'background-size:480px 480px,100% 100%,100% 100%,100% 100%,100% 100%,' +
            '100% 100%,100% 100%;' +
            'background-repeat:repeat,no-repeat,no-repeat,no-repeat,no-repeat,' +
            'no-repeat,no-repeat;' +
            '}',
          // 宿主在 centerCol 里又套了一层不透明的会话根（.an3WzG_root{background:bg-base}），
          // 把底图整块盖住了——之前怎么看都是平涂色，就是这一层干的。
          // 这里只把"颜色"戳穿，不动它们各自的渐变/遮罩，避免连带破坏滚动渐隐等效果。
          'html[data-astral] [class*="_centerCol"]{' +
            'background-color:transparent;' +
            '}',
          'html[data-astral] [class*="_centerCol"] [class*="_root"],' +
            'html[data-astral] [class*="_centerCol"] [class*="_mainPanel"],' +
            'html[data-astral] [class*="_centerCol"] [class*="_screen"],' +
            'html[data-astral] [class*="_centerCol"] [class*="_viewport"]{' +
            'background-color:transparent;' +
            '}',
          // 背景只留"远景"：星点、星云、两道轨道弧、辉光，最后压一张星云照片。
          // 原来还压了一层星盘（COMPASS），但它是列表第一层＝最上层，860px 的环会
          // 直接横切过对话列，看上去像一道断掉的金色弧线——已撤掉，不再参与构图。
          // 照片上面加一层暗色罩，让它退成"景深"而不是"贴纸"。
          'html[data-astral] [class*="_centerCol"]{' +
            'background-image:' +
            STARFIELD_NIGHT + ',' +
            'radial-gradient(1000px 720px at 80% 4%,var(--astral-nebula-a),transparent 62%),' +
            'radial-gradient(880px 620px at 8% 98%,var(--astral-nebula-b),transparent 64%),' +
            'radial-gradient(1200px 1200px at 84% -22%,transparent 0 58.4%,' +
            'var(--astral-orbit) 58.55% 58.72%,transparent 58.9%),' +
            'radial-gradient(900px 900px at 12% 118%,transparent 0 63.4%,' +
            'var(--astral-orbit) 63.55% 63.72%,transparent 63.9%),' +
            'radial-gradient(1100px 560px at 72% -8%,var(--astral-glow-a),transparent 62%),' +
            'radial-gradient(820px 480px at 6% 106%,var(--astral-glow-b),transparent 66%),' +
            'linear-gradient(180deg,var(--astral-scrim-top),var(--astral-scrim-bot)),' +
            'var(--astral-bg-photo);' +
            'background-size:480px 480px,100% 100%,100% 100%,100% 100%,100% 100%,' +
            '100% 100%,100% 100%,100% 100%,cover;' +
            'background-position:0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,center;' +
            'background-repeat:repeat,no-repeat,no-repeat,no-repeat,no-repeat,' +
            'no-repeat,no-repeat,no-repeat,no-repeat;' +
            'background-attachment:fixed,fixed,fixed,fixed,fixed,fixed,fixed,fixed,fixed;' +
            '}',
          // ---- HUD 括角 ----
          // 卡片右上角的序号（01 / 02 …）已按用户要求删除：读不出信息，只添噪。
          // 编号节点仍在（data-astral-no），但不再渲染；保留写入是为了将来想恢复时不用改 DOM 逻辑。
          // ---- 标签页斜切高光 ----
          // 选中的 tab 不再只有一条底线，而是一整块右侧下沉的梯形亮块。
          'html[data-astral] [class*="_detailTab"][aria-selected="true"]{' +
            'background-image:linear-gradient(180deg,' +
            'rgba(227,194,126,0.09),transparent 82%);' +
            'clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);' +
            '}',
        // ---- 记忆点：菱形扣 ----
          // 星穹的界面里，每一块面板的中轴线上都钉着一颗菱形（列车车厢的铰链、星图盘的轴心）。
          // 这一颗钉在输入框顶边正中，是整屏唯一一个"纯装饰、没有任何功能"的物件——
          // 主题要被人记住，靠的就是这种没用的东西。
          'html[data-astral] .GRgSLq_card{position:relative}',
          'html[data-astral] .GRgSLq_card::before{' +
            'content:"";position:absolute;top:7px;left:50%;width:12px;height:12px;' +
            'transform:translateX(-50%) rotate(45deg);' +
            'background:var(--dsw-alias-brand-primary);' +
            'border:1px solid rgba(10,14,26,0.45);' +
            'box-shadow:0 0 14px 0 var(--astral-brand-glow);' +
            'pointer-events:none;' +
            '}',
          // 同一条中轴线向两侧散开的一道细金线，把菱形"托"在边上。
          'html[data-astral] .GRgSLq_card::after{' +
            'content:"";position:absolute;top:13px;left:16%;right:16%;height:1px;' +
            'background:linear-gradient(90deg,transparent,rgba(227,194,126,0.34) 22%,' +
            'rgba(227,194,126,0.34) 78%,transparent);' +
            'box-shadow:0 0 6px 0 rgba(227,194,126,0.18);' +
            'pointer-events:none;' +
            '}',
          // ---- HUD 骨架 ----
          // 只在我们自己的 .astral-hud 层里生效；宿主没有这些节点，也就无从冲突。
          '.astral-hud{position:fixed;inset:0;pointer-events:none;z-index:9997;display:none}',
          'html[data-astral] .astral-hud{display:block}',
          'html[data-astral] .astral-hud i{position:absolute;display:block}',
          'html[data-astral] .ah-c{width:30px;height:30px;border:0 solid var(--astral-hud-line);filter:drop-shadow(0 0 5px rgba(227,194,126,0.22))}',
          'html[data-astral] .ah-tl{top:8px;left:8px;border-top-width:1.5px;border-left-width:1.5px}',
          'html[data-astral] .ah-tr{top:8px;right:8px;border-top-width:1.5px;border-right-width:1.5px}',
          'html[data-astral] .ah-bl{bottom:8px;left:8px;border-bottom-width:1.5px;border-left-width:1.5px}',
          'html[data-astral] .ah-br{bottom:8px;right:8px;border-bottom-width:1.5px;border-right-width:1.5px}',
          'html[data-astral] .ah-gem{top:12px;left:50%;width:8px;height:8px;' +
            'transform:translateX(-50%) rotate(45deg);' +
            'background:var(--dsw-alias-brand-primary);' +
            'box-shadow:0 0 10px 0 var(--astral-brand-glow)}',
          'html[data-astral] .ah-rail{right:11px;top:76px;bottom:76px;width:1px;' +
            'background:repeating-linear-gradient(180deg,var(--astral-hud-line) 0 1px,' +
            'transparent 1px 10px);opacity:0.45}',
          // 右下角一枚"坐标戳"：等宽小字、宽字距、低透明度。
          // 星穹的界面常在角落里挂这种读数（坐标/编号/版本），是廉价的"仪表感"。
          'html[data-astral] .ah-coord{bottom:13px;right:22px;' +
            'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;' +
            'font-size:9px;line-height:1;letter-spacing:0.24em;' +
            'color:var(--astral-hud-line);opacity:0.42;' +
            'text-transform:uppercase;white-space:nowrap}',
          // 左缘竖排字已按用户要求删除（原来的 .ah-vert 规则与节点一并移除）。
          // 票根式的条形码：宽窄不等的竖条，纯纹理，占位在坐标戳上方。
          'html[data-astral] .ah-code{right:22px;bottom:29px;width:88px;height:9px;' +
            'opacity:0.30;background:repeating-linear-gradient(90deg,' +
            'var(--astral-hud-line) 0 1px,transparent 1px 3px,' +
            'var(--astral-hud-line) 3px 5px,transparent 5px 6px,' +
            'var(--astral-hud-line) 6px 7px,transparent 7px 11px)}',
          // 卡片内侧的扫描线：1px 横纹、4px 间隔、透明度低到几乎看不见，
          // 只在"面"上留一层微妙的显示屏质感。
          'html[data-astral] [data-chat-flow-kind^="assistant"]::after{' +
            'background-image:repeating-linear-gradient(0deg,' +
            'rgba(255,255,255,0.022) 0 1px,transparent 1px 4px)}',
          // ---- 游戏内元素（全部自绘，不含任何官方素材）----
          // 菜单项：金色菱形前导。游戏里的列表项几乎都是这个语法。
          'html[data-astral] [role="menuitem"]::before{content:"";display:inline-block;' +
            'width:5px;height:5px;margin-right:8px;vertical-align:middle;' +
            'transform:rotate(45deg);background:var(--dsw-alias-brand-primary);opacity:0.7}',
          // 页签栏下缘：3px 高的刻度尺（1px 线、6px 间隔），像仪表读数条。
          'html[data-astral] [class*="_detailTabsBar"]{background-image:repeating-linear-gradient(' +
            '90deg,var(--astral-hud-line) 0 1px,transparent 1px 6px);' +
            'background-repeat:no-repeat;background-size:100% 3px;background-position:left bottom}',
          // 侧栏图标：金色外发光，hover 时轻微放大。
          'html[data-astral] [class*="_panelIcon"]{filter:drop-shadow(0 0 6px var(--astral-brand-glow));' +
            'transition:transform .16s ease}',
          'html[data-astral] [class*="_panelRow"]:hover [class*="_panelIcon"]{transform:scale(1.08)}',
          // 主按钮切角，和卡片同一套多边形语言。
          'html[data-astral] .jrmgQW_primaryButton{clip-path:polygon(6px 0,100% 0,' +
            '100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)}',
          // 顶部资源条：一排 5px 宽的刻度块，两端渐隐。游戏里顶部那条
          // 开拓力/信用点带子就是这种分段读数，这里只做形状，不放数字。
          'html[data-astral] .ah-bar{top:44px;left:50%;width:196px;height:5px;' +
            'transform:translateX(-50%);opacity:0.5;' +
            'background:repeating-linear-gradient(90deg,var(--astral-hud-line) 0 5px,' +
            'transparent 5px 9px);' +
            '-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);' +
            'mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)}',
          // 切换时的过场：四层同时起手 —— 虹膜擦除、双环扩散、放射光、菱形火花。
          // 全部挂在 HUD 层上，pointer-events 已经是 none，不会挡住点击。
          'html[data-astral] .ah-orbit{left:50%;top:50%;width:230px;height:230px;' +
            'margin:-115px 0 0 -115px;border-radius:50%;display:none;opacity:0;' +
            'background:conic-gradient(from 0deg,transparent 0 70%,' +
            'var(--astral-hud-line) 86%,transparent 100%);' +
            '-webkit-mask-image:radial-gradient(circle,transparent 64%,#000 65%);' +
            'mask-image:radial-gradient(circle,transparent 64%,#000 65%)}',
          'html[data-astral] .astral-sweeping .ah-orbit{display:block;' +
            'animation:astralSweep .85s linear}',
          '@keyframes astralSweep{0%{transform:rotate(0);opacity:0}' +
            '18%{opacity:0.85}100%{transform:rotate(360deg);opacity:0}}',
          'html[data-astral] .ah-orbit,html[data-astral] .ah-ring,html[data-astral] .ah-rays{display:none}',
// ⓪ 跃迁光带：一道 15° 斜向的柔光从左上滑到右下，代替原来那段旋转的金弧。
          // 弧线的问题是它像仪表盘；光带更像列车跃迁时窗外被拉长的星光。
          'html[data-astral] .ah-warp{position:absolute;left:-12%;top:-12%;width:124%;height:124%;opacity:0;' +
            'background:linear-gradient(104deg,transparent 34%,rgba(227,194,126,0.06) 43%,var(--astral-hud-line) 50%,rgba(227,194,126,0.06) 57%,transparent 66%);' +
            'filter:blur(7px);mix-blend-mode:screen;' +
            'transform:translateX(-55%) skewX(-10deg)}',
          'html[data-astral] .astral-sweeping .ah-warp{animation:astralWarp .82s cubic-bezier(0.25,0.7,0.15,1) both}',
          '@keyframes astralWarp{0%{opacity:0;transform:translateX(-55%) skewX(-10deg)}' +
            '22%{opacity:0.9}100%{opacity:0;transform:translateX(55%) skewX(-10deg)}}',
          // 光带外面的细光条，让跃迁有速度感；只在光带经过时最亮。
          'html[data-astral] .ah-streak{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;mix-blend-mode:screen;' +
            'background:repeating-linear-gradient(104deg,transparent 0 26px,var(--astral-hud-line) 26px 27px,transparent 27px 58px);' +
            '-webkit-mask-image:linear-gradient(104deg,transparent 22%,#000 46%,#000 54%,transparent 78%);' +
            'mask-image:linear-gradient(104deg,transparent 22%,#000 46%,#000 54%,transparent 78%)}',
          'html[data-astral] .astral-sweeping .ah-streak{animation:astralStreak .72s ease-out both}',
          '@keyframes astralStreak{0%{opacity:0;transform:translateX(-38%)}' +
            '28%{opacity:0.32}100%{opacity:0;transform:translateX(38%)}}',
          // ① 虹膜擦除：一团目标配色的雾从右侧切换钮的位置撑开，扫过整屏。
          'html[data-astral] .ah-iris{left:0;top:0;width:100%;height:100%;' +
            'background:var(--astral-veil,rgba(10,14,26,0.5));opacity:0;' +
            'clip-path:circle(0 at 100% 50%);will-change:clip-path,opacity}',
          'html[data-astral] .astral-sweeping .ah-iris{' +
            'animation:astralIris .72s cubic-bezier(0.22,0.61,0.36,1) both}',
          '@keyframes astralIris{0%{opacity:0;clip-path:circle(0 at 100% 50%)}' +
            '22%{opacity:0.62}62%{opacity:0.34}' +
            '100%{opacity:0;clip-path:circle(155% at 100% 50%)}}',
          // ② 双环：一实一虚，一大一小，错开 90ms 扩散出去。
          'html[data-astral] .ah-ring{left:50%;top:50%;width:300px;height:300px;' +
            'margin:-150px 0 0 -150px;border-radius:50%;opacity:0;' +
            'border:1px solid var(--astral-hud-line)}',
          'html[data-astral] .ah-r2{border-style:dashed;opacity:0}',
          'html[data-astral] .astral-sweeping .ah-r1{animation:astralRing .92s ease-out both}',
          'html[data-astral] .astral-sweeping .ah-r2{animation:astralRing 1.06s ease-out .1s both}',
          '@keyframes astralRing{0%{transform:scale(0.18);opacity:0}' +
            '18%{opacity:0.85}100%{transform:scale(2.7);opacity:0}}',
          // ③ 放射光：一圈 15° 间隔的细光缝，缓慢旋开。
          'html[data-astral] .ah-rays{left:50%;top:50%;width:560px;height:560px;' +
            'margin:-280px 0 0 -280px;border-radius:50%;opacity:0;' +
            'background:repeating-conic-gradient(from 0deg,' +
            'var(--astral-hud-line) 0 0.7deg,transparent 0.7deg 15deg);' +
            '-webkit-mask-image:radial-gradient(circle,transparent 10%,#000 26%,transparent 64%);' +
            'mask-image:radial-gradient(circle,transparent 10%,#000 26%,transparent 64%)}',
          'html[data-astral] .astral-sweeping .ah-rays{animation:astralRays 1s ease-out both}',
          '@keyframes astralRays{0%{opacity:0;transform:rotate(-14deg) scale(0.55)}' +
            '26%{opacity:0.5}100%{opacity:0;transform:rotate(34deg) scale(1.18)}}',
          // ④ 菱形火花：四颗从中心飞出的小菱形，各自朝四个斜向。
          'html[data-astral] .ah-spark{left:50%;top:50%;width:6px;height:6px;' +
            'margin:-3px 0 0 -3px;background:var(--dsw-alias-brand-primary);' +
            'transform:rotate(45deg);opacity:0;' +
            'box-shadow:0 0 10px 0 var(--astral-brand-glow)}',
          'html[data-astral] .astral-sweeping .ah-spark{animation:astralSpark .8s ease-out both}',
          '@keyframes astralSpark{0%{opacity:0;transform:translate(0,0) rotate(45deg) scale(0.3)}' +
            '22%{opacity:1}100%{opacity:0;' +
            'transform:translate(var(--dx,0),var(--dy,0)) rotate(225deg) scale(0.95)}}',
          // 选中行右侧的菱形锚点。
          'html[data-astral] [aria-selected="true"]{position:relative}',
          'html[data-astral] [aria-selected="true"]::after{content:"";position:absolute;' +
            'right:10px;top:50%;width:5px;height:5px;margin-top:-2.5px;' +
            'transform:rotate(45deg);background:var(--dsw-alias-brand-primary);opacity:0.8}',
          // 分组标题的斜切底。类名不确定就多给几个候选，匹配不上也不会有副作用。
          'html[data-astral] [class*="_groupTitle"],html[data-astral] [class*="_sectionLabel"],' +
            'html[data-astral] [class*="_panelLabel"]{letter-spacing:0.10em;padding-left:9px;' +
            'background-image:linear-gradient(90deg,var(--astral-active),transparent 74%);' +
            'clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}',
          // 一劳永逸的两条：①color-scheme 让所有原生控件（勾选框、下拉、滚动条、日期选择）
          // 跟着换，不用逐个点；②顶层色调罩盖住整页，连设置页、插件市场、弹层一起染色。
          'html[data-astral="astral-night"]{color-scheme:dark}' +
            '.astral-wash{position:fixed;inset:0;pointer-events:none;z-index:2147483000;' +
            'display:none;mix-blend-mode:soft-light;opacity:0.9;background:linear-gradient(' +
            '160deg,var(--astral-wash-a) 0,transparent 46%,var(--astral-wash-b) 100%)}' +
            'html[data-astral] .astral-wash{display:block}',
                    // 底图入口：设置 → 通用 里的一行，排版照抄宿主自己的偏好行
          // （标题+说明在左、按钮在右、下边框分隔），不再另起一套皮肤。
          '.astral-setrow{display:flex;align-items:center;justify-content:space-between;' +
            'gap:24px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2);' +
            'font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary)}' +
            '.astral-setrow-tx{display:flex;flex-direction:column;gap:2px;min-width:0}' +
            '.astral-setrow-tx b{font-weight:400;font-size:14px;line-height:22px}' +
            '.astral-setrow-tx span{font-size:12px;line-height:18px;' +
            'color:var(--dsw-alias-label-secondary)}' +
            '.astral-setrow-acts{display:flex;align-items:center;gap:8px;flex:none}' +
            '.astral-btn{height:30px;padding:0 12px;border-radius:8px;' +
            'border:.5px solid var(--dsw-alias-border-l2);background:transparent;' +
            'color:var(--dsw-alias-label-primary);font-size:12px;line-height:28px;' +
            'cursor:pointer;outline:none;white-space:nowrap;' +
            'transition:background-color .16s ease,border-color .16s ease,filter .14s ease}' +
            '.astral-btn:hover{border-color:var(--astral-msg-border)}' +
            '.astral-btn[data-primary="1"]{background:var(--dsw-alias-button-primary-fill);' +
            'color:var(--dsw-alias-label-primary-foreground);border-color:transparent}' +
            '.astral-btn[data-primary="1"]:hover{filter:brightness(1.06)}' +
            '.astral-btn[disabled]{opacity:.45;cursor:default}' +
            '.astral-btn[disabled]:hover{border-color:var(--dsw-alias-border-l2)}' +
            '.astral-modal{position:fixed;inset:0;z-index:2147483001;display:none;' +
            'align-items:center;justify-content:center;background:rgba(4,6,12,0.66);' +
            '-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}' +
            '.astral-modal.on{display:flex}' +
            '.astral-modal-card{width:min(520px,calc(100vw - 48px));box-sizing:border-box;' +
            'padding:22px 24px 18px;background:var(--dsw-alias-bg-layer-1);' +
            'border:1px solid var(--astral-msg-border);border-radius:14px;' +
            'color:var(--dsw-alias-label-primary);' +
            'box-shadow:0 26px 70px -30px rgba(0,0,0,0.9)}' +
            '.astral-modal-card h3{margin:0 0 10px;font-size:15px;font-weight:600;' +
            'letter-spacing:0.04em}' +
            '.astral-modal-card p{margin:0 0 12px;font-size:12.5px;line-height:1.75;' +
            'color:var(--dsw-alias-label-secondary)}' +
            '.astral-modal-card ul{margin:0 0 16px;padding-left:18px;font-size:12.5px;' +
            'line-height:1.8;color:var(--dsw-alias-label-secondary)}' +
            '.astral-modal-card li::marker{color:var(--astral-msg-accent)}' +
            '.astral-modal-acts{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
            '.astral-modal-acts button{padding:7px 14px;font-size:12.5px;border-radius:8px;' +
            'cursor:pointer;border:1px solid var(--astral-msg-border);background:transparent;' +
            'color:var(--dsw-alias-label-primary);transition:background-color .16s ease}' +
            '.astral-modal-acts button:hover{background:var(--astral-hover)}' +
            '.astral-modal-acts .primary{background:var(--dsw-alias-brand-primary);' +
            'border-color:transparent;color:var(--dsw-alias-label-primary-foreground);' +
            'font-weight:600}' +
            '.astral-modal-acts .primary:hover{filter:brightness(1.06)}',
          // 二相乐园那套的"笑点"计数也一并撤掉——同一个位置，用户已经判过死刑。
        
          // ---- 侧栏"站点标记" ----
          // 分区线不再是一条平铺到边的线：正中嵌一颗菱形，读起来像轨道图上的站。
          // 菱形用宿主底色填充、金线描边，所以看起来是"线从中间穿过去"而不是压了个图标。
          'html[data-astral] [class*="_footArea"],html[data-astral] [class*="_regionArea"]{' +
            'position:relative;' +
            '}',
          'html[data-astral] [class*="_footArea"]::before,' +
            'html[data-astral] [class*="_regionArea"]::before{' +
            'content:"";position:absolute;left:50%;top:-4px;width:7px;height:7px;' +
            'margin-left:-3.5px;transform:rotate(45deg);pointer-events:none;' +
            'background:var(--dsw-alias-bg-base);' +
            'box-shadow:inset 0 0 0 1px var(--astral-divider-strong);' +
            '}',
          'html[data-astral="astral-night"]{--astral-route:' + ROUTE_GOLD + ';--astral-mark:' + EMBLEM + '}',
        ].join('');
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;
        // immediately:true 的插件可能在 <head> 还没解析出来时就运行，直接 append 会抛异常，
        // 所以退回 documentElement（宿主自己的插件也是这么兜的）。
        (document.head || document.documentElement).appendChild(style);

        // ---- HUD 叠层 ----
        // 前面的改动都活在"宿主的元素里"，能改的只有颜色和描边。
        // 想让人一眼认出是星穹，必须有宿主没有的东西——于是这里直接往页面上盖一层自己的 DOM：
        // 四角括线、顶部菱形、右侧刻度轨。这是任何皮肤插件都没做过的形状，
        // 而且它在，就说明主题确实加载了。
        let hud = null;
        try {
          const node = document.createElement('div');
          // 非浏览器环境（测试桩、某些宿主）里 createElement 返回的可能只是空对象，
          // HUD 是纯装饰，挂不上就安静跳过，不能让它带崩整个主题。
          if (node && typeof node.setAttribute === 'function') {
            node.className = 'astral-hud';
            node.setAttribute('aria-hidden', 'true');
            node.innerHTML =
              '<i class="ah-c ah-tl"></i><i class="ah-c ah-tr"></i>' +
              '<i class="ah-c ah-bl"></i><i class="ah-c ah-br"></i>' +
              '<i class="ah-gem"></i><i class="ah-rail"></i>' +
              '<i class="ah-coord">astral &#183; 01</i>' +
              '<i class="ah-code"></i>' +
              '<i class="ah-bar"></i><i class="ah-warp"></i>' +
              '<i class="ah-iris"></i><i class="ah-streak"></i>' +
              '<i class="ah-spark" style="--dx:-146px;--dy:-96px"></i>' +
              '<i class="ah-spark" style="--dx:158px;--dy:-74px"></i>' +
              '<i class="ah-spark" style="--dx:-128px;--dy:118px"></i>' +
              '<i class="ah-spark" style="--dx:136px;--dy:132px"></i>';
            const hudHost = document.body || document.documentElement;
            if (hudHost && typeof hudHost.appendChild === 'function') {
              hudHost.appendChild(node);
              hud = node;
            }
          }
        } catch (err) {
          console.warn('[astral] HUD 挂载失败：', err);
        }

        // ---- 卡片编号：已停用 ----
        // 曾经给每块看板写 data-astral-no 并在右上角渲染 01/02，用户判定无用。
        // 现在既不写属性也不挂 MutationObserver —— 省掉一个每 180ms 全树回调。
        const numberMessages = () => {};
        const scheduleNumber = () => {};
        let chatObserver = null;
        // 版本回执：把当前版本写在侧栏品牌区下面，肉眼就能确认页面跑的是哪一版。
        // 排查"改了没生效"时，这一行比控制台可靠——它就在屏幕上。
        let sweepUntil = 0;
        let stampTimer = null;
        // 底图入口的挂载函数在下面才定义，这里留一个可空引用，避免 TDZ。
        let mountEntryRef = null;
        // 自愈回调：paint 定义之后再赋值，stampVersion 每 1.5 秒调一次。
        let healRef = null;
        const stampVersion = () => {
          try {
            if (mountEntryRef) mountEntryRef();
            if (healRef) healRef();
            // 过场类万一没被定时器摘掉，就会留下一条静止的金色弧线（.ah-orbit 的 conic 弧）。
            // 这里做兜底：过了 1.4 秒还没有人清，就强制清掉。
            if (hud && hud.classList && typeof hud.classList.contains === 'function') {
              if (sweepUntil && Date.now() > sweepUntil && hud.classList.contains('astral-sweeping')) {
                hud.classList.remove('astral-sweeping');
              }
            }
            const el = document.querySelector('[class*="_buildVersion"]');
            if (!el) return;
            const want = 'v' + VERSION + ' · 夜航';
            if (el.getAttribute('data-astral-stamp') !== want) {
              el.textContent = want;
              el.setAttribute('data-astral-stamp', want);
            }
          } catch (err) { /* 没有这个节点就算了 */ }
        };
        stampVersion();
        stampTimer = setInterval(stampVersion, 1500);
        // 测试桩里 setInterval 会吊住进程，unref 让它不阻塞退出。
        if (stampTimer && typeof stampTimer.unref === 'function') stampTimer.unref();

        // 切换时让星轨扫一遍。hud 不在（测试桩/非浏览器）就什么都不做。
        const sweep = () => {
          if (!hud || !hud.classList) return;
          try {
            // 雾色跟着"要去的那一侧"走：切去夜航是一团深蓝，切去晨昏是一团暖白。
            if (hud.style && typeof hud.style.setProperty === 'function') {
              hud.style.setProperty(
                '--astral-veil',
                'rgba(8,12,24,0.62)'
              );
            }
            hud.classList.remove('astral-sweeping');
            // 强制一次重排，让同一段动画可以立刻重放（连点两次不会吞掉第二下）。
            if (typeof hud.offsetWidth === 'number') void hud.offsetWidth;
            hud.classList.add('astral-sweeping');
            sweepUntil = Date.now() + 1400;
            setTimeout(() => {
              try { hud.classList.remove('astral-sweeping'); } catch (err) { /* 忽略 */ }
            }, 1150);
          } catch (err) { /* 忽略 */ }
        };

        // ---- 顶层色调罩 ----
        // token 能覆盖的只有"用变量写颜色的地方"；剩下的硬编码颜色遍布设置页、插件市场、
        // 各种弹层。与其一个个改，不如在最上层盖一张几乎看不见的染色玻璃：一次管全部。
        let wash = null;
        try {
          const layer = document.createElement('div');
          if (layer && typeof layer.setAttribute === 'function') {
            layer.className = 'astral-wash';
            layer.setAttribute('aria-hidden', 'true');
            const washHost = document.body || document.documentElement;
            if (washHost && typeof washHost.appendChild === 'function') {
              washHost.appendChild(layer);
              wash = layer;
            }
          }
        } catch (err) {
          console.warn('[astral] 色调罩挂载失败：', err);
        }

        // 右缘那颗切换钮已移除（误触会把装饰全关掉），入口只剩 Ctrl+Alt+T 与双击品牌区。
        let sw = null;

        /**
         * 把用户选的图缩到 1920 宽、转成 JPEG，再存 localStorage。
         * 不这么做的话一张 4K 壁纸 base64 之后直接顶爆 5MB 配额。
         */
        const pickUserBg = (file) => {
          if (!file || typeof file.type !== 'string' || file.type.indexOf('image/') !== 0) return;
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              try {
                const max = 1920;
                const iw = img.width || max;
                const ih = img.height || max;
                const scale = Math.min(1, max / Math.max(iw, ih));
                const w = Math.max(1, Math.round(iw * scale));
                const h = Math.max(1, Math.round(ih * scale));
                const cv = document.createElement('canvas');
                cv.width = w;
                cv.height = h;
                cv.getContext('2d').drawImage(img, 0, 0, w, h);
                const data = cv.toDataURL('image/jpeg', 0.82);
                if (writeUserBg(data)) {
                  if (bgRow) bgRow.classList.add('on');
                  paint();
                  console.info('[astral] 底图已换成本地图片（侧栏「背景图」里可还原）');
                }
              } catch (err) {
                console.warn('[astral] 底图处理失败：', err);
              }
            };
            img.onerror = () => console.warn('[astral] 底图解码失败');
            img.src = String(reader.result);
          };
          reader.onerror = () => console.warn('[astral] 底图读取失败');
          reader.readAsDataURL(file);
        };

        // ---- 底图入口 ----
        // 挂在 设置 → 通用 的最后一行。宿主的通用页把每个偏好项包在
        // [data-slot="settings.general.item"] 里，父节点就是那个纵向列表容器，
        // 所以直接往里追加一个同版式的行即可，不需要 React、也不占侧栏。
        let bgRow = null;
        let bgInput = null;
        let bgModal = null;
        let bgEsc = null;

        const syncBgRow = () => {
          if (!bgRow) return;
          const has = !!readUserBg();
          const reset = typeof bgRow.querySelector === 'function'
            ? bgRow.querySelector('[data-act="reset"]') : null;
          const note = typeof bgRow.querySelector === 'function'
            ? bgRow.querySelector('.astral-setrow-note') : null;
          if (reset) reset.disabled = !has;
          if (note) {
            note.textContent = has
              ? '当前：你选的本地图片。只存在这台电脑的浏览器里，不会上传。'
              : '默认使用主题自带底图。换成自己的图片只保存在本机浏览器，不会上传。';
          }
        };

        const ensureBgInput = () => {
          if (bgInput) return bgInput;
          try {
            const input = document.createElement('input');
            if (!input || typeof input.setAttribute !== 'function') return null;
            input.type = 'file';
            input.accept = 'image/*';
            input.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';
            input.addEventListener('change', () => {
              const file = input.files && input.files[0];
              input.value = '';
              if (file) {
                pickUserBg(file);
                closeBgModal();
              }
            });
            const host0 = document.body || document.documentElement;
            if (host0 && typeof host0.appendChild === 'function') host0.appendChild(input);
            bgInput = input;
          } catch (err) {
            console.warn('[astral] 文件选择器创建失败：', err);
          }
          return bgInput;
        };

        const clearUserBg = () => {
          writeUserBg('');
          syncBgRow();
          paint();
        };

        const closeBgModal = () => {
          if (bgModal) bgModal.classList.remove('on');
          if (bgEsc) {
            document.removeEventListener('keydown', bgEsc);
            bgEsc = null;
          }
        };

        const openBgModal = () => {
          if (!bgModal) return;
          syncBgRow();
          bgModal.classList.add('on');
          if (!bgEsc) {
            bgEsc = (ev) => { if (ev && ev.key === 'Escape') closeBgModal(); };
            document.addEventListener('keydown', bgEsc);
          }
        };

        const mountBgEntry = () => {
          try {
            if (typeof document.querySelectorAll !== 'function') return;
            // 热重载会留下上一版实例的节点（旧版是侧栏那行 .astral-entry），
            // 每个实例各挂一个，屏幕上就叠出好几行。先清干净再挂。
            const staleOld = document.querySelectorAll('.astral-entry');
            for (let i = 0; i < staleOld.length; i++) {
              const n = staleOld[i];
              if (n && typeof n.remove === 'function') n.remove();
            }
            const staleMine = document.querySelectorAll('[data-astral-setrow]');
            for (let i = 0; i < staleMine.length; i++) {
              const n = staleMine[i];
              if (n && n !== bgRow && typeof n.remove === 'function') n.remove();
            }
          } catch (err) {
            console.warn('[astral] 旧入口清理失败：', err);
          }
          if (bgRow && bgRow.isConnected !== false) { syncBgRow(); return; }
          try {
            if (typeof document.querySelectorAll !== 'function') return;
            const items = document.querySelectorAll('[data-slot="settings.general.item"]');
            if (!items || !items.length) return;
            const hostEl = items[items.length - 1].parentElement;
            if (!hostEl || typeof hostEl.appendChild !== 'function') return;
            const row = document.createElement('div');
            if (!row || typeof row.setAttribute !== 'function') return;
            row.className = 'astral-setrow';
            row.setAttribute('data-astral-setrow', '1');
            row.innerHTML =
              '<div class="astral-setrow-tx">' +
                '<b>背景图</b>' +
                '<span class="astral-setrow-note"></span>' +
              '</div>' +
              '<div class="astral-setrow-acts">' +
                '<button type="button" class="astral-btn" data-act="reset">还原默认</button>' +
                '<button type="button" class="astral-btn" data-primary="1" data-act="pick">更换图片…</button>' +
              '</div>';
            row.addEventListener('click', (ev) => {
              const target = ev && ev.target;
              const act = target && typeof target.getAttribute === 'function'
                ? target.getAttribute('data-act') : null;
              if (act === 'pick') openBgModal();
              else if (act === 'reset') clearUserBg();
            });
            hostEl.appendChild(row);
            bgRow = row;
            syncBgRow();
          } catch (err) {
            console.warn('[astral] 底图入口挂载失败：', err);
          }
        };

        const buildBgModal = () => {
          if (bgModal) return;
          try {
            const host0 = document.body || document.documentElement;
            if (!host0 || typeof host0.appendChild !== 'function') return;
            const wrap = document.createElement('div');
            if (!wrap || typeof wrap.setAttribute !== 'function') return;
            wrap.className = 'astral-modal';
            wrap.innerHTML =
              '<div class="astral-modal-card" role="dialog" aria-modal="true">' +
                '<h3>对话区背景图</h3>' +
                '<p>把对话区背后那张图换成你自己的。图片只保存在这台电脑的浏览器里，' +
                '不会上传到任何服务器，也不会跟着主题包发给别人。</p>' +
                '<ul>' +
                  '<li>支持 JPG / PNG / WebP；选完会自动压到长边 1920 再存</li>' +
                  '<li>建议横图（16:9 左右），暗部多、主体偏一侧的图最不挡字</li>' +
                  '<li>图片占用浏览器本地存储，约 5MB 上限；太大的图会提示存不下</li>' +
                  '<li>想回到主题自带底图，点「还原默认底图」</li>' +
                '</ul>' +
                '<div class="astral-modal-acts">' +
                  '<button type="button" class="astral-modal-reset">还原默认底图</button>' +
                  '<button type="button" class="astral-modal-close">关闭</button>' +
                  '<button type="button" class="primary astral-modal-pick">选择图片…</button>' +
                '</div>' +
              '</div>';
            const q = (sel) => (typeof wrap.querySelector === 'function' ? wrap.querySelector(sel) : null);
            const pick = q('.astral-modal-pick');
            const reset = q('.astral-modal-reset');
            const closer = q('.astral-modal-close');
            if (pick) pick.addEventListener('click', () => {
              const input = ensureBgInput();
              if (input && typeof input.click === 'function') input.click();
            });
            if (reset) reset.addEventListener('click', () => { clearUserBg(); closeBgModal(); });
            if (closer) closer.addEventListener('click', closeBgModal);
            wrap.addEventListener('click', (ev) => { if (ev && ev.target === wrap) closeBgModal(); });
            host0.appendChild(wrap);
            bgModal = wrap;
          } catch (err) {
            console.warn('[astral] 底图面板创建失败：', err);
          }
        };

        buildBgModal();
        mountEntryRef = mountBgEntry;
        mountBgEntry();

        const desiredId = () => NIGHT_ID;

        /**
         * 决定"这块界面是什么颜色"的变量，不再只靠 <style> 里的属性选择器下发。
         * 属性选择器会受旧实例残留、宿主重排属性影响，一旦和 token 层不同步，
         * 就会出现"页面是夜航、消息卡片却是晨昏的白"这种撕开的状态。
         * 这里在 paint() 里用内联样式写一遍：优先级最高，且和 dataset 原子同步。
         */
        const SURFACE_VARS = {
          night: {
            '--astral-msg-bg': '#141E33',
            '--astral-msg-border': 'rgba(227,194,126,0.30)',
            '--astral-msg-accent': 'rgba(227,194,126,0.62)',
            '--astral-msg-text': '#E9ECF5',
            '--astral-glass': '#0B1220',
            '--astral-frame': '#1A2337',
            '--astral-frame-line': 'rgba(227,194,126,0.22)',
            '--astral-user-bg': '#1B2130',
            '--astral-hud-line': 'rgba(227,194,126,0.58)',
            '--astral-bg-photo': BG_NIGHT,
          },
        };
        const SURFACE_VAR_NAMES = Object.keys(SURFACE_VARS.night);

        /**
         * 自备底图。图只存在浏览器 localStorage 里，不进仓库、不进产物：
         * 想用官方立绘/壁纸就自己选一张，插件本身不携带任何第三方素材。
         */
        const USER_BG_KEY = 'dsh.astral.bg';
        const readUserBg = () => {
          try {
            const v = window.localStorage.getItem(USER_BG_KEY);
            return typeof v === 'string' && v.indexOf('data:image/') === 0 ? v : '';
          } catch (err) {
            return '';
          }
        };
        const writeUserBg = (value) => {
          try {
            if (value) window.localStorage.setItem(USER_BG_KEY, value);
            else window.localStorage.removeItem(USER_BG_KEY);
            return true;
          } catch (err) {
            console.warn('[astral] 底图存不进 localStorage（可能超出配额）：', err);
            return false;
          }
        };

        const applySurfaceVars = (mode) => {
          const table = SURFACE_VARS[mode];
          if (!table || !root || !root.style || typeof root.style.setProperty !== 'function') {
            return;
          }
          for (const name of SURFACE_VAR_NAMES) {
            root.style.setProperty(name, table[name]);
          }
          // 用户自选的底图覆盖两套自带照片；没有就回到随模式变化的那张。
          const userBg = readUserBg();
          if (userBg) {
            root.style.setProperty('--astral-bg-photo', 'url("' + userBg + '")');
          }
        };

        const clearSurfaceVars = () => {
          if (!root || !root.style || typeof root.style.removeProperty !== 'function') return;
          for (const name of SURFACE_VAR_NAMES) root.style.removeProperty(name);
        };


        /**
         * 只负责"画"：dataset.astral 由本地模式决定，不看 preference。
         * 宿主任何一次 adopt() 把 preference 拉回 light/dark 时，这里的颜色不变。
         */
        const paint = () => {
          const mode = readMode();
          if (mode !== 'night') {
            delete root.dataset.astral;
            clearSurfaceVars();
            return;
          }
          // 关键：上色**不依赖主题注册是否成功**。
          // 以前这里的条件是 state.night 为真才画，而这个值只在
          // register() 成功之后才有。热重载时旧实例还占着 id，新实例注册失败 →
          // ready 为假 → 连 dataset 都不设 → 整套装饰一次性消失，控制台还不一定报错。
          // 现在只要 mode 是 night 就上色：CSS 那层自带全部 --dsw token，
          // 注册失败顶多丢掉宿主组件的一部分变量，不会变成"什么都没了"。
          const ready = state.night;
          if (!ready) {
            // 注册还没成功，先按 mode 画，等注册成功了再补一次 paint（见 ensureRegistered）。
            root.dataset.astral = NIGHT_ID;
            applySurfaceVars(mode);
            lockScheme();
            watchScheme();
            return;
          }
          // 上色只看本地存下的 mode（night/off），不看宿主当前偏好是谁。
          // 早先这里是"别人注册的主题生效就整体让位"，结果 dsh-theme-endfield 这类
          // 自动挂载的包一装，星穹的装饰就整套消失，用户以为插件坏了。
          // 现在 CSS 层永远按 mode 上色；要不要把宿主偏好抢回来由 reassert() 判断。
          root.dataset.astral = desiredId();
          applySurfaceVars(mode);
          if (sw && typeof sw.innerHTML === 'string') {
            sw.innerHTML = mode === 'night' ? '<i>\u2726</i>' : '<i>\u25CB</i>';
            sw.setAttribute(
              'title',
              mode === 'night' ? '切到晨昏（Ctrl+Alt+T）' : '切到夜航（Ctrl+Alt+T）',
            );
          }
          lockScheme();
          watchScheme();
        };

        /**
         * 自愈：<html> 上的 dataset.astral 是整套装饰的总开关。
         * 宿主重排、别的插件动过根节点属性、或一次热重载把它摘掉时，
         * 装饰会整片消失而控制台什么都不报。这里每 1.5 秒对一次账，
         * 缺了就补回去，不必让用户再按一次开关。
         */
        healRef = () => {
          const mode = readMode();
          const want = mode === 'night' ? NIGHT_ID : '';
          const have = root.dataset.astral || '';
          if (have === want) return;
          if (want) root.dataset.astral = want;
          else delete root.dataset.astral;
          if (want) {
            applySurfaceVars(mode);
            lockScheme();
          }
        };

        const BUILTIN_IDS = ['system', 'light', 'dark'];

        const activeThemeId = () => {
          try {
            const snapshot = ctx.theme.getTheme();
            return snapshot && snapshot.active ? snapshot.active.id : '';
          } catch (err) {
            return '';
          }
        };

        /**
         * 宿主的组件样式大量挂在 body[data-ds-dark-theme] 上，而那个属性由宿主的内置
         * 偏好决定，每写一次设置都会被它重刷。只在 paint() 里钉一次会被覆盖，
         * 于是出现"聊天区是夜航、输入框却是浅色"这种撕裂。这里把颜色模式钉死。
         */
        function lockScheme() {
          const mode = readMode();
          if (mode !== 'night') return;
          const body = document.body;
          if (!body || typeof body.hasAttribute !== 'function') return;
          const want = true;
          if (body.hasAttribute('data-ds-dark-theme') === want) return;
          if (want) body.setAttribute('data-ds-dark-theme', '');
          else body.removeAttribute('data-ds-dark-theme');
        }

        /** 宿主一旦把颜色模式改回去，立刻改回来。只监听这一个属性，不碰 DOM 结构。 */
        let schemeObserver = null;
        function watchScheme() {
          if (schemeObserver || typeof MutationObserver !== 'function') return;
          const body = document.body;
          if (!body || typeof body.hasAttribute !== 'function') return;
          try {
            schemeObserver = new MutationObserver(() => {
              lockScheme();
            });
            schemeObserver.observe(body, {
              attributes: true,
              attributeFilter: ['data-ds-dark-theme'],
            });
          } catch (err) {
            schemeObserver = null;
          }
        }

        /**
         * 把宿主偏好也拉回来：偏好只影响宿主的 color-scheme 与非 var 规则，
         * 但偏好漂移会让深浅两套内置样式和数据属性打架，所以顺带纠正。
         * - 只纠正被拉回内置值的情况；别的插件注册的主题一律让位，不抢。
         * - 限流：一分钟最多 12 次，防宿主死循环回写时把页面拖死。
         */
        let restores = 0;
        let windowStart = Date.now();
        const reassert = () => {
          const mode = readMode();
          if (mode === 'off') return;
          const id = desiredId();
          if (!owned(id)) return;
          const preference = ctx.theme.getTheme().preference;
          if (preference === id) return;
          // 只纠正"宿主把我们拉回内置值"的情况；但切换我们自己的两套之间时必须放行，
          // 否则会出现"CSS 变量已经切到晨昏、注册的 token 还停在夜航"——
          // 卡片变成晨昏的白底、字却还是夜航的浅色，正好是"只切换了对话框"的样子。
          const ours = owned(preference);
          if (!ours && preference !== 'system' && preference !== 'light' && preference !== 'dark') {
            return;
          }
          const now = Date.now();
          if (now - windowStart > 60000) {
            windowStart = now;
            restores = 0;
          }
          if (restores >= 12) return;
          restores += 1;
          try {
            ctx.theme.setTheme(id);
          } catch (err) {
            console.warn('[astral] 启用失败：', err);
          }
        };

        /**
         * 主题只有一个，切换已成历史。保留这个空函数是因为 theme/change 的订阅还在调它：
         * 真正的颜色由 paint() 按 mode 决定，宿主偏好换成谁都影响不到画面。
         */
        const adoptFromTheme = () => { /* no-op：唯一模式，无需跟随偏好 */ };

        // 开关已取消：主题没有 off 状态，停用请走插件管理器，不会再出现"按了什么就全没了"。


        // 事件是同步派发的，嵌套 publish 不安全，所以合并到下一个宏任务执行。
        let pending = 0;
        const schedule = () => {
          if (pending) return;
          pending = setTimeout(() => {
            pending = 0;
            ensureRegistered();
            paint();
            reassert();
          }, 60);
        };

        ensureRegistered();
        paint();
        // 在控制台打一行版本号：以后"到底加载没加载、加载的是哪一版"一眼就能看出来，
        // 不用靠猜页面颜色。
        console.info(
          '[astral] 主题已加载 v' + VERSION +
            ' · 图标 ' + Object.keys(ICONS).length + ' 个 · 模式 ' + readMode(),
        );
        // 启动就夺一次，别等到 1.2 秒后：这中间画面会先用宿主的深色/浅色。
        reassert();

        ctx.effect(
          () => () => {
            try {
              style.remove();
            } catch (err) {
              console.warn('[astral] 样式回收失败：', err);
            }
            try {
              if (hud) hud.remove();
            } catch (err) {
              console.warn('[astral] HUD 回收失败：', err);
            }
            if (chatObserver) {
              try {
                chatObserver.disconnect();
            if (stampTimer) { clearInterval(stampTimer); stampTimer = null; }
              } catch (err) {
                console.warn('[astral] 编号监听回收失败：', err);
              }
              chatObserver = null;
            }
            if (numberTimer) {
              clearTimeout(numberTimer);
              numberTimer = null;
            }
            if (schemeObserver) {
              try {
                schemeObserver.disconnect();
              } catch (err) {
                console.warn('[astral] 颜色模式监听回收失败：', err);
              }
              schemeObserver = null;
            }
            try {
              if (wash) wash.remove();
            } catch (err) {
              console.warn('[astral] 色调罩回收失败：', err);
            }
            try {
              if (sw) sw.remove();
            } catch (err) {
              console.warn('[astral] 切换钮回收失败：', err);
            }
            try {
              if (bgRow) bgRow.remove();
              if (bgInput) bgInput.remove();
              if (bgModal) bgModal.remove();
              if (bgEsc) document.removeEventListener('keydown', bgEsc);
              mountEntryRef = null;
            } catch (err) {
              console.warn('[astral] 底图入口回收失败：', err);
            }
            // 热重载时的经典时序：新实例先上色，旧实例随后卸载并清场 → 刚画好的东西被抹掉。
            // 表现就是右下角闪一下金色渐晕、随后整页变灰。只有自己仍是当前实例时才清 DOM。
            if (stillOwner()) {
              delete root.dataset.astral;
              clearSurfaceVars();
            }
            while (disposers.length) {
              const dispose = disposers.pop();
              try {
                dispose();
              } catch (err) {
                console.warn('[astral] 主题卸载失败：', err);
              }
            }
          },
          'astral: theme registration',
        );

        // 宿主每次写设置（换模型、装/卸插件、改字号）都会 adopt() 并派发 theme/change，
        // 这里跟着重画 + 纠正，而不是在事件里无条件反写。
        ctx.on('theme/change', () => {
          adoptFromTheme();
          schedule();
        });

        // 切回标签页时补一次：后台被 adopt 掉的情况在这里收口。
        const onVisible = () => {
          if (!document.hidden) schedule();
        };
        document.addEventListener('visibilitychange', onVisible);
        ctx.effect(
          () => () => document.removeEventListener('visibilitychange', onVisible),
          'astral: visibility listener',
        );

        // 连接建立后宿主才拿到耐久偏好，所以在启动窗口里补两次。
        const bootTimers = [setTimeout(schedule, 1200), setTimeout(schedule, 4000)];
        ctx.effect(
          () => () => {
            for (const timer of bootTimers) clearTimeout(timer);
            clearTimeout(retryTimer);
            clearTimeout(pending);
          },
          'astral: timers',
        );
      },
    };
  },
});