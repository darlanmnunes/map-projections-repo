"""
V2. Reduções lineares: fator de altitude, fator de escala da linha e fator combinado.

Gera motion/v2-dados.json e confere os números dos slides 6, 7 e 8 da Aula 10
com o módulo comum (aulas/aula10_transporte_coordenadas/comum/transporte.py) e o pyproj.

- 'fh': Fh − 1 em mm/km para h = 100, 668 e 2 000 m (Viçosa, azimute da linha 2→3).
- 'perfil': m − 1 (mm/km) ao longo de E′ na latitude de Viçosa, de E′ = −330 a +330 km.
- 'simpson': linha de 5 km para leste a partir da estação 2: m1, mm, m2, m12 e os erros.
- 'k': grade de k − 1 (mm/km) sobre E′ (0 a 330 km) × h (0 a 2 000 m), na latitude de Viçosa.

Uso:
    python gerar_dados.py
"""

import json
import math
import sys
from pathlib import Path

import numpy as np

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[1] / "comum"))
import transporte as T  # noqa: E402

SAIDA = AQUI.parent / "motion" / "v2-dados.json"
v = T.VICOSA
E2, N2 = v["E2"], v["N2"]
r = T.direto(v["E1"], v["N1"], E2, N2, v["alfa"], v["Dh"], v["hm"])
phi = T.lat(E2, N2)
az = r["azq23"] + T.gama(E2, N2)

# Fator de altitude
fh = {h: (T.fator_altitude(phi, az, h)[0] - 1) * 1e6 for h in (100, 668, 2000)}
M, Nr = T.raios(phi)
fh_mn = math.sqrt(M * Nr) / (math.sqrt(M * Nr) + 668)
fh_H = T.fator_altitude(phi, az, 658)[0]

# Perfil de m ao longo de E′ (mesmo N de Viçosa)
Ep = np.linspace(-330e3, 330e3, 133)
perfil = [[round(e / 1000, 2), round((T.m_ponto(T.E0 + e, N2) - 1) * 1e6, 2)] for e in Ep]
sec = T.E0 + math.sqrt(2 * T.K0 ** 2 * M * Nr * (1 / T.K0 - 1))      # m = 1 pela eq. (9)

# Linha de 5 km para leste
E3 = E2 + 5000
m1, mm, m2 = T.m_ponto(E2, N2), T.m_ponto((E2 + E3) / 2, N2), T.m_ponto(E3, N2)
m12_s = 1 / ((1 / m1 + 4 / mm + 1 / m2) / 6)
m12_20 = T.m_linha(E2, N2, E3, N2)
# Referência: média exata de 1/m ao longo da linha (fatores exatos do pyproj, 2001 pontos)
xs = np.linspace(E2, E3, 2001)


def mx(E):
    lo, la = T.UTM23(E, N2, inverse=True)
    return T.UTM23.get_factors(lo, la).meridional_scale


inv = np.array([1 / mx(x) for x in xs])
m12_ref = 1 / np.trapezoid(inv, xs) * 5000
m12_simp_exato = T.m_simpson(E2, N2, E3, N2)
err_m1 = (m1 - m12_ref) * 1e6
err_s = (m12_simp_exato - m12_ref) * 1e6

# Fator combinado em Viçosa
mV = T.m_ponto(E2, N2)
fhV = r["Fh"]
kV = mV * fhV

# Grade de k sobre E′ × h
EE = np.linspace(0, 330e3, 34)
HH = np.linspace(0, 2000, 21)
kgrid = []
for h in HH:
    fh_h = T.fator_altitude(phi, az, h)[0]
    kgrid.append([round((T.m_ponto(T.E0 + e, N2) * fh_h - 1) * 1e6, 1) for e in EE])
kmin = min(min(row) for row in kgrid)

dados = {
    "fh": {str(h): round(x, 2) for h, x in fh.items()}, "Fh668": fhV, "Ra": r["Ra"],
    "perfil": perfil, "sec": round((sec - T.E0) / 1000, 2),
    "vic": round((E2 - T.E0) / 1000, 3),
    "simpson": {"E1": round((E2 - T.E0) / 1000, 3), "E2": round((E3 - T.E0) / 1000, 3),
                "m1": m1, "mm": mm, "m2": m2, "m12": m12_simp_exato, "err_m1": err_m1, "err_s": err_s},
    "comb": {"m": (mV - 1) * 1e6, "fh": (fhV - 1) * 1e6, "k": (kV - 1) * 1e6, "kV": kV, "area": 10000 * kV ** 2},
    "k": {"E": [round(e / 1000, 1) for e in EE], "h": [round(h) for h in HH], "v": kgrid, "min": kmin},
}
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

print("Fator de altitude (slide 6), azimute da linha 2→3:")
for h, x in fh.items():
    print(f"  h = {h:5d} m: {x:+.1f} mm/km   (−15,7 ; −105 ; −314)")
print(f"  Fh(668) = {fhV:.6f} (0,999895);  Rα = {r['Ra']:.0f} m")
print(f"  √(MN) em vez de Rα: {(fh_mn - fhV) * 1e6:+.2f} mm/km (0,24);  H em vez de h (10 m): {(fh_H - fhV) * 1e6:+.2f} mm/km (1,6)")
print(f"Perfil: linha de secância em E′ = ±{(sec - T.E0) / 1000:.1f} km; m na borda (330 km) = {T.m_ponto(T.E0 + 330e3, N2):.6f}")
print("Linha de 5 km para leste (slide 7):")
print(f"  m1 = {m1:.8f}  mm = {mm:.8f}  m2 = {m2:.8f}  m12 (Simpson) = {m12_simp_exato:.8f}  eq.(20) = {m12_20:.8f}")
print(f"  erro de usar m1: {err_m1:+.2f} mm/km (14);  erro de Simpson: {err_s:+.5f} mm/km (0,002)")
print("Fator combinado (slide 8):")
print(f"  m = {mV:.6f} ({(mV - 1) * 1e6:+.0f} mm/km)  Fh = {fhV:.6f} ({(fhV - 1) * 1e6:+.0f})  k = {kV:.6f} ({(kV - 1) * 1e6:+.0f})")
print(f"  mínimo de k na grade (E′ = 0, h = 2 000 m): {kmin:+.0f} mm/km (−700)")
print(f"  1 ha no terreno → {10000 * kV ** 2:.1f} m² na grade (10 002,1)")
print(SAIDA.relative_to(AQUI.parents[3]))
