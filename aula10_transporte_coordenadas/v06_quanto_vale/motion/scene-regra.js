// Cena 2: d ≈ D²E′/(2R²) em função do comprimento da linha, para três distâncias ao MC
const { seg, eo, eio, TextFx } = kit;
kit.scene('regra', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A10V6.estilo(kit);
    const d = kit.json('v6-dados.json'), G = A10V6.GR, gx = A10V6.gx, gy = A10V6.gy;
    const cur = k => A10.lineD(d.regra_mm[k].map(([D, v]) => [gx(D), gy(v)]));
    let grade = '';
    for (let D = 1000; D <= 10000; D += 1000) grade += 'M' + gx(D).toFixed(1) + ' ' + G.y1 + 'V' + G.y0;
    for (let v = 50; v <= 400; v += 50) grade += 'M' + G.x0 + ' ' + gy(v).toFixed(1) + 'H' + G.x1;
    const vic = d.vicosa_mm;
    const pts = [[1000, vic['1000']], [3000, vic['3000']], [10000, vic['10000']]];
    const s = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="gridl" style="stroke-width:1.2" d="' + grade + '"/>' +
      '<path class="v6ax" d="M' + G.x0 + ' ' + G.y1 + 'V' + G.y0 + 'H' + G.x1 + '"/>' +
      '<path class="curve r-c100" style="stroke:color-mix(in srgb, var(--main) 40%, var(--ground));stroke-width:3" d="' + cur('100') + '"/>' +
      '<path class="curve r-c300" style="stroke:color-mix(in srgb, var(--main) 40%, var(--ground));stroke-width:3" d="' + cur('300') + '"/>' +
      '<path class="curve r-c222" style="stroke:var(--accent);stroke-width:5" d="' + cur('222') + '"/>' +
      pts.map(([D, v], i) => '<circle class="dot r-p' + i + '" r="9" cx="' + gx(D).toFixed(1) + '" cy="' + gy(v).toFixed(1) + '"/>').join('') + '</svg>');
    kit.stage.append(s);
    this.c = { c100: s.querySelector('.r-c100'), c300: s.querySelector('.r-c300'), c222: s.querySelector('.r-c222') };
    this.p = pts.map((_, i) => s.querySelector('.r-p' + i));
    const tk = 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 65%, var(--ground))';
    this.ax = [];
    for (let D = 0; D <= 10000; D += 2000) this.ax.push(A10.lbl(kit, D / 1000 + '', gx(D) - 8, G.y0 + 10, tk));
    for (let v = 0; v <= 400; v += 100) this.ax.push(A10.lbl(kit, v + '', G.x0 - 52, gy(v) - 14, tk));
    this.ax.push(A10.lbl(kit, 'comprimento da linha <i>D</i> (km)', 520, G.y0 + 44, 'font-size:26px'));
    this.ax.push(A10.lbl(kit, '<i>d</i> (mm)', G.x0 - 60, G.y1 - 50, 'font-size:26px'));
    const fim = k => d.regra_mm[k][d.regra_mm[k].length - 1][1];
    this.cl = {
      c300: A10.lbl(kit, '<i>E</i>′ = 300 km', gx(10000) - 150, gy(fim('300')) - 52, 'font-size:24px;color:color-mix(in srgb, var(--main) 60%, var(--ground))'),
      c222: A10.lbl(kit, '<b>Viçosa</b>, <i>E</i>′ = 222 km', gx(6350), gy(112), 'font-size:26px;color:var(--accent)'),
      c100: A10.lbl(kit, '<i>E</i>′ = 100 km', gx(10000) - 150, gy(fim('100')) - 48, 'font-size:24px;color:color-mix(in srgb, var(--main) 60%, var(--ground))'),
    };
    const pl = ['3 mm', '25 mm', '27 cm'];
    this.pl = pts.map(([D, v], i) => A10.lbl(kit, '<b>' + pl[i] + '</b>', gx(D) + [14, 18, -118][i], gy(v) + [-44, 4, 8][i], 'font-family:var(--sans);font-size:28px;color:var(--accent)'));
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">O erro cresce com <i>D</i>² e com <i>E</i>′</h2>').querySelector('h2');
    const B = (y, html) => A10.bloco(kit, 1240, y, 600, html);
    this.t = [
      [B(240, '<p class="sub">Desprezar <i>ψ</i> ou usar o <i>m</i> do ponto inicial desloca o ponto final em</p>'), kit.em('b1', 'diferenca')],
      [B(380, '<div class="card" style="position:relative;padding:20px 28px"><p class="eq big" style="margin:0"><i>d</i> ≈ <span class="frac"><span><i>D</i><sup>2</sup> <i>E</i>′</span><span>2 <i>R</i><sup>2</sup></span></span></p></div>'), kit.em('b2', 'formula')],
      [B(560, '<p class="note"><i>D</i>: comprimento da linha; <i>E</i>′ = <i>E</i> − 500 000 m; <i>R</i> ≈ √(<i>MN</i>) ≈ 6 360 km</p>'), kit.em('b2', 'aproximadamente')],
      [B(690, '<p class="sub">Em Viçosa: 1 km → 3 mm; 3 km → 25 mm; 10 km → 27 cm</p>'), kit.em('b3', 'vicosa')],
    ];
    this.k = { ax: kit.em('b1', 'crescem'), c222: kit.em('b1', 'quadrado'), cOut: kit.em('b1', 'distancia'),
      p0: kit.em('b3', '3'), p1: kit.em('b3', '25'), p2: kit.em('b3', '27') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k;
    this.ax.forEach(a => A10.fade(a, t, k.ax - 0.6));
    A10.draw(this.c.c222, eio(seg(t, k.c222, k.c222 + 1.6))); A10.fade(this.cl.c222, t, k.c222 + 1.2);
    for (const c of ['c100', 'c300']) { A10.draw(this.c[c], eio(seg(t, k.cOut, k.cOut + 1.4))); A10.fade(this.cl[c], t, k.cOut + 1.0); }
    [k.p0, k.p1, k.p2].forEach((tp, i) => { this.p[i].style.opacity = eo(seg(t, tp, tp + 0.4)); A10.fade(this.pl[i], t, tp + 0.1); });
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
