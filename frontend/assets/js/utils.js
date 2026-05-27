export function money(value, { minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}) {
  if (value === null || value === undefined) return '0,00';
  return Number(value).toLocaleString('pt-BR', { minimumFractionDigits, maximumFractionDigits });
}

export function fmtDateIso(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleString('pt-BR');
  } catch {
    return String(value);
  }
}

export function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}
