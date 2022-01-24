import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Dialog,
} from "@mui/material";
import { forwardRef } from "react";

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

  return (
    <div>
      <Dialog
        ref={ref}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            width: "90%",
            color: "white",
            overflow: "hidden",
            borderRadius: 3,
            backgroundColor: "rgb(31, 31, 31)",
          },
        }}
      >
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
          }}
        >
          {children}
        </Box>
      </Dialog>
    </div>
  );
});
