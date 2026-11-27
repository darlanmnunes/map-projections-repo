// Cena 1 (0 a 20 s): corte perpendicular ao MC, fora de escala. O círculo é a seção do elipsoide no
// plano do Equador; o cilindro, cujo eixo está nesse plano, aparece como uma reta a k·R do centro.
// Ângulos exagerados: linhas de secância a 18° e borda do fuso a 33° do MC (na realidade 1,6° e 3°).
const { seg, eo, eio, lerp, TextFx } = kit;
const CC = { cx: 760, cy: 1420, R: 900, sec: 18, bord: 33, arc: 38 };
const D = Math.PI / 180;
const arcPt = a => [CC.cx + CC.R * Math.sin(a * D), CC.cy - CC.R * Math.cos(a * D)];
kit.scene('corte', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.box = kit.stage;
    const ys = CC.cy - CC.R * Math.cos(CC.sec * D);
    this.ys = ys;
    let arc = '';
    for (let a = -CC.arc; a <= CC.arc + 1e-9; a += 0.5) arc += (a > -CC.arc ? 'L' : 'M') + arcPt(a).map(v => v.toFixed(1)).join(' ');
    // Regiões entre o arco e a reta: redução (|a| < 18°) e ampliação (18° < |a| < 33°)
    const region = (a0, a1) => {
      let d = '';
      for (let a = a0; a <= a1 + 1e-9; a += 0.5) d += (a > a0 ? 'L' : 'M') + arcPt(a).map(v => v.toFixed(1)).join(' ');
      return d + 'L' + arcPt(a1)[0].toFixed(1) + ' ' + ys.toFixed(1) + 'L' + arcPt(a0)[0].toFixed(1) + ' ' + ys.toFixed(1) + 'Z';
    };
    const [sl, sr] = [arcPt(-CC.sec), arcPt(CC.sec)], [bl, br] = [arcPt(-CC.bord), arcPt(CC.bord)];
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="red corte-red" d="' + region(-CC.sec, CC.sec) + '"/>' +
      '<path class="amp corte-amp" d="' + region(-CC.bord, -CC.sec) + region(CC.sec, CC.bord) + '"/>' +
      '<path class="cut corte-arc" pathLength="1" d="' + arc + '"/>' +
      '<path class="cyl corte-cyl" d="M140 0H1380"/>' +
      '<path class="mcl corte-mc" d="M' + CC.cx + ' 470V' + (CC.cy - CC.R * Math.cos(CC.sec * D)).toFixed(1) + '"/>' +
      '<path class="zoomln corte-sl" style="stroke:var(--main)" d="M' + sl[0] + ' ' + ys + 'V650M' + sr[0] + ' ' + ys + 'V650"/>' +
      '<path class="zoomln corte-bl" style="stroke:var(--main)" d="M' + bl[0] + ' ' + bl[1] + 'V740M' + br[0] + ' ' + br[1] + 'V740"/>' +
      '<circle class="pole corte-p1" cx="' + sl[0] + '" cy="' + ys + '" r="9" style="fill:var(--accent)"/>' +
      '<circle class="pole corte-p2" cx="' + sr[0] + '" cy="' + ys + '" r="9" style="fill:var(--accent)"/>' +
      '<circle class="pole corte-b1" cx="' + bl[0] + '" cy="' + bl[1] + '" r="7"/><circle class="pole corte-b2" cx="' + br[0] + '" cy="' + br[1] + '" r="7"/></svg>');
    kit.stage.append(svg);
    this.q = c => svg.querySelector('.corte-' + c);
    this.title = kit.h('<div class="words" style="left:110px;top:60px;width:1200px"><h2 class="line">Fator de escala no fuso UTM</h2>' +
      '<p class="sub corte-sub" style="color:var(--second);font-weight:700">Cilindro secante: redução no centro, ampliação nas bordas</p></div>');
    kit.stage.append(this.title);
    this.line = this.title.querySelector('.line'); this.sub = this.title.querySelector('.corte-sub').style;
    const lab = (html, x, y, cls, color) => {
      const e = kit.h('<div class="lbl ' + (cls || '') + '" style="left:' + x + 'px;top:' + y + 'px' + (color ? ';color:' + color : '') + '">' + html + '</div>');
      kit.stage.append(e); return e.style;
    };
    this.L = {
      note: lab('Corte perpendicular ao MC, fora de escala', 110, 196, 'sm', 'color-mix(in srgb, var(--main) 60%, var(--ground))'),
      cyl: lab('cilindro', 150, ys - 112, 'sm', 'var(--accent)'),
      ell: lab('elipsoide', 150, arcPt(-CC.arc)[1] + 14, 'sm'),
      mc: lab('MC: <i>m</i> = <i>k</i><sub>0</sub> = 0,9996', CC.cx, 418, 'c sm'),
      red: lab('<b>redução: <i>m</i> &lt; 1</b>', CC.cx, ys + 16, 'c sm', 'var(--second)'),
      ampL: lab('<b>ampliação: <i>m</i> &gt; 1</b>', (sl[0] + bl[0]) / 2, ys - 56, 'c sm', 'var(--tissot)'),
      ampR: lab('<b>ampliação: <i>m</i> &gt; 1</b>', (sr[0] + br[0]) / 2, ys - 56, 'c sm', 'var(--tissot)'),
      secL: lab('linha de secância<br><i>m</i> = 1 (≈ 180 km do MC)', sl[0], 656, 'c sm'),
      secR: lab('linha de secância<br><i>m</i> = 1 (≈ 180 km do MC)', sr[0], 656, 'c sm'),
      bord: lab('borda do fuso (3° do MC)<br><i>m</i> ≈ 1,00098 no Equador', br[0], 746, 'c sm'),
    };
    const box = (html, x, y, w) => { const e = kit.h('<div class="words" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px">' + html + '</div>'); kit.stage.append(e); return e.style; };
    this.eq = box('<p class="sub">Na esfera (Aula 08):</p>' +
      '<p class="eq big"><i>m</i> ≈ <i>k</i><sub>0</sub> (1 + <span class="frac"><span><i>x</i>²</span><span>2<i>R</i>²</span></span>)</p>' +
      '<p class="sub" style="font-size:26px"><i>x</i>: distância ao MC no plano. Dobrar <i>x</i> quadruplica a distorção.</p>', 1440, 300, 420);
    this.nums = [
      box('<p class="num">0,9996</p><p class="cap">meridiano central<small>−40 cm/km (1/2&thinsp;500)</small></p>', 110, 850, 520),
      box('<p class="num">1,0000</p><p class="cap">linhas de secância<small>≈ 180 km do MC</small></p>', 700, 850, 520),
      box('<p class="num" style="color:var(--tissot)">1,00098</p><p class="cap">borda do fuso no Equador<small>+98 cm/km (≈ 1/1&thinsp;000)</small></p>', 1290, 850, 560),
    ];
  },
  render(t) {
    TextFx.fadeFromRight(this.line, t, 0.1);
    const fade = (s, a, b = 0.6) => { const k = eo(seg(t, a, a + b)); s.opacity = k; return k; };
    fade(this.sub, 0.8); fade(this.L.note, 1.2);
    const arc = this.q('arc'); arc.style.strokeDasharray = '1 1'; arc.style.strokeDashoffset = 1 - eio(seg(t, 1.0, 3.0));
    fade(this.L.ell, 2.0);
    // O cilindro desce de tangente (no MC) a secante
    const y = lerp(CC.cy - CC.R, this.ys, eio(seg(t, 3.4, 5.6)));
    this.q('cyl').setAttribute('d', 'M140 ' + y.toFixed(1) + 'H1380');
    this.q('cyl').style.opacity = eo(seg(t, 2.6, 3.2));
    this.L.cyl.opacity = eo(seg(t, 2.8, 3.4)); this.L.cyl.top = (y - 46).toFixed(1) + 'px';
    const p = eo(seg(t, 5.6, 6.2));
    for (const c of ['p1', 'p2', 'sl']) this.q(c).style.opacity = p;
    const sh = eo(seg(t, 6.2, 7.4)); this.q('red').style.opacity = sh; this.q('amp').style.opacity = sh;
    fade(this.L.red, 6.8); fade(this.L.ampL, 7.2); fade(this.L.ampR, 7.2);
    const mc = fade(this.L.mc, 7.8); this.q('mc').style.opacity = mc;
    fade(this.L.secL, 8.6); fade(this.L.secR, 8.6);
    const b = fade(this.L.bord, 9.4); for (const c of ['b1', 'b2', 'bl']) this.q(c).style.opacity = b;
    const e = fade(this.eq, 10.6); this.eq.transform = 'translateX(' + lerp(26, 0, e) + 'px)';
    this.nums.forEach((s, i) => { const k = fade(s, 12.6 + i * 1.1); s.transform = 'translateY(' + lerp(18, 0, k) + 'px)'; });
    // Saída em branco para a cena do mapa
    this.box.style.opacity = 1 - seg(t, 19.4, 20);
  },
});
