"use client";

import { useEffect, useRef } from "react";
import type { Disciplina } from "@/lib/montador/disciplina";

type Props = {
  antigas: Disciplina[];
  novas: Disciplina[];
  onManterAntigas: () => void;
  onManterNovas: () => void;
};

const botao =
  "min-h-12 w-full rounded-full text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink";

function Lista({ titulo, descricao, turmas }: { titulo: string; descricao: string; turmas: Disciplina[] }) {
  return (
    <section className="rounded-2xl border border-grade-line bg-grade-bg px-3.5 py-3">
      <h3 className="text-[15px] font-bold">{titulo}</h3>
      <p className="mb-2 text-xs text-grade-mute">{descricao}</p>
      <ul className="grid gap-1.5">
        {turmas.map((d) => (
          <li key={d.id} className="text-sm leading-snug">
            <b className="font-semibold">{d.nome}</b>
            <span className="block font-mono text-[11px] text-grade-mute">
              Turma {d.turma} · {d.turno}
              {d.campus && ` · ${d.campus}`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PopUpConflito({ antigas, novas, onManterAntigas, onManterNovas }: Props) {
  const primeiro = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    primeiro.current?.focus();
  }, []);

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 z-70 bg-[#0a1e1a]/45" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="conflito-titulo"
        aria-describedby="conflito-descricao"
        className="fixed inset-0 z-80 grid place-items-center p-4"
      >
        <div className="max-h-[88dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-[26px] border border-grade-line bg-white p-5 shadow-[0_12px_40px_rgba(18,48,43,.18)]">
          <h2 id="conflito-titulo" className="text-[22px] font-extrabold leading-tight tracking-[-0.03em]">
            Encontramos outra grade
          </h2>
          <p id="conflito-descricao" className="mb-4 mt-1.5 text-sm leading-snug text-grade-mute">
            As turmas do link são diferentes das que estavam salvas neste navegador. Qual grade você quer manter?
          </p>

          <div className="grid gap-3">
            <Lista titulo="Turmas antigas" descricao="Salvas neste navegador" turmas={antigas} />
            <Lista titulo="Turmas novas" descricao="Vindas do link" turmas={novas} />
          </div>

          <div className="mt-5 grid gap-2">
            <button
              ref={primeiro}
              type="button"
              onClick={onManterNovas}
              className={`${botao} bg-grade-accent text-white`}
            >
              Manter as novas
            </button>
            <button
              type="button"
              onClick={onManterAntigas}
              className={`${botao} border border-grade-line bg-grade-bg`}
            >
              Manter as antigas
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
