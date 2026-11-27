// Cena 1: o que muda do UTM ao plano local (slide 26): translação, rotação γ0, escala k, constantes
const { seg, eo, eio, TextFx } = kit;
kit.scene('muda', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A11V3.estilo(kit);
    const V = kit.json('v3-dados.json'), n = A11.num;
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Do UTM ao plano local: o que muda</h2>').querySelector('h2');
    // Diagrama: grade UTM, origem O, NQ e o eixo YL girado de γ (exagerado)
    const O = [540, 640], G = 12;
    let grade = '';
    for (let x = 150; x <= 950; x += 100) grade += 'M' + x + ' 200V1000';
    for (let y = 200; y <= 1000; y += 100) grade += 'M150 ' + y + 'H950';
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="gridl m-gr" d="' + grade + '"/>' +
      '<path class="nq m-nq" d="' + A11.arrow(O[0], O[1], 0, 380) + '"/><path class="nq m-eq" d="' + A11.arrow(O[0], O[1], 90, 380) + '"/>' +
      '<path class="garc m-ga" d="' + A11.sector(O[0], O[1], 0, G, 300) + '"/>' +
      '<path class="ng m-yl" d="' + A11.arrow(O[0], O[1], G, 380) + '"/><path class="ng m-xl" d="' + A11.arrow(O[0], O[1], 90 + G, 380) + '"/>' +
      '<circle class="marco m-o" r="13" cx="' + O[0] + '" cy="' + O[1] + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['gr', 'nq', 'eq', 'ga', 'yl', 'xl', 'o']) this.e[c] = svg.querySelector('.m-' + c);
    const L = (h, x, y, st) => A11.lbl(kit, h, x, y, st || '');
    this.l = {
      o: L('O', O[0] - 50, O[1] + 8, 'font-family:var(--sans);font-weight:700'),
      nq: L('NQ (<i>N</i>)', O[0] - 70, O[1] - 440, 'font-family:var(--sans);font-weight:700;font-size:26px'),
      eq: L('<i>E</i>', O[0] + 392, O[1] - 20),
      yl: L('<i>Y</i><sub>L</sub>, norte geográfico', O[0] + 90, O[1] - 430, 'color:var(--accent);font-size:28px'),
      xl: L('<i>X</i><sub>L</sub>', O[0] + 380, O[1] + 70, 'color:var(--accent)'),
      ga: L('<i>γ</i><sub>0</sub>', O[0] + 22, O[1] - 260, 'color:var(--accent)'),
      gt: L('grade UTM', 170, 960, 'font-family:var(--sans);font-size:22px;color:var(--grid)'),
    };
    this.esq = A11.bloco(kit, 150, 1010, 820, '<p class="note">Esquema: <i>γ</i><sub>0</sub> muito exagerado.</p>');
    // Cadeia de operações
    const cx = [
      '<span>Grade UTM (<i>E</i>, <i>N</i>)</span>',
      '<span class="passo">1</span><span class="t"><span>− (<i>E</i><sub>O</sub>, <i>N</i><sub>O</sub>): translação</span><span class="r">' + n(V.O.E, 3) + ' ; ' + n(V.O.N, 3) + '</span></span>',
      '<span class="passo">2</span><span class="t"><span>rotação <i>γ</i><sub>0</sub> (NQ → norte geográfico)</span><span class="r">' + A11.dms(V.g0, 2) + '</span></span>',
      '<span class="passo">3</span><span class="t"><span>÷ <i>k</i> = <i>m</i><sub>0</sub> / <i>F</i><sub>L</sub>: escala</span><span class="r">' + n(V.k, 7) + '  (+86 mm/km)</span></span>',
      '<span class="passo">4</span><span class="t"><span>+ (150 000 ; 250 000)</span><span class="r">constantes do plano</span></span>',
      '<span>Plano local (<i>X</i><sub>L</sub>, <i>Y</i><sub>L</sub>)</span>',
    ];
    const fl = kit.h('<div class="v3flow" style="left:1080px;top:180px;width:740px">' + cx.map(c => '<div class="b">' + c + '</div>').join('') + '</div>');
    kit.stage.append(fl);
    this.cx = [...fl.children];
    this.cx[0].style.fontWeight = this.cx[5].style.fontWeight = 700;
    this.met = kit.h('<div class="v3met" style="left:1080px;top:930px"><div>rigoroso</div><div>similaridade</div><div>polar</div></div>');
    kit.stage.append(this.met);
    this.k = {
      a1: kit.em('a1', 'levantamento'), plano: kit.em('a1', 'plano'), ori: kit.em('a2', 'origem'), sub: kit.em('a2', 'subtraimos'),
      orient: kit.em('a3', 'orientacao'), y: kit.em('a3', 'eixo'), conv: kit.em('a3', 'convergencia'),
      esc: kit.em('a4', 'escala'), fator: kit.em('a4', 'fator'), cte: kit.em('a4', 'somamos'), tres: kit.em('a5', 'tres'),
      rig: kit.em('a5', 'rigoroso'), sim: kit.em('a5', 'similaridade'), pol: kit.em('a5', 'polar'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, e = this.e, l = this.l;
    e.gr.style.opacity = 0.9 * eo(seg(t, k.a1, k.a1 + 0.8)); A11.fade(l.gt, t, k.a1 + 0.3);
    A11.draw(e.nq, eio(seg(t, k.a1 + 0.4, k.a1 + 1.2))); A11.draw(e.eq, eio(seg(t, k.a1 + 0.6, k.a1 + 1.4)));
    A11.fade(l.nq, t, k.a1 + 1); A11.fade(l.eq, t, k.a1 + 1.2);
    A11.show(this.cx[0], t, k.a1 + 0.5);
    e.o.style.opacity = eo(seg(t, k.ori, k.ori + 0.4)); A11.fade(l.o, t, k.ori);
    A11.show(this.cx[1], t, k.sub);
    A11.draw(e.yl, eio(seg(t, k.y, k.y + 0.8))); A11.draw(e.xl, eio(seg(t, k.y + 0.2, k.y + 1)));
    A11.fade(l.yl, t, k.y + 0.5); A11.fade(l.xl, t, k.y + 0.7);
    e.ga.style.opacity = eo(seg(t, k.conv, k.conv + 0.5)); A11.fade(l.ga, t, k.conv); A11.fade(this.esq, t, k.conv);
    A11.show(this.cx[2], t, k.conv);
    A11.show(this.cx[3], t, k.fator);
    A11.show(this.cx[4], t, k.cte); A11.show(this.cx[5], t, k.cte + 0.8);
    const on = [[k.a1 + 0.5, k.sub], [k.sub, k.conv], [k.conv, k.fator], [k.fator, k.cte], [k.cte, k.tres], [k.cte + 0.8, k.tres]];
    this.cx.forEach((c, i) => c.classList.toggle('on', t >= on[i][0] && t < on[i][1]));
    const m = [...this.met.children], ini = [k.rig, k.sim, k.pol];
    A11.fade(this.met, t, k.tres - 0.3, 0.3);
    m.forEach((c, i) => A11.show(c, t, ini[i] - 0.2));
  },
});
