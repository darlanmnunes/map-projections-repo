// Cena 2: as três famílias de sistemas locais (slide 7): SGL, STL e projeções locais.
const { seg, eo, eio, TextFx } = kit;
kit.scene('familias', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Três famílias de sistemas locais</h2>').querySelector('h2');
    const arc = A11V1.arcoC(230, 1000, 760, -17, 17);
    const seta = (x1, y1, x2, y2, cor, cls) => '<path class="' + cls + '" d="' + A11.arrowTo(x1, y1, x2, y2, 16, 8) + '" style="fill:none;stroke:' + cor + ';stroke-width:4;stroke-linecap:round"/>';
    const eli = '<path d="' + arc + '" style="fill:none;stroke:var(--elip);stroke-width:5"/><text x="20" y="300" style="font:22px var(--sans);fill:var(--elip)">elipsoide</text>';
    const O = '<circle class="ptdot" cx="230" cy="240" r="8"/><text x="246" y="270" style="font:italic 24px var(--serif);fill:var(--main)">O</text>';
    // SGL: plano tangente, z na normal
    const sgl = eli + '<path d="M30 240H430" style="stroke:var(--plano);stroke-width:5"/>' + seta(230, 240, 230, 70, 'var(--main)', 'z') +
      seta(230, 240, 420, 240, 'var(--plano)', 'x') + O +
      '<text x="244" y="90" style="font:24px var(--sans);fill:var(--main)"><tspan font-style="italic">z</tspan> na normal</text>';
    // STL: z na vertical (inclinação muito exagerada), plano perpendicular à vertical
    const a = 14, D = Math.PI / 180, vx = 230 + 170 * Math.sin(a * D), vy = 240 - 170 * Math.cos(a * D);
    const px = 200 * Math.cos(a * D), py = 200 * Math.sin(a * D);
    const stl = eli + '<path d="M230 240V70" style="stroke:var(--main);stroke-width:2.5;stroke-dasharray:8 7"/>' +
      '<path d="M' + (230 - px).toFixed(1) + ' ' + (240 - py).toFixed(1) + 'L' + (230 + px).toFixed(1) + ' ' + (240 + py).toFixed(1) + '" style="stroke:var(--plano);stroke-width:5"/>' +
      seta(230, 240, vx, vy, 'var(--accent)', 'z') + O +
      '<path d="' + A11.arc(230, 240, 0, a, 120) + '" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>' +
      '<text x="238" y="108" style="font:italic 24px var(--serif);fill:var(--accent)">i</text>' +
      '<text x="' + (vx + 10).toFixed(0) + '" y="' + (vy + 10).toFixed(0) + '" style="font:24px var(--sans);fill:var(--accent)"><tspan font-style="italic">z</tspan> na vertical</text>' +
      '<text x="130" y="58" style="font:20px var(--sans);fill:var(--main)">normal</text>';
    // Projeção local: faixa TM estreita com MC na cidade
    let mer = '';
    for (const dx of [-150, -75, 75, 150]) mer += 'M' + (230 + dx) + ' 40Q' + (230 + dx * 1.08) + ' 190 ' + (230 + dx) + ' 340';
    let par = '';
    for (const y of [90, 165, 240, 315]) par += 'M80 ' + y + 'Q230 ' + (y + 10) + ' 380 ' + y;
    const prj = '<rect x="120" y="40" width="220" height="300" rx="8" style="fill:color-mix(in srgb, var(--second) 12%, var(--ground))"/>' +
      '<path d="' + mer + par + '" style="fill:none;stroke:var(--grid);stroke-width:1.5"/>' +
      '<path d="M230 40V340" style="stroke:var(--psi);stroke-width:4"/>' +
      '<circle class="ptdot" cx="230" cy="190" r="10"/><text x="246" y="182" style="font:22px var(--sans);fill:var(--main)">cidade</text>' +
      '<text x="236" y="364" style="font:22px var(--sans);fill:var(--psi)">MC</text>';
    const card = (x, cor, tit, corpo, legenda, tag) => {
      const e = kit.h('<div class="card" style="left:' + x + 'px;top:180px;width:500px;height:700px;padding:24px 26px">' +
        '<h3 style="color:' + cor + ';font-size:31px">' + tit + '</h3>' +
        '<svg viewBox="0 0 460 380" style="width:444px;height:367px;display:block">' + corpo + '</svg>' +
        '<p class="sub" style="font-size:27px;white-space:normal;line-height:1.35;margin:14px 0 12px">' + legenda + '</p>' +
        '<p class="note" style="margin:0">' + tag + '</p></div>');
      kit.stage.append(e); return e;
    };
    this.c = [
      card(110, 'var(--plano)', 'Sistema geodésico local (SGL)', sgl, 'Plano tangente ao elipsoide em O; <b><i>z</i> na normal</b>.', 'Sai direto do GNSS. INCRA: área do imóvel rural.'),
      card(700, 'var(--accent)', 'Sistema topográfico local (STL)', stl, 'O mesmo plano, com <b><i>z</i> na vertical</b> (fio de prumo).', 'É o plano da estação total nivelada. <i>i</i>: desvio da vertical, muito exagerado.'),
      card(1290, 'var(--psi)', 'Projeções locais', prj, 'Transversa de Mercator com <b>MC na cidade</b> e <i>k</i><sub>0</sub> ajustado à altitude.', 'LTM, RTM e TM municipal: parâmetros próprios.'),
    ];
    this.nt = A11.bloco(kit, 110, 975, 1500, '<p class="note">O que muda entre as famílias é a superfície onde as coordenadas são calculadas. Esquemas fora de escala.</p>');
    this.k = { f: kit.em('b1', 'familias'), sup: kit.em('b1', 'superficie'), sgl: kit.em('b2', 'sistema'), nor: kit.em('b2', 'normal'),
      inc: kit.em('b2', 'incra'), stl: kit.em('b3', 'sistema'), ver: kit.em('b3', 'vertical'), prj: kit.em('b4', 'projecoes'), mc: kit.em('b4', 'meridiano') };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, on = [k.sgl, k.stl, k.prj];
    this.c.forEach((c, i) => {
      A11.show(c, t, on[i] - 0.4);
      c.style.borderColor = (t >= on[i] && (i === 2 || t < on[i + 1])) ? 'var(--accent)' : '';
    });
    A11.fade(this.nt, t, k.sup);
  },
});
