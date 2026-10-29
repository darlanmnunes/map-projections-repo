// Cena 3 (44 a 65 s): fusos UTM, RTM e LTM sobre Minas Gerais (3, 7 e 13), com o fuso de Viçosa
// em destaque. Mapa em (λ, φ) com escala cos 19° na longitude, como nos slides.
const { seg, eo, eio, lerp, TextFx } = kit;
const M = { a: -52.5, b: -38.5, lo: -23.6, hi: -13.8, x0: 110 };
const KX = 79.3, KY = KX / Math.cos(19 * Math.PI / 180);
const MX = l => M.x0 + (l - M.a) * KX;
const MY = p => 175 + (M.hi - p) * KY;
const TROCA = [6.5, 11.0];
kit.scene('minas', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line">RTM e LTM sobre Minas Gerais</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    const D = kit.json('v5-dados.json');
    const ring = r => { let d = ''; for (let i = 0; i < r.length; i += 2) d += (i ? 'L' : 'M') + MX(r[i]).toFixed(1) + ' ' + MY(r[i + 1]).toFixed(1); return d + 'Z'; };
    const W = MX(M.b) - MX(M.a), H = MY(M.lo) - MY(M.hi);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><defs><clipPath id="mi-clip"><rect x="' + MX(M.a) + '" y="' + MY(M.hi) +
      '" width="' + W + '" height="' + H + '"/></clipPath></defs><g class="mi-map" clip-path="url(#mi-clip)">' +
      '<rect class="mapbg" x="' + MX(M.a) + '" y="' + MY(M.hi) + '" width="' + W + '" height="' + H + '"/>' +
      '<path class="state" d="' + D.vizinhos.map(ring).join('') + '"/><path class="mg" d="' + D.mg.map(ring).join('') + '"/>' +
      '<rect class="zhl mi-hl" y="' + MY(M.hi) + '" height="' + H + '"/><path class="zbd mi-bd" style="stroke-width:2.5"/><path class="zmc mi-mc"/>' +
      '<path class="lead mi-arw" style="stroke-width:3.5"/>' +
      '<circle class="dot" cx="' + MX(A9V5.VIC.lam).toFixed(1) + '" cy="' + MY(A9V5.VIC.phi).toFixed(1) + '" r="10"/></g>' +
      '<rect class="frame" x="' + MX(M.a) + '" y="' + MY(M.hi) + '" width="' + W + '" height="' + H + '"/></svg>');
    kit.stage.append(svg);
    this.map = svg.querySelector('.mi-map').parentNode.style;
    this.hl = svg.querySelector('.mi-hl'); this.bd = svg.querySelector('.mi-bd'); this.mcp = svg.querySelector('.mi-mc');
    this.arw = svg.querySelector('.mi-arw');
    this.labs = kit.h('<div style="position:absolute;inset:0"></div>');
    kit.stage.append(this.labs);
    for (let l = -52; l <= -39; l += 2) this.labs.append(kit.h('<div class="tick" style="left:' + (MX(l) - 24) + 'px;top:' + (MY(M.lo) + 8) + 'px">−' + (-l) + '°</div>'));
    this.labs.append(kit.h('<div class="lbl" style="left:' + (MX(A9V5.VIC.lam) + 14) + 'px;top:' + (MY(A9V5.VIC.phi) + 4) + 'px;font-size:26px">Viçosa</div>'));
    this.labs.append(kit.h('<div class="lbl" style="left:' + (MX(-46.5)) + 'px;top:' + (MY(-18.2)) + 'px;font-size:30px;font-weight:700">MG</div>'));
    this.arwL = kit.h('<div class="lbl tag" style="left:' + (MX(-52.3)) + 'px;top:' + (MY(-19.66) - 130) + 'px;font-size:25px;line-height:1.25">fuso 23 esticado até a divisa:<br>Δ<i>λ</i> ≈ 6°, <i>m</i> = 1,0045 (4,5 m por km)</div>');
    this.labs.append(this.arwL);
    // Painel: contagem de fusos por sistema
    this.rows = A9V5.SYS.map((s, i) => {
      const n = [3, 7, 13][i];
      const e = kit.h('<div class="words" style="left:1320px;top:' + (210 + i * 110) + 'px;width:540px"><p class="count"><span style="display:inline-block;width:130px">' + s.nome +
        '</span>' + n + ' fusos <span style="font-size:30px;font-weight:400">de ' + s.fuso + '</span></p></div>');
      kit.stage.append(e); return e;
    });
    this.mcl = kit.h('<div class="words" style="left:1320px;top:560px;width:540px"><p class="sub mi-mcl"></p></div>');
    kit.stage.append(this.mcl);
    this.mcTxt = this.mcl.querySelector('.mi-mcl');
    this.tro = kit.h('<div class="words" style="left:1320px;top:670px;width:540px"><p class="line" style="font-size:44px">Menos distorção, mais limites de fuso</p></div>');
    this.fim = kit.h('<div class="words" style="left:1320px;top:830px;width:540px"><p class="sub">Para o estado inteiro, nenhum dos três basta: cônicas como a Lambert com 2 paralelos padrão ou a Albers (Aulas 07 e 08)</p></div>');
    kit.stage.append(this.tro, this.fim);
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, 0.2);
    const ma = eo(seg(t, 0.4, 1.2));
    this.map.opacity = ma; this.labs.style.opacity = ma;
    const s = eio(seg(t, TROCA[0], TROCA[0] + 1.6)) + eio(seg(t, TROCA[1], TROCA[1] + 1.6));
    const sys = Math.round(s), grow = eo(seg(t, 1.2, 2.6));
    const y0 = MY(M.hi), H = MY(M.lo) - y0;
    let bd = '', mc = '';
    for (const L of A9V5.linhas(s, M.a, M.b)) {
      const a = L.a * grow;
      if (a <= 0.01) continue;
      const x = MX(L.lam).toFixed(1);
      (L.mc ? (mc += 'M' + x + ' ' + y0 + 'V' + (y0 + H * a).toFixed(1)) : (bd += 'M' + x + ' ' + y0 + 'V' + (y0 + H * a).toFixed(1)));
    }
    this.bd.setAttribute('d', bd); this.mcp.setAttribute('d', mc);
    const [h0, h1] = A9V5.fusoVic(s);
    this.hl.setAttribute('x', MX(h0).toFixed(1)); this.hl.setAttribute('width', (MX(h1) - MX(h0)).toFixed(1));
    this.hl.style.opacity = grow;
    // Seta do MC −45° até a divisa oeste (só no UTM)
    const ar = eio(seg(t, 3.0, 4.4)) * (1 - seg(t, TROCA[0] - 0.4, TROCA[0])), yA = MY(-19.66).toFixed(1);
    this.arw.setAttribute('d', ar > 0 ? 'M' + MX(-45) + ' ' + yA + 'H' + MX(lerp(-45, -51, ar)).toFixed(1) +
      'M' + (MX(lerp(-45, -51, ar)) + 14).toFixed(1) + ' ' + (+yA - 9) + 'L' + MX(lerp(-45, -51, ar)).toFixed(1) + ' ' + yA + 'L' + (MX(lerp(-45, -51, ar)) + 14).toFixed(1) + ' ' + (+yA + 9) : '');
    this.arwL.style.opacity = eo(seg(t, 4.2, 4.8)) * (1 - seg(t, TROCA[0] - 0.4, TROCA[0]));
    // Painel: a linha do sistema atual em destaque, as anteriores esmaecidas
    this.rows.forEach((e, i) => {
      const on = eo(seg(t, [1.4, TROCA[0], TROCA[1]][i], [1.4, TROCA[0], TROCA[1]][i] + 0.6));
      e.style.opacity = on * (sys === i ? 1 : 0.4);
      e.style.color = sys === i ? 'var(--accent)' : '';
    });
    this.mcTxt.innerHTML = 'Fuso de Viçosa: MC ' + A9V5.SYS[sys].mcVic;
    this.mcl.style.opacity = eo(seg(t, 1.8, 2.4)) * A9V5.clamp01(1 - Math.abs(s - sys) * 3);
    A9V5.fade(this.tro, t, 15.4, null, 26);
    A9V5.fade(this.fim, t, 17.0, null, 26);
  },
});
