// Cena 1 (0 a 8 s): globo gira até centrar a América do Sul; três círculos de 7° sobre λ = −45°
const { seg, eio, eob, lerp, TextFx } = kit;
kit.scene('globo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V1.mount(kit, 'globo', ['merc']);
    kit.stage.append(this.r.svg);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:84px;width:760px">' +
      '<h2 class="line">Três círculos iguais na esfera</h2>' +
      '<p class="sub globo-sub">Raio angular de 7°, sobre o meridiano λ = −45°</p></div>'));
    this.line = kit.stage.querySelector('.line');
    this.sub = kit.stage.querySelector('.globo-sub').style;
    this.lbl = V1.CIRC.map(p => {
      const el = kit.h('<div class="lbl">φ = ' + (p ? '−' + (-p) : '0') + '°</div>');
      kit.stage.append(el);
      return el.style;
    });
    V1.sig(kit);
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, -1.0);
    this.sub.opacity = seg(t, 0.8, 1.4);
    const rot = eio(seg(t, 0, 5.2)), E = V1.GLOBE_END;
    const g = { cx: E.cx, cy: E.cy, R: E.R, lc: lerp(25, E.lc, rot), pc: lerp(8, E.pc, rot) };
    const circ = [0, 1, 2].map(i => eob(seg(t, 4.4 + 0.35 * i, 5.2 + 0.35 * i), 1.5));
    V1.paint(this.r, { merc: { a: 1, g, u: 0, full: 1, circ } });
    V1.CIRC.forEach((p, i) => {
      const q = V1.ortho(g, V1.CLON, p), s = this.lbl[i];
      s.left = (q[0] + 7 * V1.D * g.R + 16) + 'px';
      s.top = (q[1] - 20) + 'px';
      s.opacity = seg(t, 5.6 + 0.3 * i, 6.1 + 0.3 * i);
    });
  },
});
