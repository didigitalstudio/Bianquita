export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: string;
  audience: string;
  price: number;
  compareAt: number | null;
  stock: Record<string, number>;
  colors: string[];
  description: string;
  materials: string;
  care: string;
  tags: string[];
  img: string;
  images?: string[];
  active?: boolean;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: "pendiente-pago" | "preparando" | "enviado" | "entregado" | "cancelado";
  items: number;
  total: number;
  payment: string;
  shipping: string;
  address: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  size: string;
  color: string;
  qty: number;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Audience {
  id: string;
  label: string;
  range: string;
}
