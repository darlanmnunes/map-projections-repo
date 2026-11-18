// Cena 4 (passos 4 e 5): ψ23 e AzC,23; m23 por Simpson e Dc; E3, N3 definitivos; a 2ª iteração não muda nada
const { seg, eo, TextFx } = kit;
kit.scene('passos45', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v4-dados.json').vic, n3 = A10V4.n3;
    const card = (y, passo, html) => {
      const e = kit.h('<div class="card" style="left:120px;top:' + y + 'px;width:880px;padding:16px 26px">' +
        (passo ? '<span class="passo" style="position:absolute;left:-23px;top:18px">' + passo + '</span>' : '') + html + '</div>');
      kit.stage.append(e); return e;
    };
    this.c4a = card(170, '4', '<p class="eq" style="margin:0"><i>ψ</i><sub>23</sub> = ' + A10.num(d.psi23, 3, true) + '″, eq. (23)</p>' +
      '<p class="eq" style="margin:0">Az<sub>C,23</sub> = Az<sub>Q,23</sub> − <i>ψ</i><sub>23</sub> = <b>' + A10V4.ang(d.azc23, 3) + '</b></p>');
    this.c4b = card(320, '', '<p class="eq" style="margin:0"><i>m</i><sub>23</sub> = ' + A10.num(d.m23, 8) + '&ensp;<span class="note">(Simpson, eq. 19)</span></p>' +
      '<p class="eq" style="margin:0"><i>D</i><sub>c</sub> = <i>m</i><sub>23</sub> · <i>D</i><sub>e</sub> = <b>' + n3(d.Dc) + ' m</b></p>' +
      '<p class="sub" style="margin:4px 0 0;font-size:27px;color:var(--accent)"><b>+' + A10.num(d.Dc - d.Dh, 2) + ' m</b> em relação à medida: a grade “estica” a linha</p>');
    this.c5 = card(520, '5', '<p class="eq" style="margin:0"><i>E</i><sub>3</sub> = <i>E</i><sub>2</sub> + <i>D</i><sub>c</sub> sen Az<sub>C,23</sub> = <b>' + n3(d.p3[0]) + '</b></p>' +
      '<p class="eq" style="margin:0"><i>N</i><sub>3</sub> = <i>N</i><sub>2</sub> + <i>D</i><sub>c</sub> cos Az<sub>C,23</sub> = <b>' + n3(d.p3[1]) + '</b>&ensp;<span class="note">(26)</span></p>');
    // Zoom no ponto 3: aproximado (3′) e definitivo (3)
    const Z = [470, 850], esc = 1400;                       // px por metro no zoom
    const dE = d.p3[0] - d.p3a[0], dN = d.p3[1] - d.p3a[1];
    const q3 = [Z[0] + dE * esc / 2, Z[1] - dN * esc / 2], q3a = [Z[0] - dE * esc / 2, Z[1] + dN * esc / 2];
    const sep = Math.hypot(dE, dN) * 100;
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="z-g">' +
      '<circle cx="' + Z[0] + '" cy="' + Z[1] + '" r="115" style="fill:color-mix(in srgb, var(--main) 4%, var(--ground));stroke:var(--accent);stroke-width:2;stroke-dasharray:6 6"/>' +
      '<circle class="novo" r="13" cx="' + q3a[0].toFixed(1) + '" cy="' + q3a[1].toFixed(1) + '" style="stroke-dasharray:6 5"/>' +
      '<circle class="z-3" r="13" cx="' + q3[0].toFixed(1) + '" cy="' + q3[1].toFixed(1) + '" style="fill:var(--accent);stroke:var(--ground);stroke-width:3"/></g></svg>');
    kit.stage.append(svg); this.z = svg.querySelector('.z-g'); this.z3 = svg.querySelector('.z-3');
    this.zl = [A10.lbl(kit, '3′', q3a[0] - 46, q3a[1] + 4, 'font-family:var(--sans);font-weight:700;font-size:24px'),
      A10.lbl(kit, '3', q3[0] + 18, q3[1] - 36, 'font-family:var(--sans);font-weight:700;font-size:24px;color:var(--accent)'),
      A10.bloco(kit, 610, 790, 420, '<p class="sub" style="font-size:26px">Zoom no ponto 3: do aproximado ao definitivo, <b>' + A10.num(sep, 1) + ' cm</b></p>')];
    this.it = A10.bloco(kit, 610, 905, 430, '<p class="sub" style="font-size:26px">2ª iteração: menos de 0,1 mm<br><span class="note"><i>β</i> = <i>α</i> + ' + A10.num(d.beta_s, 2) + '″ entre as cordas, eq. (25)</span></p>');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Passos 4 e 5: a corda da vante e o ponto 3</h2>').querySelector('h2');
    this.rows = A10V4.quadro(kit, d, 1080, 190);
    this.k = { p4: kit.em('d1', 'passo'), cor: kit.em('d1', 'corda'), sim: kit.em('d2', 'simpson'), proj: kit.em('d2', 'projetada'),
      mais: kit.em('d2', 'centimetros'), p5: kit.em('d3', 'passo'), seno: kit.em('d3', 'seno'), it: kit.em('d4', 'segunda') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, r = this.rows;
    r.forEach((row, i) => { row.style.opacity = i < 4 ? 1 : 0; });
    A10.show(this.c4a, t, k.p4); A10.show(r[4], t, k.cor);
    A10.show(this.c4b, t, k.sim - 1.4); A10.show(r[5], t, k.sim); A10.show(r[6], t, k.proj + 0.6);
    A10.show(this.c5, t, k.p5); A10.show(r[7], t, k.seno);
    const z = eo(seg(t, k.seno, k.seno + 0.6));
    this.z.style.opacity = z; this.zl.forEach(e => A10.fade(e, t, k.seno + 0.3));
    this.z3.style.opacity = eo(seg(t, k.seno + 0.6, k.seno + 1.0));
    A10.show(this.it, t, k.it);
  },
});
