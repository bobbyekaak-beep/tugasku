import { useEffect, useState } from 'react';

/** Baca JSON dari localStorage. Aplikasi tetap jalan bila penyimpanan tidak tersedia. */
export function loadJSON<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* abaikan: pakai nilai awal */
  }
  return fallback();
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* abaikan: data hanya bertahan selama halaman terbuka */
  }
}

/** useState yang otomatis tersimpan di localStorage. */
export function usePersistentState<T>(key: string, init: () => T) {
  const [value, setValue] = useState<T>(() => loadJSON(key, init));
  useEffect(() => {
    saveJSON(key, value);
  }, [key, value]);
  return [value, setValue] as const;
}
