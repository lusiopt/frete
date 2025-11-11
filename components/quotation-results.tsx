"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuotationResponse } from "@/types/shipsmart";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { Package, Clock, TrendingUp, Shield } from "lucide-react";
import Image from "next/image";

interface QuotationResultsProps {
  data: QuotationResponse;
}

export function QuotationResults({ data }: QuotationResultsProps) {
  if (!data.data.carriers || data.data.carriers.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <p className="text-center text-slate-600">
            Nenhuma transportadora disponível para esta rota.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar carriers por preço
  const sortedCarriers = [...data.data.carriers].sort(
    (a, b) =>
      parseFloat(a.currency_payment_amount) -
      parseFloat(b.currency_payment_amount)
  );

  const cheapest = sortedCarriers[0];
  const fastest = [...data.data.carriers].sort(
    (a, b) => a.transit_days - b.transit_days
  )[0];

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Resumo da Cotação</CardTitle>
          <CardDescription>
            {data.data.carriers.length} transportadora(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Mais Barato</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(cheapest.currency_payment_amount, data.data.currency_payment)}
              </p>
              <p className="text-sm text-slate-600">{cheapest.name}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Mais Rápido</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {fastest.transit_days} dias
              </p>
              <p className="text-sm text-slate-600">{fastest.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Transportadoras */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Todas as Opções
        </h3>

        {sortedCarriers.map((carrier, index) => (
          <Card
            key={carrier.code}
            className={`shadow-md hover:shadow-lg transition-shadow ${
              carrier.code === cheapest.code
                ? "border-2 border-green-500"
                : carrier.code === fastest.code
                ? "border-2 border-blue-500"
                : ""
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {carrier.url_image && (
                    <div className="relative w-24 h-12 bg-white rounded border p-2">
                      <Image
                        src={carrier.url_image}
                        alt={carrier.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      {carrier.name}
                    </h4>
                    {carrier.code === cheapest.code && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Mais Barato
                      </span>
                    )}
                    {carrier.code === fastest.code &&
                      carrier.code !== cheapest.code && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Mais Rápido
                        </span>
                      )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">
                    {formatCurrency(
                      carrier.currency_payment_amount,
                      data.data.currency_payment
                    )}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatCurrency(
                      carrier.currency_quote_amount,
                      data.data.currency_quote
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Prazo</p>
                    <p className="font-semibold">{carrier.transit_days} dias</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Peso</p>
                    <p className="font-semibold">
                      {formatWeight(carrier.weight_details.weight, data.data.measurement as "metric" | "imperial")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500">Frete</p>
                    <p className="font-semibold">
                      {formatCurrency(carrier.freight_final, data.data.currency_quote)}
                    </p>
                  </div>
                </div>

                {parseFloat(carrier.insurance_final) > 0 && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Seguro</p>
                      <p className="font-semibold">
                        {formatCurrency(carrier.insurance_final, data.data.currency_quote)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t text-sm text-slate-500">
                <p>
                  Válido até:{" "}
                  {new Date(carrier.valid_until).toLocaleString("pt-BR")}
                </p>
                <p className="text-xs mt-1">
                  Tipo de peso: {carrier.weight_details.type === "real" ? "Real" : "Cubado"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
