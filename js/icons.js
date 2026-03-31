// ============================================
// 2.5D 图标渲染引擎
// ============================================

const IconRenderer = {
  cache: {},

  // 获取预渲染的图标Canvas
  get(iconId, size) {
    const key = iconId + '_' + size;
    if (this.cache[key]) return this.cache[key];
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    this.draw(ctx, iconId, size);
    this.cache[key] = c;
    return c;
  },

  // 获取Data URL (用于HTML img)
  url(iconId, size) {
    return this.get(iconId, size).toDataURL();
  },

  // 核心绘制
  draw(ctx, iconId, size) {
    const def = ICON_DEFS[iconId];
    if (!def) { this.drawFallback(ctx, size); return; }

    const s = size;
    const hs = s / 2;
    ctx.save();
    ctx.translate(hs, hs);

    // 2.5D 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(s * 0.03, s * 0.38, s * 0.32, s * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2.5D 底座侧面
    const baseW = s * 0.7, baseH = s * 0.12;
    const baseY = s * 0.15;
    ctx.fillStyle = this.darken(def.bg, 0.4);
    ctx.beginPath();
    ctx.moveTo(-baseW / 2, baseY);
    ctx.lineTo(-baseW / 2, baseY + baseH);
    ctx.quadraticCurveTo(0, baseY + baseH + s * 0.06, baseW / 2, baseY + baseH);
    ctx.lineTo(baseW / 2, baseY);
    ctx.closePath();
    ctx.fill();

    // 2.5D 底座顶面
    const topGrad = ctx.createLinearGradient(-baseW / 2, baseY - s * 0.03, baseW / 2, baseY + s * 0.03);
    topGrad.addColorStop(0, this.lighten(def.bg, 0.2));
    topGrad.addColorStop(1, def.bg);
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.ellipse(0, baseY, baseW / 2, s * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();

    // 主体背景圆
    const bodyR = s * 0.3;
    const bodyY = -s * 0.06;
    const bodyGrad = ctx.createRadialGradient(-s * 0.06, bodyY - s * 0.08, 0, 0, bodyY, bodyR);
    bodyGrad.addColorStop(0, this.lighten(def.bg, 0.35));
    bodyGrad.addColorStop(0.7, def.bg);
    bodyGrad.addColorStop(1, this.darken(def.bg, 0.3));
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, bodyY, bodyR, 0, Math.PI * 2);
    ctx.fill();

    // 外发光
    ctx.shadowColor = def.bg;
    ctx.shadowBlur = s * 0.15;
    ctx.strokeStyle = this.lighten(def.bg, 0.3);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, bodyY, bodyR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 高光
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.ellipse(-s * 0.06, bodyY - s * 0.12, bodyR * 0.5, bodyR * 0.3, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // 绘制符号
    ctx.save();
    ctx.translate(0, bodyY);
    const symScale = bodyR * 0.55;
    const symFn = SYMBOLS[def.symbol];
    if (symFn) {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = s * 0.02;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      symFn(ctx, symScale);
    }
    ctx.restore();

    ctx.restore();
  },

  drawFallback(ctx, s) {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#888';
    ctx.font = `${s * 0.4}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('?', s / 2, s / 2);
  },

  darken(hex, amt) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.round(r * (1 - amt))},${Math.round(g * (1 - amt))},${Math.round(b * (1 - amt))})`;
  },

  lighten(hex, amt) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.min(255, Math.round(r + (255 - r) * amt))},${Math.min(255, Math.round(g + (255 - g) * amt))},${Math.min(255, Math.round(b + (255 - b) * amt))})`;
  }
};

// ============================================
// 符号绘制函数 (ctx, s=缩放因子)
// 所有符号在 (-s, -s) 到 (s, s) 范围内绘制
// ============================================
const SYMBOLS = {

  // ---- 图表/数据 ----
  chart(ctx, s) {
    const bars = [-0.5, 0, 0.5];
    const heights = [0.4, 0.7, 0.55];
    ctx.lineWidth = s * 0.15;
    bars.forEach((x, i) => {
      ctx.beginPath();
      ctx.moveTo(x * s, s * 0.5);
      ctx.lineTo(x * s, s * (0.5 - heights[i]));
      ctx.stroke();
    });
  },

  chartUp(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.6, s * 0.4);
    ctx.lineTo(-s * 0.1, -s * 0.1);
    ctx.lineTo(s * 0.2, s * 0.15);
    ctx.lineTo(s * 0.6, -s * 0.5);
    ctx.stroke();
    // 箭头
    ctx.beginPath();
    ctx.moveTo(s * 0.35, -s * 0.5);
    ctx.lineTo(s * 0.6, -s * 0.5);
    ctx.lineTo(s * 0.6, -s * 0.25);
    ctx.stroke();
  },

  chartDown(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.6, -s * 0.4);
    ctx.lineTo(-s * 0.1, -s * 0.05);
    ctx.lineTo(s * 0.2, -s * 0.2);
    ctx.lineTo(s * 0.6, s * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.35, s * 0.5);
    ctx.lineTo(s * 0.6, s * 0.5);
    ctx.lineTo(s * 0.6, s * 0.25);
    ctx.stroke();
  },

  // ---- 人物 ----
  person(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, -s * 0.35, s * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.15);
    ctx.lineTo(0, s * 0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, s * 0.0);
    ctx.lineTo(s * 0.35, s * 0.0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, s * 0.25);
    ctx.lineTo(-s * 0.25, s * 0.55);
    ctx.moveTo(0, s * 0.25);
    ctx.lineTo(s * 0.25, s * 0.55);
    ctx.stroke();
  },

  people(ctx, s) {
    [-s * 0.3, 0, s * 0.3].forEach((x, i) => {
      const sc = i === 1 ? 0.7 : 0.5;
      ctx.beginPath();
      ctx.arc(x, -s * 0.15 * sc - s * 0.1, s * 0.12 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, -s * 0.1 + s * 0.1 * sc);
      ctx.lineTo(x, s * 0.3 * sc + s * 0.05);
      ctx.stroke();
    });
  },

  // ---- 基础符号 ----
  question(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, -s * 0.2, s * 0.25, Math.PI * 1.2, Math.PI * 0.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.05, -s * 0.0);
    ctx.lineTo(0, s * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, s * 0.38, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  },

  check(ctx, s) {
    ctx.lineWidth = s * 0.18;
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, s * 0.0);
    ctx.lineTo(-s * 0.1, s * 0.35);
    ctx.lineTo(s * 0.45, -s * 0.35);
    ctx.stroke();
  },

  cross(ctx, s) {
    ctx.lineWidth = s * 0.15;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.3);
    ctx.lineTo(s * 0.3, s * 0.3);
    ctx.moveTo(s * 0.3, -s * 0.3);
    ctx.lineTo(-s * 0.3, s * 0.3);
    ctx.stroke();
  },

  star(ctx, s) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI / 5) - Math.PI / 2;
      const r = s * 0.55;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  },

  target(ctx, s) {
    [0.5, 0.32, 0.14].forEach(r => {
      ctx.beginPath();
      ctx.arc(0, 0, s * r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  },

  bolt(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(s * 0.1, -s * 0.6);
    ctx.lineTo(-s * 0.15, -s * 0.05);
    ctx.lineTo(s * 0.1, -s * 0.05);
    ctx.lineTo(-s * 0.1, s * 0.6);
    ctx.stroke();
    ctx.fill();
  },

  // ---- 物品 ----
  document(ctx, s) {
    ctx.strokeRect(-s * 0.3, -s * 0.45, s * 0.6, s * 0.9);
    [-0.2, 0, 0.2].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(-s * 0.15, s * y);
      ctx.lineTo(s * 0.15, s * y);
      ctx.stroke();
    });
  },

  clipboard(ctx, s) {
    ctx.strokeRect(-s * 0.35, -s * 0.35, s * 0.7, s * 0.8);
    ctx.fillRect(-s * 0.12, -s * 0.45, s * 0.24, s * 0.15);
    [-0.1, 0.1, 0.3].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(-s * 0.18, s * y);
      ctx.lineTo(s * 0.18, s * y);
      ctx.stroke();
    });
  },

  book(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.lineTo(-s * 0.5, -s * 0.3);
    ctx.lineTo(-s * 0.5, s * 0.45);
    ctx.lineTo(0, s * 0.3);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.lineTo(s * 0.5, -s * 0.3);
    ctx.lineTo(s * 0.5, s * 0.45);
    ctx.lineTo(0, s * 0.3);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.lineTo(0, s * 0.3);
    ctx.stroke();
  },

  scroll(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.5);
    ctx.lineTo(-s * 0.3, s * 0.35);
    ctx.arc(-s * 0.15, s * 0.35, s * 0.15, Math.PI, 0, true);
    ctx.lineTo(0, -s * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-s * 0.15, -s * 0.5, s * 0.15, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.1, -s * 0.2);
    ctx.lineTo(s * 0.35, -s * 0.2);
    ctx.moveTo(s * 0.1, 0);
    ctx.lineTo(s * 0.35, 0);
    ctx.stroke();
  },

  // ---- 工具 ----
  gear(ctx, s) {
    const teeth = 8, outer = s * 0.5, inner = s * 0.35;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.35) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a4 = ((i + 0.85) / teeth) * Math.PI * 2;
      ctx.lineTo(Math.cos(a1) * outer, Math.sin(a1) * outer);
      ctx.lineTo(Math.cos(a2) * outer, Math.sin(a2) * outer);
      ctx.lineTo(Math.cos(a3) * inner, Math.sin(a3) * inner);
      ctx.lineTo(Math.cos(a4) * inner, Math.sin(a4) * inner);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  },

  wrench(ctx, s) {
    ctx.lineWidth = s * 0.12;
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, s * 0.4);
    ctx.lineTo(s * 0.2, -s * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.28, -s * 0.28, s * 0.18, 0, Math.PI * 2);
    ctx.stroke();
  },

  magnify(ctx, s) {
    ctx.beginPath();
    ctx.arc(-s * 0.1, -s * 0.1, s * 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = s * 0.1;
    ctx.beginPath();
    ctx.moveTo(s * 0.1, s * 0.12);
    ctx.lineTo(s * 0.45, s * 0.45);
    ctx.stroke();
  },

  // ---- 建筑/结构 ----
  wall(ctx, s) {
    ctx.strokeRect(-s * 0.45, -s * 0.35, s * 0.45, s * 0.3);
    ctx.strokeRect(0, -s * 0.35, s * 0.45, s * 0.3);
    ctx.strokeRect(-s * 0.22, -s * 0.05, s * 0.45, s * 0.3);
    ctx.strokeRect(-s * 0.45, s * 0.25, s * 0.32, s * 0.25);
    ctx.strokeRect(-s * 0.13, s * 0.25, s * 0.58, s * 0.25);
  },

  shield(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.quadraticCurveTo(s * 0.5, -s * 0.35, s * 0.45, s * 0.05);
    ctx.quadraticCurveTo(s * 0.35, s * 0.4, 0, s * 0.55);
    ctx.quadraticCurveTo(-s * 0.35, s * 0.4, -s * 0.45, s * 0.05);
    ctx.quadraticCurveTo(-s * 0.5, -s * 0.35, 0, -s * 0.5);
    ctx.closePath();
    ctx.stroke();
  },

  door(ctx, s) {
    ctx.strokeRect(-s * 0.3, -s * 0.5, s * 0.6, s * 1.0);
    ctx.beginPath();
    ctx.arc(-s * 0.3 + s * 0.3, -s * 0.5, s * 0.3, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.12, s * 0.1, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
  },

  building(ctx, s) {
    ctx.strokeRect(-s * 0.35, -s * 0.1, s * 0.7, s * 0.6);
    ctx.beginPath();
    ctx.moveTo(-s * 0.45, -s * 0.1);
    ctx.lineTo(0, -s * 0.5);
    ctx.lineTo(s * 0.45, -s * 0.1);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeRect(-s * 0.1, s * 0.15, s * 0.2, s * 0.35);
  },

  temple(ctx, s) {
    // 柱子
    [-s * 0.3, -s * 0.1, s * 0.1, s * 0.3].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, -s * 0.15);
      ctx.lineTo(x, s * 0.4);
      ctx.stroke();
    });
    ctx.strokeRect(-s * 0.4, -s * 0.2, s * 0.8, s * 0.08);
    ctx.strokeRect(-s * 0.4, s * 0.4, s * 0.8, s * 0.08);
    ctx.beginPath();
    ctx.moveTo(-s * 0.45, -s * 0.2);
    ctx.lineTo(0, -s * 0.5);
    ctx.lineTo(s * 0.45, -s * 0.2);
    ctx.closePath();
    ctx.stroke();
  },

  // ---- 自然/元素 ----
  fire(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55);
    ctx.quadraticCurveTo(s * 0.35, -s * 0.3, s * 0.3, s * 0.1);
    ctx.quadraticCurveTo(s * 0.25, s * 0.45, 0, s * 0.5);
    ctx.quadraticCurveTo(-s * 0.25, s * 0.45, -s * 0.3, s * 0.1);
    ctx.quadraticCurveTo(-s * 0.35, -s * 0.3, 0, -s * 0.55);
    ctx.closePath();
    ctx.fill();
    // 内焰
    ctx.save();
    ctx.fillStyle = 'rgba(255,200,50,0.6)';
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.2);
    ctx.quadraticCurveTo(s * 0.15, 0, s * 0.1, s * 0.2);
    ctx.quadraticCurveTo(0, s * 0.35, -s * 0.1, s * 0.2);
    ctx.quadraticCurveTo(-s * 0.15, 0, 0, -s * 0.2);
    ctx.fill();
    ctx.restore();
  },

  wave(ctx, s) {
    [-0.25, 0, 0.25].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, s * y);
      ctx.quadraticCurveTo(-s * 0.25, s * y - s * 0.15, 0, s * y);
      ctx.quadraticCurveTo(s * 0.25, s * y + s * 0.15, s * 0.5, s * y);
      ctx.stroke();
    });
  },

  sprout(ctx, s) {
    ctx.lineWidth = s * 0.08;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.5);
    ctx.quadraticCurveTo(0, -s * 0.1, 0, -s * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.05);
    ctx.quadraticCurveTo(s * 0.35, -s * 0.35, s * 0.15, -s * 0.5);
    ctx.quadraticCurveTo(0, -s * 0.3, 0, -s * 0.05);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, s * 0.15);
    ctx.quadraticCurveTo(-s * 0.3, -s * 0.1, -s * 0.15, -s * 0.3);
    ctx.quadraticCurveTo(0, -s * 0.05, 0, s * 0.15);
    ctx.fill();
  },

  snowflake(ctx, s) {
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate(i * Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -s * 0.5);
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(-s * 0.12, -s * 0.42);
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(s * 0.12, -s * 0.42);
      ctx.stroke();
      ctx.restore();
    }
  },

  // ---- 交互/动作 ----
  rocket(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55);
    ctx.quadraticCurveTo(s * 0.25, -s * 0.2, s * 0.2, s * 0.3);
    ctx.lineTo(-s * 0.2, s * 0.3);
    ctx.quadraticCurveTo(-s * 0.25, -s * 0.2, 0, -s * 0.55);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    // 窗口
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(0, -s * 0.1, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // 火焰
    ctx.beginPath();
    ctx.moveTo(-s * 0.12, s * 0.3);
    ctx.lineTo(0, s * 0.55);
    ctx.lineTo(s * 0.12, s * 0.3);
    ctx.stroke();
  },

  trophy(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.45);
    ctx.lineTo(-s * 0.3, -s * 0.1);
    ctx.quadraticCurveTo(-s * 0.3, s * 0.2, 0, s * 0.2);
    ctx.quadraticCurveTo(s * 0.3, s * 0.2, s * 0.3, -s * 0.1);
    ctx.lineTo(s * 0.3, -s * 0.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, s * 0.2);
    ctx.lineTo(0, s * 0.35);
    ctx.stroke();
    ctx.strokeRect(-s * 0.2, s * 0.35, s * 0.4, s * 0.1);
    // 把手
    ctx.beginPath();
    ctx.arc(-s * 0.3, -s * 0.2, s * 0.12, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.3, -s * 0.2, s * 0.12, Math.PI * 0.5, -Math.PI * 0.5);
    ctx.stroke();
  },

  crown(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.45, s * 0.3);
    ctx.lineTo(-s * 0.4, -s * 0.2);
    ctx.lineTo(-s * 0.2, s * 0.05);
    ctx.lineTo(0, -s * 0.4);
    ctx.lineTo(s * 0.2, s * 0.05);
    ctx.lineTo(s * 0.4, -s * 0.2);
    ctx.lineTo(s * 0.45, s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  medal(ctx, s) {
    // 丝带
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.55);
    ctx.lineTo(-s * 0.05, -s * 0.1);
    ctx.lineTo(s * 0.05, -s * 0.1);
    ctx.lineTo(s * 0.2, -s * 0.55);
    ctx.stroke();
    // 奖牌
    ctx.beginPath();
    ctx.arc(0, s * 0.15, s * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(0, s * 0.15, s * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  bulb(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, -s * 0.15, s * 0.3, Math.PI * 0.8, Math.PI * 0.2);
    ctx.lineTo(s * 0.12, s * 0.25);
    ctx.lineTo(-s * 0.12, s * 0.25);
    ctx.closePath();
    ctx.stroke();
    [-0.05, 0.05, 0.15].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(-s * 0.1, s * (0.25 + y));
      ctx.lineTo(s * 0.1, s * (0.25 + y));
      ctx.stroke();
    });
    // 光线
    [[-0.45, -0.35], [0, -0.55], [0.45, -0.35]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.moveTo(s * x * 0.7, s * y * 0.7);
      ctx.lineTo(s * x, s * y);
      ctx.stroke();
    });
  },

  handshake(ctx, s) {
    ctx.lineWidth = s * 0.08;
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, s * 0.1);
    ctx.lineTo(-s * 0.2, -s * 0.05);
    ctx.lineTo(s * 0.05, s * 0.05);
    ctx.lineTo(s * 0.2, -s * 0.1);
    ctx.lineTo(s * 0.5, s * 0.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.05);
    ctx.lineTo(s * 0.1, -s * 0.15);
    ctx.lineTo(s * 0.2, -s * 0.1);
    ctx.stroke();
  },

  refresh(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.35, -Math.PI * 0.7, Math.PI * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.35, s * 0.15);
    ctx.lineTo(s * 0.2, s * 0.35);
    ctx.lineTo(s * 0.48, s * 0.3);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.35, Math.PI * 0.3, Math.PI * 1.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, -s * 0.15);
    ctx.lineTo(-s * 0.2, -s * 0.35);
    ctx.lineTo(-s * 0.48, -s * 0.3);
    ctx.fill();
  },

  sword(ctx, s) {
    ctx.lineWidth = s * 0.06;
    ctx.beginPath();
    ctx.moveTo(-s * 0.45, -s * 0.45);
    ctx.lineTo(s * 0.25, s * 0.25);
    ctx.moveTo(s * 0.45, -s * 0.45);
    ctx.lineTo(-s * 0.25, s * 0.25);
    ctx.stroke();
    ctx.lineWidth = s * 0.1;
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, s * 0.0);
    ctx.lineTo(s * 0.15, s * 0.0);
    ctx.stroke();
  },

  // ---- 状态/表情 ----
  skull(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, -s * 0.1, s * 0.35, Math.PI, 0);
    ctx.lineTo(s * 0.35, s * 0.15);
    ctx.quadraticCurveTo(s * 0.2, s * 0.45, 0, s * 0.35);
    ctx.quadraticCurveTo(-s * 0.2, s * 0.45, -s * 0.35, s * 0.15);
    ctx.closePath();
    ctx.stroke();
    // 眼睛
    ctx.beginPath();
    ctx.arc(-s * 0.13, -s * 0.1, s * 0.08, 0, Math.PI * 2);
    ctx.arc(s * 0.13, -s * 0.1, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
  },

  ghost(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, -s * 0.15, s * 0.35, Math.PI, 0);
    ctx.lineTo(s * 0.35, s * 0.35);
    ctx.quadraticCurveTo(s * 0.2, s * 0.2, s * 0.1, s * 0.4);
    ctx.quadraticCurveTo(0, s * 0.25, -s * 0.1, s * 0.4);
    ctx.quadraticCurveTo(-s * 0.2, s * 0.2, -s * 0.35, s * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(-s * 0.12, -s * 0.15, s * 0.06, 0, Math.PI * 2);
    ctx.arc(s * 0.12, -s * 0.15, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  face(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-s * 0.13, -s * 0.08, s * 0.05, 0, Math.PI * 2);
    ctx.arc(s * 0.13, -s * 0.08, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, s * 0.12, s * 0.15, 0.1, Math.PI - 0.1);
    ctx.stroke();
  },

  faceAngry(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    // 怒眉
    ctx.beginPath();
    ctx.moveTo(-s * 0.22, -s * 0.18);
    ctx.lineTo(-s * 0.08, -s * 0.12);
    ctx.moveTo(s * 0.22, -s * 0.18);
    ctx.lineTo(s * 0.08, -s * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-s * 0.13, -s * 0.05, s * 0.04, 0, Math.PI * 2);
    ctx.arc(s * 0.13, -s * 0.05, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, s * 0.22, s * 0.12, Math.PI + 0.3, -0.3);
    ctx.stroke();
  },

  // ---- 科技 ----
  brain(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.45, -s * 0.55, -s * 0.1, -s * 0.35, s * 0.05);
    ctx.bezierCurveTo(-s * 0.55, s * 0.2, -s * 0.3, s * 0.5, 0, s * 0.4);
    ctx.bezierCurveTo(s * 0.3, s * 0.5, s * 0.55, s * 0.2, s * 0.35, s * 0.05);
    ctx.bezierCurveTo(s * 0.55, -s * 0.1, s * 0.5, -s * 0.45, 0, -s * 0.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.quadraticCurveTo(-s * 0.05, 0, 0, s * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, s * 0.05);
    ctx.quadraticCurveTo(0, -s * 0.05, s * 0.35, s * 0.05);
    ctx.stroke();
  },

  robot(ctx, s) {
    ctx.strokeRect(-s * 0.3, -s * 0.2, s * 0.6, s * 0.55);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.2);
    ctx.lineTo(0, -s * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -s * 0.45, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-s * 0.12, -s * 0.0, s * 0.07, 0, Math.PI * 2);
    ctx.arc(s * 0.12, -s * 0.0, s * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.12, s * 0.18);
    ctx.lineTo(s * 0.12, s * 0.18);
    ctx.stroke();
  },

  computer(ctx, s) {
    ctx.strokeRect(-s * 0.35, -s * 0.35, s * 0.7, s * 0.5);
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, s * 0.15);
    ctx.lineTo(-s * 0.2, s * 0.4);
    ctx.lineTo(s * 0.2, s * 0.4);
    ctx.lineTo(s * 0.15, s * 0.15);
    ctx.stroke();
    ctx.fillRect(-s * 0.2, -s * 0.25, s * 0.15, s * 0.1);
    ctx.fillRect(s * 0.05, -s * 0.25, s * 0.15, s * 0.1);
  },

  globe(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.2, s * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, 0);
    ctx.lineTo(s * 0.4, 0);
    ctx.moveTo(-s * 0.35, -s * 0.2);
    ctx.lineTo(s * 0.35, -s * 0.2);
    ctx.moveTo(-s * 0.35, s * 0.2);
    ctx.lineTo(s * 0.35, s * 0.2);
    ctx.stroke();
  },

  link(ctx, s) {
    ctx.lineWidth = s * 0.1;
    ctx.beginPath();
    ctx.arc(-s * 0.15, -s * 0.15, s * 0.2, Math.PI * 0.75, Math.PI * 1.75);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.15, s * 0.15, s * 0.2, -Math.PI * 0.25, Math.PI * 0.75);
    ctx.stroke();
  },

  chain(ctx, s) {
    ctx.lineWidth = s * 0.08;
    // 上链环
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.2, s * 0.15, s * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();
    // 下链环
    ctx.beginPath();
    ctx.ellipse(0, s * 0.2, s * 0.15, s * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();
    // 连接重叠处加粗
    ctx.lineWidth = s * 0.1;
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, 0);
    ctx.lineTo(s * 0.08, 0);
    ctx.stroke();
  },

  // ---- 金融/商业 ----
  money(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = `bold ${s * 0.5}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('¥', 0, 0);
  },

  bank(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.45, -s * 0.15);
    ctx.lineTo(0, -s * 0.5);
    ctx.lineTo(s * 0.45, -s * 0.15);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeRect(-s * 0.4, -s * 0.15, s * 0.8, s * 0.08);
    [-s * 0.25, 0, s * 0.25].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, -s * 0.07);
      ctx.lineTo(x, s * 0.3);
      ctx.stroke();
    });
    ctx.strokeRect(-s * 0.4, s * 0.3, s * 0.8, s * 0.1);
  },

  // ---- 警告/危险 ----
  siren(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(s * 0.45, s * 0.4);
    ctx.lineTo(-s * 0.45, s * 0.4);
    ctx.closePath();
    ctx.stroke();
    ctx.font = `bold ${s * 0.5}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('!', 0, s * 0.1);
  },

  lock(ctx, s) {
    ctx.strokeRect(-s * 0.25, -s * 0.05, s * 0.5, s * 0.45);
    ctx.beginPath();
    ctx.arc(0, -s * 0.05, s * 0.2, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, s * 0.15, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  },

  unlock(ctx, s) {
    ctx.strokeRect(-s * 0.25, -s * 0.05, s * 0.5, s * 0.45);
    ctx.beginPath();
    ctx.arc(0, -s * 0.05, s * 0.2, Math.PI, Math.PI * 0.1, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, s * 0.15, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  },

  // ---- 其他 ----
  scissors(ctx, s) {
    ctx.beginPath();
    ctx.arc(-s * 0.15, s * 0.3, s * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.15, s * 0.3, s * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, s * 0.18);
    ctx.lineTo(s * 0.3, -s * 0.45);
    ctx.moveTo(s * 0.08, s * 0.18);
    ctx.lineTo(-s * 0.3, -s * 0.45);
    ctx.stroke();
  },

  clock(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -s * 0.28);
    ctx.moveTo(0, 0);
    ctx.lineTo(s * 0.2, s * 0.08);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
  },

  calendar(ctx, s) {
    ctx.strokeRect(-s * 0.35, -s * 0.3, s * 0.7, s * 0.7);
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, -s * 0.12);
    ctx.lineTo(s * 0.35, -s * 0.12);
    ctx.stroke();
    // 挂钩
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, -s * 0.45);
    ctx.lineTo(-s * 0.15, -s * 0.25);
    ctx.moveTo(s * 0.15, -s * 0.45);
    ctx.lineTo(s * 0.15, -s * 0.25);
    ctx.stroke();
    // 日期点
    [[-0.15, 0.05], [0.05, 0.05], [0.25, 0.05], [-0.15, 0.25], [0.05, 0.25]].forEach(([x, y]) => {
      ctx.fillRect(s * x - s * 0.04, s * y - s * 0.04, s * 0.08, s * 0.08);
    });
  },

  spiral(ctx, s) {
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 6; a += 0.1) {
      const r = a * s * 0.025;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  gem(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(s * 0.35, -s * 0.15);
    ctx.lineTo(s * 0.2, s * 0.45);
    ctx.lineTo(-s * 0.2, s * 0.45);
    ctx.lineTo(-s * 0.35, -s * 0.15);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, -s * 0.15);
    ctx.lineTo(0, s * 0.0);
    ctx.lineTo(s * 0.35, -s * 0.15);
    ctx.moveTo(0, s * 0.0);
    ctx.lineTo(0, -s * 0.5);
    ctx.stroke();
  },

  confetti(ctx, s) {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dist = s * (0.2 + Math.random() * 0.3);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      ctx.save();
      ctx.fillStyle = colors[i % 4];
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillRect(-s * 0.04, -s * 0.02, s * 0.08, s * 0.04);
      ctx.restore();
    }
  },

  mask(ctx, s) {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.35, s * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    // 眼洞
    ctx.beginPath();
    ctx.ellipse(-s * 0.13, -s * 0.05, s * 0.1, s * 0.07, -0.2, 0, Math.PI * 2);
    ctx.ellipse(s * 0.13, -s * 0.05, s * 0.1, s * 0.07, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // 嘴
    ctx.beginPath();
    ctx.arc(0, s * 0.18, s * 0.1, 0, Math.PI);
    ctx.stroke();
  },

  hand(ctx, s) {
    ctx.lineWidth = s * 0.07;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.5);
    ctx.lineTo(0, s * 0.0);
    ctx.stroke();
    // 手指
    [[-0.2, -0.35], [-0.07, -0.45], [0.07, -0.45], [0.2, -0.35]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.moveTo(s * x * 0.7, 0);
      ctx.lineTo(s * x, s * y);
      ctx.stroke();
    });
    // 拇指
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, s * 0.05);
    ctx.lineTo(-s * 0.3, -s * 0.1);
    ctx.stroke();
  },

  scale(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.lineTo(0, s * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s * 0.2);
    ctx.lineTo(s * 0.4, -s * 0.2);
    ctx.stroke();
    // 盘
    ctx.beginPath();
    ctx.arc(-s * 0.4, -s * 0.2, s * 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, s * 0.05);
    ctx.quadraticCurveTo(-s * 0.4, s * 0.15, -s * 0.3, s * 0.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, s * 0.05);
    ctx.lineTo(-s * 0.4, -s * 0.2);
    ctx.lineTo(-s * 0.3, s * 0.05);
    ctx.stroke();
    // 右盘
    ctx.beginPath();
    ctx.arc(s * 0.4, -s * 0.2, s * 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.3, -s * 0.05);
    ctx.quadraticCurveTo(s * 0.4, s * 0.05, s * 0.5, -s * 0.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.3, -s * 0.05);
    ctx.lineTo(s * 0.4, -s * 0.2);
    ctx.lineTo(s * 0.5, -s * 0.05);
    ctx.stroke();
    ctx.strokeRect(-s * 0.1, s * 0.35, s * 0.2, s * 0.08);
  },

  box(ctx, s) {
    // 3D盒子
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.15);
    ctx.lineTo(0, -s * 0.4);
    ctx.lineTo(s * 0.3, -s * 0.15);
    ctx.lineTo(s * 0.3, s * 0.25);
    ctx.lineTo(0, s * 0.45);
    ctx.lineTo(-s * 0.3, s * 0.25);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, s * 0.45);
    ctx.lineTo(0, s * 0.1);
    ctx.lineTo(-s * 0.3, -s * 0.15);
    ctx.moveTo(0, s * 0.1);
    ctx.lineTo(s * 0.3, -s * 0.15);
    ctx.stroke();
  },

  bell(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.2);
    ctx.quadraticCurveTo(-s * 0.3, -s * 0.35, 0, -s * 0.4);
    ctx.quadraticCurveTo(s * 0.3, -s * 0.35, s * 0.3, s * 0.2);
    ctx.lineTo(-s * 0.3, s * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, s * 0.2);
    ctx.lineTo(s * 0.4, s * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, s * 0.35, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
    // 顶部
    ctx.beginPath();
    ctx.arc(0, -s * 0.43, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
  },

  heart(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.4);
    ctx.bezierCurveTo(-s * 0.5, s * 0.1, -s * 0.5, -s * 0.3, 0, -s * 0.15);
    ctx.bezierCurveTo(s * 0.5, -s * 0.3, s * 0.5, s * 0.1, 0, s * 0.4);
    ctx.fill();
  },

  rainbow(ctx, s) {
    const colors = ['#ff6b6b', '#ffa06b', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6'];
    colors.forEach((c, i) => {
      ctx.strokeStyle = c;
      ctx.lineWidth = s * 0.06;
      ctx.beginPath();
      ctx.arc(0, s * 0.2, s * (0.45 - i * 0.06), Math.PI, 0);
      ctx.stroke();
    });
    ctx.strokeStyle = '#fff';
  },

  megaphone(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, -s * 0.15);
    ctx.lineTo(s * 0.4, -s * 0.4);
    ctx.lineTo(s * 0.4, s * 0.35);
    ctx.lineTo(-s * 0.15, s * 0.1);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeRect(-s * 0.3, -s * 0.15, s * 0.15, s * 0.25);
    // 声波
    [0.15, 0.25].forEach(r => {
      ctx.beginPath();
      ctx.arc(s * 0.4, -s * 0.025, s * r, -Math.PI * 0.3, Math.PI * 0.3);
      ctx.stroke();
    });
  },

  muscle(ctx, s) {
    ctx.lineWidth = s * 0.1;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.3);
    ctx.lineTo(-s * 0.3, -s * 0.1);
    ctx.quadraticCurveTo(-s * 0.3, -s * 0.4, 0, -s * 0.4);
    ctx.quadraticCurveTo(s * 0.15, -s * 0.4, s * 0.15, -s * 0.2);
    ctx.quadraticCurveTo(s * 0.15, -s * 0.05, s * 0.3, -s * 0.05);
    ctx.lineTo(s * 0.3, s * 0.3);
    ctx.stroke();
  },

  mic(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, -s * 0.15, s * 0.15, Math.PI, 0);
    ctx.lineTo(s * 0.15, s * 0.1);
    ctx.arc(0, s * 0.1, s * 0.15, 0, Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, s * 0.1, s * 0.28, -Math.PI * 0.15, Math.PI * 1.15, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, s * 0.38);
    ctx.lineTo(0, s * 0.5);
    ctx.moveTo(-s * 0.15, s * 0.5);
    ctx.lineTo(s * 0.15, s * 0.5);
    ctx.stroke();
  },

  crystal(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55);
    ctx.lineTo(s * 0.25, -s * 0.15);
    ctx.lineTo(s * 0.15, s * 0.5);
    ctx.lineTo(-s * 0.15, s * 0.5);
    ctx.lineTo(-s * 0.25, -s * 0.15);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55);
    ctx.lineTo(0, s * 0.5);
    ctx.moveTo(-s * 0.25, -s * 0.15);
    ctx.lineTo(s * 0.15, s * 0.5);
    ctx.moveTo(s * 0.25, -s * 0.15);
    ctx.lineTo(-s * 0.15, s * 0.5);
    ctx.stroke();
  },

  arrowDown(ctx, s) {
    ctx.lineWidth = s * 0.12;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.lineTo(0, s * 0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.05);
    ctx.lineTo(0, s * 0.45);
    ctx.lineTo(s * 0.3, s * 0.05);
    ctx.closePath();
    ctx.fill();
  },

  explosion(ctx, s) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? s * 0.5 : s * 0.25;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },

  bug(ctx, s) {
    ctx.beginPath();
    ctx.ellipse(0, s * 0.05, s * 0.25, s * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -s * 0.3, s * 0.12, 0, Math.PI * 2);
    ctx.stroke();
    // 腿
    [-1, 1].forEach(dir => {
      [-0.1, 0.1, 0.25].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(dir * s * 0.25, s * y);
        ctx.lineTo(dir * s * 0.45, s * (y - 0.08));
        ctx.stroke();
      });
    });
    // 触角
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, -s * 0.4);
    ctx.lineTo(-s * 0.2, -s * 0.55);
    ctx.moveTo(s * 0.08, -s * 0.4);
    ctx.lineTo(s * 0.2, -s * 0.55);
    ctx.stroke();
  },

  disk(ctx, s) {
    ctx.strokeRect(-s * 0.35, -s * 0.4, s * 0.7, s * 0.8);
    ctx.strokeRect(-s * 0.2, -s * 0.4, s * 0.4, s * 0.25);
    ctx.strokeRect(-s * 0.2, s * 0.05, s * 0.4, s * 0.3);
    ctx.beginPath();
    ctx.moveTo(s * 0.08, -s * 0.35);
    ctx.lineTo(s * 0.08, -s * 0.2);
    ctx.stroke();
  },

  snail(ctx, s) {
    ctx.beginPath();
    ctx.arc(s * 0.05, 0, s * 0.25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.05, 0, s * 0.12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, s * 0.25);
    ctx.quadraticCurveTo(-s * 0.45, s * 0.25, -s * 0.45, s * 0.35);
    ctx.lineTo(s * 0.35, s * 0.35);
    ctx.stroke();
    // 触角
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, s * 0.15);
    ctx.lineTo(-s * 0.45, -s * 0.05);
    ctx.moveTo(-s * 0.25, s * 0.15);
    ctx.lineTo(-s * 0.3, -s * 0.05);
    ctx.stroke();
  },

  inbox(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s * 0.15);
    ctx.lineTo(-s * 0.4, s * 0.35);
    ctx.lineTo(s * 0.4, s * 0.35);
    ctx.lineTo(s * 0.4, -s * 0.15);
    ctx.stroke();
    // 箭头
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(0, s * 0.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.15);
    ctx.lineTo(0, s * 0.1);
    ctx.lineTo(s * 0.2, -s * 0.15);
    ctx.fill();
  },

  hole(ctx, s) {
    ctx.beginPath();
    ctx.ellipse(0, s * 0.05, s * 0.4, s * 0.25, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, s * 0.05, s * 0.3, s * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  beaker(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.45);
    ctx.lineTo(-s * 0.2, -s * 0.1);
    ctx.lineTo(-s * 0.35, s * 0.4);
    ctx.lineTo(s * 0.35, s * 0.4);
    ctx.lineTo(s * 0.2, -s * 0.1);
    ctx.lineTo(s * 0.2, -s * 0.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.25, -s * 0.45);
    ctx.lineTo(s * 0.25, -s * 0.45);
    ctx.stroke();
    // 液体
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(-s * 0.28, s * 0.15);
    ctx.lineTo(-s * 0.35, s * 0.4);
    ctx.lineTo(s * 0.35, s * 0.4);
    ctx.lineTo(s * 0.28, s * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  home(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(s * 0.4, -s * 0.1);
    ctx.lineTo(s * 0.4, s * 0.4);
    ctx.lineTo(-s * 0.4, s * 0.4);
    ctx.lineTo(-s * 0.4, -s * 0.1);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeRect(-s * 0.1, s * 0.1, s * 0.2, s * 0.3);
  },

  newspaper(ctx, s) {
    ctx.strokeRect(-s * 0.35, -s * 0.4, s * 0.7, s * 0.8);
    ctx.fillRect(-s * 0.25, -s * 0.3, s * 0.5, s * 0.2);
    [-0.0, 0.12, 0.24].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(-s * 0.25, s * y);
      ctx.lineTo(s * 0.25, s * y);
      ctx.stroke();
    });
  },

  fork(ctx, s) {
    ctx.lineWidth = s * 0.08;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.4);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-s * 0.35, -s * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(s * 0.35, -s * 0.4);
    ctx.stroke();
    // 箭头
    [[-0.35, -0.4], [0.35, -0.4]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(s * x, s * y, s * 0.05, 0, Math.PI * 2);
      ctx.fill();
    });
  },

  warning(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.lineTo(s * 0.45, s * 0.35);
    ctx.lineTo(-s * 0.45, s * 0.35);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = s * 0.08;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.15);
    ctx.lineTo(0, s * 0.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, s * 0.22, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
  },

  grad(ctx, s) {
    // 学位帽
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, -s * 0.05);
    ctx.lineTo(0, -s * 0.3);
    ctx.lineTo(s * 0.5, -s * 0.05);
    ctx.lineTo(0, s * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 0.45, -s * 0.03);
    ctx.lineTo(s * 0.45, s * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.45, s * 0.38, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
  },

  pen(ctx, s) {
    ctx.save();
    ctx.rotate(-Math.PI * 0.25);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(s * 0.1, -s * 0.35);
    ctx.lineTo(s * 0.1, s * 0.3);
    ctx.lineTo(0, s * 0.5);
    ctx.lineTo(-s * 0.1, s * 0.3);
    ctx.lineTo(-s * 0.1, -s * 0.35);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, s * 0.3);
    ctx.lineTo(s * 0.1, s * 0.3);
    ctx.stroke();
    ctx.restore();
  },

  ruler(ctx, s) {
    ctx.save();
    ctx.rotate(-Math.PI * 0.15);
    ctx.strokeRect(-s * 0.12, -s * 0.5, s * 0.24, s * 1.0);
    [-0.35, -0.2, -0.05, 0.1, 0.25].forEach((y, i) => {
      const w = i % 2 === 0 ? 0.12 : 0.08;
      ctx.beginPath();
      ctx.moveTo(-s * 0.12, s * y);
      ctx.lineTo(-s * 0.12 + s * w, s * y);
      ctx.stroke();
    });
    ctx.restore();
  },

  clap(ctx, s) {
    // 两只手鼓掌
    ctx.lineWidth = s * 0.05;
    [-1, 1].forEach(dir => {
      ctx.save();
      ctx.scale(dir, 1);
      ctx.beginPath();
      ctx.moveTo(s * 0.05, s * 0.2);
      ctx.lineTo(s * 0.05, -s * 0.05);
      ctx.lineTo(s * 0.15, -s * 0.3);
      ctx.moveTo(s * 0.05, -s * 0.05);
      ctx.lineTo(s * 0.25, -s * 0.25);
      ctx.moveTo(s * 0.05, s * 0.0);
      ctx.lineTo(s * 0.3, -s * 0.15);
      ctx.stroke();
      ctx.restore();
    });
  },

  think(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, -s * 0.1, s * 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-s * 0.1, -s * 0.15, s * 0.05, 0, Math.PI * 2);
    ctx.arc(s * 0.1, -s * 0.15, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
    // 思考线
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, s * 0.05);
    ctx.lineTo(s * 0.1, s * 0.05);
    ctx.stroke();
    // 泡泡
    ctx.beginPath();
    ctx.arc(s * 0.3, -s * 0.4, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s * 0.4, -s * 0.5, s * 0.03, 0, Math.PI * 2);
    ctx.fill();
  },

  anger(ctx, s) {
    // 爆炸标记
    const pts = 8;
    ctx.beginPath();
    for (let i = 0; i < pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const r = i % 2 === 0 ? s * 0.45 : s * 0.25;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  },

  trash(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.25, -s * 0.2);
    ctx.lineTo(-s * 0.2, s * 0.45);
    ctx.lineTo(s * 0.2, s * 0.45);
    ctx.lineTo(s * 0.25, -s * 0.2);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, -s * 0.2);
    ctx.lineTo(s * 0.35, -s * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, -s * 0.2);
    ctx.lineTo(-s * 0.1, -s * 0.35);
    ctx.lineTo(s * 0.1, -s * 0.35);
    ctx.lineTo(s * 0.1, -s * 0.2);
    ctx.stroke();
    // 竖线
    [0, -0.1, 0.1].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(s * x, -s * 0.1);
      ctx.lineTo(s * x, s * 0.35);
      ctx.stroke();
    });
  },

  redDot(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.font = `bold ${s * 0.4}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('×', 0, 0);
    ctx.restore();
  },

  greenDot(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = s * 0.1;
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, 0);
    ctx.lineTo(-s * 0.05, s * 0.12);
    ctx.lineTo(s * 0.15, -s * 0.1);
    ctx.stroke();
    ctx.restore();
  }
};


