"""
Transporte de coordenadas na grade UTM: as equações (18) a (28) da Aula 10.

Módulo comum aos vídeos da Aula 10. Cada vídeo importa daqui as reduções e os
roteiros dos problemas direto e inverso, de modo que todos os números na tela
saiam da mesma conta. Executado diretamente, confere o exemplo de Viçosa
(slides 16 a 18) e o exemplo da UFPR (slide 20) com pyproj.

Convenções (as mesmas dos slides):
- GRS80, UTM fuso 23S (k0 = 0,9996, E0 = 500 000 m, falso norte 10 000 000 m);
- azimutes em graus, a partir do norte, no sentido horário;
- ψ = AzQ − AzC (tangente menos corda), em segundos de arco;
- γ > 0 quando o norte de quadrícula está a leste do norte geográfico;
- AzQ = Az − γ (12); AzC = Az − γ − ψ (22).
"""

import math

from pyproj import Geod, Proj

A, F = 6378137.0, 1 / 298.257222101
E2 = F * (2 - F)
EP2 = E2 / (1 - E2)
K0, E0, FN = 0.9996, 500000.0, 10000000.0
RHO = 180 / math.pi * 3600            # ρ″ = 206 264,8″
GEOD = Geod(ellps="GRS80")


def utm(fuso=23):
    return Proj(proj="utm", zone=fuso, south=True, ellps="GRS80")


UTM23 = utm(23)


def raios(phi):
    """M (meridiano) e N (1º vertical), em metros, na latitude phi (graus)."""
    s = math.sin(math.radians(phi))
    w = math.sqrt(1 - E2 * s * s)
    return A * (1 - E2) / w ** 3, A / w


def lat(E, N, proj=UTM23):
    return proj(E, N, inverse=True)[1]


def az_corda(E1, N1, E2_, N2):
    """Azimute da corda (graus, 0 a 360) e comprimento Dc, eq. (27)."""
    dE, dN = E2_ - E1, N2 - N1
    return math.degrees(math.atan2(dE, dN)) % 360, math.hypot(dE, dN)


def mn_medio(E1, N1, E2_, N2, proj=UTM23):
    """M·N na latitude média da linha."""
    M, Nr = raios((lat(E1, N1, proj) + lat(E2_, N2, proj)) / 2)
    return M * Nr


def psi(E1, N1, E2_, N2, proj=UTM23, k0=K0, e0=E0):
    """Redução angular ψ12 em segundos, eq. (23)."""
    a1, a2 = E1 - e0, E2_ - e0
    return RHO * (N2 - N1) * (2 * a1 + a2) / (6 * k0 ** 2 * mn_medio(E1, N1, E2_, N2, proj))


def m_ponto(E, N, proj=UTM23, k0=K0, e0=E0):
    """Fator de escala num ponto, eq. (9)."""
    M, Nr = raios(lat(E, N, proj))
    return k0 * (1 + (E - e0) ** 2 / (2 * k0 ** 2 * M * Nr))


def m_linha(E1, N1, E2_, N2, proj=UTM23, k0=K0, e0=E0):
    """Fator de escala da linha, eq. (20) (Simpson sobre 1/m, eq. 19)."""
    a1, a2 = E1 - e0, E2_ - e0
    return k0 * (1 + (a1 * a1 + a1 * a2 + a2 * a2) / (6 * k0 ** 2 * mn_medio(E1, N1, E2_, N2, proj)))


def m_simpson(E1, N1, E2_, N2, proj=UTM23):
    """Eq. (19) com os fatores exatos (pyproj) em 1, no ponto médio e em 2."""
    def mx(E, N):
        lo, la = proj(E, N, inverse=True)
        return proj.get_factors(lo, la).meridional_scale
    mm = mx((E1 + E2_) / 2, (N1 + N2) / 2)
    return 1 / ((1 / mx(E1, N1) + 4 / mm + 1 / mx(E2_, N2)) / 6)


def fator_altitude(phi, az, hm):
    """Fh e Rα, eq. (18): Rα pela fórmula de Euler no azimute geodésico az."""
    M, Nr = raios(phi)
    s, c = math.sin(math.radians(az)), math.cos(math.radians(az))
    ra = M * Nr / (M * s * s + Nr * c * c)
    return ra / (ra + hm), ra


def gama(E, N, proj=UTM23, k0=K0, e0=E0):
    """Convergência meridiana em graus a partir de (E, N), eq. (24)."""
    phi1 = math.radians(lat_pe(N, proj))
    M1, N1 = raios(math.degrees(phi1))
    t, eta2 = math.tan(phi1), EP2 * math.cos(phi1) ** 2
    x = (E - e0) / k0
    g = x * t / N1 * (1 - x * x / (3 * N1 * N1) * (1 + t * t - eta2 - 2 * eta2 * eta2)
                      + x ** 4 / (15 * N1 ** 4) * (2 + 5 * t * t + 3 * t ** 4))
    return math.degrees(g)


