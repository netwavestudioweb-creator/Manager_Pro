import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EXCHANGE_RATES: Record<string, number> = {
  fcfa: 1,
  eur: 1 / 655.957,
  usd: 1 / 600,
};

/**
 * Format a number converting it to the active currency from localStorage (for non-React contexts)
 * In React components, use usePreferences().formatMoney instead.
 */
export function formatCurrencyValue(amount: number): string {
  try {
    const currency = localStorage.getItem('fleet_currency') || 'fcfa';
    const rate = EXCHANGE_RATES[currency] || 1;
    const converted = amount * rate;
    
    if (currency === 'fcfa') {
      return new Intl.NumberFormat('fr-FR').format(Math.round(converted)) + ' FCFA';
    } else if (currency === 'eur') {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(converted);
    } else {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(converted);
    }
  } catch(e) {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
  }
}

/**
 * Format a number with French locale (spaces as thousands separators)
 * @param value - The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

/**
 * Format a date in French locale
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Format a short date in French locale
 * @param date - Date string or Date object
 * @returns Formatted short date string
 */
export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}
