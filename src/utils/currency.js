/** Maps ISO currency codes to their display symbols */
const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  KRW: '₩',
  AUD: 'A$',
  CAD: 'C$',
};

/** Maps ISO currency codes to locale strings for Intl.NumberFormat */
const CURRENCY_LOCALES = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  KRW: 'ko-KR',
  AUD: 'en-AU',
  CAD: 'en-CA',
};

/**
 * Returns the currency symbol for a given ISO currency code.
 * Falls back to the code itself if the symbol is unknown.
 * @param {string} code - ISO 4217 currency code (e.g. 'INR', 'USD')
 * @returns {string}
 */
export function getCurrencySymbol(code) {
  return CURRENCY_SYMBOLS[code] ?? code;
}

/**
 * Formats a numeric amount with locale-aware grouping and the currency symbol.
 * Uses Intl.NumberFormat for proper comma/decimal formatting per currency.
 * E.g. formatCurrency(1250, 'INR') → '₹1,250.00', formatCurrency(1250, 'JPY') → '¥1,250'
 * @param {number} amount
 * @param {string} currencyCode
 * @returns {string}
 */
export function formatCurrency(amount, currencyCode = 'INR') {
  const locale = CURRENCY_LOCALES[currencyCode] || 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: ['JPY', 'KRW'].includes(currencyCode) ? 0 : 2,
      maximumFractionDigits: ['JPY', 'KRW'].includes(currencyCode) ? 0 : 2,
    }).format(Number(amount));
  } catch {
    // Fallback if Intl doesn't support the currency
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${Number(amount).toFixed(2)}`;
  }
}

/** Full currency list for dropdowns */
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩', name: 'Korean Won' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

/** 
 * Basic exchange rates (Base: USD)
 * In a production app, these would come from an API 
 */
const EXCHANGE_RATES = {
  USD: 1,
  INR: 83.12,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.34,
  KRW: 1345.50,
  AUD: 1.53,
  CAD: 1.36,
};

/**
 * Converts an amount from one currency to another using fixed exchange rates.
 * @param {number} amount
 * @param {string} fromCurrency
 * @param {string} toCurrency
 * @returns {number}
 */
export function convertCurrency(amount, fromCurrency, toCurrency) {
  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
    return Number(amount);
  }

  const rateFrom = EXCHANGE_RATES[fromCurrency];
  const rateTo = EXCHANGE_RATES[toCurrency];

  if (!rateFrom || !rateTo) {
    return Number(amount);
  }

  // Convert to USD first, then to target currency
  const amountInUSD = amount / rateFrom;
  return amountInUSD * rateTo;
}
