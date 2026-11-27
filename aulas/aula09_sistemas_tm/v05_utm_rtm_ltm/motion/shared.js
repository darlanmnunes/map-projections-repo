// V5: UTM, RTM e LTM. Os três sistemas são a mesma TM (GRS80) com outros cinco parâmetros.
// Fusos de 6°, 2° e 1° contados a partir de 180°: os limites de um sistema estão sempre
// entre os limites do seguinte (múltiplos de 6° ⊂ pares ⊂ inteiros), o que permite passar
// de um para o outro só acrescentando linhas.
window.A9V5 = (function () {
  const lerp = (a, b, u) => a + (b - a) * u;
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const NB = ' ';                                  // espaço fino entre milhares
  const VIC = { lam: -(42 + 52 / 60), phi: -(20 + 45 / 60) };
  const SYS = [
    { nome: 'UTM', amp: 6, fuso: '6°', mc: '6<i>F</i> − 183°', k0: '0,9996', e0: '500' + NB + '000 m', n0: '10' + NB + '000' + NB + '000 m',
      mcVic: '−45°', uso: 'Fusos de 6°: cartografia sistemática, SIG e GNSS' },
    { nome: 'RTM', amp: 2, fuso: '2°', mc: 'longitudes ímpares', k0: '0,999995', e0: '400' + NB + '000 m', n0: '5' + NB + '000' + NB + '000 m',
      mcVic: '−43°', uso: 'Fusos de 2°: uso regional, obras lineares e municípios extensos' },
    { nome: 'LTM', amp: 1, fuso: '1°', mc: 'meios graus', k0: '0,999995', e0: '200' + NB + '000 m', n0: '5' + NB + '000' + NB + '000 m',
      mcVic: '−42°30′', uso: 'Fusos de 1°: uso local, cidades, obras e aeroportos' },
  ];
  // Nível de um meridiano inteiro λ: 0 = limite UTM, 1 = limite RTM, 2 = limite LTM
  const nivel = lam => ((lam + 180) % 6 === 0 ? 0 : (lam + 180) % 2 === 0 ? 1 : 2);
  // Fuso [início, fim] do sistema i que contém λ
  function fuso(i, lam) { const a = SYS[i].amp, lo = -180 + a * Math.floor((lam + 180) / a); return [lo, lo + a]; }
  // Estado contínuo s ∈ [0, 2] (0 = UTM, 1 = RTM, 2 = LTM): fuso de Viçosa interpolado
  function fusoVic(s) {
    const i = Math.min(1, Math.floor(s)), u = s - i, A = fuso(i, VIC.lam), B = fuso(Math.min(2, i + 1), VIC.lam);
    return [lerp(A[0], B[0], u), lerp(A[1], B[1], u)];
  }
  // Limites e MCs entre λa e λb para o estado s: [{lam, a, mc}] com a = opacidade (0 a 1)
  function linhas(s, la, lb) {
    const out = [];
    for (let l = Math.ceil(la); l <= Math.floor(lb); l++) out.push({ lam: l, a: clamp01(s - nivel(l) + 1), mc: false });
    for (let i = 0; i < 3; i++) {
      const a = clamp01(1 - Math.abs(s - i)), amp = SYS[i].amp;
      if (a <= 0) continue;
      for (let m = -180 + amp / 2 + amp * Math.ceil((la + 180 - amp / 2) / amp); m <= lb; m += amp) out.push({ lam: m, a, mc: true });
    }
    return out;
  }
  // Passo "redondo" para os eixos (1, 2, 5 × 10ⁿ)
  function passo(range, n) {
    const r = range / n, p = Math.pow(10, Math.floor(Math.log10(r))), f = r / p;
    return p * (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10);
  }
  const num = v => (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('pt-BR', { maximumFractionDigits: 3 }).replace(/\./g, NB);
  const f1 = v => v.toFixed(1);
  function fade(el, t, a, b, dx) {
    const k = kitEase(clamp01((t - a) / 0.6)) * (b == null ? 1 : 1 - clamp01((t - b) / 0.5));
    el.style.opacity = k;
    if (dx) el.style.transform = 'translateX(' + lerp(dx, 0, kitEase(clamp01((t - a) / 0.6))) + 'px)';
  }
  const kitEase = x => 1 - Math.pow(1 - x, 3);
  return { lerp, clamp01, NB, VIC, SYS, nivel, fuso, fusoVic, linhas, passo, num, f1, fade };
})();
