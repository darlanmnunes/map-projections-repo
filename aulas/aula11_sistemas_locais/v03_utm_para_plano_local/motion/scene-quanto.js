// Cena 5: quanto vale cada escolha (slides 34 e 35)
const { seg, eo, eio, TextFx } = kit;
kit.scene('quanto', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A11V3.estilo(kit);
    const V = kit.json('v3-dados.json'), n = A11.num;
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Quanto vale cada escolha?</h2>').querySelector('h2');
    // Gráfico: erro da similaridade × distância à origem (pior azimute), escala log
    const X0 = 200, X1 = 1000, Y0 = 860, Y1 = 230, L0 = Math.log10(0.3), L1 = Math.log10(3000);
    const fx = d => X0 + (X1 - X0) * d / 18, fy = e => Y0 - (Y0 - Y1) * (Math.log10(Math.max(e, 0.3)) - L0) / (L1 - L0);
    let gr = '';
    for (const e of [1, 10, 100, 1000]) gr += 'M' + X0 + ' ' + fy(e).toFixed(1) + 'H' + X1;
    for (const d of [0, 5, 10, 15]) gr += 'M' + fx(d) + ' ' + Y0 + 'V' + Y1;
    const cur = [[0, 0.3]].concat(V.curva);
    const pol = Object.values(V.pts).map(p => [Math.hypot(p.rig.x, p.rig.y) / 1000, p.e_pol]);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="gridl" d="' + gr + '"/><path class="axisbox" d="M' + X0 + ' ' + Y1 + 'V' + Y0 + 'H' + X1 + '"/>' +
      '<path class="zone q-z" d="M' + fx(0) + ' ' + Y1 + 'H' + fx(2) + 'V' + Y0 + 'H' + fx(0) + 'Z"/>' +
      '<path class="curve q-c" style="stroke:var(--accent)" d="' + A11.lineD(cur.map(p => [fx(p[0]), fy(p[1])])) + '"/>' +
      cur.slice(1).map((p, i) => '<circle class="dot q-d" r="8" cx="' + fx(p[0]) + '" cy="' + fy(p[1]) + '"/>').join('') +
      pol.map(p => '<circle class="marco q-p" style="fill:var(--corda)" r="10" cx="' + fx(p[0]) + '" cy="' + fy(p[1]) + '"/>').join('') + '</svg>');
    kit.stage.append(svg);
    this.c = svg.querySelector('.q-c'); this.d = [...svg.querySelectorAll('.q-d')]; this.p = [...svg.querySelectorAll('.q-p')]; this.z = svg.querySelector('.q-z');
    this.ax = [];
    for (const e of [1, 10, 100, 1000]) this.ax.push(A11.lbl(kit, e >= 1000 ? '1 m' : e + ' mm', X0 - 14, fy(e) - 16, 'font-family:var(--sans);font-size:22px;transform:translate(-100%,0)'));
    for (const d of [0, 5, 10, 15]) this.ax.push(A11.lbl(kit, d + ' km', fx(d) - 24, Y0 + 10, 'font-family:var(--sans);font-size:22px'));
    this.ax.push(A11.lbl(kit, 'distância do ponto à origem', X0 + 240, Y0 + 50, 'font-family:var(--sans);font-size:24px'));
    this.leg = A11.bloco(kit, X0 + 30, Y1 - 10, 760, '<p class="sub sm"><span class="key" style="border-color:var(--accent)"></span>similaridade × rigoroso</p><p class="sub sm q-lp"><span class="key" style="border-color:var(--corda)"></span>polar × rigoroso (P1, P2, P3)</p>');
    this.lp = this.leg.querySelector('.q-lp');
    const rot = [[1, 3], [2, 12], [5, 71]].map(([d, e]) => A11.lbl(kit, e + ' mm', fx(d) + 14, fy(e) - 44, 'font-family:var(--sans);font-size:24px;font-weight:700;color:var(--accent)'));
    rot.push(A11.lbl(kit, n(V.curva[V.curva.length - 1][1], 0) + ' mm', fx(17.5) - 120, fy(V.curva[V.curva.length - 1][1]) - 10, 'font-family:var(--sans);font-size:24px;font-weight:700;color:var(--accent)'));
    this.rot = rot;
    // Tabela por ponto
    const linhas = Object.entries(V.pts).map(([k, p]) => '<tr><td>' + k + '</td><td class="v">' + n(Math.hypot(p.rig.x, p.rig.y) / 1000, 1) + ' km</td><td class="v">' + n(p.e_sim, 0) + ' mm</td><td class="v">' + n(p.e_pol, 1) + ' mm</td></tr>').join('');
    this.tb = kit.h('<table class="tab" style="position:absolute;left:1120px;top:230px;font-size:28px"><tr><th>Ponto</th><th>Distância</th><th>Similaridade</th><th>Polar</th></tr>' + linhas + '</table>');
    kit.stage.append(this.tb);
    this.gam = kit.h('<div class="v3err" style="left:1120px;top:520px;background:color-mix(in srgb, var(--tissot) 12%, var(--ground));border:2.5px solid var(--tissot);color:var(--tissot)">Esquecer <i>γ</i><sub>0</sub> em P1: ' + n(V.sem_g, 0) + ' m</div>');
    kit.stage.append(this.gam);
    this.fim = A11.bloco(kit, 1120, 640, 700, '<div class="card" style="position:relative;border-color:var(--second)"><h3>Qual método usar?</h3><p class="sub" style="margin:0">Até 1 ou 2 km da origem: similaridade.<br>Acima disso: rigoroso ou polar.</p></div>');
    this.k = {
      e1: kit.em('e1', 'quanto'), sim: kit.em('e1', 'similaridade'), um: kit.em('e1', '3'), dois: kit.em('e1', '12'), cinco: kit.em('e1', '70'),
      borda: kit.em('e2', 'borda'), quase: kit.em('e2', 'quase'), pol: kit.em('e2', 'polar'), tres: kit.em('e2', 'tres'),
      grave: kit.em('e3', 'grave'), conv: kit.em('e3', 'convergencia'), res: kit.em('e4', 'resumo'), serve: kit.em('e4', 'serve'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k;
    for (const a of this.ax) A11.fade(a, t, k.e1);
    A11.fade(this.leg, t, k.sim); A11.fade(this.lp, t, k.pol);
    A11.draw(this.c, eio(seg(t, k.sim, k.quase)));
    const ds = [k.sim, k.um, k.dois, k.dois + 0.8, k.cinco, k.borda - 0.5, k.borda, k.quase];
    this.d.forEach((c, i) => { c.style.opacity = eo(seg(t, ds[i], ds[i] + 0.3)); });
    const rs = [k.um, k.dois, k.cinco, k.quase];
    this.rot.forEach((r, i) => A11.fade(r, t, rs[i]));
    this.p.forEach((c, i) => { c.style.opacity = eo(seg(t, k.pol + 0.3 * i, k.pol + 0.3 * i + 0.3)); });
    A11.show(this.tb, t, k.tres);
    A11.show(this.gam, t, k.conv);
    this.z.style.opacity = eo(seg(t, k.serve, k.serve + 0.6));
    A11.show(this.fim, t, k.res);
  },
});
