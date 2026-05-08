export const fmt = (n: number): string =>
  "$" + Number(n).toLocaleString("es-AR", { maximumFractionDigits: 0 });
