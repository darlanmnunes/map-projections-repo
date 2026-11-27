// Cena 3 (38 a 53 s): γ no fuso 23 (GRS80): mapa, γ contra φ para Δλ fixo e os números de Viçosa
const { seg, eo, eio, lerp, TextFx } = kit;
const MAP = { cx: 280, n0: 10000, y0: 205, s: 0.205 };
const MX = e => MAP.cx + (e - 500) * MAP.s, MY = n => MAP.y0 + (MAP.n0 - n) * MAP.s;
const G = { x0: 600, x1: 1200, y0: 900, y1: 250, g0: -1.9, g1: 0.2 };
const GX = phi => G.x0 + (-phi) / 35 * (G.x1 - G.x0), GY = g => G.y0 - (g - G.g0) / (G.g1 - G.g0) * (G.y0 - G.y1);
const COR = ['var(--grid)', 'var(--main)', 'var(--accent)'];
kit.scene('fuso', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const dd = kit.json('v4-dados.json'), F = dd.fuso, f1 = A9V4.f1;
    // Mapa do fuso: células coloridas por γ (azul: γ > 0, a oeste; laranja: γ < 0, a leste)
    let cells = '';
    for (let j = 0; j < F.gamma.length; j++) for (let i = 0; i < F.gamma[j].length; i++) {
      const g = F.gamma[j][i], q = [[j, i], [j, i + 1], [j + 1, i + 1], [j + 1, i]];
      const d = q.map(([a, b], k) => (k ? 'L' : 'M') + f1(MX(F.E[a][b])) + ' ' + f1(MY(F.N[a][b]))).join('') + 'Z';
      cells += '<path class="cellsg" d="' + d + '" style="fill:' + (g > 0 ? 'var(--second)' : 'var(--accent)') + ';fill-opacity:' + (Math.abs(g) / 1.8 * 0.75).toFixed(3) + '"/>';
    }
    let lin = '';
    const col = i => F.E.map((r, j) => [r[i], F.N[j][i]]), row = j => F.E[j].map((e, i) => [e, F.N[j][i]]);
    const pd = pts => pts.map((p, k) => (k ? 'L' : 'M') + f1(MX(p[0])) + ' ' + f1(MY(p[1]))).join('');
    for (let i = 0; i < F.lam.length; i += 4) lin += pd(col(i));
    for (let j = 0; j < F.phi.length; j += 10) lin += pd(row(j));
    let br = '', mg = '';
    for (const l of F.linhas) { const d = pd(l.e.map((e, k) => [e, l.n[k]])); if (l.k === 'br') br += d; else mg += d; }
    const V = dd.vicosa;
    // Gráfico γ × φ
    let grid = '';
    for (let p = 0; p >= -35; p -= 5) grid += 'M' + f1(GX(p)) + ' ' + G.y0 + 'V' + G.y1;
    for (let g = -1.5; g <= 0.01; g += 0.5) grid += 'M' + G.x0 + ' ' + f1(GY(g)) + 'H' + G.x1;
    this.cv = dd.curvas;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="fz-map">' + cells +
      '<path class="gridl" style="stroke:color-mix(in srgb, var(--main) 35%, var(--ground))" d="' + lin + '"/>' +
      '<path class="mc" d="' + pd(col(12)) + '"/><path class="br" d="' + br + '"/><path class="mg" d="' + mg + '"/>' +
      '<path class="frame" style="stroke-width:1.5" d="' + pd(col(0)) + pd(col(F.lam.length - 1)) + pd(row(0)) + pd(row(F.phi.length - 1)) + '"/>' +
      '<circle class="dot fz-bd" r="8" cx="' + f1(MX(F.E[67][24] + (F.E[68][24] - F.E[67][24]) / 2)) + '" cy="' + f1(MY(F.N[67][24] + (F.N[68][24] - F.N[67][24]) / 2)) + '"/>' +
      '<circle class="dot fz-v" r="9" cx="' + f1(MX(V.E / 1000)) + '" cy="' + f1(MY(V.N / 1000)) + '"/></g>' +
      '<g class="fz-ax"><path class="gridl" d="' + grid + '"/><rect class="axisbox" x="' + G.x0 + '" y="' + G.y1 + '" width="' + (G.x1 - G.x0) + '" height="' + (G.y0 - G.y1) + '"/>' +
      '<path class="one" d="M' + G.x0 + ' ' + f1(GY(0)) + 'H' + G.x1 + '"/></g>' +
      this.cv.map((c, k) => '<path class="curve fz-c" style="stroke:' + COR[k] + ';stroke-width:3.5"/><path class="approx fz-a" style="stroke:' + COR[k] + '"/>').join('') +
      '<circle class="dot fz-gv" r="9" cx="' + f1(GX(-20.75)) + '" cy="' + f1(GY(V.gamma)) + '"/></svg>');
    kit.stage.append(svg);
    this.map = svg.querySelector('.fz-map').style; this.ax = svg.querySelector('.fz-ax').style;
    this.c = [...svg.querySelectorAll('.fz-c')]; this.a = [...svg.querySelectorAll('.fz-a')];
    this.v = svg.querySelector('.fz-v').style; this.bd = svg.querySelector('.fz-bd').style; this.gv = svg.querySelector('.fz-gv').style;
    this.ml = []; this.gl = [];
    const lab = (arr, html, x, y, st) => { const e = kit.h('<div class="tick" style="left:' + x + 'px;top:' + y + 'px;' + (st || '') + '">' + html + '</div>'); kit.stage.append(e); arr.push(e.style); return e.style; };
    for (let j = 0; j < F.phi.length; j += 20) lab(this.ml, (F.phi[j] ? '−' : '') + Math.abs(F.phi[j]) + '°', MX(F.E[j][0]) - 62, MY(F.N[j][0]) - 14);
    lab(this.ml, '−48°', MX(F.E[70][0]) - 34, MY(F.N[70][0]) + 8); lab(this.ml, '−42°', MX(F.E[70][24]) - 20, MY(F.N[70][24]) + 8);
    lab(this.ml, 'MC', MX(500) - 18, MAP.y0 - 34, 'color:var(--accent)');
    lab(this.ml, '<span style="color:var(--second)">■</span> <i>γ</i> &gt; 0&ensp;<span style="color:var(--accent)">■</span> <i>γ</i> &lt; 0', MX(170) - 30, MY(6125) + 46);
    this.vl = lab(this.ml, 'Viçosa', MX(V.E / 1000) + 14, MY(V.N / 1000) - 34, 'color:var(--main);font-weight:700');
    this.bl = lab(this.ml, '1°40′', MX(F.E[67][24]) + 16, MY(F.N[67][24]) - 4, 'color:var(--accent);font-weight:700');
    for (let p = 0; p >= -35; p -= 5) lab(this.gl, p ? '−' + (-p) : '0', GX(p) - (p ? 14 : 6), G.y0 + 10);
    for (let g = -1.5; g <= 0.01; g += 0.5) lab(this.gl, g ? '−' + (-g).toFixed(1).replace('.', ',') : '0', G.x0 - (g ? 56 : 26), GY(g) - 14);
    lab(this.gl, '<i>φ</i> (graus)', GX(-17.5) - 50, G.y0 + 44, 'font-family:var(--serif);font-size:28px;color:var(--main)');
    lab(this.gl, '<i>γ</i> (graus)', G.x0 - 20, G.y1 - 48, 'font-family:var(--serif);font-size:28px;color:var(--main)');
    const nm = ['Δ<i>λ</i> = +1°', 'Δ<i>λ</i> = +2°08′', 'Δ<i>λ</i> = +3°'];
    this.cl = this.cv.map((c, k) => lab(this.gl, nm[k], G.x1 + 12, GY(c.g[c.g.length - 1]) - 16, 'font-family:var(--serif);font-size:26px;color:' + COR[k]));
    this.leg = lab(this.gl, '— exato (GRS80)&emsp;··· Δ<i>λ</i> sen <i>φ</i>', G.x0 + 20, G.y1 + 14, 'font-family:var(--serif);font-size:26px;color:var(--main)');
    this.gvl = lab(this.gl, 'Viçosa', GX(-20.75) + 4, GY(V.gamma) + 14, 'font-family:var(--serif);font-size:26px;color:var(--main)');
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1200px"><h2 class="line fz-hd">Convergência no fuso 23 (GRS80)</h2></div>'));
    this.hd = kit.stage.querySelector('.fz-hd');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1360px;top:' + top + 'px;width:480px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t = [
      [p(230, '<p class="sub"><i>γ</i> cresce do Equador para o sul e do MC para as bordas</p>'), 2.2],
      [p(400, '<p class="sub"><b>Viçosa</b>: Δ<i>λ</i> = +2°08′, <i>φ</i> = −20°45′</p>'), 6.8],
      [p(500, '<p class="eq">eq. (10): <i>γ</i> = −0°45′21″</p><p class="eq">eq. (11): <i>γ</i> = <b>' + A9V4.dms(V.gamma, 2) + '</b></p><p class="note">(= pyproj)</p>'), 7.6],
      [p(720, '<p class="sub">Na borda do fuso em 33°45′ S: |<i>γ</i>| = 1°40′</p>'), 10.4],
    ];
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const m = eo(seg(t, 0.5, 1.5)); this.map.opacity = m; for (const s of this.ml) s.opacity = m;
    const v = eo(seg(t, 6.6, 7.2)); this.v.opacity = v; this.vl.opacity = v;
    const b = eo(seg(t, 10.2, 10.8)); this.bd.opacity = b; this.bl.opacity = b;
    const a = eo(seg(t, 2.8, 3.4)); this.ax.opacity = a; for (const s of this.gl) s.opacity = a;
    const n = this.cv[0].g.length, reach = Math.round((n - 1) * eio(seg(t, 3.4, 5.6)));
    const path = (k, f) => { let d = ''; for (let i = 0; i <= reach; i++) d += (i ? 'L' : 'M') + A9V4.f1(GX(-i * 0.5)) + ' ' + A9V4.f1(GY(f(i))); return d; };
    this.cv.forEach((c, k) => {
      this.c[k].setAttribute('d', path(k, i => c.g[i]));
      this.a[k].setAttribute('d', t > 5.8 ? path(k, i => c.dl * Math.sin(-i * 0.5 * A9V4.D)) : '');
      this.cl[k].opacity = a * eo(seg(t, 5.4, 6.0));
    });
    this.leg.opacity = a * eo(seg(t, 5.8, 6.4));
    const gv = eo(seg(t, 7.0, 7.6)); this.gv.opacity = gv; this.gvl.opacity = gv;
    for (const [s, a0] of this.t) { const k = eo(seg(t, a0, a0 + 0.6)); s.opacity = k; s.transform = 'translateX(' + lerp(26, 0, k) + 'px)'; }
  },
});
