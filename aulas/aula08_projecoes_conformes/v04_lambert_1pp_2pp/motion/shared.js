// V4: Lambert com 1 e 2 PP. Cena 3D (globo e cone), gráfico de m contra φ e mapa da Lambert (ESRI:102015, GRS80).
window.V4 = (function () {
  const D = Math.PI / 180;
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = v => v.toFixed(1);
  const fmt = (v, k) => v.toFixed(k).replace('.', ',');

  // ---------- Vista 3D (esfera unitária, câmera ortográfica 14° abaixo do Equador) ----------
  const LC = -50, ELEV = -14 * D, CE = Math.cos(ELEV), SE = Math.sin(ELEV);
  const V = { cx: 470, cy: 430, R: 190 };
  const VICOSA = { lam: -(42 + 52 / 60), phi: -(20 + 45 / 60) };
  function cam(x, yd, z) {
    const u = z * CE - yd * SE;
    return [V.cx + V.R * x, V.cy - V.R * u, yd * CE + z * SE];
  }
  function globePt(lam, phi) {
    const l = (lam - LC) * D, p = phi * D, cp = Math.cos(p);
    return cam(cp * Math.sin(l), cp * Math.cos(l), Math.sin(p));
  }
  function globeFill(lam, phi) {
    const q = globePt(lam, phi);
    if (q[2] >= 0) return q;
    const dx = q[0] - V.cx, dy = q[1] - V.cy, k = V.R / (Math.hypot(dx, dy) || 1);
    return [V.cx + dx * k, V.cy + dy * k, q[2]];
  }
  function lineD(pts) {
    let s = '', pen = false;
    for (const q of pts) {
      if (q[2] < 0) { pen = false; continue; }
      s += (pen ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); pen = true;
    }
    return s;
  }
  function ringD(pts) {
    let s = '';
    pts.forEach((q, i) => { s += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); });
    return s + 'Z';
  }
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  const GRAT = [];
  for (let lam = -180; lam < 180; lam += 15) { const a = []; for (let p = -90; p <= 90; p += 3) a.push([lam, p]); GRAT.push(a); }
  for (let p = -75; p <= 75; p += 15) { const a = []; for (let lam = -180; lam <= 180; lam += 3) a.push([lam, p]); GRAT.push(a); }

  // Cone de eixo no eixo de rotação, vértice abaixo do polo sul: semiângulo th (graus), vértice em z = za
  function coneTangent(s0) { return { th: s0, za: -1 / Math.sin(s0 * D) }; }
  function coneSecant(s1, s2) {   // corta a esfera nos paralelos −s1 e −s2
    const x1 = Math.cos(s1 * D), z1 = -Math.sin(s1 * D), x2 = Math.cos(s2 * D), z2 = -Math.sin(s2 * D);
    const th = Math.atan2(x1 - x2, z1 - z2), d2 = x2 / Math.sin(th);
    return { th: th / D, za: z2 - d2 * Math.cos(th) };
  }
  // Latitudes onde o cone corta a esfera: d² + 2 za cos(th) d + za² − 1 = 0
  function cuts(c) {
    const ct = Math.cos(c.th * D), disc = c.za * c.za * ct * ct - c.za * c.za + 1;
    if (disc < -1e-9) return [];
    const r = Math.sqrt(Math.max(0, disc));
    return [-c.za * ct - r, -c.za * ct + r].map(d => Math.asin(c.za + d * ct) / D);
  }
  function onCone(c, d, az) {
    const st = Math.sin(c.th * D), ct = Math.cos(c.th * D);
    return cam(d * st * Math.sin(az), d * st * Math.cos(az), c.za + d * ct);
  }

  function svg3d(kit, id) {
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="' + id + '-sph" cx="0.38" cy="0.3" r="0.8">' +
      '<stop offset="0" style="stop-color:var(--ground)"/>' +
      '<stop offset="1" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/></radialGradient></defs>' +
      '<circle class="v4-sph" style="fill:url(#' + id + '-sph)"/><path class="land v4-land"/><path class="grat v4-grat"/>' +
      '<circle class="limb v4-limb"/><path class="hl v4-cback" style="stroke-dasharray:8 8;opacity:.5"/>' +
      '<path class="surf v4-body"/><path class="surfedge v4-rims"/><path class="hl v4-cfront"/>' +
      '<circle class="dot v4-vic" r="8"/></svg>');
    const r = { svg };
    for (const c of ['sph', 'land', 'grat', 'limb', 'cback', 'body', 'rims', 'cfront', 'vic']) r[c] = svg.querySelector('.v4-' + c);
    for (const c of [r.sph, r.limb]) { c.setAttribute('cx', V.cx); c.setAttribute('cy', V.cy); c.setAttribute('r', V.R); }
    let d = '';
    for (const ring of kit.json('v4-dados.json').land) { const p = []; for (let i = 0; i < ring.length; i += 2) p.push(globeFill(ring[i], ring[i + 1])); d += ringD(p); }
    r.land.setAttribute('d', d);
    r.grat.setAttribute('d', GRAT.map(l => lineD(l.map(q => globePt(q[0], q[1])))).join(''));
    const v = globePt(VICOSA.lam, VICOSA.phi);
    r.vic.setAttribute('cx', v[0]); r.vic.setAttribute('cy', v[1]);
    r.vicXY = v;
    return r;
  }
  function paintCone(r, c, o) {
    const hi = (0.15 - c.za) / Math.cos(c.th * D), N = 96, top = [];
    for (let i = 0; i <= N; i++) top.push(onCone(c, hi, i / N * 2 * Math.PI));
    const apex = cam(0, 0, c.za);
    r.body.setAttribute('d', ringD(hull(top.concat([apex]))));
    let rims = ringD(top);
    const k = Math.sin(c.th * D) * SE / (Math.cos(c.th * D) * CE);
    if (Math.abs(k) <= 1) for (const sg of [-1, 1]) {
      const b = onCone(c, hi, sg * Math.acos(k));
      rims += 'M' + f1(apex[0]) + ' ' + f1(apex[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]);
    }
    r.rims.setAttribute('d', rims);
    r.body.style.opacity = o.body; r.rims.style.opacity = o.body;
    let fr = '', bk = '';
    for (const phi of cuts(c)) {
      const front = [], back = [];
      for (let lam = -180; lam <= 180; lam += 2) { const q = globePt(lam, phi); front.push(q); back.push([q[0], q[1], -q[2]]); }
      fr += lineD(front); bk += lineD(back);
    }
    r.cfront.setAttribute('d', fr); r.cback.setAttribute('d', bk);
    r.cfront.style.opacity = o.contact; r.cback.style.opacity = 0.5 * o.contact;
    r.vic.style.opacity = o.vic || 0;
  }

  // ---------- Gráfico de m contra φ (norte à esquerda) ----------
  const G = { x0: 1060, x1: 1840, y0: 900, y1: 290, p0: 10, p1: -55, m0: 0.9, m1: 1.12 };
  const GX = p => G.x0 + (G.p0 - p) / (G.p0 - G.p1) * (G.x1 - G.x0);
  const GY = m => G.y0 - (m - G.m0) / (G.m1 - G.m0) * (G.y0 - G.y1);
  function graph(kit, id) {
    const dados = kit.json('v4-dados.json');
    let grid = '';
    for (let p = 10; p >= -50; p -= 10) grid += 'M' + f1(GX(p)) + ' ' + G.y0 + 'V' + G.y1;
    for (let m = 0.925; m < G.m1; m += 0.025) grid += 'M' + G.x0 + ' ' + f1(GY(m)) + 'H' + G.x1;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="' + id + '-plot">' +
      '<rect x="' + G.x0 + '" y="' + G.y1 + '" width="' + (G.x1 - G.x0) + '" height="' + (G.y0 - G.y1) + '"/></clipPath></defs>' +
      '<g class="v4-axes"><rect class="v4-band band" y="' + G.y1 + '" height="' + (G.y0 - G.y1) + '"/>' +
      '<path class="gridl" d="' + grid + '"/>' +
      '<rect class="axisbox" x="' + G.x0 + '" y="' + G.y1 + '" width="' + (G.x1 - G.x0) + '" height="' + (G.y0 - G.y1) + '"/>' +
      '<path class="one" d="M' + G.x0 + ' ' + f1(GY(1)) + 'H' + G.x1 + '"/></g>' +
      '<g clip-path="url(#' + id + '-plot)"><path class="pp v4-pp"/><path class="ref1 v4-ghost"/><path class="ref1 v4-moving"/>' +
      '<path class="curve v4-solid"/></g><circle class="dot v4-gv" r="9"/><path class="lead v4-gvl"/></svg>');
    const r = { svg, m2: dados.m2, k: dados.k, step: dados.passo };
    for (const c of ['axes', 'band', 'pp', 'ghost', 'moving', 'solid', 'gv', 'gvl']) r[c] = svg.querySelector('.v4-' + c);
    r.band.setAttribute('x', GX(-5)); r.band.setAttribute('width', GX(-42) - GX(-5));
    r.gv.style.opacity = 0; r.gvl.style.opacity = 0;
    // Marcas dos eixos (texto)
    r.ticks = [];
    const tick = (html, x, y, cls) => { const el = kit.h('<div class="tick' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); r.ticks.push(el); };
    for (let p = 10; p >= -50; p -= 10) tick(p < 0 ? '−' + (-p) : String(p), GX(p) - (p < 0 ? 20 : 10), G.y0 + 10);
    for (let m = 0.9; m < G.m1 + 1e-9; m += 0.025) tick(fmt(m, 3), G.x0 - 72, GY(m) - 14);
    tick('Latitude <i>φ</i> (graus)', GX(-22.5) - 100, G.y0 + 46, ' eqt');
    tick('<i>m</i>', G.x0 - 50, G.y1 - 48, ' eqt');
    return r;
  }
  const m2At = (r, p) => {
    const i = (p - G.p0) / r.step, i0 = Math.max(0, Math.min(r.m2.length - 2, Math.floor(i)));
    return lerp(r.m2[i0], r.m2[i0 + 1], i - i0);
  };
  // Curva até a latitude pEnd, com fator f aplicado a m2/k (f = 1: 1 PP; f = k: 2 PP)
  function curveD(r, f, pEnd) {
    let s = '';
    for (let i = 0; i < r.m2.length; i++) {
      const p = G.p0 + i * r.step;
      if (p < pEnd) break;
      s += (i ? 'L' : 'M') + f1(GX(p)) + ' ' + f1(GY(r.m2[i] / r.k * f));
    }
    return s;
  }
  function ppD(list) {
    return list.map(p => 'M' + f1(GX(p)) + ' ' + G.y1 + 'V' + G.y0).join('');
  }

  // ---------- Lambert cônica conforme no GRS80 (ESRI:102015) ----------
  const A = 6378137, E2 = 0.00669438002290, EE = Math.sqrt(E2);
  const P1 = -5, P2 = -42, P0 = -32, L0 = -60;
  const mc = f => Math.cos(f) / Math.sqrt(1 - E2 * Math.sin(f) ** 2);
  const tt = f => { const g = -f; return Math.tan(Math.PI / 4 - g / 2) / Math.pow((1 - EE * Math.sin(g)) / (1 + EE * Math.sin(g)), EE / 2); };
  const NA = (Math.log(mc(P1 * D)) - Math.log(mc(P2 * D))) / (Math.log(tt(P1 * D)) - Math.log(tt(P2 * D)));
  const F = mc(P1 * D) / (NA * Math.pow(tt(P1 * D), NA));
  const RHO = f => A * F * Math.pow(tt(f * D), NA);
  const N = -NA;                                 // sinal do hemisfério sul: n = −0,406158
  // Hemisfério sul pela simetria φ → −φ: x igual, y com sinal trocado (vértice ao sul)
  function lcc(lam, phi) {
    const r = RHO(phi), g = NA * (lam - L0) * D;
    return [r * Math.sin(g), -(RHO(P0) - r * Math.cos(g))];
  }

  return { D, lerp, fmt, V, VICOSA, coneTangent, coneSecant, cuts, svg3d, paintCone,
    G, GX, GY, graph, curveD, ppD, m2At, lcc, N, L0, ringD, lineD };
})();
