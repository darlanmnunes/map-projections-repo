// Cena 4 (48 a 65 s): mapa da Lambert (ESRI:102015); meridiano central, meridiano de Viçosa e γ = n(λ − λ0)
const { seg, eo, lerp, TextFx } = kit;
const LON = [-85, -30], LAT = [12, -56];
const BOX = { x0: 90, x1: 1090, y0: 170, y1: 1000 };
const VIC = { lam: -(42 + 52 / 60), phi: -(20 + 45 / 60) };
kit.scene('mapa', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    // Ajuste da janela do mapa ao quadro
    const frame = [];
    for (let l = LON[0]; l <= LON[1]; l += 1) frame.push([l, LAT[1]]);
    for (let p = LAT[1]; p <= LAT[0]; p += 1) frame.push([LON[1], p]);
    for (let l = LON[1]; l >= LON[0]; l -= 1) frame.push([l, LAT[0]]);
    for (let p = LAT[0]; p >= LAT[1]; p -= 1) frame.push([LON[0], p]);
    const raw = frame.map(q => V4.lcc(q[0], q[1]));
    const xs = raw.map(q => q[0]), ys = raw.map(q => q[1]);
    const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
    const s = Math.min((BOX.x1 - BOX.x0) / (bx1 - bx0), (BOX.y1 - BOX.y0) / (by1 - by0));
    const ox = (BOX.x0 + BOX.x1) / 2 - s * (bx0 + bx1) / 2, oy = (BOX.y0 + BOX.y1) / 2 + s * (by0 + by1) / 2;
    const P = (lam, phi) => { const q = V4.lcc(lam, phi); return [ox + s * q[0], oy - s * q[1], 1]; };
    this.P = P;
    const line = pts => V4.lineD(pts.map(q => P(q[0], q[1])));
    const ring = pts => V4.ringD(pts.map(q => P(q[0], q[1])));
    const mer = l => { const a = []; for (let p = LAT[0]; p >= LAT[1]; p -= 1) a.push([l, p]); return a; };
    const par = p => { const a = []; for (let l = LON[0]; l <= LON[1]; l += 1) a.push([l, p]); return a; };
    let grat = '';
    for (let l = -80; l <= -30; l += 10) grat += line(mer(l));
    for (let p = 10; p >= -50; p -= 10) grat += line(par(p));
    let land = '';
    for (const r of kit.json('v4-dados.json').sa) { const a = []; for (let i = 0; i < r.length; i += 2) a.push([r[i], r[i + 1]]); land += ring(a); }
    const v = P(VIC.lam, VIC.phi), vn = P(VIC.lam, VIC.phi + 1);
    // Direções no ponto: norte da grade (vertical) e meridiano de Viçosa (para o norte)
    const L = 330, R = 250;
    const dm = Math.atan2(vn[0] - v[0], v[1] - vn[1]);           // ângulo do meridiano em relação à vertical
    const tip = a => [v[0] + L * Math.sin(a), v[1] - L * Math.cos(a)];
    const arcPts = [];
    for (let i = 0; i <= 24; i++) { const a = dm * i / 24; arcPts.push([v[0] + R * Math.sin(a), v[1] - R * Math.cos(a)]); }
    const g0 = tip(0), g1 = tip(dm);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="mapa-clip"><path d="' + ring(frame) + '"/></clipPath></defs>' +
      '<g class="mapa-base"><path class="mapbg" d="' + ring(frame) + '"/>' +
      '<g clip-path="url(#mapa-clip)"><path class="land" d="' + land + '"/></g>' +
      '<path class="grat" d="' + grat + '"/><path class="frame" d="' + ring(frame) + '"/></g>' +
      '<path class="hl mapa-pp" d="' + line(par(-5)) + line(par(-42)) + '"/>' +
      '<path class="meri mapa-m0" d="' + line(mer(V4.L0)) + '"/>' +
      '<path class="merv mapa-mv" d="' + line(mer(VIC.lam)) + '"/>' +
      '<path class="gridn mapa-gn" d="M' + v[0] + ' ' + v[1] + 'L' + g0[0] + ' ' + g0[1] + '"/>' +
      '<path class="merv mapa-mt" d="M' + v[0] + ' ' + v[1] + 'L' + g1[0].toFixed(1) + ' ' + g1[1].toFixed(1) + '"/>' +
      '<path class="arrow mapa-arc" style="stroke-width:4" d="' + arcPts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('') + '"/>' +
      '<circle class="dot mapa-vd" cx="' + v[0] + '" cy="' + v[1] + '" r="10"/></svg>');
    kit.stage.append(svg);
    this.el = {};
    for (const c of ['base', 'pp', 'm0', 'mv', 'gn', 'mt', 'arc', 'vd']) this.el[c] = svg.querySelector('.mapa-' + c).style;
    // Rótulos
    const lbl = (html, x, y, cls) => { const e = kit.h('<div class="lbl' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    const m0t = P(V4.L0, LAT[0]), mvt = P(VIC.lam, LAT[0]), e5 = P(LON[1], -5), e42 = P(LON[1], -42);
    this.l = {
      pp: [lbl('−5°', e5[0] + 12, e5[1] - 22), lbl('−42°', e42[0] + 12, e42[1] - 22)],
      m0: lbl('<i>λ</i><sub>0</sub> = −60°', m0t[0] - 80, m0t[1] - 52),
      mv: lbl('<i>λ</i> = −42°52′', mvt[0] - 40, mvt[1] - 52),
      vd: lbl('Viçosa', v[0] + 18, v[1] + 6),
      g: lbl('<i>γ</i>', arcPts[12][0] - 6, arcPts[12][1] - 52),
    };
    for (const s of this.l.pp) s.color = 'var(--accent)';
    this.l.mv.color = 'var(--accent)';
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1000px">' +
      '<h2 class="line mapa-hd">Mapa da Lambert (cone desenvolvido)</h2></div>'));
    this.hd = kit.stage.querySelector('.mapa-hd');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1190px;top:' + top + 'px;width:660px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.e1 = p(250, '<p class="eq"><i>λ</i><sub>0</sub> = −60°,&emsp;<i>n</i> = −0,406</p>');
    this.e2 = p(330, '<p class="eq big"><i>γ</i> = <i>n</i>(<i>λ</i> − <i>λ</i><sub>0</sub>) = −6,96°</p>');
    this.e3 = p(420, '<p class="sub">Ângulo entre o meridiano de Viçosa e o norte da grade</p>');
    this.e4 = p(620, '<h2 class="line" style="font-size:44px">Na Lambert, a convergência meridiana é exatamente n(λ&nbsp;−&nbsp;λ₀)</h2>');
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.2);
    const E = this.el, Lb = this.l, f = (a) => eo(seg(t, a, a + 0.6));
    E.base.opacity = f(0.3);
    E.pp.opacity = f(1.6); for (const s of Lb.pp) s.opacity = f(1.6);
    E.m0.opacity = f(2.6); Lb.m0.opacity = f(2.6);
    E.mv.opacity = f(3.8); Lb.mv.opacity = f(3.8); E.vd.opacity = f(3.8); Lb.vd.opacity = f(3.8);
    E.gn.opacity = f(5.4); E.mt.opacity = f(5.4);
    E.arc.opacity = f(6.0); Lb.g.opacity = f(6.0);
    for (const [s, a] of [[this.e1, 6.8], [this.e2, 7.6], [this.e3, 8.4], [this.e4, 10.2]]) {
      const q = f(a); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    }
  },
});
