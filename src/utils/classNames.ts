/** Gabungkan nama kelas. Nilai kosong atau false diabaikan. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
