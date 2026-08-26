/** Convierte bytes a un texto legible (KB/MB) con un decimal. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/** Valida que un archivo no supere el tamaño máximo permitido, en MB. */
export function isWithinMaxSizeMb(file: File, maxSizeMb: number): boolean {
  return file.size <= maxSizeMb * 1024 * 1024;
}
