export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatUSD(n: number, decimals = 2): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatNaira(n: number, decimals = 2): string {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatCoinPrice(price: number): string {
  if (price >= 100) return formatNumber(price, 2);
  if (price >= 1)   return formatNumber(price, 3);
  return formatNumber(price, 4);
}

export function getNextPaymentDate(startDate: string, days: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
