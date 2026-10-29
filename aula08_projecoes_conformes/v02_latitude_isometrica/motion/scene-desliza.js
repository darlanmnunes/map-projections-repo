// Cena 2 (12 a 24 s): o quadrilátero desliza para φ = −30° e φ = −60°; o lado leste-oeste encolhe com cos φ
const { seg, eio, eo, lerp, TextFx } = kit;
kit.scene('desliza', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.all = kit.h('<div style="position:absolute;inset:0"></div>');
    kit.stage.append(this.all);
    this.gl = V2.globe(kit, 'desliza');
    this.all.append(this.gl.svg);
    this.ins = V2.inset(kit, this.all);
    // Estado herdado da cena 1
    this.all.append(kit.h('<div class="words desliza-old" style="left:110px;top:84px;width:1000px">' +
      '<h2 class="line">Um quadrilátero elementar no elipsoide</h2>' +
      '<p class="sub">Entre dois meridianos e dois paralelos: Δφ = Δλ = 5°</p></div>'));
    this.all.append(kit.h('<div class="words desliza-old" style="left:1140px;top:860px;width:620px;align-items:center;text-align:center">' +
      '<p class="sub">Perto do Equador: quase um quadrado</p></div>'));
    this.old = [...this.all.querySelectorAll('.desliza-old')].map(e => e.style);
    // Novo texto
    this.all.append(kit.h('<div class="words" style="left:110px;top:84px;width:1700px">' +
      '<h2 class="line desliza-hd">Mesma variação de ângulo, comprimentos diferentes</h2>' +
      '<p class="sub desliza-sub">O lado leste-oeste encolhe na proporção cos φ</p></div>'));
    this.hd = this.all.querySelector('.desliza-hd');
    this.sub = this.all.querySelector('.desliza-sub').style;
    const cos = txt => {
      const el = kit.h('<div class="words" style="left:1140px;top:840px;width:620px;align-items:center;text-align:center">' +
        '<p class="eq">' + txt + '</p></div>');
      this.all.append(el);
      return el.style;
    };
    this.c30 = cos('<i>φ</i> = −30°:&emsp;cos <i>φ</i> = 0,87');
    this.c60 = cos('<i>φ</i> = −60°:&emsp;cos <i>φ</i> = 0,50');
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    TextFx.fadeFromRight(this.hd, t, 0.8);
    this.sub.opacity = eo(seg(t, 2.0, 2.6));
    const pc = lerp(0, -30, eio(seg(t, 1.6, 3.6))) + lerp(0, -30, eio(seg(t, 7.0, 9.0)));
    const g = V2.G;
    V2.paintGlobe(this.gl, g);
    this.gl.quad.setAttribute('d', V2.quadD(g, pc));
    const a = V2.quadBox(g, pc), e = V2.rect(pc);
    const b = { x: V2.INSET.x, y: V2.INSET.y, w: e.w, h: e.h };
    this.gl.zl.setAttribute('d', 'M' + (a.x + a.w / 2) + ' ' + (a.y - a.h / 2) + 'L' + (b.x - b.w / 2) + ' ' + (b.y - b.h / 2) +
      'M' + (a.x + a.w / 2) + ' ' + (a.y + a.h / 2) + 'L' + (b.x - b.w / 2) + ' ' + (b.y + b.h / 2));
    this.gl.zl.style.opacity = 0.9;
    V2.paintInset(this.ins, b, { rect: 1, ghost: seg(t, 1.6, 2.2), v: 1, h: 1 });
    this.c30.opacity = eo(seg(t, 3.8, 4.4)) * (1 - seg(t, 6.6, 7.0));
    this.c60.opacity = eo(seg(t, 9.2, 9.8));
    this.all.style.opacity = 1 - seg(t, 11.4, 12);
  },
});
