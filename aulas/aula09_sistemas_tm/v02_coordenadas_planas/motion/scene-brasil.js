// Cena 3 (38 a 53 s): o mesmo par (E, N) de Viçosa cai em oito lugares do Brasil, um por fuso
const { seg, eo, lerp, TextFx } = kit;
const { MX, MY } = A9V2;
kit.scene('brasil', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V2.map(kit, 'brasil');
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px">' +
      '<h2 class="line brasil-hd">Um par (E, N) não basta</h2></div>'));
    this.hd = kit.stage.querySelector('.brasil-hd');
    const p = (top, html) => { const e = kit.h('<div class="words" style="left:110px;top:' + top + 'px;width:620px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.t1 = p(200, '<p class="eq num" style="font-size:32px"><i>E</i> = 722&nbsp;120,59 m<br><i>N</i> = 7&nbsp;704&nbsp;054,61 m</p>');
    this.t2 = p(330, '<p class="sub">Os mesmos números existem nos 60 fusos e nos dois hemisférios</p>');
    this.t3 = p(480, '<p class="sub">No Brasil, fusos 18 a 25: oito lugares, todos em <i>φ</i> = −20°45′ e a 2°08′ a leste do MC do seu fuso</p>');
    this.t4 = p(700, '<p class="line" style="font-size:38px">Uma coordenada UTM sem o fuso não é coordenada</p>');
    this.ld = kit.h('<div class="lbl" style="left:' + (MX(-45) - 34) + 'px;top:' + (MY(-20.75) - 46) + 'px;font-size:24px;color:var(--accent)">2°08′</div>');
    kit.stage.append(this.ld);
  },
  render(t) {
    const r = this.r;
    TextFx.fadeFromRight(this.hd, t, 0.2);
    const m = eo(seg(t, 0.4, 1.4));
    r.base.opacity = m; r.fr.opacity = m; A9V2.show(r.zl, m);
    // Viçosa (fuso 23) primeiro; depois os outros sete, de oeste para leste
    const order = [5, 0, 1, 2, 3, 4, 6, 7];
    order.forEach((i, k) => {
      const a = k === 0 ? 2.4 : 4.4 + (k - 1) * 0.55, o = eo(seg(t, a, a + 0.35));
      r.pts[i].opacity = o; r.pl[i].opacity = o;
      r.pts[i].transformOrigin = 'center'; r.pts[i].transformBox = 'fill-box';
      r.pts[i].transform = 'scale(' + lerp(2.2, 1, o) + ')';
    });
    const d = eo(seg(t, 3.0, 3.6)); r.dl.opacity = d; this.ld.style.opacity = d;
    for (const [s, a] of [[this.t1, 1.6], [this.t2, 4.2], [this.t3, 6.4], [this.t4, 10.4]]) {
      const k = eo(seg(t, a, a + 0.6)); s.opacity = k; s.transform = 'translateX(' + lerp(26, 0, k) + 'px)';
    }
  },
});
