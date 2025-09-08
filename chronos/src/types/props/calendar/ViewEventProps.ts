import { EventBackend } from "@/types";

export type ViewEventProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  event: EventBackend | null;
  onEdit: () => void;
  onDelete: () => void;
};
