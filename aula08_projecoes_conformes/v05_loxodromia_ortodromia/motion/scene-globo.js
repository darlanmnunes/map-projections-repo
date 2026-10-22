// Cena 1 (0 a 18 s): geodésica (azul-marinho) e loxodromia (laranja) no globo; ângulos com três meridianos
const { seg, eo, eio, lerp, TextFx } = kit;
kit.scene('globo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V5.mount(kit, 'globo');
    kit.stage.append(this.r.svg);
    for (const e of this.r.labels) kit.stage.append(e);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1000px">' +
      '<h2 class="line">São Paulo → Joanesburgo</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1230px;top:' + top + 'px;width:620px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t1 = p(300, '<p class="sub"><span class="key" style="color:var(--main)"></span>Geodésica</p>' +
      '<p class="eq">sai com 109,71°, desce até 30,4° S<br>e chega com 74,09°</p>');
    this.t2 = p(500, '<p class="sub"><span class="key" style="color:var(--accent)"></span>Loxodromia</p>' +
      '<p class="eq">rumo constante de 92,23°</p>');
    this.t3 = p(660, '<p class="sub">Ângulo com o meridiano: na laranja é sempre o mesmo; na azul, muda.</p>');
    V5.sig(kit);
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, -0.9);
    V5.paint(this.r, {
      full: 1, city: eo(seg(t, 0.8, 1.4)),
      geo: eio(seg(t, 2.4, 6.0)), lox: eio(seg(t, 7.4, 11.0)),
      ang: 1, angL: eo(seg(t, 12.0, 12.6)), angG: eo(seg(t, 13.4, 14.0)),
    });
    this.r.alox.style.opacity = eo(seg(t, 12.0, 12.6));
    this.r.ageo.style.opacity = eo(seg(t, 13.4, 14.0));
    this.r.amer.style.opacity = eo(seg(t, 11.6, 12.2));
    for (const [s, a] of [[this.t1, 6.2], [this.t2, 11.2], [this.t3, 14.4]]) {
      const q = eo(seg(t, a, a + 0.6)); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    }
  },
});
