// Cena 4 (46 a 62 s): zoom no fuso 23; o cilindro encolhe (raio k0 = 0,9996) e corta o globo em duas linhas a ~180 km do MC
const { seg, eo, eio, lerp, TextFx } = kit;
const C1 = { cx: 640, cy: 600, R: 360, e: 12, lc: -30 };
const CZ = { cx: 760, cy: 600, R: 3600, e: V7.VIC.phi, lc: V7.L0 };
kit.scene('secante', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V7.build(kit, 'secante');
    kit.stage.append(this.r.svg);
    const lbl = (html, color) => { const e = kit.h('<div class="lbl" style="font-size:30px;padding:2px 8px;border-radius:4px;background:color-mix(in srgb, var(--ground) 85%, transparent)' + (color ? ';color:' + color : '') + '">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.lMC = lbl('MC: <i>m</i> = 0,9996', 'var(--accent)');
    this.lSec = lbl('linhas de secância: <i>m</i> = 1');
    this.lEdge = lbl('bordas: <i>m</i> até 1,00098 no Equador', 'var(--accent)');
    this.lV = lbl('Viçosa');
    kit.stage.append(kit.h('<div class="words box2" style="left:80px;top:40px;padding:14px 30px">' +
      '<h2 class="line">UTM: cilindro secante, <i>k</i><sub>0</sub> = 0,9996</h2></div>'));
    this.hd = kit.stage.querySelector('.line').style;
    kit.stage.append(kit.h('<div class="words box2 secante-z" style="left:1300px;top:180px;width:520px;padding:16px 24px"><p class="sub">Zoom no fuso 23. O raio do cilindro passa de <i>R</i> a 0,9996 <i>R</i>.</p></div>'));
    this.z = kit.stage.querySelector('.secante-z').style;
    V7.sig(kit);
  },
  render(t) {
    const u = eio(seg(t, 1.4, 4.4)), L = V7.lerp;
    const C = { cx: L(C1.cx, CZ.cx, u), cy: L(C1.cy, CZ.cy, u), R: C1.R * Math.pow(CZ.R / C1.R, u), e: L(C1.e, CZ.e, u), lc: L(C1.lc, CZ.lc, u) };
    const rc = L(1, V7.K0, eio(seg(t, 5.0, 8.0)));
    const fin = eo(seg(t, 0, 1.0));
    const o = V7.paint(this.r, C, { th: 90, rc, body: 0.3 * fin * (1 - 0.4 * u), contact: fin, zone: fin, zedge: fin, vic: fin, tis: 0, sec: eo(seg(t, 5.0, 5.6)) });
    this.r.svg.style.opacity = fin;
    const place = (s, q, dx, dy, a) => Object.assign(s, { left: (q[0] + dx) + 'px', top: (q[1] + dy) + 'px', opacity: a });
    const phi = V7.VIC.phi, dsec = Math.acos(V7.K0) / V7.D / Math.cos(phi * V7.D);
    place(this.lMC, o.P(V7.L0, phi + 3.5), -270, -18, eo(seg(t, 8.4, 9.0)));
    place(this.lSec, o.P(V7.L0 + dsec, phi + 2.0), 14, -18, eo(seg(t, 9.2, 9.8)));
    place(this.lEdge, o.P(-42, phi - 3.0), 14, -18, eo(seg(t, 10.0, 10.6)));
    place(this.lV, o.v, 16, 6, fin);
    const h = eo(seg(t, 0.4, 1.0)); this.hd.opacity = h; this.hd.transform = 'translateX(' + lerp(26, 0, h) + 'px)';
    const z = eo(seg(t, 4.6, 5.2)); this.z.opacity = z; this.z.transform = 'translateX(' + lerp(26, 0, z) + 'px)';
  },
});
