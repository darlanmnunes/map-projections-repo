// Cena 5 (62 a 72 s): coordenadas UTM de Viçosa e ponte para a Aula 09
const { seg, eo, lerp } = kit;
const CZ = { cx: 760, cy: 600, R: 3600, e: V7.VIC.phi, lc: V7.L0 };
kit.scene('final', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V7.build(kit, 'final');
    kit.stage.append(this.r.svg);
    // Estado herdado da cena 4 (fica ao fundo, esmaecido)
    this.old = [
      kit.h('<div class="words box2" style="left:80px;top:40px;padding:14px 30px"><h2 class="line">UTM: cilindro secante, <i>k</i><sub>0</sub> = 0,9996</h2></div>'),
      kit.h('<div class="words box2" style="left:1300px;top:180px;width:520px;padding:16px 24px"><p class="sub">Zoom no fuso 23. O raio do cilindro passa de <i>R</i> a 0,9996 <i>R</i>.</p></div>'),
    ];
    for (const e of this.old) kit.stage.append(e);
    this.card = kit.h('<div style="position:absolute;left:0;top:330px;width:1920px;display:flex;justify-content:center">' +
      '<div class="box2" style="position:relative;padding:48px 80px;max-width:1500px;text-align:center">' +
      '<h2 class="line" style="font-size:60px">Viçosa em UTM 23S: E = 722&nbsp;120,59 m; N = 7&nbsp;704&nbsp;054,61 m</h2></div></div>');
    kit.stage.append(this.card);
    this.foot = kit.h('<div style="position:absolute;left:0;top:820px;width:1920px;display:flex;justify-content:center">' +
      '<p class="ttl" style="font-size:44px;margin:0">Próxima aula: UTM, RTM e LTM</p></div>');
    kit.stage.append(this.foot);
    V7.sig(kit);
  },
  render(t) {
    V7.paint(this.r, CZ, { th: 90, rc: V7.K0, body: 0.18, contact: 1, zone: 1, zedge: 1, vic: 1, tis: 0, sec: 1 });
    this.r.svg.style.opacity = lerp(1, 0.15, seg(t, 0.2, 1.2));
    for (const e of this.old) e.style.opacity = 1 - seg(t, 0, 0.6);
    const c = eo(seg(t, 0.8, 1.6)); this.card.style.opacity = c; this.card.style.transform = 'translateY(' + lerp(16, 0, c) + 'px)';
    const f = eo(seg(t, 2.6, 3.2)); this.foot.style.opacity = f; this.foot.style.transform = 'translateY(' + lerp(16, 0, f) + 'px)';
  },
});
