// Cena 1: em Viçosa, dois marcos com coordenadas GNSS; a estação total mede α e Dh até o ponto novo
const { seg, eo, eio, TextFx } = kit;
kit.scene('campo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v1-dados.json'), J = A10V1.JAN, P = A10V1.planta(d);
    const q = p => [P.X(p[0]), P.Y(p[1])];
    const [p1, p2, p3] = [q(d.p1), q(d.p2), q(d.p3)];
    this.p = { p1, p2, p3 };
    // Grade UTM a cada 1 km, rotulada em km
    let grade = '';
    const lab = [];
    for (let e = 720000; e <= 726000; e += 1000) { const x = P.X(e); if (x > J.x0 && x < J.x1) { grade += 'M' + x.toFixed(1) + ' ' + J.y0 + 'V' + J.y1; lab.push([e / 1000 + ' km', x - 40, J.y1 + 8]); } }
    for (let n = 7703000; n <= 7707000; n += 1000) { const y = P.Y(n); if (y > J.y0 && y < J.y1) { grade += 'M' + J.x0 + ' ' + y.toFixed(1) + 'H' + J.x1; lab.push([(n / 1000).toLocaleString('pt-BR').replace('.', ' ') + ' km', J.x0 + 8, y - 34]); } }
    const azq = d.azq23, a21 = d.azc21;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="terr" style="fill:none;stroke-width:1.6;opacity:.35" d="' + A10V1.niveis() + '"/>' +
      '<path class="gridl" style="stroke-width:1.4" d="' + grade + '"/>' +
      '<rect class="frame" x="' + J.x0 + '" y="' + J.y0 + '" width="' + (J.x1 - J.x0) + '" height="' + (J.y1 - J.y0) + '" style="stroke-width:1.5"/>' +
      '<path class="sight c-v21" d="M' + p2[0] + ' ' + p2[1] + 'L' + p1[0] + ' ' + p1[1] + '" style="stroke-dasharray:14 10;stroke-width:3"/>' +
      '<path class="garc c-alfa" d="' + A10.sector(p2[0], p2[1], a21, a21 + d.alfa, 70) + '"/>' +
      '<path class="sight c-v23" d="M' + p2[0] + ' ' + p2[1] + 'L' + p3[0] + ' ' + p3[1] + '" style="stroke:var(--accent)"/>' +
      '<path class="nq c-g1" style="stroke-width:3" d="' + A10V1.gnss(p1[0], p1[1] - 26) + '"/>' +
      '<path class="nq c-g2" style="stroke-width:3" d="' + A10V1.gnss(p2[0] - 50, p2[1] - 26) + '"/>' +
      '<path class="nq c-tri" style="stroke-width:3;fill:none" d="' + A10V1.tripe(p2[0], p2[1] + 4) + '"/>' +
      '<circle class="marco c-m1" r="12" cx="' + p1[0] + '" cy="' + p1[1] + '"/>' +
      '<circle class="marco c-m2" r="12" cx="' + p2[0] + '" cy="' + p2[1] + '"/>' +
      '<circle class="novo c-m3" r="14" cx="' + p3[0] + '" cy="' + p3[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['v21', 'alfa', 'v23', 'g1', 'g2', 'tri', 'm1', 'm2', 'm3']) this.e[c] = svg.querySelector('.c-' + c);
    for (const [h, x, y] of lab) A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-size:20px;color:color-mix(in srgb, var(--main) 60%, var(--ground))');
    const L = (h, x, y, st) => A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-weight:700;font-size:28px;' + (st || ''));
    this.l = {
      m1: L('1 <span style="font-weight:400">(ré)</span>', p1[0] + 24, p1[1] - 20),
      m2: L('2 <span style="font-weight:400">(estação)</span>', p2[0] - 70, p2[1] + 56),
      m3: L('3 ?', p3[0] + 22, p3[1] - 50, 'color:var(--accent)'),
      alfa: A10.lbl(kit, '<i>α</i>', p2[0] - 14, p2[1] - 118, 'color:var(--accent);font-size:36px'),
      dh: A10.lbl(kit, '<i>D</i><sub>h</sub>', (p2[0] + p3[0]) / 2 + 6, (p2[1] + p3[1]) / 2 + 8, 'color:var(--accent)'),
    };
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Do terreno à grade UTM</h2>').querySelector('h2');
    const B = (y, html) => A10.bloco(kit, 1150, y, 720, html);
    this.t = [
      [B(220, '<p class="sub"><b>GNSS:</b> coordenadas UTM de dois marcos, 1 e 2</p>'), kit.em('a1', 'receptor')],
      [B(330, '<p class="sub"><b>Estação total</b> em 2: o ângulo horário <i>α</i> (de 1 para 3) e a distância horizontal <i>D</i><sub>h</sub></p>'), kit.em('a1', 'estacao')],
      [B(530, '<p class="note">Exemplo da Aula 10, slide 16: SIRGAS 2000 / UTM 23S</p>'), kit.em('a1', 'ponto')],
      [B(640, '<div class="card" style="position:relative;padding:18px 30px"><p class="eq big" style="margin:0"><i>E</i><sub>3</sub> = ?&emsp;<i>N</i><sub>3</sub> = ?</p></div>'), kit.em('a2', 'quais')],
    ];
    this.k = { r: kit.em('a1', 'receptor'), est: kit.em('a1', 'estacao'), ang: kit.em('a1', 'angulo'), dist: kit.em('a1', 'distancia'), novo: kit.em('a1', 'novo') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k;
    const m = eo(seg(t, k.r, k.r + 0.5));
    for (const c of ['m1', 'm2', 'g1', 'g2']) e[c].style.opacity = m;
    this.l.m1.style.opacity = m; this.l.m2.style.opacity = m;
    e.tri.style.opacity = eo(seg(t, k.est, k.est + 0.5));
    A10.draw(e.v21, eio(seg(t, k.est + 0.4, k.est + 1.2)));
    const a = eo(seg(t, k.ang, k.ang + 0.6));
    e.alfa.style.opacity = a; this.l.alfa.style.opacity = a;
    A10.draw(e.v23, eio(seg(t, k.dist, k.dist + 1.0)));
    this.l.dh.style.opacity = eo(seg(t, k.dist + 0.6, k.dist + 1.1));
    const n = eo(seg(t, k.dist + 0.9, k.dist + 1.3));
    e.m3.style.opacity = n; this.l.m3.style.opacity = n;
    e.m3.setAttribute('r', (14 + 6 * Math.max(0, Math.sin((t - k.novo) * 4)) * (t > k.novo ? Math.exp(-(t - k.novo) / 1.5) : 0)).toFixed(1));
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
