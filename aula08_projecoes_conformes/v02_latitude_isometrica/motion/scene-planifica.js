// Cena 3 (24 a 40 s): grade com λ na horizontal; os paralelos passam de φ para ψ e cada célula Δψ = Δλ vira quadrado
const { seg, eio, eo, lerp } = kit;
const K = 8.4;                      // px por grau (λ e ψ na mesma escala)
const X0 = 200, LON = [-80, -10];   // borda oeste da grade
const YEQ = 252;                    // y do Equador
const PAR = [];                     // paralelos de 5 em 5 graus, de 5° a −65°
for (let p = 5; p >= -65; p -= 5) PAR.push(p);
const CELLS = [0, -30, -60];        // latitudes das células destacadas
kit.scene('planifica', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.w = kit.h('<div style="position:absolute;inset:0"></div>');
    kit.stage.append(this.w);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><path class="grat planifica-mer"/><path class="grat planifica-par"/>' +
      '<path class="frame planifica-eq"/><path class="cell planifica-cells"/></svg>');
    this.w.append(svg);
    this.mer = svg.querySelector('.planifica-mer');
    this.par = svg.querySelector('.planifica-par');
    this.eqd = svg.querySelector('.planifica-eq');
    this.cells = svg.querySelector('.planifica-cells');
    this.svg = svg.style;
    // Rótulos dos paralelos a cada 15°
    this.ticks = [0, -15, -30, -45, -60].map(p => {
      const el = kit.h('<div class="tick">' + (p ? '−' + (-p) : '0') + '°</div>');
      this.w.append(el);
      return { p, s: el.style };
    });
    const ax = html => { const el = kit.h('<div class="lbl">' + html + '</div>'); this.w.append(el); return el.style; };
    this.axX = ax('<i>λ</i>');
    this.axPhi = ax('<i>y</i> = <i>φ</i>');
    this.axPsi = ax('<i>y</i> = <i>ψ</i>');
    // Células Δψ = Δλ = 5° centradas na latitude de cada destaque
    this.cellB = CELLS.map(p => {
      const c = V2.psi(p);
      return { psi: [c - 2.5, c + 2.5], phi: [V2.phiOf(c - 2.5), V2.phiOf(c + 2.5)] };
    });
    this.w.append(kit.h('<div class="words" style="left:110px;top:84px;width:1700px">' +
      '<h2 class="line planifica-hd">Planificar: λ na horizontal, ψ na vertical</h2></div>'));
    this.hd = kit.stage.querySelector('.planifica-hd').style;
    const block = (top, html) => {
      const el = kit.h('<div class="words" style="left:900px;top:' + top + 'px;width:900px">' + html + '</div>');
      this.w.append(el);
      return el.style;
    };
    this.e1 = block(250, '<p class="sub">Os paralelos se reposicionam com espaçamento</p>' +
      '<p class="eq big">d<i>ψ</i> = <span class="frac"><span><i>M</i> d<i>φ</i></span><span><i>N</i> cos <i>φ</i></span></span></p>');
    this.e2 = block(470, '<p class="eq big">d<i>s</i>² = <i>N</i>² cos²<i>φ</i> (d<i>ψ</i>² + d<i>λ</i>²)</p>');
    this.e3 = block(580, '<p class="sub">Coordenadas isométricas: o quadrilátero elementar é um quadrado</p>');
    this.e4 = block(740, '<p class="ttl">Esta grade é o reticulado da Mercator</p>');
    V2.sig(kit);
  },
  render(t) {
    const u = eio(seg(t, 3.4, 7.0));
    const y = p => YEQ - K * lerp(p, V2.psi(p), u);
    const x = l => X0 + (l - LON[0]) * K;
    const yt = y(5), yb = y(-65);
    let d = '';
    for (let l = LON[0]; l <= LON[1]; l += 5) d += 'M' + x(l) + ' ' + yt.toFixed(1) + 'V' + yb.toFixed(1);
    this.mer.setAttribute('d', d);
    d = '';
    for (const p of PAR) d += 'M' + x(LON[0]) + ' ' + y(p).toFixed(1) + 'H' + x(LON[1]);
    this.par.setAttribute('d', d);
    this.eqd.setAttribute('d', 'M' + x(LON[0]) + ' ' + y(0) + 'H' + x(LON[1]) + 'M' + x(LON[0]) + ' ' + yt.toFixed(1) +
      'H' + x(LON[1]) + 'V' + yb.toFixed(1) + 'H' + x(LON[0]) + 'Z');
    // Na grade em φ a célula fica achatada; em ψ, é um quadrado
    d = '';
    for (const c of this.cellB) {
      const top = YEQ - K * lerp(c.phi[1], c.psi[1], u), bot = YEQ - K * lerp(c.phi[0], c.psi[0], u);
      d += 'M' + x(-47.5) + ' ' + top.toFixed(1) + 'H' + x(-42.5) + 'V' + bot.toFixed(1) + 'H' + x(-47.5) + 'Z';
    }
    this.cells.setAttribute('d', d);
    this.cells.style.opacity = eo(seg(t, 1.6, 2.2));
    this.svg.opacity = eo(seg(t, 0.4, 1.2));
    for (const k of this.ticks) Object.assign(k.s, { left: (X0 - 66) + 'px', top: (y(k.p) - 14) + 'px', opacity: eo(seg(t, 0.8, 1.4)) });
    Object.assign(this.axX, { left: (x(-45) - 10) + 'px', top: (yb + 10) + 'px', opacity: eo(seg(t, 0.8, 1.4)) });
    for (const [s, a] of [[this.axPhi, 1 - seg(u, 0.4, 0.6)], [this.axPsi, seg(u, 0.4, 0.6)]]) {
      Object.assign(s, { left: (X0 - 20) + 'px', top: (yt - 52) + 'px', opacity: a * eo(seg(t, 0.8, 1.4)) });
    }
    const fade = (s, a) => { const p = eo(seg(t, a, a + 0.6)); s.opacity = p; s.transform = 'translateX(' + lerp(26, 0, p) + 'px)'; };
    fade(this.hd, 0.2);
    fade(this.e1, 2.6);
    fade(this.e2, 7.6);
    fade(this.e3, 9.4);
    fade(this.e4, 11.4);
    // Saída antes da cena 4
    this.w.style.opacity = 1 - seg(t, 15.4, 16);
  },
});
