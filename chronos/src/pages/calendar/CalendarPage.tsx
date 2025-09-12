//React and layout imports
import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

//Context and Type imports
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { EventBackend } from "@/types/props/calendar-page/EventBackendProps";

//Components imports
import Calendar from "@/components/calendar/Calendar";
import ViewEvent from "./components/ViewEvent";
import AddNewEvent from "./components/AddNewEvent";
import InfoCard from "@/components/cards/InfoCard";

//HeroUI imports
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import {Spinner} from "@heroui/spinner";

//Hooks imports
import { useFetch } from "@/hooks/useFetch";
import { useApiMutation } from "@/hooks/useApiMutation";

//Utils imports
import formatDateTimeToISO from "@/utils/formatDateTimeToISO";

type EventPayload = Omit<EventBackend, "id">;
export default function CalendarPage() {

  //Hooks to making automatic GETS and MUTATIONS like POST, PATCH and DELETE
  const { data: events } = useFetch<EventBackend[]>("/events/all");
  const { mutate: mutateEvent, remove: removeEvent, get: getEvent } = useApiMutation<EventBackend>("/events");

  const { webSocketEvents, connected } = useWebSocketContext();
  const currentEvents = webSocketEvents || events;

  //Hooks to control modals provided by HeroUI
  const addDisclosure = useDisclosure();
  const viewDisclosure = useDisclosure();

  //State to control the event being viewed or edited
  const [eventFormData, setEventFormData] = useState<EventBackend | null>(null);

  //Empty event template to reset the form
  const emptyEvent: EventBackend = {
    id: null,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  };

  if(!connected){
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <InfoCard 
        title="Conectando ao servidor..." 
        description="Aguarde enquanto tentamos conectar ao servidor de eventos em tempo real.">
          <Spinner color="secondary" />
        </InfoCard>
      </div>
    )
  }

  //Handle changes events
  const handleOpenAddModal = () => {
    setEventFormData(emptyEvent);
    addDisclosure.onOpen();
  };

  //Gets event ID from calendar and fetch the event data from backend for viewing details
  const handleEventClick = async (arg: any) => { // agora assíncrono para aguardar o get
  
    const backendIdStr =
      arg.event.groupId || arg.event.extendedProps?.backendId || arg.event.id;
    const id = Number(backendIdStr?.toString().replace(/-(start|end)$/i, "")); // Regex to remove '-start' or '-end' suffix if present

    if (!Number.isFinite(id)) return;

    try {
      const eventData = await getEvent(id);
      const selected = { ...eventData, id } as EventBackend;
      setEventFormData(selected);
      viewDisclosure.onOpen();
    } catch (error) {
      console.error("Falha ao buscar evento:", error);
    }
  };

  //Control form changes
  const handleEventFormChange = (field: keyof EventBackend, value: string) => {
    setEventFormData((prev) => {
      const eventData = prev ?? {
        id: 0,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
      };
      return {
        ...eventData,
        [field]: value,
      };
    });
  };

  //Control form date changes
  const handleEventDateInputChange = (
    field: keyof Pick<EventBackend, "startDate" | "endDate">,
    dateTime: any
  ) => {
    const isoString = formatDateTimeToISO(dateTime);
    handleEventFormChange(field, isoString);
  };

  //Submit and actions

  //Opens the edit modal or view modal from view modal 
  const handleEditFromView = () => {
    viewDisclosure.onClose();
    addDisclosure.onOpen();
  };

  //Handles form submission for creating or updating events using the mutation hook
  const handleEventFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventFormData) return;

    const payload: EventPayload = {
      title: eventFormData.title,
      description: eventFormData.description,
      startDate: eventFormData.startDate,
      endDate: eventFormData.endDate,
      location: eventFormData.location,
    };

    try {
      await mutateEvent(eventFormData.id, payload); // mutation hook to create or update the event
      addDisclosure.onClose();
      setEventFormData(emptyEvent);

    } catch (error) {

      console.error("Falha ao salvar o evento:", error);
    }
  };

  //Handles event deletion from view modal using the mutation hook
  const handleDeleteFromView = async () => {
    
    try {
      const id = eventFormData?.id;

      if (id == null) return;

      await removeEvent(id); // mutation hook to delete the event

      viewDisclosure.onClose();
      setEventFormData(emptyEvent);

    } catch (error) {
      console.error("Falha ao deletar o evento:", error)
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="w-full flex-1 min-h-0 flex flex-col">
          <div className="flex justify-end mb-4">
            <Button
              onPress={handleOpenAddModal}
              variant="flat"
              color="secondary"
              endContent={<CalendarDaysIcon className="size-6"/>}
            >
              Adicionar Evento
            </Button>
          </div>

          {/* Calendar component */}
            <div className="flex-1 min-h-0">
            <Calendar
              events={
              Array.isArray(currentEvents)
                ? currentEvents.flatMap((event) => [
                  {
                  id: `${event.id}-start`,
                  groupId: String(event.id),
                  title: `${event.title} (Início)`,
                  start: event.startDate,
                  allDay: false,
                  extendedProps: { backendId: event.id },
                  },
                  {
                  id: `${event.id}-end`,
                  groupId: String(event.id),
                  title: `${event.title} (Fim)`,
                  start: event.endDate,
                  allDay: false,
                  extendedProps: { backendId: event.id },
                  },
                ])
                : []
              }
              eventClick={handleEventClick}
            />
            </div>
        </div>

        {/* Render modals */}
        <AddNewEvent
          isOpen={addDisclosure.isOpen}
          onOpenChange={addDisclosure.onOpenChange}
          onClose={() => {
            addDisclosure.onClose();
            setEventFormData(emptyEvent);
          }}
          eventFormData={eventFormData}
          onSubmit={handleEventFormSubmit}
          onChangeField={handleEventFormChange}
          onChangeDateField={handleEventDateInputChange}
        />

        <ViewEvent
          isOpen={viewDisclosure.isOpen}
          onOpenChange={viewDisclosure.onOpenChange}
          onClose={() => {
            viewDisclosure.onClose();
            setEventFormData(emptyEvent);
          }}
          event={eventFormData}
          onEdit={handleEditFromView}
          onDelete={handleDeleteFromView}
        />
      </section>
    </DefaultLayout>
  );
}
