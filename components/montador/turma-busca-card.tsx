import { IconeAlerta, IconeInfo, IconeAdicionar, IconeLixeira } from "@/components/icones";
import { TurnoBadge } from "@/components/montador/turno-badge";
import type { Estado } from "@/lib/montador/conflitos";
import {
  DIAS,
  DIAS_LONGOS,
  getDocentesPorTipo,
  formatCreditos,
  formatHora,
  formatTpie,
  rotuloPeriodicidade,
  type Disciplina,
} from "@/lib/montador/disciplina";

const chip = "rounded-md border border-grade-line bg-grade-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold not-italic";
const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink";

type Props = {
  disciplina: Disciplina;
  estado: Estado;
  onInfo: (d: Disciplina) => void;
  onAdicionar: (d: Disciplina) => void;
  onRemover: (d: Disciplina) => void;
};

export function TurmaBuscaCard({ disciplina: d, estado, onInfo, onAdicionar, onRemover }: Props) {
  const conflitos = estado.tipo === "conflito" ? estado.conflitos : [];
  const aulasEmConflito = new Set(conflitos.map((c) => c.aula));
  const avisoId = `aviso-${d.id}`;
  const bloqueada = estado.tipo === "conflito" || estado.tipo === "duplicada";

  return (
    <li
      className={`rounded-[14px] border bg-grade-surface p-3.5 ${
        estado.tipo === "na-grade" ? "border-grade-accent ring-1 ring-grade-accent/40" : "border-grade-line"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[17px] font-bold leading-tight tracking-[-0.01em]">{d.nome}</h3>
        <button
          type="button"
          onClick={() => onInfo(d)}
          aria-label={`Mais informações sobre ${d.nome}, turma ${d.turma}`}
          className={`-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-grade-mute active:bg-grade-bg ${foco}`}
        >
          <IconeInfo className="h-4.5 w-4.5"/>
        </button>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1">
        <em className={`${chip} !border-grade-accent !bg-grade-accent text-white`}>Turma {d.turma}</em>

        <TurnoBadge turno={d.turno} />

        {d.campus && <em className={chip}>{d.campus}</em>}
      </div>

      <div className="mt-3 grid gap-0.5 border-l-2 border-grade-accent/60 pl-2.5">
        {getDocentesPorTipo(d).map((x) => (
          <div key={`${x.tipo}-${x.nome}`} className="flex items-baseline gap-2">
            {x.tipo && (
              <span className="min-w-13 text-[10px] font-semibold uppercase tracking-wide text-grade-mute">
                {x.tipo}
              </span>
            )}
            <span className="text-sm font-bold leading-snug text-grade-ink">{x.nome}</span>
          </div>
        ))}
      </div>

      <ul className="mt-3 rounded-xl border border-grade-line bg-grade-bg px-3" aria-label="Horários">
        {d.aulas.map((s) => {
          const colide = aulasEmConflito.has(s);
          return (
            <li
              key={`${s.dia}-${s.inicio}-${s.tipo}-${s.quinzena}`}
              className="flex items-center justify-between gap-2 border-t border-grade-line py-2 first:border-t-0"
            >
              <span className={`text-[13px] font-semibold ${colide ? "text-grade-danger" : ""}`}>
                <span className="sr-only">{DIAS_LONGOS[s.dia]}</span>
                <span aria-hidden="true">{DIAS[s.dia]}</span> · {formatHora(s.inicio)} às {formatHora(s.inicio + s.duracao)}
                {s.tipo && <span className="ml-1.5 text-xs font-normal text-grade-mute">{s.tipo}</span>}
              </span>
              <em className={`${chip} shrink-0 ${colide ? "border-grade-danger/40 text-grade-danger" : ""}`}>
                {rotuloPeriodicidade(s.quinzena)}
              </em>
            </li>
          );
        })}
      </ul>

      <div
        role="group"
        aria-label={`Teoria ${d.tpie.t}, prática ${d.tpie.p}, individual ${d.tpie.i}, extensão ${d.tpie.e}. ${formatCreditos(d.creditos)}`}
      >
        <div aria-hidden="true" className="mt-3 flex flex-wrap gap-2">
          <p className="inline-flex items-baseline gap-1.5 rounded-lg border border-grade-line bg-grade-bg px-2.5 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-grade-mute">TPIE</span>
            <span className="font-mono text-[13px] font-bold">{formatTpie(d)}</span>
          </p>
          <p className="inline-flex items-baseline gap-1.5 rounded-lg border border-grade-line bg-grade-bg px-2.5 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-grade-mute">Créditos</span>
            <span className="font-mono text-[13px] font-bold">{d.creditos}</span>
          </p>
        </div>
      </div>

      {estado.tipo === "conflito" && (
        <div id={avisoId} className="mt-3 rounded-xl border border-grade-danger/30 bg-grade-danger/10 px-3 py-2.5 text-[13px] leading-snug">
          <p className="mb-1 font-bold text-grade-danger">Conflito de horário</p>
          <ul className="grid gap-1">
            {estado.conflitos.map((c, i) => (
              <li key={i}>
                <b>{c.com.nome}</b> ({c.com.turma}) · {DIAS_LONGOS[c.dia]}, {formatHora(c.inicio)} às {formatHora(c.fim)}
                {c.quinzena > 0 && ` · Q${c.quinzena}`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {estado.tipo === "duplicada" && (
        <div id={avisoId} className="mt-3 rounded-xl border border-grade-danger/30 bg-grade-danger/10 px-3 py-2.5 text-[13px] leading-snug">
          <p className="font-bold text-grade-danger">Disciplina já está na grade</p>
          <p>A turma {estado.com.turma} de {estado.com.nome} já foi adicionada.</p>
        </div>
      )}

      {estado.tipo === "na-grade" ? (
        <button
          type="button"
          onClick={() => onRemover(d)}
          className={`mt-3.5 flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-grade-danger/40 bg-grade-bg text-[15px] font-bold text-grade-danger active:bg-grade-danger/15 ${foco}`}
        >
          <IconeLixeira className="h-4.5 w-4.5" /> Remover da grade
        </button>
      ) : (
        <button
          type="button"
          aria-disabled={bloqueada}
          aria-describedby={bloqueada ? avisoId : undefined}
          onClick={() => !bloqueada && onAdicionar(d)}
          className={`mt-3.5 flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full text-[15px] font-bold ${foco} ${
            bloqueada
              ? "cursor-not-allowed border border-grade-danger/30 bg-grade-danger/10 text-grade-danger"
              : "bg-grade-accent text-white active:brightness-95"
          }`}
        >
          {estado.tipo === "conflito" ? (
            <><IconeAlerta className="h-4.5 w-4.5" /> Conflito de horário{estado.conflitos.length > 1 && ` (${estado.conflitos.length})`}</>
          ) : estado.tipo === "duplicada" ? (
            <><IconeAlerta className="h-4.5 w-4.5" /> Disciplina já na grade</>
          ) : (
            <><IconeAdicionar className="h-4.5 w-4.5" /> Adicionar à grade</>
          )}
        </button>
      )}
    </li>
  );
}