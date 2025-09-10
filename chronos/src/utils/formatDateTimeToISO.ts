import { getLocalTimeZone } from "@internationalized/date";

export default function formatDateTimeToISO(dateTime: any, timeZone = getLocalTimeZone()): string {
  if (!dateTime) return "";

  try {
    if (typeof dateTime.toDate === "function") {
      let jsDate: Date;
      try {
        jsDate = dateTime.toDate(timeZone);
      } catch {
        jsDate = dateTime.toDate();
      }
      return jsDate.toISOString();
    }

    const year = dateTime.year;
    const month = String(dateTime.month).padStart(2, "0");
    const day = String(dateTime.day).padStart(2, "0");
    const hour = String(dateTime.hour ?? 0).padStart(2, "0");
    const minute = String(dateTime.minute ?? 0).padStart(2, "0");
    const second = String(dateTime.second ?? 0).padStart(2, "0");

    const local = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    return local.toISOString();
  } catch {
    return "";
  }
}