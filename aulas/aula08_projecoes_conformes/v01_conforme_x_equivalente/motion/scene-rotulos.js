// Cena 3 (22 a 35 s): títulos dos mapas e etiquetas do círculo de −60°
const { seg, eo, lerp } = kit;
kit.scene('rotulos', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V1.mount(kit, 'rotulos', ['merc', 'lamb']);
    kit.stage.append(this.r.svg);
    // Estado herdado da cena 2
    const head = (k, cls, name, eq) => kit.h('<div class="words ' + cls + '" style="left:' + V1.X0[k] + 'px;top:150px;gap:4px">' +
      '<div class="ttl">' + name + '</div><div class="eq">' + eq + '</div></div>');
    const old = [
      head('merc', 'rotulos-old', 'Mercator', '<i>x</i> = <i>λ</i>,&emsp;<i>y</i> = ln tan(45° + <i>φ</i>/2)'),
      head('lamb', 'rotulos-old', 'Lambert cilíndrica equivalente', '<i>x</i> = <i>λ</i>,&emsp;<i>y</i> = sen <i>φ</i>'),
      kit.h('<div class="words rotulos-old" style="left:995px;top:690px;width:780px;gap:16px">' +
        '<p class="sub">Mercator: continuam círculos, com raio × sec φ.</p>' +
        '<p class="sub">Lambert: viram elipses, semieixo leste-oeste sec φ e norte-sul cos φ.</p></div>'),
    ];
    ['× 1', '× 1,155', '× 2'].forEach((txt, i) => {
      const p = V1.CIRC[i], c = V1.map('merc', V1.CLON, p), r = V1.R0 * V1.S / Math.cos(p * V1.D);
      old.push(kit.h('<div class="lbl rotulos-old" style="left:' + (c[0] + r + 14) + 'px;top:' + (c[1] - 21) + 'px">' + txt + '</div>'));
    });
    for (const el of old) kit.stage.append(el);
    this.old = old.map(el => el.style);
    // Títulos novos
    kit.stage.append(head('merc', 'rotulos-tm', 'Conforme (Mercator)', '<i>ϖ</i> = 0,&emsp;<i>σ</i> = <i>m</i>²'));
    kit.stage.append(head('lamb', 'rotulos-tl', 'Equivalente (Lambert cilíndrica)', '<i>σ</i> = 1,&emsp;<i>ϖ</i> &gt; 0'));
    this.tm = kit.stage.querySelector('.rotulos-tm').style;
    this.tl = kit.stage.querySelector('.rotulos-tl').style;
    // Etiquetas do círculo de −60°
    const cm = V1.map('merc', V1.CLON, -60), cl = V1.map('lamb', V1.CLON, -60);
    kit.stage.append(kit.h('<div class="tag rotulos-em" style="left:' + (cm[0] + 100) + 'px;top:' + (cm[1] - 56) + 'px">' +
      '<div class="eq"><i>m</i> = 2</div><div class="eq"><i>σ</i> = 4</div></div>'));
    kit.stage.append(kit.h('<div class="tag rotulos-el" style="left:' + (cl[0] + 100) + 'px;top:' + (cl[1] - 92) + 'px">' +
      '<div class="sub">semieixos 2 e 0,5</div><div class="eq"><i>σ</i> = 1</div></div>'));
    this.em = kit.stage.querySelector('.rotulos-em').style;
    this.el = kit.stage.querySelector('.rotulos-el').style;
    kit.stage.append(kit.h('<div class="words" style="left:995px;top:700px;width:780px">' +
      '<p class="sub rotulos-cap">Mesmo círculo na esfera: a Mercator muda o tamanho, a Lambert muda a forma.</p></div>'));
    this.cap = kit.stage.querySelector('.rotulos-cap').style;
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    const hl = seg(t, 4.0, 4.6);
    const st = V1.mapsState(1);
    st.merc.hl = hl; st.lamb.hl = hl;
    V1.paint(this.r, st);
    for (const [s, a] of [[this.tm, 0.7], [this.tl, 1.6], [this.em, 4.8], [this.el, 5.6], [this.cap, 8.4]]) {
      const p = eo(seg(t, a, a + 0.6));
      s.opacity = p;
      s.transform = 'translateX(' + lerp(26, 0, p) + 'px)';
    }
  },
});
