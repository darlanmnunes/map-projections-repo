// Cena 1: do geodésico (φ, λ, h) ao geocêntrico (X, Y, Z), eq. (29)
const { seg, eo, eio, TextFx } = kit;
kit.scene('geocentrico', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const V = kit.json('v2-dados.json').O;
    const C = [540, 580], a = 320, b = 288;
    const G = A11V2.globo(C, a, b, V.phi, V.lam), P = G.P;
    const O3 = G.E.pt(V.phi, V.lam), o = P(O3), c = P([0, 0, 0]);
    const tip = v => P(v);
    const X = tip([a + 150, 0, 0]), Y = tip([0, a + 150, 0]), Z = tip([0, 0, b + 140]);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' + G.svg +
      '<path class="ax gz k-z" d="' + A11V2.seta(c, Z) + '"/><path class="ax gx k-x" d="' + A11V2.seta(c, X) + '"/>' +
      '<path class="ax gy k-y" d="' + A11V2.seta(c, Y) + '"/>' +
      '<path class="raio k-r" d="M' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + 'L' + o[0].toFixed(1) + ' ' + o[1].toFixed(1) + '"/>' +
      '<circle class="marco k-c" r="7" cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '"/>' +
      '<circle class="novo k-o" r="11" cx="' + o[0].toFixed(1) + '" cy="' + o[1].toFixed(1) + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const k of ['z', 'x', 'y', 'r', 'c', 'o']) this.e[k] = svg.querySelector('.k-' + k);
    this.g = svg.querySelectorAll('.front, .back, .elfill');
    const S = 'font-family:var(--sans);font-weight:700;font-size:30px;';
    this.l = {
      z: A11.lbl(kit, '<i>Z</i>', Z[0] + 14, Z[1] - 20, S + 'color:var(--second)'),
      x: A11.lbl(kit, '<i>X</i>', X[0] + 10, X[1] - 10, S + 'color:#B0308F'),
      y: A11.lbl(kit, '<i>Y</i>', Y[0] + 12, Y[1] - 30, S + 'color:#2E8B57'),
      gw: A11.lbl(kit, 'Greenwich', P(G.E.pt(30, 0))[0] + 10, P(G.E.pt(30, 0))[1] - 10, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'),
      eq: A11.lbl(kit, 'equador', P(G.E.pt(0, 40))[0] - 40, P(G.E.pt(0, 40))[1] + 6, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'),
      o: A11.lbl(kit, '<b>O</b>&ensp;(<i>φ</i><sub>0</sub>, <i>λ</i><sub>0</sub>, <i>h</i><sub>0</sub>)', o[0] - 250, o[1] + 14, 'font-size:28px;color:var(--accent)'),
      c: A11.lbl(kit, 'centro da Terra', c[0] + 14, c[1] + 8, 'font-family:var(--sans);font-size:22px'),
    };
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Do elipsoide ao espaço: coordenadas geocêntricas</h2>').querySelector('h2');
    const B = (y, html, w = 800) => A11.bloco(kit, 1060, y, w, html);
    const n3 = v => A11.num(v, 3);
    this.t = [
      [B(190, '<p class="sub">GNSS: (<i>φ</i>, <i>λ</i>, <i>h</i>) no elipsoide&ensp;→&ensp;(<i>X</i>, <i>Y</i>, <i>Z</i>) no espaço</p>'), A11V2.em(kit, 'a1', 'geocentricas', 0.8)],
      [B(300, '<p class="sub sm"><b style="color:var(--second)"><i>Z</i></b>: eixo de rotação, para o polo norte<br><b style="color:#B0308F"><i>X</i></b>: equador, no meridiano de Greenwich<br><b style="color:#2E8B57"><i>Y</i></b>: equador, 90° a leste</p>'), A11V2.em(kit, 'a2', 'eixo', 0.2)],
      [B(480, '<p class="eq"><i>X</i> = (<i>N</i> + <i>h</i>) cos <i>φ</i> cos <i>λ</i><br><i>Y</i> = (<i>N</i> + <i>h</i>) cos <i>φ</i> sen <i>λ</i><br>' +
        '<i>Z</i> = [<i>N</i>(1 − <i>ε</i><sup>2</sup>) + <i>h</i>] sen <i>φ</i>&emsp;(29)</p>' +
        '<p class="note"><i>N</i>: raio do 1º vertical; <i>ε</i>: 1ª excentricidade; <i>h</i>: altitude geométrica</p>'), A11V2.em(kit, 'a3', 'equacao', 0.05)],
      [B(760, '<table class="tab"><tr><th colspan="2">Origem do exemplo, em Viçosa</th></tr>' +
        '<tr><td><i>φ</i><sub>0</sub>; <i>λ</i><sub>0</sub>; <i>h</i><sub>0</sub></td><td class="v">−20°44′10″; −42°53′25″; 700 m</td></tr>' +
        '<tr><td><i>X</i><sub>O</sub></td><td class="v">' + n3(V.X[0]) + ' m</td></tr><tr><td><i>Y</i><sub>O</sub></td><td class="v">' + n3(V.X[1]) + ' m</td></tr>' +
        '<tr><td><i>Z</i><sub>O</sub></td><td class="v">' + n3(V.X[2]) + ' m</td></tr></table>'), A11V2.em(kit, 'a3', 'vicosa', 0.4)],
    ];
    this.k = { z: A11V2.em(kit, 'a2', 'polo', 0.25), x: A11V2.em(kit, 'a2', 'greenwich', 0.5), y: A11V2.em(kit, 'a2', 'completa', 0.8),
      o: A11V2.em(kit, 'a1', 'latitude', 0.1), r: A11V2.em(kit, 'a1', 'espaco', 0.7), c: A11V2.em(kit, 'a2', 'origem', 0.05) };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const g = eo(seg(t, 0.2, 1.2));
    this.g.forEach(e => { e.style.opacity = g; });
    A11.fade(this.l.gw, t, 0.8); A11.fade(this.l.eq, t, 0.8);
    const e = this.e, k = this.k, l = this.l;
    A11.fade(e.o, t, k.o, 0.5); A11.fade(l.o, t, k.o + 0.2);
    A11.fade(e.c, t, k.r - 0.2); A11.draw(e.r, eio(seg(t, k.r, k.r + 1)));
    A11.fade(l.c, t, k.c);
    for (const [ax, t0] of [['z', k.z], ['x', k.x], ['y', k.y]]) { A11.draw(e[ax], eio(seg(t, t0, t0 + 0.9))); A11.fade(l[ax], t, t0 + 0.6); }
    for (const [el, t0] of this.t) A11.show(el, t, t0);
  },
});
