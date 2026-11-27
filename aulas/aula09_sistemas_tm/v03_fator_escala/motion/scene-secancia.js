// Cena 2 (20 a 46 s): fuso 23 com a distorção em ppm. Na vista (φ, λ) as linhas de secância se abrem para o
// sul e encostam na borda perto de 57° S; o morph leva à grade (E, N), onde elas ficam a ≈ 180 km do MC.
const { seg, eo, eio, lerp, TextFx } = kit;
const P57 = -57.3262;   // latitude em que Δλs = 3° (python/gerar_dados.py)
// Ponto [λ, φ, E, N] de uma linha (de 0,5° em 0,5°, de norte a sul) na latitude phi, por interpolação
function at(line, phi) {
  for (let k = 0; k < line.length - 1; k++) {
    const a = line[k], b = line[k + 1];
    if (a[1] >= phi && phi >= b[1]) { const w = (a[1] - phi) / (a[1] - b[1]); return a.map((v, i) => lerp(v, b[i], w)); }
  }
  return line[line.length - 1];
}
kit.scene('secancia', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V3.build(kit, 'secancia');
    kit.stage.append(this.r.svg);
    const d = this.r.d;
    this.dims = [0, P57].map(phi => ({ mc: at(d.mc, phi), s: at(d.sec, phi) }));
    const over = this.r.q('over');
    over.innerHTML = '<path class="dimb secancia-d0"/><path class="dimb secancia-d1"/>';
    this.d0 = over.querySelector('.secancia-d0'); this.d1 = over.querySelector('.secancia-d1');
    this.title = kit.h('<div class="words" style="left:110px;top:60px;width:1200px"><h2 class="line">Linhas de secância: onde <i>m</i> = 1</h2></div>');
    kit.stage.append(this.title);
    this.line = this.title.querySelector('.line');
    const lab = (html, cls, color) => { const e = kit.h('<div class="lbl sm ' + (cls || '') + '"' + (color ? ' style="color:' + color + '"' : '') + '>' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.L = {
      m1: lab('<i>m</i> = 1', 'c bg'),
      g0: lab('Δ<i>λ</i><sub>s</sub> = 1°36′55″', 'bg'), g1: lab('Δ<i>λ</i><sub>s</sub> = 3° em 57°19′ S', 'bg'),
      n0: lab('179,75 km', 'bg'), n1: lab('180,61 km', 'bg'),
    };
    // Isolinhas: rótulo, lado (+1 leste, −1 oeste) e latitude do rótulo
    this.iso = [['200', 1, -8], ['600', 1, -8], ['400', -1, -14], ['800', -1, -14], ['-300', 1, -40], ['-200', -1, -40]].map(([v, side, phi]) => {
      const e = kit.h('<div class="isolbl">' + (v[0] === '-' ? '−' + v.slice(1) : '+' + v) + '</div>');
      kit.stage.append(e);
      const p = at(d.iso[v], phi);
      return { s: e.style, p: side > 0 ? p : A9V3.west(p) };
    });
    const box = (html, y) => { const e = kit.h('<div class="words" style="left:1170px;top:' + y + 'px;width:690px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.T = {
      sub: box('<p class="sub">Fuso 23 (−48° a −42°): distorção linear em mm/km (ppm). Azul reduz; vermelho amplia.</p>', 190),
      a: box('<p class="sub">Em longitude, Δ<i>λ</i><sub>s</sub> cresce com a latitude: as linhas se abrem para o sul.</p>' +
        '<p class="eq">sen Δ<i>λ</i><sub>s</sub> = <span class="frac"><span>√(1 − <i>k</i><sub>0</sub>²)</span><span>cos <i>φ</i></span></span></p>', 360),
      b: box('<p class="sub">Por volta de 57° S, a linha de secância encosta na borda do fuso.</p>', 590),
      c: box('<p class="sub">Na grade (<i>E</i>, <i>N</i>), a mesma linha fica a ≈ 180 km do MC em qualquer latitude.</p>' +
        '<p class="eq"><i>x</i><sub>s</sub> ≈ <i>R</i> √(2 (1 − <i>k</i><sub>0</sub>)) ≈ 180 km</p>', 360),
      d: box('<p class="sub">As faixas de mesma distorção são quase paralelas ao MC: <i>m</i> depende quase só de <i>x</i>.</p>', 590),
      e: box('<p class="sub"><b><i>m</i> &lt; 1</b> numa faixa central de ≈ 360 km; <b><i>m</i> &gt; 1</b> nas bordas.</p>', 760),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, 0.1);
    const fade = (s, a, b = 0.6) => { const k = eo(seg(t, a, a + b)); s.opacity = k; s.transform = 'translateX(' + lerp(22, 0, k) + 'px)'; return k; };
    const out = (s, a) => { s.opacity = Math.min(+s.opacity, 1 - seg(t, a, a + 0.5)); };
    const m = eo(seg(t, 1.0, 2.4)), u = eio(seg(t, 11.0, 14.5));
    A9V3.paint(this.r, { u, fld: m, land: m, iso: eo(seg(t, 18.4, 19.4)), bord: m, mc: m, axes: m,
      sec: eo(seg(t, 2.6, 2.9)), sech: eio(seg(t, 2.6, 5.0)) });
    fade(this.T.sub, 0.8);
    fade(this.T.a, 4.4); out(this.T.a, 10.4);
    fade(this.T.b, 7.6); out(this.T.b, 10.4);
    fade(this.T.c, 15.0); fade(this.T.d, 18.8); fade(this.T.e, 21.6);
    for (const k of ['sub', 'c', 'd', 'e']) out(this.T[k], 25.4);   // o texto sai; o mapa continua na cena 3
    // Rótulo m = 1 no topo da secante leste
    const s0 = A9V3.P(this.r.d.sec[3], u);
    Object.assign(this.L.m1, { left: (s0[0] + 34) + 'px', top: (s0[1] - 6) + 'px', opacity: eo(seg(t, 3.0, 3.6)) * (1 - seg(t, 25.4, 25.9)) });
    // Cotas do MC à secante leste no Equador e em 57°19′ S
    const dim = (el, q, k, tk) => {
      const a = A9V3.P(q.mc, u), b = A9V3.P(q.s, u);
      el.setAttribute('d', 'M' + a[0] + ' ' + a[1] + 'H' + b[0] + 'M' + a[0] + ' ' + (a[1] - tk) + 'v' + 2 * tk + 'M' + b[0] + ' ' + (b[1] - tk) + 'v' + 2 * tk);
      el.style.opacity = k;
      return b;
    };
    const fim = 1 - seg(t, 25.4, 25.9);
    this.title.style.opacity = fim;
    const k0 = eo(seg(t, 5.6, 6.2)) * fim, k1 = eo(seg(t, 7.0, 7.6)) * fim;
    const b0 = dim(this.d0, this.dims[0], k0, 9), b1 = dim(this.d1, this.dims[1], k1, 9);
    const geoK = 1 - seg(u, 0.1, 0.4), gridK = seg(u, 0.7, 1);
    Object.assign(this.L.g0, { left: (b0[0] + 16) + 'px', top: (b0[1] - 18) + 'px', opacity: k0 * geoK });
    Object.assign(this.L.g1, { left: (b1[0] + 16) + 'px', top: (b1[1] - 18) + 'px', opacity: k1 * geoK });
    const kn = eo(seg(t, 14.4, 15.0)) * gridK * fim;
    Object.assign(this.L.n0, { left: (b0[0] + 16) + 'px', top: (b0[1] - 18) + 'px', opacity: kn });
    Object.assign(this.L.n1, { left: (b1[0] + 16) + 'px', top: (b1[1] - 18) + 'px', opacity: kn });
    const ki = eo(seg(t, 18.8, 19.6)) * fim;
    for (const i of this.iso) { const p = A9V3.P(i.p, u); Object.assign(i.s, { left: p[0] + 'px', top: p[1] + 'px', opacity: ki }); }
  },
});
