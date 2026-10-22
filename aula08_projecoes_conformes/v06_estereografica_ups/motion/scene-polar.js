// Cena 4 (45 a 60 s): vista polar plana (k0 = 0,994): Antártida, indicatrizes, círculo de m = 1 e limite do UPS em 80° S
const { seg, eo, lerp, TextFx } = kit;
const M = { cx: 600, cy: 585, K: 700 };          // px por unidade de ρ (R = 1)
const D = V6.D, K0 = V6.K0;
const rho = p => 2 * K0 * Math.tan((90 + p) * D / 2);            // p < 0: c = 90° − |φ|
const XY = (lam, p) => { const r = rho(p); return [M.cx + M.K * r * Math.sin(lam * D), M.cy - M.K * r * Math.cos(lam * D)]; };
const PHI1 = -(90 - Math.acos(2 * K0 - 1) / D);
kit.scene('polar', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const f1 = v => v.toFixed(1), R60 = M.K * rho(-60);
    const circ = (p, cls) => '<circle class="' + cls + '" cx="' + M.cx + '" cy="' + M.cy + '" r="' + f1(M.K * rho(p)) + '"/>';
    let grat = '';
    for (let lam = 0; lam < 360; lam += 30) { const a = XY(lam, -89.9), b = XY(lam, -60); grat += 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]); }
    let land = '';
    for (const r of kit.json('v6-dados.json').ant) { for (let i = 0; i < r.length; i += 2) { const q = XY(r[i], r[i + 1]); land += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); } land += 'Z'; }
    // Indicatrizes: círculos de raio m·r0 (m = 2k0/(1 + cos c))
    const r0 = 2.6 * D;
    let tis = '';
    for (const p of [-65, -75]) for (let lam = 0; lam < 360; lam += 45) {
      const c = XY(lam, p), m = 2 * K0 / (1 + Math.cos((90 + p) * D)), rr = M.K * m * r0;
      tis += 'M' + f1(c[0] + rr) + ' ' + f1(c[1]) + 'a' + f1(rr) + ' ' + f1(rr) + ' 0 1 0 ' + f1(-2 * rr) + ' 0a' + f1(rr) + ' ' + f1(rr) + ' 0 1 0 ' + f1(2 * rr) + ' 0Z';
    }
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="polar-clip"><circle cx="' + M.cx + '" cy="' + M.cy + '" r="' + f1(R60) + '"/></clipPath></defs>' +
      '<g class="polar-base"><circle class="mapbg" cx="' + M.cx + '" cy="' + M.cy + '" r="' + f1(R60) + '"/>' +
      '<g clip-path="url(#polar-clip)"><path class="land" d="' + land + '"/></g>' +
      '<path class="grat" d="' + grat + '"/>' + [-85, -75, -70, -65].map(p => circ(p, 'grat')).join('') +
      circ(-60, 'frame') + '</g>' +
      '<path class="tis polar-tis" d="' + tis + '"/>' +
      '<g class="polar-m1">' + circ(PHI1, 'mone') + '</g><g class="polar-80">' + circ(-80, 'pp') + '</g></svg>');
    kit.stage.append(svg);
    this.el = {};
    for (const c of ['base', 'tis', 'm1', '80']) this.el[c] = svg.querySelector('.polar-' + c).style;
    const lbl = (html, x, y, color) => { const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;font-size:28px' + (color ? ';color:' + color : '') + '">' + html + '</div>'); kit.stage.append(e); return e.style; };
    const top = XY(0, -60);
    this.l0 = lbl('<i>λ</i><sub>0</sub> = 0°', top[0] - 50, top[1] - 46);
    // Legenda (os dois círculos são muito próximos para rótulos no mapa)
    kit.stage.append(kit.h('<div class="words polar-leg" style="left:' + (M.cx + R60 + 40) + 'px;top:' + (M.cy + 120) + 'px;gap:8px">' +
      '<p class="eq" style="font-size:30px"><span class="key" style="color:var(--main)"></span><i>m</i> = 1 (81°06′52″ S)</p>' +
      '<p class="eq" style="font-size:30px;color:var(--accent)"><span class="key" style="color:var(--accent);border-top-style:dashed"></span>limite do UPS (80° S)</p></div>'));
    this.leg = kit.stage.querySelector('.polar-leg').style;
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px">' +
      '<h2 class="line">Estereográfica polar sul (UPS)</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    kit.stage.append(kit.h('<div class="words polar-fin" style="left:1080px;top:250px;width:760px">' +
      '<h2 class="line" style="font-size:44px">UPS: k₀ = 0,994; λ₀ = 0°; FE = FN = 2&nbsp;000&nbsp;000 m; complementa o UTM</h2></div>'));
    this.fin = kit.stage.querySelector('.polar-fin').style;
    V6.sig(kit);
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, 0.2);
    const E = this.el, f = a => eo(seg(t, a, a + 0.6));
    E.base.opacity = f(0.3); this.l0.opacity = f(0.8);
    E.tis.opacity = f(2.0);
    E.m1.opacity = f(3.2); E['80'].opacity = f(4.4);
    this.leg.opacity = f(3.6);
    const q = f(6.4); this.fin.opacity = q; this.fin.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
  },
});
