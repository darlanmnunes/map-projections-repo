// Cena 2 (8 a 22 s): o globo se divide e se desenrola na Mercator (esq.) e na Lambert cilíndrica (dir.)
const { seg, eio, eo, lerp } = kit;
kit.scene('desenrola', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V1.mount(kit, 'desenrola', ['merc', 'lamb']);
    kit.stage.append(this.r.svg);
    // Estado herdado da cena 1
    kit.stage.append(kit.h('<div class="words desenrola-old" style="left:110px;top:84px;width:760px">' +
      '<h2 class="line">Três círculos iguais na esfera</h2>' +
      '<p class="sub">Raio angular de 7°, sobre o meridiano λ = −45°</p></div>'));
    this.old = kit.stage.querySelector('.desenrola-old').style;
    this.oldLbl = V1.CIRC.map(p => {
      const q = V1.ortho(V1.GLOBE_END, V1.CLON, p);
      const el = kit.h('<div class="lbl" style="left:' + (q[0] + 7 * V1.D * V1.GLOBE_END.R + 16) + 'px;top:' + (q[1] - 20) + 'px">φ = ' + (p ? '−' + (-p) : '0') + '°</div>');
      kit.stage.append(el);
      return el.style;
    });
    // Cabeçalhos com as equações
    const head = (k, name, eq) => kit.h('<div class="words desenrola-h' + k + '" style="left:' + V1.X0[k] + 'px;top:150px;gap:4px">' +
      '<div class="ttl">' + name + '</div><div class="eq">' + eq + '</div></div>');
    kit.stage.append(head('merc', 'Mercator', '<i>x</i> = <i>λ</i>,&emsp;<i>y</i> = ln tan(45° + <i>φ</i>/2)'));
    kit.stage.append(head('lamb', 'Lambert cilíndrica equivalente', '<i>x</i> = <i>λ</i>,&emsp;<i>y</i> = sen <i>φ</i>'));
    this.hm = kit.stage.querySelector('.desenrola-hmerc').style;
    this.hl = kit.stage.querySelector('.desenrola-hlamb').style;
    // Fator multiplicador do raio na Mercator: sec φ
    this.mul = ['× 1', '× 1,155', '× 2'].map((txt, i) => {
      const p = V1.CIRC[i], c = V1.map('merc', V1.CLON, p), r = V1.R0 * V1.S / Math.cos(p * V1.D);
      const el = kit.h('<div class="lbl" style="left:' + (c[0] + r + 14) + 'px;top:' + (c[1] - 21) + 'px">' + txt + '</div>');
      kit.stage.append(el);
      return el.style;
    });
    kit.stage.append(kit.h('<div class="words desenrola-cap" style="left:995px;top:690px;width:780px;gap:16px">' +
      '<p class="sub desenrola-c1">Mercator: continuam círculos, com raio × sec φ.</p>' +
      '<p class="sub desenrola-c2">Lambert: viram elipses, semieixo leste-oeste sec φ e norte-sul cos φ.</p></div>'));
    this.c1 = kit.stage.querySelector('.desenrola-c1').style;
    this.c2 = kit.stage.querySelector('.desenrola-c2').style;
  },
  render(t) {
    this.old.opacity = 1 - seg(t, 0, 0.6);
    for (const s of this.oldLbl) s.opacity = 1 - seg(t, 0, 0.6);
    const sp = eio(seg(t, 0.6, 2.4)), E = V1.GLOBE_END;
    const u = eio(seg(t, 2.8, 6.8));
    const st = {};
    for (const k of ['merc', 'lamb']) {
      const T = V1.SPLIT[k];
      st[k] = {
        a: k === 'lamb' ? seg(t, 0.6, 1.0) : 1,
        g: { cx: lerp(E.cx, T.cx, sp), cy: lerp(E.cy, T.cy, sp), R: lerp(E.R, T.R, sp), lc: E.lc, pc: E.pc },
        u, full: 1 - seg(t, 2.2, 3.0), bg: seg(t, 2.4, 3.2), frame: seg(t, 6.2, 7.0),
      };
    }
    V1.paint(this.r, st);
    for (const [s, a] of [[this.hm, 7.0], [this.hl, 7.5]]) {
      s.opacity = eo(seg(t, a, a + 0.6));
      s.transform = 'translateX(' + lerp(26, 0, eo(seg(t, a, a + 0.6))) + 'px)';
    }
    this.mul.forEach((s, i) => { s.opacity = seg(t, 8.6 + 0.3 * i, 9.1 + 0.3 * i); });
    this.c1.opacity = seg(t, 9.4, 10.0);
    this.c2.opacity = seg(t, 10.6, 11.2);
  },
});
