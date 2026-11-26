// Cena 4: plano × elipsoide (slides 17 a 19): queda s²/(2Rm), diferença s³/(6Rm²), limites da NBR 13133:2021 e o peso da altitude.
const { seg, eo, eio, TextFx } = kit;
kit.scene('limites', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const D = kit.json('v1-dados.json');
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Até onde vale o plano?</h2>').querySelector('h2');
    // Corte: plano tangente em O e a superfície que cai (curvatura muito exagerada)
    const O = [170, 250], R = 1500;
    this.O = O; this.R = R;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="l-pl" d="M' + O[0] + ' ' + O[1] + 'H1070" style="stroke:var(--plano);stroke-width:5"/>' +
      '<path class="l-ar" d="' + A11V1.arcoC(O[0], O[1] + R, R, 0, 34) + '" style="fill:none;stroke:var(--elip);stroke-width:5"/>' +
      '<path class="l-z" style="stroke:var(--psi);stroke-width:3;fill:none"/>' +
      '<circle class="ptdot l-p" r="9" style="fill:var(--elip)"/><circle class="ptdot" cx="' + O[0] + '" cy="' + O[1] + '" r="9"/></svg>');
    kit.stage.append(svg);
    this.s = { pl: svg.querySelector('.l-pl'), ar: svg.querySelector('.l-ar'), z: svg.querySelector('.l-z'), p: svg.querySelector('.l-p') };
    const L = (h, x, y, st) => A11.lbl(kit, h, x, y, 'font-family:var(--sans);font-size:25px;' + st);
    this.l = { pl: L('plano tangente', 880, 205, 'color:var(--plano)'), ar: L('superfície', 700, 470, 'color:var(--elip)'),
      O: L('<i>O</i>', 150, 200, 'font-family:var(--serif);font-size:30px;font-style:italic'),
      z: L('queda |<i>z</i><sub>L</sub>| ≈ <i>s</i>² / (2<i>R</i><sub>m</sub>)', 0, 0, 'color:var(--psi);font-weight:700') };
    // Tabela
    const lin = D.curv.map(c => '<tr><td class="v">' + A11.num(c.s, c.s % 1 ? 1 : 0) + '</td><td class="v">' + A11.num(c.sd_mm, c.sd_mm < 1 ? 3 : 0) + ' mm</td><td class="v">' + A11.num(c.zl, 2) + ' m</td></tr>').join('');
    this.tb = A11.bloco(kit, 1180, 180, 700, '<table class="tab"><tr><th style="text-transform:none"><i>s</i> (km)</th><th class="c1" style="text-transform:none"><i>s</i> − <i>d</i> ≈ <i>s</i>³/(6<i>R</i><sub>m</sub>²)</th><th class="c2" style="text-transform:none">|<i>z</i><sub>L</sub>|</th></tr>' + lin + '</table>');
    this.rows = [...this.tb.querySelectorAll('tr')].slice(1);
    this.col = i => this.rows.map(r => r.children[i]);
    this.tn = A11.bloco(kit, 1180, 470, 700, '<p class="note">Planimetria cresce com <i>s</i>³; a queda, com <i>s</i>². <i>R</i><sub>m</sub> = ' + A11.num(D.Rm, 0) + ' m.</p>');
    // Faixa de altitude: plano no meio da faixa de 150 m
    const Y0 = 660, Y1 = 900;                      // ponto mais alto e mais baixo (150 m)
    const ym = (Y0 + Y1) / 2;
    const fx = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="l-fx">' +
      '<rect x="150" y="' + Y0 + '" width="920" height="' + (Y1 - Y0) + '" style="fill:color-mix(in srgb, var(--terreno) 10%, var(--ground))"/>' +
      '<path d="M150 ' + Y0 + 'H1070M150 ' + Y1 + 'H1070" style="stroke:var(--terreno);stroke-width:2;stroke-dasharray:8 7"/>' +
      '<path d="M150 ' + (Y0 + 18) + 'C330 ' + (Y0 + 10) + ' 420 ' + (Y1 - 70) + ' 560 ' + (Y1 - 12) + 'S860 ' + (Y0 + 40) + ' 1070 ' + (ym + 20) + '" style="fill:none;stroke:var(--terreno);stroke-width:4"/></g>' +
      '<path class="l-pm" d="M150 ' + ym + 'H1070" style="stroke:var(--plano);stroke-width:5"/>' +
      '<path class="l-c75" d="' + A11V1.cota(1110, Y0, ym) + A11V1.cota(1110, ym, Y1) + '" style="fill:none;stroke:var(--main);stroke-width:2.5"/></svg>');
    kit.stage.append(fx);
    this.f = { fx: fx.querySelector('.l-fx'), pm: fx.querySelector('.l-pm'), c: fx.querySelector('.l-c75') };
    this.fl = [L('150 m entre o ponto mais alto e o mais baixo', 160, Y0 - 40, 'color:var(--terreno)'),
      L('plano na altitude média', 160, ym - 36, 'color:var(--plano);font-weight:700'),
      L('75 m', 1130, (Y0 + ym) / 2 - 15, 'color:var(--main)'), L('75 m', 1130, (ym + Y1) / 2 - 15, 'color:var(--main)')];
    this.res = A11.bloco(kit, 1180, 560, 700, '<div class="card" style="position:relative;width:660px">' +
      '<h3 style="font-size:30px">NBR 13133:2021, Anexos N e P</h3>' +
      '<p class="sub r-d" style="font-size:28px;margin:0 0 8px">diagonal de até <b>35 km</b></p>' +
      '<p class="sub r-h" style="font-size:28px;margin:0 0 16px">menos de <b>150 m</b> de desnível</p>' +
      '<p class="sub r-a" style="font-size:28px;margin:0 0 6px;color:var(--accent)">altitude: 75 m → <b>' + A11.num(D.alt75, 1) + ' mm/km</b></p>' +
      '<p class="note r-b" style="margin:0">plano no ponto mais baixo: 150 m → ' + A11.num(D.alt150, 1) + ' mm/km</p></div>');
    this.k = { cur: kit.em('d1', 'curvatura'), cai: kit.em('d1', 'cai'), qua: kit.em('d1', 'quadrado'), v24: kit.em('d1', '24'),
      pla: kit.em('d2', 'planimetria'), cub: kit.em('d2', 'cubo'), v22: kit.em('d2', '22'),
      nor: kit.em('d3', 'norma'), d35: kit.em('d3', '35'), h150: kit.em('d3', '150'),
      alt: kit.em('d4', 'altitude'), med: kit.em('d4', 'media'), v75: kit.em('d4', '75'), v12: kit.em('d4', '12'), prox: kit.em('d4', 'proximo') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, s = this.s, l = this.l, O = this.O, R = this.R;
    A11.draw(s.pl, eio(seg(t, 0.3, 1.2))); A11.fade(l.pl, t, 0.8); A11.fade(l.O, t, 0.5);
    A11.draw(s.ar, eio(seg(t, k.cur - 0.2, k.cur + 1.0))); A11.fade(l.ar, t, k.cur + 0.6);
    // ponto que se afasta da origem pela superfície
    const u = eio(seg(t, k.cai - 0.2, k.v24)), q = (4 + 21 * u) * Math.PI / 180;
    const px = O[0] + R * Math.sin(q), py = O[1] + R - R * Math.cos(q);
    s.p.setAttribute('cx', px.toFixed(1)); s.p.setAttribute('cy', py.toFixed(1));
    s.p.style.opacity = s.z.style.opacity = eo(seg(t, k.cai - 0.3, k.cai + 0.2));
    s.z.setAttribute('d', A11V1.cota(px, O[1], py, 10, 6));
    l.z.style.left = (px + 16).toFixed(0) + 'px'; l.z.style.top = ((O[1] + py) / 2 - 40).toFixed(0) + 'px';
    A11.fade(l.z, t, k.cai + 0.3);
    A11.show(this.tb, t, k.cai);
    const c1 = this.col(1), c2 = this.col(2);
    c2.forEach(c => c.style.background = (t >= k.qua && t < k.pla) ? 'color-mix(in srgb, var(--psi) 12%, var(--ground))' : '');
    c1.forEach(c => c.style.background = (t >= k.pla && t < k.nor) ? 'color-mix(in srgb, var(--accent) 14%, var(--ground))' : '');
    this.rows.forEach((r, i) => r.classList.toggle('on', i === 2 && ((t >= k.v24 && t < k.qua + 99 && t < k.nor) )));
    A11.fade(this.tn, t, k.cub);
    A11.show(this.res, t, k.nor - 0.3);
    A11.fade(this.res.querySelector('.r-d'), t, k.d35 - 0.2); A11.fade(this.res.querySelector('.r-h'), t, k.h150 - 0.2);
    this.f.fx.style.opacity = eo(seg(t, k.h150 - 0.2, k.h150 + 0.5)); A11.fade(this.fl[0], t, k.h150 + 0.2);
    A11.draw(this.f.pm, eio(seg(t, k.med - 0.2, k.med + 0.8))); A11.fade(this.fl[1], t, k.med + 0.3);
    this.f.c.style.opacity = eo(seg(t, k.v75 - 0.2, k.v75 + 0.4)); A11.fade(this.fl[2], t, k.v75); A11.fade(this.fl[3], t, k.v75);
    A11.fade(this.res.querySelector('.r-a'), t, k.v12 - 0.3); A11.fade(this.res.querySelector('.r-b'), t, k.v12 + 0.8);
  },
});
