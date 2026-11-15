import type { CSSProperties } from "react";
import { CORES, DIAS, DIAS_LONGOS, formatHora, type Disciplina, type Aula } from "@/lib/montador/disciplina";

export type Filtro = "all" | "1" | "2";

const HORA_INICIO = 8;
const HORA_FIM = 23;
const LINHAS = HORA_FIM - HORA_INICIO + 1;
const HORAS = Array.from({ length: LINHAS }, (_, i) => HORA_INICIO + i);
const COLUNAS = "grid grid-cols-[2.125rem_repeat(6,minmax(0,1fr))]";

const LINHAS_BG =
  "repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--row-h) - 1px), var(--color-grade-line) calc(var(--row-h) - 1px), var(--color-grade-line) var(--row-h))";

const visivel = (s: Aula, filtro: Filtro) => filtro === "all" || s.quinzena === 0 || String(s.quinzena) === filtro;

type Props = {
  disciplinas: Disciplina[];
  filtro: Filtro;
  onSelect: (d: Disciplina) => void;
};

export function Grade({ disciplinas, filtro, onSelect }: Props) {
  return (
    <section
      aria-label="Grade horária"
      className="overflow-hidden rounded-[22px] border border-grade-line bg-grade-surface px-2 pb-2 pt-2.5"
      style={{ "--row-h": "46px" } as CSSProperties}
    >
      <div className={COLUNAS}>
        <div />
        {DIAS.map((d) => (
          <div key={d} className="pb-2 text-center text-xs font-semibold text-grade-mute">{d}</div>
        ))}
      </div>

      <div className={COLUNAS}>
        <div>
          {HORAS.map((h) => (
            <div key={h} className="h-(--row-h) pt-0.5 font-mono text-[9.5px] text-grade-mute">
              {formatHora(h)}
            </div>
          ))}
        </div>

        {DIAS.map((_, dia) => (
          <div
            key={dia}
            className="relative border-l border-grade-line"
            style={{ height: `calc(var(--row-h) * ${LINHAS})`, backgroundImage: LINHAS_BG }}
          >
            {disciplinas.flatMap((d) =>
              d.aulas
                .filter((s) => s.dia === dia && visivel(s, filtro))
                .map((s) => <Bloco key={`${d.id}-${s.inicio}-${s.quinzena}`} d={d} s={s} dividido={filtro === "all" && s.quinzena > 0} onSelect={onSelect} />),
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Bloco({ d, s, dividido, onSelect }: { d: Disciplina; s: Aula; dividido: boolean; onSelect: (d: Disciplina) => void }) {
  const label = `${d.nome}, ${DIAS_LONGOS[s.dia]} ${formatHora(s.inicio)} às ${formatHora(s.inicio + s.duracao)}${
    s.tipo ? `, ${s.tipo.toLowerCase()}` : ""
  }${s.quinzena ? `, quinzenal ${s.quinzena === 1 ? "I" : "II"}` : ""}`;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => onSelect(d)}
      className={`absolute flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[9px] px-0.5 py-1 text-grade-on transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink ${CORES[d.cor]}`}
      style={{
        top: `calc(var(--row-h) * ${s.inicio - HORA_INICIO} + 2px)`,
        height: `calc(var(--row-h) * ${s.duracao} - 4px)`,
        width: dividido ? "calc(50% - 3px)" : "calc(100% - 4px)",
        left: dividido && s.quinzena === 2 ? "calc(50% + 1px)" : "2px",
      }}
    >
      <b className={`font-extrabold tracking-tight ${dividido ? "text-[11px]" : "text-[15px]"}`}>{d.sigla}</b>
      {s.quinzena > 0 && (
        <i className="rounded-[5px] bg-black/20 px-0.75 py-px font-mono text-[8px] font-semibold not-italic">
          Q{s.quinzena}
        </i>
      )}
    </button>
  );
}