def lat_pe(N, proj=UTM23):
    """Latitude do pé da perpendicular: a latitude do MC com o mesmo N."""
    return proj(E0, N, inverse=True)[1]


def gama_exato(E, N, proj=UTM23):
    lo, la = proj(E, N, inverse=True)
    return proj.get_factors(lo, la).meridian_convergence


def direto(E1, N1, E2_, N2, alfa, Dh, hm, proj=UTM23, iter_=1):
    """Problema direto, slide 14: ré 1, estação 2, ângulo horário α (graus) e Dh → ponto 3.

    Devolve um dicionário com todos os valores intermediários do slide 17."""
    r = {}
    azc21, _ = az_corda(E2_, N2, E1, N1)
    p21 = psi(E2_, N2, E1, N1, proj)
    azq21 = azc21 + p21 / 3600
    azq23 = (azq21 + alfa) % 360
    r.update(azc21=azc21, psi21=p21, azq21=azq21, azq23=azq23)
    # Distância no elipsoide: Fh no azimute geodésico aproximado da vante
    phi2 = lat(E2_, N2, proj)
    az23 = azq23 + gama(E2_, N2, proj)
    fh, ra = fator_altitude(phi2, az23, hm)
    De = fh * Dh
    r.update(phi2=phi2, Fh=fh, Ra=ra, De=De)
    m2 = m_ponto(E2_, N2, proj)
    s, c = math.sin(math.radians(azq23)), math.cos(math.radians(azq23))
    E3, N3 = E2_ + m2 * De * s, N2 + m2 * De * c
    r.update(m2=m2, E3a=E3, N3a=N3)
    hist = []
    for _ in range(iter_):
        p23 = psi(E2_, N2, E3, N3, proj)
        azc23 = azq23 - p23 / 3600
        m23 = m_simpson(E2_, N2, E3, N3, proj)
        Dc = m23 * De
        s, c = math.sin(math.radians(azc23)), math.cos(math.radians(azc23))
        E3, N3 = E2_ + Dc * s, N2 + Dc * c
        hist.append((E3, N3))
    r.update(psi23=p23, azc23=azc23, m23=m23, k23=m23 * fh, Dc=Dc, E3=E3, N3=N3, hist=hist)
    r["beta"] = alfa + (p21 - p23) / 3600      # eq. (25): ângulo entre as cordas
    return r


def inverso(E1, N1, E2_, N2, hm=0.0, proj=UTM23):
    """Problema inverso, slide 15: (E1, N1), (E2, N2) → Az12, De, Dh."""
    azc, Dc = az_corda(E1, N1, E2_, N2)
    p12 = psi(E1, N1, E2_, N2, proj)
    g1 = gama(E1, N1, proj)
    az12 = (azc + p12 / 3600 + g1) % 360
    m12 = m_simpson(E1, N1, E2_, N2, proj)        # eq. (19), como no problema direto
    De = Dc / m12
    fh, _ = fator_altitude(lat(E1, N1, proj), az12, hm)
    return dict(azc=azc, Dc=Dc, psi12=p12, gama1=g1, azq=azc + p12 / 3600, az12=az12, m12=m12, De=De, Fh=fh, Dh=De / fh)


def elipsoide(E1, N1, E2_, N2, alfa, Dh, hm, proj=UTM23):
    """Conferência independente (slide 18): o mesmo transporte feito no elipsoide."""
    lo1, la1 = proj(E1, N1, inverse=True)
    lo2, la2 = proj(E2_, N2, inverse=True)
    az21, az12, _ = GEOD.inv(lo2, la2, lo1, la1)
    az23 = (az21 + alfa) % 360
    fh, _ = fator_altitude(la2, az23, hm)
    De = fh * Dh
    lo3, la3, az32 = GEOD.fwd(lo2, la2, az23, De)
    E3, N3 = proj(lo3, la3)
    return dict(az23=az23, az32=az32 % 360, De=De, E3=E3, N3=N3, lo3=lo3, la3=la3)


def dms(g, casas=3, sinal=False):
    s = "−" if g < 0 else ("+" if sinal and g > 0 else "")
    g = abs(g)
    d = int(g)
    m = int((g - d) * 60)
    sec = (g - d - m / 60) * 3600
    if round(sec, casas) >= 60:
        sec, m = 0, m + 1
    if m >= 60:
        m, d = 0, d + 1
    return f"{s}{d}°{m:02d}′{sec:0{3 + casas if casas else 2}.{casas}f}″".replace(".", ",")


