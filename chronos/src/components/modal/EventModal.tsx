import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { EventModalProps } from "@/types/props/modal/EventModalProps";

const EventModal = (props: EventModalProps) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      size={props.size}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {props.title}
            </ModalHeader>
            <ModalBody>
              {props.children}
            </ModalBody>
            <ModalFooter>
              {props.footer ? (
                props.footer
              ) : (
                <>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Fechar
                  </Button>
                  <Button color="secondary" variant="shadow" type="submit" form={props.formId}>
                    Salvar
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
