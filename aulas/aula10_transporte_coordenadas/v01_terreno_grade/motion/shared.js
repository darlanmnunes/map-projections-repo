// Ferramentas comuns aos vídeos da Aula 10 (transporte de coordenadas).
// Este bloco é copiado no início do shared.js de cada vídeo: o player carrega um único shared.js por vídeo.
window.A10 = (function () {
  const D = Math.PI / 180;
  const f1 = v => v.toFixed(1);
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const eo = x => 1 - Math.pow(1 - x, 3);
  const seg = (t, a, b) => clamp01((t - a) / (b - a));

  // Ângulo em graus → ±d°mm′ss,s″
  function dms(g, casas = 0, sinal = false) {
    const s = g < 0 ? '−' : (sinal && g > 0 ? '+' : '');
    g = Math.abs(g);
    let d = Math.floor(g), m = Math.floor((g - d) * 60), sec = (g - d - m / 60) * 3600;
    if (+sec.toFixed(casas) >= 60) { sec = 0; m += 1; }
    if (m >= 60) { m = 0; d += 1; }
    return s + d + '°' + String(m).padStart(2, '0') + '′' + sec.toFixed(casas).replace('.', ',').padStart(casas ? 3 + casas : 2, '0') + '″';
  }
  // Número em português: separador de milhar fino e vírgula decimal
  function num(v, c = 0, sinal = false) {
    const neg = +v.toFixed(c) < 0, a = Math.abs(v).toFixed(c).split('.');
    a[0] = a[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : (sinal && v > 0 ? '+' : '')) + a.join(',');
  }
  function lineD(pts) { let s = ''; pts.forEach((p, i) => { s += (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); }); return s; }
  // Seta de (x, y) com ângulo a (graus, horário a partir do norte da tela) e comprimento L
  function arrow(x, y, a, L, h = 18, w = 9) {
    const ux = Math.sin(a * D), uy = -Math.cos(a * D), ex = x + ux * L, ey = y + uy * L;
    return 'M' + f1(x) + ' ' + f1(y) + 'L' + f1(ex) + ' ' + f1(ey) +
      'M' + f1(ex - ux * h - uy * w) + ' ' + f1(ey - uy * h + ux * w) + 'L' + f1(ex) + ' ' + f1(ey) +
      'L' + f1(ex - ux * h + uy * w) + ' ' + f1(ey - uy * h - ux * w);
  }
  // Seta de (x1, y1) a (x2, y2)
  function arrowTo(x1, y1, x2, y2, h, w) {
    return arrow(x1, y1, Math.atan2(x2 - x1, -(y2 - y1)) / D, Math.hypot(x2 - x1, y2 - y1), h, w);
  }
  // Setor entre os azimutes a e b (graus), raio r
  function sector(x, y, a, b, r) {
    const p = q => [x + r * Math.sin(q * D), y - r * Math.cos(q * D)];
    const [ax, ay] = p(a), [bx, by] = p(b);
    return 'M' + f1(x) + ' ' + f1(y) + 'L' + f1(ax) + ' ' + f1(ay) + 'A' + r + ' ' + r + ' 0 ' + (Math.abs(b - a) > 180 ? 1 : 0) + ' ' + (b > a ? 1 : 0) + ' ' + f1(bx) + ' ' + f1(by) + 'Z';
  }
  // Arco (sem preenchimento) entre os azimutes a e b
  function arc(x, y, a, b, r) {
    const p = q => [x + r * Math.sin(q * D), y - r * Math.cos(q * D)];
    const [ax, ay] = p(a), [bx, by] = p(b);
    return 'M' + f1(ax) + ' ' + f1(ay) + 'A' + r + ' ' + r + ' 0 ' + (Math.abs(b - a) > 180 ? 1 : 0) + ' ' + (b > a ? 1 : 0) + ' ' + f1(bx) + ' ' + f1(by);
  }
  // Traçado progressivo de um path (u de 0 a 1)
  function draw(el, u) {
    if (!el._len) { el._len = el.getTotalLength() || 1; el.style.strokeDasharray = el._len + ' ' + el._len; }
    el.style.strokeDashoffset = el._len * (1 - clamp01(u));
    el.style.opacity = u > 0 ? 1 : 0;
  }
  // Bloco de texto posicionado; devolve o elemento
  function bloco(kit, x, y, w, html, cls = '') {
    const e = kit.h('<div class="words ' + cls + '" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px">' + html + '</div>');
    kit.stage.append(e); return e;
  }
  function lbl(kit, html, x, y, st = '') {
    const e = kit.h('<div class="lbl" style="left:' + x + 'px;top:' + y + 'px;' + st + '">' + html + '</div>');
    kit.stage.append(e); return e;
  }
  // Entrada padrão: desliza da direita e aparece em 0,6 s a partir de t0; some a partir de t1 (opcional)
  function show(el, t, t0, t1 = Infinity, dx = 26) {
    const k = eo(seg(t, t0, t0 + 0.6)) * (t1 === Infinity ? 1 : 1 - eo(seg(t, t1, t1 + 0.5)));
    el.style.opacity = k; el.style.transform = 'translateX(' + ((1 - k) * dx).toFixed(1) + 'px)';
    return k;
  }
  function fade(el, t, t0, d = 0.5, t1 = Infinity) {
    const k = eo(seg(t, t0, t0 + d)) * (t1 === Infinity ? 1 : 1 - eo(seg(t, t1, t1 + 0.5)));
    el.style.opacity = k; return k;
  }
  return { D, f1, dms, num, lineD, arrow, arrowTo, sector, arc, draw, bloco, lbl, show, fade, seg, eo, clamp01 };
})();
// ---- fim do bloco comum (comum/a10.js) ----
// V1: do terreno à grade. Planta do exemplo de Viçosa (slide 16) na grade UTM 23S.
window.A10V1 = (function () {
  // Janela da planta (px) e transformação E, N (m) → tela
  const JAN = { x0: 120, x1: 1060, y0: 200, y1: 990 };
  function planta(dados) {
    const P = [dados.p1, dados.p2, dados.p3];
    const Es = P.map(p => p[0]), Ns = P.map(p => p[1]);
    const eC = (Math.min(...Es) + Math.max(...Es)) / 2, nC = (Math.min(...Ns) + Math.max(...Ns)) / 2;
    const s = 0.2;                                   // px por metro
    const cx = (JAN.x0 + JAN.x1) / 2, cy = 620;
    return { s, X: e => cx + (e - eC) * s, Y: n => cy - (n - nC) * s };
  }
  // Curvas de nível decorativas (terreno ondulado de Viçosa), determinísticas
  function niveis() {
    let d = '';
    for (let k = 0; k < 7; k++) {
      const y0 = 250 + k * 115, ph = k * 1.7;
      let s = '';
      for (let x = JAN.x0; x <= JAN.x1; x += 20) {
        const y = y0 + 26 * Math.sin(x / 140 + ph) + 14 * Math.sin(x / 57 + 2 * ph);
        s += (x === JAN.x0 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
      }
      d += s;
    }
    return d;
  }
  // Ícone de receptor GNSS (antena com ondas) centrado em (x, y)
  function gnss(x, y) {
    return 'M' + (x - 9) + ' ' + y + 'L' + (x + 9) + ' ' + y + 'M' + x + ' ' + y + 'V' + (y - 22) +
      A10.arc(x, y - 30, -50, 50, 12) + A10.arc(x, y - 30, -50, 50, 22);
  }
  // Tripé da estação total em (x, y)
  function tripe(x, y) {
    return 'M' + x + ' ' + (y - 6) + 'L' + (x - 22) + ' ' + (y + 40) + 'M' + x + ' ' + (y - 6) + 'L' + x + ' ' + (y + 44) +
      'M' + x + ' ' + (y - 6) + 'L' + (x + 22) + ' ' + (y + 40) + 'M' + (x - 13) + ' ' + (y - 26) + 'h26v20h-26z';
  }
  return { JAN, planta, niveis, gnss, tripe };
})();
