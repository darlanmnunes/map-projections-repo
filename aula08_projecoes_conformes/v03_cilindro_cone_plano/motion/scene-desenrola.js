// Cena 2 (12 a 24 s): o cone é cortado numa geratriz e desenrolado num setor de 360°·n = 180°
const { seg, eio, eo, lerp, TextFx } = kit;
kit.scene('desenrola', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.g = V3.globe(kit, 'desenrola');
    kit.stage.append(this.g.svg);
    this.f = V3.family(0.5);
    this.m = V3.mapLayer(kit);
    // Estado herdado da cena 1
    const old = [kit.h('<div class="words" style="left:110px;top:60px;width:1000px"><h2 class="line">Cone tangente ao paralelo −30°</h2></div>')];
    [[330, 'Eixo do cone no eixo de rotação'], [420, 'Linha de contato: paralelo −30°'], [510, 'Indicatrizes em φ = −10°, −30°, −50° e −70°']]
      .forEach(([top, txt], i) => old.push(kit.h('<div class="words" style="left:1000px;top:' + top + 'px;width:820px"><p class="sub"' +
        (i === 1 ? ' style="color:var(--accent)"' : '') + '>' + txt + '</p></div>')));
    for (const el of old) kit.stage.append(el);
    this.old = old.map(el => el.style);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1000px">' +
      '<h2 class="line desenrola-hd">Cortar o cone e desenrolar</h2></div>'));
    this.hd = kit.stage.querySelector('.desenrola-hd');
    const p = (top, html) => {
      const el = kit.h('<div class="words" style="left:1000px;top:' + top + 'px;width:840px">' + html + '</div>');
      kit.stage.append(el);
      return el.style;
    };
    this.e1 = p(660, '<p class="eq big"><i>ρ</i> = <i>C</i>·e<sup>−<i>nψ</i></sup>&emsp;&emsp;<i>γ</i> = <i>n</i>(<i>λ</i> − <i>λ</i><sub>0</sub>)</p>');
    this.e2 = p(760, '<p class="sub">Setor de 180°: abertura 360°·<i>n</i>, com <i>n</i> = sen 30° = 0,5</p>');
    this.e3 = p(830, '<p class="sub">Meridianos viram raios; paralelos, arcos concêntricos</p>');
    V3.sig(kit);
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    TextFx.fadeFromRight(this.hd, t, 0.5);
    const f = this.f;
    V3.paintSurface(this.g, f, { body: lerp(1, 0.2, seg(t, 1.0, 1.8)) + 0.8 * seg(t, 8.2, 9.2), contact: 1 });
    // Desenrolar no lugar (vértice fixo), depois levar o setor plano para o painel do mapa
    let T;
    if (t < 5.4) T = V3.coneT(f, lerp(f.n, 1, eio(seg(t, 1.2, 5.2))));
    else T = V3.blendT(V3.coneT(f, 1), V3.mapT(f, V3.MAP), eio(seg(t, 5.4, 7.8)));
    V3.paintMap(this.m, f, T, eo(seg(t, 0.2, 1.0)));
    for (const [s, a] of [[this.e1, 8.2], [this.e2, 9.0], [this.e3, 9.8]]) {
      const q = eo(seg(t, a, a + 0.6)); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    }
  },
});
