// V5: as duas rotas São Paulo → Joanesburgo no globo, na Mercator e na gnomônica.
// Cada ponto (λ, φ) vai do globo (u1 = 0) à Mercator (u1 = 1) e daí à gnomônica (u2 = 1).
window.V5 = (function () {
  const D = Math.PI / 180;
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = v => v.toFixed(1);
  const E2 = 0.00669438002290, E = Math.sqrt(E2);
  let DADOS = null;

  // Globo ortográfico centrado no Atlântico Sul
  const G = { cx: 760, cy: 585, R: 400, lc: -9, pc: -27 };
  function ortho(lam, phi) {
    const l = (lam - G.lc) * D, p = phi * D, p0 = G.pc * D, cp = Math.cos(p);
    const x = cp * Math.sin(l);
    const y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * cp * Math.cos(l);
    const z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * cp * Math.cos(l);
    return [G.cx + G.R * x, G.cy - G.R * y, z];
  }
  function orthoFill(lam, phi) {
    const q = ortho(lam, phi);
    if (q[2] >= 0) return q;
    const dx = q[0] - G.cx, dy = q[1] - G.cy, n = Math.hypot(dx, dy) || 1;
    return [G.cx + G.R * dx / n, G.cy + G.R * dy / n, q[2]];
  }
  // Mercator no elipsoide: x = λ, y = ψ (em graus, mesma escala K)
  function psi(phi) {
    const f = phi * D, es = E * Math.sin(f);
    return Math.log(Math.tan(Math.PI / 4 + f / 2) * Math.pow((1 - es) / (1 + es), E / 2)) / D;
  }
  const MK = 12.5, MX = 270, MY = 200 + MK * psi(8);
  const merc = (lam, phi) => [MX + MK * (lam + 65), MY - MK * psi(phi)];
  // Gnomônica centrada no meio da geodésica; escala ajustada à janela no primeiro uso
  let GN = null;
  function gnomRaw(lam, phi) {
    const [lc, pc] = DADOS.centro;
    const l = (lam - lc) * D, p = phi * D, p0 = pc * D;
    const c = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    return [Math.cos(p) * Math.sin(l) / c, (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l)) / c];
  }
  function setupGnom() {
    const w = DADOS.janela, pts = [];
    for (let l = w[0]; l <= w[2]; l += 1) { pts.push(gnomRaw(l, w[1])); pts.push(gnomRaw(l, w[3])); }
    for (let p = w[1]; p <= w[3]; p += 1) { pts.push(gnomRaw(w[0], p)); pts.push(gnomRaw(w[2], p)); }
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const k = Math.min(1700 / (x1 - x0), 720 / (y1 - y0));
    GN = { k, ox: 960 - k * (x0 + x1) / 2, oy: 570 + k * (y0 + y1) / 2 };
  }
  const gnom = (lam, phi) => { const q = gnomRaw(lam, phi); return [GN.ox + GN.k * q[0], GN.oy - GN.k * q[1]]; };

  // Transformação contínua globo → Mercator → gnomônica
  function T(u1, u2) {
    return (lam, phi) => {
      const a = orthoFill(lam, phi);
      if (u1 <= 0 && u2 <= 0) return a;
      const b = merc(lam, phi);
      let x = lerp(a[0], b[0], u1), y = lerp(a[1], b[1], u1);
      if (u2 > 0) { const c = gnom(lam, phi); x = lerp(x, c[0], u2); y = lerp(y, c[1], u2); }
      return [x, y, a[2]];
    };
  }

  function ringsD(rings, f) {
    let s = '';
    for (const r of rings) {
      for (let i = 0; i < r.length; i += 2) { const q = f(r[i], r[i + 1]); s += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); }
      s += 'Z';
    }
    return s;
  }
  function linesD(lines, f, vis) {
    let s = '';
    for (const ln of lines) {
      let pen = false;
      for (let i = 0; i < ln.length; i += 2) {
        const q = f(ln[i], ln[i + 1]);
        if (vis && ortho(ln[i], ln[i + 1])[2] < 0) { pen = false; continue; }
        s += (pen ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); pen = true;
      }
    }
    return s;
  }
  // Reticulados: a cada 15° no globo inteiro, a cada 10° na janela dos mapas
  const GRAT = [], GRAT10 = [];
  for (let lam = -180; lam < 180; lam += 15) { const a = []; for (let p = -90; p <= 90; p += 3) a.push(lam, p); GRAT.push(a); }
  for (let p = -75; p <= 75; p += 15) { const a = []; for (let lam = -180; lam <= 180; lam += 3) a.push(lam, p); GRAT.push(a); }
  for (let lam = -60; lam <= 40; lam += 10) { const a = []; for (let p = -45; p <= 8; p += 1) a.push(lam, p); GRAT10.push(a); }
  for (let p = 0; p >= -40; p -= 10) { const a = []; for (let lam = -65; lam <= 45; lam += 1) a.push(lam, p); GRAT10.push(a); }
  const BOX = [];
  for (let l = -65; l < 45; l += 1) BOX.push(l, -45);
  for (let p = -45; p < 8; p += 1) BOX.push(45, p);
  for (let l = 45; l > -65; l -= 1) BOX.push(l, 8);
  for (let p = 8; p > -45; p -= 1) BOX.push(-65, p);

  // Ponto à distância angular d (graus) no azimute b (graus), na esfera
  function dest(lam, phi, b, d) {
    const p1 = phi * D, br = b * D, dd = d * D;
    const p2 = Math.asin(Math.sin(p1) * Math.cos(dd) + Math.cos(p1) * Math.sin(dd) * Math.cos(br));
    const l2 = lam * D + Math.atan2(Math.sin(br) * Math.sin(dd) * Math.cos(p1), Math.cos(dd) - Math.sin(p1) * Math.sin(p2));
    return [l2 / D, p2 / D];
  }
  // Arco do ângulo com o meridiano: do norte (0°) até o azimute az, e o traço do meridiano
  function angleLines(lam, phi, az, r) {
    const arc = [], mer = [];
    for (let i = 0; i <= 30; i++) { const q = dest(lam, phi, az * i / 30, r); arc.push(q[0], q[1]); }
    for (let i = 0; i <= 6; i++) { const q = dest(lam, phi, 0, r * 1.8 * i / 6); mer.push(q[0], q[1]); }
    return { arc, mer };
  }

  function mount(kit, id) {
    DADOS = DADOS || kit.json('v5-dados.json');
    if (!GN) setupGnom();
    const flat = a => { const o = []; for (let i = 0; i < a.length; i += 2) o.push(a[i], a[i + 1]); return o; };
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs>' +
      '<radialGradient id="' + id + '-sph" cx="0.38" cy="0.32" r="0.78">' +
      '<stop offset="0" style="stop-color:var(--ground)"/>' +
      '<stop offset="1" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/></radialGradient>' +
      '<clipPath id="' + id + '-clip"><path class="v5-clip"/></clipPath></defs>' +
      '<g class="v5-full"><circle class="v5-sph" style="fill:url(#' + id + '-sph)"/><path class="land v5-fland"/>' +
      '<path class="grat v5-fgrat"/><circle class="limb v5-limb"/></g>' +
      '<path class="mapbg v5-bg"/>' +
      '<g clip-path="url(#' + id + '-clip)"><path class="land v5-mland"/><path class="grat v5-mgrat"/></g>' +
      '<path class="frame v5-frame"/>' +
      '<g class="v5-angles"><path class="angmer v5-amer"/><path class="hl v5-alox"/><path class="angnav v5-ageo"/></g>' +
      '<path class="route lox v5-lox"/><path class="route geo v5-geo"/>' +
      '<circle class="city v5-sp" r="10"/><circle class="city v5-jo" r="10"/></svg>');
    const r = { svg, geoPts: flat(DADOS.geo), loxPts: flat(DADOS.lox) };
    for (const c of ['clip', 'full', 'sph', 'fland', 'fgrat', 'limb', 'bg', 'mland', 'mgrat', 'frame', 'angles', 'amer', 'alox', 'ageo', 'lox', 'geo', 'sp', 'jo'])
      r[c] = svg.querySelector('.v5-' + c);
    for (const c of [r.sph, r.limb]) { c.setAttribute('cx', G.cx); c.setAttribute('cy', G.cy); c.setAttribute('r', G.R); }
    r.fland.setAttribute('d', ringsD(DADOS.land, orthoFill));
    r.fgrat.setAttribute('d', linesD(GRAT, ortho, true));
    // Arcos dos ângulos (cena 1, só no globo)
    let am = '', al = '', ag = '';
    DADOS.loxMer.forEach(([l, p]) => { const a = angleLines(l, p, DADOS.rumo, 4.2); al += linesD([a.arc], ortho); am += linesD([a.mer], ortho); });
    DADOS.azMer.forEach(([l, p, az]) => { const a = angleLines(l, p, az, 4.2); ag += linesD([a.arc], ortho); am += linesD([a.mer], ortho); });
    r.amer.setAttribute('d', am); r.alox.setAttribute('d', al); r.ageo.setAttribute('d', ag);
    // Rótulos
    const lbl = (html, cls) => { const e = kit.h('<div class="lbl' + (cls || '') + '">' + html + '</div>'); return e; };
    r.lsp = lbl('São Paulo', ' r'); r.ljo = lbl('Joanesburgo');
    r.angL = DADOS.loxMer.map(([l, p]) => { const e = lbl(fmtDeg(DADOS.rumo)); e.style.color = 'var(--accent)'; e._at = [l, p, -1]; return e; });
    r.angG = DADOS.azMer.map(([l, p, az]) => { const e = lbl(fmtDeg(az)); e._at = [l, p, 1]; return e; });
    r.labels = [r.lsp, r.ljo, ...r.angL, ...r.angG];
    return r;
  }
  const fmtDeg = v => v.toFixed(2).replace('.', ',') + '°';
  const partial = (arr, p) => arr.slice(0, Math.max(0, 2 * Math.round(p * (arr.length / 2 - 1)) + 2));

  // st = {u1, u2, full, bg, frame, geo, lox, ang}
  function paint(r, st) {
    const f = T(st.u1 || 0, st.u2 || 0);
    r.full.style.opacity = st.full;
    const box = st.full < 1 || st.u1 > 0;
    if (box) {
      const b = ringsD([BOX], f);
      r.clip.setAttribute('d', b); r.bg.setAttribute('d', b); r.frame.setAttribute('d', b);
      r.mland.setAttribute('d', ringsD(DADOS.box, f));
      r.mgrat.setAttribute('d', linesD(GRAT10, f));
    } else for (const c of [r.clip, r.bg, r.frame, r.mland, r.mgrat]) c.setAttribute('d', '');
    r.bg.style.opacity = st.bg || 0;
    r.frame.style.opacity = st.frame || 0;
    r.geo.setAttribute('d', st.geo > 0 ? linesD([partial(r.geoPts, st.geo)], f) : '');
    r.lox.setAttribute('d', st.lox > 0 ? linesD([partial(r.loxPts, st.lox)], f) : '');
    r.angles.style.opacity = st.ang || 0;
    const sp = f(DADOS.sp[0], DADOS.sp[1]), jo = f(DADOS.jo[0], DADOS.jo[1]);
    for (const [c, q] of [[r.sp, sp], [r.jo, jo]]) { c.setAttribute('cx', f1(q[0])); c.setAttribute('cy', f1(q[1])); c.style.opacity = st.city; }
    Object.assign(r.lsp.style, { left: (sp[0] - 18) + 'px', top: (sp[1] - 34) + 'px', opacity: st.city });
    Object.assign(r.ljo.style, { left: (jo[0] + 18) + 'px', top: (jo[1] - 50) + 'px', opacity: st.city });
    // Rótulos dos ângulos: laranja ao norte da rota, azul ao sul
    r.angL.concat(r.angG).forEach((e, i) => {
      const [l, p, sg] = e._at, q = f(l, p), o = i < 3 ? st.angL : st.angG;
      Object.assign(e.style, { left: (q[0] + 10) + 'px', top: (q[1] + (sg < 0 ? -58 : 18)) + 'px', opacity: (o || 0) * (st.ang || 0) });
    });
  }

  return { mount, paint, lerp, fmtDeg };
})();
