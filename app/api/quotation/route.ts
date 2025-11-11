import { NextRequest, NextResponse } from "next/server";
import type { QuotationRequest, QuotationResponse } from "@/types/shipsmart";

export async function POST(request: NextRequest) {
  try {
    const body: QuotationRequest = await request.json();

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

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Erro ao realizar cotação",
          data: data.data || null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching quotation:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Erro interno ao processar cotação",
      },
      { status: 500 }
    );
  }
}
