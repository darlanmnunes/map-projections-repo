// Cena 1: o roteiro do problema inverso (slide 15): corda e azimute, ψ e γ, azimute geodésico, De e Dh
const { seg, eo, eio, TextFx } = kit;
kit.scene('roteiro', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A10V5.estilo(kit);
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Problema inverso: o roteiro</h2>').querySelector('h2');
    const caixas = [
      '<span class="passo">0</span><span>Dados: (<i>E</i><sub>1</sub>, <i>N</i><sub>1</sub>) e (<i>E</i><sub>2</sub>, <i>N</i><sub>2</sub>)</span>',
      '<span class="passo">1</span><span class="eq"><i>D</i><sub>c</sub> = √(Δ<i>E</i>² + Δ<i>N</i>²)&ensp;Az<sub>C,12</sub> = arctan(Δ<i>E</i>/Δ<i>N</i>)&ensp;(27)</span>',
      '<span class="passo">2</span><span><i>ψ</i><sub>12</sub> (23) e <i>γ</i><sub>1</sub> (24), calculados com <i>E</i> e <i>N</i></span>',
      '<span class="passo">3</span><span class="eq">Az<sub>12</sub> = Az<sub>C,12</sub> + <i>ψ</i><sub>12</sub> + <i>γ</i><sub>1</sub>&ensp;(28)</span>',
      '<span class="passo">4</span><span class="eq"><i>D</i><sub>e</sub> = <i>D</i><sub>c</sub> / <i>m</i><sub>12</sub>&ensp;(eq. 19 para <i>m</i><sub>12</sub>)</span>',
      '<span class="passo">5</span><span class="eq"><i>D</i><sub>h</sub> = <i>D</i><sub>e</sub> / <i>F</i><sub>h</sub>&ensp;(18)</span>',
    ];
    const fl = kit.h('<div class="v5flow" style="left:110px;top:190px;width:920px">' + caixas.map(c => '<div class="b">' + c + '</div>').join('') + '</div>');
    kit.stage.append(fl);
    this.cx = [...fl.children];
    this.nota = A10.bloco(kit, 110, 930, 920, '<p class="note">Saídas: azimute geodésico Az<sub>12</sub>, distância no elipsoide <i>D</i><sub>e</sub> e no terreno <i>D</i><sub>h</sub>.</p>');
    // Diagrama: 1 e 2 na grade, ΔE, ΔN, corda e Az_C; depois NG com γ e a tangente com ψ (exagerados)
    const P1 = [1260, 560], P2 = [1640, 260], D = 180 / Math.PI;
    const azc = Math.atan2(P2[0] - P1[0], -(P2[1] - P1[1])) * D, G = 8, PS = 9;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="vert r-de" d="M' + P1[0] + ' ' + P1[1] + 'H' + P2[0] + '"/><path class="vert r-dn" d="M' + P2[0] + ' ' + P1[1] + 'V' + P2[1] + '"/>' +
      '<path class="corda r-co" d="M' + P1[0] + ' ' + P1[1] + 'L' + P2[0] + ' ' + P2[1] + '"/>' +
      '<path class="tang r-ta" d="' + A10.arrow(P1[0], P1[1], azc + PS, 300, 0, 0) + '"/>' +
      '<path class="garc r-az" style="fill:color-mix(in srgb, var(--corda) 14%, transparent);stroke:var(--corda)" d="' + A10.sector(P1[0], P1[1], 0, azc, 120) + '"/>' +
      '<path class="psiarc r-ps" d="' + A10.sector(P1[0], P1[1], azc, azc + PS, 200) + '"/>' +
      '<path class="garc r-ga" d="' + A10.sector(P1[0], P1[1], -G, 0, 230) + '"/>' +
      '<path class="nq r-nq" d="' + A10.arrow(P1[0], P1[1], 0, 260) + '"/><path class="ng r-ng" d="' + A10.arrow(P1[0], P1[1], -G, 260) + '"/>' +
      '<circle class="marco" r="11" cx="' + P1[0] + '" cy="' + P1[1] + '"/><circle class="marco" r="11" cx="' + P2[0] + '" cy="' + P2[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['de', 'dn', 'co', 'ta', 'az', 'ps', 'ga', 'nq', 'ng']) this.e[c] = svg.querySelector('.r-' + c);
    const L = (h, x, y, st) => A10.lbl(kit, h, x, y, st || '');
    this.l = {
      p: [L('1', P1[0] - 40, P1[1] + 2, 'font-family:var(--sans);font-weight:700;font-size:26px'), L('2', P2[0] + 18, P2[1] - 36, 'font-family:var(--sans);font-weight:700;font-size:26px')],
      de: L('Δ<i>E</i>', (P1[0] + P2[0]) / 2 - 20, P1[1] + 4), dn: L('Δ<i>N</i>', P2[0] + 14, (P1[1] + P2[1]) / 2 - 20),
      co: L('<i>D</i><sub>c</sub>', (P1[0] + P2[0]) / 2 - 60, (P1[1] + P2[1]) / 2 - 56, 'color:var(--corda)'),
      az: L('Az<sub>C</sub>', P1[0] + 30, P1[1] - 168, 'color:var(--corda);font-size:28px'),
      nq: L('NQ', P1[0] - 18, P1[1] - 304, 'font-family:var(--sans);font-weight:700;font-size:24px'),
      ng: L('NG', P1[0] - 82, P1[1] - 300, 'font-family:var(--sans);font-weight:700;font-size:24px;color:var(--accent)'),
      ga: L('<i>γ</i>', P1[0] - 30, P1[1] - 276, 'color:var(--accent)'),
      ps: L('<i>ψ</i>', P1[0] + 190, P1[1] - 120, 'color:var(--psi);font-size:34px'),
    };
    this.esq = A10.bloco(kit, 1120, 600, 720, '<p class="note">Esquema: <i>ψ</i> e <i>γ</i> muito exagerados.</p>');
    // Quadrantes do arco tangente (sinais de ΔE e ΔN)
    this.qd = A10.bloco(kit, 1120, 680, 720, '<table class="tab v5q"><tr><th>Δ<i>E</i></th><th>Δ<i>N</i></th><th>Az<sub>C</sub></th></tr>' +
      '<tr><td class="v">+</td><td class="v">+</td><td class="v">0° a 90°</td></tr><tr><td class="v">+</td><td class="v">−</td><td class="v">90° a 180°</td></tr>' +
      '<tr><td class="v">−</td><td class="v">−</td><td class="v">180° a 270°</td></tr><tr><td class="v">−</td><td class="v">+</td><td class="v">270° a 360°</td></tr></table>');
    this.k = {
      dados: kit.em('a1', 'coordenadas'), corda: kit.em('a2', 'corda'), az: kit.em('a2', 'azimute'), sin: kit.em('a2', 'sinais'),
      psi: kit.em('a3', 'psi'), gama: kit.em('a3', 'gama'), soma: kit.em('a3', 'somando'), geo: kit.em('a3', 'geodesico'),
      de: kit.em('a4', 'dividindo'), dh: kit.em('a4', 'dividindo', 2), fim: kit.em('a4', 'terreno'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, e = this.e, l = this.l;
    const ini = [k.dados, k.corda, k.psi, k.soma, k.de, k.dh], fim = [k.corda, k.psi, k.soma, k.de, k.dh, Infinity];
    this.cx.forEach((c, i) => { A10.show(c, t, ini[i] - 0.2); c.classList.toggle('on', t >= ini[i] && t < fim[i]); });
    this.cx[3].classList.toggle('on', t >= k.soma && t < k.de || t >= k.fim);
    A10.fade(this.nota, t, k.fim);
    // diagrama
    const p = eo(seg(t, k.dados, k.dados + 0.5)); for (const x of l.p) x.style.opacity = p;
    const d = eio(seg(t, k.corda - 0.2, k.corda + 0.6));
    A10.draw(e.de, d); A10.draw(e.dn, d); A10.draw(e.co, eio(seg(t, k.corda, k.corda + 0.8)));
    for (const x of [l.de, l.dn, l.co]) A10.fade(x, t, k.corda + 0.4);
    e.nq.style.opacity = eo(seg(t, k.az - 0.3, k.az + 0.3)); A10.fade(l.nq, t, k.az - 0.2);
    e.az.style.opacity = eo(seg(t, k.az, k.az + 0.6)); A10.fade(l.az, t, k.az + 0.2);
    A10.show(this.qd, t, k.sin);
    A10.draw(e.ta, eio(seg(t, k.psi - 0.2, k.psi + 0.5))); e.ps.style.opacity = eo(seg(t, k.psi, k.psi + 0.5)); A10.fade(l.ps, t, k.psi + 0.2);
    const g = eo(seg(t, k.gama, k.gama + 0.5)); e.ng.style.opacity = e.ga.style.opacity = g; l.ng.style.opacity = l.ga.style.opacity = g;
    A10.fade(this.esq, t, k.psi);
  },
});
