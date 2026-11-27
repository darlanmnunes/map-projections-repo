// V3: mapa do fuso 23 (−48° a −42°, 6° N a 62° S) em duas vistas. Cada ponto dos dados é [λ, φ, E, N]
// (graus; km). Vista geográfica (u = 0): x ∝ λ, y ∝ φ. Vista da grade (u = 1): x ∝ E, y ∝ N.
// As duas vistas coincidem no MC e nas bordas do fuso no Equador; o morph interpola ponto a ponto.
window.A9V3 = (function () {
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = v => v.toFixed(1);
  const MAP = { x0: 290, x1: 990, y0: 180, y1: 1000 };
  const W = MAP.x1 - MAP.x0, H = MAP.y1 - MAP.y0, XC = (MAP.x0 + MAP.x1) / 2;
  let dados = null, NTOP = 0, NBOT = 0, EHALF = 0;

  function load(kit) {
    if (dados) return dados;
    dados = kit.json('v3-dados.json');
    const g = dados.malha, ic = g.lam.indexOf(-45), n = g.phi.length - 1;
    NTOP = g.N[0][ic]; NBOT = g.N[n][ic];
    EHALF = g.E[g.phi.indexOf(0)][g.lam.length - 1] - 500;   // meia largura do fuso no Equador (km)
    return dados;
  }
  const geo = (lam, phi) => [MAP.x0 + (lam + 48) / 6 * W, MAP.y0 + (6 - phi) / 68 * H];
  const grid = (E, N) => [XC + (E - 500) / EHALF * W / 2, MAP.y0 + (NTOP - N) / (NTOP - NBOT) * H];
  const P = (p, u) => { const a = geo(p[0], p[1]), b = grid(p[2], p[3]); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; };
  const west = p => [-90 - p[0], p[1], 1000 - p[2], p[3]];
  const lineD = (pts, u) => pts.map((p, i) => (i ? 'L' : 'M') + P(p, u).map(f1).join(' ')).join('');

  // ppm → cor: branco no zero, azul na redução (−400), vermelho na ampliação (+1000)
  function color(ppm) {
    const [c, k] = ppm < 0 ? [[33, 102, 172], Math.min(1, -ppm / 400)] : [[178, 24, 43], Math.min(1, ppm / 1000)];
    const s = 0.8 * Math.pow(k, 0.85);
    return 'rgb(' + c.map(v => Math.round(255 + (v - 255) * s)).join(',') + ')';
  }

  // Monta o mapa: campo de distorção, costa, isolinhas, bordas, MC, secantes e eixos
  function build(kit, id) {
    const d = load(kit), g = d.malha;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="' + id + '-clip"><rect x="' + MAP.x0 + '" y="' + MAP.y0 +
      '" width="' + W + '" height="' + H + '"/></clipPath></defs><g class="' + id + '-fld"></g>' +
      '<path class="land ' + id + '-land" style="fill:none;stroke:#1d2633;stroke-width:1.6"/>' +
      '<path class="isol ' + id + '-iso"/><path class="bord ' + id + '-bord"/><path class="mcl ' + id + '-mc"/>' +
      '<g clip-path="url(#' + id + '-clip)"><path class="halo ' + id + '-sech"/><path class="secv ' + id + '-sec"/></g>' +
      '<rect class="axisbox ' + id + '-box" x="' + MAP.x0 + '" y="' + MAP.y0 + '" width="' + W + '" height="' + H + '" style="stroke-width:1.5;opacity:.5"/>' +
      '<g class="' + id + '-over"></g></svg>');
    const r = { svg, d, id, cells: [], q: c => svg.querySelector('.' + id + '-' + c) };
    const fg = r.q('fld');
    for (let j = 0; j < g.phi.length - 1; j++)
      for (let i = 0; i < g.lam.length - 1; i++) {
        const ppm = (g.ppm[j][i] + g.ppm[j][i + 1] + g.ppm[j + 1][i] + g.ppm[j + 1][i + 1]) / 4;
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('class', 'fld'); el.style.fill = el.style.stroke = color(ppm);
        fg.append(el); r.cells.push({ el, i, j });
      }
    // Eixos: os rótulos de cada vista entram e saem com o morph
    r.tg = []; r.tn = [];
    const tick = (arr, html, x, y, cls) => { const e = kit.h('<div class="tick' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); kit.stage.append(e); arr.push(e.style); };
    for (const lam of [-48, -45, -42]) tick(r.tg, lam === -45 ? '−45° (MC)' : '−' + (-lam) + '°', geo(lam, 0)[0] - (lam === -45 ? 56 : 22), MAP.y1 + 10);
    for (let phi = 0; phi >= -60; phi -= 10) tick(r.tg, phi ? '−' + (-phi) + '°' : '0°', MAP.x0 - 62, geo(-48, phi)[1] - 14);
    tick(r.tg, '<i>λ</i>', XC - 6, MAP.y1 + 44, ' eqt'); tick(r.tg, '<i>φ</i>', MAP.x0 - 60, MAP.y0 - 44, ' eqt');
    for (const E of [200, 500, 800]) tick(r.tn, String(E), grid(E, 0)[0] - 22, MAP.y1 + 10);
    for (let N = 10000; N >= 4000; N -= 1000) tick(r.tn, (N / 1000).toFixed(0) + '&thinsp;000', MAP.x0 - 92, grid(500, N)[1] - 14);
    tick(r.tn, '<i>E</i> (km)', XC - 34, MAP.y1 + 44, ' eqt'); tick(r.tn, '<i>N</i> (km)', MAP.x0 - 92, MAP.y0 - 44, ' eqt');
    // Barra de cores (ppm = mm/km)
    let bar = '<div class="' + id + '-cbar" style="position:absolute;left:1030px;top:300px;width:24px;height:500px;border:1px solid var(--grid);background:linear-gradient(to top,';
    const stops = [];
    for (let k = 0; k <= 14; k++) { const v = -400 + k * 100; stops.push(color(v) + ' ' + f1((v + 400) / 1400 * 100) + '%'); }
    bar += stops.join(',') + ')"></div>';
    kit.stage.append(kit.h(bar));
    r.cbar = [kit.stage.querySelector('.' + id + '-cbar').style];
    for (const v of [-400, 0, 400, 800]) tick(r.cbar, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v), 1062, 800 - (v + 400) / 1400 * 500 - 14);
    tick(r.cbar, 'mm/km', 1022, 262);
    return r;
  }

  // st = {u, fld, land, iso, bord, mc, sec, sech (0 a 1: fração desenhada das secantes, de norte a sul), axes}
  function paint(r, st) {
    const u = st.u, d = r.d, g = d.malha;
    const node = (i, j) => P([g.lam[i], g.phi[j], g.E[j][i], g.N[j][i]], u);
    for (const c of r.cells) {
      const a = node(c.i, c.j), b = node(c.i + 1, c.j), e = node(c.i + 1, c.j + 1), f = node(c.i, c.j + 1);
      c.el.setAttribute('d', 'M' + [a, b, e, f].map(p => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z');
    }
    r.q('fld').style.opacity = st.fld;
    let ld = '';
    for (const ring of d.land) {
      const pts = [];
      for (let k = 0; k < ring.length; k += 4) pts.push(ring.slice(k, k + 4));
      ld += lineD(pts, u) + 'Z';
    }
    r.q('land').setAttribute('d', ld); r.q('land').style.opacity = st.land;
    let iso = '';
    for (const v in d.iso) if (d.iso[v].length > 1) iso += lineD(d.iso[v], u) + lineD(d.iso[v].map(west), u);
    r.q('iso').setAttribute('d', iso); r.q('iso').style.opacity = st.iso;
    r.q('bord').setAttribute('d', lineD(d.borda, u) + lineD(d.borda.map(west), u)); r.q('bord').style.opacity = st.bord;
    r.q('mc').setAttribute('d', lineD(d.mc, u));
    r.q('mc').style.opacity = st.mc;
    const n = Math.max(2, Math.round(d.sec.length * (st.sech ?? 1)));
    const sd = lineD(d.sec.slice(0, n), u) + lineD(d.sec.slice(0, n).map(west), u);
    r.q('sec').setAttribute('d', sd); r.q('sech').setAttribute('d', sd);
    r.q('sec').style.opacity = st.sec; r.q('sech').style.opacity = st.sec;
    r.q('box').style.opacity = 0.5 * st.axes;
    const sg = (x, a, b) => Math.max(0, Math.min(1, (x - a) / (b - a)));
    const ka = st.axes * (1 - sg(u, 0.15, 0.4)), kb = st.axes * sg(u, 0.6, 0.85);
    for (const s of r.tg) s.opacity = ka;
    for (const s of r.tn) s.opacity = kb;
    for (const s of r.cbar) s.opacity = st.cbar ?? st.fld;
  }
  return { lerp, MAP, XC, geo, grid, P, west, load, build, paint, color };
})();
