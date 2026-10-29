// Cena 2 (22 a 44 s): distorção linear (ppm = mm/km) contra a distância ao MC, no paralelo de Viçosa.
// UTM de −400 a +806; RTM e LTM, a mesma parábola rasa (mínimo −5). O zoom mostra que o LTM é
// o trecho central do RTM: mesmo k0, faixa cortada em ±52 km em vez de ±104 km.
const { seg, eo, eio, lerp, TextFx } = kit;
const P = { x0: 210, x1: 1230, y0: 900, y1: 190 };
const VA = { a: -340, b: 340, lo: -450, hi: 860 };       // vista inteira
const VB = { a: -118, b: 118, lo: -12, hi: 140 };        // zoom em RTM e LTM
const ZOOM = [9.4, 12.6];
const VIC = { UTM: [222.12, 210], RTM: [13.886, -3], LTM: [-38.19, 13] };
kit.scene('parabolas', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1200px"><h2 class="line">Distorção ao longo do paralelo de Viçosa</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    this.cv = kit.json('v5-dados.json').curvas;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="pb-clip"><rect x="' + P.x0 + '" y="' + P.y1 +
      '" width="' + (P.x1 - P.x0) + '" height="' + (P.y0 - P.y1) + '"/></clipPath></defs>' +
      '<g class="pb-ax"><g class="pb-grid"></g><rect class="axisbox" x="' + P.x0 + '" y="' + P.y1 + '" width="' + (P.x1 - P.x0) + '" height="' + (P.y0 - P.y1) + '"/></g>' +
      '<g clip-path="url(#pb-clip)"><path class="one pb-zero"/><path class="c-utm pb-utm"/><path class="c-rtm pb-rtm"/><path class="c-ltm pb-ltm"/>' +
      '<circle class="dot pb-vu" r="10"/><circle class="dot pb-vr" r="10" style="stroke:var(--second)"/><circle class="dot pb-vl" r="10"/></g></svg>');
    kit.stage.append(svg);
    const q = c => svg.querySelector('.pb-' + c);
    this.ax = q('ax').style; this.grid = q('grid'); this.zero = q('zero');
    this.p = { UTM: q('utm'), RTM: q('rtm'), LTM: q('ltm') };
    this.dots = { UTM: q('vu'), RTM: q('vr'), LTM: q('vl') };
    const lab = (html, color) => { const e = kit.h('<div class="lbl" style="font-size:27px' + (color ? ';color:' + color : '') + '">' + html + '</div>'); kit.stage.append(e); return e; };
    this.axx = lab('distância ao MC (km)', 'color-mix(in srgb, var(--main) 75%, var(--ground))');
    this.axy = lab('ppm (mm/km)', 'color-mix(in srgb, var(--main) 75%, var(--ground))');
    Object.assign(this.axx.style, { left: (P.x0 + P.x1) / 2 - 120 + 'px', top: P.y0 + 44 + 'px' });
    Object.assign(this.axy.style, { left: P.x0 - 10 + 'px', top: P.y1 - 46 + 'px' });
    this.lU = lab('UTM: −400 no MC, +806 na borda do fuso', 'var(--main)');
    this.lV = lab('Viçosa: +210', 'var(--main)');
    this.lR = lab('RTM: até +129 em ±104 km', 'var(--second)');
    this.lL = lab('LTM: até +28 em ±52 km', 'var(--accent)');
    this.lVr = lab('−3', 'var(--second)');
    this.lVl = lab('+13', 'var(--accent)');
    // Painel da direita
    const box = (top, html) => { const e = kit.h('<div class="words" style="left:1320px;top:' + top + 'px;width:540px">' + html + '</div>'); kit.stage.append(e); return e; };
    this.leg = box(190, '<p class="sub"><span class="key" style="color:var(--main)"></span>UTM, <i>k</i><sub>0</sub> = 0,9996</p>' +
      '<p class="sub"><span class="key" style="color:var(--second);border-top-style:dashed"></span>RTM, <i>k</i><sub>0</sub> = 0,999995</p>' +
      '<p class="sub"><span class="key" style="color:var(--accent)"></span>LTM, <i>k</i><sub>0</sub> = 0,999995</p>');
    this.legU = this.leg.children[0].style; this.legR = this.leg.children[1].style; this.legL = this.leg.children[2].style;
    this.b1 = box(420, '<p class="sub">No MC: 1/2' + A9V5.NB + '500 no UTM e 1/200' + A9V5.NB + '000 no RTM e no LTM</p>');
    this.b2 = box(560, '<p class="sub">O LTM é o trecho central do RTM: mesma parábola, cortada em ±52 km em vez de ±104 km</p>');
    this.b3 = box(740, '<p class="ttl">Viçosa: +210 mm/km no UTM, −3 no RTM, +13 no LTM</p>');
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, 0.2);
    const u = eio(seg(t, ZOOM[0], ZOOM[1]));
    // Interpolação geométrica das escalas (o zoom parece uniforme)
    const g = (A, B) => A * Math.pow(B / A, u);
    const half = g(VA.b, VB.b), span = g(VA.hi - VA.lo, VB.hi - VB.lo);
    const lo = lerp(VA.lo / (VA.hi - VA.lo), VB.lo / (VB.hi - VB.lo), u) * span;   // posição relativa do zero
    const V = { a: -half, b: half, lo, hi: lo + span };
    const X = x => P.x0 + (x - V.a) / (V.b - V.a) * (P.x1 - P.x0);
    const Y = y => P.y0 - (y - V.lo) / (V.hi - V.lo) * (P.y0 - P.y1);
    // Grade e marcas dos eixos (recalculadas a cada quadro)
    const sx = A9V5.passo(V.b - V.a, 6), sy = A9V5.passo(V.hi - V.lo, 7);
    let gd = '', tx = '';
    for (let x = Math.ceil(V.a / sx) * sx; x <= V.b; x += sx) {
      gd += 'M' + X(x).toFixed(1) + ' ' + P.y0 + 'V' + P.y1;
      tx += '<text class="axt" text-anchor="middle" x="' + X(x).toFixed(1) + '" y="' + (P.y0 + 32) + '">' + A9V5.num(x) + '</text>';
    }
    for (let y = Math.ceil(V.lo / sy) * sy; y <= V.hi; y += sy) {
      gd += 'M' + P.x0 + ' ' + Y(y).toFixed(1) + 'H' + P.x1;
      tx += '<text class="axt" text-anchor="end" x="' + (P.x0 - 12) + '" y="' + (Y(y) + 8).toFixed(1) + '">' + A9V5.num(y) + '</text>';
    }
    this.grid.innerHTML = '<path class="gridl" d="' + gd + '"/>' + tx;
    this.zero.setAttribute('d', 'M' + P.x0 + ' ' + Y(0).toFixed(1) + 'H' + P.x1);
    const ga = eo(seg(t, 0.8, 1.4));
    this.ax.opacity = ga; this.axx.style.opacity = ga; this.axy.style.opacity = ga;
    // Curvas desenhadas do MC para as bordas
    const draw = (nome, a, b) => {
      const c = this.cv[nome], n = c.length, mid = (n - 1) / 2, r = Math.round(mid * eio(seg(t, a, b)));
      let d = '';
      for (let i = mid - r; i <= mid + r; i++) d += (i > mid - r ? 'L' : 'M') + X(c[i][0]).toFixed(1) + ' ' + Y(c[i][1]).toFixed(1);
      this.p[nome].setAttribute('d', t > a ? d : '');
      return c;
    };
    const cu = draw('UTM', 1.5, 4.2), cr = draw('RTM', 5.0, 6.6), cl = draw('LTM', 6.4, 7.6);
    this.p.UTM.style.opacity = lerp(1, 0.35, u);
    this.legU.opacity = eo(seg(t, 1.5, 2.1)); this.legR.opacity = eo(seg(t, 5.0, 5.6)); this.legL.opacity = eo(seg(t, 6.4, 7.0));
    const put = (el, x, y, dx, dy, o) => { Object.assign(el.style, { left: (X(x) + dx) + 'px', top: (Y(y) + dy) + 'px', opacity: o }); };
    const end = c => c[c.length - 1];
    const sai = 1 - seg(t, ZOOM[0], ZOOM[0] + 0.5);
    put(this.lU, end(cu)[0], end(cu)[1], -560, -10, eo(seg(t, 4.0, 4.6)) * sai);
    // Pontos de Viçosa
    const dot = (nome, a) => {
      const [x, y] = VIC[nome], o = eo(seg(t, a, a + 0.5));
      this.dots[nome].setAttribute('cx', X(x).toFixed(1)); this.dots[nome].setAttribute('cy', Y(y).toFixed(1));
      this.dots[nome].style.opacity = o;
      return o;
    };
    const vu = dot('UTM', 4.6);
    put(this.lV, VIC.UTM[0], VIC.UTM[1], 18, 8, vu * sai);
    put(this.lR, end(cr)[0], end(cr)[1], -370, -12, eo(seg(t, 13.0, 13.6)));
    put(this.lL, -36, 50, 0, 0, eo(seg(t, 13.4, 14.0)));
    const vr = dot('RTM', 15.4), vl = dot('LTM', 15.8);
    put(this.lVr, VIC.RTM[0], VIC.RTM[1], 6, 12, vr);
    put(this.lVl, VIC.LTM[0], VIC.LTM[1], -66, 4, vl);
    A9V5.fade(this.leg, t, 1.4);
    A9V5.fade(this.b1, t, 7.8, null, 26);
    A9V5.fade(this.b2, t, 13.2, null, 26);
    A9V5.fade(this.b3, t, 16.4, null, 26);
    kit.stage.style.opacity = 1 - seg(t, 21.4, 22);
  },
});
