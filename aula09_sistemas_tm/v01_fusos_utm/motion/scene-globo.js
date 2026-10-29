// Cena 1 (0 a 19 s): o cilindro transverso secante gira 6° por vez em torno do eixo polar;
// a cada parada ele toca um novo fuso, numerado para leste a partir do antimeridiano (180°)
const { seg, eo, eio, lerp } = kit;
const SLOW0 = 1.6, STEP = 0.9, MOVE = 0.5, NSLOW = 4;   // fusos 1 a 5: um giro de 6° a cada 0,9 s
const FAST0 = 6.0, FAST1 = 14.6, ZEND = 83;              // depois, contínuo até voltar ao fuso 23 (83 = 60 + 23)
kit.scene('globo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V1.buildGlobe(kit, 'globo');
    kit.stage.append(this.r.svg);
    this.nums = [];
    for (let F = 1; F <= 60; F++) {
      const e = kit.h('<div class="znum">' + F + '</div>');
      kit.stage.append(e); this.nums.push(e);
    }
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1000px"><h2 class="line">UTM: 60 fusos de 6°</h2></div>'));
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1220px;top:' + top + 'px;width:640px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t = [
      [p(200, '<p class="sub">Cilindro transverso secante: toca o globo em duas linhas, a ±1°37′ do MC</p>'), 0.6],
      [p(330, '<p class="sub"><b>Fuso 1</b>: de 180° W a 174° W</p>'), SLOW0 + 0.4],
      [p(410, '<p class="sub">A cada giro de 6° do cilindro, um novo fuso, numerado para leste</p>'), SLOW0 + 2.2],
      [p(540, '<p class="sub"><b>Fuso 60</b>: de 174° E a 180°</p>'), 11.0],
      [p(620, '<p class="sub">Cada fuso vai de 80° S a 84° N</p>'), 12.2],
      [p(740, '<h2 class="line" style="font-size:42px;color:var(--accent)">Brasil continental:<br>fusos 18 a 25</h2>'), 15.2],
    ];
  },
  render(t) {
    // z: posição do cilindro em "fusos" (1 = fuso 1); MC do cilindro = −177° + 6°(z − 1)
    let z;
    if (t < FAST0) {
      const u = Math.max(0, t - SLOW0), i = Math.min(NSLOW, Math.floor(u / STEP));
      z = 1 + i + (i < NSLOW ? eio(seg(u - i * STEP, 0, MOVE)) : 0);
    } else z = lerp(1 + NSLOW, ZEND, eio(seg(t, FAST0, FAST1)));
    const lcyl = -177 + 6 * (z - 1);
    // câmera parada no início (o giro do cilindro fica visível); depois acompanha o cilindro
    const lc = t < FAST0 ? -165 : lcyl - 12 * (1 - eo(seg(t, FAST0, FAST0 + 2.2)));
    const C = { cx: 640, cy: 610, R: 400, e: 12, lc };
    const k = Math.min(60, Math.floor(z + 0.02));
    A9V1.paintGlobe(this.r, C, { k, br: eo(seg(t, 15.0, 16.0)), z23: eo(seg(t, 16.4, 17.2)),
      cyl: { lc: lcyl, op: eo(seg(t, 0.3, 1.2)) * (1 - 0.75 * eo(seg(t, 15.0, 16.0))) } });
    this.nums.forEach((e, i) => {
      const F = i + 1, q = A9V1.cam(C, A9V1.mc(F), 0);
      const vis = F <= k ? Math.max(0, Math.min(1, (q[2] - 0.5) / 0.2)) : 0;
      Object.assign(e.style, { left: q[0] + 'px', top: q[1] + 'px', opacity: vis });
      e.classList.toggle('on', A9V1.BR(F) && t > 15.0);
    });
    for (const [s, a] of this.t) { const u = eo(seg(t, a, a + 0.6)); s.opacity = u; s.transform = 'translateX(' + lerp(26, 0, u) + 'px)'; }
  },
});
