// Cena 3: contra-azimute. Az32 ≠ Az23 + 180°: os meridianos de 2 e de 3 convergem (esquema exagerado)
const { seg, eo, eio, TextFx } = kit;
kit.scene('contra', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A10V5.estilo(kit);
    const V = kit.json('v5-dados.json').vicosa, C = kit.json('v5-dados.json').contra;
    this.hd = A10.bloco(kit, 110, 60, 1400, '<h2 class="line">O contra-azimute não é Az + 180°</h2>').querySelector('h2');
    const D = 180 / Math.PI, P2 = [330, 820], P3 = [820, 560];
    const a23 = Math.atan2(P3[0] - P2[0], -(P3[1] - P2[1])) * D, a32 = a23 + 180;
    const G2 = 5, G3 = 15;                                  // inclinação dos meridianos no desenho (exagerada)
    const mer = (P, g) => { const u = [Math.sin(g / D), -Math.cos(g / D)]; return 'M' + (P[0] - u[0] * 160).toFixed(1) + ' ' + (P[1] - u[1] * 160).toFixed(1) + 'L' + (P[0] + u[0] * 330).toFixed(1) + ' ' + (P[1] + u[1] * 330).toFixed(1); };
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="mer c-m2" style="stroke-dasharray:10 7;opacity:.7" d="' + mer(P2, G2) + '"/><path class="mer c-m3" style="stroke-dasharray:10 7;opacity:.7" d="' + mer(P3, G3) + '"/>' +
      '<path class="sight c-l" d="M' + P2[0] + ' ' + P2[1] + 'L' + P3[0] + ' ' + P3[1] + '"/>' +
      '<path class="garc c-a23" d="' + A10.sector(P2[0], P2[1], G2, a23, 110) + '"/>' +
      '<path class="garc c-a32" style="fill:color-mix(in srgb, var(--second) 12%, transparent);stroke:var(--second)" d="' + A10.sector(P3[0], P3[1], G3, a32, 90) + '"/>' +
      '<path class="tang c-par" d="' + A10.arrow(P3[0], P3[1], G2, 260, 0, 0) + '"/>' +
      '<path class="psiarc c-dl" d="' + A10.sector(P3[0], P3[1], G2, G3, 230) + '"/>' +
      '<path class="ng c-n2" d="' + A10.arrow(P2[0], P2[1], G2, 260) + '"/><path class="ng c-n3" d="' + A10.arrow(P3[0], P3[1], G3, 260) + '"/>' +
      '<circle class="marco" r="11" cx="' + P2[0] + '" cy="' + P2[1] + '"/><circle class="marco" r="11" cx="' + P3[0] + '" cy="' + P3[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['m2', 'm3', 'l', 'a23', 'a32', 'par', 'dl', 'n2', 'n3']) this.e[c] = svg.querySelector('.c-' + c);
    const L = (h, x, y, st) => A10.lbl(kit, h, x, y, st || '');
    const S = 'font-family:var(--sans);font-weight:700;font-size:26px;';
    L('2', P2[0] - 40, P2[1] + 4, S); L('3', P3[0] + 18, P3[1] + 6, S);
    const q = (P, a, r) => [P[0] + r * Math.sin(a / D), P[1] - r * Math.cos(a / D)];
    let z;
    this.l = {
      n2: (z = q(P2, G2, 260), L('NG em 2', z[0] + 14, z[1] - 10, S + 'color:var(--accent)')),
      n3: (z = q(P3, G3, 260), L('NG em 3', z[0] + 14, z[1] - 10, S + 'color:var(--accent)')),
      a23: (z = q(P2, (G2 + a23) / 2, 130), L('Az<sub>23</sub>', z[0] + 6, z[1] - 30, 'color:var(--accent)')),
      a32: (z = q(P3, 140, 135), L('Az<sub>32</sub>', z[0] - 70, z[1] - 10, 'color:var(--second)')),
      par: (z = q(P3, G2, 260), L('paralela ao NG de 2', z[0] - 250, z[1] - 16, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))')),
      dl: (z = q(P3, 24, 200), L('33″', z[0] + 4, z[1] - 20, 'color:var(--psi);font-weight:700')),
      mer: L('meridianos de 2 e de 3: convergem para o polo Sul', 110, 1000, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'),
    };
    const dms = A10.dms;
    const B = (y, html) => A10.bloco(kit, 1120, y, 720, html);
    this.t = [
      [B(200, '<p class="eq big">Az<sub>23</sub> = ' + dms(V.az23, 1) + '</p>'), kit.em('c1', 'azimute')],
      [B(290, '<p class="eq big" style="color:var(--second)">Az<sub>32</sub> = ' + dms(V.az32, 1) + '</p>'), kit.em('c2', 'indo')],
      [B(390, '<p class="eq">Az<sub>32</sub> − Az<sub>23</sub> = <b>' + dms(V.az32 - V.az23, 0) + '</b></p><p class="sub">faltam <b style="color:var(--psi)">' + A10.num(-C.falta, 0) + '″</b> para 180°</p>'), kit.em('c2', 'faltam')],
      [B(560, '<p class="sub">É a convergência dos meridianos entre 2 e 3:</p><p class="eq">|Δ<i>λ</i> sen <i>φ</i>| ≈ ' + A10.num(Math.abs(C.conv), 1) + '″</p>'), kit.em('c3', 'convergencia')],
      [B(760, '<p class="note">Az<sub>32</sub> se calcula pela eq. (28) a partir do ponto 3, com <i>ψ</i><sub>32</sub> e <i>γ</i><sub>3</sub>. Desenho com a convergência muito exagerada: 33″ viraram 10°.</p>'), kit.em('c3', 'norte')],
    ];
    this.k = { m: kit.em('c1', 'contra'), a23: kit.em('c1', 'azimute'), a32: kit.em('c2', 'indo'), f: kit.em('c2', 'faltam'), cv: kit.em('c3', 'convergencia'), ng: kit.em('c3', 'norte') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, l = this.l;
    A10.draw(e.l, eio(seg(t, 0.4, 1.4)));
    const n = eo(seg(t, k.m, k.m + 0.6)); e.n2.style.opacity = e.n3.style.opacity = n; l.n2.style.opacity = l.n3.style.opacity = n;
    e.a23.style.opacity = eo(seg(t, k.a23, k.a23 + 0.6)); A10.fade(l.a23, t, k.a23 + 0.2);
    e.a32.style.opacity = eo(seg(t, k.a32, k.a32 + 0.6)); A10.fade(l.a32, t, k.a32 + 0.2);
    A10.draw(e.par, eio(seg(t, k.f, k.f + 0.6))); A10.fade(l.par, t, k.f + 0.3);
    e.dl.style.opacity = eo(seg(t, k.f + 0.4, k.f + 1.0)); A10.fade(l.dl, t, k.f + 0.6);
    const m = eio(seg(t, k.cv, k.cv + 1.2)); A10.draw(e.m2, m); A10.draw(e.m3, m); A10.fade(l.mer, t, k.cv + 0.6);
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
