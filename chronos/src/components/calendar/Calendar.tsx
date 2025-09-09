import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { CalendarProps } from "@/types/props/calendar-component/CalendarProps";

export default function Calendar(props: Readonly<CalendarProps>) {

  return (

    <FullCalendar
      eventClassNames={'cursor-pointer'}
      dayHeaderClassNames={'bg-purple-100 text-black dark:bg-purple-300 font-semibold'}
      moreLinkClassNames={'bg-purple-100 text-purple-700 rounded'}
      dayCellClassNames={'hover:bg-purple-50 dark:hover:bg-[#27272a] dark:bg-[#18181b] dark:text-white transition-colors'}
      plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
      initialView="dayGridMonth"
      locale="pt-br"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listMonth'
      }}
      eventColor="#4a2882"
      eventBorderColor="#5b21b6"
      eventDisplay="block"
      events={props.events}
      eventClick={props.eventClick}
      buttonText={{
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista'
      }}
      dayMaxEvents={true}
      height="100%"
      moreLinkContent={(args) => {
        return `+${args.num} eventos`;
      }}
      noEventsContent="Nenhum evento para mostrar..."
      handleWindowResize={true}
    />
  );
}
