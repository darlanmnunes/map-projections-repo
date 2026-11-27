// Cena 2 (passo 1): na estação 2, corda 2→1 pelas coordenadas, + ψ21 = tangente da ré, + α = tangente da vante.
// Ângulos ψ muito exagerados no desenho; γ não entra (a orientação vem de uma ré com E, N).
const { seg, eo, eio, TextFx } = kit;
kit.scene('passo1', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v4-dados.json').vic, D = Math.PI / 180;
    const S = [560, 640], P21 = 7, P23 = 6;                    // ψ desenhados (graus), exagerados
    const c21 = d.azc21, t21 = c21 + P21, t23 = t21 + d.alfa, c23 = t23 - P23;
    const at = (a, r) => [S[0] + r * Math.sin(a * D), S[1] - r * Math.cos(a * D)];
    const P1 = at(c21, 380), ctl = at(t21, 200);
    const f1 = A10.f1;
    const geo = 'M' + S[0] + ' ' + S[1] + 'Q' + f1(ctl[0]) + ' ' + f1(ctl[1]) + ' ' + f1(P1[0]) + ' ' + f1(P1[1]);
    const ln = (a, r) => { const q = at(a, r); return 'M' + S[0] + ' ' + S[1] + 'L' + f1(q[0]) + ' ' + f1(q[1]); };
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="nq p-nq" d="' + A10.arrow(S[0], S[1], 0, 300) + '" style="stroke-width:3.5"/>' +
      '<path class="corda p-c21" d="' + ln(c21, 380) + '"/>' +
      '<path class="geod p-g21" d="' + geo + '"/>' +
      '<path class="tang p-t21" d="' + ln(t21, 400) + '"/>' +
      '<path class="psiarc p-psi" d="' + A10.sector(S[0], S[1], c21, t21, 260) + '"/>' +
      '<path class="garc p-alfa" d="' + A10.sector(S[0], S[1], t21, t23, 120) + '"/>' +
      '<path class="ng p-t23" d="' + A10.arrow(S[0], S[1], t23, 400) + '" style="stroke-dasharray:14 9"/>' +
      '<circle class="marco" r="12" cx="' + S[0] + '" cy="' + S[1] + '"/><circle class="marco p-1" r="12" cx="' + f1(P1[0]) + '" cy="' + f1(P1[1]) + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['nq', 'c21', 'g21', 't21', 'psi', 'alfa', 't23', '1']) this.e[c] = svg.querySelector('.p-' + c);
    const L = (h, q, dx, dy, s) => A10.lbl(kit, h, q[0] + dx, q[1] + dy, 'font-family:var(--sans);font-weight:700;font-size:25px;' + (s || ''));
    this.l = {
      s: L('2', S, 18, 8), p1: L('1 (ré)', P1, -96, -14), nq: L('NQ', at(0, 310), -24, -40),
      c21: L('corda 2→1', at(c21 - 8, 230), -150, -10, 'color:var(--corda)'),
      t21: L('tangente da ré', at(t21 + 3, 410), -60, -50, 'color:color-mix(in srgb, var(--main) 70%, var(--ground))'),
      psi: A10.lbl(kit, '<i>ψ</i><sub>21</sub>', at(t21 + 9, 280)[0] - 4, at(t21 + 9, 280)[1] - 30, 'color:var(--psi);font-size:34px'),
      alfa: A10.lbl(kit, '<i>α</i>', at(t21 + d.alfa / 2, 150)[0] - 8, at(t21 + d.alfa / 2, 150)[1] - 26, 'color:var(--accent);font-size:38px'),
      t23: L('tangente da vante', at(t23, 330), -170, 26, 'color:var(--accent)'),
    };
    this.nota = A10.bloco(kit, 120, 960, 900, '<p class="note">Ângulos <i>ψ</i> muito exagerados no desenho: aqui valem 0,6″ e 0,5″.</p>');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Passo 1: da ré à tangente da vante</h2>').querySelector('h2');
    this.rows = A10V4.quadro(kit, d, 1080, 190);
    this.rows.forEach(r => { r.style.opacity = 0; });
    const B = (y, html) => A10.bloco(kit, 1090, y, 760, html);
    this.eq = [
      [B(680, '<p class="eq">Az<sub>Q,21</sub> = Az<sub>C,21</sub> + <i>ψ</i><sub>21</sub></p>'), kit.em('b2', 'somamos')],
      [B(745, '<p class="eq">Az<sub>Q,23</sub> = Az<sub>Q,21</sub> + <i>α</i></p>'), kit.em('b3', 'somando')],
      [B(825, '<p class="sub" style="font-size:27px"><i>α</i> é medido entre as <b>tangentes</b> às geodésicas, não entre as cordas</p>'), kit.em('b2', 'tangentes')],
    ];
    this.badge = kit.h('<div class="badge" style="left:1090px;top:930px"><span style="font-family:var(--serif);font-style:italic">γ</span> não entra: a ré já está na grade</div>');
    kit.stage.append(this.badge);
    this.k = { c: kit.em('b1', 'corda'), coord: kit.em('b1', 'coordenadas'), tg: kit.em('b2', 'tangentes'), som: kit.em('b2', 'somamos'),
      v: kit.em('b2', 'obtemos'), sa: kit.em('b3', 'somando'), q: kit.em('b3', 'quadricula'), g: kit.em('b3', 'gama') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, l = this.l, k = this.k, r = this.rows;
    const a = eo(seg(t, 0.4, 1.0));
    e.nq.style.opacity = e['1'].style.opacity = a; l.s.style.opacity = l.p1.style.opacity = l.nq.style.opacity = a;
    A10.draw(e.c21, eio(seg(t, k.c - 0.2, k.c + 0.7))); A10.fade(l.c21, t, k.c + 0.3);
    A10.draw(e.g21, eio(seg(t, k.tg, k.tg + 1.0)));
    A10.draw(e.t21, eio(seg(t, k.som, k.som + 0.8))); A10.fade(l.t21, t, k.v);
    e.psi.style.opacity = eo(seg(t, k.som + 0.3, k.som + 0.9)); A10.fade(l.psi, t, k.som + 0.5);
    e.alfa.style.opacity = eo(seg(t, k.sa, k.sa + 0.6)); A10.fade(l.alfa, t, k.sa + 0.2);
    e.t23.style.opacity = eo(seg(t, k.sa + 0.4, k.sa + 1.0)); A10.fade(l.t23, t, k.q);
    A10.fade(this.nota, t, k.som + 0.8);
    for (const [el, t0] of this.eq) A10.show(el, t, t0);
    A10.show(r[0], t, k.som + 1.2); A10.show(r[1], t, k.q);
    A10.show(this.badge, t, k.g);
  },
});
