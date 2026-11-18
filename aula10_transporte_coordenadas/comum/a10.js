// Ferramentas comuns aos vídeos da Aula 10 (transporte de coordenadas).
// Este bloco é copiado no início do shared.js de cada vídeo: o player carrega um único shared.js por vídeo.
window.A10 = (function () {
  const D = Math.PI / 180;
  const f1 = v => v.toFixed(1);
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const eo = x => 1 - Math.pow(1 - x, 3);
  const seg = (t, a, b) => clamp01((t - a) / (b - a));

  // Ângulo em graus → ±d°mm′ss,s″
  function dms(g, casas = 0, sinal = false) {
    const s = g < 0 ? '−' : (sinal && g > 0 ? '+' : '');
    g = Math.abs(g);
    let d = Math.floor(g), m = Math.floor((g - d) * 60), sec = (g - d - m / 60) * 3600;
    if (+sec.toFixed(casas) >= 60) { sec = 0; m += 1; }
    if (m >= 60) { m = 0; d += 1; }
    return s + d + '°' + String(m).padStart(2, '0') + '′' + sec.toFixed(casas).replace('.', ',').padStart(casas ? 3 + casas : 2, '0') + '″';
  }
  // Número em português: separador de milhar fino e vírgula decimal
  function num(v, c = 0, sinal = false) {
    const neg = +v.toFixed(c) < 0, a = Math.abs(v).toFixed(c).split('.');
    a[0] = a[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : (sinal && v > 0 ? '+' : '')) + a.join(',');
  }
  function lineD(pts) { let s = ''; pts.forEach((p, i) => { s += (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); }); return s; }
  // Seta de (x, y) com ângulo a (graus, horário a partir do norte da tela) e comprimento L
  function arrow(x, y, a, L, h = 18, w = 9) {
    const ux = Math.sin(a * D), uy = -Math.cos(a * D), ex = x + ux * L, ey = y + uy * L;
    return 'M' + f1(x) + ' ' + f1(y) + 'L' + f1(ex) + ' ' + f1(ey) +
      'M' + f1(ex - ux * h - uy * w) + ' ' + f1(ey - uy * h + ux * w) + 'L' + f1(ex) + ' ' + f1(ey) +
      'L' + f1(ex - ux * h + uy * w) + ' ' + f1(ey - uy * h - ux * w);
  }
  // Seta de (x1, y1) a (x2, y2)
  function arrowTo(x1, y1, x2, y2, h, w) {
    return arrow(x1, y1, Math.atan2(x2 - x1, -(y2 - y1)) / D, Math.hypot(x2 - x1, y2 - y1), h, w);
  }
  // Setor entre os azimutes a e b (graus), raio r
  function sector(x, y, a, b, r) {
    const p = q => [x + r * Math.sin(q * D), y - r * Math.cos(q * D)];
    const [ax, ay] = p(a), [bx, by] = p(b);
    return 'M' + f1(x) + ' ' + f1(y) + 'L' + f1(ax) + ' ' + f1(ay) + 'A' + r + ' ' + r + ' 0 ' + (Math.abs(b - a) > 180 ? 1 : 0) + ' ' + (b > a ? 1 : 0) + ' ' + f1(bx) + ' ' + f1(by) + 'Z';
  }
  // Arco (sem preenchimento) entre os azimutes a e b
  function arc(x, y, a, b, r) {
    const p = q => [x + r * Math.sin(q * D), y - r * Math.cos(q * D)];
    const [ax, ay] = p(a), [bx, by] = p(b);
    return 'M' + f1(ax) + ' ' + f1(ay) + 'A' + r + ' ' + r + ' 0 ' + (Math.abs(b - a) > 180 ? 1 : 0) + ' ' + (b > a ? 1 : 0) + ' ' + f1(bx) + ' ' + f1(by);
  }
  // Traçado progressivo de um path (u de 0 a 1)
  function draw(el, u) {
    if (!el._len) { el._len = el.getTotalLength() || 1; el.style.strokeDasharray = el._len + ' ' + el._len; }
    el.style.strokeDashoffset = el._len * (1 - clamp01(u));
    el.style.opacity = u > 0 ? 1 : 0;
  }
  // Bloco de texto posicionado; devolve o elemento
  function bloco(kit, x, y, w, html, cls = '') {
    const e = kit.h('<div class="words ' + cls + '" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px">' + html + '</div>');
    kit.stage.append(e); return e;
  }
  function lbl(kit, html, x, y, st = '') {
    const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;' + st + '">' + html + '</div>');
    kit.stage.append(e); return e;
  }
  // Entrada padrão: desliza da direita e aparece em 0,6 s a partir de t0; some a partir de t1 (opcional)
  function show(el, t, t0, t1 = Infinity, dx = 26) {
    const k = eo(seg(t, t0, t0 + 0.6)) * (t1 === Infinity ? 1 : 1 - eo(seg(t, t1, t1 + 0.5)));
    el.style.opacity = k; el.style.transform = 'translateX(' + ((1 - k) * dx).toFixed(1) + 'px)';
    return k;
  }
  function fade(el, t, t0, d = 0.5, t1 = Infinity) {
    const k = eo(seg(t, t0, t0 + d)) * (t1 === Infinity ? 1 : 1 - eo(seg(t, t1, t1 + 0.5)));
    el.style.opacity = k; return k;
  }
  return { D, f1, dms, num, lineD, arrow, arrowTo, sector, arc, draw, bloco, lbl, show, fade, seg, eo, clamp01 };
})();
