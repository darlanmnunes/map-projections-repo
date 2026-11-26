// Cena 2: a terna topocêntrica em O; translação da origem (X − XO, ...)
const { seg, eo, eio, TextFx } = kit;
kit.scene('terna', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const V = kit.json('v2-dados.json').O, T = kit.json('v2-dados.json').T;
    const C = [540, 580], a = 320, b = 288, L = 170;
    const G = A11V2.globo(C, a, b, V.phi, V.lam), P = G.P;
    const O3 = G.E.pt(V.phi, V.lam);
    this.P = P; this.O3 = O3; this.L = L;
    const o = P(O3), c = P([0, 0, 0]);
    const tipo = v => P(A11V2.add(O3, v, L));
    const ue = T[0], un = T[1], uu = T[2];
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' + G.svg +
      '<path class="raio" d="M' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + 'L' + o[0].toFixed(1) + ' ' + o[1].toFixed(1) + '"/>' +
      '<g class="k-gh"><path class="ghost k-g0"/><path class="ghost k-g1"/><path class="ghost k-g2"/></g>' +
      '<path class="ax le k-e" d="' + A11V2.seta(o, tipo(ue)) + '"/><path class="ax no k-n" d="' + A11V2.seta(o, tipo(un)) + '"/>' +
      '<path class="ax nu k-u" d="' + A11V2.seta(o, tipo(uu)) + '"/>' +
      '<circle class="marco" r="7" cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '"/>' +
      '<circle class="novo" r="11" cx="' + o[0].toFixed(1) + '" cy="' + o[1].toFixed(1) + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const k of ['gh', 'g0', 'g1', 'g2', 'e', 'n', 'u']) this.e[k] = svg.querySelector('.k-' + k);
    const S = 'font-family:var(--sans);font-weight:700;font-size:28px;';
    const te = tipo(ue), tn = tipo(un), tu = tipo(uu);
    this.l = {
      e: A11.lbl(kit, '<i>x</i><sub>L</sub> leste', te[0] + 10, te[1] - 14, S + 'color:#B0308F'),
      n: A11.lbl(kit, '<i>y</i><sub>L</sub> norte', tn[0] - 40, tn[1] - 46, S + 'color:#2E8B57'),
      u: A11.lbl(kit, '<i>z</i><sub>L</sub> normal', tu[0] - 200, tu[1] + 0, S + 'color:var(--second)'),
      o: A11.lbl(kit, '<b>O</b>', o[0] - 40, o[1] + 4, 'font-size:30px;color:var(--accent)'),
      gh: A11.lbl(kit, '<i>X</i>, <i>Y</i>, <i>Z</i> transladados', o[0] - 330, o[1] + 60, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'),
    };
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Uma terna presa à origem O</h2>').querySelector('h2');
    const B = (y, html, w = 800) => A11.bloco(kit, 1060, y, w, html);
    this.t = [
      [B(190, '<p class="sub">(<i>X</i>, <i>Y</i>, <i>Z</i>): milhões de metros, eixos sem relação com o terreno</p>'), A11V2.em(kit, 'b1', 'milhoes', 0.2)],
      [B(330, '<p class="sub"><b>Terna topocêntrica</b> em O(<i>φ</i><sub>0</sub>, <i>λ</i><sub>0</sub>, <i>h</i><sub>0</sub>):</p>' +
        '<p class="sub sm"><b style="color:#B0308F"><i>x</i><sub>L</sub></b> para leste<br><b style="color:#2E8B57"><i>y</i><sub>L</sub></b> para norte (meridiano de O)<br>' +
        '<b style="color:var(--second)"><i>z</i><sub>L</sub></b> na normal ao elipsoide</p>'), A11V2.em(kit, 'b1', 'terna', 0.5)],
      [B(620, '<p class="sub">1) translação: a terna nasce em O</p><p class="eq">(<i>X</i> − <i>X</i><sub>O</sub>, <i>Y</i> − <i>Y</i><sub>O</sub>, <i>Z</i> − <i>Z</i><sub>O</sub>)</p>'), A11V2.em(kit, 'b2', 'subtraimos', 0.3)],
      [B(800, '<p class="sub">2) rotação: falta girá-la</p>'), A11V2.em(kit, 'b2', 'falta', 0.85)],
    ];
    this.k = { e: A11V2.em(kit, 'b1', 'leste', 0.6), n: A11V2.em(kit, 'b1', 'norte', 0.7), u: A11V2.em(kit, 'b1', 'normal', 0.85),
      tr: A11V2.em(kit, 'b2', 'subtraimos', 0.3), fim: kit.F.b2.t1 };
    this.C = C;
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, l = this.l, P = this.P, L = this.L;
    // Terna final: aparece em b1 e esmaece quando a translação começa
    for (const [ax, t0] of [['e', k.e], ['n', k.n], ['u', k.u]]) {
      const op = eo(seg(t, t0, t0 + 0.6)) * (1 - 0.75 * eo(seg(t, k.tr, k.tr + 0.8)));
      e[ax].style.opacity = op; l[ax].style.opacity = op;
    }
    // Eixos X, Y, Z (tracejados) deslizam do centro até O
    const u = eio(seg(t, k.tr + 0.4, k.tr + 2.6));
    const base = [this.O3[0] * u, this.O3[1] * u, this.O3[2] * u], p0 = P(base);
    const dirs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    dirs.forEach((d, i) => e['g' + i].setAttribute('d', A11V2.seta(p0, P(A11V2.add(base, d, L)))));
    const vg = eo(seg(t, k.tr, k.tr + 0.4)); e.gh.style.opacity = vg; l.gh.style.opacity = eo(seg(t, k.tr + 2.4, k.tr + 3));
    A11.fade(l.o, t, 0.6);
    for (const [el, t0] of this.t) A11.show(el, t, t0);
  },
});
