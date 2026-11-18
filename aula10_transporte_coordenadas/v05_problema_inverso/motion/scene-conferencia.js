// Cena 2: conferência do exemplo de Viçosa (slide 18): o inverso na grade × o mesmo transporte no elipsoide
const { seg, eo, TextFx } = kit;
kit.scene('conferencia', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A10V5.estilo(kit);
    const V = kit.json('v5-dados.json').vicosa, n = A10.num, dms = A10.dms;
    this.hd = A10.bloco(kit, 110, 60, 1400, '<h2 class="line">Conferência: o exemplo de Viçosa, linha 2 → 3</h2>').querySelector('h2');
    const linhas = [
      ['<i>γ</i><sub>2</sub> (eq. 24)', dms(V.gama2, 3), dms(V.gama2x, 3)],
      ['Az<sub>23</sub> geodésico', dms(V.az23, 3), dms(V.az23el, 3)],
      ['<i>D</i><sub>e</sub> (m)', n(V.De, 4), n(V.Deel, 4)],
      ['<i>D</i><sub>h</sub> = <i>D</i><sub>e</sub> / <i>F</i><sub>h</sub> (m)', n(V.Dh, 4), 'medida: 2 850,000'],
      ['<i>E</i><sub>3</sub> ; <i>N</i><sub>3</sub> (m)', n(V.E3, 3) + ' ; ' + n(V.N3, 3), n(V.E3el, 3) + ' ; ' + n(V.N3el, 3)],
    ];
    const tb = kit.h('<table class="tab v5tab" style="position:absolute;left:110px;top:200px;font-size:30px"><tr><th>Grandeza</th><th>Grade, eq. (27) e (28)</th><th>Elipsoide (pyproj Geod)</th></tr>' +
      linhas.map(r => '<tr><td>' + r[0] + '</td><td class="v">' + r[1] + '</td><td class="v">' + r[2] + '</td></tr>').join('') + '</table>');
    kit.stage.append(tb);
    this.tr = [...tb.querySelectorAll('tr')].slice(1);
    this.th = tb.querySelector('tr');
    this.b1 = A10.bloco(kit, 110, 610, 820, '<div class="card" style="position:relative;padding:18px 28px;border-color:var(--corda)"><p class="sub" style="margin:0">A distância no terreno volta à medida: <b style="color:var(--corda)">' + n(V.Dh, 3) + ' m</b></p></div>');
    this.b2 = A10.bloco(kit, 980, 610, 830, '<div class="card" style="position:relative;padding:18px 28px;border-color:var(--corda)"><p class="sub" style="margin:0">Ponto 3, grade × elipsoide: diferença <b style="color:var(--corda)">menor que 0,005 mm</b></p></div>');
    this.nota = A10.bloco(kit, 110, 800, 1700, '<p class="note">No elipsoide: coordenadas geodésicas de 1 e 2 pela TM exata, azimute 2→1, transporte da geodésica pelo Geod (Karney, 2013) e, só no fim, projeção do ponto 3.</p>');
    this.k = { t0: kit.em('b1', 'aplicando'), vol: kit.em('b1', 'volta'), el: kit.em('b2', 'elipsoide'), pt: kit.em('b2', 'ponto'), dif: kit.em('b2', 'diferenca') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k;
    A10.fade(this.th, t, k.t0);
    // linhas da tabela: γ, Az e De entram com "aplicando"; Dh na palavra "volta"; E3, N3 com "ponto"
    const ent = [k.t0 + 0.4, k.t0 + 0.9, k.t0 + 1.4, k.vol - 0.4, k.pt - 0.3];
    this.tr.forEach((r, i) => { A10.show(r, t, ent[i]); r.classList.toggle('on', (i === 3 && t >= k.vol && t < k.el) || (i === 4 && t >= k.dif)); });
    A10.show(this.b1, t, k.vol + 0.8);
    A10.show(this.b2, t, k.dif);
    A10.fade(this.nota, t, k.el);
  },
});
