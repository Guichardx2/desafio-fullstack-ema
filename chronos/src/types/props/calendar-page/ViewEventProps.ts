import { EventBackend } from "@/types/props/calendar-page/EventBackendProps";

export type ViewEventProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  event: EventBackend | null;
  onEdit: () => void;
  onDelete: () => void;
};
