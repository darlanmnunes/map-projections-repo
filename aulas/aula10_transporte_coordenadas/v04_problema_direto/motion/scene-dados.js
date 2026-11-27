// Cena 1: os dados do exemplo de Viçosa (slide 16): estação 2, ré 1, α e Dh medidos, hm; pede-se E3, N3
const { seg, eo, eio, TextFx } = kit;
kit.scene('dados', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v4-dados.json').vic;
    const P = A10V4.planta((d.p1[0] + d.p3[0]) / 2, (d.p1[1] + d.p2[1]) / 2, 580, 600, 0.2);
    // grade de 1 km
    let g = ''; const J = { x0: 120, x1: 1040, y0: 200, y1: 990 }, tk = [];
    for (let e = 720000; e <= 726000; e += 1000) { const x = P.X(e); if (x > J.x0 && x < J.x1) { g += 'M' + x.toFixed(1) + ' ' + J.y0 + 'V' + J.y1; tk.push([e / 1000 + ' km', x - 40, J.y1 + 8]); } }
    for (let n = 7703000; n <= 7707000; n += 1000) { const y = P.Y(n); if (y > J.y0 && y < J.y1) { g += 'M' + J.x0 + ' ' + y.toFixed(1) + 'H' + J.x1; tk.push([(n / 1000).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + ' km', J.x0 + 8, y + 4]); } }
    kit.stage.append(kit.h('<svg class="art" viewBox="0 0 1920 1080"><path class="gridl" style="stroke-width:1.4" d="' + g + '"/>' +
      '<rect class="frame" x="' + J.x0 + '" y="' + J.y0 + '" width="' + (J.x1 - J.x0) + '" height="' + (J.y1 - J.y0) + '" style="stroke-width:1.5"/></svg>'));
    for (const [h, x, y] of tk) A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-size:20px;color:color-mix(in srgb, var(--main) 60%, var(--ground))');
    const pv = this.pv = A10V4.plantaVicosa(kit, d, P, { l3: '3 ?' });
    const a21 = d.azc21;
    const arc = kit.h('<svg class="art" viewBox="0 0 1920 1080"><path class="garc" d="' + A10.sector(pv.p2[0], pv.p2[1], a21, a21 + d.alfa, 70) + '"/></svg>');
    kit.stage.append(arc); this.arc = arc;
    this.la = A10.lbl(kit, '<i>α</i>', pv.p2[0] - 12, pv.p2[1] - 120, 'color:var(--accent);font-size:36px');
    this.ld = A10.lbl(kit, '<i>D</i><sub>h</sub>', (pv.p2[0] + pv.p3[0]) / 2 + 6, (pv.p2[1] + pv.p3[1]) / 2 + 8, 'color:var(--accent)');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Problema direto: os dados</h2>').querySelector('h2');
    const n3 = A10V4.n3;
    const linhas = [
      ['<i>E</i><sub>1</sub> ; <i>N</i><sub>1</sub> (ré)', n3(d.p1[0]) + ' ; ' + n3(d.p1[1])],
      ['<i>E</i><sub>2</sub> ; <i>N</i><sub>2</sub> (estação)', n3(d.p2[0]) + ' ; ' + n3(d.p2[1])],
      ['<i>α</i> (horário, de 2→1 a 2→3)', A10.dms(d.alfa)],
      ['<i>D</i><sub>h</sub> (2→3)', n3(d.Dh) + ' m'],
      ['<i>h</i><sub>m</sub> (geométrica)', A10.num(d.hm, 0) + ' m'],
      ['<b style="color:var(--accent)"><i>E</i><sub>3</sub> ; <i>N</i><sub>3</sub></b>', '<b style="color:var(--accent)">?</b>'],
    ];
    const t = kit.h('<div class="words" style="left:1100px;top:210px"><table class="tab"><tr><th>Dado</th><th style="text-align:right">Valor</th></tr>' +
      linhas.map(r => '<tr><td style="font-size:26px">' + r[0] + '</td><td class="v">' + r[1] + '</td></tr>').join('') + '</table></div>');
    kit.stage.append(t);
    this.rows = [...t.querySelectorAll('tr')].slice(1);
    this.th = t.querySelector('tr');
    this.nota = A10.bloco(kit, 1100, 760, 740, '<p class="note">SIRGAS 2000 / UTM 23S, GRS80. A estação 2 é o ponto de Viçosa das Aulas 04 a 09 (slide 16).</p>');
    this.k = { est: kit.em('a1', 'estacao'), re: kit.em('a1', 'avisa'), ang: kit.em('a2', 'angulo'), dist: kit.em('a2', 'distancia'),
      alt: kit.em('a3', 'altitude'), q: kit.em('a3', 'queremos') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, pv = this.pv, r = this.rows;
    A10.fade(this.th, t, k.est - 0.3);
    const a = eo(seg(t, k.est, k.est + 0.5)); pv.e2.style.opacity = a; pv.l2.style.opacity = a;
    const b = eo(seg(t, k.re, k.re + 0.5)); pv.e1.style.opacity = b; pv.l1.style.opacity = b;
    A10.draw(pv.e21, eio(seg(t, k.re + 0.2, k.re + 1.0)));
    A10.show(r[1], t, k.est); A10.show(r[0], t, k.re);
    this.arc.style.opacity = eo(seg(t, k.ang, k.ang + 0.6)); A10.fade(this.la, t, k.ang + 0.2); A10.show(r[2], t, k.ang);
    A10.draw(pv.e23, eio(seg(t, k.dist, k.dist + 1.0))); A10.fade(this.ld, t, k.dist + 0.6); A10.show(r[3], t, k.dist);
    const c = eo(seg(t, k.dist + 0.9, k.dist + 1.3)); pv.e3.style.opacity = c; pv.l3.style.opacity = c;
    A10.show(r[4], t, k.alt); A10.show(r[5], t, k.q);
    A10.fade(this.nota, t, k.alt + 0.5);
  },
});
