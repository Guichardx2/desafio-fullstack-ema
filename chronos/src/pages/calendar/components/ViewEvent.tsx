import EventModal from "@/components/modal/EventModal";
import { ViewEventProps } from "@/types/props/calendar-page/ViewEventProps";
import { Button } from "@heroui/button";
import formatISOToDisplay from "@/utils/formatISOToDisplay";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const ViewEvent = ({
  isOpen,
  onOpenChange,
  onClose,
  event,
  onEdit,
  onDelete,
}: ViewEventProps) => {
  return (
    <EventModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      size="lg"
      title={event?.title ?? "Evento"}
      footer={
        <div className="flex w-full justify-between">
          <Button color="danger" variant="light" onPress={onDelete} endContent={<TrashIcon className="size-4" />}>
            Excluir
          </Button>
          <div className="flex gap-2">
            <Button variant="light" onPress={onClose}>
              Fechar
            </Button>
            <Button color="secondary" variant="flat" onPress={onEdit} endContent={<PencilIcon className="size-4" />} isIconOnly/>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm text-foreground-500">Descrição</p>
          <p className="text-base">{event?.description || "—"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground-500">Início</p>
            <p className="text-base">
              {event?.startDate ? formatISOToDisplay(event.startDate) : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground-500">Fim</p>
            <p className="text-base">
              {event?.endDate ? formatISOToDisplay(event.endDate) : "—"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-foreground-500">Local</p>
          <p className="text-base">{event?.location || "—"}</p>
        </div>
      </div>
    </EventModal>
  );
};

export default ViewEvent;