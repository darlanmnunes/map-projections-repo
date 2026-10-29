// V3: família cônica conforme normal (esfera R = 1, vértice no polo sul) e cena 3D comuns às cenas.
//   s = −φ, ψs = ln tan(45° + s/2), ρ = C e^(−n ψs), γ = n (λ − λ0), n = sen s0,
//   C = (cos s0 / n) e^(n ψs0) = (1 + sen s0) tan(45° + s0/2)^(n − 1) / n,  m = n ρ / cos φ
window.V3 = (function () {
  const D = Math.PI / 180;
  const L0 = -45;                                   // λ0
  const ELEV = -14 * D;                             // câmera um pouco abaixo do Equador
  const CE = Math.cos(ELEV), SE = Math.sin(ELEV);
  const V = { cx: 470, cy: 450, R: 190 };           // vista 3D
  const MAP = { x: 1400, y: 250, S: 137 };          // mapa: Equador em λ0 fica em (x, y)
  const S_MAX = 80, R0 = 6 * D;                     // limite sul; raio das indicatrizes
  const TISSOT = { dl: [-60, 0, 60], s: [10, 30, 50, 70] };
  const NMIN = 1e-4;                                // "n = 0": Mercator no limite
  const lerp = (a, b, u) => a + (b - a) * u;
  const tanH = s => Math.tan(Math.PI / 4 + s * D / 2);

  function family(n) {
    n = Math.max(NMIN, Math.min(1, n));
    const s0 = Math.asin(n) / D;
    const C = (1 + Math.sin(s0 * D)) * Math.pow(tanH(s0), n - 1) / n;
    return { n, s0, C, rho0: Math.cos(s0 * D) / n, za: -1 / n };
  }
  const rho = (f, s) => s >= 90 ? 0 : f.C * Math.pow(tanH(s), -f.n);
  const scaleM = (f, s) => f.n * rho(f, s) / Math.cos(s * D);
  // Coordenadas no plano do cone desenvolvido, com origem no vértice e o Equador para cima
  function dev(f, dl, s) {
    const r = rho(f, s), g = f.n * dl * D;
    return [r * Math.sin(g), r * Math.cos(g)];
  }

  // Câmera ortográfica: x para leste, yd para o observador, z para o norte
  function cam(x, yd, z) {
    const u = z * CE - yd * SE;
    return [V.cx + V.R * x, V.cy - V.R * u, yd * CE + z * SE];
  }
  function globePt(lam, phi) {
    const l = (lam - L0) * D, p = phi * D, cp = Math.cos(p);
    return cam(cp * Math.sin(l), cp * Math.cos(l), Math.sin(p));
  }
  function globeFill(lam, phi) {
    const q = globePt(lam, phi);
    if (q[2] >= 0) return q;
    const dx = q[0] - V.cx, dy = q[1] - V.cy, k = V.R / (Math.hypot(dx, dy) || 1);
    return [V.cx + dx * k, V.cy + dy * k, q[2]];
  }
  // Ponto do plano desenvolvido sobre um cone de constante n1 ≥ n (n1 = n: o cone; n1 = 1: plano),
  // com o vértice fixo: é o desenrolar isométrico
  function onCone(f, n1, P) {
    const r = Math.hypot(P[0], P[1]), g = Math.atan2(P[0], P[1]);
    const th = g / n1, rh = r * n1, z = f.za + r * Math.sqrt(Math.max(0, 1 - n1 * n1));
    const q = cam(rh * Math.sin(th), rh * Math.cos(th), z);
    q[2] = Math.sqrt(Math.max(0, 1 - n1 * n1)) * Math.cos(th) * CE - n1 * SE;   // face voltada à câmera
    return q;
  }
  function toMap(f, L, P) {
    return [L.x + L.S * P[0], L.y - L.S * (P[1] - f.C), 1];
  }

  const f1 = v => v.toFixed(1);
  function lineD(pts) {          // pts: [[x, y, vis], ...]; quebra onde vis < 0
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

  // ---------- Globo ----------
  const GRAT = [];
  for (let lam = -180; lam < 180; lam += 15) { const a = []; for (let p = -90; p <= 90; p += 3) a.push([lam, p]); GRAT.push(a); }
  for (let p = -75; p <= 75; p += 15) { const a = []; for (let lam = -180; lam <= 180; lam += 3) a.push([lam, p]); GRAT.push(a); }
  function smallCircle(lam0, phi0, r, n) {   // círculo menor de raio angular r (graus)
    const p1 = phi0 * D, d = r * D, out = [];
    for (let i = 0; i <= n; i++) {
      const th = i / n * 2 * Math.PI;
      const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(th));
      const l2 = lam0 * D + Math.atan2(Math.sin(th) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
      out.push([l2 / D, p2 / D]);
    }
    return out;
  }
  const GTIS = [];
  for (const dl of TISSOT.dl) for (const s of TISSOT.s) GTIS.push(smallCircle(L0 + dl, -s, R0 / D, 48));

  function svgOpen(id) {
    return '<svg class="art" viewBox="0 0 1920 1080"><defs><radialGradient id="' + id + '-sph" cx="0.38" cy="0.3" r="0.8">' +
      '<stop offset="0" style="stop-color:var(--ground)"/>' +
      '<stop offset="1" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/></radialGradient></defs>';
  }
  function globe(kit, id) {
    const svg = kit.h(svgOpen(id) +
      '<g class="v3-glob"><circle class="v3-sph" style="fill:url(#' + id + '-sph)"/><path class="land v3-land"/>' +
      '<path class="grat v3-grat"/><circle class="limb v3-limb"/><path class="tis v3-gtis"/>' +
      '<path class="hl v3-cback" style="stroke-dasharray:8 8;opacity:.5"/></g>' +
      '<path class="surf v3-body"/><path class="surfedge v3-rims"/>' +
      '<path class="hl v3-cfront"/></svg>');
    const r = { svg }, land = kit.json('v3-dados.json').land;
    for (const c of ['glob', 'sph', 'land', 'grat', 'limb', 'gtis', 'cback', 'body', 'rims', 'cfront']) r[c] = svg.querySelector('.v3-' + c);
    for (const c of [r.sph, r.limb]) { c.setAttribute('cx', V.cx); c.setAttribute('cy', V.cy); c.setAttribute('r', V.R); }
    let d = '';
    for (const ring of land) { const p = []; for (let i = 0; i < ring.length; i += 2) p.push(globeFill(ring[i], ring[i + 1])); d += ringD(p); }
    r.land.setAttribute('d', d);
    r.grat.setAttribute('d', GRAT.map(l => lineD(l.map(q => globePt(q[0], q[1])))).join(''));
    r.gtis.setAttribute('d', GTIS.map(c => ringD(c.map(q => globePt(q[0], q[1])))).join(''));
    return r;
  }
  // Fecho convexo (cadeia monótona): a projeção ortográfica de um tronco de cone é convexa
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [], upper = [];
    for (const q of p) { while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
    return lower.slice(0, -1).concat(upper.slice(0, -1));
  }
  // Superfície de projeção da família n: corpo semitransparente, bordas e linha de contato
  function bodyRange(f) {
    return [Math.max(0, f.rho0 - 1.9), Math.min(f.C * Math.pow(tanH(-30), -f.n), f.rho0 + 1.3)];
  }
  function paintSurface(r, f, o) {
    const [lo, hi] = bodyRange(f), g0 = Math.PI * f.n, N = 96;
    const arc = (rr, rev) => {
      const a = [];
      for (let i = 0; i <= N; i++) { const g = -g0 + 2 * g0 * (rev ? N - i : i) / N; a.push(onCone(f, f.n, [rr * Math.sin(g), rr * Math.cos(g)])); }
      return a;
    };
    const top = arc(hi, false), bot = arc(lo, true);
    r.body.setAttribute('d', ringD(hull(top.concat(bot))));
    let rims = ringD(top).slice(0, -1) + (lo > 0 ? ringD(bot).slice(0, -1) : '');
    // Geratrizes do contorno aparente
    const c = f.n * SE / (Math.sqrt(1 - f.n * f.n) * CE);
    if (Math.abs(c) <= 1) for (const sg of [-1, 1]) {
      const g = sg * Math.acos(c) * f.n;
      const a = onCone(f, f.n, [lo * Math.sin(g), lo * Math.cos(g)]), b = onCone(f, f.n, [hi * Math.sin(g), hi * Math.cos(g)]);
      rims += 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]);
    }
    r.rims.setAttribute('d', rims);
    r.body.style.opacity = o.body; r.rims.style.opacity = o.body;
    // Linha de contato: paralelo s0 no globo
    const front = [], back = [];
    for (let lam = -180; lam <= 180; lam += 2) { const q = globePt(lam, -f.s0); front.push(q); back.push([q[0], q[1], -q[2]]); }
    r.cfront.setAttribute('d', lineD(front));
    r.cback.setAttribute('d', lineD(back));
    r.cfront.style.opacity = o.contact; r.cback.style.opacity = 0.5 * o.contact;
  }

  // ---------- Conteúdo do mapa, no plano desenvolvido ----------
  function content(f, south) {
    const el = { grat: [], land: [], tis: [], frame: [], contact: [] };
    for (let dl = -150; dl <= 150; dl += 30) { const a = []; for (let s = 0; s <= S_MAX; s += 2) a.push(dev(f, dl, s)); el.grat.push(a); }
    for (let s = 15; s <= 75; s += 15) { const a = []; for (let dl = -180; dl <= 180; dl += 2) a.push(dev(f, dl, s)); el.grat.push(a); }
    const fr = [];
    for (let dl = -180; dl <= 180; dl += 2) fr.push(dev(f, dl, 0));
    for (let s = 0; s <= S_MAX; s += 2) fr.push(dev(f, 180, s));
    for (let dl = 180; dl >= -180; dl -= 2) fr.push(dev(f, dl, S_MAX));
    for (let s = S_MAX; s >= 0; s -= 2) fr.push(dev(f, -180, s));
    el.frame = fr;
    if (f.s0 <= S_MAX) for (let dl = -180; dl <= 180; dl += 2) el.contact.push(dev(f, dl, f.s0));
    for (const ring of south) { const a = []; for (let i = 0; i < ring.length; i += 2) a.push(dev(f, ring[i], -ring[i + 1])); el.land.push(a); }
    for (const dl of TISSOT.dl) for (const s of TISSOT.s) {
      const c = dev(f, dl, s), rr = scaleM(f, s) * R0, a = [];
      for (let i = 0; i <= 40; i++) { const t = i / 40 * 2 * Math.PI; a.push([c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t)]); }
      el.tis.push(a);
    }
    return el;
  }
  function mapLayer(kit, parent) {
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><path class="mapbg v3-mbg"/><path class="land v3-mland"/>' +
      '<path class="grat v3-mgrat"/><path class="frame v3-mframe"/><path class="hl v3-mcont"/><path class="tis v3-mtis"/></svg>');
    (parent || kit.stage).append(svg);
    const r = { svg, south: kit.json('v3-dados.json').south };
    for (const c of ['mbg', 'mland', 'mgrat', 'mframe', 'mcont', 'mtis']) r[c] = svg.querySelector('.v3-' + c);
    return r;
  }
  // T(P) → [x, y, vis]; vis < 0 esconde (face de trás do cone)
  function paintMap(r, f, T, a) {
    const el = content(f, r.south);
    const fr = el.frame.map(T);
    r.mbg.setAttribute('d', ringD(fr));
    r.mframe.setAttribute('d', lineD(fr));
    r.mgrat.setAttribute('d', el.grat.map(l => lineD(l.map(T))).join(''));
    r.mcont.setAttribute('d', lineD(el.contact.map(T)));
    const rings = list => list.map(l => { const p = l.map(T); return p.filter(q => q[2] >= 0).length * 2 >= p.length ? ringD(p) : ''; }).join('');
    r.mland.setAttribute('d', rings(el.land));
    r.mtis.setAttribute('d', rings(el.tis));
    r.svg.style.opacity = a;
  }
  const mapT = (f, L) => P => toMap(f, L, P);
  const coneT = (f, n1) => P => onCone(f, n1, P);
  const blendT = (A, B, u) => P => { const a = A(P), b = B(P); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), u > 0.5 ? 1 : a[2]]; };

  const fmt = (v, k) => v.toFixed(k).replace('.', ',');
  return { D, L0, V, MAP, family, rho, scaleM, globe, paintSurface, mapLayer, paintMap, mapT, coneT, blendT, fmt, lerp, NMIN };
})();
