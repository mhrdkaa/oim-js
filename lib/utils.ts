import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(d);
}

export function getStatusPH(ph: number): { text: string; color: string } {
  if (ph >= 7.0 && ph <= 9.0) return { text: 'Normal', color: 'green' };
  if (ph > 9.0 && ph <= 10.0) return { text: 'Tinggi', color: 'yellow' };
  if (ph < 7.0 && ph >= 6.0) return { text: 'Rendah', color: 'yellow' };
  return { text: 'Bahaya', color: 'red' };
}

export function getStatusTDS(tds: number): { text: string; color: string } {
  if (tds >= 300 && tds <= 600) return { text: 'Normal', color: 'green' };
  if (tds > 600 && tds <= 800) return { text: 'Tinggi', color: 'yellow' };
  if (tds < 300 && tds >= 200) return { text: 'Rendah', color: 'yellow' };
  return { text: 'Bahaya', color: 'red' };
}

export function getStatusSuhu(suhu: number): { text: string; color: string } {
  if (suhu >= 25 && suhu <= 30) return { text: 'Normal', color: 'green' };
  if (suhu > 30 && suhu <= 35) return { text: 'Tinggi', color: 'yellow' };
  if (suhu < 25 && suhu >= 20) return { text: 'Rendah', color: 'yellow' };
  return { text: 'Bahaya', color: 'red' };
}
