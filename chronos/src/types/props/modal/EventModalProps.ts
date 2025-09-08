export type EventModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  onPress?: (e: React.FormEvent<HTMLFormElement>) => void;
  formId?: string;
  title: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  footer?: React.ReactNode;
};