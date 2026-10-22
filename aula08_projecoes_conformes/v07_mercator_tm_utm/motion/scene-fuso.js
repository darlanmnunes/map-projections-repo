// Cena 2 (15 a 28 s): fuso 23 (−48° a −42°), Viçosa e indicatrizes da TM ao longo do paralelo de Viçosa
const { seg, eo, lerp, TextFx } = kit;
const C1 = { cx: 640, cy: 600, R: 360, e: 12, lc: -30 };
kit.scene('fuso', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V7.build(kit, 'fuso');
    kit.stage.append(this.r.svg);
    // Estado herdado da cena 1
    const old = [
      kit.h('<div class="words" style="left:110px;top:56px;width:1100px"><h2 class="line">Da Mercator à Transversa de Mercator</h2></div>'),
      kit.h('<div class="words" style="left:1180px;top:300px;width:680px"><p class="sub">Mercator: cilindro tangente ao Equador</p></div>'),
      kit.h('<div class="words" style="left:1180px;top:400px;width:680px"><p class="sub">O cilindro gira 90° em torno de um eixo no plano do Equador</p></div>'),
      kit.h('<div class="words" style="left:1180px;top:540px;width:680px"><h2 class="line" style="font-size:44px">Transversa de Mercator: o contato passa a ser um meridiano</h2></div>'),
    ];
    for (const e of old) kit.stage.append(e);
    this.old = old.map(e => e.style);
    const lbl = (html, color) => { const e = kit.h('<div class="lbl"' + (color ? ' style="color:' + color + '"' : '') + '>' + html + '</div>'); kit.stage.append(e); return e; };
    this.mc = lbl('MC: <i>λ</i><sub>0</sub> = −45°', 'var(--accent)');
    this.vl = lbl('Viçosa');
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:56px;width:1100px">' +
      '<h2 class="line fuso-hd">Fuso 23: de −48° a −42°</h2></div>'));
    this.hd = kit.stage.querySelector('.fuso-hd');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1180px;top:' + top + 'px;width:680px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t1 = p(280, '<p class="eq">Viçosa: <i>φ</i> = −20°45′,&emsp;<i>λ</i> = −42°52′</p>');
    this.t2 = p(380, '<p class="sub">Indicatrizes da TM ao longo do paralelo de Viçosa: crescem para longe do MC</p>');
    this.t3 = p(520, '<p class="eq big"><i>m</i> ≈ 1 + <span class="frac"><span><i>x</i>²</span><span>2<i>R</i>²</span></span></p>');
    V7.sig(kit);
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    const o = V7.paint(this.r, C1, {
      th: 90, rc: 1, body: lerp(1, 0.3, seg(t, 0.4, 1.2)), contact: 1,
      zone: eo(seg(t, 1.0, 1.8)), zedge: eo(seg(t, 1.0, 1.8)), vic: eo(seg(t, 2.6, 3.2)), tis: eo(seg(t, 4.4, 5.4)),
    });
    const q = o.P(V7.L0, 38);
    Object.assign(this.mc.style, { left: (q[0] + 14) + 'px', top: (q[1] - 20) + 'px', opacity: 1 });
    Object.assign(this.vl.style, { left: (o.v[0] + 16) + 'px', top: (o.v[1] + 4) + 'px', opacity: eo(seg(t, 2.6, 3.2)) });
    TextFx.fadeFromRight(this.hd, t, 1.0);
    for (const [s, a] of [[this.t1, 3.0], [this.t2, 5.4], [this.t3, 7.2]]) {
      const k = eo(seg(t, a, a + 0.6)); s.opacity = k; s.transform = 'translateX(' + lerp(26, 0, k) + 'px)';
    }
  },
});
