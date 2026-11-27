// Cena 4 (53 a 66 s): visada de 1 km em Viçosa; Az geodésico → Az de quadrícula; erro de 13 m sem γ
const { seg, eo, eio, lerp, TextFx } = kit;
const O = { x: 470, y: 560 }, AMP = 10, L = 380;          // ângulos ampliados 10× no desenho
const AZ = 145 + 33 / 60 + 25 / 3600;
kit.scene('pratica', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const g = kit.json('v4-dados.json').vicosa.gamma;
    this.g = g; this.ng = -g * AMP;                          // NG a leste de NQ (γ < 0)
    const azq = AZ - g;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><path class="garc pr-aq" style="fill:color-mix(in srgb, var(--main) 10%, transparent);stroke:var(--main)"/>' +
      '<path class="garc pr-az"/><path class="garc pr-gm"/><path class="nq pr-nq"/><path class="ng pr-ngv"/>' +
      '<path class="wrong pr-w"/><path class="sight pr-s"/><path class="gap pr-gap"/>' +
      '<circle class="dot pr-e1" r="8"/><circle class="dot pr-e2" r="8" style="stroke:var(--tissot)"/><circle class="pole" r="9" cx="' + O.x + '" cy="' + O.y + '"/></svg>');
    kit.stage.append(svg);
    this.e = {}; for (const c of ['aq', 'az', 'gm', 'nq', 'ngv', 'w', 's', 'gap', 'e1', 'e2']) this.e[c] = svg.querySelector('.pr-' + c);
    const lab = (html, x, y, st) => { const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;' + (st || '') + '">' + html + '</div>'); kit.stage.append(e); return e.style; };
    const at = (a, r) => [O.x + r * Math.sin(a * A9V4.D), O.y - r * Math.cos(a * A9V4.D)];
    this.at = at;
    let q = at(0, 360); this.lnq = lab('NQ', q[0] - 62, q[1] - 10, 'font-family:var(--sans);font-weight:700;font-size:28px');
    q = at(this.ng, 360); this.lng = lab('NG', q[0] + 12, q[1] - 10, 'font-family:var(--sans);font-weight:700;font-size:28px;color:var(--accent)');
    q = at(this.ng / 2, 300); this.lgm = lab('<i>γ</i>', q[0] - 6, q[1] - 46, 'color:var(--accent)');
    q = at((this.ng + this.ng + AZ) / 2, 120); this.laz = lab('Az', q[0] + 6, q[1] - 16, 'color:var(--accent)');
    q = at(AZ / 2 + this.ng, 190); this.laq = lab('Az<sub>Q</sub>', q[0] + 8, q[1] - 16);
    this.lvi = lab('Viçosa', O.x - 120, O.y + 6, 'font-family:var(--sans);font-weight:700;font-size:26px');
    q = at(this.ng + AZ, L); const q2 = at(AZ, L);
    this.lkm = lab('1 km', (O.x + q[0]) / 2 - 92, (O.y + q[1]) / 2 - 10);
    this.l13 = lab('13 m', Math.max(q[0], q2[0]) + 18, (q[1] + q2[1]) / 2 - 10, 'color:var(--tissot);font-weight:700');
    this.lamp = lab('ângulos ampliados ' + AMP + '× no desenho', 150, 960, 'font-family:var(--sans);font-size:24px;color:color-mix(in srgb, var(--main) 65%, var(--ground))');
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1400px"><h2 class="line pr-hd">Do azimute geodésico ao azimute de quadrícula</h2></div>'));
    this.hd = kit.stage.querySelector('.pr-hd');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1040px;top:' + top + 'px;width:800px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t = [
      [p(200, '<p class="eq big"><span style="color:var(--accent)">Az</span> = 145°33′25″&ensp;<span class="note">(a partir de NG)</span></p>'), 3.0],
      [p(290, '<p class="eq big"><i>γ</i> = ' + A9V4.dms(g) + '&ensp;<span class="note">(Viçosa)</span></p>'), 4.2],
      [p(380, '<p class="eq big">Az<sub>Q</sub> = Az − <i>γ</i> = <b>' + A9V4.dms(azq, 0, false) + '</b>&ensp;(12)</p>'), 5.8],
      [p(540, '<p class="sub">Ignorar 45′ numa visada de 1 km desloca o ponto em <b style="color:var(--tissot)">13&nbsp;m</b></p>'), 9.0],
      [p(720, '<p class="note">Na Aula 10, a passagem para a quadrícula ganha a redução angular <i>ψ</i>.</p>'), 11.0],
    ];
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const f1 = A9V4.f1, at = this.at, ar = A9V4.arrow, sc = A9V4.sector, e = this.e;
    const n = eo(seg(t, 0.8, 1.5));
    e.nq.setAttribute('d', ar(O.x, O.y, 0, 330)); e.ngv.setAttribute('d', ar(O.x, O.y, this.ng, 330));
    e.gm.setAttribute('d', sc(O.x, O.y, 0, this.ng, 280));
    for (const k of ['nq', 'ngv', 'gm']) e[k].style.opacity = n;
    for (const s of [this.lnq, this.lng, this.lgm, this.lvi, this.lamp]) s.opacity = n;
    // Visada medida a partir de NG
    const s = eio(seg(t, 1.8, 2.8)), as = this.ng + AZ, end = at(as, L * s);
    e.s.setAttribute('d', 'M' + O.x + ' ' + O.y + 'L' + f1(end[0]) + ' ' + f1(end[1]));
    e.e1.setAttribute('cx', f1(end[0])); e.e1.setAttribute('cy', f1(end[1])); e.e1.style.opacity = s >= 1 ? 1 : 0;
    this.lkm.opacity = eo(seg(t, 2.6, 3.0));
    const az = eio(seg(t, 3.0, 3.8));
    e.az.setAttribute('d', az > 0 ? sc(O.x, O.y, this.ng, this.ng + AZ * az, 110) : ''); this.laz.opacity = eo(seg(t, 3.6, 4.0));
    const aq = eio(seg(t, 5.4, 6.2));
    e.aq.setAttribute('d', aq > 0 ? sc(O.x, O.y, 0, as * aq, 170) : ''); this.laq.opacity = eo(seg(t, 6.0, 6.4));
    // Sem γ: o mesmo Az aplicado a partir de NQ
    const w = eio(seg(t, 7.6, 8.6)), wend = at(AZ, L * w);
    e.w.setAttribute('d', w > 0 ? 'M' + O.x + ' ' + O.y + 'L' + f1(wend[0]) + ' ' + f1(wend[1]) : '');
    e.e2.setAttribute('cx', f1(wend[0])); e.e2.setAttribute('cy', f1(wend[1])); e.e2.style.opacity = w >= 1 ? 1 : 0;
    const gp = eo(seg(t, 8.6, 9.2)), a1 = at(as, L), a2 = at(AZ, L);
    e.gap.setAttribute('d', 'M' + f1(a1[0]) + ' ' + f1(a1[1]) + 'L' + f1(a2[0]) + ' ' + f1(a2[1])); e.gap.style.opacity = gp; this.l13.opacity = gp;
    for (const [st, a0] of this.t) { const k = eo(seg(t, a0, a0 + 0.6)); st.opacity = k; st.transform = 'translateX(' + lerp(26, 0, k) + 'px)'; }
  },
});
