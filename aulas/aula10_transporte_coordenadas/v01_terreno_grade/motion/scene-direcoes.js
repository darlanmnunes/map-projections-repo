// Cena 4: na grade, a geodésica vira curva (concavidade para o MC); a corda, ψ entre tangente e corda, e γ entre NG e NQ
const { seg, eo, eio, TextFx } = kit;
kit.scene('direcoes', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const J = { x0: 140, x1: 1060, y0: 180, y1: 1000 }, xMC = 230;
    const A = [430, 850], B = [930, 330];
    // Geodésica projetada: bojo para leste (longe do MC), esquema muito exagerado
    const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
    const nrm = [-dy / L, dx / L];                       // normal à corda, para leste/baixo
    const off = 85, ctl = [mid[0] + nrm[0] * off * 2, mid[1] + nrm[1] * off * 2];
    const geo = 'M' + A[0] + ' ' + A[1] + 'Q' + ctl[0].toFixed(1) + ' ' + ctl[1].toFixed(1) + ' ' + B[0] + ' ' + B[1];
    const D = 180 / Math.PI;
    const azC = Math.atan2(dx, -dy) * D, azT = Math.atan2(ctl[0] - A[0], -(ctl[1] - A[1])) * D;
    const ext = (P, az, r) => 'M' + P[0] + ' ' + P[1] + 'L' + (P[0] + r * Math.sin(az / D)).toFixed(1) + ' ' + (P[1] - r * Math.cos(az / D)).toFixed(1);
    let grade = '';
    for (let x = J.x0 + 90; x < J.x1; x += 120) grade += 'M' + x + ' ' + J.y0 + 'V' + J.y1;
    for (let y = J.y0 + 70; y < J.y1; y += 120) grade += 'M' + J.x0 + ' ' + y + 'H' + J.x1;
    const G = 9;                                          // γ desenhado (exagerado), NG a leste de NQ
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="gridl" style="stroke-width:1.4" d="' + grade + '"/>' +
      '<rect class="frame" x="' + J.x0 + '" y="' + J.y0 + '" width="' + (J.x1 - J.x0) + '" height="' + (J.y1 - J.y0) + '" style="stroke-width:1.5"/>' +
      '<path class="mc" d="M' + xMC + ' ' + J.y0 + 'V' + J.y1 + '"/>' +
      '<path class="geod r-geo" d="' + geo + '"/><path class="corda r-cor" d="M' + A[0] + ' ' + A[1] + 'L' + B[0] + ' ' + B[1] + '"/>' +
      '<path class="tang r-tan" d="' + ext(A, azT, 330) + '"/>' +
      '<path class="psiarc r-psi" d="' + A10.sector(A[0], A[1], azC, azT, 210) + '"/>' +
      '<path class="garc r-gam" d="' + A10.sector(A[0], A[1], 0, G, 250) + '"/>' +
      '<path class="nq r-nq" d="' + A10.arrow(A[0], A[1], 0, 300) + '"/><path class="ng r-ng" d="' + A10.arrow(A[0], A[1], G, 300) + '"/>' +
      '<circle class="marco" r="11" cx="' + A[0] + '" cy="' + A[1] + '"/><circle class="marco" r="11" cx="' + B[0] + '" cy="' + B[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['geo', 'cor', 'tan', 'psi', 'gam', 'nq', 'ng']) this.e[c] = svg.querySelector('.r-' + c);
    const L2 = (h, x, y, st) => A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-weight:700;font-size:26px;' + (st || ''));
    A10.lbl(kit, 'MC', xMC + 10, J.y0 + 8, 'font-family:var(--sans);font-size:24px;color:var(--accent)');
    L2('1', A[0] - 36, A[1] + 4); L2('2', B[0] + 18, B[1] - 30);
    const am = (az, r) => [A[0] + r * Math.sin(az / D), A[1] - r * Math.cos(az / D)];
    let q;
    this.l = {
      geo: L2('geodésica<br>projetada', 836, 640, 'color:var(--elip);line-height:1.15'),
      cor: L2('corda', mid[0] - 120, mid[1] - 54, 'color:var(--corda)'),
      tan: (q = am(azT, 340), L2('tangente', q[0] + 8, q[1] - 10, 'color:color-mix(in srgb, var(--main) 70%, var(--ground))')),
      psi: (q = am(azT + 14, 200), A10.lbl(kit, '<i>ψ</i>', q[0] - 6, q[1] - 22, 'color:var(--psi);font-size:40px')),
      nq: L2('NQ', A[0] - 30, A[1] - 350), ng: (q = am(G, 310), L2('NG', q[0] + 6, q[1] - 36, 'color:var(--accent)')),
      gam: (q = am(G / 2, 270), A10.lbl(kit, '<i>γ</i>', q[0] - 4, q[1] - 48, 'color:var(--accent);font-size:36px')),
    };
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">As direções: tangente, corda, <i>ψ</i> e <i>γ</i></h2>').querySelector('h2');
    const B2 = (y, html) => A10.bloco(kit, 1140, y, 700, html);
    this.t = [
      [B2(210, '<p class="sub">A projeção é <b>conforme</b>: preserva o ângulo entre curvas</p>'), kit.em('d1', 'conforme')],
      [B2(320, '<p class="sub">A <b style="color:var(--elip)">geodésica</b> vira uma curva na grade, com a concavidade voltada para o MC</p>'), kit.em('d1', 'vira')],
      [B2(465, '<p class="sub">As coordenadas usam a <b style="color:var(--corda)">corda</b>:</p><p class="eq"><i>E</i><sub>2</sub> = <i>E</i><sub>1</sub> + <i>D</i><sub>c</sub> sen Az<sub>C</sub></p>'), kit.em('d2', 'corda')],
      [B2(600, '<p class="sub"><b style="color:var(--psi)"><i>ψ</i></b>: redução angular, da tangente à corda</p>'), kit.em('d2', 'reducao')],
      [B2(700, '<p class="sub"><b style="color:var(--accent)"><i>γ</i></b>: convergência meridiana, do norte geográfico (NG) ao norte de quadrícula (NQ)</p>'), kit.em('d3', 'convergencia')],
      [A10.bloco(kit, 1140, 900, 700, '<p class="note">Esquema com ângulos muito exagerados: em Viçosa, <i>ψ</i> tem décimos de segundo e <i>γ</i>, −0°45′.</p>'), kit.em('d2', 'pequeno')],
    ];
    this.k = { geo: kit.em('d1', 'geodesica'), cor: kit.em('d2', 'reta'), tan: kit.em('d2', 'tangente'), psi: kit.em('d2', 'reducao'), ng: kit.em('d3', 'norte'), gam: kit.em('d3', 'convergencia') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, l = this.l;
    A10.draw(e.geo, eio(seg(t, k.geo, k.geo + 1.4))); A10.fade(l.geo, t, k.geo + 1.0);
    A10.draw(e.cor, eio(seg(t, k.cor, k.cor + 0.9))); A10.fade(l.cor, t, k.cor + 0.6);
    A10.draw(e.tan, eio(seg(t, k.tan - 0.2, k.tan + 0.6))); A10.fade(l.tan, t, k.tan + 0.3);
    e.psi.style.opacity = eo(seg(t, k.psi, k.psi + 0.6)); A10.fade(l.psi, t, k.psi + 0.2);
    const n = eo(seg(t, k.ng, k.ng + 0.6));
    e.nq.style.opacity = e.ng.style.opacity = n; l.nq.style.opacity = l.ng.style.opacity = n;
    e.gam.style.opacity = eo(seg(t, k.gam, k.gam + 0.6)); A10.fade(l.gam, t, k.gam + 0.2);
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
