// Cena 3: quando dá para simplificar (slide 22): três perguntas e as respostas
const { seg, eo, TextFx } = kit;
kit.scene('decisao', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A10V6.estilo(kit);
    const Q = [
      ['A orientação vem de uma ré com <i>E</i>, <i>N</i>?',
        '<b>Sim:</b> <i>γ</i> não entra.<br><b>Não</b> (azimute geodésico ou astronômico): <i>γ</i> pela eq. (24).', kit.em('c1', 'orientacao'), kit.em('c1', 'gama')],
      ['<i>D</i><sup>2</sup><i>E</i>′/2<i>R</i><sup>2</sup> está abaixo da tolerância?',
        '<b>Sim:</b> dispense <i>ψ</i> e use o <i>m</i> do ponto médio.<br><b>Não:</b> eq. (19) e (23).', kit.em('c2', 'erro'), kit.em('c2', 'use')],
      ['<i>F</i><sub>h</sub> e <i>m</i> podem ser desprezados?',
        '<b>Quase nunca:</b> são da ordem de 10<sup>−4</sup>, de 10 a 60 cm por km. Só em croquis com tolerância pior que 1/5 000.', kit.em('c3', 'fator'), kit.em('c3', 'quase')],
    ];
    const y0 = 220, dy = 245;
    this.q = Q.map(([q, a, tq, ta], i) => {
      const qe = kit.h('<div class="v6q" style="left:140px;top:' + (y0 + i * dy) + 'px;width:760px;display:flex;align-items:center"><span class="passo">' + (i + 1) + '</span><span>' + q + '</span></div>');
      const ae = kit.h('<div class="v6a" style="left:1040px;top:' + (y0 + i * dy - 6) + 'px;width:760px">' + a + '</div>');
      kit.stage.append(qe, ae);
      return { qe, ae, tq, ta, tf: i < 2 ? Q[i + 1][2] : Infinity };
    });
    const s = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      Q.map((_, i) => '<path class="nq v6-s' + i + '" style="stroke:var(--accent);stroke-width:4" d="' + A10.arrowTo(915, y0 + i * dy + 44, 1025, y0 + i * dy + 44, 16, 8) + '"/>').join('') + '</svg>');
    kit.stage.append(s);
    this.s = Q.map((_, i) => s.querySelector('.v6-s' + i));
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Quando dá para simplificar?</h2>').querySelector('h2');
    this.nota = A10.bloco(kit, 140, 960, 1600, '<p class="note">Aula 10, slide 22. A resposta depende do comprimento da linha, da distância ao MC e da tolerância do trabalho.</p>');
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    this.q.forEach((r, i) => {
      A10.show(r.qe, t, r.tq - 0.3);
      r.qe.classList.toggle('on', t >= r.tq && t < r.tf);
      A10.fade(this.s[i], t, r.ta - 0.3);
      A10.show(r.ae, t, r.ta);
    });
    A10.fade(this.nota, t, this.q[2].ta + 1.5);
  },
});
