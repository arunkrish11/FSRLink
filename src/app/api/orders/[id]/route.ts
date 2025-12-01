import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/src/lib/google";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params; // await the Promise

    const sheets = getSheetsClient();

    // Fetch all orders
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Orders!A1:G1000",
    });

    const rows = result.data.values || [];
    const header = rows[0];
    const dataRows = rows.slice(1);

    const order = dataRows.find((row) => row[0] === orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const [id, timestamp, customerName, place, item, quantity, total] = order;

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 600]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

// Header rectangle (like a company banner)
page.drawRectangle({
  x: 0,
  y: 560,
  width: 500,
  height: 50,
  color: rgb(0.1, 0.4, 0.8),
});

// Header text
page.drawText("Order Receipt", {
  x: 180,
  y: 575,
  size: 22,
  font: helveticaBold,
  color: rgb(1, 1, 1),
});

// Order info section
page.drawText("Order ID:", { x: 50, y: 520, size: 14, font: helveticaBold });
page.drawText(`${id}`, { x: 150, y: 520, size: 14, font: helvetica });

page.drawText("Date:", { x: 50, y: 500, size: 14, font: helveticaBold });
page.drawText(`${timestamp}`, { x: 150, y: 500, size: 14, font: helvetica });

page.drawText("Customer Name:", { x: 50, y: 480, size: 14, font: helveticaBold });
page.drawText(`${customerName}`, { x: 180, y: 480, size: 14, font: helvetica });

page.drawText("Place:", { x: 50, y: 460, size: 14, font: helveticaBold });
page.drawText(`${place}`, { x: 150, y: 460, size: 14, font: helvetica });

// Table header for items
page.drawRectangle({
  x: 50,
  y: 410,
  width: 400,
  height: 40,
  color: rgb(0.9, 0.9, 0.9),
});
page.drawText("Item", { x: 60, y: 425, size: 14, font: helveticaBold });
page.drawText("Quantity", { x: 250, y: 425, size: 14, font: helveticaBold });
page.drawText("Total", { x: 380, y: 425, size: 14, font: helveticaBold });

// Table row
page.drawText(`${item}`, { x: 60, y: 400, size: 14, font: helvetica });
page.drawText(`${quantity}`, { x: 250, y: 400, size: 14, font: helvetica });
page.drawText(`${total}`, { x: 380, y: 400, size: 14, font: helvetica });

// Footer line
page.drawLine({
  start: { x: 50, y: 380 },
  end: { x: 450, y: 380 },
  thickness: 1,
  color: rgb(0, 0, 0),
});

page.drawText("Thank you for your order!", { x: 150, y: 360, size: 12, font: helvetica, color: rgb(0.2, 0.2, 0.2) });

    const pdfBytes = await pdfDoc.save();

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

