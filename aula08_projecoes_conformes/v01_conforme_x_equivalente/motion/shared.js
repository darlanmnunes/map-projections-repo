// V1: geometria comum às cenas (globo ortográfico, Mercator, Lambert cilíndrica).
// Tudo calculado pelas equações; nenhuma curva desenhada à mão.
window.V1 = (function () {
  const D = Math.PI / 180;
  const S = 315;                       // px por radiano nos dois mapas
  const R0 = 7 * D;                    // raio angular dos círculos na esfera
  const LON = [-115, 25], LAT = [-75, 15];
  const EQ = 333.5;                    // y do equador (mesmo nos dois mapas)
  const X0 = { merc: 155, lamb: 995 }; // borda oeste de cada mapa
  const CIRC = [0, -30, -60], CLON = -45;
  const yProj = {
    merc: f => Math.log(Math.tan(Math.PI / 4 + f / 2)),  // y = ln tan(45° + φ/2)
    lamb: f => Math.sin(f),                              // y = sen φ
  };
  const lerp = (a, b, u) => a + (b - a) * u;

  function map(k, lam, phi) {
    phi = Math.max(-85, Math.min(85, phi));
    return [X0[k] + (lam - LON[0]) * D * S, EQ - S * yProj[k](phi * D)];
  }
  // Projeção ortográfica oblíqua centrada em (g.lc, g.pc); z < 0: hemisfério oculto
  function ortho(g, lam, phi) {
    const l = (lam - g.lc) * D, p = phi * D, p0 = g.pc * D, cp = Math.cos(p);
    const x = cp * Math.sin(l);
    const y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * cp * Math.cos(l);
    const z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * cp * Math.cos(l);
    return [g.cx + g.R * x, g.cy - g.R * y, z];
  }
  // Para preenchimentos: ponto oculto vai para o contorno do disco
  function orthoFill(g, lam, phi) {
    const q = ortho(g, lam, phi);
    if (q[2] >= 0) return q;
    const dx = q[0] - g.cx, dy = q[1] - g.cy, n = Math.hypot(dx, dy) || 1;
    return [g.cx + g.R * dx / n, g.cy + g.R * dy / n, q[2]];
  }
  function morph(k, g, u) {
    return (lam, phi) => {
      const a = orthoFill(g, lam, phi);
      if (u <= 0) return a;
      const b = map(k, lam, phi);
      return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), a[2]];
    };
  }

  const f1 = v => v.toFixed(1);
  function ringsD(rings, f) {
    let s = '';
    for (const r of rings) {
      for (let i = 0; i < r.length; i += 2) {
        const q = f(r[i], r[i + 1]);
        s += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]);
      }
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
        s += (pen ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]);
        pen = true;
      }
    }
    return s;
  }

  // Reticulado a cada 15°
  const GRAT = [];
  for (let lam = -180; lam < 180; lam += 15) {
    const a = []; for (let p = -90; p <= 90; p += 3) a.push(lam, p); GRAT.push(a);
  }
  for (let p = -75; p <= 75; p += 15) {
    const a = []; for (let lam = -180; lam <= 180; lam += 3) a.push(lam, p); GRAT.push(a);
  }
  // Contorno da janela dos mapas
  const BOX = [];
  for (let l = LON[0]; l < LON[1]; l += 2) BOX.push(l, LAT[0]);
  for (let p = LAT[0]; p < LAT[1]; p += 2) BOX.push(LON[1], p);
  for (let l = LON[1]; l > LON[0]; l -= 2) BOX.push(l, LAT[1]);
  for (let p = LAT[1]; p > LAT[0]; p -= 2) BOX.push(LON[0], p);

  // Círculo de raio angular 7°·p em (CLON, pc): na esfera é um círculo menor exato;
  // no mapa, a indicatriz de Tissot (semieixos sec φ e sec φ ou cos φ)
  function circleD(k, g, u, pc, p) {
    const c1 = pc * D, d = R0 * p;
    const mx = 1 / Math.cos(c1), my = k === 'merc' ? mx : Math.cos(c1);
    const cm = map(k, CLON, pc);
    let s = '';
    for (let i = 0; i <= 72; i++) {
      const th = i / 72 * 2 * Math.PI;
      const p2 = Math.asin(Math.sin(c1) * Math.cos(d) + Math.cos(c1) * Math.sin(d) * Math.cos(th));
      const l2 = CLON * D + Math.atan2(Math.sin(th) * Math.sin(d) * Math.cos(c1), Math.cos(d) - Math.sin(c1) * Math.sin(p2));
      const a = orthoFill(g, l2 / D, p2 / D);
      const bx = cm[0] + d * S * mx * Math.sin(th), by = cm[1] - d * S * my * Math.cos(th);
      s += (i ? 'L' : 'M') + f1(lerp(a[0], bx, u)) + ' ' + f1(lerp(a[1], by, u));
    }
    return s + 'Z';
  }

  // Monta o SVG de uma cena: um grupo por projeção ('merc', 'lamb')
  function mount(kit, id, kinds) {
    let h = '<svg class="art" viewBox="0 0 1920 1080"><defs>' +
      '<radialGradient id="' + id + '-sph" cx="0.38" cy="0.32" r="0.78">' +
      '<stop offset="0" style="stop-color:var(--ground)"/>' +
      '<stop offset="1" style="stop-color:color-mix(in srgb, var(--main) 18%, var(--ground))"/></radialGradient>';
    for (const k of kinds) h += '<clipPath id="' + id + '-clip-' + k + '"><path class="v1-clip"/></clipPath>';
    h += '</defs>';
    for (const k of kinds) {
      h += '<g class="v1-' + k + '">' +
        '<g class="v1-full"><circle class="v1-sph" style="fill:url(#' + id + '-sph)"/>' +
        '<path class="land v1-fland"/><path class="grat v1-fgrat"/><circle class="limb v1-limb"/></g>' +
        '<path class="mapbg v1-bg"/>' +
        '<g clip-path="url(#' + id + '-clip-' + k + ')"><path class="land v1-mland"/><path class="grat v1-mgrat"/></g>' +
        '<path class="frame v1-frame"/>' +
        '<path class="tis v1-c0"/><path class="tis v1-c1"/><path class="tis v1-c2"/>' +
        '<path class="hl v1-hl"/></g>';
    }
    const svg = kit.h(h + '</svg>');
    const dados = kit.json('v1-dados.json');
    const r = { svg, land: dados.land, box: dados.box };
    for (const k of kinds) {
      const q = c => svg.querySelector('.v1-' + k + ' .v1-' + c);
      r[k] = { g: svg.querySelector('.v1-' + k), clip: svg.querySelector('#' + id + '-clip-' + k + ' path') };
      for (const c of ['full', 'sph', 'fland', 'fgrat', 'limb', 'bg', 'mland', 'mgrat', 'frame', 'c0', 'c1', 'c2', 'hl']) r[k][c] = q(c);
    }
    return r;
  }

  // st[k] = {a, g:{cx,cy,R,lc,pc}, u, full, bg, frame, circ:[p0,p1,p2], hl}
  function paint(r, st) {
    for (const k of ['merc', 'lamb']) {
      const e = r[k]; if (!e) continue;
      const s = st[k];
      if (!s || s.a <= 0) { e.g.style.display = 'none'; continue; }
      e.g.style.display = '';
      e.g.style.opacity = s.a;
      const g = s.g, u = s.u || 0, full = s.full == null ? 1 : s.full;
      e.full.style.opacity = full;
      if (full > 0) {
        for (const c of [e.sph, e.limb]) { c.setAttribute('cx', g.cx); c.setAttribute('cy', g.cy); c.setAttribute('r', g.R); }
        e.fland.setAttribute('d', ringsD(r.land, (l, p) => orthoFill(g, l, p)));
        e.fgrat.setAttribute('d', linesD(GRAT, (l, p) => ortho(g, l, p)));
      }
      const box = full < 1 || u > 0;
      if (box) {
        const f = morph(k, g, u), b = ringsD([BOX], f);
        e.clip.setAttribute('d', b);
        e.bg.setAttribute('d', b);
        e.frame.setAttribute('d', b);
        e.mland.setAttribute('d', ringsD(r.box, f));   // terra já recortada na janela: sem pontos ocultos
        e.mgrat.setAttribute('d', linesD(GRAT, (l, p) => {
          const z = ortho(g, l, p)[2], q = f(l, p); return [q[0], q[1], z];
        }));
      } else {
        for (const c of [e.clip, e.bg, e.frame, e.mland, e.mgrat]) c.setAttribute('d', '');
      }
      e.bg.style.opacity = s.bg || 0;
      e.frame.style.opacity = s.frame || 0;
      const circ = s.circ || [1, 1, 1];
      ['c0', 'c1', 'c2'].forEach((c, i) => e[c].setAttribute('d', circ[i] > 0.001 ? circleD(k, g, u, CIRC[i], circ[i]) : ''));
      e.hl.setAttribute('d', (s.hl || 0) > 0 ? circleD(k, g, u, -60, 1) : '');
      e.hl.style.opacity = s.hl || 0;
    }
  }

  // Estados de referência que ligam as cenas
  const GLOBE_END = { cx: 960, cy: 575, R: 400, lc: -50, pc: -25 };
  const SPLIT = {
    merc: { cx: map('merc', -50, -25)[0], cy: map('merc', -50, -25)[1], R: 300, lc: -50, pc: -25 },
    lamb: { cx: map('lamb', -50, -25)[0], cy: map('lamb', -50, -25)[1], R: 300, lc: -50, pc: -25 },
  };
  function mapsState(a) {
    const s = k => ({ a, g: SPLIT[k], u: 1, full: 0, bg: 1, frame: 1 });
    return { merc: s('merc'), lamb: s('lamb') };
  }

  function sig(kit) {
    kit.stage.append(kit.h('<div class="sig">Prof. Darlan M. Nunes</div>'));
  }

  return { D, S, R0, EQ, X0, CIRC, CLON, map, ortho, orthoFill, mount, paint, sig,
    GLOBE_END, SPLIT, mapsState, lerp };
})();
