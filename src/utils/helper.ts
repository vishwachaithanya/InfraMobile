export function formatCurrency(amount: number, currency = "₹"): string {
  return `${currency}${amount?.toFixed(2) || 0}`;
}

export function formatDate(isoString: string, short = false): string {
  const date = new Date(isoString);
  if (short) {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function generateMeterNumber(): string {
  return `METER-${Date.now().toString().slice(-8)}`;
}
