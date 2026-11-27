// Cena 1 (0 a 12 s): quadrilátero Δφ = Δλ = 5° perto do Equador; zoom mostra os lados M dφ e N cos φ dλ
const { seg, eio, eo, lerp, TextFx } = kit;
kit.scene('quadrilatero', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.gl = V2.globe(kit, 'quadrilatero');
    kit.stage.append(this.gl.svg);
    this.ins = V2.inset(kit);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:84px;width:1000px">' +
      '<h2 class="line">Um quadrilátero elementar no elipsoide</h2>' +
      '<p class="sub quadrilatero-sub">Entre dois meridianos e dois paralelos: Δφ = Δλ = 5°</p></div>'));
    this.line = kit.stage.querySelector('.line');
    this.sub = kit.stage.querySelector('.quadrilatero-sub').style;
    kit.stage.append(kit.h('<div class="words" style="left:1140px;top:860px;width:620px;align-items:center;text-align:center">' +
      '<p class="sub quadrilatero-cap">Perto do Equador: quase um quadrado</p></div>'));
    this.cap = kit.stage.querySelector('.quadrilatero-cap').style;
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, -1.0);
    this.sub.opacity = seg(t, 0.8, 1.4);
    const rot = eio(seg(t, 0, 4.0)), G = V2.G;
    const g = { cx: G.cx, cy: G.cy, R: G.R, lc: lerp(-5, G.lc, rot), pc: lerp(8, G.pc, rot) };
    V2.paintGlobe(this.gl, g);
    this.gl.quad.setAttribute('d', V2.quadD(g, 0));
    this.gl.quad.style.opacity = seg(t, 4.0, 4.6);
    // Zoom: o quadrilátero cresce do globo até o painel
    const z = eio(seg(t, 5.0, 6.6)), a = V2.quadBox(g, 0), e = V2.rect(0);
    const b = { x: lerp(a.x, V2.INSET.x, z), y: lerp(a.y, V2.INSET.y, z), w: lerp(a.w, e.w, z), h: lerp(a.h, e.h, z) };
    this.gl.zl.setAttribute('d', 'M' + (a.x + a.w / 2) + ' ' + (a.y - a.h / 2) + 'L' + (b.x - b.w / 2) + ' ' + (b.y - b.h / 2) +
      'M' + (a.x + a.w / 2) + ' ' + (a.y + a.h / 2) + 'L' + (b.x - b.w / 2) + ' ' + (b.y + b.h / 2));
    this.gl.zl.style.opacity = 0.9 * seg(t, 5.0, 5.4);
    V2.paintInset(this.ins, b, { rect: seg(t, 5.0, 5.2), ghost: 0, v: eo(seg(t, 7.0, 7.6)), h: eo(seg(t, 7.6, 8.2)) });
    this.cap.opacity = eo(seg(t, 9.0, 9.6));
  },
});
