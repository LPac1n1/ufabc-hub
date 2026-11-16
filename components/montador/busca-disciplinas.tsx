"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { IconeBusca } from "@/components/icones";
import { TurmaBuscaCard } from "./turma-busca-card";
import { getEstado } from "@/lib/montador/conflitos";
import { nomesDocentes, type Disciplina } from "@/lib/montador/disciplina";

const TODOS = "todos";
const TAMANHO_DO_LOTE = 10;

const semAcento = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const unicos = (xs: string[]) => [...new Set(xs.filter(Boolean))].sort();
const ordemAlfabetica = new Intl.Collator("pt-BR", { numeric: true });

function Opcoes({ legenda, valor, opcoes, onChange }: { legenda: string; valor: string; opcoes: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] text-grade-mute">{legenda}</p>
      <div role="radiogroup" aria-label={legenda} className="flex flex-wrap gap-1.5">
        {[TODOS, ...opcoes].map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={valor === o}
            onClick={() => onChange(o)}
            className={`min-h-10 rounded-full border px-3.5 text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink ${
              valor === o ? "border-grade-accent bg-grade-accent text-white" : "border-grade-line bg-grade-bg text-grade-mute"
            }`}
          >
            {o === TODOS ? "Todos" : o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Vazio({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[14px] border border-dashed border-grade-line p-6 text-center text-sm text-grade-mute">
      {children}
    </p>
  );
}

function CardEsqueleto() {
  return (
    <div className="mt-2.5 animate-pulse rounded-[14px] border border-grade-line bg-grade-surface p-3.5 motion-reduce:animate-none">
      <div className="h-5 w-3/4 rounded-md bg-grade-line" />
      <div className="mt-2.5 flex gap-1">
        <div className="h-5 w-16 rounded-md bg-grade-line/70" />
        <div className="h-5 w-20 rounded-md bg-grade-line/70" />
      </div>
      <div className="mt-3 h-20 rounded-xl bg-grade-bg" />
      <div className="mt-3.5 h-12 rounded-full bg-grade-line/70" />
    </div>
  );
}

type Props = {
  ativa: boolean;
  disciplinas: Disciplina[]; 
  naGrade: Disciplina[]; 
  onAdicionar: (d: Disciplina) => void;
  onRemover: (d: Disciplina) => void;
  onVoltar: () => void;
};

export function BuscaDisciplinas({ ativa, disciplinas, naGrade, onAdicionar, onRemover, onVoltar }: Props) {
  const [busca, setBusca] = useState("");
  const [turno, setTurno] = useState(TODOS);
  const [campus, setCampus] = useState(TODOS);
  const [verificar, setVerificar] = useState(true);
  const [quantidade, setQuantidade] = useState(TAMANHO_DO_LOTE);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const fimDaListaRef = useRef<HTMLDivElement>(null);

  const buscaAdiada = useDeferredValue(busca);

  const turnos = useMemo(() => unicos(disciplinas.map((d) => d.turno)), [disciplinas]);
  const campi = useMemo(() => unicos(disciplinas.map((d) => d.campus)), [disciplinas]);

  // Ordena e normaliza o texto de busca uma única vez.
  const indice = useMemo(
    () =>
      disciplinas
        .map((d) => ({
          d,
          alvo: semAcento(`${d.nome} ${d.codigo} ${d.sigla} ${d.turma} ${nomesDocentes(d).join(" ")}`),
        }))
        .sort((a, b) => ordemAlfabetica.compare(a.d.nome, b.d.nome) || ordemAlfabetica.compare(a.d.turma, b.d.turma)),
    [disciplinas],
  );

  const resultados = useMemo(() => {
    const termos = semAcento(buscaAdiada).split(/\s+/).filter(Boolean);
    return indice
      .filter(({ d }) => (turno === TODOS || d.turno === turno) && (campus === TODOS || d.campus === campus))
      .filter(({ alvo }) => termos.every((t) => alvo.includes(t)))
      .map(({ d }) => d);
  }, [indice, buscaAdiada, turno, campus]);

  const visiveis = resultados.slice(0, quantidade);
  const temMais = quantidade < resultados.length;

  useEffect(() => {
    if (ativa) tituloRef.current?.focus({ preventScroll: true });
  }, [ativa]);

  useEffect(() => {
    const fimDaLista = fimDaListaRef.current;
    if (!fimDaLista || !temMais) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setQuantidade((atual) => atual + TAMANHO_DO_LOTE);
        }
      },
      { rootMargin: "0px 0px 200px 0px" },
    );
    observador.observe(fimDaLista);

    return () => observador.disconnect();
  }, [temMais, quantidade]);

  // Qualquer mudança de filtro volta para o primeiro lote.
  const mudar = <T,>(set: (v: T) => void) => (v: T) => { set(v); setQuantidade(TAMANHO_DO_LOTE); };

  return (
    <main className="mx-auto w-full max-w-lg px-3 pb-12">
      <header className="sticky top-0 z-30 -mx-3 bg-grade-bg/90 px-3 pb-3 pt-[calc(14px+env(safe-area-inset-top))] backdrop-blur">
        <div className="mb-3 flex items-end justify-between px-1">
          <h1
            ref={tituloRef}
            tabIndex={-1}
            className="text-[40px] font-extrabold leading-[.9] tracking-[-0.04em] focus:outline-none"
          >
            Buscar
          </h1>
          <button
            type="button"
            onClick={onVoltar}
            className="flex min-h-11 items-center rounded-full border border-grade-line bg-grade-surface px-4 text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink"
          >
            Ver grade ({naGrade.length})
          </button>
        </div>
        <label className="relative block">
          <span className="sr-only">Buscar por disciplina, código, sigla, turma ou professor</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-grade-mute h-12"><IconeBusca /></span>
          <input
            type="search"
            value={busca}
            onChange={(e) => mudar(setBusca)(e.target.value)}
            placeholder="Disciplina, código ou professor"
            enterKeyHint="search"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-grade-line bg-grade-surface pl-11 pr-4 text-[15px] placeholder:text-grade-mute focus-visible:outline-2 focus-visible:outline-grade-accent"
          />
        </label>
      </header>

      <section aria-label="Filtros" className="mt-1 grid gap-3.5 rounded-[18px] border border-grade-line bg-grade-surface p-3.5">
        <Opcoes legenda="Turno" valor={turno} opcoes={turnos} onChange={mudar(setTurno)} />
        <Opcoes legenda="Campus" valor={campus} opcoes={campi} onChange={mudar(setCampus)} />
        <div className="flex items-center justify-between gap-3 border-t border-grade-line pt-3.5">
          <div>
            <p id="rotulo-conflitos" className="text-sm font-semibold">Verificar conflitos</p>
            <p className="text-xs text-grade-mute">Impede adicionar turmas com horário sobreposto.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={verificar}
            aria-labelledby="rotulo-conflitos"
            onClick={() => setVerificar((v) => !v)}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink motion-reduce:transition-none ${
              verificar ? "bg-grade-accent" : "bg-grade-line"
            }`}
          >
            <span className={`absolute left-1 top-1 size-6 rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${verificar ? "translate-x-6" : ""}`} />
          </button>
        </div>
      </section>

      <p aria-live="polite" className="mx-1 mb-2 mt-4 text-[13px] font-semibold text-grade-mute">
        {resultados.length.toLocaleString("pt-BR")} {resultados.length === 1 ? "turma" : "turmas"}
      </p>

      {disciplinas.length === 0 ? (
        <Vazio>Ainda não há turmas cadastradas para o quadrimestre atual.</Vazio>
      ) : resultados.length === 0 ? (
        <Vazio>Nenhuma turma encontrada. Tente outro nome ou limpe os filtros de turno e campus.</Vazio>
      ) : (
        <ul className="grid gap-2.5">
          {visiveis.map((d) => (
            <TurmaBuscaCard
              key={d.id}
              disciplina={d}
              estado={getEstado(d, naGrade, verificar)}
              onInfo={()=>{}}
              onAdicionar={onAdicionar}
              onRemover={onRemover}
            />
          ))}
        </ul>
      )}

      {temMais && (
        <div ref={fimDaListaRef} aria-hidden="true">
          <CardEsqueleto />
        </div>
      )}

    </main>
  );
}
