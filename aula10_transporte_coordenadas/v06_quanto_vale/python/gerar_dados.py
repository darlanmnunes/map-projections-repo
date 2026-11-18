"""
V6. Quanto vale cada correção e quando simplificar.

Gera motion/v6-dados.json e confere os números dos slides 19 e 22 da Aula 10:

- 'erros': deslocamento do ponto 3 do exemplo de Viçosa (slide 16) quando uma correção
  é esquecida, em relação à solução completa do problema direto (slide 17);
- 'regra': d ≈ D²E′/(2R²), erro de desprezar ψ ou de usar o fator do ponto inicial,
  para E′ = 100, 222 (Viçosa) e 300 km, com D de 0 a 10 km;
- 'et': precisão linear de uma estação total (2 mm + 2 ppm) na linha do exemplo.

Uso:
    python gerar_dados.py
"""

import json
import math
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[1] / "comum"))
import transporte as T  # noqa: E402

SAIDA = AQUI.parent / "motion" / "v6-dados.json"
v = T.VICOSA
E1, N1, E2, N2, alfa, Dh, hm = v["E1"], v["N1"], v["E2"], v["N2"], v["alfa"], v["Dh"], v["hm"]
r = T.direto(E1, N1, E2, N2, alfa, Dh, hm)
E3, N3 = r["E3"], r["N3"]


def ponto(az, Dc):
    s, c = math.sin(math.radians(az)), math.cos(math.radians(az))
    return E2 + Dc * s, N2 + Dc * c


def desl(p):
    return math.dist(p, (E3, N3))


g2 = T.gama(E2, N2)
casos = {
    # orientação vinda de um azimute geodésico aplicado como se fosse de quadrícula (γ esquecido)
    "gama": desl(ponto(r["azc23"] + g2, r["Dc"])),
    # distância: sem m23 (Dc = De), sem Fh (De = Dh), sem os dois (Dc = Dh)
    "m": desl(ponto(r["azc23"], r["De"])),
    "fh": desl(ponto(r["azc23"], r["m23"] * Dh)),
    "mfh": desl(ponto(r["azc23"], Dh)),
    # fator do ponto 2 no lugar do fator da linha
    "mponto": desl(ponto(r["azc23"], T.m_ponto(E2, N2) * r["De"])),
    # ψ esquecido: só o da vante (como no slide 19), só o da ré e os dois
    "psi23": desl(ponto(r["azq23"], r["Dc"])),
    "psi21": desl(ponto(r["azc23"] - r["psi21"] / 3600, r["Dc"])),
    "psi_ambos": desl(ponto(r["azc23"] - (r["psi21"] - r["psi23"]) / 3600, r["Dc"])),
}
et = 2 + 2 * Dh / 1000          # mm: 2 mm + 2 ppm

M, Nr = T.raios(r["phi2"])
R2 = M * Nr
regra = {}
for ep in (100e3, 222120.586, 300e3):
    regra[str(round(ep / 1000))] = [[D, D * D * ep / (2 * R2) * 1000] for D in range(0, 10001, 250)]
pontos_vicosa = {D: D * D * 222120.586 / (2 * R2) * 1000 for D in (1000, 3000, 10000)}

dados = {"erros_m": casos, "et_mm": et, "regra_mm": regra, "R": math.sqrt(R2), "Elinha": E2 - T.E0,
         "gama2": g2, "fh": r["Fh"], "m23": r["m23"], "k": r["k23"],
         "vicosa_mm": {str(k): val for k, val in pontos_vicosa.items()}}
SAIDA.write_text(json.dumps(dados, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

print("Deslocamento do ponto 3 quando uma correção é esquecida (slide 19)")
print(f"  γ esquecido ({T.dms(g2)}):     {casos['gama']:8.3f} m   (slide: 38 m)")
print(f"  sem m23:                        {casos['m']:8.3f} m")
print(f"  sem Fh:                         {casos['fh']:8.3f} m")
print(f"  sem m23 e sem Fh:               {casos['mfh']:8.3f} m   (slide: dezenas de cm, metade se compensa)")
print(f"  m do ponto em vez da linha:     {casos['mponto'] * 1000:8.1f} mm  (slide: 21 mm)")
print(f"  sem ψ23 (vante):                {casos['psi23'] * 1000:8.1f} mm  (slide: 7 mm)")
print(f"  sem ψ21 (ré):                   {casos['psi21'] * 1000:8.1f} mm")
print(f"  sem ψ21 e ψ23:                  {casos['psi_ambos'] * 1000:8.1f} mm")
print(f"  estação total 2 mm + 2 ppm:     {et:8.1f} mm  (slide: ≈ 8 mm)")
print("d ≈ D²E′/(2R²) em Viçosa (slide 22)")
for D, val in pontos_vicosa.items():
    print(f"  D = {D / 1000:4.0f} km: {val:7.1f} mm   (slide: 3 mm; 25 mm; 27 cm)")
print(SAIDA.relative_to(AQUI.parents[2]))
