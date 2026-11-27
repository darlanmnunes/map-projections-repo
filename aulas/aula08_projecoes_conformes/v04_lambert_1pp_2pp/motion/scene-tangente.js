// Cena 1 (0 a 15 s): cone tangente em −24° e a curva de m com 1 PP (m ≥ 1)
const { seg, eo, eio, lerp, TextFx } = kit;
kit.scene('tangente', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.g = V4.svg3d(kit, 'tangente');
    kit.stage.append(this.g.svg);
    this.c = V4.coneTangent(24);
    this.gr = V4.graph(kit, 'tangente');
    kit.stage.append(this.gr.svg);
    for (const el of this.gr.ticks) kit.stage.append(el);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:900px">' +
      '<h2 class="line">Cone tangente no paralelo −24°</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    kit.stage.append(kit.h('<div class="words" style="left:1060px;top:116px;width:780px">' +
      '<p class="ttl tangente-st" style="font-size:36px">1 paralelo padrão: m ≥ 1</p></div>'));
    this.st = kit.stage.querySelector('.tangente-st').style;
    this.lbl = kit.h('<div class="lbl" style="left:' + (V4.GX(-24) - 34) + 'px;top:' + (V4.G.y1 - 44) + 'px;color:var(--accent)">−24°</div>');
    kit.stage.append(this.lbl);
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, -0.9);
    V4.paintCone(this.g, this.c, { body: eo(seg(t, 1.0, 2.4)), contact: eo(seg(t, 3.0, 3.8)) });
    const ax = eo(seg(t, 4.0, 5.0));
    this.gr.axes.style.opacity = ax;
    for (const el of this.gr.ticks) el.style.opacity = ax;
    this.gr.band.style.opacity = 0;
    // Curva tracejada desenhada de norte (esquerda) para sul
    const pEnd = lerp(10, -55, eio(seg(t, 5.2, 8.2)));
    this.gr.moving.setAttribute('d', t > 5.2 ? V4.curveD(this.gr, 1, pEnd) : '');
    this.gr.pp.setAttribute('d', V4.ppD([-24]));
    this.gr.pp.style.opacity = eo(seg(t, 8.4, 9.0));
    this.lbl.style.opacity = eo(seg(t, 8.4, 9.0));
    const s = eo(seg(t, 9.2, 9.8));
    this.st.opacity = s; this.st.transform = 'translateX(' + lerp(26, 0, s) + 'px)';
  },
});
