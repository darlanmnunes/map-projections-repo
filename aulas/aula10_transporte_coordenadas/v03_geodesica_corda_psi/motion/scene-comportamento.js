// Cena 3: ψ pela eq. (23); uma linha percorre o fuso: no MC, girando para leste-oeste, afastando-se e crescendo
const { seg, eo, eio, TextFx } = kit;
kit.scene('comportamento', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const T = kit.json('v3-dados.json').traj;
    this.T = T;
    // Fuso esquemático: E′ de −330 a +330 km
    const F = { x0: 140, x1: 1060, y0: 200, y1: 1000 }, xMC = (F.x0 + F.x1) / 2, s = (F.x1 - F.x0) / 660;
    this.F = { X: e => xMC + e * s, y: 820, Lpx: 44, fpx: 4 };      // 44 px por km; 4 px de flecha por segundo de ψ
    const sec = 180 * s;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<rect x="' + F.x0 + '" y="' + F.y0 + '" width="' + (F.x1 - F.x0) + '" height="' + (F.y1 - F.y0) + '" style="fill:color-mix(in srgb, #F5D547 30%, var(--ground))"/>' +
      '<rect x="' + (xMC - sec) + '" y="' + F.y0 + '" width="' + 2 * sec + '" height="' + (F.y1 - F.y0) + '" style="fill:color-mix(in srgb, var(--second) 12%, var(--ground))"/>' +
      '<path class="mc" d="M' + xMC + ' ' + F.y0 + 'V' + F.y1 + '"/>' +
      '<path d="M' + (xMC - sec) + ' ' + F.y0 + 'V' + F.y1 + 'M' + (xMC + sec) + ' ' + F.y0 + 'V' + F.y1 + '" style="stroke:var(--tissot);stroke-width:2;stroke-dasharray:8 6"/>' +
      '<rect class="frame" x="' + F.x0 + '" y="' + F.y0 + '" width="' + (F.x1 - F.x0) + '" height="' + (F.y1 - F.y0) + '" style="stroke-width:1.5"/>' +
      '<g class="w-lin"><path class="corda w-cor" style="stroke-width:4"/><path class="geod w-geo" style="stroke-width:4"/><circle class="marco w-p1" r="9"/><circle class="marco w-p2" r="9"/></g></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['lin', 'cor', 'geo', 'p1', 'p2']) this.e[c] = svg.querySelector('.w-' + c);
    A10.lbl(kit, 'MC', xMC + 8, F.y0 + 8, 'font-family:var(--sans);font-size:24px;color:var(--accent)');
    for (const e of [-300, -150, 150, 300]) A10.lbl(kit, (e > 0 ? '+' : '−') + Math.abs(e) + ' km', this.F.X(e) - 40, F.y1 + 8, 'font-family:var(--sans);font-size:20px;color:color-mix(in srgb, var(--main) 60%, var(--ground))');
    A10.lbl(kit, '<i>E</i>′ = <i>E</i> − 500 km', F.x1 - 220, F.y1 + 40, 'font-size:22px;color:color-mix(in srgb, var(--main) 60%, var(--ground))');
    this.nota = A10.bloco(kit, 150, 915, 890, '<p class="note" style="background:color-mix(in srgb, var(--ground) 85%, transparent);padding:4px 8px">Comprimento e curvatura da linha exagerados no desenho; os valores de <i>ψ</i> são os reais (GRS80, latitude de Viçosa).</p>');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">De que depende <i>ψ</i></h2>').querySelector('h2');
    const C = (c, h) => '<span class="w-' + c + '" style="border-radius:6px;padding:0 4px">' + h + '</span>';
    this.eq = A10.bloco(kit, 1110, 200, 760, '<p class="eq big"><i>ψ</i><sub>12</sub> = <i>ρ</i>″ ' +
      '<span class="frac"><span>' + C('dn', 'Δ<i>N</i><sub>12</sub>') + ' ' + C('de', '(2<i>E</i>′<sub>1</sub> + <i>E</i>′<sub>2</sub>)') + '</span><span>6 <i>k</i><sub>0</sub><sup>2</sup> ' + C('mn', '<i>M N</i>') + '</span></span>&ensp;(23)</p>' +
      '<p class="note" style="margin-top:8px"><i>M</i>, <i>N</i>: raios de curvatura na latitude média; <i>ρ</i>″ = 206 264,8″</p>');
    this.hl = { dn: this.eq.querySelector('.w-dn'), de: this.eq.querySelector('.w-de'), mn: this.eq.querySelector('.w-mn') };
    this.ro = A10.bloco(kit, 1110, 470, 760, '<div class="card" style="position:relative;padding:22px 30px">' +
      '<p class="sub" style="font-size:28px;margin:0">distância ao MC: <b class="r-e"></b></p>' +
      '<p class="sub" style="font-size:28px;margin:6px 0 0">direção: <b class="r-a"></b>&emsp;comprimento: <b class="r-l"></b></p>' +
      '<p class="eq big" style="margin:14px 0 0;color:var(--psi)"><i>ψ</i> = <b class="r-p"></b></p></div>');
    this.r = { e: this.ro.querySelector('.r-e'), a: this.ro.querySelector('.r-a'), l: this.ro.querySelector('.r-l'), p: this.ro.querySelector('.r-p') };
    const B = (y, html) => A10.bloco(kit, 1110, y, 760, html);
    this.t = [
      [B(760, '<p class="sub">No MC e em linhas leste-oeste: <b><i>ψ</i> = 0</b></p>'), kit.em('c2', 'leste')],
      [B(860, '<p class="sub">Cresce com a distância ao MC e com o comprimento da linha</p>'), kit.em('c3', 'comprimento')],
    ];
    this.k = { dn: kit.em('c1', 'diferenca'), de: kit.em('c1', 'distancia'), mn: kit.em('c1', 'raios'),
      mc: kit.em('c2', 'sobre'), gira: kit.em('c2', 'leste'), volta: kit.F.c3.t0 - 0.2, leste: kit.em('c3', 'afastando'), cresce: kit.em('c3', 'comprimento') };
  },
  estado(t) {
    const k = this.k, T = this.T;
    if (t < k.gira) return T.mc[0];
    if (t < k.volta) return A10V3.at(T.gira, eio(seg(t, k.gira, k.gira + 1.6)));
    if (t < k.leste) return A10V3.at(T.volta, eio(seg(t, k.volta, k.volta + 0.8)));
    if (t < k.cresce) return A10V3.at(T.leste, eio(seg(t, k.leste, k.leste + 2.2)));
    return A10V3.at(T.cresce, eio(seg(t, k.cresce, k.cresce + 1.8)));
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, e = this.e, F = this.F;
    A10.show(this.eq, t, 0.4);
    for (const [c, t0] of [['dn', k.dn], ['de', k.de], ['mn', k.mn]])
      this.hl[c].style.background = t > t0 && t < k.mc ? 'color-mix(in srgb, var(--accent) 25%, transparent)' : 'transparent';
    const vis = eo(seg(t, k.mc - 0.3, k.mc + 0.3));
    e.lin.style.opacity = vis; A10.fade(this.ro, t, k.mc - 0.3); A10.fade(this.nota, t, k.mc);
    const [eK, ang, L, psi] = this.estado(t);
    const P = [F.X(eK), F.y], lf = A10V3.linhaFlecha(P, ang, L * F.Lpx, psi * F.fpx);
    e.cor.setAttribute('d', lf.corda); e.geo.setAttribute('d', lf.curva);
    e.p1.setAttribute('cx', P[0].toFixed(1)); e.p1.setAttribute('cy', P[1]); e.p2.setAttribute('cx', lf.Q[0].toFixed(1)); e.p2.setAttribute('cy', lf.Q[1].toFixed(1));
    this.r.e.textContent = A10.num(eK, 0) + ' km'; this.r.a.textContent = Math.round(ang) === 0 ? 'norte' : Math.round(ang) === 90 ? 'leste' : Math.round(ang) + '°';
    this.r.l.textContent = A10.num(L, 1) + ' km'; this.r.p.textContent = A10.num(Math.abs(psi) < 0.005 ? 0 : psi, 2, true) + '″';
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
