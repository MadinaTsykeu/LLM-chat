export type TFormatBytesOptions = {
  base?: 1000 | 1024;
  decimals?: number;
  integer?: boolean;
};

export function formatBytes(
  bytes: number | null | undefined,
  opts: TFormatBytesOptions = {}
): string {
  const { base = 1024, decimals = 1, integer = false } = opts;

  if (bytes == null) {
    return '';
  }

  if (!Number.isFinite(bytes)) {
    return '0 Б';
  }

  const safeBytes = Math.abs(bytes);

  if (safeBytes === 0) {
    return '0 Б';
  }

  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ'];
  const unitIndex = Math.min(units.length - 1, Math.floor(Math.log(safeBytes) / Math.log(base)));

  const value = safeBytes / Math.pow(base, unitIndex);

  const formatted = integer
    ? Math.round(value).toString()
    : value.toFixed(decimals).replace(/\.0+$|(\.\d*[1-9])0+$/, '$1');

  const sign = bytes < 0 ? '-' : '';

  return `${sign}${formatted} ${units[unitIndex]}`;
}
