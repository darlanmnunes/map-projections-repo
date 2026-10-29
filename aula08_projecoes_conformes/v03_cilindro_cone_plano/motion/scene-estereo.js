// Cena 4 (40 a 55 s): n volta a 0,5 e cresce até 1; o cone se achata num plano tangente no polo sul
const { seg, eio, eo, lerp, TextFx } = kit;
const N_INI = 0.01;
kit.scene('estereo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.g = V3.globe(kit, 'estereo');
    kit.stage.append(this.g.svg);
    this.m = V3.mapLayer(kit);
    // Estado herdado da cena 3
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:1000px"><h2 class="line">n diminui: o cone se abre</h2></div>'),
      kit.h('<div class="words" style="left:1000px;top:680px;width:840px"><h2 class="line" style="font-size:46px">n → 0: cilindro, Mercator</h2></div>'),
      kit.h('<div class="words" style="left:1000px;top:770px;width:840px"><p class="sub">O vértice vai ao infinito; as indicatrizes continuam círculos</p></div>'),
    ];
    for (const el of old) kit.stage.append(el);
    this.old = old.map(el => el.style);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1000px">' +
      '<h2 class="line estereo-hd">n cresce: o cone se achata</h2></div>'));
    this.hd = kit.stage.querySelector('.estereo-hd');
    this.cnt = kit.h('<div class="counter" style="left:1540px;top:96px"></div>');
    kit.stage.append(this.cnt);
    const p = (top, html) => {
      const el = kit.h('<div class="words" style="left:110px;top:' + top + 'px;width:800px">' + html + '</div>');
      kit.stage.append(el);
      return el.style;
    };
    this.e1 = p(860, '<h2 class="line" style="font-size:46px">|n| = 1: plano, estereográfica</h2>');
    this.e2 = p(940, '<p class="sub">Em todas as etapas, as indicatrizes continuam círculos</p>');
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    TextFx.fadeFromRight(this.hd, t, 0.5);
    let n = 0.5 * Math.pow(N_INI / 0.5, 1 - eio(seg(t, 0.4, 2.8)));
    n = lerp(n, 1, eio(seg(t, 4.0, 10.0)));
    const f = V3.family(n);
    V3.paintSurface(this.g, f, { body: 1, contact: 1 });
    V3.paintMap(this.m, f, V3.mapT(f, V3.MAP), 1);
    this.cnt.textContent = 'n = ' + V3.fmt(n, 2);
    for (const [s, a] of [[this.e1, 10.6], [this.e2, 11.8]]) {
      const q = eo(seg(t, a, a + 0.6)); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    }
  },
});
