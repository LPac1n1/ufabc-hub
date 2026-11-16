"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BuscaDisciplinas } from "@/components/montador/busca-disciplinas";
import { GrandeMontador } from "@/components/montador/grade-montador";
import { CORES, toDisciplina } from "@/lib/montador/disciplina";
import type { TurmaPropsData } from "@/services/quadrimestre";

type TurmaNaGrade = { id: string; cor: number };

export function TelasMontador({ turmas }: { turmas: TurmaPropsData[] }) {
  const [pesquisando, setPesquisando] = useState(false);
  const [grade, setGrade] = useState<TurmaNaGrade[]>([]);
  const origemDoFoco = useRef<HTMLElement | null>(null);

  const todas = useMemo(() => turmas.map((turma) => toDisciplina(turma)), [turmas]);
  const porId = useMemo(() => new Map(todas.map((d) => [d.id, d])), [todas]);
  const naGrade = useMemo(
    () =>
      grade.flatMap(({ id, cor }) => {
        const d = porId.get(id);
        return d ? [{ ...d, cor }] : [];
      }),
    [grade, porId],
  );

  function adicionar(id: string) {
    setGrade((atual) => {
      if (atual.some((g) => g.id === id)) return atual;
      const usadas = new Set(atual.map((g) => g.cor));
      const livre = CORES.findIndex((_, i) => !usadas.has(i));
      return [...atual, { id, cor: livre >= 0 ? livre : atual.length % CORES.length }];
    });
  }

  function remover(id: string) {
    setGrade((atual) => atual.filter((g) => g.id !== id));
  }

  function abrirPesquisa() {
    if (document.activeElement instanceof HTMLElement) {
      origemDoFoco.current = document.activeElement;
    }
    setPesquisando(true);
  }

  function fecharPesquisa() {
    setPesquisando(false);
  }

  useEffect(() => {
    if (!pesquisando) return;

    const html = document.documentElement;
    const overflowAnterior = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      html.style.overflow = overflowAnterior;
    };
  }, [pesquisando]);

  useEffect(() => {
    if (pesquisando) return;

    origemDoFoco.current?.focus({ preventScroll: true });
    origemDoFoco.current = null;
  }, [pesquisando]);

  return (
    <div data-pesquisando={pesquisando}>
      <div
        inert={pesquisando}
        className={`relative transition-[left] duration-300 ease-out motion-reduce:transition-none ${
          pesquisando ? "-left-full" : "left-0"
        }`}
      >
        <GrandeMontador
          disciplinas={naGrade}
          onRemover={remover}
          onDesfazer={adicionar}
          onAdicionarTurma={abrirPesquisa}
        />
      </div>

      <div
        inert={!pesquisando}
        className={`fixed inset-0 z-20 overflow-y-auto overscroll-contain bg-grade-bg transition-[translate,visibility] duration-300 ease-out motion-reduce:transition-none ${
          pesquisando ? "" : "invisible translate-x-full"
        }`}
      >
        <BuscaDisciplinas
          ativa={pesquisando}
          disciplinas={todas}
          naGrade={naGrade}
          onAdicionar={(d) => adicionar(d.id)}
          onRemover={(d) => remover(d.id)}
          onVoltar={fecharPesquisa}
        />
      </div>
    </div>
  );
}
