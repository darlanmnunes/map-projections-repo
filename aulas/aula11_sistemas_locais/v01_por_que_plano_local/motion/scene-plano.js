// Cena 3: o plano topográfico é tangente em O e elevado à altitude média (slides 19 e 20): F_L e as constantes 150 000 / 250 000.
const { seg, eo, eio, TextFx } = kit;
kit.scene('plano', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const D = kit.json('v1-dados.json');
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">O plano topográfico local</h2>').querySelector('h2');
    const C = [640, 4100], R = 3200, yE = C[1] - R, yL = 560;          // centro, raio (esquema), topo do elipsoide, plano em hL
    const ang = 9.5, D2 = Math.PI / 180;
    const ext = q => [C[0] + 3000 * Math.sin(q * D2), C[1] - 3000 * Math.cos(q * D2)];
    const raio = q => { const a = [C[0] + (R - 60) * Math.sin(q * D2), C[1] - (R - 60) * Math.cos(q * D2)], b = [C[0] + (R + 560) * Math.sin(q * D2), C[1] - (R + 560) * Math.cos(q * D2)]; return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); };
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="p-ver" d="' + raio(-7) + raio(7) + '" style="stroke:var(--grid);stroke-width:2;stroke-dasharray:6 8"/>' +
      '<path class="p-eli" d="' + A11V1.arcoC(C[0], C[1], R, -ang, ang) + '" style="fill:none;stroke:var(--elip);stroke-width:5"/>' +
      '<path class="p-ter" d="' + A11V1.terreno(150, 1130, 600, 26, 0.6) + '" style="fill:none;stroke:var(--terreno);stroke-width:4"/>' +
      '<path class="p-tg" d="M170 ' + yE + 'H1110" style="stroke:var(--plano);stroke-width:3;stroke-dasharray:12 9"/>' +
      '<g class="p-pl"><path d="M170 ' + yE + 'H1110" style="stroke:var(--plano);stroke-width:6"/><circle class="ptdot" cx="640" cy="' + yE + '" r="9"/></g>' +
      '<path class="p-cota" d="' + A11V1.cota(1150, yL, yE) + '" style="fill:none;stroke:var(--main);stroke-width:2.5"/>' +
      '<path class="p-med" d="M330 ' + yL + 'H900" style="stroke:var(--horiz);stroke-width:12;stroke-linecap:round;opacity:.85"/>' +
      '<circle class="ptdot p-oe" cx="640" cy="' + yE + '" r="7" style="fill:var(--elip)"/></svg>');
    kit.stage.append(svg);
    this.s = {}; for (const c of ['ver', 'eli', 'ter', 'tg', 'pl', 'cota', 'med', 'oe']) this.s[c] = svg.querySelector('.p-' + c);
    this.yE = yE; this.yL = yL;
    const L = (h, x, y, st) => A11.lbl(kit, h, x, y, 'font-family:var(--sans);font-size:26px;' + st);
    this.l = {
      eli: L('elipsoide', 160, yE + 40, 'color:var(--elip)'), ter: L('terreno', 160, 520, 'color:var(--terreno)'),
      tg: L('plano tangente em O, no elipsoide', 700, yE + 14, 'color:var(--plano)'),
      pl: L('plano em <i>h</i><sub>L</sub> (altitude média)', 700, yL - 70, 'color:var(--plano);font-weight:700'),
      cota: L('<i>h</i><sub>L</sub> = 700 m', 1170, (yL + yE) / 2 - 16, 'color:var(--main)'),
      med: L('distância no plano = distância medida', 300, yL - 125, 'color:var(--horiz);font-weight:700'),
      O: L('<i>O</i>', 650, yL - 46, 'font-family:var(--serif);font-size:30px;font-style:italic'),
    };
    this.nt = A11.bloco(kit, 110, 1000, 1100, '<p class="note">Esquema fora de escala: curvatura e altitude muito exageradas.</p>');
    // Fator de elevação
    this.eq = A11.bloco(kit, 1270, 190, 600, '<div class="card" style="position:relative;width:560px">' +
      '<p class="eq big" style="margin:0 0 10px"><i>F</i><sub>L</sub> = (<i>R</i><sub>m</sub> + <i>h</i><sub>L</sub>) / <i>R</i><sub>m</sub></p>' +
      '<p class="sub e-v" style="font-size:28px;margin:0 0 8px"><i>h</i><sub>L</sub> = 700 m → <i>F</i><sub>L</sub> = <b>' + A11.num(D.FL, 6) + '</b> (+110 mm/km)</p>' +
      '<p class="sub e-i" style="font-size:28px;margin:0"><i>F</i><sub>L</sub> = 1 / <i>F</i><sub>h</sub>, o inverso do fator de altitude (Aula 10)</p>' +
      '<p class="note e-r" style="margin:10px 0 0"><i>R</i><sub>m</sub> = √(<i>MN</i>) = ' + A11.num(D.Rm, 0) + ' m</p></div>');
    // Planta: origem e constantes
    const gp = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="p-gr">' +
      '<rect x="1300" y="600" width="380" height="330" rx="10" style="fill:color-mix(in srgb, var(--plano) 6%, var(--ground));stroke:color-mix(in srgb, var(--plano) 40%, var(--ground));stroke-width:2"/>' +
      '<path d="M1300 765H1680M1490 600V930" style="stroke:var(--grid);stroke-width:1.5"/>' +
      '<path d="' + A11.arrowTo(1490, 765, 1650, 765, 16, 8) + A11.arrowTo(1490, 765, 1490, 625, 16, 8) + '" style="fill:none;stroke:var(--plano);stroke-width:4"/>' +
      '<circle class="ptdot" cx="1490" cy="765" r="9"/></g></svg>');
    kit.stage.append(gp);
    this.gr = gp.querySelector('.p-gr');
    this.gl = [L('<i>X</i><sub>L</sub> (leste)', 1580, 775, 'color:var(--plano)'), L('<i>Y</i><sub>L</sub> (norte)', 1505, 600, 'color:var(--plano)'),
      L('<i>O</i>: (150 000; 250 000)', 1300, 945, 'color:var(--main);font-weight:700')];
    this.eqc = A11.bloco(kit, 1270, 990, 640, '<p class="eq" style="font-size:30px"><i>X</i><sub>L</sub> = 150 000 + <i>x</i><sub>L</sub>,&ensp;<i>Y</i><sub>L</sub> = 250 000 + <i>y</i><sub>L</sub></p>');
    this.k = { pl: kit.em('c1', 'plano'), tg: kit.em('c1', 'tangente'), el: kit.em('c1', 'elevado'), te: kit.em('c1', 'terreno'),
      dist: kit.em('c2', 'distancia'), fat: kit.em('c2', 'fator'), v: kit.em('c2', '700'), inv: kit.em('c2', 'inverso'),
      ori: kit.em('c3', 'origem'), c150: kit.em('c3', '150'), pos: kit.em('c3', 'positivos') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, s = this.s, l = this.l;
    A11.draw(s.eli, eio(seg(t, 0.4, 1.6))); A11.fade(l.eli, t, 1.0);
    s.ver.style.opacity = eo(seg(t, 1.0, 1.8));
    A11.draw(s.tg, eio(seg(t, k.tg - 0.2, k.tg + 0.8))); s.oe.style.opacity = eo(seg(t, k.tg - 0.2, k.tg + 0.3));
    A11.fade(l.tg, t, k.tg + 0.2, 0.5, k.el + 1.2);
    // o plano sobe do elipsoide até hL
    const u = eio(seg(t, k.el - 0.1, k.el + 1.6));
    s.pl.style.opacity = eo(seg(t, k.el - 0.2, k.el + 0.2));
    s.pl.setAttribute('transform', 'translate(0 ' + ((this.yL - this.yE) * u).toFixed(1) + ')');
    s.cota.style.opacity = eo(seg(t, k.el + 1.2, k.el + 1.8)); A11.fade(l.cota, t, k.el + 1.4);
    A11.fade(l.pl, t, k.el + 1.3); A11.fade(l.O, t, k.el + 1.3);
    A11.draw(s.ter, eio(seg(t, k.te - 0.3, k.te + 0.9))); A11.fade(l.ter, t, k.te);
    A11.draw(s.med, eio(seg(t, k.dist, k.dist + 0.9))); A11.fade(l.med, t, k.dist + 0.4);
    A11.fade(this.nt, t, k.te + 0.5);
    A11.show(this.eq, t, k.fat - 0.3);
    A11.fade(this.eq.querySelector('.e-v'), t, k.v); A11.fade(this.eq.querySelector('.e-r'), t, k.fat + 1.0);
    A11.fade(this.eq.querySelector('.e-i'), t, k.inv);
    this.gr.style.opacity = eo(seg(t, k.ori - 0.2, k.ori + 0.4));
    A11.fade(this.gl[0], t, k.ori + 0.2); A11.fade(this.gl[1], t, k.ori + 0.2); A11.fade(this.gl[2], t, k.c150);
    A11.show(this.eqc, t, k.pos - 0.6);
  },
});
