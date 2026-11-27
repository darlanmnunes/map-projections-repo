// Cena 1: do terreno ao elipsoide. A linha horizontal a h = 668 m desce pelas verticais convergentes e encolhe (Fh)
const { seg, eo, eio, lerp, TextFx } = kit;
kit.scene('altitude', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v2-dados.json'), f1 = A10.f1;
    const C = [590, 2500], GA = [250, 430], GB = [930, 430];
    const xAt = (G, y) => C[0] + (G[0] - C[0]) * (C[1] - y) / (C[1] - G[1]);
    const yH = 430, yE = 780, R = C[1] - yE;
    this.geo = { C, GA, GB, xAt, yH, yE, R };
    const arcE = (y) => { const r = C[1] - y, xa = xAt(GA, y), xb = xAt(GB, y);
      const ya = C[1] - Math.sqrt(r * r - (xa - C[0]) ** 2), yb = C[1] - Math.sqrt(r * r - (xb - C[0]) ** 2);
      return 'M' + f1(xa) + ' ' + f1(ya) + 'A' + r + ' ' + r + ' 0 0 1 ' + f1(xb) + ' ' + f1(yb); };
    this.arcE = arcE;
    const vert = G => 'M' + f1(xAt(G, 250)) + ' 250L' + f1(xAt(G, 1010)) + ' 1010';
    // Elipsoide largo (arco além das verticais)
    const xl = 130, xr = 1060, ang = x => C[1] - Math.sqrt(R * R - (x - C[0]) ** 2);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="elip" d="M' + xl + ' ' + f1(ang(xl)) + 'A' + R + ' ' + R + ' 0 0 1 ' + xr + ' ' + f1(ang(xr)) + '" style="stroke-width:3;opacity:.55"/>' +
      '<path class="vert al-va" d="' + vert(GA) + '"/><path class="vert al-vb" d="' + vert(GB) + '"/>' +
      '<path class="dist al-dh" style="stroke:var(--horiz)" d="M' + GA[0] + ' ' + yH + 'L' + GB[0] + ' ' + yH + '"/>' +
      '<path class="dist al-mov" style="stroke:var(--horiz);opacity:.0;stroke-dasharray:14 10;stroke-width:4"/>' +
      '<path class="dist al-de" style="stroke:var(--elip)" d="' + arcE(yE) + '"/>' +
      '<path class="nq al-h" style="stroke-width:2.5" d="' + A10.arrowTo(1000, yE - 2, 1000, yH + 4, 14, 7) + A10.arrowTo(1000, yH + 4, 1000, yE - 2, 14, 7) + '"/>' +
      '<path class="nq al-r" style="stroke:color-mix(in srgb, var(--main) 55%, var(--ground));stroke-width:2.5" d="' + A10.arrowTo(C[0], yE + 6, C[0], 1030, 16, 8) + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['va', 'vb', 'dh', 'mov', 'de', 'h', 'r']) this.e[c] = svg.querySelector('.al-' + c);
    const L = (h, x, y, cor, st) => A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-size:26px;font-weight:700;color:' + cor + ';' + (st || ''));
    this.l = {
      dh: L('<i>D</i><sub>h</sub>&ensp;medida a <i>h</i> = 668 m', 400, yH - 50, 'var(--horiz)'),
      de: L('<i>D</i><sub>e</sub>&ensp;no elipsoide', 470, yE - 70, 'var(--elip)'),
      h: A10.lbl(kit, '<i>h</i>', 1016, (yH + yE) / 2 - 22, 'font-size:34px'),
      r: L('<i>R<sub>α</sub></i> até o centro de curvatura', C[0] + 18, 985, 'color-mix(in srgb, var(--main) 65%, var(--ground))', 'font-weight:400;font-size:24px'),
    };
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Do terreno ao elipsoide: fator de altitude</h2>').querySelector('h2');
    this.nota = A10.bloco(kit, 120, 1020, 1000, '<p class="note">Esquema fora de escala: a altitude e a convergência das verticais estão muito exageradas.</p>');
    const B = (y, html) => A10.bloco(kit, 1150, y, 700, html);
    const fh = d.fh;
    this.t = [
      [B(190, '<p class="eq big"><i>F</i><sub>h</sub> = <span class="frac"><span><i>R<sub>α</sub></i></span><span><i>R<sub>α</sub></i> + <i>h</i><sub>m</sub></span></span>&emsp;(18)</p>'), kit.em('a3', 'fator')],
      [B(300, '<p class="eq"><i>R<sub>α</sub></i> = <span class="frac"><span><i>M N</i></span><span><i>M</i> sen²Az + <i>N</i> cos²Az</span></span></p><p class="note">raio da seção normal no azimute da linha (Euler)</p>'), kit.em('a3', 'raio')],
      [B(450, '<p class="sub"><i>h</i>: altitude <b>geométrica</b>, <i>h</i> = <i>H</i> + <i>N</i><sub>geoide</sub></p><p class="eq" style="margin-top:8px"><i>D</i><sub>e</sub> = <i>F</i><sub>h</sub> · <i>D</i><sub>h</sub></p>'), kit.em('a3', 'geometrica')],
      [B(610, '<p class="sub">Viçosa: <i>F</i><sub>h</sub> = <b>' + A10.num(d.Fh668, 6) + '</b></p>'), kit.em('a4', 'vicosa')],
    ];
    // Barras: perda em mm/km para três altitudes
    const X0 = 1600, S = 0.75;                              // px por mm/km (barras crescem para a esquerda)
    const bars = [['100', fh['100'], 720], ['668', fh['668'], 800], ['2000', fh['2000'], 880]];
    let bsvg = '<svg class="art" viewBox="0 0 1920 1080"><path class="v2ax al-ax" d="M' + X0 + ' 700V940"/>';
    bars.forEach(([h, v, y], i) => { bsvg += '<rect class="v2bar al-b' + i + '" x="' + f1(X0 + v * S) + '" y="' + (y - 20) + '" width="' + f1(-v * S) + '" height="40" style="fill:' + (h === '668' ? 'var(--accent)' : 'color-mix(in srgb, var(--elip) 45%, var(--ground))') + '"/>'; });
    const bs = kit.h(bsvg + '</svg>'); kit.stage.append(bs); this.ax = bs.querySelector('.al-ax');
    this.bars = bars.map(([h, v, y], i) => ({ r: bs.querySelector('.al-b' + i), w: -v * S,
      lh: A10.lbl(kit, (h === '2000' ? '2 000' : h) + ' m', X0 + 14, y - 18, 'font-family:var(--sans);font-size:24px' + (h === '668' ? ';font-weight:700' : '')),
      lv: A10.lbl(kit, A10.num(v, h === '100' ? 1 : 0) + ' mm/km', X0 + v * S - 12, y - 18, 'font-size:26px;transform:translateX(-100%)') }));
    this.bt = A10.bloco(kit, 1150, 925, 700, '<p class="note" style="font-size:23px">Perda por quilômetro medido, conforme a altitude</p>');
    this.k = {
      dh: kit.em('a1', 'horizontal'), alt: kit.em('a1', 'altitude'), vt: kit.em('a2', 'verticais'), lev: kit.em('a2', 'levada'),
      enc: kit.em('a2', 'encolhe'), rz: kit.em('a2', 'raio'), b: [kit.em('a4', 'cada') - 0.6, kit.em('a4', 'quilometro'), kit.em('a4', '2000')],
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, g = this.geo, f1 = A10.f1;
    A10.draw(e.dh, eio(seg(t, k.dh - 0.2, k.dh + 0.8))); A10.fade(this.l.dh, t, k.dh + 0.4);
    e.h.style.opacity = eo(seg(t, k.alt, k.alt + 0.5)); A10.fade(this.l.h, t, k.alt);
    const v = eio(seg(t, k.vt, k.vt + 1.2)); A10.draw(e.va, v); A10.draw(e.vb, v);
    // a linha desce pelas verticais até o elipsoide
    const u = eio(seg(t, k.lev, k.enc + 0.4));
    if (u > 0 && u < 1) {
      const y = lerp(g.yH, g.yE, u);
      e.mov.setAttribute('d', u < 0.98 ? 'M' + f1(g.xAt(g.GA, y)) + ' ' + f1(y) + 'L' + f1(g.xAt(g.GB, y)) + ' ' + f1(y) : this.arcE(g.yE));
      e.mov.style.opacity = 0.9;
    } else e.mov.style.opacity = 0;
    A10.draw(e.de, eio(seg(t, k.enc + 0.2, k.enc + 0.8))); A10.fade(this.l.de, t, k.enc + 0.4);
    e.r.style.opacity = eo(seg(t, k.rz, k.rz + 0.6)); A10.fade(this.l.r, t, k.rz + 0.2);
    A10.fade(this.nota, t, k.vt + 0.8);
    for (const [el, t0] of this.t) A10.show(el, t, t0);
    A10.fade(this.bt, t, k.b[0]); A10.fade(this.ax, t, k.b[0]);
    this.bars.forEach((b, i) => {
      const p = eo(seg(t, k.b[i], k.b[i] + 0.7));
      b.r.setAttribute('width', f1(b.w * p)); b.r.setAttribute('x', f1(1600 - b.w * p));
      A10.fade(b.lh, t, k.b[i]); A10.fade(b.lv, t, k.b[i] + 0.5);
    });
  },
});
