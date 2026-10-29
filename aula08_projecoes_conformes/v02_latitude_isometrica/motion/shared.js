// V2: elipsoide GRS80, latitude isométrica e globo ortográfico comuns às cenas.
window.V2 = (function () {
  const D = Math.PI / 180;
  const A = 6378137, E2 = 0.00669438002290, E = Math.sqrt(E2);

  // Raios de curvatura: M (meridiana) e N (primeiro vertical)
  function M(phi) { const w = 1 - E2 * Math.sin(phi * D) ** 2; return A * (1 - E2) / w ** 1.5; }
  function N(phi) { return A / Math.sqrt(1 - E2 * Math.sin(phi * D) ** 2); }
  // ψ = ln[tan(45° + φ/2) ((1 − ε sen φ)/(1 + ε sen φ))^(ε/2)], em graus
  function psi(phi) {
    const f = phi * D, es = E * Math.sin(f);
    return Math.log(Math.tan(Math.PI / 4 + f / 2) * Math.pow((1 - es) / (1 + es), E / 2)) / D;
  }
  // Inversa por Newton: dψ/dφ = M / (N cos φ)
  function phiOf(p) {
    let f = p;
    for (let i = 0; i < 30; i++) f -= (psi(f) - p) * N(f) * Math.cos(f * D) / M(f);
    return f;
  }

  // Globo ortográfico (esfera unitária para o desenho; o elipsoide entra nas medidas)
  function ortho(g, lam, phi) {
    const l = (lam - g.lc) * D, p = phi * D, p0 = g.pc * D, cp = Math.cos(p);
    const x = cp * Math.sin(l);
    const y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * cp * Math.cos(l);
    const z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * cp * Math.cos(l);
    return [g.cx + g.R * x, g.cy - g.R * y, z];
  }
  function orthoFill(g, lam, phi) {
    const q = ortho(g, lam, phi);
    if (q[2] >= 0) return q;
    const dx = q[0] - g.cx, dy = q[1] - g.cy, n = Math.hypot(dx, dy) || 1;
    return [g.cx + g.R * dx / n, g.cy + g.R * dy / n, q[2]];
  }
  const f1 = v => v.toFixed(1);
  function ringsD(rings, f) {
    let s = '';
    for (const r of rings) {
      for (let i = 0; i < r.length; i += 2) { const q = f(r[i], r[i + 1]); s += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); }
      s += 'Z';
    }
    return s;
  }
  function linesD(lines, f) {
    let s = '';
    for (const ln of lines) {
      let pen = false;
      for (let i = 0; i < ln.length; i += 2) {
        const q = f(ln[i], ln[i + 1]);
        if (q[2] < 0) { pen = false; continue; }
        s += (pen ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); pen = true;
      }
    }
    return s;
  }
  const GRAT = [];
  for (let lam = -180; lam < 180; lam += 15) { const a = []; for (let p = -90; p <= 90; p += 3) a.push(lam, p); GRAT.push(a); }
  for (let p = -75; p <= 75; p += 15) { const a = []; for (let lam = -180; lam <= 180; lam += 3) a.push(lam, p); GRAT.push(a); }

  // Quadrilátero Δφ = Δλ = 5° centrado em (λ = −45°, φc), contorno pelos meridianos e paralelos
  const QLON = -45, QD = 5;
  function quadD(g, pc) {
    const r = [], l0 = QLON - QD / 2, l1 = QLON + QD / 2, p0 = pc - QD / 2, p1 = pc + QD / 2;
    for (let l = l0; l < l1; l += 0.5) r.push(l, p0);
    for (let p = p0; p < p1; p += 0.5) r.push(l1, p);
    for (let l = l1; l > l0; l -= 0.5) r.push(l, p1);
    for (let p = p1; p > p0; p -= 0.5) r.push(l0, p);
    return ringsD([r], (l, p) => ortho(g, l, p));
  }

  function globe(kit, id) {
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs>' +
      '<radialGradient id="' + id + '-sph" cx="0.38" cy="0.32" r="0.78">' +
      '<stop offset="0" style="stop-color:var(--ground)"/>' +
      '<stop offset="1" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/></radialGradient></defs>' +
      '<circle class="v2-sph" style="fill:url(#' + id + '-sph)"/><path class="land v2-land"/><path class="grat v2-grat"/>' +
      '<circle class="limb v2-limb"/><path class="cell v2-quad"/><path class="zoomln v2-zl"/></svg>');
    const r = { svg, land: kit.json('v2-dados.json').land };
    for (const c of ['sph', 'grat', 'limb', 'quad', 'zl']) r[c] = svg.querySelector('.v2-' + c);
    r.landEl = svg.querySelector('.v2-land');
    return r;
  }
  function paintGlobe(r, g) {
    for (const c of [r.sph, r.limb]) { c.setAttribute('cx', g.cx); c.setAttribute('cy', g.cy); c.setAttribute('r', g.R); }
    r.landEl.setAttribute('d', ringsD(r.land, (l, p) => orthoFill(g, l, p)));
    r.grat.setAttribute('d', linesD(GRAT, (l, p) => ortho(g, l, p)));
  }

  // Globo e painel ampliado das cenas 1 e 2
  const G = { cx: 560, cy: 600, R: 390, lc: -45, pc: -22 };
  const INSET = { x: 1440, y: 590, S: 300 };   // a·dλ ↔ 300 px
  // Retângulo elementar (dφ = dλ): lado L-O = N cos φ dλ, lado N-S = M dφ, em px
  function rect(pc) {
    return { w: INSET.S * N(pc) * Math.cos(pc * D) / A, h: INSET.S * M(pc) / A };
  }

  // Caixa envolvente do quadrilátero no globo (para o zoom)
  function quadBox(g, pc) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const l of [QLON - QD / 2, QLON, QLON + QD / 2]) for (const p of [pc - QD / 2, pc + QD / 2]) {
      const q = ortho(g, l, p); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
    }
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
  }
  // Painel ampliado: retângulo elementar, contorno do quadrado do Equador e rótulos dos lados
  function inset(kit, parent) {
    const box = parent || kit.stage;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><rect class="ghost v2-gh"/><rect class="cell v2-rc"/></svg>');
    box.append(svg);
    const lbl = html => { const el = kit.h('<div class="lbl">' + html + '</div>'); box.append(el); return el; };
    const r = { gh: svg.querySelector('.v2-gh'), rc: svg.querySelector('.v2-rc'),
      v: lbl('<i>M</i> d<i>φ</i>'), h: lbl('<i>N</i> cos <i>φ</i> d<i>λ</i>') };
    r.v.classList.add('r'); r.h.classList.add('c');
    const e = rect(0);
    for (const [k, v] of [['x', INSET.x - e.w / 2], ['y', INSET.y - e.h / 2], ['width', e.w], ['height', e.h]]) r.gh.setAttribute(k, v);
    return r;
  }
  function paintInset(r, b, o) {
    for (const [k, v] of [['x', b.x - b.w / 2], ['y', b.y - b.h / 2], ['width', b.w], ['height', b.h]]) r.rc.setAttribute(k, v.toFixed(2));
    r.rc.style.opacity = o.rect;
    r.gh.style.display = o.ghost > 0 ? '' : 'none';
    r.gh.style.opacity = 0.6 * (o.ghost || 0);
    Object.assign(r.v.style, { left: (b.x - b.w / 2 - 18) + 'px', top: b.y + 'px', opacity: o.v });
    Object.assign(r.h.style, { left: b.x + 'px', top: (b.y + b.h / 2 + 14) + 'px', opacity: o.h });
  }

  return { D, A, M, N, psi, phiOf, ortho, globe, paintGlobe, quadD, quadBox, inset, paintInset,
    G, INSET, rect, QLON, QD };
})();
