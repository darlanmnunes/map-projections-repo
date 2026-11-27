// Cena 2: terreno, elipsoide e plano UTM em corte; cada medida desce de uma superfície para a outra
const { seg, eo, eio, TextFx } = kit;
kit.scene('superficies', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const X0 = 140, X1 = 1120;
    // Terreno: perfil ondulado; elipsoide: arco de raio grande; plano: reta
    let terr = '';
    for (let x = X0; x <= X1; x += 10) {
      const y = 330 - 46 * Math.sin((x - X0) / 210) - 24 * Math.sin((x - X0) / 77 + 1) + 18 * Math.sin((x - X0) / 33);
      terr += (x === X0 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
    }
    const R = 2600, cx = (X0 + X1) / 2, cyE = 600 + R;
    const ang = Math.asin((X1 - cx) / R);
    const elip = 'M' + X0 + ' ' + (cyE - R * Math.cos(ang)).toFixed(1) + 'A' + R + ' ' + R + ' 0 0 1 ' + X1 + ' ' + (cyE - R * Math.cos(ang)).toFixed(1);
    const yP = 800;
    const setas = A10.arrowTo(cx - 200, 420, cx - 200, 560, 20, 11) + A10.arrowTo(cx - 200, 640, cx - 200, 770, 20, 11) +
      A10.arrowTo(cx + 200, 420, cx + 200, 560, 20, 11) + A10.arrowTo(cx + 200, 640, cx + 200, 770, 20, 11);
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="terr s-terr" d="' + terr + 'L' + X1 + ' 470L' + X0 + ' 470Z" style="stroke:none"/>' +
      '<path class="s-terl" d="' + terr + '" style="fill:none;stroke:var(--terreno);stroke-width:4"/>' +
      '<path class="elip s-elip" d="' + elip + '"/><path class="plano s-plano" d="M' + X0 + ' ' + yP + 'H' + X1 + '"/>' +
      '<path class="nq s-setas" style="stroke:var(--accent);stroke-width:4" d="' + setas + '"/></svg>');
    kit.stage.append(svg);
    this.e = {};
    for (const c of ['terr', 'terl', 'elip', 'plano', 'setas']) this.e[c] = svg.querySelector('.s-' + c);
    const tag = (html, x, y) => A10.lbl(kit, html, x, y, 'font-family:var(--serif);font-size:30px;color:var(--accent);background:var(--ground);padding:2px 10px');
    this.tg = [tag('<i>F</i><sub>h</sub>', cx - 182, 470), tag('<i>m</i><sub>12</sub>, <i>ψ</i>, <i>γ</i>', cx - 182, 680),
      tag('<i>F</i><sub>h</sub>', cx + 218, 470), tag('<i>m</i><sub>12</sub>, <i>ψ</i>, <i>γ</i>', cx + 218, 680)];
    const S = (y, cor, nome, sub) => A10.bloco(kit, 1200, y, 640,
      '<p class="ttl" style="color:' + cor + '">' + nome + '</p><p class="sub" style="font-size:28px">' + sub + '</p>');
    this.hd = A10.bloco(kit, 110, 60, 1300, '<h2 class="line">Três superfícies</h2>').querySelector('h2');
    this.t = [
      [S(250, 'var(--terreno)', 'Superfície topográfica', 'ângulos e distâncias medidos'), kit.em('b1', 'terreno')],
      [S(510, 'var(--elip)', 'Elipsoide (SR)', 'geodésicas e azimutes geodésicos'), kit.em('b2', 'elipsoide')],
      [S(735, 'var(--plano)', 'Plano UTM (SP)', 'cordas, azimutes de quadrícula, <i>E</i> e <i>N</i>'), kit.em('b2', 'plano')],
      [A10.bloco(kit, 140, 900, 1000, '<p class="sub">Levar as medidas de uma superfície à outra: <b style="color:var(--accent)">redução</b></p>'), kit.em('b3', 'chama')],
    ];
    this.k = { terr: kit.em('b1', 'terreno'), elip: kit.em('b2', 'elipsoide'), plano: kit.em('b2', 'plano'), setas: kit.em('b3', 'passar'), red: kit.em('b3', 'reducao') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const e = this.e, k = this.k;
    A10.draw(e.terl, eio(seg(t, k.terr - 0.2, k.terr + 1.0)));
    e.terr.style.opacity = eo(seg(t, k.terr + 0.6, k.terr + 1.4));
    A10.draw(e.elip, eio(seg(t, k.elip - 0.2, k.elip + 1.0)));
    A10.draw(e.plano, eio(seg(t, k.plano - 0.2, k.plano + 0.9)));
    e.setas.style.opacity = eo(seg(t, k.setas, k.setas + 0.7));
    this.tg.forEach((g, i) => A10.fade(g, t, k.red + 0.15 * i));
    for (const [el, t0] of this.t) A10.show(el, t, t0);
  },
});
