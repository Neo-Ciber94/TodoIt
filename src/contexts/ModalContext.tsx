import { createContext, forwardRef, useContext, useEffect } from "react";
import {
  CustomDialog,
  ModalTransitionProps,
} from "src/components/CustomDialog";
import { nanoid } from "nanoid";
import { SlideTransition } from "src/components/transitions";
import { Button, PaperProps } from "@mui/material";
import { useArray } from "src/hooks/useArray";
import { noop } from "@shared/utils";

// prettier-ignore
interface ActiveModal extends ModalProps{
  open: boolean;
  readonly id: string;
}

interface ModalRef {
  close: () => void;
}

export interface ModalProps {
  title: string;
  content?: string;
  Icon?: React.ComponentType<any>;
  Transition?: React.ComponentType<ModalTransitionProps>;
  PaperProps?: Partial<PaperProps>;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  destroyAfter?: number;
}

export type OpenModal = (props: ModalProps) => ModalRef;

export interface ModalContextProps {
  open: OpenModal;
}

const ModalContext = createContext<ModalContextProps>({} as ModalContextProps);

export const ModalProvider: React.FC<{}> = ({ children }) => {
  const modals = useArray<ActiveModal>();

  const openModal = ({
    closeOnConfirm = false,
    closeOnCancel = true,
    ...rest
  }: ModalProps) => {
    const newModal: ActiveModal = {
      id: nanoid(),
      open: true,
      closeOnConfirm,
      closeOnCancel,
      ...rest,
    };

    modals.push(newModal);

    return {
      close: () => onCloseModal(newModal),
    };
  };

  const onConfirmModal = (modal: ActiveModal) => {
    modal.onConfirm?.();

    if (modal.closeOnConfirm === true) {
      onCloseModal(modal);
    }
  };

  const onCancelModal = (modal: ActiveModal) => {
    modal.onCancel?.();

    if (modal.closeOnCancel === true) {
      onCloseModal(modal);
    }
  };

  const onCloseModal = (modal: ActiveModal) => {
    const index = modals.view.findIndex((m) => m.id === modal.id);
    if (index > -1) {
      modal.onClose?.();
      modals.set(index, (prev) => ({ ...prev, open: false }));
      setTimeout(() => modals.remove(index), modal.destroyAfter || 1000);
    }
  };

  return (
    <>
      <ModalContext.Provider value={{ open: openModal }}>
        {children}
      </ModalContext.Provider>
      {modals.view.map((modal) => (
        <ModalDialog
          key={modal.id}
          {...modal}
          onConfirm={() => onConfirmModal(modal)}
          onCancel={() => onCancelModal(modal)}
          onClose={() => onCloseModal(modal)}
        />
      ))}
    </>
  );
};

const ModalDialog = forwardRef<HTMLDivElement, ActiveModal>(
  function ModalDialog(props, ref) {
    const {
      id,
      open,
      title,
      content,
      Icon,
      Transition,
      PaperProps,
      onCancel,
      onClose,
      onConfirm,
      confirmText,
      cancelText,
    } = props;

    return (
      <CustomDialog
        ref={ref}
        key={id}
        handleClose={onClose || noop}
        open={open}
        title={title}
        Icon={Icon}
        Transition={SlideTransition}
        PaperProps={PaperProps}
      >
        {content}
        <div className="flex flex-row gap-2">
          <Button
            variant="text"
            sx={{
              marginLeft: "auto",
              color: "white",
              fontWeight: 500,
              width: 100,
            }}
            onClick={onConfirm}
          >
            {confirmText || "Confirm"}
          </Button>
          <Button
            variant="text"
            sx={{
              color: "red",
              fontWeight: 500,
              width: 100,
            }}
            onClick={onCancel}
          >
            {cancelText || "Cancel"}
          </Button>
        </div>
      </CustomDialog>
    );
  }
);

export function useModal() {
  return useContext(ModalContext);
}
