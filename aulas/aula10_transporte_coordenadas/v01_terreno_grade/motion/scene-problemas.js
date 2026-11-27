// Cena 5: problema direto e problema inverso; o que vem nos próximos vídeos
const { seg, eo, TextFx } = kit;
kit.scene('problemas', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Dois problemas</h2>').querySelector('h2');
    const card = (x, cor, tit, ent, sai) => {
      const e = kit.h('<div class="card" style="left:' + x + 'px;top:180px;width:780px;border-color:' + cor + '">' +
        '<h3 style="color:' + cor + '">' + tit + '</h3>' +
        '<p class="note" style="margin:0 0 4px">Dados</p><p class="eq" style="white-space:normal;line-height:1.45;font-size:32px;margin:0;min-height:94px">' + ent + '</p>' +
        '<p class="eq c-seta" style="font-size:44px;color:' + cor + ';margin:4px 0">↓</p>' +
        '<p class="note" style="margin:0 0 4px">Calcula-se</p><p class="eq c-sai" style="white-space:normal;line-height:1.45;font-size:32px;margin:0;min-height:94px"><b>' + sai + '</b></p></div>');
      kit.stage.append(e); return e;
    };
    this.cd = card(120, 'var(--second)', 'Problema direto',
      '(<i>E</i><sub>1</sub>, <i>N</i><sub>1</sub>) ré e (<i>E</i><sub>2</sub>, <i>N</i><sub>2</sub>) estação<br>ângulo <i>α</i> e distância <i>D</i><sub>h</sub> medidos', '(<i>E</i><sub>3</sub>, <i>N</i><sub>3</sub>) do ponto novo');
    this.ci = card(1000, 'var(--accent)', 'Problema inverso',
      '(<i>E</i><sub>1</sub>, <i>N</i><sub>1</sub>) e (<i>E</i><sub>2</sub>, <i>N</i><sub>2</sub>)', 'azimute geodésico Az<sub>12</sub><br><i>D</i><sub>e</sub> no elipsoide e <i>D</i><sub>h</sub> no terreno');
    const prox = ['V2 · Reduções lineares', 'V3 · Geodésica, corda e <i>ψ</i>', 'V4 · Problema direto', 'V5 · Problema inverso', 'V6 · Quanto vale cada correção'];
    this.px = prox.map((h, i) => A10.bloco(kit, 120 + (i % 3) * 600, 830 + Math.floor(i / 3) * 70, 580, '<p class="sub" style="font-size:30px;white-space:nowrap">' + h + '</p>'));
    this.pt = A10.bloco(kit, 120, 765, 600, '<p class="ttl" style="font-size:28px">Nos próximos vídeos</p>');
    this.k = { d: kit.em('e1', 'direto'), dc: kit.em('e1', 'chegamos'), i: kit.em('e2', 'inverso'), iv: kit.em('e2', 'voltamos'), p: kit.em('e3', 'proximos') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k;
    A10.show(this.cd, t, k.d - 0.3);
    A10.fade(this.cd.querySelector('.c-sai'), t, k.dc); A10.fade(this.cd.querySelector('.c-seta'), t, k.dc - 0.3);
    A10.show(this.ci, t, k.i - 0.3);
    A10.fade(this.ci.querySelector('.c-sai'), t, k.iv); A10.fade(this.ci.querySelector('.c-seta'), t, k.iv - 0.3);
    A10.show(this.pt, t, k.p - 0.2);
    this.px.forEach((e, i) => A10.show(e, t, k.p + 0.35 * i));
  },
});
