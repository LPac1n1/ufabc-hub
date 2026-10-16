export type Quinzena = "Q1" | "Q2" | "todas";

export type OpcaoQuinzena = {
  valor: Quinzena;
  rotulo: string;
};

export const OPCOES_QUINZENA: OpcaoQuinzena[] = [
  { valor: "Q1", rotulo: "Quinzenal I" },
  { valor: "Q2", rotulo: "Quinzenal II" },
  { valor: "todas", rotulo: "Todas" },
];
