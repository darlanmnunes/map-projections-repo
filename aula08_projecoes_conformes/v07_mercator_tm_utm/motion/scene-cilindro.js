// Cena 1 (0 a 15 s): cilindro tangente ao Equador gira 90° e passa a tocar o globo ao longo do meridiano −45° (MC)
const { seg, eo, eio, lerp, TextFx } = kit;
const C1 = { cx: 640, cy: 600, R: 360, e: 12, lc: -30 };
kit.scene('cilindro', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V7.build(kit, 'cilindro');
    kit.stage.append(this.r.svg);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:56px;width:1100px">' +
      '<h2 class="line">Da Mercator à Transversa de Mercator</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1180px;top:' + top + 'px;width:680px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t1 = p(300, '<p class="sub">Mercator: cilindro tangente ao Equador</p>');
    this.t2 = p(400, '<p class="sub">O cilindro gira 90° em torno de um eixo no plano do Equador</p>');
    this.t3 = p(540, '<h2 class="line" style="font-size:44px">Transversa de Mercator: o contato passa a ser um meridiano</h2>');
    this.mc = kit.h('<div class="lbl" style="color:var(--accent)">MC: <i>λ</i><sub>0</sub> = −45°</div>');
    kit.stage.append(this.mc);
    V7.sig(kit);
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, -0.9);
    const th = 90 * eio(seg(t, 4.2, 9.2));
    const o = V7.paint(this.r, C1, { th, rc: 1, body: eo(seg(t, 0.6, 1.8)), contact: eo(seg(t, 1.8, 2.6)) });
    const q = o.P(V7.L0, 38);
    Object.assign(this.mc.style, { left: (q[0] + 14) + 'px', top: (q[1] - 20) + 'px', opacity: eo(seg(t, 9.4, 10.0)) });
    for (const [s, a] of [[this.t1, 1.2], [this.t2, 3.6], [this.t3, 10.2]]) {
      const k = eo(seg(t, a, a + 0.6)); s.opacity = k; s.transform = 'translateX(' + lerp(26, 0, k) + 'px)';
    }
  },
});
