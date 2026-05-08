import { listProductsForAdmin } from "@/lib/data/products";
import { listOrdersForAdmin } from "@/lib/data/orders";
import { listCategories, listAudiences } from "@/lib/data/catalog";
import AdminClient, { type AdminOrder } from "./AdminClient";

export default async function AdminPage() {
  const [products, orderRows, categories, audiences] = await Promise.all([
    listProductsForAdmin(),
    listOrdersForAdmin(),
    listCategories(),
    listAudiences(),
  ]);

  const orders: AdminOrder[] = orderRows.map((o) => {
    const addrObj = (o.shipping_address && typeof o.shipping_address === "object")
      ? (o.shipping_address as Record<string, unknown>)
      : {};
    const itemsArr = Array.isArray(o.items) ? o.items : [];
    return {
      id: o.id,
      number: o.order_number,
      customer: o.customer_name,
      email: o.customer_email,
      date: o.created_at.slice(0, 10),
      status: o.status,
      items: itemsArr.length,
      total: o.total,
      payment: o.payment_method,
      shipping: o.shipping_method,
      address: typeof addrObj.address === "string" ? (addrObj.address as string) : "",
    };
  });

  return (
    <AdminClient
      initialProducts={products}
      initialOrders={orders}
      categories={categories}
      audiences={audiences}
    />
  );
}
