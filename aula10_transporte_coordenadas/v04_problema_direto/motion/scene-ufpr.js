// Cena 5: o mesmo roteiro reproduz o exemplo da UFPR (TRANSPUTM): pontos A a D; e a poligonal (3 vira estação, 2 vira ré)
const { seg, eo, eio, lerp, TextFx } = kit;
kit.scene('ufpr', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const u = kit.json('v4-dados.json').ufpr, n3 = A10V4.n3;
    const P = A10V4.planta(302750, 7177750, 580, 600, 0.15);
    const q = p => [P.X(p[0]), P.Y(p[1])];
    const R = q(u.re), S = q(u.est), f1 = A10.f1;
    this.S = S;
    let g = '', tk = [];
    for (let e = 299000; e <= 307000; e += 1000) { const x = P.X(e); if (x > 120 && x < 1040) { g += 'M' + f1(x) + ' 170V1000'; if (e % 2000 === 0) tk.push([e / 1000 + ' km', x - 38, 1006]); } }
    for (let n = 7174000; n <= 7182000; n += 1000) { const y = P.Y(n); if (y > 170 && y < 1000) g += 'M120 ' + f1(y) + 'H1040'; }
    let raios = '', pts = '';
    this.Q = u.pts.map(p => q(p.calc));
    this.Q.forEach(Q => { raios += 'M' + f1(S[0]) + ' ' + f1(S[1]) + 'L' + f1(Q[0]) + ' ' + f1(Q[1]); });
    const N4 = q([304300, 7179600]), A = this.Q[0];
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><path class="gridl" style="stroke-width:1.4" d="' + g + '"/>' +
      '<rect class="frame" x="120" y="170" width="920" height="830" style="stroke-width:1.5"/>' +
      '<path class="sight u-re" d="M' + f1(S[0]) + ' ' + f1(S[1]) + 'L' + f1(R[0]) + ' ' + f1(R[1]) + '" style="stroke-dasharray:14 10;stroke-width:3"/>' +
      '<path class="sight u-raios" d="' + raios + '" style="stroke:var(--accent);stroke-width:3.5"/>' +
      '<path class="sight u-pol" d="M' + f1(A[0]) + ' ' + f1(A[1]) + 'L' + f1(N4[0]) + ' ' + f1(N4[1]) + '" style="stroke:var(--second);stroke-dasharray:12 8"/>' +
      '<path class="sight u-pol2" d="M' + f1(A[0]) + ' ' + f1(A[1]) + 'L' + f1(S[0]) + ' ' + f1(S[1]) + '" style="stroke:var(--second);stroke-dasharray:4 8;stroke-width:5"/>' +
      '<circle class="marco u-r" r="12" cx="' + f1(R[0]) + '" cy="' + f1(R[1]) + '"/><circle class="marco u-s" r="12" cx="' + f1(S[0]) + '" cy="' + f1(S[1]) + '"/>' +
      this.Q.map((Q, i) => '<circle class="novo u-p' + i + '" r="11" cx="' + f1(Q[0]) + '" cy="' + f1(Q[1]) + '"/>').join('') +
      '<circle class="novo u-n4" r="11" cx="' + f1(N4[0]) + '" cy="' + f1(N4[1]) + '" style="stroke:var(--second);stroke-dasharray:5 4"/>' +
      '<circle class="u-ring" r="24" style="fill:none;stroke:var(--second);stroke-width:4"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['re', 'raios', 'pol', 'pol2', 'r', 's', 'n4', 'ring', 'p0', 'p1', 'p2', 'p3']) this.e[c] = svg.querySelector('.u-' + c);
    for (const [h, x, y] of tk) A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-size:20px;color:color-mix(in srgb, var(--main) 60%, var(--ground))');
    const L = (h, x, y, s) => A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-weight:700;font-size:25px;' + (s || ''));
    this.lr = L('Ré', R[0] + 18, R[1] - 42); this.ls = L('Estação', S[0] + 14, S[1] - 44);
    const off = [[12, -56], [16, 6], [-40, 4], [-30, -46]];
    this.lp = this.Q.map((Q, i) => L(u.pts[i].id, Q[0] + off[i][0], Q[1] + off[i][1], 'color:var(--accent)'));
    this.lpol = [L('3 → estação', A[0] - 150, A[1] + 30, 'color:var(--second)'), L('2 → ré', S[0] - 20, S[1] + 24, 'color:var(--second)'),
      L('4', N4[0] + 16, N4[1] - 40, 'color:var(--second)')];
    // Quadro: publicado × calculado
    const linhas = u.pts.map(p => '<tr><td style="font-weight:700;color:var(--accent);font-size:28px">' + p.id + '</td>' +
      '<td class="v"><span class="gray" style="font-size:22px">' + n3(p.pub[0]) + ' ; ' + n3(p.pub[1]) + '</span><br>' + n3(p.calc[0]) + ' ; ' + n3(p.calc[1]) + '</td>' +
      '<td class="v">' + A10.num(p.dif_mm, 1) + '</td><td class="ok" style="font-size:32px">✓</td></tr>').join('');
    const t = kit.h('<div class="words" style="left:1090px;top:250px"><table class="tab"><tr><th></th><th style="text-align:right">E ; N (m)<br><span style="text-transform:none" class="gray">publicado / este roteiro</span></th><th>Dif. (mm)</th><th></th></tr>' + linhas + '</table></div>');
    kit.stage.append(t);
    this.th = t.querySelector('tr'); this.rows = [...t.querySelectorAll('tr')].slice(1);
    this.ok = this.rows.map(r => r.querySelector('.ok'));
    this.dados = A10.bloco(kit, 1090, 170, 760, '<p class="sub" style="font-size:26px">Delazari (2022), programa TRANSPUTM: <i>D</i><sub>e</sub> = 2 500 m; <i>α</i> = 142°, 235°, 300° e 355° 30′ 30″</p>');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Conferência: o exemplo da UFPR</h2>').querySelector('h2');
    this.k = { notas: kit.em('e1', 'notas'), q: kit.em('e1', 'quatro'), co: kit.em('e1', 'coincidem'), pol: kit.em('e2', 'poligonal'),
      est: kit.em('e2', 'estacao'), re: kit.em('e2', 're'), rep: kit.em('e2', 'repete') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k;
    const a = eo(seg(t, k.notas - 0.5, k.notas));
    for (const c of ['r', 's']) e[c].style.opacity = a; this.lr.style.opacity = this.ls.style.opacity = a;
    A10.draw(e.re, eio(seg(t, k.notas, k.notas + 0.7)));
    A10.show(this.dados, t, k.notas);
    A10.draw(e.raios, eio(seg(t, k.q, k.q + 1.4)));
    for (let i = 0; i < 4; i++) { const b = eo(seg(t, k.q + 0.4 + 0.3 * i, k.q + 0.8 + 0.3 * i)); e['p' + i].style.opacity = b; this.lp[i].style.opacity = b; }
    A10.fade(this.th, t, k.co - 0.4);
    this.rows.forEach((r, i) => { A10.show(r, t, k.co + 0.45 * i); A10.fade(this.ok[i], t, k.co + 0.45 * i + 0.3); });
    // poligonal
    const p = eio(seg(t, k.est - 0.3, k.est + 0.7)), A = this.Q[0], S = this.S;
    e.ring.setAttribute('cx', lerp(S[0], A[0], p).toFixed(1)); e.ring.setAttribute('cy', lerp(S[1], A[1], p).toFixed(1));
    e.ring.style.opacity = eo(seg(t, k.pol, k.pol + 0.5));
    A10.fade(this.lpol[0], t, k.est + 0.5); A10.fade(this.lpol[1], t, k.re);
    A10.draw(e.pol2, eio(seg(t, k.re, k.re + 0.6)));
    A10.draw(e.pol, eio(seg(t, k.rep - 0.3, k.rep + 0.6)));
    const n = eo(seg(t, k.rep + 0.4, k.rep + 0.8)); e.n4.style.opacity = n; this.lpol[2].style.opacity = n;
  },
});
