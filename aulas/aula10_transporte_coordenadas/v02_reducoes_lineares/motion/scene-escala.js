// Cena 2: do elipsoide à grade. Perfil de m ao longo de E′ em Viçosa; a linha de 5 km e a regra de Simpson
const { seg, eo, eio, TextFx } = kit;
kit.scene('escala', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v2-dados.json'), f1 = A10.f1, S = d.simpson;
    // Gráfico principal: E′ (km) × (m − 1) (mm/km)
    const G = { x0: 190, x1: 1050, y0: 230, y1: 860 };
    const X = A10V2.lin(-330, 330, G.x0, G.x1), Y = A10V2.lin(-450, 1000, G.y1, G.y0);
    let tk = '', grid = '';
    for (const e of [-300, -200, -100, 0, 100, 200, 300]) { grid += 'M' + f1(X(e)) + ' ' + G.y0 + 'V' + G.y1; A10.lbl(kit, (e < 0 ? '−' : '') + Math.abs(e), X(e) - 22, G.y1 + 10, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'); }
    for (const m of [-400, 0, 400, 800]) { grid += 'M' + G.x0 + ' ' + f1(Y(m)) + 'H' + G.x1; A10.lbl(kit, (m > 0 ? '+' : m < 0 ? '−' : '') + Math.abs(m), G.x0 - 70, Y(m) - 16, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground))'); }
    const curva = A10.lineD(d.perfil.map(([e, m]) => [X(e), Y(m)]));
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="gridl" d="' + grid + '"/>' +
      '<path class="v2ax" d="M' + G.x0 + ' ' + G.y0 + 'V' + G.y1 + 'H' + G.x1 + '"/>' +
      '<path class="mc" d="M' + f1(X(0)) + ' ' + G.y0 + 'V' + G.y1 + '" style="opacity:.8"/>' +
      '<path class="ref0" d="M' + G.x0 + ' ' + f1(Y(0)) + 'H' + G.x1 + '" style="stroke-width:2.5"/>' +
      '<path class="curve es-c" d="' + curva + '"/>' +
      '<circle class="ptdot es-mc" r="9" cx="' + f1(X(0)) + '" cy="' + f1(Y(-400)) + '"/>' +
      '<circle class="dot es-s1" r="8" cx="' + f1(X(-d.sec)) + '" cy="' + f1(Y(0)) + '"/><circle class="dot es-s2" r="8" cx="' + f1(X(d.sec)) + '" cy="' + f1(Y(0)) + '"/>' +
      '<circle class="pole es-v" r="9" cx="' + f1(X(d.vic)) + '" cy="' + f1(Y((S.m1 - 1) * 1e6)) + '"/>' +
      '<rect class="es-zr" x="' + f1(X(d.vic) - 14) + '" y="' + f1(Y(330)) + '" width="40" height="' + f1(Y(130) - Y(330)) + '" style="fill:none;stroke:var(--accent);stroke-width:2"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['c', 'mc', 's1', 's2', 'v', 'zr']) this.e[c] = svg.querySelector('.es-' + c);
    A10.lbl(kit, '<i>E</i>′ = <i>E</i> − 500 000 (km)', G.x1 - 330, G.y1 + 44, 'font-size:26px');
    A10.lbl(kit, '<i>m</i> − 1 (mm/km)', G.x0 - 70, G.y0 - 46, 'font-size:26px');
    const L = (h, x, y, st) => A10.lbl(kit, h, x, y, 'font-size:26px;' + (st || ''));
    this.l = {
      mc: L('MC: <i>m</i> = 0,9996', X(0) + 14, Y(-400) - 6, 'color:var(--accent)'),
      sec: L('<i>m</i> = 1 nas secâncias (±' + Math.round(d.sec) + ' km)', X(-d.sec) + 46, Y(0) + 30),
      bor: L('borda: <i>m</i> ≈ 1,00095', X(330) - 250, Y(946) - 6),
      v: L('Viçosa', X(d.vic) - 112, Y((S.m1 - 1) * 1e6) - 14, 'font-family:var(--sans);font-weight:700;font-size:24px'),
    };
    // Zoom: a linha de 5 km para leste de Viçosa
    const Z = { x0: 1220, x1: 1800, y0: 220, y1: 520 };
    const zx = A10V2.lin(S.E1 - 0.6, S.E2 + 0.6, Z.x0, Z.x1), zy = A10V2.lin(200, 245, Z.y1, Z.y0);
    const pz = d.perfil.filter(([e]) => e >= S.E1 - 6 && e <= S.E2 + 6);
    const pts = [[S.E1, S.m1], [(S.E1 + S.E2) / 2, S.mm], [S.E2, S.m2]].map(([e, m]) => [zx(e), zy((m - 1) * 1e6)]);
    // curva local: parábola pelos três pontos (exata o bastante para 5 km)
    const loc = []; for (let i = 0; i <= 40; i++) { const e = S.E1 - 0.6 + (S.E2 - S.E1 + 1.2) * i / 40, u = (e - S.E1) / (S.E2 - S.E1);
      const m = (S.m1 - 1) * 1e6 * (1 - u) * (1 - 2 * u) + 4 * (S.mm - 1) * 1e6 * u * (1 - u) + (S.m2 - 1) * 1e6 * u * (2 * u - 1); loc.push([zx(e), zy(m)]); }
    const zs = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="es-zg">' +
      '<rect x="' + Z.x0 + '" y="' + Z.y0 + '" width="' + (Z.x1 - Z.x0) + '" height="' + (Z.y1 - Z.y0) + '" style="fill:var(--ground);stroke:var(--accent);stroke-width:2"/>' +
      '<path class="curve" d="' + A10.lineD(loc) + '"/>' +
      '<path d="M' + f1(zx(S.E1)) + ' ' + (Z.y1 + 30) + 'H' + f1(zx(S.E2)) + '" style="stroke:var(--accent);stroke-width:6;stroke-linecap:round"/>' +
      pts.map((p, i) => '<path class="gridl" d="M' + f1(p[0]) + ' ' + f1(p[1]) + 'V' + (Z.y1 + 30) + '" style="stroke-dasharray:6 5;stroke:var(--main)"/><circle class="pole es-p' + i + '" r="9" cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '"/>').join('') +
      '</g></svg>');
    kit.stage.append(zs);
    this.zg = zs.querySelector('.es-zg'); this.zp = [0, 1, 2].map(i => zs.querySelector('.es-p' + i));
    const mm = m => A10.num((m - 1) * 1e6, 0, true);
    this.zl = [
      A10.lbl(kit, '<i>m</i><sub>1</sub> ' + mm(S.m1), pts[0][0] + 14, pts[0][1] + 6, 'font-size:25px'),
      A10.lbl(kit, '<i>m</i><sub>m</sub> ' + mm(S.mm), pts[1][0] + 14, pts[1][1] + 6, 'font-size:25px'),
      A10.lbl(kit, '<i>m</i><sub>2</sub> ' + mm(S.m2), pts[2][0] - 130, pts[2][1] - 44, 'font-size:25px'),
      A10.lbl(kit, '5 km para leste de Viçosa', Z.x0 + 150, Z.y1 + 42, 'font-family:var(--sans);font-size:22px;color:var(--accent)'),
      A10.lbl(kit, 'mm/km', Z.x0 + 10, Z.y0 + 8, 'font-family:var(--sans);font-size:20px;color:color-mix(in srgb, var(--main) 60%, var(--ground))'),
    ];
    this.pesos = pts.map((p, i) => A10.lbl(kit, '×' + [1, 4, 1][i], p[0] - 22, Z.y1 + 70, 'font-size:30px;font-weight:700;color:var(--accent)'));
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Do elipsoide à grade: fator de escala da linha</h2>').querySelector('h2');
    const B = (y, html) => A10.bloco(kit, 1170, y, 700, html);
    this.t = [
      [B(650, '<p class="eq"><span class="frac"><span>1</span><span><i>m</i><sub>12</sub></span></span> = <span class="frac"><span>1</span><span>6</span></span> ( <span class="frac"><span>1</span><span><i>m</i><sub>1</sub></span></span> + <span class="frac"><span>4</span><span><i>m</i><sub>m</sub></span></span> + <span class="frac"><span>1</span><span><i>m</i><sub>2</sub></span></span> )&ensp;(19)</p>'), kit.em('b3', 'simpson')],
      [B(790, '<p class="sub sm">Só <i>m</i><sub>1</sub>: erra <b style="color:var(--tissot)">' + A10.num(Math.abs(S.err_m1), 0) + ' mm/km</b>&emsp;Simpson: <b style="color:var(--corda)">&lt; 0,002 mm/km</b></p>'), kit.em('b4', 'erra')],
      [B(870, '<p class="eq" style="font-size:27px"><i>m</i><sub>12</sub> ≈ <i>k</i><sub>0</sub> [ 1 + (<i>E</i>′<sub>1</sub>² + <i>E</i>′<sub>1</sub><i>E</i>′<sub>2</sub> + <i>E</i>′<sub>2</sub>²) / (6 <i>k</i><sub>0</sub>² <i>M N</i>) ]&ensp;(20)</p>'), kit.em('b4', 'simpson')],
    ];
    this.k = { c: kit.em('b1', 'aula'), mc: kit.em('b1', '0,9996'), bor: kit.em('b1', 'bordas'), p: kit.em('b2', 'ponto'), lin: kit.em('b2', 'linha'),
      ini: kit.em('b3', 'inicio'), mei: kit.em('b3', 'meio'), fim: kit.em('b3', 'fim'), pes: kit.em('b3', 'pesos') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k;
    A10.draw(e.c, eio(seg(t, k.c - 0.3, k.c + 1.6)));
    const m = eo(seg(t, k.mc, k.mc + 0.5)); e.mc.style.opacity = m; this.l.mc.style.opacity = m;
    const s = eo(seg(t, k.c + 1.4, k.c + 2.0)); e.s1.style.opacity = e.s2.style.opacity = s; this.l.sec.style.opacity = s;
    A10.fade(this.l.bor, t, k.bor);
    const v = eo(seg(t, k.p, k.p + 0.5)); e.v.style.opacity = v; this.l.v.style.opacity = v;
    e.zr.style.opacity = eo(seg(t, k.lin, k.lin + 0.4));
    this.zg.style.opacity = eo(seg(t, k.lin + 0.3, k.lin + 1.0));
    [this.zl[3], this.zl[4]].forEach(l => A10.fade(l, t, k.lin + 0.6));
    [k.ini, k.mei, k.fim].forEach((a, i) => { const q = eo(seg(t, a, a + 0.4)); this.zp[i].style.opacity = q; this.zl[i].style.opacity = q; });
    this.pesos.forEach((p, i) => A10.fade(p, t, k.pes + 0.35 * i));
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
