// Cena 4: as três linhas do exercício inverso da UFPR (Delazari, 2022, slide 24) no fuso 23
const { seg, eo, eio, TextFx } = kit;
kit.scene('arcos', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    A10V5.estilo(kit);
    const dd = kit.json('v5-dados.json'), F = dd.fuso, A = dd.arcos, V = A10V5, dms = A10.dms, n = A10.num;
    this.hd = A10.bloco(kit, 110, 60, 1400, '<h2 class="line">Três linhas para analisar</h2>').querySelector('h2');
    // Fuso esquemático
    const borda = V.linha(F['-48']) + V.linha(F['-42']);
    const ponto = (e, nn) => [V.FX(e / 1000), V.FY(nn / 1000)];
    const marcas = ['1', '2', '3'].map(k => { const a = A[k], p = ponto((a.p1[0] + a.p2[0]) / 2, (a.p1[1] + a.p2[1]) / 2); return p; });
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="zone" d="' + V.linha(F['-48']) + V.linha(F['-42'].slice().reverse()).replace('M', 'L') + 'Z"/>' +
      '<path class="frame a-bd" style="stroke-width:2.5" d="' + borda + '"/>' +
      '<path class="mc" d="' + V.linha(F['-45']) + '"/><path class="equ" d="' + V.linha(F.eq) + '"/>' +
      '<path class="hl a-b42" style="stroke-width:7;stroke:var(--psi)" d="' + V.linha(F['-42']) + '"/>' +
      marcas.map((p, i) => '<circle class="a-k' + (i + 1) + '" r="20" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" style="fill:color-mix(in srgb, var(--accent) 25%, transparent);stroke:var(--accent);stroke-width:4"/>').join('') + '</svg>');
    kit.stage.append(svg);
    this.e = { b42: svg.querySelector('.a-b42'), k: [1, 2, 3].map(i => svg.querySelector('.a-k' + i)) };
    const L = (h, x, y, st) => A10.lbl(kit, h, x, y, st || '');
    const S = 'font-family:var(--sans);font-size:22px;color:color-mix(in srgb, var(--main) 70%, var(--ground));';
    L('MC 45° O', V.FX(500) - 50, V.FY(10450) - 34, S + 'color:var(--accent)');
    L('48° O', V.FX(166) - 30, V.FY(10450) - 34, S); L('42° O', V.FX(834) - 30, V.FY(10450) - 34, S);
    L('Equador', V.FX(166) - 105, V.FY(10000) - 14, S);
    this.lk = marcas.map((p, i) => L(String(i + 1), p[0] + (i === 2 ? 26 : -46), p[1] - 18, 'font-family:var(--sans);font-weight:700;font-size:28px;color:var(--accent)'));
    this.esq = A10.bloco(kit, 110, 1000, 760, '<p class="note">Fuso 23 em UTM, escala horizontal ampliada 2,2×.</p>');
    // Cartões com os resultados do problema inverso
    const vals = (a, extra) => '<div class="v5vals">' + (extra || '') +
      '<span><small>Az geodésico</small><span class="v-az">' + dms(a.az, 1) + '</span></span>' +
      '<span><small><i>γ</i><sub>1</sub></small><span class="v-ga">' + dms(a.gama, 0) + '</span></span>' +
      '<span><small><i>ψ</i><sub>12</sub></small><span class="v-ps">' + n(a.psi, 1) + '″</span></span>' +
      '<span><small><i>m</i><sub>12</sub></small><span class="v-m">' + n(a.m, 8) + '</span></span>' +
      '<span><small><i>D</i><sub>c</sub> → <i>D</i><sub>e</sub> (m)</small><span class="v-de">' + n(a.Dc, 0) + ' → ' + n(a.De, 1) + '</span></span></div>';
    const card = (y, k, tit, html) => { const e = kit.h('<div class="v5card" style="left:800px;top:' + y + 'px;width:1010px"><h3><span class="n">' + k + '</span><span>' + tit + '</span></h3>' + html + '</div>'); kit.stage.append(e); return e; };
    this.c = [
      card(170, 1, 'Arco do equador, a leste do MC (<i>E</i> 505 → 508 km)', vals(A['1'])),
      card(385, 2, 'Sobre o meridiano central (<i>N</i> 7 950 → 7 947 km)', vals(A['2'])),
      card(600, 3, 'Na borda do fuso (Az<sub>C</sub> = ' + dms(A['3'].azc, 0) + ' na grade)', vals(A['3'])),
    ];
    this.m3 = A10.bloco(kit, 800, 830, 1010, '<p class="sub" style="font-size:28px">Az = 180°: a linha 3 é um trecho do <b style="color:var(--psi)">meridiano de 42° O</b>, a borda do fuso (<i>φ</i> ≈ −25°).</p>');
    this.k = {
      c1: kit.em('d1', 'primeira'), g1: kit.em('d2', 'gama'), p1: kit.em('d2', 'psi'), m1: kit.em('d2', 'escala'), de1: kit.em('d2', 'tres'),
      c2: kit.em('d3', 'segunda'), g2: kit.em('d3', 'gamma'), m2: kit.em('d3', 'fator'),
      c3: kit.em('d4', 'terceira'), az3: kit.em('d4', 'devolve'), mer: kit.em('d4', 'meridiano', 2),
      g3: kit.em('d5', 'inclina'), cv: kit.em('d5', 'convergencia'), m3: kit.em('d5', 'fator'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, c = this.c;
    const ent = [k.c1, k.c2, k.c3];
    this.e.k.forEach((m, i) => { const a = eo(seg(t, ent[i], ent[i] + 0.5)); m.style.opacity = a; this.lk[i].style.opacity = a; });
    A10.fade(this.esq, t, k.c1);
    c.forEach((x, i) => A10.show(x, t, ent[i] - 0.1));
    // valores entram com a fala de cada linha
    const q = (i, cl) => c[i].querySelector('.v-' + cl).parentElement;
    const tempos = [
      { az: k.c1 + 1.0, ga: k.g1, ps: k.p1, m: k.m1, de: k.de1 },
      { az: k.c2 + 0.8, ga: k.g2, ps: k.g2 + 0.3, m: k.m2, de: k.m2 + 0.5 },
      { az: k.az3, ga: k.g3, ps: k.g3 + 0.4, m: k.m3, de: k.m3 + 0.5 },
    ];
    tempos.forEach((tt, i) => { for (const cl of ['az', 'ga', 'ps', 'm', 'de']) A10.fade(q(i, cl), t, tt[cl], 0.4); });
    this.e.b42.style.opacity = eo(seg(t, k.mer, k.mer + 0.6)) * 0.8;
    A10.show(this.m3, t, k.mer + 0.3);
  },
});
