import type { Disciplina, Quinzena, Aula } from "./disciplina";

export type Conflito = {
  com: Disciplina; // turma que já está na grade
  aula: Aula; // aula da candidata que colide
  dia: number;
  inicio: number;
  fim: number;
  quinzena: Quinzena; // 0 = colide toda semana
};

export type Estado =
  | { tipo: "livre" }
  | { tipo: "na-grade" }
  | { tipo: "duplicada"; com: Disciplina }
  | { tipo: "conflito"; conflitos: Conflito[] };

// Semanal colide com tudo; Q1 só com Q1; Q2 só com Q2.
const quinzenasColidem = (a: Quinzena, b: Quinzena) => a === 0 || b === 0 || a === b;

export function getConflito(candidata: Disciplina, naGrade: Disciplina[]): Conflito[] {
  const out: Conflito[] = [];
  for (const g of naGrade) {
    if (g.id === candidata.id) continue;
    for (const s of candidata.aulas) {
      for (const t of g.aulas) {
        if (s.dia !== t.dia || !quinzenasColidem(s.quinzena, t.quinzena)) continue;
        const inicio = Math.max(s.inicio, t.inicio);
        const fim = Math.min(s.inicio + s.duracao, t.inicio + t.duracao);
        if (inicio < fim) {
          out.push({ com: g, aula: s, dia: s.dia, inicio, fim, quinzena: (s.quinzena || t.quinzena) as Quinzena });
        }
      }
    }
  }
  return out;
}

export function getEstado(d: Disciplina, naGrade: Disciplina[], verificar: boolean): Estado {
  if (naGrade.some((g) => g.id === d.id)) return { tipo: "na-grade" };
  const outra = naGrade.find((g) => g.disciplinaId === d.disciplinaId);
  if (outra) return { tipo: "duplicada", com: outra };
  if (verificar) {
    const conflitos = getConflito(d, naGrade);
    if (conflitos.length) return { tipo: "conflito", conflitos };
  }
  return { tipo: "livre" };
}
