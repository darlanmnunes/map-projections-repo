// V4: convergência meridiana. Esquema exagerado da TM (GRS80, λ0 = 0, km) com a grade de quadrícula,
// os meridianos e paralelos projetados e, num ponto P, o norte de quadrícula (NQ), o norte geográfico (NG) e γ.
// Convenção: γ > 0 quando NQ está a leste de NG; NG faz −γ (sentido horário) com NQ.
window.A9V4 = (function () {
  const D = Math.PI / 180;
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = v => v.toFixed(1);
  // Esquema: janela em km e painel na tela
  const ESQ = { cx: 470, cy: 600, s: 0.0607, x0: 140, x1: 800, y0: 175, y1: 1025 };
  const SX = x => ESQ.cx + x * ESQ.s, SY = y => ESQ.cy - y * ESQ.s;

  // Ângulo em graus → texto ±d°mm′ss″ (casas nos segundos)
  function dms(g, casas = 0, sinal = true) {
    if (Math.abs(g) * 3600 < 0.5 * Math.pow(10, -casas)) g = 0;
    const s = g < 0 ? '−' : (sinal && g > 0 ? '+' : '');
    g = Math.abs(g);
    let d = Math.floor(g), m = Math.floor((g - d) * 60), sec = (g - d - m / 60) * 3600;
    if (+sec.toFixed(casas) >= 60) { sec = 0; m += 1; }
    if (m >= 60) { m = 0; d += 1; }
    return s + d + '°' + String(m).padStart(2, '0') + '′' + sec.toFixed(casas).replace('.', ',').padStart(casas ? 3 + casas : 2, '0') + '″';
  }
  // Ângulo arredondado ao minuto: ±d°mm′
  const dm = g => dms(Math.round(g * 60) / 60).slice(0, -3);
  const num = (v, c) => (+v.toFixed(c) < 0 ? '−' : '') + Math.abs(v).toFixed(c).replace('.', ',');

  function lineD(xs, ys, X, Y) { let s = ''; for (let i = 0; i < xs.length; i++) s += (i ? 'L' : 'M') + f1(X(xs[i])) + ' ' + f1(Y(ys[i])); return s; }

  // Seta de comprimento L a partir de (x, y), girada a graus no sentido horário a partir do norte da tela
  function arrow(x, y, a, L) {
    const ux = Math.sin(a * D), uy = -Math.cos(a * D), ex = x + ux * L, ey = y + uy * L, h = 18, w = 9;
    return 'M' + f1(x) + ' ' + f1(y) + 'L' + f1(ex) + ' ' + f1(ey) +
      'M' + f1(ex - ux * h - uy * w) + ' ' + f1(ey - uy * h + ux * w) + 'L' + f1(ex) + ' ' + f1(ey) +
      'L' + f1(ex - ux * h + uy * w) + ' ' + f1(ey - uy * h - ux * w);
  }
  // Setor entre os ângulos a e b (graus, horário a partir do norte), raio r
  function sector(x, y, a, b, r) {
    const p = q => [x + r * Math.sin(q * D), y - r * Math.cos(q * D)];
    const [ax, ay] = p(a), [bx, by] = p(b);
    return 'M' + f1(x) + ' ' + f1(y) + 'L' + f1(ax) + ' ' + f1(ay) + 'A' + r + ' ' + r + ' 0 0 ' + (b > a ? 1 : 0) + ' ' + f1(bx) + ' ' + f1(by) + 'Z';
  }

  function build(kit, id) {
    const E = kit.json('v4-dados.json').esq;
    let grid = '';
    for (let x = -5000; x <= 5000; x += 1000) grid += 'M' + f1(SX(x)) + ' ' + ESQ.y0 + 'V' + ESQ.y1;
    for (let y = -7000; y <= 7000; y += 1000) grid += 'M' + ESQ.x0 + ' ' + f1(SY(y)) + 'H' + ESQ.x1;
    let mer = '', par = '';
    for (const m of E.mer) if (m.dl) mer += lineD(m.x, m.y, SX, SY);
    for (const p of E.par) if (p.phi) par += lineD(p.x, p.y, SX, SY);
    const mc = E.mer.find(m => m.dl === 0), eq = E.par.find(p => p.phi === 0);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="' + id + '-clip"><rect x="' + ESQ.x0 + '" y="' + ESQ.y0 +
      '" width="' + (ESQ.x1 - ESQ.x0) + '" height="' + (ESQ.y1 - ESQ.y0) + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + '-clip)"><path class="gridl v4-grid" d="' + grid + '"/>' +
      '<g class="v4-geo"><path class="mer" d="' + mer + par + '"/><path class="equ" d="' + lineD(eq.x, eq.y, SX, SY) + '"/>' +
      '<path class="mc" d="' + lineD(mc.x, mc.y, SX, SY) + '"/></g><path class="trail v4-trail"/></g>' +
      '<rect class="frame" x="' + ESQ.x0 + '" y="' + ESQ.y0 + '" width="' + (ESQ.x1 - ESQ.x0) + '" height="' + (ESQ.y1 - ESQ.y0) + '" style="stroke-width:1.5"/>' +
      '<path class="garc v4-arc"/><path class="nq v4-nq"/><path class="ng v4-ng"/><circle class="pole v4-p" r="9"/></svg>');
    const r = { svg, T: kit.json('v4-dados.json').trilha };
    for (const c of ['grid', 'geo', 'trail', 'arc', 'nq', 'ng', 'p']) r[c] = svg.querySelector('.v4-' + c);
    const lab = (html, x, y, style) => { const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;' + (style || '') + '">' + html + '</div>'); r.labs.push(e); return e; };
    r.labs = [];
    lab('MC', SX(0) + 10, ESQ.y0 + 6, 'color:var(--accent);font-size:26px');
    lab('Equador', ESQ.x0 + 10, SY(0) - 40, 'font-size:26px');
    for (const m of E.mer) if (m.dl > 0) { const i = m.y.findIndex(v => v > -560); lab('+' + m.dl + '°', SX(m.x[i]) + 4, SY(m.y[i]) - 4, 'font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'); }
    for (const p of E.par) if (p.phi && Math.abs(p.phi) <= 45) { const i = p.x.findIndex(v => v > -5350); lab((p.phi > 0 ? '+' : '−') + Math.abs(p.phi) + '°', ESQ.x0 + 6, SY(p.y[i]) - 34, 'font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'); }
    r.nqL = kit.h('<div class="lbl" style="font-size:28px;font-family:var(--sans);font-weight:700">NQ</div>');
    r.ngL = kit.h('<div class="lbl" style="font-size:28px;font-family:var(--sans);font-weight:700;color:var(--accent)">NG</div>');
    r.gL = kit.h('<div class="lbl" style="font-size:32px;color:var(--accent)"><i>γ</i></div>');
    r.pL = kit.h('<div class="lbl" style="font-size:28px;font-family:var(--sans);font-weight:700">P</div>');
    r.labs.push(r.nqL, r.ngL, r.gL, r.pL);
    r.mount = stage => { stage.append(svg); for (const e of r.labs) stage.append(e); };
    return r;
  }

  // Estado de P interpolado na trilha (índice fracionário u em [0, n])
  function at(T, u) {
    const n = T.length, i = Math.floor(u) % n, j = (i + 1) % n, k = u - Math.floor(u);
    return T[i].map((v, c) => lerp(v, T[j][c], k));
  }

  // st = {u, geo, grid, arrows, trail: [u0, u1]}
  function paint(r, st) {
    const [dl, phi, x, y, g] = at(r.T, st.u);
    const px = SX(x), py = SY(y);
    r.p.setAttribute('cx', f1(px)); r.p.setAttribute('cy', f1(py));
    const a = -g, L = 130;
    r.nq.setAttribute('d', arrow(px, py, 0, L));
    r.ng.setAttribute('d', arrow(px, py, a, L));
    r.arc.setAttribute('d', Math.abs(a) > 0.3 ? sector(px, py, 0, a, 95) : '');
    const ar = st.arrows ?? 1;
    for (const e of [r.nq, r.ng, r.p]) e.style.opacity = ar;
    r.arc.style.opacity = ar * (st.garc ?? 1);
    r.geo.style.opacity = st.geo ?? 1; r.grid.style.opacity = st.grid ?? 1;
    for (const e of r.labs) e.style.opacity = st.geo ?? 1;
    // Rótulos: NQ do lado oposto a NG; com γ pequeno, lado a lado sobre as setas
    const perto = Math.abs(a) < 8;
    Object.assign(r.nqL.style, { left: f1(px - (a > 0 || perto ? 58 : -14)) + 'px', top: f1(py - L - 40) + 'px', opacity: ar });
    const ex = px + Math.sin(a * D) * (L + 26), ey = py - Math.cos(a * D) * (L + 26);
    Object.assign(r.ngL.style, { left: f1(perto ? px + 14 : ex - 22) + 'px', top: f1(perto ? py - L - 40 : ey - 22) + 'px', opacity: ar });
    const gx = px + Math.sin(a / 2 * D) * 120, gy = py - Math.cos(a / 2 * D) * 120;
    Object.assign(r.gL.style, { left: f1(gx - 10) + 'px', top: f1(gy - 22) + 'px', opacity: ar * (st.garc ?? 1) * (Math.abs(a) > 3 ? 1 : 0) });
    Object.assign(r.pL.style, { left: f1(px + (a > 0 ? -40 : 16)) + 'px', top: f1(py + 4) + 'px', opacity: ar });
    if (st.trail) {
      let d = '';
      for (let u = st.trail[0]; u <= st.trail[1]; u += 1) { const q = at(r.T, u); d += (d ? 'L' : 'M') + f1(SX(q[2])) + ' ' + f1(SY(q[3])); }
      r.trail.setAttribute('d', d);
    } else r.trail.setAttribute('d', '');
    return { dl, phi, g, px, py };
  }

  return { D, lerp, f1, dms, dm, num, arrow, sector, lineD, build, paint, at, ESQ, SX, SY };
})();
