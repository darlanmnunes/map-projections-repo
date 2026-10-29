// Cena 1 (0 a 22 s): eq. (1) e os cinco parâmetros; a tabela passa de UTM a RTM e LTM enquanto
// a faixa de longitude em torno de Viçosa se divide em fusos de 6°, 2° e 1°
const { seg, eo, eio, lerp, TextFx } = kit;
const SX = { a: -49, b: -41, x0: 190, x1: 1730, y0: 690, y1: 800 };
const LX = l => SX.x0 + (l - SX.a) / (SX.b - SX.a) * (SX.x1 - SX.x0);
const TROCA = [9, 15];                                    // RTM e LTM entram
kit.scene('parametros', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line">UTM, RTM e LTM: uma só projeção</h2></div>'));
    this.line = kit.stage.querySelector('.line');
    this.eq = kit.h('<div class="card" style="left:110px;top:180px;width:820px">' +
      '<p class="eq big" style="margin:0"><i>E</i> = <i>E</i><sub>0</sub> + <i>k</i><sub>0</sub> <i>x</i>,&emsp;<i>N</i> = <i>N</i><sub>0</sub> + <i>k</i><sub>0</sub> <i>y</i>&emsp;&emsp;(1)</p>' +
      '<p class="sub" style="margin:12px 0 0;font-size:27px"><i>x</i>, <i>y</i>: TM no elipsoide, com escala 1 no MC e origem no Equador</p></div>');
    this.msg = kit.h('<div class="words" style="left:110px;top:430px;width:820px"><p class="sub">Entre os três sistemas mudam só os cinco parâmetros. As fórmulas são as mesmas.</p></div>');
    kit.stage.append(this.eq, this.msg);
    // Tabela: uma coluna de valores por sistema, sobrepostas (troca por opacidade)
    const rot = ['Amplitude do fuso', 'MC', '<i>k</i><sub>0</sub>', 'Falso leste <i>E</i><sub>0</sub>', 'Falso norte <i>N</i><sub>0</sub> (Sul)'];
    const campo = ['fuso', 'mc', 'k0', 'e0', 'n0'];
    let rows = '';
    rot.forEach((r, j) => {
      rows += '<tr><td>' + r + '</td><td class="v">' + A9V5.SYS.map((s, i) => '<span data-i="' + i + '" data-j="' + j + '">' + s[campo[j]] + '</span>').join('') + '</td></tr>';
    });
    this.tab = kit.h('<div class="card" style="left:1040px;top:160px;width:780px">' +
      '<div class="sys" style="position:relative;height:72px">' + A9V5.SYS.map((s, i) => '<span data-i="' + i + '" style="position:absolute;left:0;top:0">' + s.nome + '</span>').join('') + '</div>' +
      '<table class="ptab" style="width:100%">' + rows + '</table></div>');
    kit.stage.append(this.tab);
    this.vals = [...this.tab.querySelectorAll('td.v span')];
    this.names = [...this.tab.querySelectorAll('.sys span')];
    // Faixa de longitude
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="pa-g">' +
      '<rect class="strip" x="' + SX.x0 + '" y="' + SX.y0 + '" width="' + (SX.x1 - SX.x0) + '" height="' + (SX.y1 - SX.y0) + '"/>' +
      '<rect class="zhl pa-hl" y="' + SX.y0 + '" height="' + (SX.y1 - SX.y0) + '"/><path class="zbd pa-bd"/><path class="zmc pa-mc"/>' +
      '<circle class="dot" cx="' + LX(A9V5.VIC.lam).toFixed(1) + '" cy="' + (SX.y0 + SX.y1) / 2 + '" r="10"/></g></svg>');
    kit.stage.append(svg);
    this.g = svg.querySelector('.pa-g').style;
    this.hl = svg.querySelector('.pa-hl'); this.bd = svg.querySelector('.pa-bd'); this.mcp = svg.querySelector('.pa-mc');
    this.ticks = kit.h('<div style="position:absolute;inset:0"></div>');
    for (let l = SX.a; l <= SX.b; l++) this.ticks.append(kit.h('<div class="tick" style="left:' + (LX(l) - 24) + 'px;top:' + (SX.y1 + 10) + 'px">−' + (-l) + '°</div>'));
    this.ticks.append(kit.h('<div class="lbl" style="left:' + (LX(A9V5.VIC.lam) + 16) + 'px;top:' + ((SX.y0 + SX.y1) / 2 - 18) + 'px;font-size:28px">Viçosa</div>'));
    this.ticks.append(kit.h('<div class="tick" style="left:' + SX.x0 + 'px;top:' + (SX.y0 - 40) + 'px">Longitude em torno de Viçosa; em laranja, o fuso que a contém</div>'));
    kit.stage.append(this.ticks);
    this.mcl = kit.h('<div class="lbl" style="top:' + (SX.y1 + 50) + 'px;font-size:28px;color:var(--accent)"></div>');
    this.uso = A9V5.SYS.map(s => { const e = kit.h('<div class="words" style="left:190px;top:960px;width:1500px"><p class="sub">' + s.uso + '</p></div>'); kit.stage.append(e); return e; });
    kit.stage.append(this.mcl);
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, 0.2);
    A9V5.fade(this.eq, t, 1.0, null, 26);
    A9V5.fade(this.msg, t, 3.0, null, 26);
    A9V5.fade(this.tab, t, 1.8, null, 26);
    // s: estado contínuo do sistema (0 = UTM, 1 = RTM, 2 = LTM)
    const s = eio(seg(t, TROCA[0], TROCA[0] + 1.6)) + eio(seg(t, TROCA[1], TROCA[1] + 1.6));
    const sys = Math.round(s);
    for (const e of this.names) e.style.opacity = A9V5.clamp01(1 - Math.abs(s - +e.dataset.i) * 1.6);
    for (const e of this.vals) {
      const i = +e.dataset.i, o = A9V5.clamp01(1 - Math.abs(s - i) * 1.6);
      e.style.opacity = o;
      // valor que mudou em relação ao sistema anterior: laranja por 2 s
      const prev = i > 0 ? this.vals.find(v => +v.dataset.i === i - 1 && v.dataset.j === e.dataset.j) : null;
      const novo = prev && prev.innerHTML !== e.innerHTML && t < TROCA[i - 1] + 3.6;
      e.style.color = novo ? 'var(--accent)' : '';
    }
    const ga = eo(seg(t, 4.2, 5.0));
    this.g.opacity = ga; this.ticks.style.opacity = ga;
    // Linhas de limite (crescem de cima para baixo) e MCs
    let bd = '', mc = '';
    for (const L of A9V5.linhas(s, SX.a, SX.b)) {
      if (L.a <= 0.01) continue;
      const x = LX(L.lam).toFixed(1);
      if (L.mc) mc += 'M' + x + ' ' + SX.y0 + 'V' + (SX.y0 + (SX.y1 - SX.y0) * L.a).toFixed(1);
      else bd += 'M' + x + ' ' + (SX.y0 - 14) + 'V' + (SX.y0 - 14 + (SX.y1 - SX.y0 + 28) * L.a).toFixed(1);
    }
    this.bd.setAttribute('d', bd); this.mcp.setAttribute('d', mc);
    const [h0, h1] = A9V5.fusoVic(s);
    this.hl.setAttribute('x', LX(h0).toFixed(1)); this.hl.setAttribute('width', (LX(h1) - LX(h0)).toFixed(1));
    this.mcl.innerHTML = 'MC de Viçosa: ' + A9V5.SYS[sys].mcVic;
    this.mcl.style.left = (LX((h0 + h1) / 2) - 140) + 'px';
    this.mcl.style.opacity = ga * A9V5.clamp01(1 - Math.abs(s - sys) * 3);
    this.uso.forEach((e, i) => { e.style.opacity = ga * A9V5.clamp01(1 - Math.abs(s - i) * 1.6); });
    kit.stage.style.opacity = 1 - seg(t, 21.4, 22);
  },
});
