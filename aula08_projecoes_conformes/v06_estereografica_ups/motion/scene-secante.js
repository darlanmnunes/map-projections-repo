// Cena 3 (28 a 45 s): o plano sobe e corta o globo em 81°06′52″ S; gráfico de m = 2k0/(1 + cos c), k0 = 1 e 0,994
const { seg, eo, eio, lerp, TextFx } = kit;
const C1 = { cx: 560, cy: 400, R: 230, e: 15, lc: 0 };
const C2 = { cx: 560, cy: 540, R: 190, e: -89, lc: 0 };
const ZOOM = { R: 820, sx: 520, sy: 780 };                   // polo sul fixo em (sx, sy) com o zoom
const WIN = { x: 60, y: 150, w: 940, h: 840 };
const G = { x0: 1110, x1: 1830, y0: 880, y1: 300, p0: -90, p1: -60, m0: 0.99, m1: 1.08 };
const GX = p => G.x0 + (p - G.p0) / (G.p1 - G.p0) * (G.x1 - G.x0);
const GY = m => G.y0 - (m - G.m0) / (G.m1 - G.m0) * (G.y0 - G.y1);
const mS = (p, k0) => 2 * k0 / (1 + Math.cos((90 + p) * V6.D));    // p < 0; c = 90° − |φ|
const PHI1 = -(90 - Math.acos(2 * V6.K0 - 1) / V6.D);              // m = 1 na esfera
kit.scene('secante', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.w = kit.h('<div style="position:absolute;inset:0"></div>');
    kit.stage.append(this.w);
    this.r = V6.build(kit, 'secante');
    this.w.append(this.r.svg);
    // Gráfico
    let grid = '';
    for (let p = -85; p <= -60; p += 5) grid += 'M' + GX(p) + ' ' + G.y0 + 'V' + G.y1;
    for (let m = 1.0; m <= 1.08 + 1e-9; m += 0.02) grid += 'M' + G.x0 + ' ' + GY(m).toFixed(1) + 'H' + G.x1;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="secante-ax"><path class="gridl" d="' + grid + '"/>' +
      '<rect class="axisbox" x="' + G.x0 + '" y="' + G.y1 + '" width="' + (G.x1 - G.x0) + '" height="' + (G.y0 - G.y1) + '"/>' +
      '<path class="one" d="M' + G.x0 + ' ' + GY(1) + 'H' + G.x1 + '"/>' +
      '<path class="pp" d="M' + GX(-80) + ' ' + G.y0 + 'V' + G.y1 + '"/></g>' +
      '<path class="ref0 secante-c1"/><path class="curve secante-c2"/>' +
      '<g class="secante-mk"><circle class="dot" cx="' + GX(-90) + '" cy="' + GY(V6.K0) + '" r="8"/>' +
      '<circle class="dot" cx="' + GX(-80) + '" cy="' + GY(mS(-80, V6.K0)) + '" r="8"/>' +
      '<circle class="dot" cx="' + GX(PHI1) + '" cy="' + GY(1) + '" r="8"/>' +
      '<path class="lead" d="M' + (GX(-89) + 20) + ' 668L' + GX(-90) + ' ' + GY(V6.K0) + 'M' + (GX(-89) + 250) + ' 468L' + GX(-80) + ' ' + GY(mS(-80, V6.K0)) + '"/></g>' +
      '<path class="lead secante-l1" d="M' + (GX(-89) + 230) + ' 568L' + GX(PHI1) + ' ' + GY(1) + '"/></svg>');
    this.w.append(svg);
    this.ax = svg.querySelector('.secante-ax').style;
    this.c1 = svg.querySelector('.secante-c1');
    this.c2 = svg.querySelector('.secante-c2');
    this.mk = svg.querySelector('.secante-mk').style;
    this.ticks = [];
    const tick = (html, x, y, cls) => { const e = kit.h('<div class="tick' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); this.w.append(e); this.ticks.push(e.style); };
    for (let p = -90; p <= -60; p += 5) tick('−' + (-p), GX(p) - 18, G.y0 + 10);
    for (let m = 1.0; m <= 1.08 + 1e-9; m += 0.02) tick(m.toFixed(2).replace('.', ','), G.x0 - 58, GY(m) - 14);
    tick('Latitude <i>φ</i> (graus)', GX(-75) - 100, G.y0 + 46, ' eqt');
    tick('<i>m</i> = 2<i>k</i><sub>0</sub> / (1 + cos <i>c</i>)', G.x0, G.y1 - 52, ' eqt');
    const lab = (html, x, y, color) => { const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;font-size:28px' + (color ? ';color:' + color : '') + '">' + html + '</div>'); this.w.append(e); return e.style; };
    this.lp = lab('polo: <i>m</i> = 0,994', GX(-89), 630);
    this.l80 = lab('80° S: <i>m</i> = 1,0016', GX(-89), 430);
    this.l1 = lab('<i>m</i> = 1 em 81°07′ S', GX(-89), 530);
    this.l1lead = svg.querySelector('.secante-l1').style;
    this.leg = lab('<span style="color:var(--grid)">- - <i>k</i><sub>0</sub> = 1</span>&emsp;— <i>k</i><sub>0</sub> = 0,994', G.x1 - 330, G.y1 + 16);
    this.lcut = lab('81°06′52″ S', 0, 0, 'var(--accent)');
    this.w.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px">' +
      '<h2 class="line secante-hd">Plano secante: <i>k</i><sub>0</sub> = 0,994</h2></div>'));
    this.hd = this.w.querySelector('.secante-hd').style;
    // Estado herdado da cena 2
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line">Círculos continuam círculos</h2></div>'),
      kit.h('<div class="words" style="left:1190px;top:300px;width:660px"><p class="sub">Círculo de 10° de raio em torno de 50° S, no globo e no plano</p></div>'),
      kit.h('<div class="words" style="left:1190px;top:440px;width:660px"><p class="sub">Visto de frente, o plano mostra um círculo perfeito</p></div>'),
    ];
    for (const e of old) this.w.append(e);
    this.old = old.map(e => e.style);
    this.pts = V6.smallCircle(35, -50, 10, 72);
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    const g = this.r;
    // Volta à vista de cima, depois zoom no polo sul
    const ub = eio(seg(t, 0.3, 2.3)), uz = eio(seg(t, 2.6, 4.6));
    const R = lerp(lerp(C2.R, C1.R, ub), ZOOM.R, uz), e = lerp(C2.e, C1.e, ub);
    const s0 = [C1.cx, lerp(C2.cy, C1.cy, ub) + lerp(C2.R, C1.R, ub) * Math.cos(e * V6.D)];
    const sx = lerp(s0[0], ZOOM.sx, uz), sy = lerp(s0[1], ZOOM.sy, uz);
    const C = { cx: sx, cy: sy - R * Math.cos(e * V6.D), R, e, lc: 0 };
    const zp = lerp(-1, V6.ZSEC, eio(seg(t, 5.0, 7.5)));
    V6.paint(g, C, { globe: 1, cut: 0, plane: 1, zp, cutc: eo(seg(t, 5.4, 6.0)), n: 1 - uz, s: 1 });
    // O círculo da cena 2 sai de cena
    const P = this.pts.map(q => V6.geo(C, q[0], q[1]));
    g.sc.setAttribute('d', V6.ringD(P.map(p => V6.cam(C, ...p))));
    g.pc.setAttribute('d', V6.ringD(P.map(p => V6.cam(C, ...V6.ray(p, -1)))));
    g.sc.style.opacity = g.pc.style.opacity = 1 - seg(t, 0, 0.8);
    g.rays.setAttribute('d', ''); g.ang.setAttribute('d', ''); g.rho.setAttribute('d', '');
    // Janela do zoom
    const win = { x: lerp(0, WIN.x, uz), y: lerp(0, WIN.y, uz), w: lerp(1920, WIN.w, uz), h: lerp(1080, WIN.h, uz) };
    for (const el of [g.winr, g.winf]) for (const k of ['x', 'y']) el.setAttribute(k, win[k].toFixed(1));
    for (const el of [g.winr, g.winf]) { el.setAttribute('width', win.w.toFixed(1)); el.setAttribute('height', win.h.toFixed(1)); }
    g.winf.style.opacity = uz;
    // Rótulo do círculo de corte
    const rr = Math.sqrt(1 - V6.ZSEC * V6.ZSEC), q = V6.cam(C, rr, 0, zp);
    Object.assign(this.lcut, { left: (q[0] + 16) + 'px', top: (q[1] - 50) + 'px', opacity: eo(seg(t, 7.8, 8.4)) });
    // Gráfico: k0 = 1 (tracejada) e a curva que desce até k0 = 0,994
    const ga = eo(seg(t, 8.6, 9.2));
    this.ax.opacity = ga; for (const s of this.ticks) s.opacity = ga;
    const curve = k0 => { let d = ''; for (let p = -90; p <= -60.001; p += 0.25) d += (p > -90 ? 'L' : 'M') + GX(p).toFixed(1) + ' ' + GY(mS(p, k0)).toFixed(1); return d; };
    this.c1.setAttribute('d', curve(1)); this.c1.style.opacity = eo(seg(t, 9.0, 9.6));
    this.c2.setAttribute('d', curve(lerp(1, V6.K0, eio(seg(t, 10.2, 12.2))))); this.c2.style.opacity = eo(seg(t, 10.0, 10.4));
    this.leg.opacity = eo(seg(t, 10.0, 10.6));
    const lk = eo(seg(t, 12.6, 13.2));
    this.mk.opacity = lk; this.lp.opacity = lk; this.l80.opacity = lk;
    this.l1.opacity = this.l1lead.opacity = eo(seg(t, 13.4, 14.0));
    const hd = eo(seg(t, 2.6, 3.2)); this.hd.opacity = hd; this.hd.transform = 'translateX(' + lerp(26, 0, hd) + 'px)';
    this.w.style.opacity = 1 - seg(t, 16.4, 17);
  },
});
