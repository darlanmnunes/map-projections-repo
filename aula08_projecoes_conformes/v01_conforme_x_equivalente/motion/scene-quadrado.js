// Cena 4 (35 a 50 s): quadradinho da esfera na Mercator (quadrado maior) e na Lambert (retângulo de mesma área)
const { seg, eio, eo, lerp } = kit;
const QX = { esf: 330, merc: 960, lamb: 1590 };
const A = 120;                                    // lado a do quadradinho ampliado (px)
const SQ = {
  esf: { x: QX.esf, y: 615, w: A, h: A },
  merc: { x: QX.merc, y: 500, w: 2 * A, h: 2 * A },       // m = 2 nas duas direções
  lamb: { x: QX.lamb, y: 500, w: 2 * A, h: 0.5 * A },     // 2 a leste-oeste, 0,5 a norte-sul
};
const GQ = { cx: QX.esf, cy: 390, R: 140, lc: -45, pc: -45 };
kit.scene('quadrado', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.maps = V1.mount(kit, 'quadrado', ['merc', 'lamb']);
    kit.stage.append(this.maps.svg);
    // Estado herdado da cena 3
    const head = (k, name, eq) => kit.h('<div class="words quadrado-old" style="left:' + V1.X0[k] + 'px;top:150px;gap:4px">' +
      '<div class="ttl">' + name + '</div><div class="eq">' + eq + '</div></div>');
    const cm = V1.map('merc', V1.CLON, -60), cl = V1.map('lamb', V1.CLON, -60);
    const old = [
      head('merc', 'Conforme (Mercator)', '<i>ϖ</i> = 0,&emsp;<i>σ</i> = <i>m</i>²'),
      head('lamb', 'Equivalente (Lambert cilíndrica)', '<i>σ</i> = 1,&emsp;<i>ϖ</i> &gt; 0'),
      kit.h('<div class="tag quadrado-old" style="left:' + (cm[0] + 100) + 'px;top:' + (cm[1] - 56) + 'px">' +
        '<div class="eq"><i>m</i> = 2</div><div class="eq"><i>σ</i> = 4</div></div>'),
      kit.h('<div class="tag quadrado-old" style="left:' + (cl[0] + 100) + 'px;top:' + (cl[1] - 92) + 'px">' +
        '<div class="sub">semieixos 2 e 0,5</div><div class="eq"><i>σ</i> = 1</div></div>'),
      kit.h('<div class="words quadrado-old" style="left:995px;top:700px;width:780px">' +
        '<p class="sub">Mesmo círculo na esfera: a Mercator muda o tamanho, a Lambert muda a forma.</p></div>'),
    ];
    for (const el of old) kit.stage.append(el);
    this.old = old.map(el => el.style);
    // Globo pequeno e quadradinhos
    this.glob = V1.mount(kit, 'quadrado-g', ['merc']);
    kit.stage.append(this.glob.svg);
    const cell = c => '<g class="quadrado-' + c + '"><rect class="cell" x="0" y="0" width="1" height="1" vector-effect="non-scaling-stroke"/>' +
      '<path class="cellgrid" d="M0.3333 0V1M0.6667 0V1M0 0.3333H1M0 0.6667H1" vector-effect="non-scaling-stroke"/></g>';
    kit.stage.append(kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="cell quadrado-tiny"/><path class="zoomln quadrado-zl"/>' + cell('esf') + cell('merc') + cell('lamb') + '</svg>'));
    this.tiny = kit.stage.querySelector('.quadrado-tiny');
    this.zl = kit.stage.querySelector('.quadrado-zl');
    this.sq = {};
    for (const c of ['esf', 'merc', 'lamb']) this.sq[c] = kit.stage.querySelector('.quadrado-' + c);
    // Textos
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:84px;width:1700px">' +
      '<h2 class="line quadrado-hd">Um quadradinho infinitesimal em φ = −60°</h2></div>'));
    this.hd = kit.stage.querySelector('.quadrado-hd').style;
    const col = (c, top, html) => {
      const el = kit.h('<div class="words" style="left:' + (QX[c] - 280) + 'px;top:' + top + 'px;width:560px;align-items:center;text-align:center;gap:4px">' + html + '</div>');
      kit.stage.append(el);
      return el.style;
    };
    this.h = {
      esf: col('esf', 190, '<div class="ttl">Na esfera</div>'),
      merc: col('merc', 190, '<div class="ttl">Mercator</div>'),
      lamb: col('lamb', 190, '<div class="ttl">Lambert cilíndrica</div>'),
    };
    this.l = {
      esf: col('esf', 690, '<div class="eq">lado <i>a</i>,&emsp;área <i>a</i>²</div>'),
      merc: col('merc', 690, '<div class="eq">2<i>a</i> × 2<i>a</i>,&emsp;área 4<i>a</i>²</div><div class="eq"><i>m</i> = 2 nas duas direções</div>'),
      lamb: col('lamb', 690, '<div class="eq">2<i>a</i> × 0,5<i>a</i>,&emsp;área <i>a</i>²</div><div class="eq"><i>σ</i> = 1, forma alterada</div>'),
    };
    const center = (top, html) => {
      const el = kit.h('<div style="position:absolute;left:0;top:' + top + 'px;width:1920px;display:flex;justify-content:center">' + html + '</div>');
      kit.stage.append(el);
      return el.style;
    };
    this.cond = center(790, '<div class="box2" style="position:relative;display:flex;align-items:center;gap:34px">' +
      '<div class="ttl">Condição de conformidade</div>' +
      '<div class="eq big"><span class="frac"><span><i>E</i></span><span><i>e</i></span></span> = ' +
      '<span class="frac"><span><i>G</i></span><span><i>g</i></span></span> = <i>m</i>²,&emsp;<i>F</i> = 0</div></div>');
    this.fin = center(938, '<h2 class="line" style="font-size:42px">Conforme: mesma escala em todas as direções, não escala igual a 1</h2>');
    // Contorno do quadradinho na esfera: Δφ = 6°, Δλ = 12° (6° de arco em φ = −60°)
    this.ring = [];
    for (let l = -51; l < -39; l += 1) this.ring.push(l, -63);
    for (let p = -63; p < -57; p += 0.5) this.ring.push(-39, p);
    for (let l = -39; l > -51; l -= 1) this.ring.push(l, -57);
    for (let p = -57; p > -63; p -= 0.5) this.ring.push(-51, p);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    let d = '';
    for (let i = 0; i < this.ring.length; i += 2) {
      const q = V1.ortho(GQ, this.ring[i], this.ring[i + 1]);
      d += (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1);
      x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]);
    }
    this.tiny.setAttribute('d', d + 'Z');
    this.tb = { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
    V1.sig(kit);
  },
  render(t) {
    const out = 1 - seg(t, 0, 0.8);
    for (const s of this.old) s.opacity = out;
    V1.paint(this.maps, V1.mapsState(out));
    const gA = seg(t, 1.0, 1.6);
    V1.paint(this.glob, { merc: { a: gA, g: GQ, u: 0, full: 1, circ: [0, 0, 0] } });
    this.tiny.style.opacity = gA;
    const set = (c, b, a) => {
      const g = this.sq[c];
      g.style.opacity = a;
      g.setAttribute('transform', 'translate(' + (b.x - b.w / 2).toFixed(2) + ' ' + (b.y - b.h / 2).toFixed(2) + ') scale(' + b.w.toFixed(3) + ' ' + b.h.toFixed(3) + ')');
    };
    const mix = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
    const z = eio(seg(t, 2.0, 3.4));
    set('esf', mix(this.tb, SQ.esf, z), seg(t, 2.0, 2.2));
    const e = mix(this.tb, SQ.esf, z), tb = this.tb;
    this.zl.setAttribute('d', 'M' + (tb.x - tb.w / 2) + ' ' + (tb.y + tb.h / 2) + 'L' + (e.x - e.w / 2) + ' ' + (e.y - e.h / 2) +
      'M' + (tb.x + tb.w / 2) + ' ' + (tb.y + tb.h / 2) + 'L' + (e.x + e.w / 2) + ' ' + (e.y - e.h / 2));
    this.zl.style.opacity = seg(t, 2.0, 2.4) * 0.9;
    set('merc', mix(SQ.esf, SQ.merc, eio(seg(t, 4.2, 5.6))), seg(t, 4.2, 4.4));
    set('lamb', mix(SQ.esf, SQ.lamb, eio(seg(t, 6.4, 7.8))), seg(t, 6.4, 6.6));
    const fade = (s, a) => { const p = eo(seg(t, a, a + 0.6)); s.opacity = p; s.transform = 'translateY(' + lerp(16, 0, p) + 'px)'; };
    fade(this.hd, 0.9);
    fade(this.h.esf, 1.2); fade(this.h.merc, 4.2); fade(this.h.lamb, 6.4);
    fade(this.l.esf, 3.4); fade(this.l.merc, 5.6); fade(this.l.lamb, 7.8);
    fade(this.cond, 8.8);
    fade(this.fin, 10.4);
  },
});
