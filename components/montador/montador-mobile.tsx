"use client";

import { useState } from "react";
import { FiltroDiaSemana } from "@/components/montador/filtro-dia-semana";
import { FiltroQuinzena } from "@/components/montador/filtro-quinzena";
import type { DiaSemana, Quinzena } from "@/lib/montador/tipos";

export function MontadorMobile() {
  const [quinzena, setQuinzena] = useState<Quinzena>("Q1");
  const [dia, setDia] = useState<DiaSemana>("seg");

  return (
    <div className="flex flex-col gap-4">
      <FiltroQuinzena value={quinzena} onChange={setQuinzena} />
      <FiltroDiaSemana value={dia} onChange={setDia} />

      <p className="text-sm text-slate-500">
        Selecionado: {quinzena} · {dia}
      </p>
    </div>
  );
}
