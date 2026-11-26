// Cena 3: similaridade 2D, eq. (38) e (39), com P1 (slides 28 e 33)
const { seg, eo, eio, TextFx } = kit;
kit.scene('similaridade', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A11V3.estilo(kit);
    const V = kit.json('v3-dados.json'), n = A11.num, P = V.pts.P1, S = P.sim, R = P.rig;
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Atalho 1: similaridade 2D</h2>').querySelector('h2');
    this.eq = A11.bloco(kit, 110, 190, 980,
      '<p class="eq"><i>x</i><sub>L</sub> = (Δ<i>E</i> cos <i>γ</i><sub>0</sub> + Δ<i>N</i> sen <i>γ</i><sub>0</sub>) / <i>k</i></p>' +
      '<p class="eq"><i>y</i><sub>L</sub> = (−Δ<i>E</i> sen <i>γ</i><sub>0</sub> + Δ<i>N</i> cos <i>γ</i><sub>0</sub>) / <i>k</i>&emsp;(38)</p>' +
      '<p class="eq"><i>k</i> = <i>m</i><sub>0</sub> / <i>F</i><sub>L</sub> = ' + n(V.k, 7) + '&emsp;(39)</p>');
    const linhas = [
      ['1', 'Δ<i>E</i> ; Δ<i>N</i> (m)', n(S.dE, 3) + ' ; ' + n(S.dN, 3)],
      ['2', 'girado de <i>γ</i><sub>0</sub>', n(S.a, 3) + ' ; ' + n(S.b, 3)],
      ['3', '÷ <i>k</i>: <i>x</i><sub>L</sub> ; <i>y</i><sub>L</sub>', n(S.x, 3) + ' ; ' + n(S.y, 3)],
      ['', '<i>X</i><sub>L</sub> ; <i>Y</i><sub>L</sub> similaridade', n(S.XL, 3) + ' ; ' + n(S.YL, 3)],
      ['', '<i>X</i><sub>L</sub> ; <i>Y</i><sub>L</sub> rigoroso', n(R.XL, 3) + ' ; ' + n(R.YL, 3)],
    ];
    const tb = kit.h('<table class="tab" style="position:absolute;left:110px;top:470px;font-size:28px"><tr><th></th><th>Grandeza</th><th>Valor</th></tr>' +
      linhas.map(r => '<tr><td style="color:var(--accent);font-weight:700">' + r[0] + '</td><td>' + r[1] + '</td><td class="v">' + r[2] + '</td></tr>').join('') + '</table>');
    kit.stage.append(tb);
    this.th = tb.querySelector('tr'); this.tr = [...tb.querySelectorAll('tr')].slice(1);
    this.helm = A11.bloco(kit, 110, 900, 980, '<p class="note">Helmert 2D com parâmetros <b>calculados</b> na origem, não ajustados por pontos de controle.</p>');
    // Vetor O → P1: grade, girado (exagerado) e reduzido (exagerado)
    this.O = [1330, 860]; this.v = [S.dE * 0.3, S.dN * 0.3]; this.G = -12; this.K = 0.9;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="vert s-le" d=""/><path class="nq s-v0" d=""/><path class="ng s-v1" d=""/>' +
      '<circle class="dot s-r" r="12"/><circle class="marco" r="11" cx="' + this.O[0] + '" cy="' + this.O[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = { le: svg.querySelector('.s-le'), v0: svg.querySelector('.s-v0'), v1: svg.querySelector('.s-v1'), r: svg.querySelector('.s-r') };
    const L = (h, x, y, st) => A11.lbl(kit, h, x, y, st || '');
    const [ox, oy] = this.O;
    this.l = {
      o: L('O', ox - 46, oy + 6, 'font-family:var(--sans);font-weight:700'),
      de: L('Δ<i>E</i>', ox + this.v[0] / 2 - 20, oy + 10), dn: L('Δ<i>N</i>', ox + this.v[0] + 16, oy - this.v[1] / 2),
      g: L('grade', ox + this.v[0] + 20, oy - this.v[1] - 40, 'font-family:var(--sans);font-size:24px'),
      p: L('P1 similaridade', 0, 0, 'font-family:var(--sans);font-size:24px;color:var(--accent)'),
      r: L('P1 rigoroso', 0, 0, 'font-family:var(--sans);font-size:24px;color:var(--corda)'),
    };
    this.e.r.setAttribute('style', 'stroke:var(--corda)');
    this.esq = A11.bloco(kit, 1150, 950, 700, '<p class="note">Rotação, escala e diferença muito exageradas.</p>');
    this.err = kit.h('<div class="v3err" style="left:1250px;top:190px;background:color-mix(in srgb, var(--accent) 14%, var(--ground));border:2.5px solid var(--accent)">P1: erro de ' + n(P.e_sim, 0) + ' mm</div>');
    kit.stage.append(this.err);
    this.k = {
      c1: kit.em('c1', 'atalho'), mud: kit.em('c1', 'mudancas'), fix: kit.em('c1', 'fixos'), tir: kit.em('c2', 'tiramos'),
      gir: kit.em('c2', 'giramos'), div: kit.em('c2', 'dividimos'), helm: kit.em('c2', 'helmert'), erra: kit.em('c3', 'erra'),
      porq: kit.em('c3', 'porque'), longe: kit.em('c3', 'longe'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, e = this.e, l = this.l, [ox, oy] = this.O, D = Math.PI / 180;
    A11.show(this.eq, t, k.mud);
    A11.fade(this.th, t, k.tir);
    const ent = [k.tir, k.gir, k.div, k.div + 1.2, k.erra - 0.3];
    this.tr.forEach((r, i) => { A11.show(r, t, ent[i]); r.classList.toggle('on', i >= 3 && t >= k.erra); });
    A11.show(this.helm, t, k.helm);
    // vetor
    const g = this.G * eio(seg(t, k.gir, k.gir + 1.2)), s = 1 - (1 - this.K) * eio(seg(t, k.div, k.div + 1));
    const [vx, vy] = this.v, c = Math.cos(g * D), sn = Math.sin(g * D);
    const px = ox + s * (vx * c + vy * sn), py = oy - s * (-vx * sn + vy * c);
    const d0 = eio(seg(t, k.tir, k.tir + 0.8));
    A11.draw(e.le, d0); e.le.setAttribute('d', 'M' + ox + ' ' + oy + 'H' + (ox + vx) + 'V' + (oy - vy));
    e.v0.setAttribute('d', A11.arrowTo(ox, oy, ox + vx, oy - vy)); e.v0.style.opacity = d0 * (t > k.gir ? 0.35 : 1);
    A11.fade(l.de, t, k.tir + 0.4); A11.fade(l.dn, t, k.tir + 0.6); A11.fade(l.g, t, k.tir + 0.6); A11.fade(l.o, t, k.c1);
    e.v1.setAttribute('d', A11.arrowTo(ox, oy, px, py)); e.v1.style.opacity = eo(seg(t, k.gir - 0.1, k.gir + 0.2));
    l.p.style.left = (px - 230) + 'px'; l.p.style.top = (py - 50) + 'px'; A11.fade(l.p, t, k.div + 1);
    const rx = px + 34, ry = py + 22;
    e.r.setAttribute('cx', rx); e.r.setAttribute('cy', ry); e.r.style.opacity = eo(seg(t, k.erra - 0.3, k.erra + 0.2));
    l.r.style.left = (rx + 22) + 'px'; l.r.style.top = (ry - 4) + 'px'; A11.fade(l.r, t, k.erra - 0.2);
    A11.show(this.err, t, k.erra);
    A11.fade(this.esq, t, k.gir);
  },
});
