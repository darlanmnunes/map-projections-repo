// V2 (aula 09): o fuso 23 no plano da TM (x, y em km) e o mapa do Brasil com os fusos 18 a 25.
// Os dados vêm de v2-dados.json (pyproj, GRS80); aqui só há mudança de escala para a tela.
window.A9V2 = (function () {
  const lerp = (a, b, u) => a + (b - a) * u;
  const f1 = v => v.toFixed(1);
  const K0 = 0.9996;
  // Gráfico: x de −500 a 500 km, y de −10 000 a 9 500 km; escala horizontal 15× a vertical
  const P = { cx: 1240, cy: 550, sx: 0.6, sy: 0.04, x0: -500, x1: 500, y0: -10000, y1: 9500 };
  const X = x => P.cx + x * P.sx, Y = y => P.cy - y * P.sy;
  const VIC = { x: 222.2, y: -2296.9, E: 722120.59, N: 7704054.61 };

  // 722120.59 → "722&nbsp;120,59" (separador de milhar e vírgula decimal, como nos slides)
  function fmt(v, dec) {
    const s = Math.abs(v).toFixed(dec || 0).split('.');
    const i = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (v < 0 ? '−' : '') + i + (s[1] ? ',' + s[1] : '');
  }
  const pathXY = pts => pts.map((q, i) => (i ? 'L' : 'M') + f1(X(q[0])) + ' ' + f1(Y(q[1]))).join('');
  // Trecho de uma linha do fuso (de 80° S a 84° N, passo 0,5°) que cresce a partir do Equador
  function grow(pts, u) {
    const e = 160, a = Math.round(e - u * e), b = Math.round(e + u * (pts.length - 1 - e));
    return pathXY(pts.slice(a, b + 1));
  }

  // Monta o gráfico do fuso numa cena: SVG + rótulos dos eixos (x/y e E/N, que trocam na cena 2)
  function plot(kit, id) {
    const d = kit.json('v2-dados.json').fuso;
    let grid = '';
    for (let x = -400; x <= 400; x += 100) grid += 'M' + X(x) + ' ' + Y(P.y0) + 'V' + Y(P.y1);
    for (let y = -10000; y <= 9000; y += 1000) grid += 'M' + X(P.x0) + ' ' + f1(Y(y)) + 'H' + X(P.x1);
    const ring = d.bordas[0].concat(d.bordas[1].slice().reverse());
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="quad ' + id + '-qw" d="M' + X(P.x0) + ' ' + Y(P.y1) + 'H' + X(0) + 'V' + Y(P.y0) + 'H' + X(P.x0) + 'Z"/>' +
      '<path class="quad ' + id + '-qs" d="M' + X(P.x0) + ' ' + Y(0) + 'H' + X(P.x1) + 'V' + Y(P.y0) + 'H' + X(P.x0) + 'Z"/>' +
      '<g class="' + id + '-ax"><path class="gridl" d="' + grid + '"/>' +
      '<rect class="axisbox" x="' + X(P.x0) + '" y="' + Y(P.y1) + '" width="' + (X(P.x1) - X(P.x0)) + '" height="' + (Y(P.y0) - Y(P.y1)) + '"/></g>' +
      '<path class="fz ' + id + '-fz" d="' + pathXY(ring) + 'Z"/>' +
      '<g class="' + id + '-gr"><path class="grat" d="' + d.meridianos.map(pathXY).join('') +
      d.paralelos.map(p => pathXY(p[1])).join('') + '"/></g>' +
      '<path class="mcl ' + id + '-mc"/><path class="fzedge ' + id + '-b0"/><path class="fzedge ' + id + '-b1"/>' +
      '<path class="ax0 ' + id + '-a0" d="M' + X(0) + ' ' + Y(P.y0) + 'V' + Y(P.y1) + 'M' + X(P.x0) + ' ' + Y(0) + 'H' + X(P.x1) + '"/>' +
      '<path class="lead ' + id + '-eq" d="M' + X(-334.1) + ' ' + Y(0) + 'H' + X(334.1) + '" style="stroke-width:6"/>' +
      '</svg>');
    kit.stage.append(svg);
    const q = c => svg.querySelector('.' + id + '-' + c);
    const r = { svg, d, qw: q('qw').style, qs: q('qs').style, ax: q('ax').style, fz: q('fz').style, gr: q('gr').style,
      mc: q('mc'), b0: q('b0'), b1: q('b1'), a0: q('a0').style, eq: q('eq').style, tx: [], tE: [], ty: [], tN: [], lat: [] };
    const tick = (html, x, y, list) => { const e = kit.h('<div class="tick num" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); kit.stage.append(e); list.push(e.style); };
    for (let x = -400; x <= 400; x += 200) tick(fmt(x), X(x) - (x < 0 ? 26 : x ? 20 : 6), Y(P.y0) + 10, r.tx);
    for (let E = 100; E <= 900; E += 200) tick(fmt(E), X((E - 500) / K0) - 20, Y(P.y0) + 10, r.tE);
    for (let y = -10000; y <= 8000; y += 2000) tick(fmt(y), X(P.x0) - 18 - 12 * fmt(y).length, Y(y) - 14, r.ty);
    for (let N = 0; N <= 8000; N += 2000) tick(fmt(N), X(P.x0) - 18 - 12 * fmt(N).length, Y((N - 10000) / K0) - 14, r.tN);
    for (let N = 2000; N <= 8000; N += 2000) tick(fmt(N), X(P.x0) - 18 - 12 * fmt(N).length, Y(N / K0) - 14, r.tN);
    tick('10&nbsp;000 | 0', X(P.x0) - 150, Y(0) - 14, r.tN);
    const lab = (html, x, y, list, css) => { const e = kit.h('<div class="tick eqt" style="left:' + x + 'px;top:' + y + 'px;' + (css || '') + '">' + html + '</div>'); kit.stage.append(e); list.push(e.style); };
    lab('<i>x</i> (km)', X(0) - 30, Y(P.y0) + 44, r.tx); lab('<i>y</i> (km)', X(P.x0) - 70, Y(P.y1) - 44, r.ty);
    lab('<i>E</i> (km)', X(0) - 30, Y(P.y0) + 44, r.tE); lab('<i>N</i> (km)', X(P.x0) - 70, Y(P.y1) - 44, r.tN);
    // Latitudes ao lado da borda leste do fuso
    for (const [p, pts] of d.paralelos) if ((p % 16 === 0 && p !== 0 && p !== 80) || p === 84) {
      const e = pts[pts.length - 1];
      const t = Math.abs(p) + '° ' + (p < 0 ? 'S' : 'N');
      lab(t, X(e[0]) + 10, Y(e[1]) - 14, r.lat, 'font-size:22px;color:var(--grid)');
    }
    r.note = kit.h('<div class="tick" style="left:' + (X(P.x1) + 16) + 'px;top:' + (Y(P.y0) + 8) + 'px;font-size:20px;width:300px;white-space:normal;color:var(--grid)">Escala horizontal 15× maior que a vertical</div>');
    kit.stage.append(r.note);
    return r;
  }
  // u: quanto das bordas e do MC já foi desenhado (0 a 1), a partir do Equador
  function paintPlot(r, u) {
    r.mc.setAttribute('d', grow(r.d.mc, u));
    r.b0.setAttribute('d', grow(r.d.bordas[0], u));
    r.b1.setAttribute('d', grow(r.d.bordas[1], u));
  }
  const show = (list, k) => { for (const s of list) s.opacity = k; };

  // Mapa do Brasil (cena 3): λ de −80° a −28°, φ de 8° a −36°, 19 px por grau
  const M = { x0: 800, y0: 172, s: 19, l0: -80, p0: 8, l1: -28, p1: -36 };
  const MX = l => M.x0 + (l - M.l0) * M.s, MY = p => M.y0 + (M.p0 - p) * M.s;
  const ringD = a => { let s = ''; for (let i = 0; i < a.length; i += 2) s += (i ? 'L' : 'M') + f1(MX(a[i])) + ' ' + f1(MY(a[i + 1])); return s; };

  function map(kit, id) {
    const d = kit.json('v2-dados.json');
    let fb = '', fmc = '';
    for (let l = -78; l <= -30; l += 6) fb += 'M' + MX(l) + ' ' + MY(M.p0) + 'V' + MY(M.p1);
    for (let l = -75; l <= -33; l += 6) fmc += 'M' + MX(l) + ' ' + MY(M.p0) + 'V' + MY(M.p1);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="' + id + '-cl"><rect x="' + MX(M.l0) + '" y="' + MY(M.p0) +
      '" width="' + (MX(M.l1) - MX(M.l0)) + '" height="' + (MY(M.p1) - MY(M.p0)) + '"/></clipPath></defs>' +
      '<g class="' + id + '-base" clip-path="url(#' + id + '-cl)"><rect class="mapbg" x="0" y="0" width="1920" height="1080"/>' +
      '<path class="viz" d="' + d.vizinhos.map(ringD).join('') + '"/>' +
      '<path class="br" d="' + d.brasil.map(ringD).join('') + '"/>' +
      '<path class="ufl" d="' + d.ufs.map(ringD).join('') + '"/>' +
      '<path class="fmc" d="' + fmc + '"/><path class="fb" d="' + fb + '"/></g>' +
      '<rect class="frame ' + id + '-fr" x="' + MX(M.l0) + '" y="' + MY(M.p0) + '" width="' + (MX(M.l1) - MX(M.l0)) + '" height="' + (MY(M.p1) - MY(M.p0)) + '"/>' +
      '<path class="lead ' + id + '-dl" d="M' + MX(-45) + ' ' + MY(-20.75) + 'H' + MX(-42.8667) + '" style="stroke-width:3"/>' +
      d.pontos.map(p => '<circle class="pt' + (p.fuso === 23 ? ' vic' : '') + ' ' + id + '-p" r="10" cx="' + f1(MX(p.lam)) + '" cy="' + f1(MY(p.phi)) + '"/>').join('') +
      '</svg>');
    const r = { svg, d, base: svg.querySelector('.' + id + '-base').style, fr: svg.querySelector('.' + id + '-fr').style,
      dl: svg.querySelector('.' + id + '-dl').style, pts: [...svg.querySelectorAll('.' + id + '-p')].map(e => e.style), zl: [], pl: [] };
    kit.stage.append(svg);
    for (let f = 18; f <= 25; f++) {
      const e = kit.h('<div class="tick" style="left:' + (MX(6 * f - 183) - 15) + 'px;top:' + (MY(M.p0) + 10) + 'px;font-weight:700;color:var(--main)">' + f + '</div>');
      kit.stage.append(e); r.zl.push(e.style);
    }
    for (const l of [-72, -48, -42, -36]) {
      const e = kit.h('<div class="tick" style="left:' + (MX(l) - 22) + 'px;top:' + (MY(M.p1) + 8) + 'px">' + fmt(l) + '°</div>');
      kit.stage.append(e); r.zl.push(e.style);
    }
    for (const p of d.pontos) {
      const e = kit.h('<div class="lbl" style="left:' + (MX(p.lam) - 22) + 'px;top:' + (MY(p.phi) + 14) + 'px;font-size:24px' +
        (p.fuso === 23 ? ';color:var(--accent);font-weight:700' : '') + '">' + p.fuso + 'S</div>');
      kit.stage.append(e); r.pl.push(e.style);
    }
    return r;
  }

  return { lerp, K0, P, X, Y, VIC, fmt, plot, paintPlot, show, M, MX, MY, map };
})();
