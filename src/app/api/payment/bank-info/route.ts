import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    bank: process.env.SHOP_BANK_NAME ?? "",
    cbu: process.env.SHOP_CBU ?? "",
    alias: process.env.SHOP_CBU_ALIAS ?? "",
    holder: process.env.SHOP_BANK_HOLDER ?? "",
  });
}
