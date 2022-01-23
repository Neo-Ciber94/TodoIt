import {
  Backdrop,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Modal,
  SxProps,
} from "@mui/material";
import { forwardRef } from "react";

const modalStyle: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 3,
  overflow: "hidden",
  color: "white",
  boxShadow: 24,
  width: "90%",
};

export type ModalTransitionProps = React.PropsWithChildren<any> & {
  in: boolean;
};

export interface DarkModalProps {
  open: boolean;
  title: string;
  Icon?: React.ComponentType<any>;
  Transition?: React.ComponentType<ModalTransitionProps>;
  handleClose: () => void;
}

export const DarkModal = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<DarkModalProps>
>(function CustomModal(props, ref) {
  const { open, title, handleClose, Icon, Transition, children } = props;

  const Content = forwardRef<HTMLDivElement, {}>(function Content(props, ref) {
    return (
      <Box ref={ref} {...props} sx={modalStyle}>
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
          <Toolbar>
            {Icon && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="icon"
              >
                <Icon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            padding: 2,
            backgroundColor: "rgb(31, 31, 31)",
          }}
        >
          {children}
        </Box>
      </Box>
    );
  });

  return (
    <Modal
      ref={ref}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      {Transition ? (
        <Transition in={open}>
          <Content />
        </Transition>
      ) : (
        <Content />
      )}
    </Modal>
  );
});
