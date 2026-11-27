// Cena 3 (32 a 46 s): da Mercator à gnomônica centrada no meio da rota; a geodésica fica reta
const { seg, eo, eio, lerp, TextFx } = kit;
kit.scene('gnomonica', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V5.mount(kit, 'gnomonica');
    kit.stage.append(this.r.svg);
    for (const e of this.r.labels) kit.stage.append(e);
    // Estado herdado da cena 2
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:1200px"><h2 class="line">Mercator: a loxodromia é reta</h2></div>'),
      kit.h('<div class="words" style="left:1240px;top:72px;width:600px;align-items:flex-end"><p class="eq big"><i>x</i> = <i>λ</i>,&emsp;<i>y</i> = <i>ψ</i></p></div>'),
    ];
    for (const e of old) kit.stage.append(e);
    this.old = old.map(e => e.style);
    kit.stage.append(kit.h('<div style="position:absolute;left:0;top:950px;width:1920px;display:flex;justify-content:center;gap:60px">' +
      '<p class="sub" style="margin:0"><span class="key" style="color:var(--main)"></span>Geodésica</p>' +
      '<p class="sub" style="margin:0"><span class="key" style="color:var(--accent)"></span>Loxodromia</p></div>'));
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1200px">' +
      '<h2 class="line gnomonica-hd">Gnomônica: o círculo máximo é reto</h2></div>'));
    this.hd = kit.stage.querySelector('.gnomonica-hd');
    kit.stage.append(kit.h('<div class="words gnomonica-sub" style="left:1240px;top:80px;width:600px;align-items:flex-end">' +
      '<p class="sub">Centro no meio da rota</p></div>'));
    this.sub = kit.stage.querySelector('.gnomonica-sub').style;
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    V5.paint(this.r, { u1: 1, u2: eio(seg(t, 0.8, 4.8)), full: 0, bg: 1, frame: 1, geo: 1, lox: 1, city: 1, ang: 0 });
    TextFx.fadeFromRight(this.hd, t, 5.2);
    const q = eo(seg(t, 6.4, 7.0));
    this.sub.opacity = q; this.sub.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
  },
});
