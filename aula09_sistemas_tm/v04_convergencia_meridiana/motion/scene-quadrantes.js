// Cena 2 (17 a 38 s): P percorre os quatro quadrantes; γ exato e Δλ sen φ ao vivo; quadro de sinais
const { seg, eo, eio, lerp } = kit;
const PERNA = 90;                 // amostras por trecho da trilha (python/gerar_dados.py)
const T0 = [1.0, 6.0, 11.0, 16.0], DUR = 4.2;
kit.scene('quadrantes', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    this.r = A9V4.build(kit, 'quadrantes');
    this.r.mount(kit.stage);
    // Estado herdado da cena 1 (sai de cena)
    this.old = kit.h('<div style="position:absolute;inset:0"><div class="words" style="left:110px;top:60px;width:1100px"><h2 class="line">Convergência meridiana</h2></div>' +
      '<div class="words" style="left:960px;top:530px;width:860px"><p class="sub"><i>γ</i>: ângulo, no plano, entre NQ e NG</p><p class="eq big" style="margin-top:6px"><i>γ</i> ≈ Δ<i>λ</i> sen <i>φ</i>&emsp;(10)</p></div></div>');
    kit.stage.append(this.old);
    this.hd = kit.h('<div class="words" style="left:110px;top:60px;width:1200px"><h2 class="line">O sinal de <i>γ</i> nos quatro quadrantes</h2></div>');
    kit.stage.append(this.hd);
    this.box = kit.h('<div class="words box2" style="left:960px;top:180px;width:780px;gap:4px">' +
      '<p class="eq">Δ<i>λ</i> = <span class="q-dl"></span>&emsp;<i>φ</i> = <span class="q-phi"></span></p>' +
      '<p class="eq big"><i>γ</i> = <b class="q-g"></b>&ensp;<span class="note">(exato, GRS80)</span></p>' +
      '<p class="eq">Δ<i>λ</i> sen <i>φ</i> = <span class="q-ap"></span></p></div>');
    kit.stage.append(this.box);
    this.v = {}; for (const c of ['dl', 'phi', 'g', 'ap']) this.v[c] = this.box.querySelector('.q-' + c);
    this.tab = kit.h('<div class="words" style="left:960px;top:470px"><table class="sgn"><tr><th>Sinal de <i>γ</i></th><th>Oeste do MC</th><th>Leste do MC</th></tr>' +
      '<tr><th>Hemisfério Norte</th><td class="q-nw"><i>γ</i> &lt; 0</td><td class="q-ne"><i>γ</i> &gt; 0</td></tr>' +
      '<tr><th>Hemisfério Sul</th><td class="q-sw"><i>γ</i> &gt; 0</td><td class="q-se"><i>γ</i> &lt; 0</td></tr></table></div>');
    kit.stage.append(this.tab);
    this.cell = {}; for (const c of ['nw', 'ne', 'sw', 'se']) this.cell[c] = this.tab.querySelector('.q-' + c);
    this.badge = kit.h('<div class="badge"></div>');
    kit.stage.append(this.badge);
    this.fim = kit.h('<div class="words" style="left:960px;top:740px;width:860px"><p class="sub"><b><i>γ</i> = 0 no MC e no Equador.</b></p>' +
      '<p class="sub">O <i>k</i><sub>0</sub> não altera <i>γ</i>: TM e UTM têm a mesma convergência.</p></div>');
    kit.stage.append(this.fim);
  },
  render(t) {
    this.old.style.opacity = 1 - seg(t, 0, 0.6);
    const h = eo(seg(t, 0.3, 0.9)); this.hd.style.opacity = h; this.hd.style.transform = 'translateX(' + lerp(26, 0, h) + 'px)';
    let u = 0;
    for (let k = 0; k < 4; k++) if (t >= T0[k]) u = PERNA * (k + eio(seg(t, T0[k], T0[k] + DUR)));
    const o = A9V4.paint(this.r, { u, trail: [0, u] });
    this.v.dl.textContent = A9V4.num(o.dl, 1) + '°';
    this.v.phi.textContent = A9V4.num(o.phi, 1) + '°';
    this.v.g.textContent = A9V4.dm(o.g);
    this.v.ap.textContent = A9V4.dm(o.dl * Math.sin(o.phi * A9V4.D));
    for (const e of [this.box, this.tab]) e.style.opacity = eo(seg(t, 0.4, 1.0));
    const q = (o.phi >= 0 ? 'n' : 's') + (o.dl >= 0 ? 'e' : 'w');
    for (const c in this.cell) this.cell[c].classList.toggle('on', c === q && Math.abs(o.g) > 0.5);
    // γ = 0 ao cruzar o MC ou o Equador
    const z = Math.abs(o.g) < 1.2 && t > 1;
    this.badge.textContent = Math.abs(o.dl) < Math.abs(o.phi) ? 'γ = 0 no MC' : 'γ = 0 no Equador';
    Object.assign(this.badge.style, { left: (o.px + 24) + 'px', top: (o.py + 30) + 'px', opacity: z ? 1 : 0 });
    this.fim.style.opacity = eo(seg(t, 19.0, 19.6));
  },
});
