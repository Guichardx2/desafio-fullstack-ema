import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import Calendar from "@/components/calendar/Calendar";
import { useDisclosure } from "@heroui/modal";
import { EventBackend } from "@/types";
import { useFetch } from "@/hooks/useFetch";
import formatDateTimeToISO from "@/utils/formatDateTimeToISO";
import axiosService from "@/services/axiosService";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import AddNewEvent from "./components/AddNewEvent";
import ViewEvent from "./components/ViewEvent";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import InfoCard from "@/components/cards/InfoCard";
import {Spinner} from "@heroui/spinner";

export default function CalendarPage() {
  const { data: events } = useFetch<EventBackend[]>(
    `${import.meta.env.VITE_NEST_API_URL}/events/all`
  );
  const { webSocketEvents, connected } = useWebSocketContext();
  const currentEvents = webSocketEvents || events;

  const addDisclosure = useDisclosure();
  const viewDisclosure = useDisclosure();
  const [eventFormData, setEventFormData] = useState<EventBackend | null>(null);

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
          <Spinner />
        </InfoCard>
      </div>
    )
  }

  async function fetchEvent(id: number) {
    try {
      const eventDataResponse = await axiosService.get(
        `${import.meta.env.VITE_NEST_API_URL}/events/${id}`
      );
      const selected = { ...eventDataResponse.data, id } as EventBackend;
      setEventFormData(selected);
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
    }
  }

  const handleOpenAddModal = () => {
    setEventFormData(emptyEvent);
    addDisclosure.onOpen();
  };

  const handleEventClick = (arg: any) => {
  // Prefer backend id from groupId or extendedProps; fall back to parsing the id
  const backendIdStr = arg.event.groupId || arg.event.extendedProps?.backendId || arg.event.id;
  const id = Number(backendIdStr?.toString().replace(/-(start|end)$/i, ""));

  if (!Number.isFinite(id)) return;
  fetchEvent(id);
    viewDisclosure.onOpen();
  };

  //Handle changes
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

  const handleEventDateInputChange = (
    field: keyof Pick<EventBackend, "startDate" | "endDate">,
    dateTime: any
  ) => {
    const isoString = formatDateTimeToISO(dateTime);
    handleEventFormChange(field, isoString);
  };

  const handleEventFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventFormData) return;

    const payload: Omit<EventBackend, "id"> = {
      title: eventFormData.title,
      description: eventFormData.description,
      startDate: eventFormData.startDate,
      endDate: eventFormData.endDate,
      location: eventFormData.location,
    };

    try {
      if (eventFormData.id == null) {
        await axiosService.post(
          `${import.meta.env.VITE_NEST_API_URL}/events/create`,
          payload
        );
        addToast({
          title: "Evento",
          description: "O evento foi criado com sucesso.",
          color: "success",
        });
      } else {
        await axiosService.patch(
          `${import.meta.env.VITE_NEST_API_URL}/events/${eventFormData.id}`,
          payload
        );
        addToast({
          title: "Evento",
          description: "O evento foi atualizado com sucesso.",
          color: "success",
        });
      }
      addDisclosure.onClose();
      setEventFormData(emptyEvent);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      addToast({
        title: "Erro",
        description:
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: string }).message)
            : "Ocorreu um erro ao criar o evento.",
        color: "danger",
      });
    }
  };

  const handleEditFromView = () => {
    viewDisclosure.onClose();
    addDisclosure.onOpen();
  };

  const handleDeleteFromView = async () => {
    try {
      const id = eventFormData?.id;
      if (id == null) return;
      await axiosService.del(
        `${import.meta.env.VITE_NEST_API_URL}/events/${id}`
      );
      addToast({
        title: "Evento",
        description: "O evento foi excluído com sucesso.",
        color: "success",
      });
      viewDisclosure.onClose();
      setEventFormData(emptyEvent);
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      addToast({
        title: "Erro",
        description:
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: string }).message)
            : "Ocorreu um erro ao excluir o evento.",
        color: "danger",
      });
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
              className=""
            >
              Adicionar Evento
            </Button>
          </div>
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
