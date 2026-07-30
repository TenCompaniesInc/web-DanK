// src/lib/pdf.js
// Generates branded PDF receipts and quotations for DAN K Cheap Stores Ltd.
// Uses pdf-lib (pure JS, works in Next.js API routes — no browser, no font files).
// Each function returns a base64 string ready for Resend's attachments array.

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const GREEN = rgb(0.102, 0.239, 0.169);
const GOLD = rgb(0.784, 0.588, 0.118);
const DARK = rgb(0.051, 0.141, 0.094);
const GREYTEXT = rgb(0.29, 0.29, 0.29);
const LIGHTGREY = rgb(0.6, 0.6, 0.6);
const WHITE = rgb(1, 1, 1);
const ROWBG = rgb(0.955, 0.973, 0.961);

const UGX = (n) => "UGX " + Number(n || 0).toLocaleString();

async function baseDoc() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  return { pdf, page, font, bold };
}

function drawHeader(page, bold, font, subtitle) {
  const { width } = page.getSize();
  page.drawRectangle({ x: 0, y: 762, width, height: 80, color: DARK });
  page.drawText("ORIGIN OF QUALITY", { x: 40, y: 812, size: 8, font: bold, color: GOLD, characterSpacing: 2 });
  page.drawText("DAN K", { x: 40, y: 788, size: 22, font: bold, color: WHITE });
  page.drawText("CHEAP STORES LTD", { x: 118, y: 792, size: 9, font, color: rgb(0.8, 0.85, 0.82) });
  const tagW = bold.widthOfTextAtSize(subtitle, 10);
  page.drawText(subtitle, { x: width - 40 - tagW, y: 796, size: 10, font: bold, color: GOLD });
}

function drawFooter(page, font, bold) {
  const { width } = page.getSize();
  page.drawLine({ start: { x: 40, y: 70 }, end: { x: width - 40, y: 70 }, thickness: 1, color: rgb(0.85, 0.9, 0.87) });
  page.drawText("DAN K CHEAP STORES LTD  -  Covenant Building, Kisenyi Road, Kampala", { x: 40, y: 54, size: 8, font, color: LIGHTGREY });
  page.drawText("Phone / WhatsApp: 0731 496 117   -   dankcheapstoresltd@gmail.com   -   Open Sun-Fri, 7am-7:30pm", { x: 40, y: 42, size: 8, font, color: LIGHTGREY });
  page.drawText("Thank you for choosing DAN K Cheap Stores.", { x: 40, y: 28, size: 8, font: bold, color: GREEN });
}

