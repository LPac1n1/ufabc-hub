const chip = "rounded-md border border-grade-line bg-grade-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold not-italic";

function getTurnoStyle(turno: string) {
  const t = turno.toLowerCase();
  if (t.includes("diurno") || t.includes("matutino")) {
    return { chip: "!border-disc-2/60 !bg-disc-2/25", ponto: "bg-disc-2" };
  }
  if (t.includes("noturno")) {
    return { chip: "!border-disc-1/50 !bg-disc-1/15", ponto: "bg-disc-1" };
  }
  return null; 
}

export function TurnoBadge({ turno }: { turno: string }) {
  const estilo = getTurnoStyle(turno);
  return (
    <em className={`${chip} ${estilo ? `inline-flex items-center gap-1 text-grade-ink ${estilo.chip}` : ""}`}>
      {estilo && <span aria-hidden="true" className={`size-1.5 rounded-full ${estilo.ponto}`} />}
      {turno}
    </em>
  );
}
