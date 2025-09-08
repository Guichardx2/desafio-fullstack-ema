import { CalendarDateTime } from "@internationalized/date";

// Converte uma string ISO (ex: 2025-09-30T13:00:00.000Z)
// para um CalendarDateTime no HORÁRIO LOCAL equivalente, para controlar o DateInput
// sem aplicar o deslocamento de fuso (+/-). Assim, 13:00Z em GMT-3 vira 10:00 local.
export default function parseISOToDateValue(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;

  // Pegamos os componentes no horário LOCAL, para manter o clock que o usuário espera ver.
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 0-based -> 1-based
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  return new CalendarDateTime(year, month, day, hour, minute, second);
}
