"use client";

import { IconeAdicionar } from "@/components/icones";
import { formatCreditos } from "@/lib/montador/disciplina";

type MenuInferiorProps = {
  totalCreditos: number;
  onAdicionarTurma: () => void;
};

export function MenuInferior({ totalCreditos, onAdicionarTurma }: MenuInferiorProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-grade-line bg-grade-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur transition-[translate] duration-300 ease-out in-data-[pesquisando=true]:-translate-x-full motion-reduce:transition-none">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-2.5">
        <p aria-live="polite" aria-atomic="true" className="flex min-w-0 flex-col">
          <span className="font-mono text-[10px] text-grade-mute">Total de créditos</span>
          <span className="text-[15px] font-bold">{formatCreditos(totalCreditos)}</span>
        </p>

        <button
          type="button"
          onClick={onAdicionarTurma}
          className="flex min-h-12 shrink-0 touch-manipulation items-center gap-2 rounded-full bg-grade-accent px-5 text-[15px] font-bold whitespace-nowrap text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink active:brightness-95"
        >
          <IconeAdicionar className="h-4 w-4" />Adicionar turma
        </button>
      </div>
    </div>
  );
}
