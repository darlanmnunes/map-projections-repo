// V6: construção perspectiva da estereográfica polar sul (esfera R = 1) e o plano secante do UPS.
// Ponto de vista no polo norte N = (0, 0, 1); plano horizontal z = zp (zp = −1: tangente; −(2k0 − 1): secante).
window.V6 = (function () {
  const D = Math.PI / 180;
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = v => v.toFixed(1);
  const K0 = 0.994, ZSEC = -(2 * K0 - 1), RP = 2.3;

  // Câmera ortográfica: C = {cx, cy, R, e (elevação, graus), lc}; e > 0 vê de cima, e < 0 de baixo
  function cam(C, x, yd, z) {
    const ce = Math.cos(C.e * D), se = Math.sin(C.e * D);
    return [C.cx + C.R * x, C.cy - C.R * (z * ce - yd * se), yd * ce + z * se];
  }
  const geo = (C, lam, phi) => {
    const l = (lam - C.lc) * D, p = phi * D, cp = Math.cos(p);
    return [cp * Math.sin(l), cp * Math.cos(l), Math.sin(p)];
  };
  // Raio de N por P até o plano z = zp
  function ray(P, zp) { const t = (1 - zp) / (1 - P[2]); return [t * P[0], t * P[1], zp]; }

  function ringD(pts) { let s = ''; pts.forEach((q, i) => { s += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); }); return s + 'Z'; }
  function lineD(pts) {
    let s = '', pen = false;
    for (const q of pts) { if (q[2] < 0) { pen = false; continue; } s += (pen ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); pen = true; }
    return s;
  }
  const GRAT = [];
  for (let lam = -180; lam < 180; lam += 30) { const a = []; for (let p = -90; p <= 90; p += 3) a.push([lam, p]); GRAT.push(a); }
  for (let p = -75; p <= 75; p += 15) { const a = []; for (let lam = -180; lam <= 180; lam += 3) a.push([lam, p]); GRAT.push(a); }
  // Círculo menor de raio angular r (graus) em torno de (lam0, phi0)
  function smallCircle(lam0, phi0, r, n) {
    const p1 = phi0 * D, d = r * D, out = [];
    for (let i = 0; i <= n; i++) {
      const th = i / n * 2 * Math.PI;
      const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(th));
      const l2 = lam0 * D + Math.atan2(Math.sin(th) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
      out.push([l2 / D, p2 / D]);
    }
    return out;
  }

  function build(kit, id) {
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="' + id + '-sph" cx="0.38" cy="0.3" r="0.8">' +
      '<stop offset="0" style="stop-color:var(--ground)"/>' +
      '<stop offset="1" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/></radialGradient>' +
      '<clipPath id="' + id + '-win"><rect class="v6-winr" x="0" y="0" width="1920" height="1080"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + '-win)">' +
      '<path class="surf v6-pback"/>' +
      '<g class="v6-glob"><circle class="v6-sph" style="fill:url(#' + id + '-sph)"/><path class="land v6-land"/><path class="grat v6-grat"/></g>' +
      '<path class="cutface v6-cut"/><circle class="limb v6-limb"/>' +
      '<path class="surf v6-pfront"/><path class="surfedge v6-pedge"/>' +
      '<path class="hl v6-cutc"/><path class="rayl v6-rays"/><path class="hl v6-rho"/><path class="angnav v6-ang"/>' +
      '<path class="tis v6-sc"/><path class="tis v6-pc"/>' +
      '<circle class="pole v6-n" r="9"/><circle class="pole v6-s" r="7"/><g class="v6-dots"></g></g>' +
      '<rect class="winframe v6-winf"/></svg>');
    const r = { svg, land: kit.json('v6-dados.json').land };
    for (const c of ['winr', 'pback', 'glob', 'sph', 'land', 'grat', 'cut', 'limb', 'pfront', 'pedge', 'cutc', 'rays', 'rho', 'ang', 'sc', 'pc', 'n', 's', 'dots', 'winf'])
      r[c === 'land' ? 'landEl' : c] = svg.querySelector('.v6-' + c);
    return r;
  }

  // st = {globe, cut, plane, zp, cutc, n, s}
  function paint(r, C, st) {
    const O = cam(C, 0, 0, 0);
    for (const c of [r.sph, r.limb]) { c.setAttribute('cx', f1(O[0])); c.setAttribute('cy', f1(O[1])); c.setAttribute('r', f1(C.R)); }
    r.glob.style.opacity = st.globe;
    if (st.globe > 0) {
      let d = '';
      for (const ring of r.land) {
        const p = [];
        for (let i = 0; i < ring.length; i += 2) {
          const q = cam(C, ...geo(C, ring[i], ring[i + 1]));
          if (q[2] < 0) { const dx = q[0] - O[0], dy = q[1] - O[1], k = C.R / (Math.hypot(dx, dy) || 1); q[0] = O[0] + dx * k; q[1] = O[1] + dy * k; }
          p.push(q);
        }
        d += ringD(p);
      }
      r.landEl.setAttribute('d', d);
      r.grat.setAttribute('d', GRAT.map(l => lineD(l.map(q => cam(C, ...geo(C, q[0], q[1]))))).join(''));
    }
    // Face do corte meridiano (plano yd = 0)
    const cut = [];
    for (let i = 0; i <= 96; i++) { const a = i / 96 * 2 * Math.PI; cut.push(cam(C, Math.sin(a), 0, Math.cos(a))); }
    r.cut.setAttribute('d', ringD(cut));
    r.cut.style.opacity = st.cut;
    // Plano: metade de trás antes do globo, metade da frente depois (vista de baixo: tudo na frente)
    const zp = st.zp, half = (a0, a1) => {
      const p = [];
      for (let i = 0; i <= 48; i++) { const a = lerp(a0, a1, i / 48); p.push(cam(C, RP * Math.cos(a), RP * Math.sin(a), zp)); }
      return p;
    };
    const front = half(0, Math.PI), back = half(Math.PI, 2 * Math.PI);
    if (C.e >= 0) { r.pback.setAttribute('d', ringD(back)); r.pfront.setAttribute('d', ringD(front)); }
    else { r.pback.setAttribute('d', ''); r.pfront.setAttribute('d', ringD(front.concat(back))); }
    r.pedge.setAttribute('d', ringD(front.concat(back)));
    for (const c of [r.pback, r.pfront, r.pedge]) c.style.opacity = st.plane;
    // Círculo em que o plano corta a esfera
    if (zp > -1 && st.cutc > 0) {
      const rr = Math.sqrt(1 - zp * zp), p = [];
      for (let i = 0; i <= 96; i++) { const a = i / 96 * 2 * Math.PI; p.push(cam(C, rr * Math.cos(a), rr * Math.sin(a), zp)); }
      r.cutc.setAttribute('d', ringD(p));
    } else r.cutc.setAttribute('d', '');
    r.cutc.style.opacity = st.cutc || 0;
    const N = cam(C, 0, 0, 1), S = cam(C, 0, 0, -1);
    r.n.setAttribute('cx', f1(N[0])); r.n.setAttribute('cy', f1(N[1])); r.n.style.opacity = st.n;
    r.s.setAttribute('cx', f1(S[0])); r.s.setAttribute('cy', f1(S[1])); r.s.style.opacity = st.s;
    return { N, S, O };
  }

  return { D, lerp, K0, ZSEC, RP, cam, geo, ray, smallCircle, ringD, lineD, build, paint };
})();
