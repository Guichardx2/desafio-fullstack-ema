import { CalendarDateTime, parseDateTime } from "@internationalized/date";

// Converte uma string ISO (ex: 2025-09-30T13:00:00.000Z)
// para um DateValue compatível com o DateInput do HeroUI (CalendarDateTime).
// Mantém o horário representado (em UTC) mapeado para a zona local,
// para exibir/editar corretamente no componente.
export default function parseISOToDateValue(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;

  // Usamos parseDateTime para criar um CalendarDateTime "naive" e depois aplicamos zona local
  const isoTrim = iso.replace("Z", ""); // remove Z para parseDateTime
  try {
    const cdt = parseDateTime(isoTrim); // yyyy-MM-ddTHH:mm:ss.SSS
    // Alternativa: retornar diretamente cdt. Muitos componentes aceitam CalendarDateTime sem zona.
    return cdt as CalendarDateTime;
  } catch {
    // Fallback manual
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const hour = d.getUTCHours();
    const minute = d.getUTCMinutes();
    const second = d.getUTCSeconds();
    return new CalendarDateTime(year, month, day, hour, minute, second);
  }
}
