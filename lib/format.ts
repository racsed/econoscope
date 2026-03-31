const frLocale = 'fr-FR';

/**
 * Formate un nombre avec le format francais (espace pour les milliers, virgule decimale).
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(frLocale, options).format(value);
}

/**
 * Formate un nombre en pourcentage.
 * Par defaut, affiche 1 decimale.
 */
export function formatPercent(
  value: number,
  decimals: number = 1,
): string {
  return new Intl.NumberFormat(frLocale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formate un nombre en euros.
 */
export function formatCurrency(
  value: number,
  decimals: number = 0,
): string {
  return new Intl.NumberFormat(frLocale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formate une variation avec signe +/- et retourne un objet
 * contenant le texte formate et la classe de couleur associee.
 */
export function formatChange(
  value: number,
  decimals: number = 1,
): { text: string; colorClass: string } {
  const sign = value > 0 ? '+' : '';
  const formatted = `${sign}${formatNumber(value, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

  let colorClass: string;
  if (value > 0) {
    colorClass = 'text-accent-green';
  } else if (value < 0) {
    colorClass = 'text-accent-red';
  } else {
    colorClass = 'text-text-secondary';
  }

  return { text: formatted, colorClass };
}