# Exemplo resolvido de Viçosa (slide 16)
VICOSA = dict(E1=720908.820, N1=7705174.990, E2=722120.586, N2=7704054.612,
              alfa=118 + 24 / 60 + 36 / 3600, Dh=2850.0, hm=668.0)
# Exemplo da UFPR (Delazari, 2022; slides 19 a 21 das notas), ré e estação
UFPR = dict(E1=300000.0, N1=7180000.0, E2=303000.0, N2=7178000.0, De=2500.0,
            alfas=dict(A=142 + 30.5 / 60, B=235 + 30.5 / 60, C=300 + 30.5 / 60, D=355 + 30.5 / 60),
            pub=dict(A=(305494.681, 7178165.778), B=(303035.006, 7175500.047),
                     C=(300749.051, 7176911.750), D=(300817.474, 7179219.687)))


if __name__ == "__main__":
    v = VICOSA
    r = direto(v["E1"], v["N1"], v["E2"], v["N2"], v["alfa"], v["Dh"], v["hm"])
    print("Viçosa, problema direto (slide 17)")
    print(f"  AzC21 = {dms(r['azc21'])}  ψ21 = {r['psi21']:+.3f}″  (312°45′21,387″ ; +0,633″)")
    print(f"  AzQ21 = {dms(r['azq21'])}  AzQ23 = {dms(r['azq23'])}  (312°45′22,021″ ; 71°09′58,021″)")
    print(f"  Fh = {r['Fh']:.8f}  De = {r['De']:.3f}  (0,99989526 ; 2 849,701)")
    print(f"  aprox. E3 = {r['E3a']:.3f}  N3 = {r['N3a']:.3f}  (724 818,276 ; 7 704 974,761)")
    print(f"  ψ23 = {r['psi23']:+.3f}″  AzC23 = {dms(r['azc23'])}  (+0,523″ ; 71°09′57,497″)")
    print(f"  m23 = {r['m23']:.8f}  k23 = {r['k23']:.8f}  Dc = {r['Dc']:.3f}  (1,00021720 ; 1,00011244 ; 2 850,320)")
    print(f"  E3 = {r['E3']:.3f}  N3 = {r['N3']:.3f}  (724 818,294 ; 7 704 974,775)  β−α = {(r['beta'] - v['alfa']) * 3600:+.3f}″")
    r2 = direto(v["E1"], v["N1"], v["E2"], v["N2"], v["alfa"], v["Dh"], v["hm"], iter_=2)
    print(f"  2ª iteração muda o ponto 3 em {math.dist(r2['hist'][0], r2['hist'][1]) * 1000:.2f} mm")
    el = elipsoide(v["E1"], v["N1"], v["E2"], v["N2"], v["alfa"], v["Dh"], v["hm"])
    print("Conferência (slide 18)")
    print(f"  γ2 = {dms(gama(v['E2'], v['N2']))}  exato {dms(gama_exato(v['E2'], v['N2']))}")
    inv = inverso(v["E2"], v["N2"], r["E3"], r["N3"], v["hm"])
    inv32 = inverso(r["E3"], r["N3"], v["E2"], v["N2"], v["hm"])
    print(f"  Az23 grade {dms(inv['az12'])}  elipsoide {dms(el['az23'])}")
    print(f"  Az32 grade {dms(inv32['az12'])}  elipsoide {dms(el['az32'])}")
    print(f"  De grade {inv['De']:.4f}  elipsoide {el['De']:.4f}   Dh = {inv['Dh']:.4f}")
    print(f"  E3, N3 elipsoide {el['E3']:.3f} ; {el['N3']:.3f}  dif. {math.dist((el['E3'], el['N3']), (r['E3'], r['N3'])) * 1000:.3f} mm")
    u = UFPR
    print("UFPR (slide 20)")
    for k, a in u["alfas"].items():
        # De dado diretamente: Dh = De, hm = 0 (Fh = 1)
        rr = direto(u["E1"], u["N1"], u["E2"], u["N2"], a, u["De"], 0.0)
        pe, pn = u["pub"][k]
        print(f"  {k}: E = {rr['E3']:.3f} N = {rr['N3']:.3f}  pub {pe} {pn}  dif {math.dist((pe, pn), (rr['E3'], rr['N3'])) * 1000:.2f} mm"
              f"  ψré {rr['psi21']:+.3f}″ ψv {rr['psi23']:+.3f}″ AzC {dms(rr['azc23'])} m {rr['m23']:.8f} Dc {rr['Dc']:.3f}")
