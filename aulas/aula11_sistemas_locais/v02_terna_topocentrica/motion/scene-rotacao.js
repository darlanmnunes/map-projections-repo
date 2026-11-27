// Cena 3: dois giros, R3(90° + λ0) e R1(90° − φ0); a matriz T, eq. (31)
const { seg, eo, eio, TextFx } = kit;
kit.scene('rotacao', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const V = kit.json('v2-dados.json').O;
    const C = [540, 580], a = 320, b = 288;
    const G = A11V2.globo(C, a, b, V.phi, V.lam);
    this.P = G.P; this.O3 = G.E.pt(V.phi, V.lam); this.L = 190;
    this.A1 = 90 + V.lam; this.A2 = 90 - V.phi;
    const o = this.P(this.O3);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' + G.svg +
      '<path class="ax le k-x"/><path class="ax no k-y"/><path class="ax nu k-z"/>' +
      '<circle class="novo" r="11" cx="' + o[0].toFixed(1) + '" cy="' + o[1].toFixed(1) + '"/></svg>');
    kit.stage.append(svg);
    this.e = { x: svg.querySelector('.k-x'), y: svg.querySelector('.k-y'), z: svg.querySelector('.k-z') };
    const S = 'font-family:var(--sans);font-weight:700;font-size:28px;';
    this.l = { x: A11.lbl(kit, '', 0, 0, S + 'color:#B0308F'), y: A11.lbl(kit, '', 0, 0, S + 'color:#2E8B57'), z: A11.lbl(kit, '', 0, 0, S + 'color:var(--second)') };
    A11.lbl(kit, '<b>O</b>', o[0] - 40, o[1] + 4, 'font-size:30px;color:var(--accent)');
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Dois giros, com <i>φ</i><sub>0</sub> e <i>λ</i><sub>0</sub></h2>').querySelector('h2');
    const B = (y, html, w = 820) => A11.bloco(kit, 1040, y, w, html);
    const card = (n, html) => '<div class="card" style="position:relative;padding:18px 26px"><p class="sub sm" style="margin:0"><span class="passo">' + n + '</span>&ensp;' + html + '</p></div>';
    this.c1 = B(180, card(1, '<i>R</i><sub>3</sub>(90° + <i>λ</i><sub>0</sub>) = <i>R</i><sub>3</sub>(47,1°): em torno de <i>Z</i>;<br><i>X</i> passa a apontar para <b>leste</b>'));
    this.c2 = B(350, card(2, '<i>R</i><sub>1</sub>(90° − <i>φ</i><sub>0</sub>) = <i>R</i><sub>1</sub>(110,7°): em torno do novo <i>X</i>;<br><i>Z</i> vai para a <b>normal</b>, <i>Y</i> para o <b>norte</b>'));
    this.mt = B(540, '<p class="eq">[<i>x</i><sub>L</sub> <i>y</i><sub>L</sub> <i>z</i><sub>L</sub>]<sup>T</sup> = <b>T</b> [<i>X</i> − <i>X</i><sub>O</sub>, <i>Y</i> − <i>Y</i><sub>O</sub>, <i>Z</i> − <i>Z</i><sub>O</sub>]<sup>T</sup>&emsp;(30)</p>' +
      '<div style="display:flex;align-items:center;gap:16px"><span class="eq"><b>T</b> =</span><div class="mat">' +
      '<span class="r0">−sen <i>λ</i><sub>0</sub></span><span class="r0">cos <i>λ</i><sub>0</sub></span><span class="r0">0</span>' +
      '<span class="r1">−sen <i>φ</i><sub>0</sub> cos <i>λ</i><sub>0</sub></span><span class="r1">−sen <i>φ</i><sub>0</sub> sen <i>λ</i><sub>0</sub></span><span class="r1">cos <i>φ</i><sub>0</sub></span>' +
      '<span class="r2">cos <i>φ</i><sub>0</sub> cos <i>λ</i><sub>0</sub></span><span class="r2">cos <i>φ</i><sub>0</sub> sen <i>λ</i><sub>0</sub></span><span class="r2">sen <i>φ</i><sub>0</sub></span>' +
      '</div><span class="cx" style="display:flex;flex-direction:column;gap:12px;font-size:24px"><span class="q0" style="color:#B0308F">← leste</span><span class="q1" style="color:#2E8B57">← norte</span><span class="q2" style="color:var(--second)">← normal</span></span></div>' +
      '<p class="eq" style="margin-top:6px">(31)</p>');
    this.rows = [0, 1, 2].map(i => [this.mt.querySelectorAll('.r' + i), this.mt.querySelector('.q' + i)]);
    this.ort = B(920, '<p class="sub"><b>T</b> é ortogonal: <b>T</b><sup>−1</sup> = <b>T</b><sup>T</sup>; a volta é a transposta</p>');
    this.k = { g1: A11V2.em(kit, 'c2', 'giro', 0.2), g2: A11V2.em(kit, 'c3', 'giro', 0.2), mt: A11V2.em(kit, 'c4', 'matriz', 0.25),
      lin: A11V2.em(kit, 'c4', 'linha', 0.4), le: A11V2.em(kit, 'c4', 'leste', 0.55), no: A11V2.em(kit, 'c4', 'norte', 0.6),
      nu: A11V2.em(kit, 'c4', 'normal', 0.65), ort: A11V2.em(kit, 'c4', 'ortogonal', 0.75) };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, D = Math.PI / 180;
    const a = this.A1 * eio(seg(t, k.g1 + 0.3, k.g1 + 3.3)) * D, b = this.A2 * eio(seg(t, k.g2 + 0.3, k.g2 + 4.0)) * D;
    let e1 = [Math.cos(a), Math.sin(a), 0], e2 = [-Math.sin(a), Math.cos(a), 0], e3 = [0, 0, 1];
    const n2 = [Math.cos(b) * e2[0] + Math.sin(b) * e3[0], Math.cos(b) * e2[1] + Math.sin(b) * e3[1], Math.cos(b) * e2[2] + Math.sin(b) * e3[2]];
    const n3 = [-Math.sin(b) * e2[0] + Math.cos(b) * e3[0], -Math.sin(b) * e2[1] + Math.cos(b) * e3[1], -Math.sin(b) * e2[2] + Math.cos(b) * e3[2]];
    e2 = n2; e3 = n3;
    const P = this.P, O = this.O3, L = this.L, o = P(O);
    const fim = t > k.g2 + 4.0;
    const nomes = fim ? ['<i>x</i><sub>L</sub> leste', '<i>y</i><sub>L</sub> norte', '<i>z</i><sub>L</sub> normal'] : ['<i>X</i>', '<i>Y</i>', '<i>Z</i>'];
    [['x', e1], ['y', e2], ['z', e3]].forEach(([n, v], i) => {
      const q = P(A11V2.add(O, v, L));
      this.e[n].setAttribute('d', A11V2.seta(o, q));
      const eixoGiro = (n === 'z' && t > k.g1 && t < k.g1 + 3.6) || (n === 'x' && t > k.g2 && t < k.g2 + 4.3);
      this.e[n].style.strokeWidth = eixoGiro ? 10 : 6;
      const lb = this.l[n]; lb.innerHTML = nomes[i];
      const dx = q[0] - o[0], dy = q[1] - o[1], r = Math.hypot(dx, dy) || 1;
      lb.style.left = (q[0] + dx / r * 26 - (dx < 0 ? (fim ? 130 : 24) : 0)).toFixed(1) + 'px';
      lb.style.top = (q[1] + dy / r * 26 - 20).toFixed(1) + 'px';
      lb.style.opacity = eo(seg(t, 0.3, 0.9));
      this.e[n].style.opacity = eo(seg(t, 0.2, 0.8));
    });
    A11.show(this.c1, t, k.g1 - 0.2); A11.show(this.c2, t, k.g2 - 0.2);
    A11.show(this.mt, t, k.mt); A11.show(this.ort, t, k.ort);
    [k.le, k.no, k.nu].forEach((t0, i) => {
      const on = eo(seg(t, t0, t0 + 0.4)) * (1 - eo(seg(t, t0 + 1.6, t0 + 2.2)));
      const [cells, q] = this.rows[i];
      cells.forEach(c => { c.style.background = 'color-mix(in srgb, var(--accent) ' + (28 * on).toFixed(0) + '%, transparent)'; });
      q.style.opacity = eo(seg(t, t0, t0 + 0.5));
    });
  },
});
