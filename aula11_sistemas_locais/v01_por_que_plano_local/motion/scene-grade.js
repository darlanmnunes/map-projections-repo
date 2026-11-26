// Cena 1: projeto na grade, obra no terreno. Erro (k − 1)·L e o k − 1 de cada sistema em Viçosa (slides 3 e 5).
const { seg, eo, eio, TextFx } = kit;
kit.scene('grade', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    const D = kit.json('v1-dados.json');
    this.hd = A11.bloco(kit, 110, 60, 1300, '<h2 class="line">Projeto na grade, obra no terreno</h2>').querySelector('h2');
    // Duas barras: terreno (estação total) e grade UTM (esticada, exagero no desenho)
    const X0 = 130, L = 900, ex = 60;        // ex: excesso desenhado (muito exagerado)
    const svg = kit.h('<svg class="art" viewBox="0 0 1920 1080">' +
      '<path class="g-ter" d="M' + X0 + ' 300H' + (X0 + L) + '" style="stroke:var(--horiz);stroke-width:14;stroke-linecap:round"/>' +
      '<path class="g-grd" d="M' + X0 + ' 450H' + (X0 + L + ex) + '" style="stroke:var(--second);stroke-width:14;stroke-linecap:round"/>' +
      '<path class="g-exc" d="M' + (X0 + L) + ' 450H' + (X0 + L + ex) + '" style="stroke:var(--accent);stroke-width:20;stroke-linecap:round"/>' +
      '<path class="g-ref" d="M' + (X0 + L) + ' 270V480" style="stroke:var(--accent);stroke-width:2.5;stroke-dasharray:8 7"/></svg>');
    kit.stage.append(svg);
    this.g = { ter: svg.querySelector('.g-ter'), grd: svg.querySelector('.g-grd'), exc: svg.querySelector('.g-exc'), ref: svg.querySelector('.g-ref') };
    this.l = {
      ter: A11.bloco(kit, X0, 205, 900, '<p class="sub" style="font-size:30px;color:var(--horiz)"><b>No terreno</b>: a estação total mede 1 000,000 m</p>'),
      grd: A11.bloco(kit, X0, 355, 900, '<p class="sub" style="font-size:30px;color:var(--second)"><b>Na grade UTM</b>: a mesma linha tem 1 000,086 m</p>'),
      exc: A11.lbl(kit, '+86 mm/km', X0 + L + ex + 26, 430, 'font-family:var(--sans);font-size:30px;font-weight:700;color:var(--accent)'),
      nt: A11.bloco(kit, X0, 500, 950, '<p class="note">Excesso muito exagerado no desenho. <i>k</i> = <i>m</i> · <i>F</i><sub>h</sub> = ' + A11.num(D.tab[0].k, 6) + ' (Aula 10).</p>'),
    };
    // Erro (k − 1)·L
    this.f = A11.bloco(kit, 1180, 200, 640, '<div class="card" style="position:relative;width:600px">' +
      '<p class="eq big" style="margin:0 0 18px">erro = (<i>k</i> − 1) · <i>L</i></p>' +
      '<p class="sub f-q" style="font-size:30px;margin:0 0 10px">quadra de 100 m: <b>8,6 mm</b></p>' +
      '<p class="sub f-a" style="font-size:30px;margin:0">alinhamento de 2 km: <b>17 cm</b></p></div>');
    // Tabela dos sistemas
    const linhas = D.tab.map(r => '<tr><td>' + r.nome.replace('F_L', '<i>F</i><sub>L</sub>') + '</td><td class="v">' + (r.m ? A11.num(r.m, 6) : '—') +
      '</td><td class="v">' + A11.num(r.k, 6) + '</td><td class="v"><b>' + A11.num(r.ppm, 0, true).replace('+0', '0') + '</b></td></tr>').join('');
    this.tb = A11.bloco(kit, 130, 610, 1300, '<table class="tab"><tr><th style="text-transform:none">Sistema, na origem (h = 700 m)</th><th style="text-transform:none"><i>m</i></th><th style="text-transform:none"><i>k</i> = <i>m</i> · <i>F</i><sub>h</sub></th><th style="text-transform:none"><i>k</i> − 1 (mm/km)</th></tr>' + linhas + '</table>');
    this.rows = [...this.tb.querySelectorAll('tr')].slice(1);
    this.k = {
      ter: kit.em('a1', 'estacao'), grd: kit.em('a1', 'grade'), est: kit.em('a2', 'estica'), n86: kit.em('a2', '86'),
      err: kit.em('a3', 'erra'), q: kit.em('a3', 'quadra'), al: kit.em('a3', 'alinhamento'),
      rtm: kit.em('a4', 'rtm'), sob: kit.em('a4', 'sobram'), zera: kit.em('a4', 'zera'),
    };
  },
  render(t) {
    TextFx.fadeFromRight(this.hd, t, 0.3);
    const k = this.k, g = this.g, l = this.l;
    A11.draw(g.ter, eio(seg(t, k.ter - 0.2, k.ter + 1.0))); A11.fade(l.ter, t, k.ter);
    A11.draw(g.grd, eio(seg(t, k.grd - 0.1, k.grd + 1.0))); A11.fade(l.grd, t, k.grd + 0.2);
    g.ref.style.opacity = eo(seg(t, k.est - 0.3, k.est + 0.3));
    A11.draw(g.exc, eio(seg(t, k.est, k.est + 0.6))); A11.fade(l.exc, t, k.n86 - 0.2); A11.fade(l.nt, t, k.n86 + 0.5);
    A11.show(this.f, t, k.err - 0.3);
    A11.fade(this.f.querySelector('.f-q'), t, k.q); A11.fade(this.f.querySelector('.f-a'), t, k.al);
    A11.show(this.tb, t, k.rtm - 0.4);
    this.rows.forEach((r, i) => {
      r.style.opacity = i === 0 ? 1 : eo(seg(t, k.rtm + 0.3 * (i - 1), k.rtm + 0.3 * (i - 1) + 0.4));
      r.classList.toggle('on', (i >= 1 && i <= 2 && t >= k.sob && t < k.zera) || (i >= 3 && t >= k.zera));
    });
  },
});
