// Cena 2 (15 a 28 s): globo completo; um círculo de 10° em torno de 50° S é projetado pelos raios e continua círculo no plano
const { seg, eo, eio, lerp, TextFx } = kit;
const C1 = { cx: 560, cy: 400, R: 230, e: 15, lc: 0 };
const C2 = { cx: 560, cy: 540, R: 190, e: -89, lc: 0 };
const CIRC = { lam: 35, phi: -50, r: 10 };
kit.scene('circulo', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = V6.build(kit, 'circulo');
    kit.stage.append(this.r.svg);
    this.pts = V6.smallCircle(CIRC.lam, CIRC.phi, CIRC.r, 72);
    // Estado herdado da cena 1 (raios e textos)
    const old = [
      kit.h('<div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line">Estereográfica: perspectiva do antípoda</h2></div>'),
      kit.h('<div class="words" style="left:1190px;top:250px;width:660px"><p class="sub">Globo em corte meridiano. Ponto de vista no polo norte; plano tangente no polo sul.</p></div>'),
      kit.h('<div class="words" style="left:1190px;top:470px;width:660px"><p class="eq big"><i>ρ</i> = 2<i>R</i> tan(<i>c</i>/2)</p></div>'),
      kit.h('<div class="words" style="left:1190px;top:560px;width:660px"><p class="sub"><i>c</i>: distância angular ao polo sul</p></div>'),
    ];
    for (const e of old) kit.stage.append(e);
    this.old = old.map(e => e.style);
    kit.stage.append(kit.h('<div class="words" style="left:110px;top:60px;width:1100px">' +
      '<h2 class="line circulo-hd">Círculos continuam círculos</h2></div>'));
    this.hd = kit.stage.querySelector('.circulo-hd');
    kit.stage.append(kit.h('<div class="words circulo-t" style="left:1190px;top:300px;width:660px">' +
      '<p class="sub">Círculo de 10° de raio em torno de 50° S, no globo e no plano</p></div>'));
    this.t = kit.stage.querySelector('.circulo-t').style;
    kit.stage.append(kit.h('<div class="words circulo-t2" style="left:1190px;top:440px;width:660px">' +
      '<p class="sub">Visto de frente, o plano mostra um círculo perfeito</p></div>'));
    this.t2 = kit.stage.querySelector('.circulo-t2').style;
    V6.sig(kit);
  },
  render(t) {
    for (const s of this.old) s.opacity = 1 - seg(t, 0, 0.6);
    // Câmera: do corte (de cima) para baixo do plano, olhando para o norte
    const u = eio(seg(t, 7.0, 10.0));
    const C = { cx: C1.cx, cy: lerp(C1.cy, C2.cy, u), R: lerp(C1.R, C2.R, u), e: lerp(C1.e, C2.e, u), lc: 0 };
    const g = this.r;
    V6.paint(g, C, { globe: eo(seg(t, 0.4, 2.0)), cut: 1 - seg(t, 0.4, 1.6), plane: 1, zp: -1, cutc: 0, n: 1, s: 1 });
    // Círculo no globo e sua imagem no plano
    const P = this.pts.map(q => V6.geo(C, q[0], q[1]));
    const onG = P.map(p => V6.cam(C, ...p)), onP = P.map(p => V6.cam(C, ...V6.ray(p, -1)));
    g.sc.setAttribute('d', V6.ringD(onG)); g.sc.style.opacity = eo(seg(t, 2.2, 3.0));
    g.pc.setAttribute('d', V6.ringD(onP)); g.pc.style.opacity = eo(seg(t, 5.6, 6.4));
    // Leque de raios do polo norte pelo círculo até o plano
    const N = V6.cam(C, 0, 0, 1), k = eio(seg(t, 3.4, 5.6));
    let d = '';
    for (let i = 0; i < P.length - 1; i += 6) {
      const q = onP[i];
      d += 'M' + N[0].toFixed(1) + ' ' + N[1].toFixed(1) + 'L' + lerp(N[0], q[0], k).toFixed(1) + ' ' + lerp(N[1], q[1], k).toFixed(1);
    }
    g.rays.setAttribute('d', k > 0 ? d : '');
    g.rays.style.opacity = 0.7 * (1 - 0.6 * u);
    g.ang.setAttribute('d', ''); g.rho.setAttribute('d', '');
    TextFx.fadeFromRight(this.hd, t, 10.2);
    for (const [s, a] of [[this.t, 1.0], [this.t2, 10.8]]) {
      const q = eo(seg(t, a, a + 0.6)); s.opacity = q; s.transform = 'translateX(' + lerp(26, 0, q) + 'px)';
    }
  },
});
