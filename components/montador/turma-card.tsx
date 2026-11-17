import { IconeInfo, IconeLixeira } from "@/components/icones";
import { TurnoBadge } from "@/components/montador/turno-badge";
import { CORES, getDocentesPorTipo, formatCreditos, formatTpie, quinzenasDe, romano, type Disciplina } from "@/lib/montador/disciplina";
 
const chip = "rounded-md border border-grade-line bg-grade-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold not-italic";
const acao =
  "flex min-h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl border border-grade-line bg-grade-bg text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink active:bg-grade-line/60";
 
type Props = {
  disciplina: Disciplina;
  onDetalhes: (d: Disciplina) => void;
  onRemover: (d: Disciplina) => void;
};
 
export function TurmaCard({ disciplina: d, onDetalhes, onRemover }: Props) {
  return (
    <li className="grid grid-cols-[3.625rem_1fr] gap-x-3 overflow-hidden rounded-[14px] border border-grade-line bg-grade-surface">
      <div
        className={`row-span-2 grid place-items-center text-[17px] font-extrabold tracking-tight text-grade-on ${CORES[d.cor]}`}
        aria-hidden="true"
      >
        {d.sigla}
      </div>
 
      <button
        type="button"
        onClick={() => onDetalhes(d)}
        className="grid min-w-0 gap-1.25 pr-3 pt-3 text-left"
      >
        <span className="text-sm font-semibold leading-tight">{d.nome}</span>
        <span className="flex flex-wrap gap-1">
          <em className={`${chip} !border-grade-accent !bg-grade-accent !text-white`}>Turma {d.turma}</em>
          <TurnoBadge turno={d.turno} />
          {d.campus && <em className={chip}>{d.campus}</em>}
          {quinzenasDe(d).map((q) => (
            <em key={q} className={chip}>Quinzenal {romano(q)}</em>
          ))}
        </span>
 
        <span className="grid gap-0.5 border-l-2 border-grade-accent/60 pl-2">
          {getDocentesPorTipo(d).map((x) => (
            <span key={`${x.tipo}-${x.nome}`} className="flex items-baseline gap-2">
              {x.tipo && (
                <span className="min-w-12 text-[10px] font-semibold uppercase tracking-wide text-grade-mute">
                  {x.tipo}
                </span>
              )}
              <span className="text-[13px] font-bold leading-snug text-grade-ink">{x.nome}</span>
            </span>
          ))}
        </span>
 
        <span
          className="block font-mono text-[11px] text-grade-ink"
          aria-label={`Teoria ${d.tpie.t}, prática ${d.tpie.p}, individual ${d.tpie.i}, extensão ${d.tpie.e}. ${formatCreditos(d.creditos)}`}
        >
          <b className="font-semibold">TPIE {formatTpie(d)}</b> · {formatCreditos(d.creditos)}
        </span>
      </button>
 
      <div className="flex gap-3.5 py-3 pr-3">
        <button
          type="button"
          onClick={() => onDetalhes(d)}
          aria-label={`Mais informações sobre ${d.nome}`}
          className={acao}
        >
          <IconeInfo className="h-4.5 w-4.5" /> Detalhes
        </button>
        <button
          type="button"
          onClick={() => onRemover(d)}
          aria-label={`Remover ${d.nome} da grade`}
          className={`${acao} border-grade-danger/40 text-grade-danger active:bg-grade-danger/15`}
        >
          <IconeLixeira className="h-4.5 w-4.5" /> Remover
        </button>
      </div>
    </li>
  );
}
 