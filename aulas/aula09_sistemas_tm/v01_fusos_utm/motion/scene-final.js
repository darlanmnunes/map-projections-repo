// Cena 4 (52 a 60 s): resumo de Viçosa
const { seg, eo, lerp } = kit;
kit.scene('final', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.card = kit.h('<div style="position:absolute;left:0;top:250px;width:1920px;display:flex;justify-content:center">' +
      '<div class="card" style="position:relative;text-align:left">' +
      '<h2 class="line" style="font-size:58px">Viçosa (MG): fuso 23, MC −45°, Hemisfério Sul</h2>' +
      '<p class="sub" style="font-size:38px;margin-top:22px">SIRGAS 2000 / UTM 23S: <b>EPSG:31983</b> = 31960 + 23</p></div></div>');
    kit.stage.append(this.card);
    this.notes = kit.h('<div class="words" style="left:250px;top:640px;width:1420px;gap:16px">' +
      '<p class="sub">Belo Horizonte (<i>λ</i> = −43°56′) também está no fuso 23; Uberlândia (<i>λ</i> = −48°17′), no 22.</p>' +
      '<p class="sub">Um ponto exatamente no limite entre dois fusos fica no fuso de leste.</p>' +
      '<p class="sub" style="color:color-mix(in srgb, var(--main) 70%, var(--ground))">Banda MGRS de 8° em latitude: K (o GPS mostra 23K). Não entra nas equações.</p></div>');
    kit.stage.append(this.notes);
  },
  render(t) {
    const c = eo(seg(t, 0.2, 1.0)); this.card.style.opacity = c; this.card.style.transform = 'translateY(' + lerp(16, 0, c) + 'px)';
    const n = eo(seg(t, 1.8, 2.6)); this.notes.style.opacity = n; this.notes.style.transform = 'translateY(' + lerp(16, 0, n) + 'px)';
  },
});
