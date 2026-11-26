// Cena 5: convergência dos meridianos no plano local, eq. (37)
const { seg, eo, eio, TextFx } = kit;
kit.scene('convergencia', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const C = kit.json('v2-dados.json').conv;
    const O = [480, 565], Vy = O[1] + 1500, top = 210, bot = 930;
    const xAt = (xk, y) => O[0] + (xk - O[0]) * (Vy - y) / (Vy - O[1]);
    const f = v => v.toFixed(1);
    let mer = '';
    for (let k = -3; k <= 3; k++) { if (!k) continue; const xk = O[0] + k * 100; mer += 'M' + f(xAt(xk, top)) + ' ' + top + 'L' + f(xAt(xk, bot)) + ' ' + bot; }
    const Q = [O[0] + 275, O[1]], qt = [xAt(Q[0], 300), 300];
    const ang = Math.atan2(qt[0] - Q[0], -(qt[1] - Q[1])) * 180 / Math.PI;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<defs><clipPath id="v2cl"><rect x="140" y="' + top + '" width="680" height="' + (bot - top) + '"/></clipPath></defs>' +
      '<rect class="frame" x="140" y="' + top + '" width="680" height="' + (bot - top) + '" style="stroke-width:1.5"/>' +
      '<path class="mer k-m" clip-path="url(#v2cl)" d="' + mer + '"/><path class="mc k-c" style="stroke-width:5" d="M' + O[0] + ' ' + top + 'V' + bot + '"/>' +
      '<path class="ax no k-y" d="' + A11.arrowTo(O[0], O[1], O[0], 300, 18, 9) + '"/><path class="ax le k-x" d="' + A11.arrowTo(O[0], O[1], 680, O[1], 18, 9) + '"/>' +
      '<path class="garc k-g" d="' + A11.sector(Q[0], Q[1], 0, ang, 220) + '"/>' +
      '<path class="ghost k-p" style="stroke:#2E8B57" d="' + A11.arrowTo(Q[0], Q[1], Q[0], 300, 16, 8) + '"/>' +
      '<path class="ng k-n" d="' + A11.arrowTo(Q[0], Q[1], qt[0], qt[1], 16, 8) + '"/>' +
      '<circle class="marco" r="10" cx="' + O[0] + '" cy="' + O[1] + '"/><circle class="novo k-q" r="10" cx="' + Q[0] + '" cy="' + Q[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const k of ['m', 'c', 'y', 'x', 'g', 'p', 'n', 'q']) this.e[k] = svg.querySelector('.k-' + k);
    const S = 'font-family:var(--sans);font-weight:700;font-size:24px;';
    this.l = {
      c: A11.lbl(kit, 'meridiano de O:<br><i>Y</i><sub>L</sub> = norte geográfico', O[0] - 250, top + 14, S + 'color:var(--accent);line-height:1.2'),
      y: A11.lbl(kit, '<i>Y</i><sub>L</sub>', O[0] + 12, 300, S + 'color:#2E8B57'),
      x: A11.lbl(kit, '<i>X</i><sub>L</sub>', 650, O[1] + 12, S + 'color:#B0308F'),
      o: A11.lbl(kit, 'O', O[0] - 34, O[1] + 4, S),
      n: A11.lbl(kit, 'norte<br>geográfico', qt[0] + 10, 300 - 10, S + 'color:var(--accent);line-height:1.15'),
      g: A11.lbl(kit, '<i>γ</i><sub>L</sub>', Q[0] + 14, Q[1] - 250, 'font-size:34px;color:var(--accent)'),
      s: A11.lbl(kit, 'os meridianos convergem para o polo sul', 170, bot - 50, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'),
      ex: A11.lbl(kit, 'ângulos muito exagerados', 170, bot + 12, 'font-family:var(--sans);font-size:20px;color:color-mix(in srgb, var(--main) 60%, var(--ground))'),
    };
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Orientação: os meridianos convergem</h2>').querySelector('h2');
    const B = (y, html, w = 900) => A11.bloco(kit, 920, y, w, html);
    const s = x => A11.num(Math.abs(x), 0);
    const mm = Math.abs(C.g175), mi = Math.floor(mm / 60), se = Math.floor(mm - 60 * mi);
    this.t = [
      [B(200, '<p class="sub"><i>Y</i><sub>L</sub> aponta para o norte geográfico <b>só no meridiano da origem</b></p>'), A11V2.em(kit, 'e1', 'meridiano', 0.6)],
      [B(330, '<p class="eq big">Az<sub>L</sub> = Az − <i>γ</i><sub>L</sub></p><p class="eq"><i>γ</i><sub>L</sub> ≈ Δ<i>λ</i> sen <i>φ</i> ≈ <span class="frac"><span><i>x</i><sub>L</sub> tan <i>φ</i><sub>0</sub></span><span><i>R</i><sub>m</sub></span></span>&emsp;(37)</p>'), A11V2.em(kit, 'e2', 'convergencia', 0.5)],
      [B(590, '<table class="tab"><tr><th colspan="2">Viçosa (<i>φ</i><sub>0</sub> ≈ −20,7°)</th></tr>' +
        '<tr><td>por km a leste ou oeste</td><td class="v">≈ ' + s(C.gkm) + '″</td></tr>' +
        '<tr><td>a 17,5 km (borda do plano de 35 km)</td><td class="v">' + mi + '′' + String(se).padStart(2, '0') + '″</td></tr></table>'), A11V2.em(kit, 'e3', 'vicosa', 0.1)],
      [B(830, '<div class="card" style="position:relative;padding:18px 26px"><p class="sub" style="margin:0">Memorial: declarar se o azimute é <b>do plano</b> ou <b>geodésico</b></p></div>'), A11V2.em(kit, 'e3', 'memorial', 0.8)],
    ];
    this.k = { m: 0.5, c: A11V2.em(kit, 'e1', 'meridiano', 0.6), y: A11V2.em(kit, 'e1', 'eixo', 0.3), q: A11V2.em(kit, 'e2', 'leste', 0.1),
      n: A11V2.em(kit, 'e2', 'norte', 0.3), g: A11V2.em(kit, 'e2', 'aproximadamente', 0.6) };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, l = this.l;
    A11.fade(e.m, t, k.m, 0.8); A11.fade(l.s, t, k.m + 0.5); A11.fade(l.ex, t, k.m + 0.5); A11.fade(l.o, t, 0.6);
    A11.draw(e.x, eio(seg(t, 0.6, 1.4))); A11.fade(l.x, t, 1.2);
    A11.draw(e.y, eio(seg(t, k.y, k.y + 0.8))); A11.fade(l.y, t, k.y + 0.5);
    A11.draw(e.c, eio(seg(t, k.c, k.c + 1.0))); A11.fade(l.c, t, k.c + 0.6);
    A11.fade(e.q, t, k.q); A11.draw(e.p, eio(seg(t, k.q + 0.3, k.q + 1.0)));
    A11.draw(e.n, eio(seg(t, k.n, k.n + 0.9))); A11.fade(l.n, t, k.n + 0.6);
    A11.fade(e.g, t, k.g, 0.6); A11.fade(l.g, t, k.g + 0.2);
    for (const [el, t0] of this.t) A11.show(el, t, t0);
  },
});
