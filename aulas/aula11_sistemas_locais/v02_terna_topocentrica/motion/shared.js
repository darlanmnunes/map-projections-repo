// Ferramentas comuns aos vídeos da Aula 11 (sistemas de coordenadas locais).
// Este bloco é copiado no início do shared.js de cada vídeo: o player carrega um único shared.js por vídeo.
window.A11 = (function () {
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
// ---- fim do bloco comum (comum/a11.js) ----
// V2: do geodésico ao geocêntrico e ao topocêntrico (terna local).
window.A11V2 = (function () {
  const st = document.createElement('style');
  st.textContent = '.ax { fill:none; stroke-width:4; stroke-linecap:round; stroke-linejoin:round }' +
    '.ax.gx { stroke:#B0308F } .ax.gy { stroke:#2E8B57 } .ax.gz { stroke:var(--second) }' +
    '.ax.le { stroke:#B0308F; stroke-width:6 } .ax.no { stroke:#2E8B57; stroke-width:6 } .ax.nu { stroke:var(--second); stroke-width:6 }' +
    '.ghost { fill:none; stroke:color-mix(in srgb, var(--main) 45%, var(--ground)); stroke-width:3; stroke-dasharray:8 6 }' +
    '.elfill { fill:color-mix(in srgb, var(--second) 7%, var(--ground)); stroke:color-mix(in srgb, var(--main) 55%, var(--ground)); stroke-width:2 }' +
    '.back { fill:none; stroke:color-mix(in srgb, var(--main) 30%, var(--ground)); stroke-width:1.5; stroke-dasharray:4 6 }' +
    '.front { fill:none; stroke:color-mix(in srgb, var(--main) 60%, var(--ground)); stroke-width:2 }' +
    '.raio { fill:none; stroke:var(--accent); stroke-width:3; stroke-dasharray:10 7 }' +
    '.mat { display:inline-grid; grid-template-columns:repeat(3, auto); column-gap:34px; row-gap:8px; padding:10px 18px;' +
    ' border-left:3px solid var(--main); border-right:3px solid var(--main); border-radius:10px; font-family:var(--serif); font-size:30px; color:var(--main) }' +
    '.mat span { text-align:center; padding:2px 6px; border-radius:6px }' +
    '.cx { font-family:var(--sans); font-weight:700; font-size:28px }';
  document.head.append(st);
  const D = Math.PI / 180;
  // Câmera fixa: olha o meridiano LC, elevada EL acima do equador
  const LC = -22 * D, EL = 16 * D;
  function cam(C) {
    return v => {
      const x1 = v[0] * Math.cos(LC) + v[1] * Math.sin(LC), y1 = -v[0] * Math.sin(LC) + v[1] * Math.cos(LC), z1 = v[2];
      const d = x1 * Math.cos(EL) + z1 * Math.sin(EL), up = -x1 * Math.sin(EL) + z1 * Math.cos(EL);
      return [C[0] + y1, C[1] - up, d];
    };
  }
  const add = (a, b, s = 1) => [a[0] + s * b[0], a[1] + s * b[1], a[2] + s * b[2]];
  const nrm = v => { const n = Math.hypot(...v); return v.map(x => x / n); };
  // Elipsoide esquemático (achatamento exagerado): ponto e normal em (φ, λ) em graus
  function elip(a, b) {
    const pt = (f, l) => { f *= D; l *= D; return [a * Math.cos(f) * Math.cos(l), a * Math.cos(f) * Math.sin(l), b * Math.sin(f)]; };
    const normal = (f, l) => { const p = pt(f, l); return nrm([p[0] / (a * a), p[1] / (a * a), p[2] / (b * b)]); };
    return { pt, normal };
  }
  // Curva 3D projetada, separada em trechos de frente (sólido) e de trás (tracejado)
  function curva(P, pts) {
    let fr = '', bk = '', prev = null;
    for (const p of pts) {
      const q = P(p), vis = q[2] >= 0;
      const s = q[0].toFixed(1) + ' ' + q[1].toFixed(1);
      if (prev === null || prev !== vis) { if (vis) fr += 'M' + s; else bk += 'M' + s; } else { if (vis) fr += 'L' + s; else bk += 'L' + s; }
      prev = vis;
    }
    return { fr, bk };
  }
  // Globo: contorno, equador, meridiano de Greenwich, meridiano e paralelo da origem
  function globo(C, a, b, f0, l0) {
    const P = cam(C), E = elip(a, b);
    const ry = Math.sqrt(b * b * Math.cos(EL) ** 2 + a * a * Math.sin(EL) ** 2);
    const linhas = [];
    const eq = [], gw = [], mo = [], po = [];
    for (let i = 0; i <= 180; i++) { eq.push(E.pt(0, -180 + 2 * i)); gw.push(E.pt(-90 + i, 0)); mo.push(E.pt(-90 + i, l0)); po.push(E.pt(f0, -180 + 2 * i)); }
    for (const [pts, cls] of [[eq, 'eq'], [gw, 'gw'], [mo, 'mo'], [po, 'po']]) { const c = curva(P, pts); linhas.push([cls, c]); }
    let svg = '<ellipse class="elfill" cx="' + C[0] + '" cy="' + C[1] + '" rx="' + a + '" ry="' + ry.toFixed(1) + '"/>';
    for (const [cls, c] of linhas) svg += '<path class="back g-' + cls + 'b" d="' + c.bk + '"/><path class="front g-' + cls + '" d="' + c.fr + '"/>';
    return { P, E, svg };
  }
  // Seta 2D entre pontos de tela
  const seta = (p, q, h = 16, w = 8) => A11.arrowTo(p[0], p[1], q[0], q[1], h, w);
  // kit.em com folga: se a palavra não vier na transcrição, usa uma fração da fala
  function em(kit, id, palavra, frac = 0.3, n = 1) {
    try { return kit.em(id, palavra, n); } catch (e) { const f = kit.F[id]; return f.t0 + frac * (f.t1 - f.t0); }
  }
  return { D, cam, elip, curva, globo, seta, add, nrm, em };
})();
