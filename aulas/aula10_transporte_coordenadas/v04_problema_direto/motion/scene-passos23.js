// Cena 3 (passos 2 e 3): Dh → De com Fh; ponto 3 aproximado com m2 e AzQ,23
const { seg, eo, eio, TextFx } = kit;
kit.scene('passos23', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v4-dados.json').vic, n3 = A10V4.n3;
    const P = A10V4.planta((d.p1[0] + d.p3[0]) / 2, (d.p1[1] + d.p2[1]) / 2, 580, 830, 0.2);
    const dd = Object.assign({}, d, { p3: d.p3a });
    const pv = this.pv = A10V4.plantaVicosa(kit, dd, P, { l3: '3′ <span style="font-weight:400">aproximado</span>' });
    pv.e3.style.strokeDasharray = '6 5';
    pv.e21.style.opacity = 1; pv.e21.style.strokeDasharray = '14 10';
    const card = (y, passo, html) => {
      const e = kit.h('<div class="card" style="left:120px;top:' + y + 'px;width:880px;padding:18px 26px"><p class="sub" style="margin:0 0 8px;display:flex;align-items:center"><span class="passo">' + passo + '</span>' + html + '</div>');
      kit.stage.append(e); return e;
    };
    this.c2 = card(175, '2', 'Distância no elipsoide, eq. (18)</p>' +
      '<p class="eq" style="margin:0"><i>D</i><sub>e</sub> = <i>F</i><sub>h</sub> · <i>D</i><sub>h</sub> = ' + A10.num(d.Fh, 7) + ' × ' + n3(d.Dh) + ' = <b>' + n3(d.De) + ' m</b></p>' +
      '<p class="note" style="margin:6px 0 0">' + A10.num((d.De - d.Dh) * 1000, 0) + ' mm: a linha encolhe ao descer 668 m até o elipsoide</p>');
    this.c3 = card(395, '3', 'Ponto 3 aproximado, com&nbsp;<i>m</i><sub>2</sub>&nbsp;=&nbsp;' + A10.num(d.m2, 6) + '</p>' +
      '<p class="eq" style="margin:0"><i>E</i>′<sub>3</sub> = <i>E</i><sub>2</sub> + <i>m</i><sub>2</sub> <i>D</i><sub>e</sub> sen Az<sub>Q,23</sub> = ' + n3(d.p3a[0]) + '</p>' +
      '<p class="eq" style="margin:0"><i>N</i>′<sub>3</sub> = <i>N</i><sub>2</sub> + <i>m</i><sub>2</sub> <i>D</i><sub>e</sub> cos Az<sub>Q,23</sub> = ' + n3(d.p3a[1]) + '</p>');
    this.falta = A10.bloco(kit, 120, 1000, 900, '<p class="note">Aproximado: ainda faltam <i>ψ</i><sub>23</sub> e o fator de escala da linha nova, <i>m</i><sub>23</sub>.</p>');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Passos 2 e 3: distância e ponto aproximado</h2>').querySelector('h2');
    this.rows = A10V4.quadro(kit, d, 1080, 190);
    this.k = { p2: kit.em('c1', 'passo'), f: kit.em('c1', 'fator'), p3: kit.em('c2', 'passo'), ap: kit.em('c2', 'aproximada'), ap2: kit.em('c2', 'aproximada', 2) };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, r = this.rows, pv = this.pv;
    r.forEach((row, i) => { row.style.opacity = i < 2 ? 1 : 0; });
    A10.show(this.c2, t, k.p2);
    A10.show(r[2], t, k.f + 0.8);
    const a = eo(seg(t, 0.3, 0.9));
    for (const c of ['e1', 'e2', 'l1', 'l2', 'e21']) pv[c].style.opacity = a;
    A10.show(this.c3, t, k.p3);
    A10.draw(pv.e23, eio(seg(t, k.ap - 0.3, k.ap + 0.7)));
    const b = eo(seg(t, k.ap + 0.5, k.ap + 0.9)); pv.e3.style.opacity = b; pv.l3.style.opacity = b;
    A10.show(r[3], t, k.ap + 0.6);
    A10.fade(this.falta, t, k.ap2);
  },
});
