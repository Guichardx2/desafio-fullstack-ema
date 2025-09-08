export default function formatISOToDisplay(
  isoString: string,
  locale = "pt-BR",
  timeZone?: string
): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString; // fallback if invalid

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(timeZone ? { timeZone } : {}),
  };

  return new Intl.DateTimeFormat(locale, options).format(d);
}
