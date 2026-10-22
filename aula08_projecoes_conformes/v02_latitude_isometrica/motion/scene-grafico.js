// Cena 4 (40 a 55 s): |ψ| contra |φ| de 0° a 85° (GRS80), com a reta ψ = φ, Viçosa e ψ → ∞ no polo
const { seg, eio, eo, lerp } = kit;
const PX = { x0: 260, kx: 11, y0: 950, ky: 3.5 };          // |φ| 0..90 → x; |ψ| 0..200 → y
const X = f => PX.x0 + PX.kx * f, Y = p => PX.y0 - PX.ky * p;
const VIC = 20.75, VIC_PSI = 21.0831;                       // Viçosa, φ = −20°45′
kit.scene('grafico', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.psi = kit.json('v2-dados.json').psi;
    this.step = kit.json('v2-dados.json').passo;
    let grid = '', axis = 'M' + X(0) + ' ' + Y(200) + 'V' + Y(0) + 'H' + X(90);
    for (let f = 10; f <= 90; f += 10) grid += 'M' + X(f) + ' ' + Y(0) + 'V' + Y(200);
    for (let p = 25; p <= 200; p += 25) grid += 'M' + X(0) + ' ' + Y(p) + 'H' + X(90);
    const p85 = V2.psi(85);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="gridl" d="' + grid + '"/><path class="axis" d="' + axis + '"/>' +
      '<path class="ref grafico-ref"/><path class="curve grafico-curve"/>' +
      '<path class="lead grafico-lv" d="M' + X(VIC) + ' ' + (Y(VIC_PSI) - 12) + 'L' + (X(VIC) - 20) + ' ' + (Y(VIC_PSI) - 150) + '"/>' +
      '<circle class="dot grafico-dv" cx="' + X(VIC) + '" cy="' + Y(VIC_PSI) + '" r="9"/>' +
      '<circle class="dot grafico-d85" cx="' + X(85) + '" cy="' + Y(p85) + '" r="9"/>' +
      '<path class="arrow grafico-arr" d="M' + (X(85) + 40) + ' ' + (Y(p85) + 70) + 'L' + (X(85) + 40) + ' ' + (Y(200) - 10) +
      'M' + (X(85) + 26) + ' ' + (Y(200) + 6) + 'L' + (X(85) + 40) + ' ' + (Y(200) - 10) + 'L' + (X(85) + 54) + ' ' + (Y(200) + 6) + '"/></svg>');
    kit.stage.append(svg);
    for (const c of ['ref', 'curve', 'lv', 'dv', 'd85', 'arr']) this[c] = svg.querySelector('.grafico-' + c);
    this.axes = svg.querySelectorAll('.gridl, .axis');
    // Marcas dos eixos
    this.ticks = [];
    const tick = (html, x, y, cls) => { const el = kit.h('<div class="tick' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); kit.stage.append(el); this.ticks.push(el.style); };
    for (let f = 0; f <= 90; f += 10) tick(String(f), X(f) - (f < 10 ? 7 : 13), Y(0) + 10);
    for (let p = 0; p <= 200; p += 25) tick(String(p), X(0) - (p < 10 ? 26 : p < 100 ? 38 : 52), Y(p) - 14);
    tick('|<i>φ</i>| (graus)', X(45) - 60, Y(0) + 48, ' eqt');
    tick('|<i>ψ</i>| (graus)', X(0) - 20, Y(200) - 52, ' eqt');
    // Legenda
    kit.stage.append(kit.h('<div class="words grafico-leg" style="left:' + (X(0) + 30) + 'px;top:' + (Y(200) + 20) + 'px;gap:4px">' +
      '<p class="eq">— <i>ψ</i> (GRS80)</p><p class="eq" style="color:var(--grid)">- - <i>ψ</i> = <i>φ</i> (referência)</p></div>'));
    this.leg = kit.stage.querySelector('.grafico-leg').style;
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:84px;width:1700px">' +
      '<h2 class="line grafico-hd">Latitude isométrica contra latitude</h2></div>'));
    this.hd = kit.stage.querySelector('.grafico-hd').style;
    kit.stage.append(kit.h('<div class="tag grafico-tv" style="left:' + (X(VIC) - 200) + 'px;top:' + (Y(VIC_PSI) - 240) + 'px">' +
      '<div class="ttl" style="font-size:28px">Viçosa</div><div class="eq"><i>φ</i> = −20°45′,&emsp;|<i>ψ</i>| = 21,08°</div></div>'));
    this.tv = kit.stage.querySelector('.grafico-tv').style;
    kit.stage.append(kit.h('<div class="words grafico-t85" style="left:' + (X(85) - 470) + 'px;top:' + (Y(p85) - 26) + 'px;width:440px;align-items:flex-end">' +
      '<p class="eq">Em 85°, <i>ψ</i> passa de 170°</p></div>'));
    this.t85 = kit.stage.querySelector('.grafico-t85').style;
    kit.stage.append(kit.h('<div class="words" style="left:1360px;top:240px;width:480px">' +
      '<h2 class="line grafico-fin" style="font-size:42px">ψ → ∞ no polo: a Mercator não representa os polos</h2></div>'));
    this.fin = kit.stage.querySelector('.grafico-fin').style;
    V2.sig(kit);
  },
  render(t) {
    const show = eo(seg(t, 0.4, 1.2));
    for (const a of this.axes) a.style.opacity = show;
    for (const s of this.ticks) s.opacity = show;
    this.hd.opacity = show;
    this.leg.opacity = eo(seg(t, 1.2, 1.8));
    // Reta de referência e curva desenhadas progressivamente
    const fr = 85 * eio(seg(t, 1.4, 3.4));
    this.ref.setAttribute('d', 'M' + X(0) + ' ' + Y(0) + 'L' + X(fr) + ' ' + Y(fr));
    const fc = 85 * seg(t, 2.0, 7.0), n = Math.floor(fc / this.step);
    let d = 'M' + X(0) + ' ' + Y(0);
    for (let i = 1; i <= n; i++) d += 'L' + X(i * this.step).toFixed(1) + ' ' + Y(this.psi[i]).toFixed(1);
    if (fc > n * this.step) d += 'L' + X(fc).toFixed(1) + ' ' + Y(V2.psi(fc)).toFixed(1);
    this.curve.setAttribute('d', d);
    const pv = eo(seg(t, 7.4, 8.0));
    this.dv.style.opacity = pv; this.lv.style.opacity = pv; this.tv.opacity = pv;
    const p85 = eo(seg(t, 9.4, 10.0));
    this.d85.style.opacity = p85; this.t85.opacity = p85;
    const pa = eo(seg(t, 11.2, 11.9));
    this.arr.style.opacity = pa;
    this.arr.style.strokeDasharray = '400';
    this.arr.style.strokeDashoffset = String(400 * (1 - pa));
    this.fin.opacity = eo(seg(t, 11.6, 12.3));
  },
});
