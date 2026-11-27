// Cena 2 (18 a 38 s): a origem desce 500 km para oeste e 10 000 km para o sul; x, y viram E, N
const { seg, eo, eio, lerp, TextFx } = kit;
const { X, Y, P, VIC, fmt } = A9V2;
kit.scene('falsa', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V2.plot(kit, 'falsa');
    // Estado herdado da cena 1 (sai de cena)
    this.old = ['<div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line">Cada fuso tem o seu próprio plano</h2></div>',
      '<div class="words" style="left:110px;top:230px;width:640px"><p class="sub">Fuso 23, de −48° a −42°, desenhado em <i>x</i> e <i>y</i> da Transversa de Mercator, de 80°&nbsp;S a 84°&nbsp;N</p></div>',
      '<div class="words" style="left:110px;top:400px;width:640px"><p class="sub"><b>Origem</b>: cruzamento do Equador com o meridiano central (MC)</p></div>',
      '<div class="words" style="left:110px;top:530px;width:640px"><p class="sub"><i>x</i> para leste e <i>y</i> para norte. A oeste do MC, <i>x</i>&nbsp;&lt;&nbsp;0; ao sul do Equador, <i>y</i>&nbsp;&lt;&nbsp;0</p></div>',
      '<div class="words" style="left:110px;top:700px;width:640px"><p class="sub">No Equador, o fuso vai de <i>x</i> = −334 km a <i>x</i>&nbsp;=&nbsp;+334&nbsp;km</p></div>']
      .map(h => { const e = kit.h(h); kit.stage.append(e); return e.style; });
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px">' +
      '<h2 class="line falsa-hd">Falso leste e falso norte</h2></div>'));
    this.hd = kit.stage.querySelector('.falsa-hd');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:110px;top:' + top + 'px;width:660px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t1 = p(200, '<p class="eq"><i>E</i> = 500&nbsp;000 + 0,9996 <i>x</i></p>');
    this.t2 = p(262, '<p class="sub">Nenhum <i>E</i> é negativo. Se <i>E</i> &gt; 500&nbsp;000 m, o ponto está a leste do MC</p>');
    this.t3 = p(420, '<p class="eq"><i>N</i> = 10&nbsp;000&nbsp;000 + 0,9996 <i>y</i>&emsp;<span style="font-family:var(--sans);font-size:26px">(Sul)</span></p>' +
      '<p class="eq"><i>N</i> = 0,9996 <i>y</i>&emsp;<span style="font-family:var(--sans);font-size:26px">(Norte)</span></p>');
    this.t4 = p(560, '<p class="sub">No Hemisfério Sul, <i>N</i> diminui para o sul: ≈&nbsp;1&nbsp;118 km em 80°&nbsp;S</p>');
    this.t5 = kit.h('<div class="words box2" style="left:110px;top:720px;width:640px"><p class="ttl" style="font-size:30px">Viçosa</p>' +
      '<p class="eq num falsa-E"></p><p class="eq num falsa-N"></p></div>');
    kit.stage.append(this.t5);
    this.vE = this.t5.querySelector('.falsa-E'); this.vN = this.t5.querySelector('.falsa-N');
    // Origem verdadeira (fixa), falsa origem (móvel), setas e Viçosa
    const ya = Y(1300), xa = X(P.x0);
    this.svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<circle class="orig" r="8" cx="' + X(0) + '" cy="' + Y(0) + '" style="opacity:.5"/>' +
      '<path class="arrow falsa-ah"/><path class="arrow falsa-av"/>' +
      '<path class="lead falsa-lv" style="stroke-dasharray:6 6"/>' +
      '<circle class="orig falsa-o" r="11"/><circle class="dot falsa-v" r="10"/></svg>');
    kit.stage.append(this.svg);
    const q = c => this.svg.querySelector('.falsa-' + c);
    this.ah = q('ah'); this.av = q('av'); this.lv = q('lv'); this.fo = q('o'); this.dv = q('v');
    this.ya = ya; this.xa = xa;
    const lbl = (html, x, y, color, size) => { const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;font-size:' + (size || 28) + 'px' + (color ? ';color:' + color : '') + '">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.lO = lbl('O', X(0) + 12, Y(0) + 4, 'var(--accent)');
    this.lE1 = lbl('−334 km', X(-334) + 10, Y(0) + 8, 'var(--accent)');
    this.lE2 = lbl('+334 km', X(334) - 112, Y(0) + 8, 'var(--accent)');
    this.lE1n = lbl('≈ 166 km', X(-334) + 10, Y(0) + 8, 'var(--accent)');
    this.lE2n = lbl('≈ 834 km', X(334) - 122, Y(0) + 8, 'var(--accent)');
    this.lH = lbl('500&nbsp;000 m', X(-250) - 80, ya - 44, 'var(--accent)');
    this.lV = lbl('10&nbsp;000&nbsp;000 m', xa + 12, Y(-6600), 'var(--accent)');
    this.lF = lbl('falsa origem (Sul)', xa + 22, Y(P.y0) - 46, 'var(--accent)', 26);
    this.l80 = lbl('80° S: <i>N</i> ≈ 1&nbsp;118 km', X(P.x1) + 16, Y(-8885) - 16, 'var(--main)', 26);
    this.l84 = lbl('84° N: <i>N</i> ≈ 9&nbsp;328 km', X(P.x1) + 16, Y(9332) - 16, 'var(--main)', 26);
    this.lVic = lbl('Viçosa', X(VIC.x) - 96, Y(VIC.y) - 46);
  },
  render(t) {
    const r = this.r;
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    TextFx.fadeFromRight(this.hd, t, 0.8);
    r.ax.opacity = 1; r.fz.opacity = 1; r.gr.opacity = 1; r.a0.opacity = 1; r.note.style.opacity = 1;
    A9V2.show(r.lat, 1); A9V2.paintPlot(r, 1);
    r.qw.opacity = 1 - seg(t, 0, 0.6); r.qs.opacity = r.qw.opacity;
    // Falso leste: a origem anda 500 km para oeste; os rótulos x viram E
    const h = eio(seg(t, 1.8, 3.4)), v = eio(seg(t, 7.2, 9.0));
    const ox = X(lerp(0, P.x0, h)), oy = Y(lerp(0, P.y0, v));
    this.fo.setAttribute('cx', ox); this.fo.setAttribute('cy', oy);
    this.fo.style.opacity = eo(seg(t, 1.4, 1.8));
    this.ah.setAttribute('d', 'M' + X(0) + ' ' + this.ya + 'H' + X(lerp(0, P.x0, h)));
    this.ah.style.opacity = eo(seg(t, 1.8, 2.2)) * (1 - seg(t, 11.6, 12.2));
    this.lH.opacity = eo(seg(t, 3.2, 3.8)) * (1 - seg(t, 11.6, 12.2));
    const xe = eo(seg(t, 3.6, 4.6));
    A9V2.show(r.tx, 1 - xe); A9V2.show(r.tE, xe);
    this.lE1.opacity = 1 - xe; this.lE2.opacity = 1 - xe; this.lE1n.opacity = xe; this.lE2n.opacity = xe;
    r.eq.opacity = 1;
    this.lO.opacity = 1;
    // Falso norte: a origem desce 10 000 km (Hemisfério Sul); os rótulos y viram N
    this.av.setAttribute('d', 'M' + this.xa + ' ' + Y(0) + 'V' + oy);
    this.av.style.opacity = eo(seg(t, 7.2, 7.6)) * (1 - seg(t, 11.6, 12.2));
    this.lV.opacity = eo(seg(t, 8.6, 9.2)) * (1 - seg(t, 11.6, 12.2));
    this.lF.opacity = eo(seg(t, 9.2, 9.8));
    const yn = eo(seg(t, 9.0, 10.0));
    A9V2.show(r.ty, 1 - yn); A9V2.show(r.tN, yn);
    this.l80.opacity = eo(seg(t, 10.4, 11.0)); this.l84.opacity = this.l80.opacity;
    for (const [s, a] of [[this.t1, 1.8], [this.t2, 4.8], [this.t3, 7.2], [this.t4, 10.4]]) {
      const k = eo(seg(t, a, a + 0.6)); s.opacity = k; s.transform = 'translateX(' + lerp(26, 0, k) + 'px)';
    }
    // Viçosa: o ponto sai da origem verdadeira e os valores de E e N acompanham
    const u = eio(seg(t, 12.6, 15.4));
    const px = X(lerp(0, VIC.x, u)), py = Y(lerp(0, VIC.y, u));
    this.dv.setAttribute('cx', px); this.dv.setAttribute('cy', py);
    this.dv.style.opacity = eo(seg(t, 12.2, 12.6));
    this.lv.setAttribute('d', 'M' + px + ' ' + py + 'V' + Y(P.y0) + 'M' + px + ' ' + py + 'H' + this.xa);
    this.lv.style.opacity = eo(seg(t, 12.2, 12.6));
    this.lVic.opacity = eo(seg(t, 15.2, 15.8));
    const k = eo(seg(t, 12.2, 12.8)); this.t5.style.opacity = k; this.t5.style.transform = 'translateX(' + lerp(26, 0, k) + 'px)';
    this.vE.innerHTML = '<i>E</i> = ' + fmt(lerp(500000, VIC.E, u), 2) + ' m';
    this.vN.innerHTML = '<i>N</i> = ' + fmt(lerp(10000000, VIC.N, u), 2) + ' m';
  },
});
