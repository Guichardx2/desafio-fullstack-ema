import EventModal from "@/components/modal/EventModal";
import { AddNewEventProps } from "@/types/props/calendar/AddNewEventProps";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { DateInput } from "@heroui/date-input";
import { CalendarIcon } from "@heroicons/react/24/solid";
import parseISOToDateValue from "@/utils/parseISOToDateValue";

const AddNewEvent = ({
  isOpen,
  onOpenChange,
  onClose,
  eventFormData,
  onSubmit,
  onChangeField,
  onChangeDateField,
}: AddNewEventProps) => {
  return (
    <EventModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      formId="event-form"
      size="3xl"
      title={eventFormData?.title ? "Editar Evento" : "Adicionar Evento"}
    >
      <Form id="event-form" className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="Título"
          value={eventFormData?.title ?? ""}
          onChange={(e) => onChangeField("title", e.target.value)}
          errorMessage="Título é obrigatório"
          maxLength={100}
          required
        />
        <Input
          type="text"
          placeholder="Descrição"
          value={eventFormData?.description ?? ""}
          onChange={(e) => onChangeField("description", e.target.value)}
          errorMessage="Descrição é obrigatória"
          maxLength={500}
          required
        />
        <div className="flex w-full flex-1 gap-4">
          <DateInput
            label="Início do evento"
            labelPlacement="outside"
            granularity="minute"
            hourCycle={24}
            value={parseISOToDateValue(eventFormData?.startDate)}
            onChange={(e) => {
              onChangeDateField("startDate", e);
            }}
            endContent={<CalendarIcon className="size-6" />}
            errorMessage={(value) => {
              if (value.isInvalid) {
                return "Por favor, insira uma data válida.";
              }
            }}
            isRequired
          />
          <DateInput
            label="Fim do evento"
            labelPlacement="outside"
            granularity="minute"
            value={parseISOToDateValue(eventFormData?.endDate)}
            hourCycle={24}
            onChange={(e) => {
              onChangeDateField("endDate", e);
            }}
            endContent={<CalendarIcon className="size-6" />}
            errorMessage={(value) => {
              if (value.isInvalid) {
                return "Por favor, insira uma data válida.";
              }
            }}
            isRequired
          />
        </div>
        <Input
          type="text"
          placeholder="Local"
          value={eventFormData?.location ?? ""}
          onChange={(e) => onChangeField("location", e.target.value)}
          errorMessage="Local é obrigatório"
          maxLength={100}
          required
        />
      </Form>
    </EventModal>
  );
};

export default AddNewEvent;
