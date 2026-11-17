const CAPIVARAS = ["banho", "laranja", "notebook"] as const;

const SEGUNDOS_POR_CAPIVARA = 2;

const SEGUNDOS_DO_CICLO = SEGUNDOS_POR_CAPIVARA * CAPIVARAS.length;

export function TelaCarregando() {
  return (
    <div className="grid min-h-[70dvh] place-content-center justify-items-center gap-4 pb-6">
      <div aria-hidden="true" className="relative h-56 w-64 max-w-full">
        {CAPIVARAS.map((nome, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={nome}
            src={`/capivaras/${nome}.svg`}
            alt=""
            draggable={false}
            style={{
              animationDuration: `${SEGUNDOS_DO_CICLO}s`,
              animationDelay: `${i * SEGUNDOS_POR_CAPIVARA}s`,
            }}
            className={`absolute inset-0 size-full select-none object-contain opacity-0 animate-capivara motion-reduce:animate-none ${
              i === 0 ? "motion-reduce:opacity-100" : ""
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <p role="status" aria-live="polite" className="text-[15px] font-semibold text-grade-mute">
          Carregando disciplinas…
        </p>
        <p className="text-[13px] text-grade-mute/80">
          Na primeira vez, pode levar alguns segundos.
        </p>
      </div>

      {/* Atribuição exigida pela licença gratuita da Magnific (autor: upklyak). */}
      <p className="text-[11px] text-grade-mute/80">
        <a
          href="https://www.magnific.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grade-ink"
        >
          image designed by upklyak - Magnific.com
        </a>
      </p>
    </div>
  );
}
