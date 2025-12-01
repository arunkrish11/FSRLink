import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/src/lib/google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sheets = getSheetsClient();

    // Generate an order ID
    const orderId = "ORD-" + Date.now();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Orders!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            orderId,
            new Date().toISOString(),
            body.customerName,
            body.place,
            body.item,
            body.quantity,
            body.total
          ]
        ]
      }
    });

    return NextResponse.json({ success: true, id: orderId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
