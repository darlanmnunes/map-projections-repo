// Cena 3 (24 a 40 s): n diminui de 0,5 até perto de 0; o cone vira cilindro e o setor vira a faixa da Mercator
const { seg, eio, eo, lerp, TextFx } = kit;
const N_FIM = 0.01;
kit.scene('mercator', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.g = V3.globe(kit, 'mercator');
    kit.stage.append(this.g.svg);
    this.m = V3.mapLayer(kit);
    // Estado herdado da cena 2
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:1000px"><h2 class="line">Cortar o cone e desenrolar</h2></div>'),
      kit.h('<div class="words" style="left:1000px;top:660px;width:840px"><p class="eq big"><i>ρ</i> = <i>C</i>·e<sup>−<i>nψ</i></sup>&emsp;&emsp;<i>γ</i> = <i>n</i>(<i>λ</i> − <i>λ</i><sub>0</sub>)</p></div>'),
      kit.h('<div class="words" style="left:1000px;top:760px;width:840px"><p class="sub">Setor de 180°: abertura 360°·<i>n</i>, com <i>n</i> = sen 30° = 0,5</p></div>'),
      kit.h('<div class="words" style="left:1000px;top:830px;width:840px"><p class="sub">Meridianos viram raios; paralelos, arcos concêntricos</p></div>'),
    ];
    for (const el of old) kit.stage.append(el);
    this.old = old.map(el => el.style);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1000px">' +
      '<h2 class="line mercator-hd">n diminui: o cone se abre</h2></div>'));
    this.hd = kit.stage.querySelector('.mercator-hd');
    this.cnt = kit.h('<div class="counter" style="left:1540px;top:96px"></div>');
    kit.stage.append(this.cnt);
    const p = (top, html) => {
      const el = kit.h('<div class="words" style="left:1000px;top:' + top + 'px;width:840px">' + html + '</div>');
      kit.stage.append(el);
      return el.style;
    };
    this.e1 = p(680, '<h2 class="line" style="font-size:46px">n → 0: cilindro, Mercator</h2>');
    this.e2 = p(770, '<p class="sub">O vértice vai ao infinito; as indicatrizes continuam círculos</p>');
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    TextFx.fadeFromRight(this.hd, t, 0.5);
    const n = 0.5 * Math.pow(N_FIM / 0.5, eio(seg(t, 1.5, 11.0)));
    const f = V3.family(n);
    V3.paintSurface(this.g, f, { body: 1, contact: 1 });
    V3.paintMap(this.m, f, V3.mapT(f, V3.MAP), 1);
    this.cnt.textContent = 'n = ' + V3.fmt(n, 2);
    this.cnt.style.opacity = eo(seg(t, 0.6, 1.2));
    for (const [s, a] of [[this.e1, 11.6], [this.e2, 12.6]]) {
      const q = eo(seg(t, a, a + 0.6)); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    }
  },
});