// ============================================
// 图标定义表: iconId → { symbol, bg颜色 }
// 障碍物用红色系, 收集物用绿色系
// ============================================
const OBS = '#c0392b';  // 障碍物暗红
const OB2 = '#a93226';
const OB3 = '#922b21';
const COL = '#27ae60';  // 收集物暗绿
const CO2 = '#229954';
const CO3 = '#1e8449';
const CHAR_PM = '#0097b2';
const CHAR_AL = '#8e44ad';
const CHAR_BE = '#27ae60';
const CHAR_BO = '#d4a017';

const ICON_DEFS = {
  // ---- 角色 ----
  char_pm:       { symbol: 'chart', bg: CHAR_PM },
  char_algorithm:{ symbol: 'brain', bg: CHAR_AL },
  char_backend:  { symbol: 'gear', bg: CHAR_BE },
  char_boss:     { symbol: 'crown', bg: CHAR_BO },

  // ---- 产品经理 ----
  pm_1_o1: { symbol: 'question', bg: OBS },
  pm_1_o2: { symbol: 'calendar', bg: OBS },
  pm_1_o3: { symbol: 'wall', bg: OB2 },
  pm_1_o4: { symbol: 'document', bg: OB2 },
  pm_1_o5: { symbol: 'spiral', bg: OB3 },
  pm_1_o6: { symbol: 'magnify', bg: OB3 },
  pm_1_c1: { symbol: 'clipboard', bg: COL },
  pm_1_c2: { symbol: 'person', bg: COL },
  pm_1_c3: { symbol: 'check', bg: CO2 },
  pm_1_c4: { symbol: 'target', bg: CO2 },
  pm_1_c5: { symbol: 'handshake', bg: CO3 },
  pm_1_c6: { symbol: 'rocket', bg: CO3 },

  pm_2_o1: { symbol: 'refresh', bg: OBS },
  pm_2_o2: { symbol: 'bolt', bg: OBS },
  pm_2_o3: { symbol: 'clock', bg: OB2 },
  pm_2_o4: { symbol: 'faceAngry', bg: OB2 },
  pm_2_o5: { symbol: 'chartDown', bg: OB3 },
  pm_2_o6: { symbol: 'scissors', bg: OB3 },
  pm_2_c1: { symbol: 'chartUp', bg: COL },
  pm_2_c2: { symbol: 'star', bg: COL },
  pm_2_c3: { symbol: 'refresh', bg: CO2 },
  pm_2_c4: { symbol: 'trophy', bg: CO2 },
  pm_2_c5: { symbol: 'scroll', bg: CO3 },
  pm_2_c6: { symbol: 'bulb', bg: CO3 },

  pm_3_o1: { symbol: 'fork', bg: OBS },
  pm_3_o2: { symbol: 'bolt', bg: OBS },
  pm_3_o3: { symbol: 'door', bg: OB2 },
  pm_3_o4: { symbol: 'money', bg: OB2 },
  pm_3_o5: { symbol: 'chain', bg: OB3 },
  pm_3_o6: { symbol: 'sword', bg: OB3 },
  pm_3_c1: { symbol: 'confetti', bg: COL },
  pm_3_c2: { symbol: 'people', bg: COL },
  pm_3_c3: { symbol: 'medal', bg: CO2 },
  pm_3_c4: { symbol: 'book', bg: CO2 },
  pm_3_c5: { symbol: 'sprout', bg: CO3 },
  pm_3_c6: { symbol: 'crown', bg: CO3 },

  // ---- 大模型算法 ----
  al_1_o1: { symbol: 'fire', bg: OBS },
  al_1_o2: { symbol: 'computer', bg: OBS },
  al_1_o3: { symbol: 'trash', bg: OB2 },
  al_1_o4: { symbol: 'book', bg: OB2 },
  al_1_o5: { symbol: 'explosion', bg: OB3 },
  al_1_o6: { symbol: 'bug', bg: OB3 },
  al_1_c1: { symbol: 'wrench', bg: COL },
  al_1_c2: { symbol: 'robot', bg: COL },
  al_1_c3: { symbol: 'pen', bg: CO2 },
  al_1_c4: { symbol: 'gem', bg: CO2 },
  al_1_c5: { symbol: 'check', bg: CO3 },
  al_1_c6: { symbol: 'chart', bg: CO3 },

  al_2_o1: { symbol: 'ghost', bg: OBS },
  al_2_o2: { symbol: 'chartDown', bg: OBS },
  al_2_o3: { symbol: 'money', bg: OB2 },
  al_2_o4: { symbol: 'mask', bg: OB2 },
  al_2_o5: { symbol: 'hand', bg: OB3 },
  al_2_o6: { symbol: 'scale', bg: OB3 },
  al_2_c1: { symbol: 'rocket', bg: COL },
  al_2_c2: { symbol: 'grad', bg: COL },
  al_2_c3: { symbol: 'bolt', bg: CO2 },
  al_2_c4: { symbol: 'bulb', bg: CO2 },
  al_2_c5: { symbol: 'link', bg: CO3 },
  al_2_c6: { symbol: 'clap', bg: CO3 },

  al_3_o1: { symbol: 'wave', bg: OBS },
  al_3_o2: { symbol: 'siren', bg: OBS },
  al_3_o3: { symbol: 'redDot', bg: OB2 },
  al_3_o4: { symbol: 'scissors', bg: OB2 },
  al_3_o5: { symbol: 'box', bg: OB3 },
  al_3_o6: { symbol: 'fork', bg: OB3 },
  al_3_c1: { symbol: 'greenDot', bg: COL },
  al_3_c2: { symbol: 'trophy', bg: COL },
  al_3_c3: { symbol: 'scroll', bg: CO2 },
  al_3_c4: { symbol: 'computer', bg: CO2 },
  al_3_c5: { symbol: 'ruler', bg: CO3 },
  al_3_c6: { symbol: 'star', bg: CO3 },

  // ---- 后端工程师 ----
  be_1_o1: { symbol: 'ruler', bg: OBS },
  be_1_o2: { symbol: 'globe', bg: OBS },
  be_1_o3: { symbol: 'sword', bg: OB2 },
  be_1_o4: { symbol: 'document', bg: OB2 },
  be_1_o5: { symbol: 'link', bg: OB3 },
  be_1_o6: { symbol: 'clock', bg: OB3 },
  be_1_c1: { symbol: 'fork', bg: COL },
  be_1_c2: { symbol: 'check', bg: COL },
  be_1_c3: { symbol: 'wrench', bg: CO2 },
  be_1_c4: { symbol: 'building', bg: CO2 },
  be_1_c5: { symbol: 'target', bg: CO3 },
  be_1_c6: { symbol: 'star', bg: CO3 },

  be_2_o1: { symbol: 'siren', bg: OBS },
  be_2_o2: { symbol: 'inbox', bg: OBS },
  be_2_o3: { symbol: 'snail', bg: OB2 },
  be_2_o4: { symbol: 'skull', bg: OB2 },
  be_2_o5: { symbol: 'chain', bg: OB3 },
  be_2_o6: { symbol: 'hole', bg: OB3 },
  be_2_c1: { symbol: 'wrench', bg: COL },
  be_2_c2: { symbol: 'bolt', bg: COL },
  be_2_c3: { symbol: 'beaker', bg: CO2 },
  be_2_c4: { symbol: 'bulb', bg: CO2 },
  be_2_c5: { symbol: 'home', bg: CO3 },
  be_2_c6: { symbol: 'star', bg: CO3 },

  be_3_o1: { symbol: 'wave', bg: OBS },
  be_3_o2: { symbol: 'disk', bg: OBS },
  be_3_o3: { symbol: 'building', bg: OB2 },
  be_3_o4: { symbol: 'shield', bg: OB2 },
  be_3_o5: { symbol: 'refresh', bg: OB3 },
  be_3_o6: { symbol: 'box', bg: OB3 },
  be_3_c1: { symbol: 'temple', bg: COL },
  be_3_c2: { symbol: 'greenDot', bg: COL },
  be_3_c3: { symbol: 'chartUp', bg: CO2 },
  be_3_c4: { symbol: 'globe', bg: CO2 },
  be_3_c5: { symbol: 'people', bg: CO3 },
  be_3_c6: { symbol: 'trophy', bg: CO3 },

  // ---- 老板 ----
  bo_1_o1: { symbol: 'think', bg: OBS },
  bo_1_o2: { symbol: 'megaphone', bg: OBS },
  bo_1_o3: { symbol: 'anger', bg: OB2 },
  bo_1_o4: { symbol: 'money', bg: OB2 },
  bo_1_o5: { symbol: 'scale', bg: OB3 },
  bo_1_o6: { symbol: 'newspaper', bg: OB3 },
  bo_1_c1: { symbol: 'bank', bg: COL },
  bo_1_c2: { symbol: 'star', bg: COL },
  bo_1_c3: { symbol: 'rocket', bg: CO2 },
  bo_1_c4: { symbol: 'sprout', bg: CO2 },
  bo_1_c5: { symbol: 'muscle', bg: CO3 },
  bo_1_c6: { symbol: 'mic', bg: CO3 },

  bo_2_o1: { symbol: 'door', bg: OBS },
  bo_2_o2: { symbol: 'chartDown', bg: OBS },
  bo_2_o3: { symbol: 'bolt', bg: OB2 },
  bo_2_o4: { symbol: 'fork', bg: OB2 },
  bo_2_o5: { symbol: 'chart', bg: OB3 },
  bo_2_o6: { symbol: 'warning', bg: OB3 },
  bo_2_c1: { symbol: 'chartUp', bg: COL },
  bo_2_c2: { symbol: 'handshake', bg: COL },
  bo_2_c3: { symbol: 'people', bg: CO2 },
  bo_2_c4: { symbol: 'medal', bg: CO2 },
  bo_2_c5: { symbol: 'money', bg: CO3 },
  bo_2_c6: { symbol: 'megaphone', bg: CO3 },

  bo_3_o1: { symbol: 'snowflake', bg: OBS },
  bo_3_o2: { symbol: 'building', bg: OBS },
  bo_3_o3: { symbol: 'unlock', bg: OB2 },
  bo_3_o4: { symbol: 'building', bg: OB2 },
  bo_3_o5: { symbol: 'crystal', bg: OB3 },
  bo_3_o6: { symbol: 'arrowDown', bg: OB3 },
  bo_3_c1: { symbol: 'bell', bg: COL },
  bo_3_c2: { symbol: 'crown', bg: COL },
  bo_3_c3: { symbol: 'ruler', bg: CO2 },
  bo_3_c4: { symbol: 'globe', bg: CO2 },
  bo_3_c5: { symbol: 'heart', bg: CO3 },
  bo_3_c6: { symbol: 'rainbow', bg: CO3 },
};
