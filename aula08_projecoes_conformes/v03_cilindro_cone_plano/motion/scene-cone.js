// Cena 1 (0 a 12 s): globo de lado, cone tangente ao paralelo −30°, linha de contato e indicatrizes
const { seg, eo, lerp, TextFx } = kit;
kit.scene('cone', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.g = V3.globe(kit, 'cone');
    kit.stage.append(this.g.svg);
    this.f = V3.family(0.5);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1000px">' +
      '<h2 class="line">Cone tangente ao paralelo −30°</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    const p = (top, cls, html) => {
      const el = kit.h('<div class="words" style="left:1000px;top:' + top + 'px;width:820px"><p class="' + cls + '">' + html + '</p></div>');
      kit.stage.append(el);
      return el.style;
    };
    this.t1 = p(330, 'sub', 'Eixo do cone no eixo de rotação');
    this.t2 = p(420, 'sub', 'Linha de contato: paralelo −30°');
    this.t3 = p(510, 'sub', 'Indicatrizes em φ = −10°, −30°, −50° e −70°');
    kit.stage.querySelectorAll('.sub')[1].style.color = 'var(--accent)';
    V3.sig(kit);
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, -0.9);
    V3.paintSurface(this.g, this.f, { body: eo(seg(t, 1.0, 2.6)), contact: eo(seg(t, 3.6, 4.4)) });
    this.g.gtis.style.opacity = eo(seg(t, 5.8, 6.8));
    for (const [s, a] of [[this.t1, 1.6], [this.t2, 4.0], [this.t3, 6.4]]) {
      const q = eo(seg(t, a, a + 0.6)); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    }
  },
});
