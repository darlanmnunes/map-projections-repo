// V1: fusos UTM. Globo em projeção ortográfica (esfera R = 1) e mapa-múndi em coordenadas (λ, φ).
// Fuso F: de 6F − 186° a 6F − 180°, MC em 6F − 183°, de 80° S a 84° N.
window.A9V1 = (function () {
  const D = Math.PI / 180;
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = v => v.toFixed(1);
  const S80 = -80, N84 = 84;
  const VIC = { lam: -(42 + 52 / 60), phi: -(20 + 45 / 60) };
  const west = F => 6 * F - 186, mc = F => 6 * F - 183;
  const BR = F => F >= 18 && F <= 25;

  function ringD(pts) { let s = ''; pts.forEach((q, i) => { s += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); }); return s + 'Z'; }
  function lineD(pts) {
    let s = '', pen = false;
    for (const q of pts) { if (q[2] < 0) { pen = false; continue; } s += (pen ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); pen = true; }
    return s;
  }
  // Contorno de um fuso: bordas em meridianos, topo e base em 84° N e 80° S
  function zoneRing(F) {
    const a = west(F), b = a + 6, r = [];
    for (let p = S80; p <= N84; p += 2) r.push([a, p]);
    for (let l = a; l <= b; l += 1) r.push([l, N84]);
    for (let p = N84; p >= S80; p -= 2) r.push([b, p]);
    for (let l = b; l >= a; l -= 1) r.push([l, S80]);
    return r;
  }

  // Câmera ortográfica: C = {cx, cy, R, e, lc}; e é a latitude do centro da vista
  const vec = (lam, phi) => [Math.cos(phi * D) * Math.cos(lam * D), Math.cos(phi * D) * Math.sin(lam * D), Math.sin(phi * D)];
  const cam = (C, lam, phi) => camV(C, vec(lam, phi));
  function camV(C, v) {                     // v no referencial absoluto (X para 0°, Y para 90° E, Z norte)
    const l = C.lc * D, x = -Math.sin(l) * v[0] + Math.cos(l) * v[1], yd = Math.cos(l) * v[0] + Math.sin(l) * v[1];
    const ce = Math.cos(C.e * D), se = Math.sin(C.e * D);
    return [C.cx + C.R * x, C.cy - C.R * (v[2] * ce - yd * se), yd * ce + v[2] * se];
  }
  // Polígono no globo: pontos do hemisfério oculto vão para o limbo
  function fillD(C, ring) {
    const p = ring.map(q => {
      const r = cam(C, q[0], q[1]);
      if (r[2] < 0) { const dx = r[0] - C.cx, dy = r[1] - C.cy, k = C.R / (Math.hypot(dx, dy) || 1); r[0] = C.cx + dx * k; r[1] = C.cy + dy * k; }
      return r;
    });
    return p.some(q => q[2] > 0) ? ringD(p) : '';
  }
  const pairs = flat => { const out = []; for (let i = 0; i < flat.length; i += 2) out.push([flat[i], flat[i + 1]]); return out; };

  const GRAT = [];
  for (let p = -60; p <= 60; p += 30) { const a = []; for (let l = -180; l <= 180; l += 2) a.push([l, p]); GRAT.push(a); }

  function buildGlobe(kit, id) {
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="' + id + '-sph" cx="0.38" cy="0.3" r="0.8">' +
      '<stop offset="0" style="stop-color:var(--ground)"/>' +
      '<stop offset="1" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/></radialGradient></defs>' +
      '<circle class="g-sph" style="fill:url(#' + id + '-sph)"/><path class="land g-land"/><path class="grat g-grat"/>' +
      '<path class="zodd g-odd"/><path class="zbr g-br"/><path class="z23 g-23"/><path class="zline g-zl"/><circle class="limb g-limb"/>' +
      '<path class="surf g-body"/><path class="surfedge g-rims"/><path class="secl g-sec"/></svg>');
    const r = { svg, rings: kit.json('v1-dados.json').land.map(pairs) };
    for (const c of ['sph', 'land', 'grat', 'odd', 'br', '23', 'zl', 'limb', 'body', 'rims', 'sec']) r[c] = svg.querySelector('.g-' + c);
    return r;
  }
  // Cilindro transverso secante (raio k0 = 0,9996) com o eixo no plano do Equador, perpendicular ao MC λc.
  // Corta a esfera em dois círculos de raio k0, a ±√(1 − k0²) ao longo do eixo: as linhas de secância.
  const K0 = 0.9996, HALF = 1.15;
  function cylRing(lc, s, rc, n) {
    const u = vec(lc, 0), a = [-Math.sin(lc * D), Math.cos(lc * D), 0], out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n * 2 * Math.PI, c = rc * Math.cos(t), z = rc * Math.sin(t);
      out.push([a[0] * s + u[0] * c, a[1] * s + u[1] * c, z]);
    }
    return out;
  }
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // cyl = {lc: MC do cilindro, op: opacidade}
  function paintCyl(r, C, cyl) {
    const top = cylRing(cyl.lc, HALF, K0, 96).map(v => camV(C, v)), bot = cylRing(cyl.lc, -HALF, K0, 96).map(v => camV(C, v));
    r.body.setAttribute('d', ringD(hull(top.concat(bot))));
    r.rims.setAttribute('d', ringD(top) + ringD(bot));
    const sh = Math.sqrt(1 - K0 * K0);
    r.sec.setAttribute('d', [sh, -sh].map(s => lineD(cylRing(cyl.lc, s, K0, 720).map(v => camV(C, v)))).join(''));
    // corpo bem transparente, para os fusos aparecerem através do cilindro
    r.body.style.opacity = 0.4 * cyl.op; r.rims.style.opacity = 0.8 * cyl.op; r.sec.style.opacity = cyl.op;
  }

  // st = {k: fusos revelados (0 a 60), br, z23, cyl}
  function paintGlobe(r, C, st) {
    for (const c of [r.sph, r.limb]) { c.setAttribute('cx', f1(C.cx)); c.setAttribute('cy', f1(C.cy)); c.setAttribute('r', f1(C.R)); }
    r.land.setAttribute('d', r.rings.map(ring => fillD(C, ring)).join(''));
    r.grat.setAttribute('d', GRAT.map(g => lineD(g.map(q => cam(C, q[0], q[1])))).join(''));
    let odd = '', br = '', z23 = '', zl = '';
    for (let F = 1; F <= Math.min(60, Math.floor(st.k)); F++) {
      if (F % 2) odd += fillD(C, zoneRing(F));
      if (BR(F) && F !== 23) br += fillD(C, zoneRing(F));
      if (F === 23) z23 = fillD(C, zoneRing(F));
      const e = []; for (let p = S80; p <= N84; p += 2) e.push(cam(C, west(F), p));
      zl += lineD(e);
    }
    r.odd.setAttribute('d', odd);
    r.br.setAttribute('d', br); r.br.style.opacity = st.br || 0;
    r['23'].setAttribute('d', z23); r['23'].style.opacity = st.z23 || 0;
    r.zl.setAttribute('d', zl);
    paintCyl(r, C, st.cyl || { lc: 0, op: 0 });
  }

  // Mapa (λ, φ) → tela: janela W = {l0, l1, p0, p1} sobre o retângulo B = {x, y, w, h}
  const mapXY = (W, B, lam, phi) => [B.x + (lam - W.l0) / (W.l1 - W.l0) * B.w, B.y + (W.p1 - phi) / (W.p1 - W.p0) * B.h];
  const mix = (a, b, u) => { const o = {}; for (const k in a) o[k] = lerp(a[k], b[k], u); return o; };
  function polyD(W, B, rings) { let d = ''; for (const r of rings) d += ringD(r.map(q => mapXY(W, B, q[0], q[1]))); return d; }

  return { D, lerp, VIC, S80, N84, west, mc, BR, zoneRing, cam, buildGlobe, paintGlobe, pairs, mapXY, mix, polyD, ringD };
})();
