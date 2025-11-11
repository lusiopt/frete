"use client";

import { useState } from "react";
import { QuotationForm } from "@/components/forms/quotation-form";
import { QuotationResults } from "@/components/quotation-results";
import type { QuotationResponse } from "@/types/shipsmart";

export default function Home() {
  const [results, setResults] = useState<QuotationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Simulador de Frete Internacional
          </h1>
          <p className="text-slate-600">
            Compare preços e prazos das principais transportadoras
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <QuotationForm
              onSubmit={setResults}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          <div>
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                </div>
                <p className="text-center mt-4 text-slate-600">
                  Buscando cotações...
                </p>
              </div>
            ) : results ? (
              <QuotationResults data={results} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center text-slate-500">
                  <svg
                    className="mx-auto h-24 w-24 text-slate-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <p className="text-lg">
                    Preencha o formulário para ver as cotações
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
