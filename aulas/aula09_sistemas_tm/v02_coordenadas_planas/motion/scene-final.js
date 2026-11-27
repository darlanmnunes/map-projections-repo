// Cena 4 (53 a 62 s): a forma completa da coordenada e a armadilha do "S"
const { seg, eo, lerp } = kit;
kit.scene('final', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground"></div>'));
    // Estado herdado da cena 3 (fica ao fundo, esmaecido)
    this.bg = kit.h('<div style="position:absolute;inset:0"></div>');
    kit.stage.append(this.bg);
    const r = A9V2.map(Object.assign({}, kit, { stage: this.bg }), 'final');
    r.base.opacity = 1; r.fr.opacity = 1; A9V2.show(r.zl, 1); A9V2.show(r.pts, 1); A9V2.show(r.pl, 1); r.dl.opacity = 1;
    this.card = kit.h('<div style="position:absolute;left:0;top:200px;width:1920px;display:flex;justify-content:center">' +
      '<div class="card" style="position:relative;max-width:1500px">' +
      '<p class="ttl" style="margin:0 0 14px">Forma completa</p>' +
      '<h2 class="line" style="font-size:58px;margin:0 0 18px">SIRGAS 2000 / UTM 23S (EPSG:31983)</h2>' +
      '<p class="eq num" style="font-size:42px;margin:0"><i>E</i> = 722&nbsp;120,59 m;&emsp;<i>N</i> = 7&nbsp;704&nbsp;054,61 m</p></div></div>');
    kit.stage.append(this.card);
    this.warn = kit.h('<div style="position:absolute;left:0;top:660px;width:1920px;display:flex;justify-content:center">' +
      '<div class="warn" style="position:relative;max-width:1240px"><p class="sub" style="margin:0"><b style="color:var(--accent)">Atenção:</b> ' +
      'em “23S”, o S é o hemisfério (padrão EPSG). No MGRS, “S” é a banda de 32° N a 40° N; Viçosa no MGRS é 23K.</p></div></div>');
    kit.stage.append(this.warn);
  },
  render(t) {
    this.bg.style.opacity = lerp(1, 0.12, seg(t, 0.2, 1.2));
    const c = eo(seg(t, 0.8, 1.6)); this.card.style.opacity = c; this.card.style.transform = 'translateY(' + lerp(16, 0, c) + 'px)';
    const w = eo(seg(t, 3.0, 3.6)); this.warn.style.opacity = w; this.warn.style.transform = 'translateY(' + lerp(16, 0, w) + 'px)';
  },
});
