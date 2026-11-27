// Cena 5 (55 a 65 s): os três mapas lado a lado; mesma condição de conformidade, n escolhe a superfície
const { seg, eio, eo, lerp } = kit;
const Y5 = 340, S5 = 86;
const SLOT = [
  { n: V3.NMIN, x: 330, titulo: 'Mercator (<i>n</i> = 0)' },
  { n: 0.5, x: 960, titulo: 'Lambert (<i>n</i> = 0,5)' },
  { n: 1, x: 1590, titulo: 'Estereográfica polar (|<i>n</i>| = 1)' },
];
kit.scene('familia', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.g = V3.globe(kit, 'familia');
    kit.stage.append(this.g.svg);
    this.f1 = V3.family(1);
    this.maps = SLOT.map(s => ({ s, f: V3.family(s.n), r: V3.mapLayer(kit) }));
    // Estado herdado da cena 4
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:1000px"><h2 class="line">n cresce: o cone se achata</h2></div>'),
      kit.h('<div class="counter" style="left:1540px;top:96px">n = 1,00</div>'),
      kit.h('<div class="words" style="left:110px;top:860px;width:800px"><h2 class="line" style="font-size:46px">|n| = 1: plano, estereográfica</h2></div>'),
      kit.h('<div class="words" style="left:110px;top:940px;width:800px"><p class="sub">Em todas as etapas, as indicatrizes continuam círculos</p></div>'),
    ];
    for (const el of old) kit.stage.append(el);
    this.old = old.map(el => el.style);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1700px">' +
      '<h2 class="line familia-hd">Uma família, três superfícies</h2></div>'));
    this.hd = kit.stage.querySelector('.familia-hd').style;
    this.tt = SLOT.map(s => {
      const el = kit.h('<div class="words" style="left:' + (s.x - 300) + 'px;top:' + (Y5 - 80) + 'px;width:600px;align-items:center;text-align:center">' +
        '<p class="ttl">' + s.titulo + '</p></div>');
      kit.stage.append(el);
      return el.style;
    });
    const c = (top, html) => {
      const el = kit.h('<div style="position:absolute;left:0;top:' + top + 'px;width:1920px;display:flex;justify-content:center">' + html + '</div>');
      kit.stage.append(el);
      return el.style;
    };
    this.e1 = c(760, '<h2 class="line" style="font-size:46px">Mesma condição de conformidade; n escolhe a superfície</h2>');
    this.e2 = c(850, '<div class="box2" style="position:relative;display:flex;gap:70px;align-items:center">' +
      '<div class="eq big"><i>ρ</i> = <i>C</i>·e<sup>−<i>nψ</i></sup></div>' +
      '<div class="eq big"><i>m</i> = <span class="frac"><span><i>n ρ</i></span><span><i>N</i> cos <i>φ</i></span></span></div></div>');
  },
  render(t) {
    const out = 1 - seg(t, 0, 0.7);
    for (const s of this.old) s.opacity = out;
    this.g.svg.style.opacity = out;
    V3.paintSurface(this.g, this.f1, { body: 1, contact: 1 });
    // A estereográfica vai do painel grande para a sua vaga; as outras duas surgem
    const u = eio(seg(t, 0.3, 1.8));
    this.maps.forEach((m, i) => {
      const L = i === 2 ? { x: lerp(V3.MAP.x, m.s.x, u), y: lerp(V3.MAP.y, Y5, u), S: lerp(V3.MAP.S, S5, u) } : { x: m.s.x, y: Y5, S: S5 };
      V3.paintMap(m.r, m.f, V3.mapT(m.f, L), i === 2 ? 1 : eo(seg(t, 1.4 + 0.4 * i, 2.0 + 0.4 * i)));
    });
    this.hd.opacity = eo(seg(t, 0.6, 1.2));
    this.tt.forEach((s, i) => { s.opacity = eo(seg(t, 2.0 + 0.3 * i, 2.6 + 0.3 * i)); });
    for (const [s, a] of [[this.e1, 3.4], [this.e2, 4.4]]) {
      const q = eo(seg(t, a, a + 0.6)); s.opacity = q; s.transform = 'translateY(' + lerp(16, 0, q) + 'px)';
    }
  },
});
