// Cena 4: do terreno à grade UTM, e da grade ao sistema local (Aula 11, slide 23)
const { seg, eo, eio, TextFx } = kit;
kit.scene('ponte', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A10V6.estilo(kit);
    const caixa = (x, w, html, cor) => {
      const e = kit.h('<div class="card" style="left:' + x + 'px;top:400px;width:' + w + 'px;height:180px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;text-align:center;border-color:' + cor + '"><p class="sub" style="font-size:32px;margin:0"><b>' + html + '</b></p></div>');
      kit.stage.append(e); return e;
    };
    this.b = [caixa(110, 400, 'Medidas<br>no terreno', 'var(--terreno)'), caixa(760, 400, 'Grade UTM<br>(<i>E</i>, <i>N</i>)', 'var(--plano)'),
      caixa(1410, 400, 'Coordenadas locais<br>(<i>X</i>, <i>Y</i>)', 'var(--accent)')];
    const s = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="nq p-s0" style="stroke:var(--main);stroke-width:4" d="' + A10.arrowTo(530, 475, 740, 475, 18, 9) + '"/>' +
      '<path class="nq p-s1" style="stroke:var(--accent);stroke-width:4;stroke-dasharray:12 9" d="' + A10.arrowTo(1180, 475, 1390, 475, 18, 9) + '"/></svg>');
    kit.stage.append(s);
    this.s0 = s.querySelector('.p-s0'); this.s1 = s.querySelector('.p-s1');
    this.l0 = A10.lbl(kit, '× <i>F</i><sub>h</sub> e <i>m</i><sub>12</sub>; <i>ψ</i>', 548, 410, 'font-size:28px;color:var(--main)');
    this.l0b = A10.lbl(kit, 'Aula 10', 590, 500, 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 60%, var(--ground))');
    this.l1 = A10.lbl(kit, '?', 1272, 400, 'font-family:var(--sans);font-size:44px;font-weight:700;color:var(--accent)');
    this.l1b = A10.lbl(kit, 'Aula 11', 1240, 500, 'font-family:var(--sans);font-size:22px;color:var(--accent)');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Do UTM ao sistema local</h2>').querySelector('h2');
    this.t = [
      [A10.bloco(kit, 1410, 600, 400, '<p class="note">Plano topográfico local (NBR 14166): a distância calculada é igual à medida</p>'), kit.em('d1', 'distancia')],
      [A10.bloco(kit, 110, 760, 1700, '<p class="sub"><b>Para refletir:</b> se a grade UTM já é conforme, por que um município preferiria um sistema em que a distância calculada seja igual à medida?</p>'), kit.em('d1', 'local')],
    ];
    this.k = { b0: kit.em('d1', 'terreno'), b1: kit.em('d1', 'grade'), pr: kit.em('d1', 'proxima'), b2: kit.em('d1', 'sistema') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k;
    A10.show(this.b[0], t, k.b0 - 0.5);
    A10.draw(this.s0, eio(seg(t, k.b0 + 0.2, k.b0 + 0.9))); A10.fade(this.l0, t, k.b0 + 0.5); A10.fade(this.l0b, t, k.b0 + 0.5);
    A10.show(this.b[1], t, k.b1);
    A10.draw(this.s1, eio(seg(t, k.pr, k.pr + 0.8))); A10.fade(this.l1, t, k.pr + 0.4); A10.fade(this.l1b, t, k.pr + 0.4);
    A10.show(this.b[2], t, k.b2);
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
