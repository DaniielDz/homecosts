
export function formatNumber(value: number, decimals: number): string {
    const rounded = Number(value.toFixed(decimals));
    const hasFraction = rounded % 1 !== 0;
    const options: Intl.NumberFormatOptions = hasFraction
      ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
      : { maximumFractionDigits: 0 };
    return new Intl.NumberFormat("en-US", options).format(rounded);
  }
  