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
// ---- fim do bloco comum (comum/a10.js) ----
// V4: problema direto, passo a passo. Planta do exemplo de Viçosa, quadro de resultados do slide 17
// e a planta do exemplo da UFPR (TRANSPUTM).
// Correção local: em A10.show/A10.fade, t1 = Infinity dava seg(t, ∞, ∞) = NaN e a opacidade era ignorada
(function () {
  const sai = (t, t1) => (t1 === Infinity ? 0 : A10.eo(A10.seg(t, t1, t1 + 0.5)));
  A10.show = function (el, t, t0, t1 = Infinity, dx = 26) {
    const k = A10.eo(A10.seg(t, t0, t0 + 0.6)) * (1 - sai(t, t1));
    el.style.opacity = k; el.style.transform = 'translateX(' + ((1 - k) * dx).toFixed(1) + 'px)';
    return k;
  };
  A10.fade = function (el, t, t0, d = 0.5, t1 = Infinity) {
    const k = A10.eo(A10.seg(t, t0, t0 + d)) * (1 - sai(t, t1));
    el.style.opacity = k; return k;
  };
})();
window.A10V4 = (function () {
  const st = document.createElement('style');
  st.textContent = '#stage .res td.v{font-size:25px}#stage .res td.p{width:40px;text-align:center;font-weight:700;color:var(--accent)}' +
    '#stage .res td.g{font-family:var(--serif);font-size:25px;white-space:nowrap}#stage .res tr.fim td{font-weight:700;background:color-mix(in srgb, var(--accent) 14%, var(--ground))}' +
    '#stage .ok{color:#2E8B57;font-weight:700}#stage .gray{color:color-mix(in srgb, var(--main) 55%, var(--ground))}';
  document.head.append(st);
  // Transformação E, N (m) → tela: centro (cx, cy) em px, centro (eC, nC) em m, escala s px/m
  function planta(eC, nC, cx, cy, s) { return { s, X: e => cx + (e - eC) * s, Y: n => cy - (n - nC) * s }; }
  const ang = (g, c) => A10.dms(g, c);
  const n3 = v => A10.num(v, 3);
  // Quadro de resultados do problema direto (slide 17); devolve as linhas (tr) na ordem
  function quadro(kit, d, x, y) {
    const L = [
      ['1', 'Az<sub>C,21</sub> ; <i>ψ</i><sub>21</sub>', ang(d.azc21, 3) + ' ; ' + A10.num(d.psi21, 3, true) + '″'],
      ['1', 'Az<sub>Q,21</sub> ; Az<sub>Q,23</sub>', ang(d.azq21, 3) + ' ; ' + ang(d.azq23, 3)],
      ['2', '<i>F</i><sub>h</sub> ; <i>D</i><sub>e</sub>', A10.num(d.Fh, 7) + ' ; ' + n3(d.De) + ' m'],
      ['3', '<i>E</i>′<sub>3</sub> ; <i>N</i>′<sub>3</sub>', n3(d.p3a[0]) + ' ; ' + n3(d.p3a[1])],
      ['4', '<i>ψ</i><sub>23</sub> ; Az<sub>C,23</sub>', A10.num(d.psi23, 3, true) + '″ ; ' + ang(d.azc23, 3)],
      ['4', '<i>m</i><sub>23</sub> ; <i>k</i><sub>23</sub>', A10.num(d.m23, 8) + ' ; ' + A10.num(d.k23, 8)],
      ['4', '<i>D</i><sub>c</sub>', n3(d.Dc) + ' m'],
      ['5', '<i>E</i><sub>3</sub> ; <i>N</i><sub>3</sub>', n3(d.p3[0]) + ' ; ' + n3(d.p3[1])],
    ];
    const t = kit.h('<div class="words" style="left:' + x + 'px;top:' + y + 'px"><table class="tab res"><tr><th>Passo</th><th>Grandeza</th><th style="text-align:right">Valor</th></tr>' +
      L.map((r, i) => '<tr' + (i === 7 ? ' class="fim"' : '') + '><td class="p">' + r[0] + '</td><td class="g">' + r[1] + '</td><td class="v">' + r[2] + '</td></tr>').join('') + '</table></div>');
    kit.stage.append(t);
    return [...t.querySelectorAll('tr')].slice(1);
  }
  // Planta do exemplo de Viçosa: pontos 1, 2 e (opcional) 3; devolve os elementos
  function plantaVicosa(kit, d, P, o = {}) {
    const q = p => [P.X(p[0]), P.Y(p[1])];
    const p1 = q(d.p1), p2 = q(d.p2), p3 = q(d.p3);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="sight pv-21" d="M' + p2[0] + ' ' + p2[1] + 'L' + p1[0] + ' ' + p1[1] + '" style="stroke-dasharray:14 10;stroke-width:3"/>' +
      '<path class="sight pv-23" d="M' + p2[0] + ' ' + p2[1] + 'L' + p3[0] + ' ' + p3[1] + '" style="stroke:var(--accent)"/>' +
      '<circle class="marco pv-1" r="12" cx="' + p1[0] + '" cy="' + p1[1] + '"/><circle class="marco pv-2" r="12" cx="' + p2[0] + '" cy="' + p2[1] + '"/>' +
      '<circle class="novo pv-3" r="14" cx="' + p3[0] + '" cy="' + p3[1] + '"/></svg>');
    kit.stage.append(svg);
    const e = { p1, p2, p3 };
    for (const c of ['21', '23', '1', '2', '3']) e['e' + c] = svg.querySelector('.pv-' + c);
    const L = (h, x, y, s) => A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-weight:700;font-size:26px;' + (s || ''));
    e.l1 = L('1 <span style="font-weight:400">(ré)</span>', p1[0] + 22, p1[1] - 18);
    e.l2 = L('2 <span style="font-weight:400">(estação)</span>', p2[0] - 70, p2[1] + 22);
    e.l3 = L(o.l3 || '3', p3[0] + 20, p3[1] - 46, 'color:var(--accent)');
    return e;
  }
  return { planta, quadro, plantaVicosa, ang, n3 };
})();
