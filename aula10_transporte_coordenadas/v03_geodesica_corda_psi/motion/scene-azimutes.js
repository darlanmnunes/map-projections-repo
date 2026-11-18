// Cena 2: três azimutes da mesma linha em 1: Az (do NG à tangente), AzQ (do NQ à tangente), AzC (do NQ à corda)
const { seg, eo, eio, TextFx } = kit;
kit.scene('azimutes', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const V = kit.json('v3-dados.json').vic;
    // Esquema exagerado: γ = −9° (NG a leste de NQ, como em Viçosa), ψ = 14°
    const P = [330, 880], azC = 40, PSI = 14, azT = azC + PSI, G = 9;
    const [cx, cy] = A10V3.dir(azC), Q = [P[0] + cx * 640, P[1] + cy * 640];
    const cv = A10V3.curva(P, Q, azT);
    const ray = (a, L) => { const [x, y] = A10V3.dir(a); return 'M' + P[0] + ' ' + P[1] + 'L' + (P[0] + x * L).toFixed(1) + ' ' + (P[1] + y * L).toFixed(1); };
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="garc z-gam" d="' + A10.sector(P[0], P[1], 0, G, 600) + '"/>' +
      '<path class="psiarc z-psi" d="' + A10.sector(P[0], P[1], azC, azT, 150) + '"/>' +
      '<path class="z-aaz" style="fill:none;stroke:var(--accent);stroke-width:4" d="' + A10.arc(P[0], P[1], G, azT, 300) + '"/>' +
      '<path class="z-aq" style="fill:none;stroke:var(--main);stroke-width:4" d="' + A10.arc(P[0], P[1], 0, azT, 390) + '"/>' +
      '<path class="z-ac" style="fill:none;stroke:var(--corda);stroke-width:4" d="' + A10.arc(P[0], P[1], 0, azC, 480) + '"/>' +
      '<path class="tang z-tan" d="' + ray(azT, 640) + '"/>' +
      '<path class="corda z-cor" d="M' + P[0] + ' ' + P[1] + 'L' + Q[0].toFixed(1) + ' ' + Q[1].toFixed(1) + '"/>' +
      '<path class="geod z-geo" d="' + cv.d + '"/>' +
      '<path class="nq z-nq" d="' + A10.arrow(P[0], P[1], 0, 680) + '"/><path class="ng z-ng" d="' + A10.arrow(P[0], P[1], G, 680) + '"/>' +
      '<circle class="marco" r="11" cx="' + P[0] + '" cy="' + P[1] + '"/><circle class="marco z-q" r="11" cx="' + Q[0].toFixed(1) + '" cy="' + Q[1].toFixed(1) + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['gam', 'psi', 'aaz', 'aq', 'ac', 'tan', 'cor', 'geo', 'nq', 'ng', 'q']) this.e[c] = svg.querySelector('.z-' + c);
    const am = (a, r) => { const [x, y] = A10V3.dir(a); return [P[0] + x * r, P[1] + y * r]; };
    const L = (h, a, r, st, dx = 0, dy = 0) => { const q = am(a, r); return A10.lbl(kit, h, q[0] + dx, q[1] + dy, st || ''); };
    const S = 'font-family:var(--sans);font-weight:700;font-size:26px;';
    this.l = {
      nq: L('NQ', 0, 690, S, -24, -42), ng: L('NG', G, 690, S + 'color:var(--accent)', 6, -42),
      az: L('Az', 20, 300, 'color:var(--accent)', 6, -40), aq: L('Az<sub>Q</sub>', 14, 390, '', 6, -44),
      ac: L('Az<sub>C</sub>', 12, 480, 'color:var(--corda)', 6, -46),
      gam: L('<i>γ</i>', G / 2, 610, 'color:var(--accent);font-size:34px', -6, -46),
      psi: L('<i>ψ</i>', azT + 6, 140, 'color:var(--psi);font-size:38px', 4, -10),
      tan: L('tangente', azT, 650, S + 'font-weight:400;color:color-mix(in srgb, var(--main) 70%, var(--ground))', 4, -10),
      cor: L('corda', azC, 560, S + 'color:var(--corda)', -100, -30),
      geo: A10.lbl(kit, 'geodésica<br>projetada', cv.C[0] + 10, cv.C[1] + 60, S + 'color:var(--elip);line-height:1.15'),
      p: A10.lbl(kit, '1', P[0] - 34, P[1] - 4, S), q: A10.lbl(kit, '2', Q[0] + 16, Q[1] - 28, S),
    };
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Três azimutes para a mesma linha</h2>').querySelector('h2');
    const B = (y, html) => A10.bloco(kit, 1120, y, 720, html);
    const dms = (g, c) => A10.dms(g, c);
    this.t = [
      [B(190, '<p class="sub"><b style="color:var(--accent)">Az</b>: azimute geodésico, do norte geográfico (NG) à tangente</p>'), kit.em('b1', 'geodesico')],
      [B(300, '<p class="sub"><b>Az<sub>Q</sub></b>: azimute de quadrícula, do NQ à tangente</p><p class="eq">Az<sub>Q</sub> = Az − <i>γ</i>&emsp;(12)</p>'), kit.em('b2', 'quadricula')],
      [B(460, '<p class="sub"><b style="color:var(--corda)">Az<sub>C</sub></b>: azimute da corda; entra em <i>E</i> e <i>N</i></p>'), kit.em('b3', 'azimute')],
      [B(560, '<p class="sub"><b style="color:var(--psi)"><i>ψ</i></b> = Az<sub>Q</sub> − Az<sub>C</sub></p><p class="eq big">Az<sub>C</sub> = Az − <i>γ</i> − <i>ψ</i>&emsp;(22)</p>'), kit.em('b4', 'reducao')],
      [B(712, '<table class="tab v3t"><tr><th colspan="2">Viçosa: linha norte-sul de 3 km</th></tr>' +
        '<tr><td>Az</td><td class="v">' + dms(V.az, 1) + '</td></tr><tr><td><i>γ</i></td><td class="v">' + dms(V.gama, 1) + '</td></tr>' +
        '<tr><td>Az<sub>Q</sub></td><td class="v">' + dms(V.azq, 1) + '</td></tr><tr><td><i>ψ</i></td><td class="v">+' + A10.num(V.psi, 2) + '″</td></tr>' +
        '<tr><td>Az<sub>C</sub></td><td class="v">' + dms(V.azc, 1) + '</td></tr></table>'), kit.em('b4', 'entao')],
      [A10.bloco(kit, 140, 990, 900, '<p class="note">Esquema com ângulos muito exagerados; os valores reais estão na tabela.</p>'), kit.em('b1', 'tres')],
    ];
    this.k = { ng: kit.em('b1', 'geodesico'), nq: kit.em('b2', 'quadricula'), g: kit.em('b2', 'convergencia'), c: kit.em('b3', 'corda'),
      psi: kit.em('b4', 'reducao') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, l = this.l;
    const g0 = eo(seg(t, 0.3, 1.0));
    A10.draw(e.geo, eio(seg(t, 0.4, 1.4))); A10.draw(e.tan, eio(seg(t, 1.0, 1.8)));
    e.q.style.opacity = g0; for (const x of [l.p, l.q, l.geo]) x.style.opacity = g0; A10.fade(l.tan, t, 1.4);
    const ng = eo(seg(t, k.ng, k.ng + 0.6)); e.ng.style.opacity = ng; l.ng.style.opacity = ng;
    A10.draw(e.aaz, eio(seg(t, k.ng + 0.4, k.ng + 1.2))); A10.fade(l.az, t, k.ng + 0.9);
    const nq = eo(seg(t, k.nq, k.nq + 0.6)); e.nq.style.opacity = nq; l.nq.style.opacity = nq;
    A10.draw(e.aq, eio(seg(t, k.nq + 0.4, k.nq + 1.2))); A10.fade(l.aq, t, k.nq + 0.9);
    e.gam.style.opacity = eo(seg(t, k.g, k.g + 0.6)); A10.fade(l.gam, t, k.g + 0.2);
    A10.draw(e.cor, eio(seg(t, k.c, k.c + 0.8))); A10.fade(l.cor, t, k.c + 0.5);
    A10.draw(e.ac, eio(seg(t, k.c + 0.5, k.c + 1.3))); A10.fade(l.ac, t, k.c + 1.0);
    e.psi.style.opacity = eo(seg(t, k.psi, k.psi + 0.6)); A10.fade(l.psi, t, k.psi + 0.2);
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
