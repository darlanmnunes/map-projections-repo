// Cena 1 (0 a 17 s): o globo gira para leste e os fusos aparecem numerados a partir do antimeridiano (180°)
const { seg, eo, eio, lerp } = kit;
const L0 = -177, L1 = 315;
kit.scene('globo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V1.buildGlobe(kit, 'globo');
    kit.stage.append(this.r.svg);
    this.nums = [];
    for (let F = 1; F <= 60; F++) {
      const e = kit.h('<div class="znum' + (A9V1.BR(F) ? ' br' : '') + '">' + F + '</div>');
      kit.stage.append(e); this.nums.push(e);
    }
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1000px"><h2 class="line">UTM: 60 fusos de 6°</h2></div>'));
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:1220px;top:' + top + 'px;width:640px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t = [
      [p(250, '<p class="sub"><b>Fuso 1</b>: de 180° W a 174° W</p>'), 1.0],
      [p(340, '<p class="sub">A numeração cresce para leste, de 6° em 6°</p>'), 3.6],
      [p(470, '<p class="sub"><b>Fuso 60</b>: de 174° E a 180°</p>'), 8.2],
      [p(560, '<p class="sub">Cada fuso vai de 80° S a 84° N</p>'), 10.0],
      [p(690, '<h2 class="line" style="font-size:42px;color:var(--accent)">Brasil continental:<br>fusos 18 a 25</h2>'), 13.2],
    ];
  },
  render(t) {
    const lc = lerp(L0, L1, eio(seg(t, 0.8, 12.6)));
    const C = { cx: 640, cy: 610, R: 400, e: 12, lc };
    // frente de revelação: fusos até um pouco a leste do centro da vista
    const k = Math.max(1, Math.min(60, Math.floor((lc + 180) / 6) + 4));
    A9V1.paintGlobe(this.r, C, { k, br: eo(seg(t, 12.8, 13.8)), z23: eo(seg(t, 14.6, 15.4)) });
    this.nums.forEach((e, i) => {
      const F = i + 1, q = A9V1.cam(C, A9V1.mc(F), 0);
      const vis = F <= k ? Math.max(0, Math.min(1, (q[2] - 0.5) / 0.2)) : 0;
      Object.assign(e.style, { left: q[0] + 'px', top: q[1] + 'px', opacity: vis });
      e.classList.toggle('on', A9V1.BR(F) && t > 12.8);
    });
    for (const [s, a] of this.t) { const u = eo(seg(t, a, a + 0.6)); s.opacity = u; s.transform = 'translateX(' + lerp(26, 0, u) + 'px)'; }
  },
});
