import { CalendarDateTime } from "@internationalized/date";

export default function parseISOToDateValue(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  return new CalendarDateTime(year, month, day, hour, minute, second);
}
