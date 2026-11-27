// Cena 2 (15 a 32 s): o cone afunda até cortar o globo em −5° e −42°; a curva desce (× 0,9485) e cruza m = 1 nos PP
const { seg, eo, eio, lerp, TextFx } = kit;
kit.scene('secante', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.g = V4.svg3d(kit, 'secante');
    kit.stage.append(this.g.svg);
    this.c0 = V4.coneTangent(24);
    this.c1 = V4.coneSecant(5, 42);
    this.gr = V4.graph(kit, 'secante');
    kit.stage.append(this.gr.svg);
    for (const el of this.gr.ticks) kit.stage.append(el);
    // Estado herdado da cena 1
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:900px"><h2 class="line">Cone tangente no paralelo −24°</h2></div>'),
      kit.h('<div class="words" style="left:1060px;top:116px;width:800px"><p class="ttl" style="font-size:36px">1 paralelo padrão: m ≥ 1</p></div>'),
      kit.h('<div class="lbl" style="left:' + (V4.GX(-24) - 34) + 'px;top:' + (V4.G.y1 - 44) + 'px;color:var(--accent)">−24°</div>'),
    ];
    for (const el of old) kit.stage.append(el);
    this.old = old.map(el => el.style);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:900px">' +
      '<h2 class="line secante-hd">Cone secante em −5° e −42°</h2></div>'));
    this.hd = kit.stage.querySelector('.secante-hd');
    kit.stage.append(kit.h('<div class="words" style="left:1060px;top:116px;width:800px">' +
      '<p class="ttl secante-st" style="font-size:36px">2 paralelos padrão: a mesma curva, deslocada para baixo</p></div>'));
    this.st = kit.stage.querySelector('.secante-st').style;
    this.pl = [-5, -42].map(p => {
      const el = kit.h('<div class="lbl" style="left:' + (V4.GX(p) - 28) + 'px;top:' + (V4.G.y1 - 44) + 'px;color:var(--accent)">' + '−' + (-p) + '°</div>');
      kit.stage.append(el);
      return el.style;
    });
    kit.stage.append(kit.h('<div class="words secante-band" style="left:' + V4.GX(-5) + 'px;top:' + (V4.G.y0 - 56) + 'px;width:' + (V4.GX(-42) - V4.GX(-5)) + 'px;align-items:center">' +
      '<p class="eq">entre os PP: <i>m</i> &lt; 1</p></div>'));
    this.band = kit.stage.querySelector('.secante-band').style;
    kit.stage.append(kit.h('<div class="words secante-leg" style="left:' + (V4.GX(-12) - 20) + 'px;top:' + (V4.G.y1 + 18) + 'px;gap:2px">' +
      '<p class="eq" style="font-size:28px;color:var(--accent)">- - 1 PP (−24°)</p>' +
      '<p class="eq" style="font-size:28px">— 2 PP (−5° e −42°)</p></div>'));
    this.leg = kit.stage.querySelector('.secante-leg').style;
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    TextFx.fadeFromRight(this.hd, t, 0.5);
    // O cone afunda sem mudar de forma; a curva desce junto
    const u = eio(seg(t, 1.5, 7.5));
    const c = { th: lerp(this.c0.th, this.c1.th, u), za: lerp(this.c0.za, this.c1.za, u) };
    V4.paintCone(this.g, c, { body: 1, contact: 1 });
    const gr = this.gr, k = gr.k;
    gr.axes.style.opacity = 1;
    for (const el of gr.ticks) el.style.opacity = 1;
    const f = lerp(1, k, u), sol = seg(t, 7.6, 8.4);
    gr.ghost.setAttribute('d', V4.curveD(gr, 1, -55));
    gr.ghost.style.opacity = 0.45 * seg(t, 1.5, 2.0);
    gr.moving.setAttribute('d', V4.curveD(gr, f, -55));
    gr.moving.style.opacity = 1 - sol;
    gr.solid.setAttribute('d', V4.curveD(gr, k, -55));
    gr.solid.style.opacity = sol;
    gr.pp.setAttribute('d', t < 1.5 ? V4.ppD([-24]) : V4.ppD([-5, -42]));
    gr.pp.style.opacity = t < 1.5 ? 1 - seg(t, 0.6, 1.2) : eo(seg(t, 7.8, 8.4));
    for (const s of this.pl) s.opacity = eo(seg(t, 7.8, 8.4));
    gr.band.style.opacity = eo(seg(t, 8.6, 9.4));
    this.band.opacity = eo(seg(t, 9.0, 9.6));
    const s = eo(seg(t, 10.0, 10.6));
    this.st.opacity = s; this.st.transform = 'translateX(' + lerp(26, 0, s) + 'px)';
    this.leg.opacity = eo(seg(t, 11.0, 11.6));
  },
});
