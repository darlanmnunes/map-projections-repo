// Cena 3 (32 a 48 s): Viçosa no globo e na curva: m = 0,94995, σ = 0,90241
const { seg, eo, lerp, TextFx } = kit;
const MV = 0.94995;
kit.scene('vicosa', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.w = kit.h('<div style="position:absolute;inset:0"></div>');
    kit.stage.append(this.w);
    this.g = V4.svg3d(kit, 'vicosa');
    this.w.append(this.g.svg);
    this.c = V4.coneSecant(5, 42);
    this.gr = V4.graph(kit, 'vicosa');
    this.w.append(this.gr.svg);
    for (const el of this.gr.ticks) this.w.append(el);
    const gr = this.gr;
    gr.ghost.setAttribute('d', V4.curveD(gr, 1, -55)); gr.ghost.style.opacity = 0.45;
    gr.solid.setAttribute('d', V4.curveD(gr, gr.k, -55));
    gr.pp.setAttribute('d', V4.ppD([-5, -42]));
    // Estado herdado da cena 2 (fica, exceto o título e a frase)
    for (const p of [-5, -42]) this.w.append(kit.h('<div class="lbl" style="left:' + (V4.GX(p) - 28) + 'px;top:' + (V4.G.y1 - 44) + 'px;color:var(--accent)">−' + (-p) + '°</div>'));
    this.w.append(kit.h('<div class="words" style="left:' + V4.GX(-5) + 'px;top:' + (V4.G.y0 - 56) + 'px;width:' + (V4.GX(-42) - V4.GX(-5)) + 'px;align-items:center">' +
      '<p class="eq">entre os PP: <i>m</i> &lt; 1</p></div>'));
    this.w.append(kit.h('<div class="words" style="left:' + (V4.GX(-12) - 20) + 'px;top:' + (V4.G.y1 + 18) + 'px;gap:2px">' +
      '<p class="eq" style="font-size:28px;color:var(--accent)">- - 1 PP (−24°)</p>' +
      '<p class="eq" style="font-size:28px">— 2 PP (−5° e −42°)</p></div>'));
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:900px"><h2 class="line">Cone secante em −5° e −42°</h2></div>'),
      kit.h('<div class="words" style="left:1060px;top:116px;width:800px"><p class="ttl" style="font-size:36px">2 paralelos padrão: a mesma curva, deslocada para baixo</p></div>'),
    ];
    for (const el of old) this.w.append(el);
    this.old = old.map(el => el.style);
    this.w.append(kit.h('<div class="words" style="left:110px;top:60px;width:900px">' +
      '<h2 class="line vicosa-hd">Viçosa: φ = −20°45′</h2></div>'));
    this.hd = kit.stage.querySelector('.vicosa-hd');
    // Viçosa no globo e na curva
    const v = this.g.vicXY;
    this.gl = kit.h('<div class="lbl" style="left:' + (v[0] + 16) + 'px;top:' + (v[1] + 2) + 'px">Viçosa</div>');
    this.w.append(this.gl);
    const px = V4.GX(-20.75), py = V4.GY(MV);
    gr.gv.setAttribute('cx', px); gr.gv.setAttribute('cy', py);
    gr.gvl.setAttribute('d', 'M' + (px - 8) + ' ' + (py + 8) + 'L' + (px - 60) + ' ' + (py + 34));
    this.gtl = kit.h('<div class="lbl" style="left:' + (px - 330) + 'px;top:' + (py + 22) + 'px">Viçosa: <i>m</i> = 0,94995</div>');
    this.w.append(this.gtl);
    this.tag = kit.h('<div class="tag" style="left:' + (V4.GX(-14) - 20) + 'px;top:410px">' +
      '<p class="sub" style="margin:0">distâncias −5 %</p>' +
      '<p class="sub" style="margin:0">áreas −9,8 % (<span class="eq" style="font-size:32px"><i>σ</i> = <i>m</i>² = 0,90241</span>)</p></div>');
    this.w.append(this.tag);
    this.w.append(kit.h('<div class="words" style="left:1060px;top:116px;width:800px">' +
      '<p class="ttl vicosa-st" style="font-size:36px">PP afastados 37°: distorção maior no centro da faixa</p></div>'));
    this.st = kit.stage.querySelector('.vicosa-st').style;
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    TextFx.fadeFromRight(this.hd, t, 0.5);
    const pv = eo(seg(t, 1.2, 1.8));
    V4.paintCone(this.g, this.c, { body: 1, contact: 1, vic: pv });
    this.gl.style.opacity = pv;
    const gp = eo(seg(t, 2.2, 2.8));
    for (const e of [this.gr.gv, this.gr.gvl, this.gtl]) e.style.opacity = gp;
    const tg = eo(seg(t, 4.2, 4.8));
    this.tag.style.opacity = tg;
    this.tag.style.transform = 'translateY(' + lerp(14, 0, tg) + 'px)';
    const s = eo(seg(t, 7.0, 7.6));
    this.st.opacity = s; this.st.transform = 'translateX(' + lerp(26, 0, s) + 'px)';
    this.w.style.opacity = 1 - seg(t, 15.4, 16);
  },
});
