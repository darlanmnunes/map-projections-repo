// Cena 1: na grade, a geodésica vira uma curva com a concavidade voltada para o MC; a flecha real é de 6 mm em 3 km
const { seg, eo, eio, TextFx } = kit;
kit.scene('curva', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const V = kit.json('v3-dados.json').vic;
    const J = { x0: 140, x1: 1060, y0: 180, y1: 1000 }, xMC = 270;
    const P1 = [700, 900], P2 = [820, 290];
    const azC = Math.atan2(P2[0] - P1[0], -(P2[1] - P1[1])) / A10V3.D;
    const cv = A10V3.curva(P1, P2, azC + 9);                 // ψ desenhado: 9° (muito exagerado)
    let grade = '';
    for (let x = J.x0 + 10; x < J.x1; x += 120) grade += 'M' + x + ' ' + J.y0 + 'V' + J.y1;
    for (let y = J.y0 + 100; y < J.y1; y += 120) grade += 'M' + J.x0 + ' ' + y + 'H' + J.x1;
    // Detalhe: a curva real, flecha de V.flecha m em 3 km, ampliada só na direção lateral
    const Z = { x0: 1150, x1: 1790, y: 800 }, AMP = 20000, sx = (Z.x1 - Z.x0) / V.L, f = V.flecha * AMP * sx;
    const zc = 'M' + Z.x0 + ' ' + Z.y + 'Q' + ((Z.x0 + Z.x1) / 2) + ' ' + (Z.y + 2 * f).toFixed(1) + ' ' + Z.x1 + ' ' + Z.y;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="gridl" style="stroke-width:1.4" d="' + grade + '"/>' +
      '<rect class="frame" x="' + J.x0 + '" y="' + J.y0 + '" width="' + (J.x1 - J.x0) + '" height="' + (J.y1 - J.y0) + '" style="stroke-width:1.5"/>' +
      '<path class="mc" d="M' + xMC + ' ' + J.y0 + 'V' + J.y1 + '"/>' +
      '<path class="nq u-con" style="stroke:var(--accent);stroke-width:3" d="' + A10.arrowTo(cv.C[0] - 40, (P1[1] + P2[1]) / 2 + 40, xMC + 90, (P1[1] + P2[1]) / 2 + 40, 20, 10) + '"/>' +
      '<path class="corda u-cor" d="M' + P1[0] + ' ' + P1[1] + 'L' + P2[0] + ' ' + P2[1] + '"/>' +
      '<path class="geod u-geo" d="' + cv.d + '"/>' +
      '<circle class="marco u-p" r="11" cx="' + P1[0] + '" cy="' + P1[1] + '"/><circle class="marco u-p" r="11" cx="' + P2[0] + '" cy="' + P2[1] + '"/>' +
      '<g class="u-zoom"><rect x="1120" y="640" width="700" height="290" rx="12" style="fill:color-mix(in srgb, var(--ground) 94%, var(--main));stroke:color-mix(in srgb, var(--main) 30%, var(--ground));stroke-width:2"/>' +
      '<path class="corda" style="stroke-width:3" d="M' + Z.x0 + ' ' + Z.y + 'H' + Z.x1 + '"/><path class="geod" style="stroke-width:3" d="' + zc + '"/>' +
      '<path class="nq" style="stroke:var(--psi);stroke-width:2.5" d="' + A10.arrowTo((Z.x0 + Z.x1) / 2, Z.y + 4, (Z.x0 + Z.x1) / 2, Z.y + f - 2, 10, 6) + '"/>' +
      '<circle class="marco" r="7" cx="' + Z.x0 + '" cy="' + Z.y + '"/><circle class="marco" r="7" cx="' + Z.x1 + '" cy="' + Z.y + '"/></g></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['con', 'cor', 'geo', 'zoom']) this.e[c] = svg.querySelector('.u-' + c);
    this.pts = [...svg.querySelectorAll('.u-p')];
    const L2 = (h, x, y, st) => A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-weight:700;font-size:26px;' + (st || ''));
    A10.lbl(kit, 'MC', xMC + 10, J.y0 + 8, 'font-family:var(--sans);font-size:24px;color:var(--accent)');
    this.l = {
      p: [L2('1', P1[0] - 34, P1[1] - 6), L2('2', P2[0] - 36, P2[1] - 20)],
      cor: L2('corda', 640, 520, 'color:var(--corda)'),
      geo: L2('geodésica<br>projetada', cv.C[0] + 20, 470, 'color:var(--elip);line-height:1.15'),
      con: L2('concavidade<br>voltada para o MC', xMC + 30, (P1[1] + P2[1]) / 2 + 56, 'color:var(--accent);font-weight:400;font-size:24px;line-height:1.15'),
    };
    this.zl = [
      A10.lbl(kit, 'Viçosa: linha norte-sul de 3 km', 1150, 655, 'font-family:var(--sans);font-size:24px;font-weight:700'),
      A10.lbl(kit, 'flecha: ' + A10.num(V.flecha * 1000, 1) + ' mm', (Z.x0 + Z.x1) / 2 - 90, Z.y - 56, 'color:var(--psi);font-size:28px'),
      A10.lbl(kit, 'curva ampliada ' + A10.num(AMP) + '× só na direção lateral', 1150, 880, 'font-family:var(--sans);font-size:20px;color:color-mix(in srgb, var(--main) 65%, var(--ground))'),
    ];
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">A geodésica na grade UTM</h2>').querySelector('h2');
    const B = (y, html) => A10.bloco(kit, 1140, y, 700, html);
    this.t = [
      [B(210, '<p class="sub">No elipsoide, a <b style="color:var(--elip)">geodésica</b> é a linha mais curta entre dois pontos</p>'), kit.em('a1', 'geodesica')],
      [B(330, '<p class="sub">Na grade, ela vira uma <b>curva</b> com a concavidade voltada para o MC; a reta entre os pontos é a <b style="color:var(--corda)">corda</b></p>'), kit.em('a1', 'vira')],
      [B(500, '<p class="note">Esquema com a curvatura muito exagerada.</p>'), kit.em('a2', 'exagerada')],
    ];
    this.k = { geo: kit.em('a1', 'geodesica'), grade: kit.em('a1', 'grade'), vira: kit.em('a1', 'vira'), con: kit.em('a1', 'concavidade'),
      z: kit.em('a2', 'numa'), mm: kit.em('a2', 'milimetros') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, l = this.l;
    const p = eo(seg(t, 0.4, 1.0));
    this.pts.forEach(c => c.style.opacity = p); l.p.forEach(x => x.style.opacity = p);
    A10.draw(e.cor, eio(seg(t, k.grade, k.grade + 0.9))); A10.fade(l.cor, t, k.grade + 0.5);
    A10.draw(e.geo, eio(seg(t, k.vira - 0.3, k.vira + 1.0))); A10.fade(l.geo, t, k.vira + 0.6);
    e.con.style.opacity = eo(seg(t, k.con, k.con + 0.6)); A10.fade(l.con, t, k.con + 0.3);
    A10.fade(e.zoom, t, k.z, 0.6);
    A10.fade(this.zl[0], t, k.z + 0.2); A10.fade(this.zl[2], t, k.z + 0.4); A10.fade(this.zl[1], t, k.mm - 0.3);
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
