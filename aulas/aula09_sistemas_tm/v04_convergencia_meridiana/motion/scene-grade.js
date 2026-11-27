// Cena 1 (0 a 17 s): grade TM (retas) e meridianos projetados (curvas); em P, NQ, NG e o ângulo γ
const { seg, eo, lerp, TextFx } = kit;
kit.scene('grade', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V4.build(kit, 'grade');
    this.r.mount(kit.stage);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line grade-hd">Convergência meridiana</h2></div>'));
    this.hd = kit.stage.querySelector('.grade-hd');
    const g0 = this.r.T[0][4];
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:960px;top:' + top + 'px;width:860px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t = [
      [p(180, '<p class="sub">Na grade TM, as linhas de <i>E</i> e <i>N</i> constantes são retas: o <b>norte de quadrícula (NQ)</b> é paralelo ao MC</p>'), 1.6],
      [p(300, '<p class="sub">Os meridianos projetados são curvas que convergem para o polo</p>'), 4.0],
      [p(420, '<p class="sub">Em P, o <b style="color:var(--accent)">norte geográfico (NG)</b> é a tangente à imagem do meridiano</p>'), 7.0],
      [p(550, '<p class="sub"><i>γ</i>: ângulo, no plano, entre NQ e NG</p><p class="eq big" style="margin-top:6px"><i>γ</i> ≈ Δ<i>λ</i> sen <i>φ</i>&emsp;(10)</p>'), 9.6],
      [p(730, '<p class="sub"><i>γ</i> &gt; 0 quando NQ está a leste de NG. Aqui, no Hemisfério Sul e a leste do MC: <i>γ</i> = ' + A9V4.dm(g0) + '</p>'), 12.0],
      [p(900, '<p class="note">Esquema exagerado: P a 35° do MC (GRS80). No fuso UTM, |<i>γ</i>| não passa de cerca de 2°.</p>'), 14.0],
    ];
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    A9V4.paint(this.r, { u: 0, grid: eo(seg(t, 0.8, 2.0)), geo: eo(seg(t, 3.0, 4.6)), arrows: eo(seg(t, 6.4, 7.2)), garc: eo(seg(t, 9.0, 9.8)) });
    for (const [s, a] of this.t) { const k = eo(seg(t, a, a + 0.6)); s.opacity = k; s.transform = 'translateX(' + lerp(26, 0, k) + 'px)'; }
  },
});
