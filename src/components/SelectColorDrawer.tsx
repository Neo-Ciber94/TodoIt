import CircleIcon from "@mui/icons-material/Circle";
import { IconButton, Drawer } from "@mui/material";

export interface SelectColorDrawerProps {
  open: boolean;
  colors: string[];
  onClose?: () => void;
  onColorSelected: (color: string) => void;
}

export function SelectColorDrawer(props: SelectColorDrawerProps) {
  const { open, colors, onClose, onColorSelected } = props;

  return (
    <Drawer
      PaperProps={{
        className: "bg-gray-800",
      }}
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-row justify-center items-center p-8 h-full w-full">
        {colors.map((color) => (
          <IconButton
            key={color}
            onClick={() => {
              onColorSelected(color);
              if (onClose) {
                onClose();
              }
            }}
          >
            <CircleIcon
              sx={{
                color,
                fontSize: [30, 40, 50, 60, 70],
              }}
            />
          </IconButton>
        ))}
      </div>
    </Drawer>
  );
}
