// V7: globo e cilindro (esfera R = 1). O cilindro gira 90° em torno do eixo que passa por (λ0, 0°):
// tangente ao Equador (Mercator) → tangente ao meridiano λ0 (TM); com raio k0 < 1, corta a esfera em duas linhas.
window.V7 = (function () {
  const D = Math.PI / 180;
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = v => v.toFixed(1);
  const L0 = -45, K0 = 0.9996;
  const VIC = { lam: -(42 + 52 / 60), phi: -(20 + 45 / 60) };

  // Câmera ortográfica: C = {cx, cy, R, e, lc}; e é a latitude do centro da vista
  function cam(C, v) {                      // v no referencial absoluto (X para 0°, Y para 90° E, Z norte)
    const l = C.lc * D, x = -Math.sin(l) * v[0] + Math.cos(l) * v[1], yd = Math.cos(l) * v[0] + Math.sin(l) * v[1], z = v[2];
    const ce = Math.cos(C.e * D), se = Math.sin(C.e * D);
    return [C.cx + C.R * x, C.cy - C.R * (z * ce - yd * se), yd * ce + z * se];
  }
  const vec = (lam, phi) => [Math.cos(phi * D) * Math.cos(lam * D), Math.cos(phi * D) * Math.sin(lam * D), Math.sin(phi * D)];
  const add = (a, b, k) => [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  function ringD(pts) { let s = ''; pts.forEach((q, i) => { s += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); }); return s + 'Z'; }
  function lineD(pts) {
    let s = '', pen = false;
    for (const q of pts) { if (q[2] < 0) { pen = false; continue; } s += (pen ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); pen = true; }
    return s;
  }
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  const GRAT = [];
  for (let lam = -180; lam < 180; lam += 15) { const a = []; for (let p = -90; p <= 90; p += 2) a.push([lam, p]); GRAT.push(a); }
  for (let p = -75; p <= 75; p += 15) { const a = []; for (let lam = -180; lam <= 180; lam += 2) a.push([lam, p]); GRAT.push(a); }

  // Eixo do cilindro depois de girar θ em torno de r0 = (λ0, 0°): a = z cos θ + (r0 × z) sen θ
  const R0 = vec(L0, 0);
  function axis(th) { const k = cross(R0, [0, 0, 1]); return add([0, 0, Math.cos(th * D)], k, Math.sin(th * D)); }
  // Círculo de raio rc no plano ⟂ a, deslocado s ao longo de a; u = r0, v = a × u
  function ring(a, s, rc, n) {
    const v = cross(a, R0), out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n * 2 * Math.PI;
      out.push(add(add([a[0] * s, a[1] * s, a[2] * s], R0, rc * Math.cos(t)), v, rc * Math.sin(t)));
    }
    return out;
  }

  function build(kit, id) {
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="' + id + '-sph" cx="0.38" cy="0.3" r="0.8">' +
      '<stop offset="0" style="stop-color:var(--ground)"/>' +
      '<stop offset="1" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/></radialGradient></defs>' +
      '<circle class="v7-sph" style="fill:url(#' + id + '-sph)"/><path class="land v7-land"/><path class="grat v7-grat"/>' +
      '<path class="zone v7-zone"/><path class="zedge v7-zedge"/><circle class="limb v7-limb"/>' +
      '<path class="hl v7-cback" style="stroke-dasharray:8 8;opacity:.5"/>' +
      '<path class="surf v7-body"/><path class="surfedge v7-rims"/><path class="hl v7-cfront"/>' +
      '<path class="secl v7-sec"/><path class="tis v7-tis"/><circle class="dot v7-vic" r="9"/></svg>');
    const r = { svg, landData: kit.json('v7-dados.json').land };
    for (const c of ['sph', 'land', 'grat', 'zone', 'zedge', 'limb', 'cback', 'body', 'rims', 'cfront', 'sec', 'tis', 'vic']) r[c] = svg.querySelector('.v7-' + c);
    return r;
  }

  // st = {th, rc, body, contact, zone, vic, tis, sec}
  function paint(r, C, st) {
    const O = cam(C, [0, 0, 0]);
    for (const c of [r.sph, r.limb]) { c.setAttribute('cx', f1(O[0])); c.setAttribute('cy', f1(O[1])); c.setAttribute('r', f1(C.R)); }
    const P = (lam, phi) => cam(C, vec(lam, phi));
    let d = '';
    for (const ringL of r.landData) {
      const p = [];
      for (let i = 0; i < ringL.length; i += 2) {
        const q = P(ringL[i], ringL[i + 1]);
        if (q[2] < 0) { const dx = q[0] - O[0], dy = q[1] - O[1], k = C.R / (Math.hypot(dx, dy) || 1); q[0] = O[0] + dx * k; q[1] = O[1] + dy * k; }
        p.push(q);
      }
      d += ringD(p);
    }
    r.land.setAttribute('d', d);
    r.grat.setAttribute('d', GRAT.map(l => lineD(l.map(q => P(q[0], q[1])))).join(''));
    // Fuso 23 (−48° a −42°, de 80° S a 84° N)
    const z = [];
    for (let p = -80; p <= 84; p += 2) z.push(P(-48, p));
    for (let p = 84; p >= -80; p -= 2) z.push(P(-42, p));
    r.zone.setAttribute('d', ringD(z)); r.zone.style.opacity = st.zone || 0;
    const e1 = [], e2 = [];
    for (let p = -80; p <= 84; p += 1) { e1.push(P(-48, p)); e2.push(P(-42, p)); }
    r.zedge.setAttribute('d', lineD(e1) + lineD(e2)); r.zedge.style.opacity = st.zedge || 0;
    // Cilindro
    const a = axis(st.th), rc = st.rc, h = 1.1;
    const top = ring(a, h, rc, 96).map(v => cam(C, v)), bot = ring(a, -h, rc, 96).map(v => cam(C, v));
    r.body.setAttribute('d', ringD(hull(top.concat(bot))));
    r.rims.setAttribute('d', ringD(top) + ringD(bot));
    r.body.style.opacity = st.body; r.rims.style.opacity = st.body;
    // Contato: com rc = 1, o círculo máximo ⟂ a; com rc < 1, dois círculos menores (linhas de secância)
    const sh = Math.sqrt(Math.max(0, 1 - rc * rc));
    const curves = sh < 1e-6 ? [ring(a, 0, 1, 180)] : [ring(a, sh, rc, 360), ring(a, -sh, rc, 360)];
    let fr = '', bk = '';
    for (const cv of curves) { const q = cv.map(v => cam(C, v)); fr += lineD(q); bk += lineD(q.map(p => [p[0], p[1], -p[2]])); }
    r.cfront.setAttribute('d', sh < 1e-6 ? fr : lineD(ring(a, 0, 1, 360).map(v => cam(C, v))));
    r.sec.setAttribute('d', sh < 1e-6 ? '' : fr);
    r.cback.setAttribute('d', sh < 1e-6 ? bk : '');
    r.cfront.style.opacity = st.contact; r.cback.style.opacity = 0.5 * st.contact; r.sec.style.opacity = st.sec || 0;
    // Viçosa e indicatrizes (raio angular ∝ m da TM tangente, ao longo do paralelo de Viçosa)
    const v = P(VIC.lam, VIC.phi);
    r.vic.setAttribute('cx', f1(v[0])); r.vic.setAttribute('cy', f1(v[1])); r.vic.style.opacity = st.vic || 0;
    let t = '';
    for (const dl of [-45, -30, -15, 0, 15, 30, 45]) {
      const B = Math.cos(VIC.phi * D) * Math.sin(dl * D), m = 1 / Math.sqrt(1 - B * B);
      t += ringD(small(L0 + dl, VIC.phi, 3.2 * m).map(q => P(q[0], q[1])));
    }
    r.tis.setAttribute('d', t); r.tis.style.opacity = st.tis || 0;
    return { v, P };
  }
  function small(lam0, phi0, rr) {
    const p1 = phi0 * D, d = rr * D, out = [];
    for (let i = 0; i <= 48; i++) {
      const th = i / 48 * 2 * Math.PI;
      const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(th));
      const l2 = lam0 * D + Math.atan2(Math.sin(th) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
      out.push([l2 / D, p2 / D]);
    }
    return out;
  }

  function sig(kit) { kit.stage.append(kit.h('<div class="sig">Prof. Dr. Darlan M. Nunes</div>')); }

  return { D, lerp, L0, K0, VIC, cam, vec, build, paint, sig };
})();
