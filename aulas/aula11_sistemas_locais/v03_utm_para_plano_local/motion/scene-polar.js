// Cena 4: método polar, eq. (41), com P1 (slides 29 e 33)
const { seg, eo, eio, TextFx } = kit;
kit.scene('polar', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A11V3.estilo(kit);
    const V = kit.json('v3-dados.json'), n = A11.num, P = V.pts.P1.pol, dms = A11.dms;
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Atalho 2: método polar</h2>').querySelector('h2');
    const cx = [
      '<span class="passo">1</span><span class="t"><span>corda na grade, de O até P1</span><span class="r"><i>S</i> = ' + n(P.S, 3) + ' m ; Az<sub>C</sub> = ' + dms(P.azc, 1) + '</span></span>',
      '<span class="passo">2</span><span class="t"><span><i>D</i><sub>e</sub> = <i>S</i> / <i>m</i><sub>OP</sub> (Aula 10, eq. 19)</span><span class="r"><i>m</i><sub>OP</sub> = ' + n(P.mop, 6) + ' → <b><i>D</i><sub>e</sub> = ' + n(P.De, 3) + ' m</b></span></span>',
      '<span class="passo">3</span><span class="t"><span><i>D</i><sub>L</sub> = <i>F</i><sub>L</sub> · <i>D</i><sub>e</sub>: ao plano</span><span class="r"><i>D</i><sub>L</sub> = ' + n(P.DL, 3) + ' m</span></span>',
      '<span class="passo">4</span><span class="t"><span>Az<sub>G</sub> = Az<sub>C</sub> + <i>ψ</i> + <i>γ</i><sub>0</sub></span><span class="r"><i>ψ</i> = +' + n(P.psi, 2) + '″ ; <i>γ</i><sub>0</sub> = ' + dms(V.g0, 1) + ' → <b>' + dms(P.azg, 1) + '</b></span></span>',
      '<span class="passo">5</span><span class="t"><span><i>X</i><sub>L</sub> = 150 000 + <i>D</i><sub>L</sub> sen Az<sub>G</sub> ; <i>Y</i><sub>L</sub> = 250 000 + <i>D</i><sub>L</sub> cos Az<sub>G</sub> (41)</span><span class="r"><b>' + n(P.XL, 3) + ' ; ' + n(P.YL, 3) + '</b></span></span>',
    ];
    const fl = kit.h('<div class="v3flow" style="left:110px;top:180px;width:1000px">' + cx.map(c => '<div class="b">' + c + '</div>').join('') + '</div>');
    kit.stage.append(fl);
    this.cx = [...fl.children];
    // Diagrama polar (ângulos exagerados)
    const O = [1300, 880], AC = 42, G = 12, Lp = 560;
    const P1 = [O[0] + Lp * Math.sin(AC * Math.PI / 180), O[1] - Lp * Math.cos(AC * Math.PI / 180)];
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="garc p-ac" style="fill:color-mix(in srgb, var(--corda) 14%, transparent);stroke:var(--corda)" d="' + A11.sector(O[0], O[1], 0, AC, 150) + '"/>' +
      '<path class="garc p-ag" d="' + A11.sector(O[0], O[1], G, AC, 250) + '"/>' +
      '<path class="nq p-nq" d="' + A11.arrow(O[0], O[1], 0, 420) + '"/><path class="ng p-ng" d="' + A11.arrow(O[0], O[1], G, 420) + '"/>' +
      '<path class="corda p-co" d="M' + O[0] + ' ' + O[1] + 'L' + P1[0] + ' ' + P1[1] + '"/>' +
      '<circle class="marco" r="11" cx="' + O[0] + '" cy="' + O[1] + '"/><circle class="novo p-p" r="12" cx="' + P1[0] + '" cy="' + P1[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['ac', 'ag', 'nq', 'ng', 'co', 'p']) this.e[c] = svg.querySelector('.p-' + c);
    const L = (h, x, y, st) => A11.lbl(kit, h, x, y, st || '');
    this.l = {
      o: L('O', O[0] - 46, O[1] + 4, 'font-family:var(--sans);font-weight:700'),
      p: L('P1', P1[0] + 20, P1[1] - 30, 'font-family:var(--sans);font-weight:700;color:var(--accent)'),
      nq: L('NQ', O[0] - 26, O[1] - 470, 'font-family:var(--sans);font-weight:700;font-size:26px'),
      ng: L('<i>Y</i><sub>L</sub>, norte geográfico', O[0] + 70, O[1] - 470, 'color:var(--accent);font-size:26px'),
      ac: L('Az<sub>C</sub>', O[0] + 20, O[1] - 196, 'color:var(--corda);font-size:28px'),
      ag: L('Az<sub>G</sub>', O[0] + 130, O[1] - 290, 'color:var(--accent);font-size:28px'),
      s: L('<i>S</i> → <i>D</i><sub>e</sub> → <i>D</i><sub>L</sub>', (O[0] + P1[0]) / 2 + 30, (O[1] + P1[1]) / 2 + 10, 'color:var(--corda);font-size:28px'),
    };
    this.esq = A11.bloco(kit, 1150, 960, 700, '<p class="note">Ângulos exagerados; <i>ψ</i> (0,8″) não aparece no desenho.</p>');
    this.err = kit.h('<div class="v3err" style="left:1250px;top:190px;background:color-mix(in srgb, var(--corda) 14%, var(--ground));border:2.5px solid var(--corda);color:var(--corda)">P1: erro de ' + n(V.pts.P1.e_pol, 1) + ' mm</div>');
    kit.stage.append(this.err);
    this.k = {
      d1: kit.em('d1', 'atalho'), dist: kit.em('d1', 'distancia'), corda: kit.em('d2', 'corda'), div: kit.em('d2', 'dividida'),
      volta: kit.em('d2', 'volta'), elev: kit.em('d2', 'elevacao'), az: kit.em('d3', 'azimute'), red: kit.em('d3', 'reducao'),
      volta2: kit.em('d3', 'volta'), coord: kit.em('d4', 'saem'), erro: kit.em('d4', 'erro'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, e = this.e, l = this.l;
    const ini = [k.corda, k.div, k.elev, k.red, k.coord], fim = [k.div, k.elev, k.red, k.coord, Infinity];
    this.cx.forEach((c, i) => { A11.show(c, t, ini[i] - 0.3); c.classList.toggle('on', t >= ini[i] && t < fim[i]); });
    A11.fade(l.o, t, k.d1);
    A11.draw(e.nq, eio(seg(t, k.d1 + 0.3, k.d1 + 1))); A11.fade(l.nq, t, k.d1 + 0.8);
    A11.draw(e.co, eio(seg(t, k.dist, k.dist + 0.8))); const p = eo(seg(t, k.dist + 0.5, k.dist + 1)); e.p.style.opacity = l.p.style.opacity = p;
    e.ac.style.opacity = eo(seg(t, k.corda, k.corda + 0.5)); A11.fade(l.ac, t, k.corda + 0.2);
    A11.fade(l.s, t, k.div);
    A11.draw(e.ng, eio(seg(t, k.red, k.red + 0.7))); A11.fade(l.ng, t, k.red + 0.4);
    e.ag.style.opacity = eo(seg(t, k.volta2 - 0.2, k.volta2 + 0.4)); A11.fade(l.ag, t, k.volta2);
    A11.fade(this.esq, t, k.red);
    A11.show(this.err, t, k.erro);
  },
});
