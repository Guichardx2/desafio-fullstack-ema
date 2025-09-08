import { EventBackend } from "@/types";

export type AddNewEventProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  eventFormData: EventBackend | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeField: (field: keyof EventBackend, value: string) => void;
  onChangeDateField: (
    field: "startDate" | "endDate",
    dateTime: any
  ) => void;
};
