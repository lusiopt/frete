import { NextRequest, NextResponse } from "next/server";
import type { QuotationRequest, QuotationResponse } from "@/types/shipsmart";

export async function POST(request: NextRequest) {
  try {
    const body: QuotationRequest = await request.json();

    // DEBUG: Log do payload recebido do frontend
    console.log("🔍 [BACKEND] Payload recebido do frontend:");
    console.log(JSON.stringify(body, null, 2));

    const apiKey = process.env.SHIPSMART_API_KEY;
    const apiUrl = process.env.SHIPSMART_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        {
          status: "error",
          message: "Configuração da API não encontrada",
        },
        { status: 500 }
      );
    }

    // DEBUG: Log do payload que será enviado para ShipSmart
    console.log("📤 [BACKEND] Enviando para ShipSmart API:", `${apiUrl}/quotation`);
    console.log(JSON.stringify(body, null, 2));

    const response = await fetch(`${apiUrl}/quotation`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: QuotationResponse = await response.json();

    // DEBUG: Log da resposta da ShipSmart
    console.log("📥 [BACKEND] Resposta da ShipSmart API:");
    console.log("Status HTTP:", response.status);
    console.log("Response OK?", response.ok);
    console.log("Data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("❌ [BACKEND] Erro da ShipSmart API:");
      console.error("Status:", response.status);
      console.error("Message:", data.message);
      console.error("Data completo:", JSON.stringify(data, null, 2));

      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Erro ao realizar cotação",
          data: data.data || null,
        },
        { status: response.status }
      );
    }

    console.log("✅ [BACKEND] Sucesso! Retornando dados ao frontend");
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [BACKEND] Exceção capturada:", error);
    console.error("Tipo:", typeof error);
    console.error("Stack:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json(
      {
        status: "error",
        message: "Erro interno ao processar cotação",
      },
      { status: 500 }
    );
  }
}
