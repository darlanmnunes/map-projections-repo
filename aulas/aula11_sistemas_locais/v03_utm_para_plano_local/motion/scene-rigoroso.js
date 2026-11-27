// Cena 2: método rigoroso, os quatro passos com P1 (slides 27 e 32)
const { seg, eo, eio, TextFx } = kit;
kit.scene('rigoroso', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A11V3.estilo(kit);
    const V = kit.json('v3-dados.json'), n = A11.num, P = V.pts.P1, R = P.rig;
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Método rigoroso, passo a passo com P1</h2>').querySelector('h2');
    const cx = [
      '<span class="passo">1</span><span class="t"><span>(<i>E</i>, <i>N</i>) → (<i>φ</i>, <i>λ</i>): TM inversa</span><span class="r"><i>φ</i> = ' + A11.dms(R.lat, 2) + ' ; <i>λ</i> = ' + A11.dms(R.lon, 2) + '</span></span>',
      '<span class="passo">2</span><span class="t"><span>(<i>φ</i>, <i>λ</i>, <i>h</i><sub>L</sub>) → (<i>X</i>, <i>Y</i>, <i>Z</i>), eq. (29), em <i>h</i><sub>L</sub> = 700 m</span><span class="r">Δ<i>X</i> = ' + n(R.dX[0], 3) + ' ; Δ<i>Y</i> = ' + n(R.dX[1], 3) + ' ; Δ<i>Z</i> = ' + n(R.dX[2], 3) + '</span></span>',
      '<span class="passo">3</span><span class="t"><span><b>T</b> · (Δ<i>X</i>, Δ<i>Y</i>, Δ<i>Z</i>) → terna local, eq. (30)</span><span class="r"><i>x</i><sub>L</sub> = ' + n(R.x, 3) + ' ; <i>y</i><sub>L</sub> = ' + n(R.y, 3) + ' ; <i>z</i><sub>L</sub> = ' + n(R.z, 3) + '</span></span>',
      '<span class="passo">4</span><span class="t"><span>+ (150 000 ; 250 000), eq. (35)</span><span class="r"><b><i>X</i><sub>L</sub> = ' + n(R.XL, 3) + ' m ; <i>Y</i><sub>L</sub> = ' + n(R.YL, 3) + ' m</b></span></span>',
    ];
    const fl = kit.h('<div class="v3flow" style="left:110px;top:200px;width:940px">' + cx.map(c => '<div class="b">' + c + '</div>').join('') + '</div>');
    kit.stage.append(fl);
    this.cx = [...fl.children];
    this.ref = A11.bloco(kit, 110, 870, 940, '<p class="sub" style="color:var(--second)">Referência para comparar os dois atalhos.</p>');
    // Corte esquemático: elipsoide (curvatura exagerada), plano tangente em O, eixos e queda zL
    const O = [1460, 430], Rr = 700, cy = O[1] + Rr;
    const arco = [];
    for (let dx = -360; dx <= 360; dx += 10) arco.push([O[0] + dx, cy - Math.sqrt(Rr * Rr - dx * dx)]);
    const dx1 = 300, P1 = [O[0] + dx1, cy - Math.sqrt(Rr * Rr - dx1 * dx1)];
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="elip r-el" d="' + A11.lineD(arco) + '"/>' +
      '<path class="plano r-pl" d="M1080 ' + O[1] + 'H1840"/>' +
      '<path class="nq r-x" d="' + A11.arrow(O[0], O[1], 90, 200) + '"/><path class="nq r-z" d="' + A11.arrow(O[0], O[1], 0, 200) + '"/>' +
      '<path class="nq r-y" d="' + A11.arrow(O[0], O[1], -55, 150) + '"/>' +
      '<path class="gap r-dz" d="M' + P1[0] + ' ' + O[1] + 'V' + P1[1] + '"/>' +
      '<circle class="marco" r="11" cx="' + O[0] + '" cy="' + O[1] + '"/>' +
      '<circle class="novo r-p" r="11" cx="' + P1[0] + '" cy="' + P1[1] + '"/><circle class="ptdot r-pp" r="9" cx="' + P1[0] + '" cy="' + O[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['el', 'pl', 'x', 'y', 'z', 'dz', 'p', 'pp']) this.e[c] = svg.querySelector('.r-' + c);
    const L = (h, x, y, st) => A11.lbl(kit, h, x, y, st || '');
    this.l = {
      o: L('O', O[0] - 22, O[1] + 18, 'font-family:var(--sans);font-weight:700'),
      pl: L('plano tangente', 1090, O[1] - 46, 'color:var(--plano);font-size:26px'),
      el: L('superfície em <i>h</i><sub>L</sub>', 1110, 560, 'color:var(--elip);font-size:26px'),
      x: L('<i>x</i><sub>L</sub> leste', O[0] + 120, O[1] - 46, 'font-size:26px'),
      z: L('<i>z</i><sub>L</sub> normal', O[0] + 12, O[1] - 236, 'font-size:26px'),
      y: L('<i>y</i><sub>L</sub> norte', O[0] - 230, O[1] - 150, 'font-size:26px'),
      p: L('P1', P1[0] + 20, P1[1] + 4, 'font-family:var(--sans);font-weight:700;color:var(--accent)'),
      dz: L('<i>z</i><sub>L</sub> = −0,255 m', P1[0] - 250, (O[1] + P1[1]) / 2 + 10, 'color:var(--tissot);font-size:28px'),
      ds: L('<i>s</i>²/(2<i>R</i><sub>m</sub>) = 1 800² / (2 × 6 362 091)', 1120, 640, 'font-size:26px'),
    };
    this.esq = A11.bloco(kit, 1100, 720, 740, '<p class="note">Corte esquemático: curvatura muito exagerada. O ponto e a origem estão na altitude do plano.</p>');
    this.k = {
      b1: kit.em('b1', 'rigoroso'), p1: kit.em('b1', 'acompanhar'), s1: kit.em('b2', 'primeiro'), s2: kit.em('b3', 'segundo'),
      at: kit.em('b3', 'atencao'), s3: kit.em('b4', 'terceiro'), lst: kit.em('b4', 'sai'), z: kit.em('b5', 'menos'),
      qu: kit.em('b5', 'queda'), des: kit.em('b5', 'descartado'), s4: kit.em('b6', 'quarto'), ref: kit.em('b6', 'referencia'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, e = this.e, l = this.l;
    const ini = [k.s1, k.s2, k.s3, k.s4], fim = [k.s2, k.s3, k.s4, Infinity];
    this.cx.forEach((c, i) => { A11.show(c, t, ini[i] - 0.2); c.classList.toggle('on', t >= ini[i] && t < fim[i]); });
    A11.show(this.ref, t, k.ref);
    A11.draw(e.el, eio(seg(t, k.b1, k.b1 + 1.2))); A11.fade(l.el, t, k.b1 + 0.8);
    A11.draw(e.pl, eio(seg(t, k.at, k.at + 0.8))); A11.fade(l.pl, t, k.at + 0.4);
    A11.fade(l.o, t, k.b1 + 0.6);
    const p = eo(seg(t, k.p1, k.p1 + 0.5)); e.p.style.opacity = p; l.p.style.opacity = p;
    A11.draw(e.x, eio(seg(t, k.lst, k.lst + 0.5))); A11.draw(e.y, eio(seg(t, k.lst + 0.4, k.lst + 0.9))); A11.draw(e.z, eio(seg(t, k.lst + 0.8, k.lst + 1.3)));
    A11.fade(l.x, t, k.lst + 0.3); A11.fade(l.y, t, k.lst + 0.7); A11.fade(l.z, t, k.lst + 1.1);
    A11.draw(e.dz, eio(seg(t, k.z, k.z + 0.6))); A11.fade(l.dz, t, k.z + 0.3); A11.fade(l.ds, t, k.qu);
    e.pp.style.opacity = eo(seg(t, k.des, k.des + 0.5));
    A11.fade(this.esq, t, k.at + 0.6);
  },
});
