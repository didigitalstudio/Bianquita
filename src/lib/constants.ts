/** Compra mínima para envío gratis (en ARS). */
export const FREE_SHIP_THRESHOLD = 35000;

/** Descuento por transferencia bancaria (10%). */
export const TRANSFER_DISCOUNT = 0.1;

/** Costos de envío por método. */
export const SHIPPING_COSTS: Record<string, number> = {
  "andreani-domicilio": 5400,
  "andreani-sucursal": 3800,
  cadeteria: 2500,
  retiro: 0,
};

/** Datos de la marca. */
export const BRAND = {
  name: "Unilubi Kids",
  url: "https://unilubi.vercel.app",
  description: "Indumentaria infantil de diseño argentino. Materiales cuidados, cortes que duran y una colección que cambia cada temporada.",
  whatsapp: "+5491151982734",
  instagram: "https://instagram.com/unilubikids",
  showroomAddress: "Palermo, CABA · cita previa",
};
