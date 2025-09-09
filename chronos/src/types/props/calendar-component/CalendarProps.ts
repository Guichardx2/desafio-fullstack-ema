interface EventCalendar {
  id: string;
  title: string;
  start: string;
  end?: string;
}

export type CalendarProps = {
  events?: EventCalendar[];
  eventClick?: (arg: any) => void;
};