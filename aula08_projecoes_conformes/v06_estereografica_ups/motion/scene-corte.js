// Cena 1 (0 a 15 s): globo em corte meridiano, plano tangente no polo sul, raios a partir do polo norte; ρ = 2R tan(c/2)
const { seg, eo, eio, lerp, TextFx } = kit;
const C1 = { cx: 560, cy: 400, R: 230, e: 15, lc: 0 };
const CS = [30, 60, 90];                 // distâncias angulares ao polo sul dos pontos com raio
kit.scene('corte', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V6.build(kit, 'corte');
    kit.stage.append(this.r.svg);
    const NS = 'http://www.w3.org/2000/svg';
    this.dots = CS.map(() => ['ptdot', 'ptdot'].map(() => {
      const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 8); c.setAttribute('class', 'ptdot');
      this.r.dots.append(c); return c;
    }));
    const lbl = (html, x, y) => { const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    const N = V6.cam(C1, 0, 0, 1), S = V6.cam(C1, 0, 0, -1);
    this.lN = lbl('N', N[0] - 46, N[1] - 30);
    this.lS = lbl('S', S[0] - 40, S[1] - 6);
    const a = V6.cam(C1, 0.33 * Math.sin(30 * V6.D), 0, -0.33 * Math.cos(30 * V6.D));
    this.lc = lbl('<i>c</i>', a[0] + 6, a[1] - 4);
    const q = V6.cam(C1, Math.tan(30 * V6.D), 0, -1);
    this.lr = lbl('<i>ρ</i>', q[0] - 10, q[1] + 6);
    this.lr.color = 'var(--accent)';
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px">' +
      '<h2 class="line">Estereográfica: perspectiva do antípoda</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1190px;top:' + top + 'px;width:660px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t1 = p(250, '<p class="sub">Globo em corte meridiano. Ponto de vista no polo norte; plano tangente no polo sul.</p>');
    this.t2 = p(470, '<p class="eq big"><i>ρ</i> = 2<i>R</i> tan(<i>c</i>/2)</p>');
    this.t3 = p(560, '<p class="sub"><i>c</i>: distância angular ao polo sul</p>');
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, -0.9);
    const g = this.r, st = { globe: 0, cut: 1, plane: eo(seg(t, 1.0, 2.0)), zp: -1, cutc: 0, n: eo(seg(t, 2.0, 2.6)), s: eo(seg(t, 1.0, 2.0)) };
    V6.paint(g, C1, st);
    this.lN.opacity = st.n; this.lS.opacity = st.s;
    // Raios N → P → Q, um de cada vez
    const N = V6.cam(C1, 0, 0, 1);
    let d = '';
    CS.forEach((c, i) => {
      const P = [Math.sin(c * V6.D), 0, -Math.cos(c * V6.D)], Q = V6.ray(P, -1);
      const ps = V6.cam(C1, ...P), qs = V6.cam(C1, ...Q), u = eio(seg(t, 3.0 + 1.3 * i, 4.2 + 1.3 * i));
      if (u > 0) d += 'M' + N[0] + ' ' + N[1] + 'L' + lerp(N[0], qs[0], u).toFixed(1) + ' ' + lerp(N[1], qs[1], u).toFixed(1);
      const [dp, dq] = this.dots[i];
      dp.setAttribute('cx', ps[0]); dp.setAttribute('cy', ps[1]); dp.style.opacity = u > 0.45 ? 1 : 0;
      dq.setAttribute('cx', qs[0]); dq.setAttribute('cy', qs[1]); dq.style.opacity = u > 0.98 ? 1 : 0;
    });
    g.rays.setAttribute('d', d);
    // Ângulo c (no centro, a partir de S) e ρ sobre o plano, para c = 60°
    const O = V6.cam(C1, 0, 0, 0), arc = [];
    for (let i = 0; i <= 20; i++) { const a = 60 * V6.D * i / 20; arc.push(V6.cam(C1, 0.3 * Math.sin(a), 0, -0.3 * Math.cos(a))); }
    const S = V6.cam(C1, 0, 0, -1), P60 = V6.cam(C1, Math.sin(60 * V6.D), 0, -Math.cos(60 * V6.D)), Q60 = V6.cam(C1, 2 * Math.tan(30 * V6.D), 0, -1);
    g.ang.setAttribute('d', 'M' + S[0] + ' ' + S[1] + 'L' + O[0] + ' ' + O[1] + 'L' + P60[0] + ' ' + P60[1] +
      arc.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(''));
    g.ang.style.opacity = eo(seg(t, 7.4, 8.0)); this.lc.opacity = eo(seg(t, 7.4, 8.0));
    g.rho.setAttribute('d', 'M' + S[0] + ' ' + S[1] + 'L' + Q60[0] + ' ' + Q60[1]);
    g.rho.style.opacity = eo(seg(t, 8.2, 8.8)); this.lr.opacity = eo(seg(t, 8.2, 8.8));
    for (const [s, a] of [[this.t1, 1.4], [this.t2, 9.2], [this.t3, 9.9]]) {
      const q = eo(seg(t, a, a + 0.6)); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    }
  },
});
