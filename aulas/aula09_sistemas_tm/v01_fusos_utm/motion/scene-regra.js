// Cena 3 (31 a 52 s): λ + 180° contado em blocos de 6°: 22 blocos inteiros, então Viçosa está no fuso 23
const { seg, eo, lerp } = kit;
const X0 = 130, X1 = 1790, LA = -180, LB = -36, Y = 330;
const X = l => X0 + (l - LA) / (LB - LA) * (X1 - X0);
kit.scene('regra', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const lam = A9V1.VIC.lam;
    let segs = '';
    for (let F = 1; F <= 23; F++) {
      const a = A9V1.west(F), b = Math.min(a + 6, F === 23 ? lam : a + 6);
      segs += '<rect class="seg rg-s' + F + (F === 23 ? ' on' : '') + '" x="' + X(a) + '" y="' + (Y - 46) + '" width="' + (X(b) - X(a)) + '" height="46"/>';
    }
    let ticks = '';
    for (let l = LA; l <= LB; l += 6) ticks += 'M' + X(l) + ' ' + (Y - 8) + 'V' + (Y + 8);
    this.svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' + segs +
      '<path class="axis" d="M' + X0 + ' ' + Y + 'H' + X1 + ticks + '"/>' +
      '<path class="mcl rg-mc" d="M' + X(-45) + ' ' + (Y - 92) + 'V' + (Y + 22) + '"/>' +
      '<path class="arrow rg-ar" d="M' + X(-45) + ' ' + (Y - 70) + 'H' + X(lam) + 'm-12 -8l12 8l-12 8"/>' +
      '<circle class="dot rg-vic" r="10" cx="' + X(lam) + '" cy="' + Y + '"/></svg>');
    kit.stage.append(this.svg);
    this.s = []; for (let F = 1; F <= 23; F++) this.s.push(this.svg.querySelector('.rg-s' + F));
    this.mc = this.svg.querySelector('.rg-mc'); this.ar = this.svg.querySelector('.rg-ar'); this.vic = this.svg.querySelector('.rg-vic');
    this.cnt = [];
    for (let F = 1; F <= 23; F++) {
      const e = kit.h('<div class="znum" style="font-size:19px;left:' + X(A9V1.mc(F) - (F === 23 ? 0.4 : 0)) + 'px;top:' + (Y - 23) + 'px">' + F + '</div>');
      kit.stage.append(e); this.cnt.push(e);
    }
    const tk = (l, s) => kit.stage.append(kit.h('<div class="tick" style="left:' + X(l) + 'px;top:' + (Y + 16) + 'px;transform:translateX(-50%)">' + s + '</div>'));
    for (const l of [-180, -150, -120, -90, -60]) tk(l, l + '°');
    tk(-48, '−48°'); tk(-42, '−42°'); tk(-36, '−36°');
    const lab = (x, y, html, cls) => { const e = kit.h('<div class="lbl ' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.lVic = lab(X(lam) - 20, Y + 56, 'Viçosa: <i>λ</i> = −42°52′', 'r');
    this.lSum = lab(X(-120), Y - 110, '<i>λ</i> + 180° = 137,13° = 22,86 × 6°');
    this.lMc = lab(X(-45) - 14, Y - 132, 'MC −45°', 'r');
    this.lDl = lab(X(-45) + 4, Y - 132, '<span style="color:#C0392B"><i>Δλ</i> = +2°08′</span>');
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1400px"><h2 class="line">Em que fuso está Viçosa?</h2></div>'));
    const steps = [
      ['1', '<i>λ</i> = −42°52′ = −42,8667° (graus decimais, negativo a oeste)', 0.8],
      ['2', '<i>F</i> = ⌊(<i>λ</i> + 180°) / 6°⌋ + 1 = ⌊22,86⌋ + 1 = <b>23</b>', 9.6],
      ['3', '<i>λ</i><sub>MC</sub> = 6° · <i>F</i> − 183° = 6 · 23 − 183 = <b>−45°</b>', 12.6],
      ['4', '<i>Δλ</i> = <i>λ</i> − <i>λ</i><sub>MC</sub> = +2°08′ &gt; 0: a leste do MC, <i>E</i> &gt; 500 000 m', 14.8],
      ['5', '<i>φ</i> = −20°45′ &lt; 0: Hemisfério Sul, <i>N</i><sub>0</sub> = 10 000 000 m', 17.4],
    ];
    const box = kit.h('<div class="words" style="left:130px;top:520px;width:1660px;gap:22px"></div>');
    this.steps = steps.map(([n, html, a]) => { const e = kit.h('<p class="step"><span class="n">' + n + '</span><span>' + html + '</span></p>'); box.append(e); return [e.style, a]; });
    kit.stage.append(box);
  },
  render(t) {
    const fill = seg(t, 3.0, 8.6);
    this.s.forEach((r, i) => { const u = seg(fill * 23, i, i + 0.6); r.style.opacity = u; this.cnt[i].style.opacity = u; });
    this.svg.querySelector('.axis').style.opacity = eo(seg(t, 0, 0.6));
    this.vic.style.opacity = eo(seg(t, 0.8, 1.4)); this.lVic.opacity = eo(seg(t, 0.8, 1.4));
    this.lSum.opacity = eo(seg(t, 8.8, 9.4));
    this.mc.style.opacity = eo(seg(t, 12.6, 13.2)); this.lMc.opacity = eo(seg(t, 12.6, 13.2));
    this.ar.style.opacity = eo(seg(t, 14.8, 15.4)); this.lDl.opacity = eo(seg(t, 14.8, 15.4));
    for (const [s, a] of this.steps) { const u = eo(seg(t, a, a + 0.6)); s.opacity = u; s.transform = 'translateX(' + lerp(26, 0, u) + 'px)'; }
  },
});
