// Cena 1 (0 a 18 s): o fuso 23 no plano da TM, com origem no cruzamento do Equador com o MC
const { seg, eo, eio, lerp, TextFx } = kit;
const { X, Y, P } = A9V2;
kit.scene('fuso', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V2.plot(kit, 'fuso');
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px">' +
      '<h2 class="line fuso-hd">Cada fuso tem o seu próprio plano</h2></div>'));
    this.hd = kit.stage.querySelector('.fuso-hd');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:110px;top:' + top + 'px;width:640px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t1 = p(230, '<p class="sub">Fuso 23, de −48° a −42°, desenhado em <i>x</i> e <i>y</i> da Transversa de Mercator, de 80°&nbsp;S a 84°&nbsp;N</p>');
    this.t2 = p(400, '<p class="sub"><b>Origem</b>: cruzamento do Equador com o meridiano central (MC)</p>');
    this.t3 = p(530, '<p class="sub"><i>x</i> para leste e <i>y</i> para norte. A oeste do MC, <i>x</i>&nbsp;&lt;&nbsp;0; ao sul do Equador, <i>y</i>&nbsp;&lt;&nbsp;0</p>');
    this.t4 = p(700, '<p class="sub">No Equador, o fuso vai de <i>x</i> = −334 km a <i>x</i>&nbsp;=&nbsp;+334&nbsp;km</p>');
    const lbl = (html, x, y, color) => { const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;font-size:28px' + (color ? ';color:' + color : '') + '">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.o = kit.h('<svg class="art" viewBox="0 0 1920 1080"><circle class="orig" r="10" cx="' + X(0) + '" cy="' + Y(0) + '"/></svg>');
    kit.stage.append(this.o);
    this.lO = lbl('O', X(0) + 12, Y(0) + 4, 'var(--accent)');
    this.lMC = lbl('MC', X(0) - 26, Y(P.y1) - 40, 'var(--main)');
    this.lW = lbl('<i>x</i> &lt; 0', X(-420), Y(5600));
    this.lS = lbl('<i>y</i> &lt; 0', X(250), Y(-8200));
    this.lE1 = lbl('−334 km', X(-334) + 10, Y(0) + 8, 'var(--accent)');
    this.lE2 = lbl('+334 km', X(334) - 112, Y(0) + 8, 'var(--accent)');
  },
  render(t) {
    const r = this.r;
    TextFx.fadeFromRight(this.hd, t, 0.2);
    const ax = eo(seg(t, 0.8, 1.6));
    r.ax.opacity = ax; A9V2.show(r.tx, ax); A9V2.show(r.ty, ax); A9V2.show(r.tE, 0); A9V2.show(r.tN, 0);
    A9V2.paintPlot(r, eio(seg(t, 1.6, 4.4)));
    r.fz.opacity = eo(seg(t, 3.6, 4.6)); r.gr.opacity = eo(seg(t, 3.8, 4.8)); A9V2.show(r.lat, eo(seg(t, 4.2, 5.0)));
    r.note.style.opacity = eo(seg(t, 4.6, 5.2));
    const o = eo(seg(t, 5.6, 6.2)); r.a0.opacity = o; this.o.style.opacity = o; this.lO.opacity = o; this.lMC.opacity = o;
    r.qw.opacity = eo(seg(t, 8.6, 9.2)); this.lW.opacity = r.qw.opacity;
    r.qs.opacity = eo(seg(t, 10.2, 10.8)); this.lS.opacity = r.qs.opacity;
    const e = eo(seg(t, 12.8, 13.4)); r.eq.opacity = e; this.lE1.opacity = e; this.lE2.opacity = e;
    for (const [s, a] of [[this.t1, 1.4], [this.t2, 5.6], [this.t3, 8.6], [this.t4, 12.8]]) {
      const k = eo(seg(t, a, a + 0.6)); s.opacity = k; s.transform = 'translateX(' + lerp(26, 0, k) + 'px)';
    }
  },
});
