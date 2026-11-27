// Cena 2 (17 a 31 s): mapa-múndi com os 60 fusos; zoom no Brasil (18 a 25) e em Minas Gerais (22 a 24)
const { seg, eo, eio, lerp } = kit;
const W0 = { l0: -180, l1: 180, p0: -80, p1: 84 }, B0 = { x: 110, y: 200, w: 1700, h: 774 };
const W1 = { l0: -76, l1: -26, p0: -35, p1: 7 }, B1 = { x: 130, y: 205, w: 952, h: 800 };
kit.scene('mundo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v1-dados.json');
    this.land = d.land.map(A9V1.pairs); this.br = d.brasil.map(A9V1.pairs); this.mg = d.mg.map(A9V1.pairs);
    this.svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="mundo-clip"><rect class="mundo-cr"/></clipPath></defs>' +
      '<rect class="mapbg mundo-bg"/><g clip-path="url(#mundo-clip)"><path class="land mundo-land"/><path class="br mundo-br"/><path class="mgl mundo-mg"/>' +
      '<path class="zodd mundo-odd"/><path class="zbr mundo-zbr"/><path class="z23 mundo-z23"/><path class="zline mundo-zl"/>' +
      '<circle class="dot mundo-vic" r="9"/></g><rect class="frame mundo-fr"/></svg>');
    kit.stage.append(this.svg);
    this.el = {};
    for (const c of ['cr', 'bg', 'land', 'br', 'mg', 'odd', 'zbr', 'z23', 'zl', 'vic', 'fr']) this.el[c] = this.svg.querySelector('.mundo-' + c);
    this.nums = [];
    for (let F = 1; F <= 60; F++) { const e = kit.h('<div class="znum" style="font-size:17px">' + F + '</div>'); kit.stage.append(e); this.nums.push(e); }
    this.t1 = kit.h('<div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line">Os fusos no mapa: de 80° S a 84° N</h2></div>');
    this.t2 = kit.h('<div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line">Fusos no Brasil</h2></div>');
    kit.stage.append(this.t1, this.t2);
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1200px;top:' + top + 'px;width:660px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.side = [
      [p(300, '<p class="sub"><b style="color:var(--accent)">Brasil continental</b>: oito fusos, do 18 ao 25</p>'), 8.6],
      [p(430, '<p class="sub"><b>Minas Gerais</b>: fusos 22, 23 e 24</p>'), 10.4],
      [p(530, '<p class="sub"><b>Viçosa</b>: fuso 23, MC −45°</p>'), 11.8],
    ];
  },
  render(t) {
    const z = eio(seg(t, 6.0, 8.6)), W = A9V1.mix(W0, W1, z), B = A9V1.mix(B0, B1, z);
    const P = (l, p) => A9V1.mapXY(W, B, l, p);
    for (const c of ['cr', 'bg', 'fr']) { const e = this.el[c]; e.setAttribute('x', B.x); e.setAttribute('y', B.y); e.setAttribute('width', B.w); e.setAttribute('height', B.h); }
    this.svg.style.opacity = eo(seg(t, 0, 0.6));
    this.el.land.setAttribute('d', A9V1.polyD(W, B, this.land));
    this.el.br.setAttribute('d', A9V1.polyD(W, B, this.br)); this.el.br.style.opacity = eo(seg(t, 4.2, 5.0));
    this.el.mg.setAttribute('d', A9V1.polyD(W, B, this.mg)); this.el.mg.style.opacity = eo(seg(t, 10.4, 11.0));
    const k = Math.floor(lerp(0, 60, seg(t, 0.6, 3.8)));
    let odd = '', zbr = '', z23 = '', zl = '';
    for (let F = 1; F <= 60; F++) {
      const a = A9V1.west(F), ring = A9V1.ringD([P(a, -80), P(a + 6, -80), P(a + 6, 84), P(a, 84)]);
      if (F <= k && F % 2) odd += ring;
      if (A9V1.BR(F) && F !== 23) zbr += ring;
      if (F === 23) z23 = ring;
      if (F <= k) zl += 'M' + P(a, -80).join(' ') + 'L' + P(a, 84).join(' ');
      const q = P(A9V1.mc(F), 84), e = this.nums[F - 1];
      const inside = q[0] > B.x && q[0] < B.x + B.w;
      Object.assign(e.style, { left: q[0] + 'px', top: (B.y - lerp(16, 24, z)) + 'px', opacity: F <= k && inside ? 1 : 0, fontSize: lerp(17, 26, z) + 'px' });
      e.classList.toggle('on', A9V1.BR(F) && t > 4.2);
    }
    // no zoom, só as linhas de limite: as faixas sombreadas sairiam todas sobrepostas ao Brasil
    this.el.odd.setAttribute('d', odd); this.el.odd.style.opacity = 1 - z;
    this.el.zl.setAttribute('d', zl); this.el.zl.style.strokeWidth = lerp(1.3, 2.4, z);
    this.el.zbr.setAttribute('d', zbr); this.el.zbr.style.opacity = eo(seg(t, 4.2, 5.0)) * (1 - z);
    this.el.z23.setAttribute('d', z23); this.el.z23.style.opacity = eo(seg(t, 11.8, 12.4));
    const v = P(A9V1.VIC.lam, A9V1.VIC.phi);
    this.el.vic.setAttribute('cx', v[0]); this.el.vic.setAttribute('cy', v[1]); this.el.vic.style.opacity = eo(seg(t, 11.8, 12.4));
    this.t1.style.opacity = 1 - seg(t, 5.6, 6.0);
    this.t2.style.opacity = seg(t, 6.2, 6.8);
    for (const [s, a] of this.side) { const u = eo(seg(t, a, a + 0.6)); s.opacity = u; s.transform = 'translateX(' + lerp(26, 0, u) + 'px)'; }
  },
});
