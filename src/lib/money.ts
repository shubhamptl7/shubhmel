// All sample figures are integer paise, so every total on the page is exact
// integer arithmetic and the illustration can never show a sum that does
// not add up. Formatting is the only place a decimal appears.

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPaise(paise: number): string {
  return inr.format(paise / 100);
}

export function formatSignedPaise(paise: number): string {
  if (paise < 0) return `−${formatPaise(-paise)}`;
  if (paise > 0) return `+${formatPaise(paise)}`;
  return formatPaise(0);
}

/** Percentage of an amount in paise, rounded half-up to the nearest paisa. */
export function percentOf(paise: number, percent: number): number {
  return Math.round((paise * percent) / 100);
}
