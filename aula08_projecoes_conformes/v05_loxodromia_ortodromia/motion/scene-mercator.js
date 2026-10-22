// Cena 2 (18 a 32 s): o globo vira a Mercator (x = λ, y = ψ); a loxodromia fica reta
const { seg, eo, eio, lerp, TextFx } = kit;
kit.scene('mercator', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V5.mount(kit, 'mercator');
    kit.stage.append(this.r.svg);
    for (const e of this.r.labels) kit.stage.append(e);
    // Estado herdado da cena 1
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:1000px"><h2 class="line">São Paulo → Joanesburgo</h2></div>'),
      kit.h('<div class="words" style="left:1230px;top:300px;width:620px"><p class="sub"><span class="key" style="color:var(--main)"></span>Geodésica</p>' +
        '<p class="eq">sai com 109,71°, desce até 30,4° S<br>e chega com 74,09°</p></div>'),
      kit.h('<div class="words" style="left:1230px;top:500px;width:620px"><p class="sub"><span class="key" style="color:var(--accent)"></span>Loxodromia</p>' +
        '<p class="eq">rumo constante de 92,23°</p></div>'),
      kit.h('<div class="words" style="left:1230px;top:660px;width:620px"><p class="sub">Ângulo com o meridiano: na laranja é sempre o mesmo; na azul, muda.</p></div>'),
    ];
    for (const e of old) kit.stage.append(e);
    this.old = old.map(e => e.style);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1200px">' +
      '<h2 class="line mercator-hd">Mercator: a loxodromia é reta</h2></div>'));
    this.hd = kit.stage.querySelector('.mercator-hd');
    kit.stage.append(kit.h('<div class="words mercator-eq" style="left:1240px;top:72px;width:600px;align-items:flex-end">' +
      '<p class="eq big"><i>x</i> = <i>λ</i>,&emsp;<i>y</i> = <i>ψ</i></p></div>'));
    this.eq = kit.stage.querySelector('.mercator-eq').style;
    kit.stage.append(kit.h('<div class="mercator-leg" style="position:absolute;left:0;top:950px;width:1920px;display:flex;justify-content:center;gap:60px">' +
      '<p class="sub" style="margin:0"><span class="key" style="color:var(--main)"></span>Geodésica</p>' +
      '<p class="sub" style="margin:0"><span class="key" style="color:var(--accent)"></span>Loxodromia</p></div>'));
    this.leg = kit.stage.querySelector('.mercator-leg').style;
    V5.sig(kit);
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    const u1 = eio(seg(t, 1.0, 5.0));
    V5.paint(this.r, {
      u1, full: 1 - seg(t, 0.6, 1.4), bg: seg(t, 0.8, 1.6), frame: seg(t, 4.4, 5.0),
      geo: 1, lox: 1, city: 1, ang: 1 - seg(t, 0, 0.6), angL: 1, angG: 1,
    });
    TextFx.fadeFromRight(this.hd, t, 5.4);
    const q = eo(seg(t, 6.4, 7.0));
    this.eq.opacity = q; this.eq.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    this.leg.opacity = eo(seg(t, 5.0, 5.6));
  },
});
