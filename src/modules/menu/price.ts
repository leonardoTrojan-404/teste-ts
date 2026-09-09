const DEFAULT_LOCALE = 'pt-BR';
const DEFAULT_CURRENCY = 'BRL';

const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(locale: string, currency: string): Intl.NumberFormat {
  const key = `${locale}:${currency}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
    formatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Prices are stored in cents. Dividing by 100 and interpolating produced
 * "R$ 8.5" for an item priced at 850 and dropped the separator entirely for
 * four-digit amounts.
 */
export function formatPrice(
  priceCents: number,
  locale: string = DEFAULT_LOCALE,
  currency: string = DEFAULT_CURRENCY,
): string {
  return formatterFor(locale, currency).format(priceCents / 100);
}
