// Cena 3: fator combinado k = m12 · Fh. Barras de Viçosa, mapa de k sobre E′ × h e o efeito nas áreas
const { seg, eo, eio, TextFx } = kit;
kit.scene('combinado', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const d = kit.json('v2-dados.json'), f1 = A10.f1, c = d.comb, K = d.k;
    // Barras verticais (mm/km) de Viçosa
    const y0 = 640, S = 1.25, xs = [230, 400, 570];
    const vals = [[c.m, 'var(--second)', '<i>m</i><sub>12</sub>'], [c.fh, 'var(--elip)', '<i>F</i><sub>h</sub>'], [c.k, 'var(--main)', '<i>k</i>']];
    let s = '<svg class="art" viewBox="0 0 1920 1080"><path class="v2ax" d="M150 ' + y0 + 'H660"/>';
    vals.forEach(([v, cor], i) => { s += '<rect class="v2bar cb-b' + i + '" x="' + (xs[i] - 50) + '" width="100" style="fill:' + cor + '"/>'; });
    // Mapa de k: E′ (0 a 330 km) × h (0 a 2 000 m)
    const M = { x0: 900, x1: 1760, y0: 260, y1: 800 };
    const X = A10V2.lin(0, 330, M.x0, M.x1), Y = A10V2.lin(0, 2000, M.y1, M.y0);
    const dE = (K.E[1] - K.E[0]), dH = (K.h[1] - K.h[0]);
    let cells = '';
    K.v.forEach((row, j) => row.forEach((v, i) => {
      cells += '<rect x="' + f1(X(K.E[i] - dE / 2)) + '" y="' + f1(Y(K.h[j] + dH / 2)) + '" width="' + f1(X(dE) - X(0) + 0.6) + '" height="' + f1(Y(0) - Y(dH) + 0.6) + '" style="fill:' + A10V2.cor(v) + '"/>';
    }));
    // contorno k = 1 (interpolação linear em cada linha de h)
    const cont = [];
    K.v.forEach((row, j) => { for (let i = 0; i < row.length - 1; i++) if (row[i] <= 0 && row[i + 1] > 0) { const u = -row[i] / (row[i + 1] - row[i]); cont.push([X(K.E[i] + u * dE), Y(K.h[j])]); } });
    s += '<clipPath id="cb-clip"><rect x="' + M.x0 + '" y="' + M.y0 + '" width="' + (M.x1 - M.x0) + '" height="' + (M.y1 - M.y0) + '"/></clipPath>' +
      '<g class="cb-map"><g clip-path="url(#cb-clip)">' + cells + '</g>' +
      '<rect class="frame" x="' + M.x0 + '" y="' + M.y0 + '" width="' + (M.x1 - M.x0) + '" height="' + (M.y1 - M.y0) + '" style="stroke-width:1.5"/>' +
      '<path d="' + A10.lineD(cont) + '" style="fill:none;stroke:var(--main);stroke-width:3.5;stroke-dasharray:10 7"/>' +
      '<circle class="pole" r="10" cx="' + f1(X(d.vic)) + '" cy="' + f1(Y(668)) + '"/></g>' +
      '<rect class="cb-min" x="' + (M.x0 - 2) + '" y="' + (M.y0 - 2) + '" width="56" height="56" style="fill:none;stroke:var(--tissot);stroke-width:4"/></svg>';
    const svg = kit.h(s); kit.stage.append(svg);
    this.b = [0, 1, 2].map(i => svg.querySelector('.cb-b' + i)); this.map = svg.querySelector('.cb-map'); this.min = svg.querySelector('.cb-min');
    this.bar = { y0, S, vals };
    this.bl = vals.map(([v, cor, nome], i) => ({
      n: A10.lbl(kit, nome, xs[i] - 24, (v > 0 ? y0 + 12 : y0 - 54), 'font-size:34px;color:' + cor),
      v: A10.lbl(kit, A10.num(v, 0, true), xs[i] - 40, (v > 0 ? y0 - v * S - 48 : y0 - v * S + 6), 'font-size:30px;font-weight:700;color:' + cor),
    }));
    this.vl = A10.lbl(kit, 'Viçosa, em mm/km', 500, y0 + 80, 'font-family:var(--sans);font-size:24px;color:color-mix(in srgb, var(--main) 70%, var(--ground))');
    // eixos e rótulos do mapa
    this.ml = [A10.lbl(kit, '<i>E</i>′ (km)', M.x1 - 90, M.y1 + 40, 'font-size:24px'), A10.lbl(kit, '<i>h</i> (m)', M.x0 - 70, M.y0 - 44, 'font-size:24px'),
      A10.lbl(kit, 'Viçosa ' + A10.num(c.k, 0, true), X(d.vic) + 16, Y(668) - 16, 'font-family:var(--sans);font-size:22px;font-weight:700;background:rgba(255,255,255,.75);padding:0 4px'),
      A10.lbl(kit, '<i>k</i> = 1', X(150) + 6, Y(1100) - 16, 'font-size:26px;font-weight:700;background:rgba(255,255,255,.75);padding:0 4px'),
      A10.lbl(kit, 'mapa de <i>k</i> − 1 em mm/km, na latitude de Viçosa', M.x0, M.y0 - 52, 'font-family:var(--sans);font-size:23px;color:color-mix(in srgb, var(--main) 70%, var(--ground))')];
    for (const e of [0, 100, 200, 300]) this.ml.push(A10.lbl(kit, String(e), X(e) - 16, M.y1 + 8, 'font-family:var(--sans);font-size:21px'));
    for (const h of [0, 1000, 2000]) this.ml.push(A10.lbl(kit, h ? h.toLocaleString('pt-BR').replace('.', ' ') : '0', M.x0 - 64, Y(h) - 14, 'font-family:var(--sans);font-size:21px'));
    this.lmin = A10.lbl(kit, A10.num(K.min, 0) + ' mm/km', M.x0 + 64, M.y0 + 8, 'font-size:28px;font-weight:700;color:var(--tissot);background:rgba(255,255,255,.8);padding:0 6px');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Fator combinado: altitude e projeção</h2>').querySelector('h2');
    this.t = [
      [A10.bloco(kit, 150, 180, 700, '<p class="eq big"><i>k</i><sub>12</sub> = <i>m</i><sub>12</sub> · <i>F</i><sub>h</sub>&emsp;(21)</p><p class="eq"><i>D</i><sub>c</sub> = <i>k</i><sub>12</sub> · <i>D</i><sub>h</sub></p>'), kit.em('c1', 'combinado')],
      [A10.bloco(kit, 150, 820, 720, '<p class="sub sm"><i>F</i><sub>h</sub> &lt; 1 sempre; <i>m</i> pode ser &lt; 1 ou &gt; 1</p>'), kit.em('c1', 'sempre')],
      [A10.bloco(kit, 150, 880, 1600, '<p class="sub">Áreas: <i>A</i><sub>UTM</sub> ≈ <i>k</i>² · <i>A</i>.&emsp;Em Viçosa, 1 ha = 10 000 m² no terreno vira <b style="color:var(--accent)">' + A10.num(c.area, 1) + ' m²</b> na grade</p>'), kit.em('c4', 'areas')],
    ];
    this.k = { b: [kit.em('c2', '210'), kit.em('c2', 'tira'), kit.em('c2', 'sobram')], map: kit.em('c3', 'perto'), min: kit.em('c3', 'chega'), q: kit.em('c4', 'hectare') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, B = this.bar;
    // as barras crescem; ao chegar a k, as outras duas esmaecem
    this.b.forEach((r, i) => {
      const p = eo(seg(t, k.b[i], k.b[i] + 0.7)), v = B.vals[i][0] * p * B.S;
      r.setAttribute('y', A10.f1(v > 0 ? B.y0 - v : B.y0)); r.setAttribute('height', A10.f1(Math.abs(v)));
      r.style.opacity = i < 2 ? 1 - 0.55 * eo(seg(t, k.b[2] + 0.6, k.b[2] + 1.2)) : 1;
      A10.fade(this.bl[i].n, t, k.b[i]); A10.fade(this.bl[i].v, t, k.b[i] + 0.4);
    });
    A10.fade(this.vl, t, k.b[0]);
    this.map.style.opacity = eo(seg(t, k.map - 0.2, k.map + 0.8));
    this.ml.forEach(l => A10.fade(l, t, k.map + 0.3));
    const mn = eo(seg(t, k.min, k.min + 0.5)); this.min.style.opacity = mn; this.lmin.style.opacity = mn;
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
