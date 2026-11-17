import type { TurmaPropsData } from "@/services/quadrimestre";

export type Quinzena = 0 | 1 | 2; // 0 = semanal
export type Tipo = "Teoria" | "Prática" | null;

export type Aula = {
  dia: number; // 0 = segunda ... 5 = sábado
  inicio: number; 
  duracao: number; 
  tipo: Tipo;
  docentes: string[];
  quinzena: Quinzena;
};

export type Disciplina = {
  id: string;
  disciplinaId: string;
  codigo: string; 
  sigla: string;
  nome: string;
  codigoTurma: string; // código completo da turma, ex.: "DA1BCM0506-15SA" (usado na URL)
  turma: string;
  curso: string; 
  turno: string;
  campus: string;
  vagas: number;
  reserva: number;
  idiomas: string[];
  recomendadas: string[];
  bibliografiaBasica: string;
  bibliografiaComplementar: string;
  creditos: number;
  tpie: { t: number; p: number; i: number; e: number }; 
  cor: number; // índice em CORES (definido quando a turma entra na grade)
  aulas: Aula[];
};

export const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
export const DIAS_LONGOS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

// Classes literais, para o Tailwind enxergar. Cores definidas em app/grade-theme.css.
export const CORES = [
  "bg-disc-1", "bg-disc-2", "bg-disc-3", "bg-disc-4", "bg-disc-5", "bg-disc-6", "bg-disc-7",
] as const;

/* ---------- Normalização dos enums/valores do banco ---------- */
const norm = (v: unknown) =>
  String(v ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

const DIA_KEYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
const getDia = (v: unknown) => DIA_KEYS.indexOf(norm(v).slice(0, 3));

function getHoras(v: unknown): number {
  if (v instanceof Date) return v.getUTCHours() + v.getUTCMinutes() / 60;
  if (typeof v === "number") return v;
  const m = String(v).match(/(\d{1,2}):(\d{2})/);
  return m ? Number(m[1]) + Number(m[2]) / 60 : 0;
}

const getTipo = (v: unknown): Tipo => {
  const t = norm(v);
  return t.startsWith("TEOR") ? "Teoria" : t.startsWith("PRAT") ? "Prática" : null;
};

const getQuinzena = (v: unknown): Quinzena => {
  const p = norm(v);
  return p === "Q1" ? 1 : p === "Q2" ? 2 : 0;
};

const getTurno = (v: unknown) => {
  const t = norm(v).trim();
  if (t.startsWith("N")) return "Noturno";
  if (t.startsWith("M")) return "Matutino";
  if (t.startsWith("D")) return "Diurno";
  return String(v ?? "").trim();
};

// "DA1BCM0506-15SA" -> "A1"; códigos curtos ficam como estão
const getTurma = (codigo: string) => {
  if (codigo.length <= 4) return codigo;
  return codigo.match(/^[DN]([A-Z]\d)/)?.[1] ?? codigo;
};

const STOP = /^(de|da|do|das|dos|e|a|o|para|em)$/i;
function getSigle(nome: string) {
  const w = nome.split(/\s+/).filter((x) => !STOP.test(x));
  return (w.length > 1 ? w[0][0] + w[1][0] : nome.slice(0, 2)).toUpperCase();
}

function getIdioma(t: TurmaPropsData) {
  const idiomas: string[] = [];
  if (t.ingles) idiomas.push("Inglês");
  if (t.espanhol) idiomas.push("Espanhol");
  return idiomas.length > 0 ? idiomas : ["Português"];
}

function getAula(t: TurmaPropsData): Aula[] {
  const porChave = new Map<string, Aula>();

  for (const h of t.horarios) {
    const inicio = getHoras(h.horarioInicio);
    const aula: Aula = {
      dia: getDia(h.diaSemana),
      inicio,
      duracao: getHoras(h.horarioTermino) - inicio,
      tipo: getTipo(h.tipo),
      docentes: [],
      quinzena: getQuinzena(h.periodicidade),
    };
    if (aula.dia < 0 || aula.dia >= DIAS.length || aula.duracao <= 0) continue;

    const chave = [aula.dia, aula.inicio, aula.duracao, aula.tipo, aula.quinzena].join("|");
    const atual = porChave.get(chave) ?? aula;
    porChave.set(chave, atual);

    const nome = h.docente?.nome;
    if (nome && !atual.docentes.includes(nome)) atual.docentes.push(nome);
  }

  return [...porChave.values()].sort(
    (a, b) => a.dia - b.dia || a.inicio - b.inicio || a.quinzena - b.quinzena,
  );
}

const getCodigoCompleto = (t: TurmaPropsData) => {
  if (t.codigo.length > 4) return t.codigo; // já veio no formato completo
  const turno = String(t.turno ?? "").trim().charAt(0).toUpperCase();
  return `${turno}${t.codigo}${t.disciplina.codigo}${t.campus ?? ""}`;
};

export function toDisciplina(t: TurmaPropsData): Disciplina {
  return {
    id: t.id,
    disciplinaId: t.disciplina.id,
    codigo: t.disciplina.codigo,
    sigla: getSigle(t.disciplina.nome),
    nome: t.disciplina.nome,
    codigoTurma: getCodigoCompleto(t),
    turma: getTurma(t.codigo),
    curso: t.curso.nome.trim(),
    turno: getTurno(t.turno),
    campus: t.campus ?? "",
    vagas: t.vagas,
    reserva: t.reserva,
    idiomas: getIdioma(t),
    recomendadas: t.disciplina.recomendacoes.map((r) => r.nome),
    bibliografiaBasica: t.disciplina.bibliografiaBasica?.trim() ?? "",
    bibliografiaComplementar: t.disciplina.bibliografiaComplementar?.trim() ?? "",
    creditos: t.disciplina.creditos ?? 0,
    tpie: {
      t: t.disciplina.horasTeoria ?? 0,
      p: t.disciplina.horasPratica ?? 0,
      i: t.disciplina.horasIndividuais ?? 0,
      e: t.disciplina.horasExtensao ?? 0,
    },
    cor: 0,
    aulas: getAula(t),
  };
}

export function formatHora(x: number) {
  const h = Math.floor(x);
  const m = Math.round((x - h) * 60);
  return `${String(h).padStart(2, "0")}h${m ? String(m).padStart(2, "0") : ""}`;
}

export const rotuloPeriodicidade = (q: Quinzena) => (q === 0 ? "Semanal" : `Q${q}`);
export const romano = (q: Quinzena) => (q === 1 ? "I" : "II");
export const formatTpie = (d: Disciplina) => `${d.tpie.t}-${d.tpie.p}-${d.tpie.i}-${d.tpie.e}`;
export const formatCreditos = (n: number) => `${n} ${n === 1 ? "crédito" : "créditos"}`;
export const quinzenasDe = (d: Disciplina) =>
  [...new Set(d.aulas.map((s) => s.quinzena).filter((q) => q > 0))].sort() as Quinzena[];
export const nomesDocentes = (d: Disciplina) => [...new Set(d.aulas.flatMap((s) => s.docentes))];

export function getDocentesPorTipo(d: Disciplina) {
  const mapa = new Map<string, { tipo: Tipo; nome: string }>();

  for (const s of d.aulas) {
    const nomes = s.docentes.length > 0 ? s.docentes : ["Docente a definir"];
    for (const nome of nomes) {
      mapa.set(`${s.tipo}|${nome}`, { tipo: s.tipo, nome });
    }
  }

  return Array.from(mapa.values());
}