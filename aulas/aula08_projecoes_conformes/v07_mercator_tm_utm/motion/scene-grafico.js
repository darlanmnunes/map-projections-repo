// Cena 3 (28 a 46 s): m contra x no paralelo de Viçosa; TM tangente (k0 = 1) desce × 0,9996 para o UTM
const { seg, eo, eio, lerp, TextFx } = kit;
const C1 = { cx: 640, cy: 600, R: 360, e: 12, lc: -30 };
const G = { x0: 260, x1: 1660, y0: 880, y1: 300, a: -330, b: 330, m0: 0.9993, m1: 1.0014 };
const GX = x => G.x0 + (x - G.a) / (G.b - G.a) * (G.x1 - G.x0);
const GY = m => G.y0 - (m - G.m0) / (G.m1 - G.m0) * (G.y0 - G.y1);
kit.scene('grafico', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    // Estado herdado da cena 2 (sai de cena)
    this.old = kit.h('<div style="position:absolute;inset:0"></div>');
    kit.stage.append(this.old);
    this.r = V7.build(kit, 'grafico');
    this.old.append(this.r.svg);
    for (const html of ['<div class="words" style="left:110px;top:56px;width:1100px"><h2 class="line">Fuso 23: de −48° a −42°</h2></div>',
      '<div class="words" style="left:1180px;top:280px;width:680px"><p class="eq">Viçosa: <i>φ</i> = −20°45′,&emsp;<i>λ</i> = −42°52′</p></div>',
      '<div class="words" style="left:1180px;top:380px;width:680px"><p class="sub">Indicatrizes da TM ao longo do paralelo de Viçosa: crescem para longe do MC</p></div>',
      '<div class="words" style="left:1180px;top:520px;width:680px"><p class="eq big"><i>m</i> ≈ 1 + <span class="frac"><span><i>x</i>²</span><span>2<i>R</i>²</span></span></p></div>'])
      this.old.append(kit.h(html));
    // Dados: m da TM tangente contra x (km), no paralelo de Viçosa
    this.cv = kit.json('v7-dados.json').curva;
    const target = 1 / V7.K0;
    let xc = 0;
    for (let i = Math.floor(this.cv.length / 2); i < this.cv.length - 1; i++) {
      const [xa, ma] = this.cv[i], [xb, mb] = this.cv[i + 1];
      if ((ma - target) * (mb - target) <= 0) { xc = xa + (target - ma) / (mb - ma) * (xb - xa); break; }
    }
    this.xc = xc;
    const xe = this.cv[this.cv.length - 1][0], xv = 222.2, mv = 1.000210;
    let grid = '';
    for (let x = -300; x <= 300; x += 100) grid += 'M' + GX(x) + ' ' + G.y0 + 'V' + G.y1;
    for (let m = 0.9995; m <= 1.0014; m += 0.0005) grid += 'M' + G.x0 + ' ' + GY(m).toFixed(1) + 'H' + G.x1;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="grafico-ax"><path class="gridl" d="' + grid + '"/>' +
      '<rect class="axisbox" x="' + G.x0 + '" y="' + G.y1 + '" width="' + (G.x1 - G.x0) + '" height="' + (G.y0 - G.y1) + '"/>' +
      '<path class="one" d="M' + G.x0 + ' ' + GY(1) + 'H' + G.x1 + '"/>' +
      '<path class="zedge" d="M' + GX(-xe) + ' ' + G.y0 + 'V' + G.y1 + 'M' + GX(xe) + ' ' + G.y0 + 'V' + G.y1 + '"/></g>' +
      '<path class="ref0 grafico-c1"/><path class="curve grafico-c2"/>' +
      '<path class="pp grafico-sec" style="stroke-dasharray:none;stroke-width:3" d="M' + GX(-xc) + ' ' + G.y0 + 'V' + G.y1 + 'M' + GX(xc) + ' ' + G.y0 + 'V' + G.y1 + '"/>' +
      '<circle class="dot grafico-v" cx="' + GX(xv) + '" cy="' + GY(mv) + '" r="9"/></svg>');
    this.gw = kit.h('<div style="position:absolute;inset:0"></div>');
    kit.stage.append(this.gw);
    this.gw.append(svg);
    this.ax = svg.querySelector('.grafico-ax').style;
    this.c1 = svg.querySelector('.grafico-c1'); this.c2 = svg.querySelector('.grafico-c2');
    this.sec = svg.querySelector('.grafico-sec').style; this.vd = svg.querySelector('.grafico-v').style;
    this.ticks = [];
    const tick = (html, x, y, cls) => { const e = kit.h('<div class="tick' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); this.gw.append(e); this.ticks.push(e.style); };
    for (let x = -300; x <= 300; x += 100) tick(x < 0 ? '−' + (-x) : String(x), GX(x) - (x < 0 ? 22 : x ? 18 : 6), G.y0 + 10);
    for (let m = 0.9995; m <= 1.0014; m += 0.0005) tick(m.toFixed(4).replace('.', ','), G.x0 - 92, GY(m) - 14);
    tick('<i>x</i> (km): distância ao MC no paralelo de Viçosa', GX(0) - 290, G.y0 + 46, ' eqt');
    tick('<i>m</i>', G.x0 - 40, G.y1 - 48, ' eqt');
    const lab = (html, x, y, color) => { const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;font-size:28px' + (color ? ';color:' + color : '') + '">' + html + '</div>'); this.gw.append(e); return e.style; };
    this.lEdge = lab('bordas do fuso: ±312 km', GX(xe) - 160, G.y1 - 44, 'var(--accent)');
    this.lTm = lab('TM tangente: <i>m</i> = 1 no MC, 1,0012 nas bordas', GX(-305), 828, 'var(--grid)');
    this.lSec = lab('<i>m</i> = 1 em <i>x</i> ≈ ±180 km', GX(-xc) + 14, G.y1 + 62, 'var(--accent)');
    this.lV = lab('Viçosa: <i>x</i> = 222 km, <i>m</i> = 1,000210', GX(xv) + 18, GY(mv) + 26);
    this.leg = lab('<span style="color:var(--grid)">- - TM tangente (<i>k</i><sub>0</sub> = 1)</span>&emsp;— UTM (<i>k</i><sub>0</sub> = 0,9996)', GX(-110), G.y1 + 16);
    this.gw.append(kit.h('<div class="words" style="left:110px;top:56px;width:1300px">' +
      '<h2 class="line grafico-hd">Do cilindro tangente ao secante: <i>k</i><sub>0</sub> = 0,9996</h2></div>'));
    this.hd = this.gw.querySelector('.grafico-hd').style;
  },
  render(t) {
    V7.paint(this.r, C1, { th: 90, rc: 1, body: 0.3, contact: 1, zone: 1, zedge: 1, vic: 1, tis: 1 });
    this.old.style.opacity = 1 - seg(t, 0, 0.8);
    const ga = eo(seg(t, 1.0, 1.6));
    this.ax.opacity = ga; for (const s of this.ticks) s.opacity = ga;
    const hd = eo(seg(t, 0.8, 1.4)); this.hd.opacity = hd; this.hd.transform = 'translateX(' + lerp(26, 0, hd) + 'px)';
    // TM tangente desenhada do MC para as bordas; depois desce × 0,9996
    const n = this.cv.length, mid = (n - 1) / 2, reach = Math.round(mid * eio(seg(t, 1.8, 4.2)));
    const path = k => { let d = ''; for (let i = mid - reach; i <= mid + reach; i++) { const [x, m] = this.cv[i]; d += (i > mid - reach ? 'L' : 'M') + GX(x).toFixed(1) + ' ' + GY(m * k).toFixed(1); } return d; };
    this.c1.setAttribute('d', path(1));
    this.lTm.opacity = eo(seg(t, 4.4, 5.0)); this.lEdge.opacity = eo(seg(t, 4.4, 5.0));
    const u = eio(seg(t, 6.2, 9.2));
    this.c2.setAttribute('d', t > 6.2 ? path(lerp(1, V7.K0, u)) : '');
    this.leg.opacity = eo(seg(t, 6.2, 6.8));
    const s = eo(seg(t, 9.6, 10.2)); this.sec.opacity = s; this.lSec.opacity = s;
    const v = eo(seg(t, 11.2, 11.8)); this.vd.opacity = v; this.lV.opacity = v;
    this.gw.style.opacity = 1 - seg(t, 17.4, 18);
  },
});
