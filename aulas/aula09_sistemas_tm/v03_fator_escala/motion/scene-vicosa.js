// Cena 3 (46 a 65 s): Viçosa na grade, 222 km a leste do MC, já na faixa de ampliação: m = 1,000210.
// 1 000,000 m no elipsoide viram 1 000,210 m na grade (as extremidades das barras aparecem ampliadas).
const { seg, eo, eio, lerp, TextFx } = kit;
kit.scene('vicosa', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V3.build(kit, 'vicosa');
    kit.stage.append(this.r.svg);
    const v = this.r.d.vicosa, pv = A9V3.P(v, 1), pm = A9V3.grid(500, v[3]);
    const over = this.r.q('over');
    over.innerHTML = '<path class="dim vicosa-dim" d="M' + pm[0] + ' ' + pv[1] + 'H' + pv[0] + 'M' + pm[0] + ' ' + (pv[1] - 10) + 'v20"/>' +
      '<circle class="vdot vicosa-dot" cx="' + pv[0] + '" cy="' + pv[1] + '" r="10"/>';
    this.dot = over.querySelector('.vicosa-dot').style; this.dim = over.querySelector('.vicosa-dim').style;
    this.title = kit.h('<div class="words" style="left:110px;top:60px;width:1200px"><h2 class="line">Viçosa: 222 km a leste do MC</h2></div>');
    kit.stage.append(this.title);
    this.line = this.title.querySelector('.line');
    this.lv = kit.h('<div class="lbl sm bg" style="left:' + (pv[0] + 16) + 'px;top:' + (pv[1] - 52) + 'px">Viçosa</div>');
    this.lx = kit.h('<div class="lbl sm c" style="left:' + ((pm[0] + pv[0]) / 2) + 'px;top:' + (pv[1] - 44) + 'px;color:var(--accent)"><b>222 km</b></div>');
    kit.stage.append(this.lv); kit.stage.append(this.lx);
    const box = (html, y, extra) => { const e = kit.h('<div class="words" style="left:1170px;top:' + y + 'px;width:690px' + (extra || '') + '">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.T = {
      a: box('<p class="eq"><i>E</i> = 722&thinsp;120,59 m&emsp;<i>N</i> = 7&thinsp;704&thinsp;054,61 m</p>' +
        '<p class="eq big"><i>m</i> = 1,000210&ensp;<span style="font-size:30px">(+210 mm/km)</span></p>', 200),
      b: box('<p class="sub">1&thinsp;000,000 m no elipsoide</p>', 430),
      c: box('<p class="sub" style="color:var(--tissot)">1&thinsp;000,210 m na grade</p>', 540),
      z: box('<p class="sub" style="font-size:24px;color:color-mix(in srgb, var(--main) 60%, var(--ground))">extremidades ampliadas</p>', 660),
      e: box('<p class="sub">Entre 0,9996 no MC e 1,00098 na borda do fuso no Equador; em 80° S, a borda fica em 0,99964.</p>', 880),
    };
    // Barras de 1 km e o detalhe das extremidades: 21 cm de diferença
    this.bars = kit.h('<div style="position:absolute;inset:0">' +
      '<div class="bar" style="left:1170px;top:488px;width:600px;background:var(--main)"></div>' +
      '<div class="bar vicosa-b2" style="left:1170px;top:598px;width:600px;background:var(--tissot)"></div></div>');
    kit.stage.append(this.bars);
    this.b2 = this.bars.querySelector('.vicosa-b2').style;
    this.zoom = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="vicosa-z">' +
      '<rect x="1430" y="700" width="420" height="110" rx="10" style="fill:color-mix(in srgb, var(--ground) 94%, var(--second))"/>' +
      '<path d="M1450 732H1720" style="stroke:var(--main);stroke-width:14"/>' +
      '<path d="M1450 768H1800" style="stroke:var(--tissot);stroke-width:14"/>' +
      '<path class="zoomln" d="M1720 718V800M1800 718V800" style="stroke:var(--main)"/>' +
      '<path class="dimb" d="M1720 796H1800"/></g></svg>');
    kit.stage.append(this.zoom);
    this.zg = this.zoom.querySelector('.vicosa-z').style;
    this.zl = kit.h('<div class="lbl sm c" style="left:1760px;top:812px;color:var(--tissot)"><b>+21 cm</b></div>');
    kit.stage.append(this.zl);
  },
  render(t) {
    A9V3.paint(this.r, { u: 1, fld: lerp(1, 0.55, eo(seg(t, 1.0, 2.0))), land: 1, iso: 1, bord: 1, mc: 1, axes: 1, sec: 1, sech: 1, cbar: 1 - seg(t, 0.4, 1.0) });
    TextFx.fadeFromRight(this.line, t, 0.2);
    const fade = (s, a, b = 0.6) => { const k = eo(seg(t, a, a + b)); s.opacity = k; s.transform = 'translateX(' + lerp(22, 0, k) + 'px)'; return k; };
    this.dot.opacity = eo(seg(t, 1.6, 2.2)); this.lv.style.opacity = this.dot.opacity;
    const dk = eo(seg(t, 2.6, 3.2)); this.dim.opacity = dk; this.lx.style.opacity = dk;
    fade(this.T.a, 4.0);
    const b1 = fade(this.T.b, 7.0); this.bars.style.opacity = b1;
    fade(this.T.c, 8.4);
    this.b2.width = (600 * eio(seg(t, 8.4, 10.4))).toFixed(1) + 'px';
    const z = fade(this.T.z, 11.0); this.zg.opacity = z; this.zl.style.opacity = eo(seg(t, 11.6, 12.2));
    fade(this.T.e, 13.6);
  },
});
