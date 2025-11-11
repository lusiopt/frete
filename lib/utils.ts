import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number, currency: string = "BRL"): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(numValue);
}

export function formatWeight(weight: string | number, unit: "metric" | "imperial" = "metric"): string {
  const numWeight = typeof weight === "string" ? parseFloat(weight) : weight;
  const unitLabel = unit === "metric" ? "kg" : "lb";

  return `${numWeight.toFixed(2)} ${unitLabel}`;
}

export function formatDimensions(
  height: number,
  width: number,
  depth: number,
  unit: "metric" | "imperial" = "metric"
): string {
  const unitLabel = unit === "metric" ? "cm" : "in";
  return `${height} × ${width} × ${depth} ${unitLabel}`;
}

export function calculateCubedWeight(
  height: number,
  width: number,
  depth: number,
  unit: "metric" | "imperial" = "metric"
): number {
  if (unit === "metric") {
    // Fórmula: (A × L × P) / 6000
    return (height * width * depth) / 6000;
  } else {
    // Fórmula imperial: (A × L × P) / 166
    return (height * width * depth) / 166;
  }
}
