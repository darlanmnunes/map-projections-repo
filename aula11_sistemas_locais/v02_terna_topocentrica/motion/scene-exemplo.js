// Cena 4: P1 na terna local; distância, azimute e a queda da superfície (zL = 11,745 m)
const { seg, eo, eio, TextFx } = kit;
kit.scene('exemplo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const D2 = kit.json('v2-dados.json'), P1 = D2.P1;
    const O = [220, 860], s = 0.36, p = [O[0] + P1.xL * s, O[1] - P1.yL * s];
    const f = v => v.toFixed(1);
    const prof = { y: 740, x0: 960, x1: 1700, drop: 90, up: 230 };
    const sy = x => prof.y + prof.drop * ((x - prof.x0) / (prof.x1 - prof.x0)) ** 2;
    let surf = ''; for (let x = 900; x <= 1780; x += 10) surf += (x === 900 ? 'M' : 'L') + x + ' ' + f(sy(x));
    const P1y = sy(prof.x1) - prof.up;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect class="frame" x="110" y="190" width="680" height="760" style="stroke-width:1.5"/>' +
      '<path class="ax le k-ex" d="' + A11.arrowTo(O[0], O[1], 760, O[1], 18, 9) + '"/>' +
      '<path class="ax no k-ey" d="' + A11.arrowTo(O[0], O[1], O[0], 220, 18, 9) + '"/>' +
      '<path class="garc k-az" d="' + A11.sector(O[0], O[1], 0, 35, 150) + '"/>' +
      '<path class="lead k-px" style="stroke-dasharray:8 6" d="M' + f(p[0]) + ' ' + f(p[1]) + 'V' + O[1] + 'M' + f(p[0]) + ' ' + f(p[1]) + 'H' + O[0] + '"/>' +
      '<path class="dist k-l" style="stroke:var(--accent)" d="M' + O[0] + ' ' + O[1] + 'L' + f(p[0]) + ' ' + f(p[1]) + '"/>' +
      '<circle class="marco" r="10" cx="' + O[0] + '" cy="' + O[1] + '"/><circle class="novo k-p" r="11" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '"/>' +
      '<g class="k-pr"><path class="plano" d="M900 ' + prof.y + 'H1800"/><path class="elip" style="stroke:var(--terreno)" d="' + surf + '"/>' +
      '<circle class="marco" r="8" cx="' + prof.x0 + '" cy="' + prof.y + '"/><circle class="novo" r="10" cx="' + prof.x1 + '" cy="' + f(P1y) + '"/>' +
      '<path class="br" d="M' + (prof.x1 - 40) + ' ' + prof.y + 'V' + f(P1y) + 'M' + (prof.x1 - 48) + ' ' + prof.y + 'h16M' + (prof.x1 - 48) + ' ' + f(P1y) + 'h16"/>' +
      '<path class="br" style="stroke:var(--terreno)" d="M' + (prof.x1 + 36) + ' ' + f(sy(prof.x1)) + 'V' + f(P1y) + 'M' + (prof.x1 + 28) + ' ' + f(sy(prof.x1)) + 'h16M' + (prof.x1 + 28) + ' ' + f(P1y) + 'h16"/>' +
      '<path class="br k-q" style="stroke:var(--psi);stroke-width:4" d="M' + prof.x1 + ' ' + prof.y + 'V' + f(sy(prof.x1)) + '"/></g></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const k of ['ex', 'ey', 'az', 'px', 'l', 'p', 'pr', 'q']) this.e[k] = svg.querySelector('.k-' + k);
    const S = 'font-family:var(--sans);font-weight:700;font-size:26px;';
    const n3 = v => A11.num(v, 3);
    this.l = {
      ex: A11.lbl(kit, '<i>x</i><sub>L</sub> (leste)', 640, O[1] - 52, S + 'color:#B0308F'),
      ey: A11.lbl(kit, '<i>y</i><sub>L</sub> (norte)', O[0] + 14, 210, S + 'color:#2E8B57'),
      o: A11.lbl(kit, 'O', O[0] - 36, O[1] + 4, S),
      p: A11.lbl(kit, 'P1', p[0] + 16, p[1] - 40, S + 'color:var(--accent)'),
      az: A11.lbl(kit, '35°', O[0] + 30, O[1] - 200, 'color:var(--accent)'),
      x: A11.lbl(kit, n3(P1.xL) + ' m', p[0] - 90, O[1] + 16, 'font-size:26px;color:#B0308F'),
      y: A11.lbl(kit, n3(P1.yL) + ' m', O[0] + 12, p[1] - 6, 'font-size:26px;color:#2E8B57'),
      d: A11.lbl(kit, '1 800 m no elipsoide', (O[0] + p[0]) / 2 + 30, (O[1] + p[1]) / 2 + 10, 'font-family:var(--sans);font-size:24px;color:var(--accent)'),
      pl: A11.lbl(kit, 'plano tangente em O', 910, prof.y - 44, 'font-family:var(--sans);font-size:22px;color:var(--plano)'),
      su: A11.lbl(kit, 'superfície a <i>h</i><sub>0</sub> = 700 m', 1100, sy(1300) + 14, 'font-family:var(--sans);font-size:22px;color:var(--terreno)'),
      zl: A11.lbl(kit, '<i>z</i><sub>L</sub> = 11,745 m', prof.x1 - 250, (prof.y + P1y) / 2 - 20, 'font-size:26px'),
      h: A11.lbl(kit, '12 m', prof.x1 + 50, (sy(prof.x1) + P1y) / 2 - 20, 'font-size:26px;color:var(--terreno)'),
      q: A11.lbl(kit, '0,255 m', prof.x1 + 12, prof.y + 18, 'font-size:24px;color:var(--psi)'),
      nt: A11.lbl(kit, 'perfil com escala vertical muito exagerada', 900, 1000, 'font-family:var(--sans);font-size:20px;color:color-mix(in srgb, var(--main) 60%, var(--ground))'),
    };
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Exemplo: P1 na terna local</h2>').querySelector('h2');
    const B = (y, html, w = 940) => A11.bloco(kit, 880, y, w, html);
    this.t = [
      [B(180, '<p class="sub sm">P1: 1 800 m de O, azimute geodésico 35°, <i>h</i> = 712 m</p>'), A11V2.em(kit, 'd1', 'ponto', 0.1)],
      [B(240, '<table class="tab"><tr><th></th><th>eq. (30)</th><th>pyproj</th></tr>' +
        '<tr><td><i>x</i><sub>L</sub></td><td class="v">' + n3(P1.xL) + ' m</td><td class="v">' + n3(P1.xL) + ' m</td></tr>' +
        '<tr><td><i>y</i><sub>L</sub></td><td class="v">' + n3(P1.yL) + ' m</td><td class="v">' + n3(P1.yL) + ' m</td></tr>' +
        '<tr class="k-zrow"><td><i>z</i><sub>L</sub></td><td class="v">' + n3(P1.zL) + ' m</td><td class="v">' + n3(P1.zL) + ' m</td></tr></table>'), A11V2.em(kit, 'd2', 'equacao', 0.1)],
      [B(500, '<p class="sub sm">√(<i>x</i><sub>L</sub>² + <i>y</i><sub>L</sub>²) = <b>' + n3(P1.dist) + ' m</b>&emsp;atan2 = <b>' + A11.dms(P1.az, 2) + '</b></p>'), A11V2.em(kit, 'd3', 'distancia', 0.1)],
    ];
    this.zrow = this.t[1][0].querySelector('.k-zrow');
    this.k = { o: 0.5, ax: A11V2.em(kit, 'd1', 'origem', 0.3), l: A11V2.em(kit, 'd1', 'metros', 0.35), az: A11V2.em(kit, 'd1', 'azimute', 0.55),
      x: A11V2.em(kit, 'd2', 'leste', 0.4), y: A11V2.em(kit, 'd2', 'norte', 0.6), pr: A11V2.em(kit, 'd4', 'ponto', 0.15),
      zl: A11V2.em(kit, 'd4', '11', 0.4), q: A11V2.em(kit, 'd4', 'quarto', 0.6), cur: A11V2.em(kit, 'd4', 'curvatura', 0.7) };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, l = this.l;
    A11.draw(e.ex, eio(seg(t, 0.4, 1.2))); A11.draw(e.ey, eio(seg(t, 0.6, 1.4)));
    A11.fade(l.ex, t, 1.0); A11.fade(l.ey, t, 1.2); A11.fade(l.o, t, 0.6);
    A11.draw(e.l, eio(seg(t, k.l, k.l + 1))); A11.fade(e.p, t, k.l + 0.8); A11.fade(l.p, t, k.l + 0.9); A11.fade(l.d, t, k.l + 0.9);
    A11.fade(e.az, t, k.az, 0.6); A11.fade(l.az, t, k.az + 0.3);
    A11.fade(e.px, t, k.x - 0.3); A11.fade(l.x, t, k.x); A11.fade(l.y, t, k.y);
    A11.fade(e.pr, t, k.pr, 0.8); for (const n of ['pl', 'su', 'h', 'nt']) A11.fade(l[n], t, k.pr + 0.3);
    A11.fade(l.zl, t, k.zl); A11.fade(e.q, t, k.q); A11.fade(l.q, t, k.q + 0.2);
    for (const [el, t0] of this.t) A11.show(el, t, t0);
    this.zrow.classList.toggle('on', t > k.zl);
  },
});