export async function generateReceiptPDF(data) {
  const { customerName, orderId, items = [], total, network, momoNumber, delivery, address } = data;
  const { pdf, page, font, bold } = await baseDoc();
  const { width } = page.getSize();

  drawHeader(page, bold, font, "ORDER RECEIPT");

  let y = 720;
  page.drawText("Order Confirmed", { x: 40, y, size: 9, font: bold, color: GOLD, characterSpacing: 1 });
  y -= 22;
  page.drawText(`Thank you, ${customerName || "Customer"}!`, { x: 40, y, size: 18, font: bold, color: rgb(0.08, 0.08, 0.08) });
  y -= 16;
  page.drawText("Your payment has been received. Here is your order receipt.", { x: 40, y, size: 10, font, color: GREYTEXT });

  y -= 34;
  page.drawRectangle({ x: 40, y: y - 6, width: width - 80, height: 30, color: GREEN });
  page.drawText("ORDER REFERENCE", { x: 52, y: y + 10, size: 8, font, color: rgb(0.8, 0.85, 0.82) });
  const ref = (orderId || "").slice(-8).toUpperCase() || "N/A";
  const refW = bold.widthOfTextAtSize(ref, 13);
  page.drawText(ref, { x: width - 52 - refW, y: y + 6, size: 13, font: bold, color: WHITE });

  y -= 44;
  page.drawText("ORDER DETAILS", { x: 40, y, size: 9, font: bold, color: LIGHTGREY, characterSpacing: 1 });
  y -= 20;
  page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 22, color: rgb(0.918, 0.949, 0.929) });
  page.drawText("Item", { x: 50, y: y + 2, size: 9, font: bold, color: GREYTEXT });
  page.drawText("Qty", { x: 360, y: y + 2, size: 9, font: bold, color: GREYTEXT });
  page.drawText("Amount", { x: width - 110, y: y + 2, size: 9, font: bold, color: GREYTEXT });

  y -= 24;
  items.forEach((item, i) => {
    if (i % 2 === 0) {
      page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 20, color: ROWBG });
    }
    const name = `${item.name || ""}${item.weight ? " (" + item.weight + ")" : ""}`;
    page.drawText(name.slice(0, 48), { x: 50, y: y + 1, size: 9, font, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(String(item.qty || 1), { x: 364, y: y + 1, size: 9, font, color: rgb(0.1, 0.1, 0.1) });
    const amt = UGX((item.price || 0) * (item.qty || 1));
    const amtW = font.widthOfTextAtSize(amt, 9);
    page.drawText(amt, { x: width - 50 - amtW, y: y + 1, size: 9, font: bold, color: GREEN });
    y -= 20;
  });

  y -= 6;
  page.drawLine({ start: { x: 40, y: y + 10 }, end: { x: width - 40, y: y + 10 }, thickness: 1, color: rgb(0.85, 0.9, 0.87) });
  y -= 6;
  page.drawText("TOTAL", { x: 50, y: y - 4, size: 12, font: bold, color: rgb(0.08, 0.08, 0.08) });
  const totalStr = UGX(total);
  const totalW = bold.widthOfTextAtSize(totalStr, 15);
  page.drawText(totalStr, { x: width - 50 - totalW, y: y - 6, size: 15, font: bold, color: GREEN });

  y -= 44;
  page.drawText("PAYMENT", { x: 40, y, size: 8, font: bold, color: LIGHTGREY });
  page.drawText(String(network || "-").toUpperCase() + (momoNumber ? "  -  " + momoNumber : ""), { x: 40, y: y - 14, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("DELIVERY", { x: 320, y, size: 8, font: bold, color: LIGHTGREY });
  const delText = delivery === "collect" ? "Store Pickup" : "Delivery";
  page.drawText(delText + (address ? "  -  " + address : ""), { x: 320, y: y - 14, size: 10, font, color: rgb(0.1, 0.1, 0.1) });

  drawFooter(page, font, bold);

  const bytes = await pdf.save();
  return Buffer.from(bytes).toString("base64");
}

export async function generateQuotationPDF(data) {
  const { toName, toPhone, quotationText, referenceTotal } = data;
  const { pdf, page, font, bold } = await baseDoc();
  const { width } = page.getSize();

  drawHeader(page, bold, font, "QUOTATION");

  let y = 720;
  page.drawText("Your Quotation", { x: 40, y, size: 9, font: bold, color: GOLD, characterSpacing: 1 });
  y -= 22;
  page.drawText(`Hello, ${toName || "Customer"}!`, { x: 40, y, size: 18, font: bold, color: rgb(0.08, 0.08, 0.08) });
  y -= 16;
  page.drawText("Please find your quotation from DAN K Cheap Stores Ltd below.", { x: 40, y, size: 10, font, color: GREYTEXT });

  if (toPhone) {
    y -= 16;
    page.drawText(`Contact on file: ${toPhone}`, { x: 40, y, size: 9, font, color: LIGHTGREY });
  }

  y -= 30;
  page.drawText("QUOTATION DETAILS", { x: 40, y, size: 9, font: bold, color: LIGHTGREY, characterSpacing: 1 });
  y -= 20;

  const maxWidth = width - 100;
  const words = String(quotationText || "").replace(/\r/g, "").split(/\n/);
  const lineHeight = 15;
  page.drawRectangle({ x: 40, y: y + 12, width: width - 80, height: 2, color: GOLD });
  y -= 6;

  for (const paragraph of words) {
    if (paragraph.trim() === "") { y -= lineHeight; continue; }
    let line = "";
    const tokens = paragraph.split(" ");
    for (const token of tokens) {
      const test = line ? line + " " + token : token;
      if (font.widthOfTextAtSize(test, 11) > maxWidth) {
        page.drawText(line, { x: 50, y, size: 11, font, color: rgb(0.15, 0.15, 0.15) });
        y -= lineHeight;
        line = token;
      } else {
        line = test;
      }
    }
    if (line) {
      page.drawText(line, { x: 50, y, size: 11, font, color: rgb(0.15, 0.15, 0.15) });
      y -= lineHeight;
    }
  }

  if (referenceTotal && referenceTotal > 0) {
    y -= 14;
    page.drawRectangle({ x: 40, y: y - 8, width: width - 80, height: 32, color: GREEN });
    page.drawText("ESTIMATED TOTAL", { x: 52, y: y + 8, size: 9, font, color: rgb(0.8, 0.85, 0.82) });
    const t = UGX(referenceTotal);
    const tW = bold.widthOfTextAtSize(t, 15);
    page.drawText(t, { x: width - 52 - tW, y: y + 4, size: 15, font: bold, color: WHITE });
  }

  y -= 40;
  page.drawText("This quotation is subject to stock availability and may be revised. Please contact us to confirm your order.", { x: 40, y, size: 8, font, color: LIGHTGREY });

  drawFooter(page, font, bold);

  const bytes = await pdf.save();
  return Buffer.from(bytes).toString("base64");
}
