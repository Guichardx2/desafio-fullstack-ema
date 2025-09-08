import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { CalendarProps } from "@/types/props/calendar/CalendarProps";

export default function Calendar(props: Readonly<CalendarProps>) {

  return (

    <FullCalendar
      eventClassNames={'cursor-pointer'}
      plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
      initialView="dayGridMonth"
      locale="pt-br"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listMonth'
      }}
      eventColor="#532b85"
      buttonText={{
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista'
      }}
      events={props.events}
      eventClick={props.eventClick}
      dayMaxEvents={true}
      height="100%"
      moreLinkContent={(args) => {
        return `+${args.num} eventos`;
      }}
      noEventsContent="Nenhum evento para mostrar..."
    />
  );
}
