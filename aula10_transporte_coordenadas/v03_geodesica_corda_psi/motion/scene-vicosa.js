// Cena 4: Viçosa, linha norte-sul de 3 km: ψ = 1,70″; sem ψ o fim desloca 25 mm; conferência com a geodésica numérica
const { seg, eo, eio, TextFx } = kit;
kit.scene('vicosa', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const V = kit.json('v3-dados.json').vic;
    const P1 = [430, 930], L = 680, PSI = 6;                    // ψ desenhado: 6° (muito exagerado)
    const P2 = [P1[0], P1[1] - L], [tx, ty] = A10V3.dir(PSI), W = [P1[0] + tx * L, P1[1] + ty * L];
    const cv = A10V3.curva(P1, P2, PSI);
    // detalhe: os dois pontos finais, afastados 24,7 mm; ampliação para caber no círculo
    const Z = { x: 820, y: 330, r: 150 }, sz = 8;                // 8 px por milímetro
    const zd = V.lateral * 1000 * sz;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="mc" style="opacity:.35" d="M150 180V1000"/>' +
      '<path class="tang x-tan" d="M' + P1[0] + ' ' + P1[1] + 'L' + W[0].toFixed(1) + ' ' + W[1].toFixed(1) + '"/>' +
      '<path class="corda x-cor" d="M' + P1[0] + ' ' + P1[1] + 'L' + P2[0] + ' ' + P2[1] + '"/>' +
      '<path class="geod x-geo" d="' + cv.d + '"/>' +
      '<path class="psiarc x-psi" d="' + A10.sector(P1[0], P1[1], 0, PSI, 360) + '"/>' +
      '<circle class="marco" r="11" cx="' + P1[0] + '" cy="' + P1[1] + '"/><circle class="marco" r="11" cx="' + P2[0] + '" cy="' + P2[1] + '"/>' +
      '<circle class="x-w" r="11" cx="' + W[0].toFixed(1) + '" cy="' + W[1].toFixed(1) + '" style="fill:var(--ground);stroke:var(--tissot);stroke-width:4"/>' +
      '<g class="x-zoom"><path class="zoomln" d="M' + ((P2[0] + W[0]) / 2 + 30) + ' ' + (P2[1] + 6) + 'L' + (Z.x - Z.r) + ' ' + Z.y + '"/>' +
      '<circle cx="' + Z.x + '" cy="' + Z.y + '" r="' + Z.r + '" style="fill:var(--ground);stroke:var(--accent);stroke-width:2.5"/>' +
      '<circle class="marco" r="10" cx="' + (Z.x - zd / 2).toFixed(1) + '" cy="' + Z.y + '"/>' +
      '<circle r="10" cx="' + (Z.x + zd / 2).toFixed(1) + '" cy="' + Z.y + '" style="fill:var(--ground);stroke:var(--tissot);stroke-width:4"/>' +
      '<path class="gap" d="M' + (Z.x - zd / 2).toFixed(1) + ' ' + (Z.y + 34) + 'H' + (Z.x + zd / 2).toFixed(1) + 'M' + (Z.x - zd / 2).toFixed(1) + ' ' + (Z.y + 24) + 'v20M' + (Z.x + zd / 2).toFixed(1) + ' ' + (Z.y + 24) + 'v20"/></g></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['tan', 'cor', 'geo', 'psi', 'w', 'zoom']) this.e[c] = svg.querySelector('.x-' + c);
    const S = 'font-family:var(--sans);font-weight:700;font-size:26px;';
    A10.lbl(kit, 'MC (222 km a oeste)', 160, 190, 'font-family:var(--sans);font-size:22px;color:var(--accent);opacity:.7');
    A10.lbl(kit, '1', P1[0] - 34, P1[1] - 6, S); A10.lbl(kit, '2', P2[0] - 40, P2[1] - 22, S);
    A10.lbl(kit, '3 km', P1[0] - 90, (P1[1] + P2[1]) / 2, 'font-size:28px');
    this.l = {
      psi: A10.lbl(kit, '<i>ψ</i>', P1[0] + 48, P1[1] - 390, 'color:var(--psi);font-size:38px'),
      w: A10.lbl(kit, 'sem <i>ψ</i>', W[0] + 18, W[1] - 22, S + 'color:var(--tissot)'),
      z: A10.lbl(kit, A10.num(V.lateral * 1000, 1) + ' mm', Z.x - 50, Z.y + 52, 'color:var(--tissot);font-size:32px'),
    };
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line"><i>ψ</i> em Viçosa</h2>').querySelector('h2');
    const B = (y, html) => A10.bloco(kit, 1110, y, 760, html);
    this.t = [
      [B(200, '<p class="sub">Linha norte-sul de 3 km a <i>E</i>′ = 222 km do MC</p><p class="eq big"><i>ψ</i><sub>12</sub> = +' + A10.num(V.psi, 2) + '″&emsp;(23)</p>'), kit.em('d1', 'linha')],
      [B(390, '<p class="sub">Se <i>ψ</i> for esquecido, o ponto final se desloca <b style="color:var(--tissot)">' + A10.num(V.lateral * 1000, 1) + ' mm</b> para o lado</p>'), kit.em('d2', 'desloca')],
      [B(530, '<p class="note">Estação total de 2 mm + 2 ppm: cerca de 8 mm em 3 km</p>'), kit.em('d2', 'precisao')],
      [B(650, '<div class="card" style="position:relative;padding:20px 28px"><p class="sub" style="font-size:28px;margin:0">Geodésica calculada no elipsoide (pyproj) e projetada:</p>' +
        '<p class="eq" style="margin:8px 0 0"><i>ψ</i> = +' + A10.num(V.psi_num, 3) + '″&emsp;diferença: <b>' + A10.num(Math.abs(V.psi - V.psi_num), 3) + '″</b></p></div>'), kit.em('d3', 'geodesica')],
      [A10.bloco(kit, 1110, 900, 760, '<p class="note">Ângulos e deslocamento ampliados no desenho; os números são os reais.</p>'), kit.em('d1', 'tem')],
    ];
    this.k = { lin: kit.em('d1', 'linha'), psi: kit.em('d1', 'psi'), w: kit.em('d2', 'esquecido'), z: kit.em('d2', 'desloca') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, l = this.l;
    A10.draw(e.cor, eio(seg(t, k.lin, k.lin + 0.9))); A10.draw(e.geo, eio(seg(t, k.lin + 0.5, k.lin + 1.5)));
    e.psi.style.opacity = eo(seg(t, k.psi, k.psi + 0.6)); A10.fade(l.psi, t, k.psi + 0.2);
    A10.draw(e.tan, eio(seg(t, k.w, k.w + 0.9)));
    e.w.style.opacity = eo(seg(t, k.w + 0.8, k.w + 1.1)); A10.fade(l.w, t, k.w + 0.9);
    A10.fade(e.zoom, t, k.z, 0.6); A10.fade(l.z, t, k.z + 0.3);
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
