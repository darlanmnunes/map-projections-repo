// Cena 1: deslocamento do ponto 3 do exemplo de Viçosa quando uma correção é esquecida (escala logarítmica)
const { seg, eo, eio, TextFx } = kit;
kit.scene('erros', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A10V6.estilo(kit);
    const d = kit.json('v6-dados.json'), e = d.erros_m, B = A10V6.BAR, X = A10V6.xLog;
    const fmt = m => m >= 1 ? A10.num(m, 1) + ' m' : m >= 0.1 ? A10.num(m * 100, 0) + ' cm' : A10.num(m * 1000, 0) + ' mm';
    const linhas = [
      ['<i>γ</i> esquecido<br><span class="note">orientação por azimute geodésico</span>', e.gama, 'g', kit.em('a2', 'gama')],
      ['sem <i>m</i><sub>23</sub>', e.m, '', kit.em('a3', 'escala')],
      ['sem <i>F</i><sub>h</sub>', e.fh, '', kit.em('a3', 'altitude')],
      ['sem <i>m</i><sub>23</sub> e sem <i>F</i><sub>h</sub>', e.mfh, 'k', kit.em('a3', 'metade')],
      ['<i>m</i> do ponto, não da linha', e.mponto, 'p', kit.em('a4', '21')],
      ['sem <i>ψ</i><sub>23</sub>', e.psi23, 'p', kit.em('a4', 'psi')],
    ];
    const y0 = 250, dy = 105, h = 46;
    let svg = '<svg class="art" viewBox="0 0 1920 1080">';
    let grade = '';
    for (let p = B.lo; p <= B.hi; p++) grade += 'M' + X(Math.pow(10, p)).toFixed(1) + ' ' + (y0 - 30) + 'V' + (y0 + dy * linhas.length - 20);
    svg += '<path class="gridl v6-gr" style="stroke-width:1.4" d="' + grade + '"/>';
    linhas.forEach((l, i) => { svg += '<rect class="v6bar ' + l[2] + ' v6-b' + i + '" x="' + B.x0 + '" y="' + (y0 + i * dy) + '" height="' + h + '" width="0" rx="4"/>'; });
    const xe = X(d.et_mm / 1000);
    svg += '<path class="v6-et" d="M' + xe.toFixed(1) + ' ' + (y0 - 40) + 'V' + (y0 + dy * linhas.length - 10) + '" style="stroke:var(--corda);stroke-width:4;stroke-dasharray:12 8;fill:none"/></svg>';
    const s = kit.h(svg); kit.stage.append(s);
    this.gr = s.querySelector('.v6-gr'); this.et = s.querySelector('.v6-et');
    this.rows = linhas.map((l, i) => ({
      r: s.querySelector('.v6-b' + i), w: X(l[1]) - B.x0, t: l[3],
      lab: A10.bloco(kit, 140, y0 + i * dy - (l[0].includes('<br>') ? 10 : -2), 480, '<p class="sub" style="font-size:29px;line-height:1.15">' + l[0] + '</p>'),
      val: A10.lbl(kit, '<b>' + fmt(l[1]) + '</b>', X(l[1]) + 14, y0 + i * dy + 4, 'font-family:var(--sans);font-size:30px'),
    }));
    this.ticks = ['1 mm', '1 cm', '10 cm', '1 m', '10 m', '100 m'].map((tx, i) =>
      A10.lbl(kit, tx, X(Math.pow(10, B.lo + i)) - 30, y0 + dy * linhas.length - 6, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 65%, var(--ground))'));
    this.etl = A10.lbl(kit, 'estação total<br>2 mm + 2 ppm ≈ 8 mm', xe - 112, y0 + dy * linhas.length + 34,
      'font-family:var(--sans);font-size:22px;color:var(--corda);text-align:center;line-height:1.2');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Quanto vale cada correção?</h2>').querySelector('h2');
    this.sub = A10.bloco(kit, 110, 140, 1300, '<p class="note" style="font-size:26px">Exemplo de Viçosa (linha de 2,85 km): quanto o ponto 3 se desloca se uma correção for esquecida. Escala logarítmica.</p>');
    this.k = { sub: kit.em('a1', 'exemplo'), gr: kit.em('a1', 'medir'), et: kit.em('a4', 'precisao') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    A10.fade(this.sub, t, this.k.sub);
    A10.fade(this.gr, t, this.k.gr); this.ticks.forEach(x => A10.fade(x, t, this.k.gr));
    for (const r of this.rows) {
      A10.show(r.lab, t, r.t - 0.2);
      r.r.setAttribute('width', (r.w * eio(seg(t, r.t, r.t + 0.9))).toFixed(1));
      A10.fade(r.val, t, r.t + 0.8);
    }
    A10.draw(this.et, eio(seg(t, this.k.et, this.k.et + 0.8))); A10.fade(this.etl, t, this.k.et + 0.5);
  },
});
