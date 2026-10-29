// Cena 4 (46 a 60 s): placar das distâncias e frase final
const { seg, eo, lerp, TextFx } = kit;
kit.scene('placar', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V5.mount(kit, 'placar');
    kit.stage.append(this.r.svg);
    for (const e of this.r.labels) kit.stage.append(e);
    // Estado herdado da cena 3
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:1200px"><h2 class="line">Gnomônica: o círculo máximo é reto</h2></div>'),
      kit.h('<div class="words" style="left:1240px;top:80px;width:600px;align-items:flex-end"><p class="sub">Centro no meio da rota</p></div>'),
      kit.h('<div style="position:absolute;left:0;top:950px;width:1920px;display:flex;justify-content:center;gap:60px">' +
        '<p class="sub" style="margin:0"><span class="key" style="color:var(--main)"></span>Geodésica</p>' +
        '<p class="sub" style="margin:0"><span class="key" style="color:var(--accent)"></span>Loxodromia</p></div>'),
    ];
    for (const e of old) kit.stage.append(e);
    this.old = old.map(e => e.style);
    this.board = kit.h('<div style="position:absolute;left:0;top:250px;width:1920px;display:flex;justify-content:center">' +
      '<div class="box2" style="position:relative;display:flex;flex-direction:column;gap:22px;padding:44px 80px">' +
      '<p class="score placar-s1" style="margin:0;color:var(--accent)">Loxodromia: 7&nbsp;551 km</p>' +
      '<p class="score placar-s2" style="margin:0;color:var(--main)">Geodésica: 7&nbsp;442 km</p>' +
      '<p class="sub placar-s3" style="margin:0;font-size:44px">Diferença: +109 km (1,5 %)</p></div></div>');
    kit.stage.append(this.board);
    this.s = ['s1', 's2', 's3'].map(c => kit.stage.querySelector('.placar-' + c).style);
    kit.stage.append(kit.h('<div style="position:absolute;left:0;top:800px;width:1920px;display:flex;justify-content:center">' +
      '<h2 class="line placar-fin" style="font-size:48px">Rumo constante facilita a navegação, mas não é o caminho mais curto</h2></div>'));
    this.fin = kit.stage.querySelector('.placar-fin').style;
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    V5.paint(this.r, { u1: 1, u2: 1, full: 0, bg: 1, frame: 1, geo: 1, lox: 1, city: 1, ang: 0 });
    this.r.svg.style.opacity = lerp(1, 0.18, seg(t, 0.2, 1.2));
    for (const e of this.r.labels) e.style.opacity = Math.min(+e.style.opacity, 1 - seg(t, 0.2, 1.2));
    this.board.style.opacity = eo(seg(t, 0.8, 1.4));
    this.s.forEach((s, i) => {
      const q = eo(seg(t, 1.2 + 1.4 * i, 1.8 + 1.4 * i)); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    });
    const q = eo(seg(t, 6.6, 7.2));
    this.fin.opacity = q; this.fin.transform = 'translateY(' + lerp(16, 0, q) + 'px)';
  },
});
