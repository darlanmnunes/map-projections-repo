// Cena 3: inclinada → horizontal → elipsoide (× Fh) → projeção (× m12). Verticais convergentes, esquema exagerado.
const { seg, eo, eio, TextFx } = kit;
kit.scene('distancia', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const C = [640, 2700], GA = [270, 560], GB = [1010, 470];
    const xAt = (G, y) => C[0] + (G[0] - C[0]) * (C[1] - y) / (C[1] - G[1]);
    const f1 = A10.f1;
    // Terreno entre A e B
    let terr = '';
    for (let x = 160; x <= 1120; x += 10) {
      const u = (x - GA[0]) / (GB[0] - GA[0]);
      const y = GA[1] + (GB[1] - GA[1]) * u - 40 * Math.sin(Math.PI * Math.min(Math.max(u, 0), 1)) + 10 * Math.sin(x / 40);
      terr += (x === 160 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
    }
    const Ai = [xAt(GA, GA[1] - 55), GA[1] - 55], Bp = [xAt(GB, GB[1] - 55), GB[1] - 55];
    const yH = 600, yE = 840, yP = 720;
    const R = C[1] - yE;
    const eA = [xAt(GA, yE), yE], eB = [xAt(GB, yE), yE];
    const yEa = C[1] - Math.sqrt(R * R - (eA[0] - C[0]) ** 2), yEb = C[1] - Math.sqrt(R * R - (eB[0] - C[0]) ** 2);
    const vert = G => 'M' + f1(xAt(G, 250)) + ' 250L' + f1(xAt(G, 1000)) + ' 1000';
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="d-terr" d="' + terr + '" style="fill:none;stroke:var(--terreno);stroke-width:4"/>' +
      '<path class="vert d-va" d="' + vert(GA) + '"/><path class="vert d-vb" d="' + vert(GB) + '"/>' +
      '<path class="nq d-tri" style="stroke-width:3" d="M' + GA[0] + ' ' + GA[1] + 'L' + f1(Ai[0]) + ' ' + f1(Ai[1]) + 'M' + (GA[0] - 18) + ' ' + GA[1] + 'L' + f1(Ai[0]) + ' ' + f1(Ai[1]) + 'L' + (GA[0] + 18) + ' ' + GA[1] + '"/>' +
      '<path class="nq d-pri" style="stroke-width:3" d="M' + GB[0] + ' ' + GB[1] + 'L' + f1(Bp[0]) + ' ' + f1(Bp[1]) + '"/><circle class="ptdot d-prc" r="9" cx="' + f1(Bp[0]) + '" cy="' + f1(Bp[1]) + '"/>' +
      '<path class="dist d-di" style="stroke:var(--incl)" d="M' + f1(Ai[0]) + ' ' + f1(Ai[1]) + 'L' + f1(Bp[0]) + ' ' + f1(Bp[1]) + '"/>' +
      '<path class="dist d-dh" style="stroke:var(--horiz)" d="M' + f1(xAt(GA, yH)) + ' ' + yH + 'L' + f1(xAt(GB, yH)) + ' ' + yH + '"/>' +
      '<path class="dist d-de" style="stroke:var(--elip)" d="M' + f1(eA[0]) + ' ' + f1(yEa) + 'A' + R + ' ' + R + ' 0 0 1 ' + f1(eB[0]) + ' ' + f1(yEb) + '"/>' +
      '<path class="dist d-dp" style="stroke:var(--proj)" d="M' + f1(xAt(GA, yP)) + ' ' + yP + 'L' + f1(xAt(GB, yP)) + ' ' + yP + '"/>' +
      '<path class="nq d-cen" style="stroke:color-mix(in srgb, var(--main) 55%, var(--ground));stroke-width:3" d="' + A10.arrowTo(C[0], 905, C[0], 1010, 18, 9) + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['terr', 'va', 'vb', 'tri', 'pri', 'prc', 'di', 'dh', 'de', 'dp', 'cen']) this.e[c] = svg.querySelector('.d-' + c);
    const L = (h, x, y, cor) => A10.lbl(kit, h, x, y, 'font-family:var(--sans);font-size:26px;font-weight:700;color:' + cor);
    this.l = {
      A: L('A', GA[0] - 46, GA[1] - 14, 'var(--main)'), B: L('B', GB[0] + 22, GB[1] - 4, 'var(--main)'),
      di: L('inclinada', (Ai[0] + Bp[0]) / 2 - 60, (Ai[1] + Bp[1]) / 2 - 56, 'var(--incl)'),
      dh: L('horizontal', 560, yH - 44, 'var(--horiz)'),
      de: L('no elipsoide', 560, yE - 52, 'var(--elip)'),
      dp: L('na projeção', 560, yP - 46, 'var(--proj)'),
      cen: L('para o centro da Terra', C[0] + 20, 960, 'color-mix(in srgb, var(--main) 65%, var(--ground))'),
    };
    // Cadeia de reduções (Delazari, slide 3)
    const ch = kit.h('<div class="chain" style="left:1190px;top:230px;flex-direction:column;align-items:stretch;gap:10px;width:600px">' +
      '<div class="b">Distância inclinada <i>D</i><sub>i</sub></div><div class="s" style="text-align:center">↓ ao horizonte</div>' +
      '<div class="b">Distância horizontal <i>D</i><sub>h</sub></div><div class="s" style="text-align:center">↓ × <i>F</i><sub>h</sub>&ensp;(fator de altitude)</div>' +
      '<div class="b">No elipsoide <i>D</i><sub>e</sub></div><div class="s" style="text-align:center">↓ × <i>m</i><sub>12</sub>&ensp;(fator de escala da linha)</div>' +
      '<div class="b">Na projeção <i>D</i><sub>c</sub></div></div>');
    kit.stage.append(ch);
    this.ch = [...ch.children];
    // Fuso: onde m < 1 e onde m > 1
    const fz = kit.h('<svg class="art" viewBox="0 0 1920 1080"><g class="d-fz">' +
      '<rect x="1250" y="800" width="520" height="200" rx="14" style="fill:color-mix(in srgb, #F5D547 45%, var(--ground))"/>' +
      '<rect x="1390" y="800" width="240" height="200" style="fill:color-mix(in srgb, var(--second) 22%, var(--ground))"/>' +
      '<path d="M1510 800V1000" style="stroke:var(--tissot);stroke-width:3"/><circle class="ptdot" r="10" cx="1658" cy="930"/><path d="M1390 800V1000M1630 800V1000" style="stroke:var(--tissot);stroke-width:2;stroke-dasharray:8 6"/></g></svg>');
    kit.stage.append(fz);
    this.fz = fz.querySelector('.d-fz');
    this.fzl = [A10.lbl(kit, '<i>m</i> &lt; 1', 1418, 830, 'font-size:28px'), A10.lbl(kit, '<i>m</i> &gt; 1', 1268, 880, 'font-size:26px'),
      A10.lbl(kit, '<i>m</i> &gt; 1', 1660, 880, 'font-size:26px'), A10.lbl(kit, 'MC', 1494, 760, 'font-family:var(--sans);font-size:22px;color:var(--tissot)'),
      A10.lbl(kit, 'Viçosa: <i>m</i> = 1,000210', 1520, 950, 'font-size:24px;color:var(--accent);background:color-mix(in srgb, #F5D547 45%, var(--ground));padding:0 4px')];
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">A distância: da medida inclinada à projeção</h2>').querySelector('h2');
    this.nota = A10.bloco(kit, 120, 1010, 900, '<p class="note">Esquema fora de escala: a convergência das verticais está muito exagerada.</p>');
    this.k = {
      di: kit.em('c1', 'inclinada'), dh: kit.em('c2', 'horizontal'), de: kit.em('c3', 'elipsoide'), vt: kit.em('c3', 'verticais'),
      cv: kit.em('c3', 'convergem'), fh: kit.em('c3', 'fator'), dp: kit.em('c4', 'projecao'), m: kit.em('c4', 'fator'), fz: kit.em('c4', 'depende'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k, ch = this.ch;
    A10.draw(e.terr, eio(seg(t, 0.2, 1.4)));
    for (const c of ['tri', 'pri', 'prc']) e[c].style.opacity = eo(seg(t, 1.0, 1.6));
    this.l.A.style.opacity = this.l.B.style.opacity = eo(seg(t, 1.0, 1.6));
    A10.draw(e.di, eio(seg(t, k.di - 0.2, k.di + 0.8))); A10.fade(this.l.di, t, k.di + 0.4);
    A10.draw(e.dh, eio(seg(t, k.dh - 0.2, k.dh + 0.7))); A10.fade(this.l.dh, t, k.dh + 0.3);
    const v = eio(seg(t, k.vt, k.vt + 1.2)); A10.draw(e.va, v); A10.draw(e.vb, v);
    e.cen.style.opacity = eo(seg(t, k.cv, k.cv + 0.6)); A10.fade(this.l.cen, t, k.cv + 0.2);
    A10.draw(e.de, eio(seg(t, k.de - 0.1, k.de + 0.8))); A10.fade(this.l.de, t, k.de + 0.3);
    A10.draw(e.dp, eio(seg(t, k.dp - 0.1, k.dp + 0.8))); A10.fade(this.l.dp, t, k.dp + 0.3);
    A10.fade(this.nota, t, k.vt + 0.8);
    // cadeia: cada caixa acende quando a distância correspondente aparece
    const on = [k.di, k.dh, k.fh, k.m], seta = [k.dh, k.fh, k.m];
    [0, 2, 4, 6].forEach((i, j) => { A10.show(ch[i], t, on[j] - 0.3); ch[i].classList.toggle('on', t >= on[j] && (j === 3 || t < on[j + 1])); });
    [1, 3, 5].forEach((i, j) => A10.fade(ch[i], t, seta[j] - 0.4));
    this.fz.style.opacity = eo(seg(t, k.fz, k.fz + 0.6));
    this.fzl.forEach(l => A10.fade(l, t, k.fz + 0.2));
  },
});
